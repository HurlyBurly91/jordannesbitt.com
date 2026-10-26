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
const registryBytes = await readFile(resolve(base, "id-registry.json")), registryBefore = hashBytes(registryBytes);
const ownerStatePath = resolve(base, "studio/state.json"), ownerStateBefore = hashBytes(await readFile(ownerStatePath));
const runId = `ux-demo-${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID().slice(0,8)}`;
const output = resolve(base, "studio/demonstrations", runId), workspace = resolve(output, "workspace");
await mkdir(resolve(output, "screenshots"), { recursive: true, mode: 0o700 });
await mkdir(workspace, { recursive: true, mode: 0o700 });
// Isolated demonstration state/registry copy, never a replacement for the owner's authoritative working state.
await writeFile(resolve(workspace, "id-registry.json"), registryBytes, { mode: 0o600, flag: "wx" });
const service = await startStudio({ dataRoot: workspace, allowPublicExport: false });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width:1440,height:900 }, deviceScaleFactor:1, reducedMotion:"reduce" });
await context.route("**/*", (route) => new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort());
const page = await context.newPage(), captures = [], checks = [];
const labels = ["UX demonstration artwork (title not supplied)", "Second UX artwork (title not supplied)"];
const files = ["w-0001", "w-0008", "w-0025"].map((id) => resolve(directory,snapshot.included.find((entry)=>entry.id===id).snapshotRelativeFile));
async function capture(name, width=1440) {
  await prepareScreenshot(page);
  const accessibility=await auditAccessibility(page,{developerInjection:true});
  const reflow=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);
  await captureFullPage(page,resolve(output,"screenshots",`${width}-${name}.png`));
  captures.push({name,width,screenshot:`screenshots/${width}-${name}.png`,reflow,accessibility});
}
async function upload(file,kind,target,role="Alternate view",name) {
  await page.getByRole("button",{name:"Artworks",exact:true}).click();
  await page.getByRole("button",{name:"Add images",exact:true}).click();
  await page.locator("#files").setInputFiles(file);await page.getByRole("radio",{name:kind}).check();
  if(target){await page.locator("#intake-targets").getByRole("button",{name:`Choose artwork ${target}`,exact:true}).click();await page.locator("#intake-panel").getByLabel("How should this image be used?",{exact:true}).selectOption({label:role});}
  if(name)await capture(name);
  const count=service.studio.state().jobs.length;
  await page.getByRole("button",{name:target?"Add photo to artwork":kind.source.includes("Process")?"Keep as process / reference":"Create draft",exact:true}).click();
  await page.getByRole("button",{name:"Use sRGB for this image",exact:true}).click();
  await page.waitForFunction(()=>document.querySelectorAll("#jobs p").length>0);
  while(service.studio.state().jobs.length===count)await new Promise((done)=>setTimeout(done,100));
  await service.studio.waitForJobs();await page.getByRole("button",{name:"Refresh",exact:true}).click();
  if(kind.source.includes("New"))await page.getByLabel("Title",{exact:true}).waitFor({timeout:180000});
}
async function edit(title,medium) {
  await page.getByLabel("Title",{exact:true}).fill(title);await page.getByLabel("Medium",{exact:true}).selectOption(medium);
  await page.getByLabel("Alt text",{exact:true}).fill("Private UX demonstration image; actual title/authorship/rights unconfirmed");
  await page.getByRole("button",{name:"Save draft",exact:true}).first().click();await page.getByText(/Draft saved\./).waitFor();
}
try {
  await page.goto(service.origin);await page.getByText(/Studio ready\./).waitFor();
  await upload(files[0],/^New artwork/,null,null,"A-new-artwork-choice");await edit(labels[0],"painting");await capture("D-image-first-artwork-editor");
  await upload(files[1],/^New artwork/);await edit(labels[1],"printmaking");
  await upload(files[0],/^Another view\/detail/,labels[0],"Alternate view","B-another-photo-target");
  const [first,second]=service.studio.state().catalogue.artworks;
  assert.equal(service.studio.state().catalogue.artworks[0].reproductions.length,2);
  assert.equal(service.studio.state().catalogue.artworks[1].reproductions.length,1);
  await page.getByRole("button",{name:`Open ${labels[0]}`,exact:true}).click();await capture("B-ordered-photos");
  await upload(files[2],/^Process\/reference image/,null,null,"C-reference-only-choice");
  assert.equal(service.studio.state().catalogue.artworks.length,2);
  await page.getByRole("button",{name:"Photos & references",exact:true}).click();
  await page.locator("#media-library .thumbnail-card").filter({hasText:"Process / reference only"}).click();await capture("C-visual-media-library");
  await page.getByRole("button",{name:"Clear selection",exact:true}).click();
  await page.getByRole("button",{name:"Selected Work & homepage",exact:true}).click();
  for(const label of labels)await page.getByRole("button",{name:`Add to Selected Work ${label}`,exact:true}).click();
  await page.locator("#selected-sequence li").nth(1).getByRole("button",{name:"Move earlier",exact:true}).click();
  await page.getByRole("button",{name:"Save Selected Work",exact:true}).click();await page.getByText(/Selected Work saved\./).waitFor();await capture("E-visual-selected-work-order");
  await page.getByRole("button",{name:`Use on homepage ${labels[1]}`,exact:true}).click();await page.getByText(/Homepage image saved\./).waitFor();await capture("F-homepage-image-choice");
  await page.getByRole("button",{name:"Projects",exact:true}).click();await page.getByRole("button",{name:"New project",exact:true}).click();
  await page.getByLabel("Project title",{exact:true}).fill("UX demonstration project (authored title not supplied)");
  await page.getByLabel("Context",{exact:true}).fill("Private interface sequencing demonstration, not an owner-authored series or public curation approval.");
  for(const label of [labels[1],labels[0]])await page.getByRole("button",{name:`Add to project ${label}`,exact:true}).click();
  await page.locator("#project-members li").nth(1).getByRole("button",{name:"Move earlier",exact:true}).click();
  await page.getByRole("button",{name:"Save project",exact:true}).click();await page.getByText(/Project saved\./).waitFor();await capture("G-visual-project-sequence");
  const project=service.studio.state().catalogue.projects[0];assert.deepEqual(project.memberIds,[first.id,second.id]);
  await page.getByRole("button",{name:"Prepare for public site",exact:true}).click();await page.getByRole("button",{name:"Preview current work",exact:true}).click();
  await page.getByRole("link",{name:"Preview Homepage",exact:true}).waitFor({timeout:120000});
  const previewOrigin=new URL(await page.getByRole("link",{name:"Preview Homepage",exact:true}).getAttribute("href")).origin;
  await page.getByLabel("Artwork or project",{exact:true}).selectOption({label:labels[0]});
  await page.getByRole("button",{name:"I have reviewed this preview",exact:true}).click();await page.getByText(/Local review recorded/).waitFor();
  await page.getByLabel(`${labels[0]} · Approval required`,{exact:true}).check();
  await page.getByRole("button",{name:"Prepare for public site (dry-run)",exact:true}).click();await page.locator("#message").getByText(/approval is missing/).waitFor();
  assert.equal(await page.getByRole("button",{name:"Write explicitly approved public-source files",exact:true}).isDisabled(),true);await capture("I-dry-run-approval-gate");
  const previewPage=await context.newPage();
  for(const width of [1440,768,360]) {
    await page.setViewportSize({width,height:900});
    for(const [tab,name]of [["Artworks","artworks"],["Photos & references","media"],["Projects","projects"],["Selected Work & homepage","selection-home"],["Prepare for public site","prepare"]]){await page.getByRole("button",{name:tab,exact:true}).click();await capture(`studio-${name}`,width);}
    await previewPage.setViewportSize({width,height:900});
    for(const path of ["/","/work/","/archive/",`/artwork/${first.slug}/`,`/artwork/${second.slug}/`,`/projects/${project.slug}/`]) {
      await previewPage.goto(previewOrigin+path,{waitUntil:"networkidle"});await prepareScreenshot(previewPage);
      const geometry=await presentationBounds(previewPage);assertPresentationBounds(geometry);const accessibility=await auditAccessibility(previewPage),reflow=await previewPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);
      const name=`preview-${path==="/"?"home":path.replaceAll("/","-")}`;await captureFullPage(previewPage,resolve(output,"screenshots",`${width}-${name}.png`));captures.push({name,width,path,geometry,accessibility,reflow,screenshot:`screenshots/${width}-${name}.png`});
    }
  }
  const final=service.studio.state();assert.equal(final.catalogue.artworks.length,2);assert.ok(final.catalogue.artworks.every((work)=>!work.published&&work.kind==="unclassified"));assert.ok(Object.values(final.workflow).every((flow)=>!flow.approved));
  assert.deepEqual(final.catalogue.artworks.filter((work)=>work.featured).sort((a,b)=>a.selectedOrder-b.selectedOrder).map((work)=>work.id),[second.id,first.id]);
  assert.equal(final.catalogue.artworks.find((work)=>work.homepageLead).id,second.id);
  assert.equal(hashBytes(await readFile(resolve(base,"id-registry.json"))),registryBefore,"authoritative owner registry untouched by isolated demonstration");
  assert.equal(hashBytes(await readFile(ownerStatePath)),ownerStateBefore,"owner's existing Studio working state remains byte-for-byte unchanged");
  const demoRegistry=JSON.parse(await readFile(resolve(workspace,"id-registry.json")));assert.deepEqual(demoRegistry.entries,JSON.parse(registryBytes).entries);
  const source=await sourcePreservation(snapshot);assert.equal(source.unchanged,169);
  checks.push({workflow:"Anew-artwork/Bexplicitalternate/Creference/Dmetadata/Eselectedorder/Fhomepage/Gprojectorder/Hpreview/Igateddryrun",result:"PASS",normalUiUsesInternalIds:false,ownerSourceApproval:false,actualRepositoryWritten:false});
  const report={request:"M09-R7",runId,output,workspace,authoritativeOwnerStudioUntouched:true,snapshotSha256:snapshot.snapshotSha256,sourcePreservation:source,checks,preview:final.previews.at(-1),captures,violations:captures.flatMap((item)=>item.accessibility.violations).length,reflowFailures:captures.filter((item)=>!item.reflow).length,incomplete:captures.flatMap((item)=>item.accessibility.incomplete),publicSourceApproval:false,repositoryWritesEnabled:false,milestoneComplete:false};
  await writeFile(resolve(output,"report.json"),JSON.stringify(report,null,2)+"\n",{mode:0o600});
  await writeFile(resolve(output,"README.md"),`# Image-first Studio UX demonstration\n\nPrivate isolated demonstration state/registry copy: ${workspace}. This is not the owner's authoritative registry or working Studio. Current owner drafts/IDs/files remain unchanged. Three explicitly selected frozen images; temporary UI labels are not permanent artwork/series names. Duplicate whole export demonstrates alternate-photo attachment only, not a new claimed physical detail.\n\nAnewartwork/Balternate/Cprocessreference/Dnormalmetadata/ESelectedorder/Fhomepage/Gprojectorder/Hactualcomponents/Idryrun refusal without rights/sourceapproval. Successful approved dry-run is verified only with synthetic records in automated tests; no real rights approval fabricated.\n\n${captures.length} screenshots/0public-source approvals. Observed axe violations ${report.violations},incomplete ${report.incomplete.length},reflow ${report.reflowFailures}. Headless Chromium,DPR1,1440/768/360×900,normalzoom. Human usability/content/colour acceptance still required.\n\nDefault owner tool from checkout/Node22: npm run studio. To open this isolated demonstration: JORDANNESBITT_M09_DATA=${workspace} npm run studio. Current-component preview: ${report.preview.site}. Source169/169bytes+mtime unchanged. No public export/commit/deploy/manifest approval,M09notcomplete.\n`,{mode:0o600});
  await writeFile(resolve(base,"studio/latest-demonstration.json"),JSON.stringify({output,runId,report:resolve(output,"report.json")},null,2)+"\n",{mode:0o600});
  console.log(JSON.stringify({output,workspace,previewSite:report.preview.site,screenshots:captures.length,violations:report.violations,reflowFailures:report.reflowFailures,sourcePreservation:source,publicSourceApproval:false},null,2));if(report.violations||report.reflowFailures)process.exitCode=1;
}finally{await context.close();await browser.close();await service.stop();}
