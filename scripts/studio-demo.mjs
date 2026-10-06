import assert from "node:assert/strict";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { chromium } from "playwright";
import { persistentPilotRoot, hashBytes } from "./lib/pilot-snapshot.mjs";
import { loadSnapshot, sourcePreservation } from "./lib/real-pilot.mjs";
import { startStudio } from "./lib/studio-server.mjs";
import { auditAccessibility, prepareScreenshot, captureFullPage } from "./lib/browser-quality.mjs";
import { presentationBounds, assertPresentationBounds } from "./lib/presentation-quality.mjs";

const base = persistentPilotRoot();
const snapshotPath = resolve(base, "snapshots/run-2026-10-06T00-12-39-275Z-bd2ed33a/snapshot.json");
const { snapshot, directory } = await loadSnapshot(snapshotPath);
assert.equal(snapshot.snapshotSha256, "60d841eaabd3a7e1ced4560c047c863fcba111f8b89ccc4f7f0d664cd66b8a2c");
const registryBefore = hashBytes(await readFile(resolve(base, "id-registry.json")));
const runId = `demo-${new Date().toISOString().replace(/[:.]/g,"-")}-${randomUUID().slice(0,8)}`;
const output = resolve(base, "studio/demonstrations", runId);
await mkdir(resolve(output,"screenshots"),{recursive:true,mode:0o700});
const service = await startStudio({ snapshotPath, allowPublicExport:false });
const browser = await chromium.launch();
const context = await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:"reduce"});
await context.route("**/*", (route)=> new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort());
const page = await context.newPage();
const captures=[], checks=[], selectedIds=["w-0001","w-0025","w-0008"];
const marker="PRIVATE STUDIO DEMO — not owner-approved artwork metadata/rights/series/curation";
async function capture(name,width=1440) {
  await prepareScreenshot(page);
  const audit=await auditAccessibility(page,{developerInjection:true});
  const reflow=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);
  const path=resolve(output,"screenshots",`${width}-${name}.png`);
  await captureFullPage(page,path);
  captures.push({name,width,screenshot:`screenshots/${width}-${name}.png`,reflow,accessibility:audit});
}
try {
  await page.goto(service.origin);
  await page.getByText(/Private local Studio ready/).waitFor();
  const original=snapshot.included.find((entry)=>entry.id===selectedIds[0]);
  await page.locator("#files").setInputFiles(resolve(directory,original.snapshotRelativeFile));
  await page.locator("#intake-purpose").selectOption("media");
  await page.locator("#assume-srgb").check();
  await capture("intake-selected-file");
  await page.getByRole("button",{name:"Generate private derivatives",exact:true}).click();
  await service.studio.waitForJobs();
  await page.locator("#refresh").click();
  await page.locator("#jobs").getByText(/COMPLETE/).first().waitFor({timeout:180000});
  await page.getByText("Use an explicitly selected frozen M09 image",{exact:true}).click();
  await page.locator("#load-snapshot").click();
  await page.locator("#intake-purpose").selectOption("artwork");
  for(const id of selectedIds) {
    const existing=service.studio.state().catalogue.artworks.find((work)=>work.id===id);
    if(existing && (!service.studio.state().notes[id]?.includes(marker) || existing.kind!=="unclassified" || service.studio.state().workflow[id].titleProvided)) throw new Error(`Existing owner draft ${id} is preserved; demo must not overwrite it`);
    if(!existing) {
      await page.locator("#snapshot-id").selectOption(id);
      await page.locator("#import-snapshot").click();
      await service.studio.waitForJobs();
      await page.locator("#refresh").click();
    }
    await page.locator(".work-entry").filter({hasText:id}).click();
    await page.getByLabel("Title",{exact:true}).fill(`Private draft ${id} (title not supplied)`);
    await page.getByLabel("Medium",{exact:true}).selectOption(id==="w-0025"?"drawing":id==="w-0008"?"printmaking":"painting");
    await page.getByLabel("Object kind",{exact:true}).selectOption("unclassified");
    await page.getByLabel("Alt text",{exact:true}).fill(`Private demonstration image ${id}; actual title/authorship/rights unconfirmed`);
    await page.locator('[name="privateNote"]').first().fill(marker+". Medium is a provisional test hypothesis; physical sizes/date/availability/price/edition facts not supplied. Publication/export disabled.");
    await page.getByRole("button",{name:"Save private artwork",exact:true}).click();
    await page.getByText(/Saved private artwork\./).waitFor();
  }
  await page.locator(".work-entry").filter({hasText:selectedIds[0]}).click();
  await capture("artwork-editor");
  await page.getByRole("button",{name:"Projects",exact:true}).click();
  const priorProject=service.studio.state().catalogue.projects.find((project)=>service.studio.state().notes[project.id]?.includes(marker));
  if(priorProject) await page.locator("#project-list button").filter({hasText:priorProject.title}).first().click();
  else await page.getByRole("button",{name:"New private project",exact:true}).click();
  await page.getByLabel("Project title",{exact:true}).fill("Private demo group (authored title not supplied)");
  await page.locator('#project-form [name="description"]').fill("Private authoring/ordered-membership demonstration only. These images are not an owner-authored series or approved public selection.");
  await page.locator('#project-form [name="privateNote"]').fill(marker);
  if(!priorProject) for(const id of [selectedIds[2],selectedIds[0],selectedIds[1]]) {await page.locator("#project-add-member").selectOption(id);await page.getByRole("button",{name:"Add selected member",exact:true}).click();}
  await page.getByRole("button",{name:"Save private project",exact:true}).click();
  await page.getByText(/Saved private project/).waitFor();
  const projectId=priorProject?.id??service.studio.state().catalogue.projects.at(-1).id;
  await capture("project-editor-order");
  await page.getByRole("button",{name:"Curation",exact:true}).click();
  for(const id of selectedIds) if(!service.studio.state().catalogue.artworks.find((work)=>work.id===id).featured) {await page.locator("#selected-add-work").selectOption(id);await page.getByRole("button",{name:"Add selected artwork",exact:true}).click();}
  await page.locator("#homepage-lead").selectOption(selectedIds[0]);
  await page.getByRole("button",{name:"Save private curation",exact:true}).click();
  await page.getByText(/Saved private Selected Work/).waitFor();
  await capture("curation");
  await page.getByRole("button",{name:"Preview & export",exact:true}).click();
  await page.getByRole("button",{name:"Build current production-component preview",exact:true}).click();
  await page.getByRole("link",{name:"Preview Artwork",exact:true}).waitFor({timeout:120000});
  const previewUrl=await page.getByRole("link",{name:"Preview Homepage",exact:true}).getAttribute("href");
  const previewOrigin=new URL(previewUrl).origin;
  await page.locator("#review-record").selectOption(selectedIds[0]);
  await page.getByRole("button",{name:"I reviewed this current record locally",exact:true}).click();
  await page.getByText(/Local review recorded/).waitFor();
  await page.locator(`#export-records input[value="${selectedIds[0]}"]`).check();
  await page.getByRole("button",{name:"Prepare dry-run public-source export",exact:true}).click();
  await page.getByText(/approval is missing/).waitFor();
  assert.equal(await page.getByRole("button",{name:"Write explicitly approved public-source files",exact:true}).isDisabled(),true);
  await capture("preview-approval-export-gates");
  const previewPage=await context.newPage();
  for(const width of [1440,768,360]) {
    await page.setViewportSize({width,height:900});
    for(const [tab,name] of [["Artworks & media","collection"],["Projects","projects"],["Curation","curation"],["Preview & export","review"]]) {await page.getByRole("button",{name:tab,exact:true}).click();await capture(`studio-${name}`,width);}
    await previewPage.setViewportSize({width,height:900});
    for(const path of ["/","/work/","/archive/","/work/drawing/",`/artwork/${selectedIds[0]}/`,`/artwork/${selectedIds[2]}/`,`/projects/${projectId}/`]) {
      await previewPage.goto(previewOrigin+path,{waitUntil:"networkidle"});
      await prepareScreenshot(previewPage);
      const geometry=await presentationBounds(previewPage);assertPresentationBounds(geometry);
      const audit=await auditAccessibility(previewPage),reflow=await previewPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);
      const name=`preview-${path==="/"?"home":path.replaceAll("/","-")}`;
      await captureFullPage(previewPage,resolve(output,"screenshots",`${width}-${name}.png`));
      captures.push({name,width,path,screenshot:`screenshots/${width}-${name}.png`,geometry,reflow,accessibility:audit});
    }
  }
  const final=service.studio.state();
  assert.ok(selectedIds.every((id)=>final.catalogue.artworks.find((work)=>work.id===id)?.published===false));
  assert.ok(selectedIds.every((id)=>!final.workflow[id].approved));
  assert.equal(hashBytes(await readFile(resolve(base,"id-registry.json"))),registryBefore,"snapshot identity reuse does not mutate the registry");
  checks.push({workflow:"native-file media intake → explicit3snapshot artworks → editor → ordered project → SelectedWork/lead → current-component previews → demo local-review click → blocked unapproved dry-run",result:"PASS",ownerSourceApproval:false,repositoryWritten:false});
  const preservation=await sourcePreservation(snapshot);assert.equal(preservation.unchanged,169);
  const report={request:"M09-R6",runId,output,snapshotSha256:snapshot.snapshotSha256,selectedIds,projectId,studioRoot:service.studio.root,statePath:resolve(service.studio.root,"state.json"),preview:final.previews.at(-1),sourcePreservation:preservation,registryPreserved:true,checks,captures,violations:captures.flatMap((item)=>item.accessibility.violations).length,reflowFailures:captures.filter((item)=>!item.reflow).length,incomplete:captures.flatMap((item)=>item.accessibility.incomplete),publicSourceApproval:false,repositoryWritesEnabled:false,milestoneComplete:false};
  await writeFile(resolve(output,"report.json"),JSON.stringify(report,null,2)+"\n",{mode:0o600});
  await writeFile(resolve(output,"README.md"),`# Private local Studio demonstration\n\nCurrent production components/R2 baseline; not owner title/medium/kind/date/rights/series/curation/public-source/launch approval. Three explicit frozen images and one browser-selected media-only upload; no automatic169-image catalogue. Interface local-review click is a demonstration, not owner M09 acceptance.\n\nStart with screenshots/ and report.json. Draft working state: ${service.studio.root}. Preview site: ${report.preview.site}.\n\nFrom /home/jordan/jordannesbitt.com with Node22: npm run studio\n\nOr temporary runtime: npm_config_cache=/tmp/opencode/jordannesbitt-npm-cache npm exec --yes --package=node@22.23.3 --package=npm@10.9.9 --call 'npm run studio'\n\nDefault repository writes disabled. Real title/medium/kind/alt/rights/source disclosure and reviewed exact metadata/media are still required before any approval/dry-run/write. Explicit --allow-public-export startup and EXPORT token confirmation are separate. Tool never creates launch approval, commits, deploys or sends messages.\n\n${captures.length} actual UI/production-component screenshots;${report.violations}observed axe violations,${report.reflowFailures}reflow failures. Incomplete rules are manual/INCONCLUSIVE, not passing. Source169/169bytes+mtime/registry preserved. M09 remains ACTIVE/HUMAN_VERIFICATION.\n`,{mode:0o600});
  await writeFile(resolve(base,"studio/latest-demonstration.json"),JSON.stringify({output,runId,report:resolve(output,"report.json")},null,2)+"\n",{mode:0o600});
  console.log(JSON.stringify({output,studioRoot:service.studio.root,previewSite:report.preview.site,screenshots:captures.length,violations:report.violations,reflowFailures:report.reflowFailures,sourcePreservation:preservation,publicSourceApproval:false},null,2));
  if(report.violations||report.reflowFailures)process.exitCode=1;
} finally {await context.close();await browser.close();await service.stop();}
