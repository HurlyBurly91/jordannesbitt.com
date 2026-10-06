import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { chromium } from "playwright";
import { persistentPilotRoot } from "./lib/pilot-snapshot.mjs";
import { loadSnapshot, sourcePreservation } from "./lib/real-pilot.mjs";
import { startStudio } from "./lib/studio-server.mjs";
import { auditAccessibility, prepareScreenshot, captureFullPage } from "./lib/browser-quality.mjs";

const base=persistentPilotRoot();
const {snapshot,directory}=await loadSnapshot(resolve(base,"snapshots/run-2026-10-06T00-12-39-275Z-bd2ed33a/snapshot.json"));
assert.equal(snapshot.snapshotSha256,"60d841eaabd3a7e1ced4560c047c863fcba111f8b89ccc4f7f0d664cd66b8a2c");
const entry=snapshot.included.find((image)=>image.id==="w-0001");assert.equal(entry.image.hasIcc,false);
const registry=await readFile(resolve(base,"id-registry.json")),ownerState=await readFile(resolve(base,"studio/state.json"));
const runId=`intake-demo-${new Date().toISOString().replace(/[:.]/g,"-")}-${randomUUID().slice(0,8)}`;
const output=resolve(base,"studio/demonstrations",runId),workspace=resolve(output,"workspace");
await mkdir(resolve(output,"screenshots"),{recursive:true,mode:0o700});await mkdir(workspace,{recursive:true,mode:0o700});await writeFile(resolve(workspace,"id-registry.json"),registry,{mode:0o600,flag:"wx"});
let service=await startStudio({dataRoot:workspace,allowPublicExport:false});
const browser=await chromium.launch(),context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:"reduce"});
await context.route("**/*",(route)=>new URL(route.request().url()).hostname==="127.0.0.1"?route.continue():route.abort());
let page=await context.newPage();const sequence=[],label="Intake UX demonstration (title not supplied)";
async function capture(step,description){
  await prepareScreenshot(page);const accessibility=await auditAccessibility(page,{developerInjection:true}),reflow=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);
  const viewport=`screenshots/${step}-viewport.png`,full=`screenshots/${step}-full.png`;await page.screenshot({path:resolve(output,viewport)});await captureFullPage(page,resolve(output,full));sequence.push({step,description,viewport,full,accessibility,reflow});
}
try{
  await page.goto(service.origin);await page.getByText(/Studio ready\./).waitFor();
  await page.getByRole("button",{name:"Add images",exact:true}).click();await page.locator("#files").setInputFiles(resolve(directory,entry.snapshotRelativeFile));
  await capture("01-select-image","Select the authorised untagged image and New artwork.");
  await page.getByRole("button",{name:"Create draft",exact:true}).click();await page.getByText("This image has no embedded colour profile.",{exact:true}).waitFor();
  assert.equal(service.studio.state().catalogue.artworks.length,0);assert.equal(service.studio.state().jobs.length,0);assert.equal(await page.locator("#artwork-form").isVisible(),false);
  await capture("02-explicit-colour-choice","Use sRGB for this image or Choose another image; no draft or failed job exists yet.");
  await page.getByRole("button",{name:"Use sRGB for this image",exact:true}).click();
  await page.waitForFunction(()=>document.activeElement?.getAttribute("name")==="title"&&document.querySelector("#artwork-form").getBoundingClientRect().top<50,undefined,{timeout:180000});
  assert.equal(await page.getByRole("button",{name:"Save draft",exact:true}).first().isEnabled(),true);
  await capture("03-ready-editor","Complete editor opens in the current viewport with Title focused and Save/Preview ready.");
  await page.getByLabel("Title",{exact:true}).fill(label);await page.getByLabel("Medium",{exact:true}).selectOption("painting");await page.getByLabel("Alt text",{exact:true}).fill("Private intake workflow demonstration; actual title/authorship/rights unconfirmed");
  await capture("04-edit-common-fields","Edit Title, Medium and Alt text without Advanced or optional facts.");
  await page.getByRole("button",{name:"Save draft",exact:true}).first().click();await page.getByText(/Draft saved\./).waitFor();
  await capture("05-save-draft","Save private draft without dimensions,price,edition,rights or public-source approval.");
  const job=service.studio.state().jobs.at(-1),manifest=JSON.parse(await readFile(resolve(service.studio.root,"derivatives",job.result.mediaId,"manifest.json")));assert.equal(job.status,"complete");assert.equal(manifest.settings.profile,"explicit-srgb-assumption");
  await page.close();await service.stop();service=await startStudio({dataRoot:workspace,allowPublicExport:false});page=await context.newPage();
  await page.goto(service.origin);await page.getByText(/Studio ready\./).waitFor();await page.getByRole("button",{name:`Open ${label}`,exact:true}).click();
  assert.equal(await page.getByLabel("Title",{exact:true}).inputValue(),label);assert.equal(await page.getByLabel("Medium",{exact:true}).inputValue(),"painting");assert.match(await page.getByLabel("Alt text",{exact:true}).inputValue(),/Private intake workflow demonstration/);assert.doesNotMatch(await page.locator("body").innerText(),/--assume-srgb|Missing ICC profile/);
  await capture("06-restart-reopen-persisted","Actual server restarted; Title,Medium,Alt text and explicit per-image pipeline profile persist.");
  const state=service.studio.state();assert.equal(state.catalogue.artworks.length,1);assert.equal(state.catalogue.artworks[0].published,false);assert.equal(state.catalogue.artworks[0].kind,"unclassified");assert.ok(!state.workflow[state.catalogue.artworks[0].id].approved);
  assert.deepEqual(await readFile(resolve(base,"id-registry.json")),registry);assert.deepEqual(await readFile(resolve(base,"studio/state.json")),ownerState);const preservation=await sourcePreservation(snapshot);assert.equal(preservation.unchanged,169);
  const report={request:"M09-R8",runId,output,workspace,studioRoot:service.studio.root,snapshotSha256:snapshot.snapshotSha256,pipelineProfile:manifest.settings.profile,ownerStateRegistryPreserved:true,sourcePreservation:preservation,restartPersisted:true,sequence,screenshots:sequence.length*2,violations:sequence.flatMap((step)=>step.accessibility.violations).length,incomplete:sequence.flatMap((step)=>step.accessibility.incomplete),reflowFailures:sequence.filter((step)=>!step.reflow).length,publicSourceApproval:false,repositoryWritesEnabled:false,milestoneComplete:false};
  await writeFile(resolve(output,"report.json"),JSON.stringify(report,null,2)+"\n",{mode:0o600});
  await writeFile(resolve(output,"README.md"),`# Studio explicit-colour intake sequence\n\nActual authorised untagged corpus image;isolated persistent workspace ${workspace}. Owner state/registry unchanged;169sources preserved. Temporary title/medium/alt labels are interface demonstration,not owner artistic/rights/public-source approval.\n\n${sequence.map((step)=>`- ${step.step}: ${step.description} (${step.viewport})`).join("\n")}\n\n${report.screenshots} screenshot files;observedaxeviolations ${report.violations},incomplete ${report.incomplete.length},reflow ${report.reflowFailures}. Actual server restarted/reopened and edits persisted. Existing conversion pipeline unchanged;explicit image-scoped sRGB choice recorded in private manifest.\n\nOwner tool/Node22 from checkout: npm run studio. Demo: JORDANNESBITT_M09_DATA=${workspace} npm run studio. All private outputs persist under M09root. No actual repositorywrite/commit/deploy/launchapproval/M09complete.\n`,{mode:0o600});
  await writeFile(resolve(base,"studio/latest-demonstration.json"),JSON.stringify({output,runId,report:resolve(output,"report.json")},null,2)+"\n",{mode:0o600});
  console.log(JSON.stringify({output,workspace,screenshots:report.screenshots,violations:report.violations,reflowFailures:report.reflowFailures,restartPersisted:true,sourcePreservation:preservation,publicSourceApproval:false},null,2));if(report.violations||report.reflowFailures)process.exitCode=1;
}finally{await context.close();await browser.close();await service.stop();}
