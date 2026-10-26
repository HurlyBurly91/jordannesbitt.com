import assert from "node:assert/strict";
import { test } from "node:test";
import { readdir, readFile, access, symlink, mkdir } from "node:fs/promises";
import { resolve, relative, sep } from "node:path";
import { isolatedProject, repository } from "./helpers/build-project.mjs";
import { fixtureWork } from "./fixtures/catalogue.mjs";
import { readCatalogue, emitPublicMedia } from "../src/lib/catalogue-source.ts";
import sharp from "sharp";
import { inspectOutput, elements, outputFiles } from "../scripts/lib/output-quality.mjs";
import { publicCatalogue, publicAssets } from "../src/lib/catalogue.ts";

async function outputText(root) {
  const entries = await readdir(root, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => entry.isDirectory() ? outputText(resolve(root, entry.name)) : /\.(html|json|js|xml|txt)$/.test(entry.name) ? readFile(resolve(root, entry.name), "utf8") : ""))).join("\n");
}
test("real production output exposes exactly the public catalogue and no fixture or orphan media", async () => {
  const source=readCatalogue(repository),visible=publicCatalogue(source),dist=resolve(repository,"dist");
  assert.doesNotMatch(await outputText(resolve(repository, "dist")), /TEST FIXTURE|test-fixture-|UNPUBLISHED SENTINEL/);
  assert.doesNotMatch(await readFile(resolve(repository, ".astro/cache/data-store.json"), "utf8"), /specimen-|test-fixture-|scale-|UNPUBLISHED SENTINEL/, "fixture builds cannot contaminate the real content cache");
  const files=await outputFiles(dist),routes=files.map((file)=>relative(dist,file).split(sep).join("/"));
  assert.deepEqual(routes.filter((path)=>path.startsWith("artwork/")).sort(),visible.artworks.flatMap((work)=>[work.slug,...work.aliases].map((slug)=>`artwork/${slug}/index.html`)).sort());
  assert.deepEqual(routes.filter((path)=>path.startsWith("media/")).map((path)=>"/"+path).sort(),publicAssets(source).sort(),"hidden/orphan derivatives must never be emitted");
});

test("controlled empty catalogue emits no artwork routes, media or draft sentinel",async(t)=>{
  const project=await isolatedProject(t);assert.deepEqual(readCatalogue(project.root),{artworks:[],projects:[],professional:[]});const built=await project.build();assert.equal(built.code,0,built.output);
  await assert.rejects(access(resolve(project.root,"dist/artwork")));await assert.rejects(access(resolve(project.root,"dist/media")));assert.doesNotMatch(await outputText(resolve(project.root,"dist")),/TEST FIXTURE|test-fixture-|UNPUBLISHED SENTINEL/);
  const nodes=elements(await readFile(resolve(project.root,"dist/archive/index.html"),"utf8"));assert.ok(!nodes.some((node)=>node.attrs["data-result-count"]!==undefined||node.attrs["data-archive-form"]!==undefined),"empty archive retains no meaningless count or filter controls");
});

test("isolated full builds gate unpublished routes/JSON/sitemap/assets and reject fixtures/duplicates", async (t) => {
  const project = await isolatedProject(t);
  const hidden = fixtureWork({ fixture: false, published: false, id: "w-unpublished", slug: "boundary-unpublished", title: "UNPUBLISHED SENTINEL", reproductions: [{ src: "/media/hidden.png", width: 100, height: 100, role: "primary", alt: "Synthetic boundary asset" }] });
  await project.content("artworks", [hidden]);
  await project.asset("/media/hidden.png");
  let result = await project.build();
  assert.equal(result.code, 0, result.output);
  assert.doesNotMatch(await outputText(resolve(project.root, "dist")), /UNPUBLISHED SENTINEL|boundary-unpublished|w-unpublished/);
  await assert.rejects(access(resolve(project.root, "dist/media/hidden.png")));
  await assert.rejects(access(resolve(project.root, "dist/artwork/boundary-unpublished")));

  await project.content("artworks", [fixtureWork()]);
  result = await project.build();
  assert.notEqual(result.code, 0, "fixture input must fail, not only be omitted");
  assert.match(result.output, /TEST FIXTURE/);
  await project.content("artworks", [hidden, hidden]);
  result = await project.build();
  assert.notEqual(result.code, 0, "duplicate input must fail before loader overwrite");
  assert.match(result.output, /Duplicate catalogue ID/);
});

test("unsafe media roots and missing/symlinked derivatives are rejected", async (t) => {
  const project = await isolatedProject(t);
  const hidden = fixtureWork({ fixture: false, published: false, id: "w-boundary", slug: "boundary-work", title: "Synthetic missing-asset case", reproductions: [{ src: "/media/missing.png", width: 100, height: 100, role: "primary", alt: "Synthetic asset" }] });
  await project.content("artworks", [hidden]);
  assert.throws(() => readCatalogue(project.root), /Missing or unsafe/);
  await mkdir(resolve(project.root, "src/media"), { recursive: true });
  await symlink(resolve(project.root, "public/favicon.svg"), resolve(project.root, "src/media/missing.png"));
  assert.throws(() => readCatalogue(project.root), /Missing or unsafe/);
  await mkdir(resolve(project.root, "public/media"));
  assert.throws(() => readCatalogue(project.root), /never copied wholesale/);
});

test("derivative emission copies the public asset once and omits hidden/orphan assets", async (t) => {
  const project = await isolatedProject(t);
  const visible = fixtureWork({ fixture: false, id: "w-public", slug: "boundary-public", title: "Synthetic asset-boundary case", reproductions: [{ src: "/media/visible.png", width: 100, height: 100, role: "primary", alt: "Synthetic asset" }] });
  const hidden = { ...visible, id: "w-hidden", slug: "boundary-hidden", published: false, reproductions: [{ ...visible.reproductions[0], src: "/media/hidden.png" }] };
  await project.content("artworks", [visible, hidden]);
  for (const url of ["/media/visible.png", "/media/hidden.png", "/media/orphan.png"]) await project.asset(url);
  const output = resolve(project.root, "emission-check");
  emitPublicMedia(project.root, output);
  assert.deepEqual(await readdir(resolve(output, "media")), ["visible.png"]);
  assert.equal(await readFile(resolve(output, "media/visible.png"), "utf8"), "synthetic boundary asset");
});

test("distinct intentionally Untitled artworks retain display titles with unique document metadata", async(t)=>{
  const project=await isolatedProject(t),source="/media/untitled-proof.png";
  const works=[fixtureWork({id:"untitled-a",slug:"untitled-a",title:"Untitled",fixture:false,date:{certainty:"exact",year:2024},reproductions:[{src:source,width:100,height:100,role:"primary",alt:"Synthetic green square"}]}),fixtureWork({id:"untitled-b",slug:"untitled-b",title:"Untitled",fixture:false,date:{certainty:"circa",year:2021},reproductions:[{src:source,width:100,height:100,role:"primary",alt:"Synthetic green square"}]})];
  await project.content("artworks",works);await project.asset(source,await sharp({create:{width:100,height:100,channels:3,background:"#42644a"}}).png().toBuffer());
  const built=await project.build();assert.equal(built.code,0,built.output);
  const metadata=[];
  for(const work of works){const nodes=elements(await readFile(resolve(project.root,`dist/artwork/${work.slug}/index.html`),"utf8"));assert.equal(nodes.find((node)=>node.tag==="h1").text,"Untitled","technical disambiguation never invents a different artwork title");assert.equal(nodes.find((node)=>node.tag==="link"&&node.attrs.rel==="canonical").attrs.href,`https://jordannesbitt.com/artwork/${work.slug}/`);metadata.push(nodes.find((node)=>node.tag==="title").text);}
  assert.notEqual(metadata[0],metadata[1],"distinct real works cannot share ambiguous document titles");await inspectOutput(resolve(project.root,"dist"));
});
