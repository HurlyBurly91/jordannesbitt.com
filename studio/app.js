const $ = (id) => document.getElementById(id);
let token, state, editingArtwork, editingProject, projectMembers = [], selected = [], exportPlan, currentPreview;
const roles = ["primary", "alternate", "detail", "framed", "installation", "documentation", "reverse", "process"];
const dimensions = ["image", "sheet", "framed", "object"];
// Keep select names independent of their currently selected embedded option.
for (const select of document.querySelectorAll("label > select")) {
  select.setAttribute("aria-label", [...select.parentElement.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent).join("").trim());
}
const field = (form, name) => form.elements.namedItem(name);
const lines = (value) => value.split(/\n/).map((value) => value.trim()).filter(Boolean);
function message(text, error = false) { $("message").textContent = text; $("message").setAttribute("role", error ? "alert" : "status"); }
async function api(path, data, raw) {
  const headers = { "x-studio-token": token };
  if (raw) headers["x-studio-options"] = encodeURIComponent(JSON.stringify(data));
  else if (data !== undefined) headers["Content-Type"] = "application/json";
  const response = await fetch(path, { method: data === undefined ? "GET" : "POST", headers, body: raw ?? (data === undefined ? undefined : JSON.stringify(data)) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Studio request failed");
  return result;
}
function action(handler) { return async (event) => { event?.preventDefault(); try { await handler(event); } catch (error) { message(error.message, true); } }; }
function node(tag, text, className) { const element = document.createElement(tag); if (text !== undefined) element.textContent = text; if (className) element.className = className; return element; }
function button(text, handler) { const element = node("button", text); element.type = "button"; element.addEventListener("click", action(handler)); return element; }
function options(select, values, empty = "Choose") {
  const old = select.value; select.replaceChildren(new Option(empty, ""));
  for (const entry of values) select.add(new Option(entry.title || entry.id, entry.id));
  if ([...select.options].some((option) => option.value === old)) select.value = old;
}
function phase(record) {
  const workflow = state.workflow[record.id] || {};
  const actual = state.actualPublic.some((work) => work.id === record.id);
  return [actual ? "Public source; editor is a private copy" : "PRIVATE LOCAL DRAFT", workflow.approved ? "Public-source approved" : workflow.reviewed ? "Reviewed locally" : "Review pending", record.featured ? "Selected" : "", record.homepageLead ? "Homepage lead" : "", ["available", "edition-available"].includes(record.availability?.state) ? "Available (draft facts)" : ""].filter(Boolean).join(" · ");
}
async function refresh({ editor = false } = {}) {
  state = await api("/api/state");
  $("write-mode").textContent = state.repositoryWritesEnabled ? "Repository writing explicitly enabled for this run; exact review/approval/export confirmation still required." : "Repository writes DISABLED — private editing and dry-run only.";
  $("work-list").replaceChildren();
  for (const work of state.catalogue.artworks) {
    const item = button("", () => openArtwork(work.id)); item.className = "work-entry";
    item.append(node("strong", state.workflow[work.id].titleProvided ? work.title : `Untitled private draft · ${work.id}`), node("small", phase(work)));
    $("work-list").append(item);
  }
  if (!state.catalogue.artworks.length) $("work-list").append(node("p", "Add selected images to begin. Nothing is automatically published."));
  for (const id of ["intake-artwork", "project-add-member", "selected-add-work", "homepage-lead"]) options($(id), state.catalogue.artworks);
  $("jobs").replaceChildren(...state.jobs.slice(-8).reverse().map((job) => node("p", `${job.status === "running" ? "Generating derivatives…" : job.status.toUpperCase()} · ${job.result?.artworkId || job.result?.mediaId || job.id.slice(0,8)}${job.error ? "\n" + job.error : ""}`)));
  renderMedia(); renderProjects(); renderReview();
  if (editor && editingArtwork) openArtwork(editingArtwork);
}
function formSet(form, name, value) {
  const control = field(form, name);
  if (control.type === "checkbox") control.checked = value === true; else control.value = value ?? "";
}
function optional(form, name) { const value = field(form, name).value.trim(); return value || undefined; }
function number(form, name) { const value = optional(form, name); return value === undefined ? undefined : Number(value); }
function date(form, optionalDate = false) {
  const certainty = field(form, "certainty").value;
  if (!certainty && optionalDate) return undefined;
  return { certainty, ...(certainty === "unknown" ? {} : { year: number(form, "year"), endYear: number(form, "endYear") }), ...(field(form, "dateLabel") && optional(form, "dateLabel") ? { label: optional(form, "dateLabel") } : {}) };
}
function currencyPrecision(currency) { return new Intl.NumberFormat("en-CA", { style: "currency", currency }).resolvedOptions().maximumFractionDigits; }
function priceMinor(value, currency) {
  if (!/^\d+(?:\.\d+)?$/.test(value)) throw new Error("Enter a positive decimal price without currency symbols");
  const precision = currencyPrecision(currency), [whole, fraction = ""] = value.split(".");
  if (fraction.length > precision) throw new Error(`This currency supports ${precision} decimal places`);
  const amount = Number(whole + fraction.padEnd(precision, "0"));
  if (!Number.isSafeInteger(amount) || amount <= 0) throw new Error("Price must be positive and within supported minor-unit precision");
  return amount;
}
function priceDisplay(price) { if (!price) return ""; const precision = currencyPrecision(price.currency), text = String(price.amountMinor).padStart(precision + 1, "0"); return precision ? text.slice(0, -precision) + "." + text.slice(-precision) : text; }
function createInput(label, name, value = "", type = "text") {
  const wrapper = node("label", label), input = document.createElement("input"); input.name = name; input.type = type; input.value = value; if (type === "number") { input.step = "any"; input.min = "0"; } wrapper.append(input); return wrapper;
}
function createSelect(label, name, values, selectedValue) {
  const wrapper = node("label", label), select = document.createElement("select"); select.name = name;
  select.setAttribute("aria-label", label);
  for (const value of values) select.add(new Option(value, value)); select.value = selectedValue; wrapper.append(select); return wrapper;
}
function openArtwork(id) {
  editingArtwork = id; const work = state.catalogue.artworks.find((record) => record.id === id); if (!work) return;
  const form = $("artwork-form"); form.hidden = false; form.reset();
  $("artwork-id").textContent = work.id; $("artwork-phase").textContent = phase(work);
  for (const name of ["slug", "medium", "kind", "materials", "description", "framing", "condition", "published", "featured", "selectedOrder"]) formSet(form, name, work[name]);
  formSet(form, "title", state.workflow[id].titleProvided ? work.title : "");
  formSet(form, "aliases", work.aliases.join("\n")); formSet(form, "techniques", work.techniques.join("\n"));
  for (const name of ["certainty", "year", "endYear"]) formSet(form, name, work.date[name]); formSet(form, "dateLabel", work.date.label);
  const offer = work.availability;
  formSet(form, "availability", offer.state); formSet(form, "offerMode", offer.mode); formSet(form, "offerReviewed", offer.reviewed); formSet(form, "currency", offer.price?.currency); formSet(form, "price", priceDisplay(offer.price));
  for (const [name,key] of [["editionSize","size"],["editionNumber","number"],["artistProofs","artistProofs"]]) formSet(form, name, work.edition?.[key]);
  for (const name of ["signed", "numbered"]) formSet(form, name, work.edition?.[name] === undefined ? "" : String(work.edition[name]));
  formSet(form, "privateNote", state.notes[id]);
  $("dimension-fields").replaceChildren();
  for (const kind of dimensions) {
    const size = work.dimensions.find((entry) => entry.kind === kind), group = node("div"); group.append(node("h3", `${kind[0].toUpperCase()+kind.slice(1)} size`));
    for (const key of ["width", "height", "depth"]) group.append(createInput(key, `${kind}-${key}`, size?.[key] ?? "", "number"));
    group.append(createSelect("Unit", `${kind}-unit`, ["cm", "mm", "in"], size?.unit || "cm")); $("dimension-fields").append(group);
  }
  renderReproductions(work.reproductions);
  $("work-projects").replaceChildren(node("h3", "Project membership"));
  for (const project of state.catalogue.projects) $("work-projects").append(node("p", `${project.title}${project.memberIds.includes(id) ? " · Member" : ""} (edit membership/order in Projects)`));
}
function renderReproductions(images) {
  const container = $("reproduction-fields"); container.replaceChildren();
  images.forEach((image, index) => {
    const group = node("div", undefined, "view-editor"); group.dataset.source = image.src;
    const media = state.media.find((entry) => entry.reproduction.src === image.src);
    if (media) { const picture = document.createElement("img"); picture.src = `/media/${media.id}/thumb`; picture.alt = image.alt; group.append(picture); }
    group.append(node("p", `View ${index+1} · ${image.width}×${image.height} pixels`), createSelect("Role", "view-role", roles, image.role), createInput("Alt text", "view-alt", image.alt), createInput("Optional caption", "view-caption", image.caption || ""));
    const controls = node("div", undefined, "view-controls");
    controls.append(button("Up", () => moveView(index, -1)), button("Down", () => moveView(index, 1)), button("Remove view from draft", () => { const values = reproductionValues(); values.splice(index,1); renderReproductions(values); })); group.append(controls); container.append(group);
  });
}
function reproductionValues() {
  const originals = state.catalogue.artworks.find((work) => work.id === editingArtwork).reproductions;
  return [...$("reproduction-fields").children].map((group) => ({ ...originals.find((image) => image.src === group.dataset.source), role: group.querySelector('[name="view-role"]').value, alt: group.querySelector('[name="view-alt"]').value.trim(), caption: group.querySelector('[name="view-caption"]').value.trim() || undefined }));
}
function moveView(index, direction) { const values = reproductionValues(), other = index + direction; if (other < 0 || other >= values.length) return; [values[index],values[other]] = [values[other],values[index]]; renderReproductions(values); }
$("artwork-form").addEventListener("submit", action(async () => {
  const form = $("artwork-form"), previous = state.catalogue.artworks.find((work) => work.id === editingArtwork);
  const sizes = [];
  for (const kind of dimensions) {
    const width = number(form, `${kind}-width`), height = number(form, `${kind}-height`), depth = number(form, `${kind}-depth`);
    if (width !== undefined || height !== undefined || depth !== undefined) { if (width === undefined || height === undefined) throw new Error(`${kind} size needs width and height, or leave all its fields blank`); sizes.push({ kind, width, height, depth, unit: field(form, `${kind}-unit`).value }); }
  }
  const availability = { state: field(form,"availability").value, reviewed: field(form,"offerReviewed").checked, mode: optional(form,"offerMode") };
  const price = optional(form,"price"), currency = optional(form,"currency")?.toUpperCase();
  if (price) { if (!currency) throw new Error("A supplied price needs its currency"); availability.price = { amountMinor: priceMinor(price,currency), currency }; }
  const editionSize = number(form,"editionSize"), editionNumber = number(form,"editionNumber"), proofs = number(form,"artistProofs"), signed = optional(form,"signed"), numbered = optional(form,"numbered");
  let edition;
  if ([editionSize,editionNumber,proofs,signed,numbered].some((entry) => entry !== undefined)) {
    if (!editionSize) throw new Error("Supply edition size when entering edition facts");
    edition = { size: editionSize, number: editionNumber, artistProofs: proofs, signed: signed === undefined ? undefined : signed === "true", numbered: numbered === undefined ? undefined : numbered === "true" };
  }
  const record = { ...previous, title: field(form,"title").value.trim(), slug: field(form,"slug").value.trim(), aliases: lines(field(form,"aliases").value), medium: field(form,"medium").value, kind: field(form,"kind").value, date: date(form), techniques: lines(field(form,"techniques").value), materials: optional(form,"materials"), description: optional(form,"description"), dimensions: sizes, reproductions: reproductionValues(), published: field(form,"published").checked, featured: field(form,"featured").checked, selectedOrder: field(form,"featured").checked ? number(form,"selectedOrder") : undefined, availability, edition, framing: optional(form,"framing"), condition: optional(form,"condition") };
  await api("/api/artwork/save", { id: editingArtwork, record, note: field(form,"privateNote").value });
  await refresh({editor:true}); message("Saved private artwork. Previous review/source approval is invalidated by edits; no repository publication occurred.");
}));
function relationship() { return { purpose: $("intake-purpose").value, artworkId: $("intake-artwork").value, role: $("intake-role").value, assumeSrgb: $("assume-srgb").checked }; }
$("files").addEventListener("change", () => {
  $("selected-file-preview").replaceChildren();
  for (const file of $("files").files) { const card = node("div",undefined,"media-card"), image = document.createElement("img"), url = URL.createObjectURL(file); image.src = url; image.alt = `Explicitly selected local file ${file.name}`; image.addEventListener("load", () => URL.revokeObjectURL(url), {once:true}); card.append(image,node("p",file.name)); $("selected-file-preview").append(card); }
});
$("intake-form").addEventListener("submit", action(async () => {
  for (const file of $("files").files) {
    const bytes = await file.arrayBuffer(), sha256 = [...new Uint8Array(await crypto.subtle.digest("SHA-256",bytes))].map((byte) => byte.toString(16).padStart(2,"0")).join("");
    await api("/api/intake", { ...relationship(), name: file.name, lastModified: file.lastModified, sha256 }, bytes);
  }
  await refresh(); message("Selected files queued for private derivative generation. Watch Intake status; originals are unchanged.");
}));
$("load-snapshot").addEventListener("click", action(async () => { const choices = await api("/api/snapshot"); options($("snapshot-id"), choices.map((entry) => ({ id:entry.id,title:`${entry.id} · ${entry.orientation} · ${entry.width}×${entry.height}px` })),"Choose one frozen image"); message("Loaded only the configured frozen manifest. Select one image explicitly."); }));
$("import-snapshot").addEventListener("click", action(async () => { if (!$("snapshot-id").value) throw new Error("Choose a frozen image ID"); await api("/api/snapshot/import",{ id:$("snapshot-id").value,...relationship() }); await refresh(); message("Selected frozen image queued; no provisional catalogue/group/curation imported."); }));
function renderMedia() {
  $("media-library").replaceChildren();
  for (const media of state.media) {
    const card = node("div",undefined,"media-card"), image = document.createElement("img"); image.src = `/media/${media.id}/thumb`; image.alt = media.reproduction.alt;
    card.append(image,node("p",media.name),node("p",media.disposition,"hint"));
    const workLabel = node("label","Attach to artwork"), select = document.createElement("select"); select.setAttribute("aria-label","Attach to artwork"); options(select,state.catalogue.artworks); workLabel.append(select);
    const roleLabel = createSelect("View role","role",roles.filter((role)=>role!=="primary"),"alternate");
    card.append(workLabel,roleLabel,button("Attach this view",async()=>{ await api("/api/media/attach",{mediaId:media.id,artworkId:select.value,role:roleLabel.querySelector("select").value}); await refresh({editor:true}); message("View attached to the explicitly selected work; public source unchanged."); })); $("media-library").append(card);
  }
}
function sequence(container, ids, changed) {
  container.replaceChildren(); ids.forEach((id,index)=>{
    const work=state.catalogue.artworks.find((work)=>work.id===id), item=node("li",work?.title||id), controls=node("div",undefined,"sequence-controls");
    for(const [label,direction] of [["Up",-1],["Down",1]]) controls.append(button(label,()=>{const other=index+direction;if(other<0||other>=ids.length)return;[ids[index],ids[other]]=[ids[other],ids[index]];changed();}));
    controls.append(button("Remove",()=>{ids.splice(index,1);changed();})); item.append(controls); container.append(item);
  });
}
function renderProjects() {
  $("project-list").replaceChildren(); for(const project of state.catalogue.projects) $("project-list").append(button(`${project.title} · ${state.workflow[project.id]?.approved?"Public-source approved":"Private working copy"}`,()=>openProject(project.id)));
}
function openProject(id) {
  editingProject=id||null; projectMembers=[]; const form=$("project-form");form.hidden=false;form.reset();$("project-id").textContent=id||"New private project";
  if(id){const project=state.catalogue.projects.find((entry)=>entry.id===id);for(const name of ["title","slug","description","published"])formSet(form,name,project[name]);formSet(form,"aliases",project.aliases.join("\n"));for(const name of ["certainty","year","endYear"])formSet(form,name,project.date?.[name]);formSet(form,"privateNote",state.notes[id]);projectMembers=[...project.memberIds];}
  renderProjectSequence();
}
function renderProjectSequence(){sequence($("project-members"),projectMembers,renderProjectSequence);}
$("new-project").addEventListener("click",()=>openProject());
$("add-project-member").addEventListener("click",action(()=>{const id=$("project-add-member").value;if(!id||projectMembers.includes(id))throw new Error("Choose a new unique member");projectMembers.push(id);renderProjectSequence();}));
$("project-form").addEventListener("submit",action(async()=>{
  const form=$("project-form"), old=editingProject?state.catalogue.projects.find((entry)=>entry.id===editingProject):{};
  const project=await api("/api/project/save",{record:{...old,id:editingProject||undefined,slug:optional(form,"slug"),title:field(form,"title").value.trim(),aliases:lines(field(form,"aliases").value),date:date(form,true),description:optional(form,"description"),memberIds:projectMembers,published:field(form,"published").checked},note:field(form,"privateNote").value});
  await refresh();openProject(project.id);message("Saved private project and exact ordered membership; no provisional series promotion.");
}));
function renderSelected(){sequence($("selected-sequence"),selected,renderSelected);}
function openCuration(){selected=state.catalogue.artworks.filter((work)=>work.featured).sort((a,b)=>(a.selectedOrder??999999)-(b.selectedOrder??999999)).map((work)=>work.id);renderSelected();$("homepage-lead").value=state.catalogue.artworks.find((work)=>work.homepageLead)?.id||"";}
$("add-selected").addEventListener("click",action(()=>{const id=$("selected-add-work").value;if(!id||selected.includes(id))throw new Error("Choose an artwork not already selected");selected.push(id);renderSelected();}));
$("save-curation").addEventListener("click",action(async()=>{await api("/api/curation",{selectedIds:selected,homepageLeadId:$("homepage-lead").value});await refresh();openCuration();message("Saved private Selected Work sequence and unique homepage lead; prior approval is invalidated.");}));
function reviewRecord(){const id=$("review-record").value;return [...state.catalogue.artworks,...state.catalogue.projects].find((record)=>record.id===id);}
function showReview(){const record=reviewRecord();$("review-phase").textContent=record?phase(record):"Choose a record";$("approval-record").textContent=record?JSON.stringify({record,derivatives:record.reproductions?.flatMap((image)=>[image.src,...image.variants.map((variant)=>variant.src)])||[],privateNotesAndSourcePathsExcluded:true},null,2):"";}
function renderReview(){options($("review-record"),[...state.catalogue.artworks,...state.catalogue.projects]);showReview();$("export-records").replaceChildren();for(const record of [...state.catalogue.artworks,...state.catalogue.projects]){const label=node("label",undefined,"check"),input=document.createElement("input");input.type="checkbox";input.value=record.id;input.dataset.kind="reproductions"in record?"artwork":"project";label.append(input,document.createTextNode(`${record.title} · ${state.workflow[record.id]?.approved?"Approved digest":"Approval required"}`));$("export-records").append(label);}}
$("review-record").addEventListener("change",showReview);
$("build-preview").addEventListener("click",action(async()=>{
  message("Building current production-component draft preview…");$("build-preview").disabled=true;
  try{currentPreview=await api("/api/preview/build",{});await refresh();$("preview-links").replaceChildren();const record=state.catalogue.artworks.find((work)=>work.id===editingArtwork)||state.catalogue.artworks[0];const paths=[["Homepage","/"],["Selected Work","/work/"],["Archive","/archive/"],["Projects","/projects/"],["Artwork",`/artwork/${record.slug}/`],["Medium",`/work/${record.medium}/`],...state.catalogue.projects.map((project)=>[project.title,`/projects/${project.slug}/`])];for(const[label,path]of paths){const link=node("a",`Preview ${label}`);link.href=currentPreview.origin+path;link.target="_blank";link.rel="noopener noreferrer";$("preview-links").append(link);}message("Private current-component preview ready. Open the relevant pages, then explicitly record local review.");}finally{$("build-preview").disabled=false;}
}));
$("mark-reviewed").addEventListener("click",action(async()=>{const record=reviewRecord();if(!record)throw new Error("Choose a record");await api("/api/review",{id:record.id});await refresh();$("review-record").value=record.id;showReview();message("Local review recorded; public-source approval remains a separate action.");}));
$("approve-source").addEventListener("click",action(async()=>{const record=reviewRecord();if(!record)throw new Error("Choose a record");await api("/api/approve",{id:record.id,confirmation:$("approval-confirmation").value,rightsConfirmed:$("rights-confirmed").checked});$("approval-confirmation").value="";$("rights-confirmed").checked=false;await refresh();$("review-record").value=record.id;showReview();message("Exact public-source approval recorded. No repository files written; prepare a separate dry-run plan.");}));
$("prepare-export").addEventListener("click",action(async()=>{const checked=[...$("export-records").querySelectorAll("input:checked")];exportPlan=await api("/api/export/plan",{artworkIds:checked.filter((input)=>input.dataset.kind==="artwork").map((input)=>input.value),projectIds:checked.filter((input)=>input.dataset.kind==="project").map((input)=>input.value)});$("export-plan").textContent=JSON.stringify(exportPlan,null,2);$("write-export").disabled=!exportPlan.repositoryWritesEnabled;message("Dry-run prepared. Review exact canonical JSON, derivative hashes and Git-visible paths; no public files changed.");}));
$("write-export").addEventListener("click",action(async()=>{if(!exportPlan)throw new Error("Prepare a current dry-run first");const result=await api("/api/export/write",{token:exportPlan.token,confirmation:$("export-confirmation").value});$("export-confirmation").value="";exportPlan=null;$("export-plan").textContent=JSON.stringify(result,null,2);await refresh();message("Approved public-source files written. No Git commit, deployment or launch-manifest approval performed.");}));
for(const control of document.querySelectorAll("[data-tab]"))control.addEventListener("click",()=>{for(const panel of document.querySelectorAll(".tab-panel"))panel.hidden=panel.id!==control.dataset.tab;for(const item of document.querySelectorAll("[data-tab]"))item.setAttribute("aria-current",item===control?"page":"false");if(control.dataset.tab==="curation")openCuration();});
$("refresh").addEventListener("click",action(()=>refresh({editor:true})));
try{const session=await(await fetch("/api/session")).json();token=session.token;await refresh();message("Private local Studio ready. Start with explicitly selected images; nothing is automatically public.");setInterval(async()=>{if(state.jobs.some((job)=>job.status==="running")){try{await refresh();}catch(error){message(error.message,true);}}},1500);}catch(error){message(error.message,true);}
