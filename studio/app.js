const $ = (id) => document.getElementById(id);
const field = (form, name) => form.elements.namedItem(name);
const lines = (value) => value.split(/\n/).map((value) => value.trim()).filter(Boolean);
let token, state, editingArtwork, editingProject, editingImages = [], projectMembers = [], selected = [], leadId = "", exportPlan, currentPreview;
let editorDirty = false, selectedDirty = false, intakeTarget = "", mediaTarget = "", pendingEditorJob;
let colourBatch = null, selectionRevision = 0, inspecting = false, savingDraft = false;
let previewing = false, validationAttempted = false, validationIssues = [];
let previewPopupBusy = false, navigationReady = false, studioView = {tab:"collection",artworkId:null};
const sessionEditors = new Map();
const errorNodes = new Map();
const currentJobs = new Set();
const mediaSelection = new Set(), incomingJobs = new Map();
const roles = [
  ["primary", "Primary image"], ["detail", "Detail"], ["alternate", "Alternate view"],
  ["framed", "Framed view"], ["installation", "Installation view"],
  ["process", "Process image"], ["documentation", "Documentation"], ["reverse", "Reverse view"],
];
const dimensions = ["image", "sheet", "framed", "object"];
function humanReason(text) {
  if (/Missing ICC profile|Untagged source requires/i.test(text)) return "This image needs a colour-profile choice. Choose Use sRGB for this image, or choose another image.";
  if (/unsupported image format|Input buffer|Vips|corrupt|cannot be read/i.test(text)) return "This photo could not be read. Choose a supported JPEG, PNG, TIFF, WebP or AVIF export.";
  return String(text).replaceAll("--assume-srgb", "Use sRGB for this image");
}
function message(text, error = false) { $("message").textContent = humanReason(text); $("message").setAttribute("role", error ? "alert" : "status"); }
function node(tag, text, className) { const element = document.createElement(tag); if (text !== undefined) element.textContent = text; if (className) element.className = className; return element; }
function action(handler) { return async (event) => { event?.preventDefault(); try { await handler(event); } catch (error) { message(error.message, true); } }; }
function button(text, handler) { const element = node("button", text); element.type = "button"; element.addEventListener("click", action(handler)); return element; }
async function api(path, data, raw) {
  const headers = { "x-studio-token": token };
  if (raw) headers["x-studio-options"] = encodeURIComponent(JSON.stringify(data));
  else if (data !== undefined) headers["Content-Type"] = "application/json";
  const response = await fetch(path, { method: data === undefined ? "GET" : "POST", headers, body: raw ?? (data === undefined ? undefined : JSON.stringify(data)) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "This change could not be saved");
  return result;
}
function options(select, values, empty = "Choose") {
  const old = select.value; select.replaceChildren(new Option(empty, ""));
  for (const entry of values) select.add(new Option(entry.title || entry.id, entry.id));
  if ([...select.options].some((option) => option.value === old)) select.value = old;
}
function roleOptions(select, includePrimary = true) {
  select.replaceChildren();
  for (const [value, label] of roles) if (includePrimary || value !== "primary") select.add(new Option(label, value));
  select.value = "alternate";
}
function title(work) { return state.workflow[work.id]?.titleProvided ? work.title : "Untitled artwork"; }
function dateLabel(work) {
  if (!work.date || work.date.certainty === "unknown") return "";
  return work.date.label || `${work.date.certainty === "circa" ? "c. " : ""}${work.date.year}${work.date.endYear ? "–" + work.date.endYear : ""}`;
}
function phase(record) {
  const actual = state.actualPublic.some((work) => work.id === record.id);
  return [actual ? "On public site · editing a draft copy" : "Draft", record.featured ? "Selected Work" : "", record.homepageLead ? "Homepage image" : ""].filter(Boolean).join(" · ");
}
function mediaFor(image) { return state.media.find((entry) => entry.reproduction.src === image?.src); }
function imageFor(work) { return mediaFor(work.reproductions.find((image) => image.role === "primary") || work.reproductions[0]); }
function thumb(media, alt) {
  const frame = node("span", undefined, "thumb-frame");
  if (media) { const image = document.createElement("img"); image.src = `/media/${media.id}/thumb`; image.alt = alt || ""; frame.append(image); }
  else frame.append(node("span", "Photo unavailable", "hint"));
  return frame;
}
function workCard(work, label, handler, active = false) {
  const card = button("", handler); card.className = "thumbnail-card"; card.dataset.artworkId = work.id;
  card.setAttribute("aria-label", `${label} ${title(work)}`); card.setAttribute("aria-pressed", String(active));
  card.append(thumb(imageFor(work), title(work)), node("strong", title(work)));
  if (dateLabel(work)) card.append(node("small", dateLabel(work)));
  if (active) card.append(node("span", label === "Open" ? "Editing" : label === "Current homepage image" ? "Current homepage image" : "Chosen", "selection-mark"));
  return card;
}
function workPicker(container, label, handler, active, exclude = []) {
  container.replaceChildren();
  for (const work of state.catalogue.artworks) if (!exclude.includes(work.id)) container.append(workCard(work, label, () => handler(work.id), work.id === active));
  if (!container.children.length) container.append(node("p", "No other artworks to choose yet.", "hint"));
}
function showTab(id) {
  for (const panel of document.querySelectorAll(".tab-panel")) panel.hidden = panel.id !== id;
  for (const control of document.querySelectorAll("[data-tab]")) control.setAttribute("aria-current", control.dataset.tab === id ? "page" : "false");
  if (id === "curation") openCuration();
}
function rememberEditor() {
  if (!editingArtwork || !state?.catalogue.artworks.some((work)=>work.id===editingArtwork)) return;
  syncPrimaryAlt();
  sessionEditors.set(editingArtwork, {
    controls:[...$("artwork-form").querySelectorAll("[name]")].map((control)=>({name:control.name,type:control.type,value:control.value,checked:control.checked})),
    images:structuredClone(editingImages),dirty:editorDirty,validationAttempted,
    details:[...$("artwork-form").querySelectorAll("details")].map((details)=>details.open),
  });
}
function restoreEditor(snapshot) {
  editingImages=structuredClone(snapshot.images);renderReproductions();
  const controls=[...$("artwork-form").querySelectorAll("[name]")],used=new Set();
  for(const saved of snapshot.controls){const control=controls.find((control)=>!used.has(control)&&control.name===saved.name&&control.type===saved.type);if(control){control.value=saved.value;control.checked=saved.checked;used.add(control);}}
  for(const [index,details]of [...$("artwork-form").querySelectorAll("details")].entries())details.open=snapshot.details[index]||false;
  editorDirty=snapshot.dirty;validationAttempted=snapshot.validationAttempted;updateSimpleFields();
}
function updateLocation(view,{replace=false}={}) {
  if(!navigationReady)return;
  const same=studioView.tab===view.tab&&studioView.artworkId===view.artworkId;
  studioView={...view};
  const fragment=view.artworkId?`#artwork/${encodeURIComponent(view.artworkId)}`:view.tab==="collection"?"#artworks":`#tab/${view.tab}`;
  // Private loopback URL/state contain only view + neutral identity, never entered metadata.
  if(!same||replace){const method=replace?"replaceState":"pushState";history[method]({studio:1,...view},"",location.pathname+location.search+fragment);}
}
function navigateTab(id,{historyMode="push"}={}) {
  rememberEditor();showTab(id);
  if(id==="collection"){ $("artwork-form").hidden=true;$("intake-panel").hidden=true;$("work-list").scrollIntoView({block:"start",behavior:"instant"}); }
  updateLocation({tab:id,artworkId:null},{replace:historyMode==="replace"});
}
function viewFromLocation() {
  const artwork=location.hash.match(/^#artwork\/([a-z][a-z0-9-]*)$/),tab=location.hash.match(/^#tab\/(media|projects|curation|review)$/);
  if(artwork&&state.catalogue.artworks.some((work)=>work.id===artwork[1]))return {tab:"collection",artworkId:artwork[1]};
  return {tab:tab?.[1]||"collection",artworkId:null};
}
function restoreNavigation(view) {
  rememberEditor();studioView={...view};
  if(view.artworkId)openArtwork(view.artworkId,{historyMode:"none"});
  else{showTab(view.tab);if(view.tab==="collection"){$("artwork-form").hidden=true;$("intake-panel").hidden=true;$("work-list").scrollIntoView({block:"start",behavior:"instant"});}}
}
window.addEventListener("popstate",()=>{if(navigationReady)restoreNavigation(viewFromLocation());});
window.addEventListener("beforeunload",(event)=>{if(editorDirty||[...sessionEditors.values()].some((draft)=>draft.dirty))event.preventDefault();});
function showIntake(purpose = "artwork", target = "") {
  resetColourSelection({ clearFiles: true });
  showTab("collection"); $("intake-panel").hidden = false;
  $("artwork-form").hidden = true;
  document.querySelector(`[name="purpose"][value="${purpose}"]`).checked = true;
  intakeTarget = target; updateIntake(); $("intake-panel").scrollIntoView({ block: "start" });
}
function purpose() { return document.querySelector('[name="purpose"]:checked').value; }
function updateIntake() {
  const attach = purpose() === "attach";
  $("intake-target-panel").hidden = !attach;
  $("intake-submit").textContent = attach ? "Add photo to artwork" : purpose() === "media" ? "Keep as process / reference" : "Create draft";
  workPicker($("intake-targets"), "Choose artwork", (id) => { intakeTarget = id; updateIntake(); }, intakeTarget);
  $("intake-target-summary").textContent = intakeTarget ? `Adding to: ${title(state.catalogue.artworks.find((work) => work.id === intakeTarget))}` : "Click the artwork this photo belongs to.";
}
function relationship() {
  if (purpose() === "attach" && !intakeTarget) throw new Error("Click an artwork to choose where this photo belongs");
  return { purpose: purpose(), artworkId: intakeTarget, role: $("intake-role").value === "primary" ? "alternate" : $("intake-role").value };
}
function renderProgress() {
  const jobs = state.jobs.filter((job) => currentJobs.has(job.id) || job.status === "running"), counts = new Map();
  for (const job of jobs) {
    const text = job.status === "running" ? "Preparing…" : job.status === "complete" ? "Ready" : `Failed — ${humanReason(job.error || "This photo could not be prepared.")}`;
    counts.set(text, (counts.get(text) || 0) + 1);
  }
  $("jobs-panel").hidden = !jobs.length;
  $("jobs").replaceChildren(...[...counts].map(([text, count]) => node("p", `${text}${count > 1 ? ` (${count} images)` : ""}`)));
}
async function refresh({ editor = false } = {}) {
  state = await api("/api/state");
  $("write-mode").textContent = state.repositoryWritesEnabled ? "Repository writing is enabled for this run. Exact owner approval, dry-run and typed confirmation are still required." : "Repository writes are disabled. Start with --allow-public-export only after granting explicit public-source permission.";
  $("work-list").replaceChildren();
  for (const work of state.catalogue.artworks) { const card = workCard(work, "Open", () => openArtwork(work.id), work.id === editingArtwork); card.append(node("small", phase(work))); $("work-list").append(card); }
  if (!state.catalogue.artworks.length) $("work-list").append(node("p", "Start by adding a photo.", "hint"));
  renderProgress();
  renderMedia(); renderProjects(); renderReview(); updateIntake();
  if (editor && editingArtwork) openArtwork(editingArtwork, { focus: false, force:true,historyMode:"none" });
  await finishIncomingJobs();
}
async function makePrimary(artworkId, source) {
  const work = state.catalogue.artworks.find((work) => work.id === artworkId);
  await api("/api/artwork/save", { id: artworkId, record: { ...work, reproductions: work.reproductions.map((image) => ({ ...image, role: image.src === source ? "primary" : image.role === "primary" ? "alternate" : image.role })) } });
}
async function finishIncomingJobs() {
  for (const [id, context] of [...incomingJobs]) {
    const job = state.jobs.find((job) => job.id === id); if (!job || job.status === "running") continue;
    incomingJobs.delete(id);
    if (context.revision !== undefined && context.revision !== selectionRevision) continue;
    if (job.status === "error") { if (pendingEditorJob === id) pendingEditorJob = null; message(`Failed — ${humanReason(job.error)}`, true); continue; }
    if (context.primary && job.result.artworkId) {
      const media = state.media.find((entry) => entry.id === job.result.mediaId);
      await makePrimary(job.result.artworkId, media.reproduction.src); state = await api("/api/state");
    }
    if (id === pendingEditorJob || (context.purpose === "attach" && !editorDirty)) {
      pendingEditorJob = null; openArtwork(job.result.artworkId); $("intake-panel").hidden = true; message("Ready. Your draft is open and editable.");
    }
  }
}
function formSet(form, name, value) { const control = field(form, name); if (control.type === "checkbox") control.checked = value === true; else control.value = value ?? ""; }
function optional(form, name) { return field(form, name).value.trim() || undefined; }
function number(form, name) { const value = optional(form, name); return value === undefined ? undefined : Number(value); }
function date(form, optionalDate = false) {
  const certainty = field(form, "certainty").value; if (!certainty && optionalDate) return undefined;
  return { certainty, ...(certainty === "unknown" ? {} : { year: number(form, "year"), endYear: number(form, "endYear") }), ...(field(form, "dateLabel") && optional(form, "dateLabel") ? { label: optional(form, "dateLabel") } : {}) };
}
function currencyPrecision(currency) { return new Intl.NumberFormat("en-CA", { style: "currency", currency }).resolvedOptions().maximumFractionDigits; }
function priceMinor(value, currency) {
  if (!/^\d+(?:\.\d+)?$/.test(value)) throw new Error("Enter a positive decimal price without currency symbols");
  const precision = currencyPrecision(currency), [whole, fraction = ""] = value.split(".");
  if (fraction.length > precision) throw new Error(`This currency supports ${precision} decimal places`);
  const amount = Number(whole + fraction.padEnd(precision, "0"));
  if (!Number.isSafeInteger(amount) || amount <= 0) throw new Error("Price must be positive and within supported currency precision");
  return amount;
}
function priceDisplay(price) { if (!price) return ""; const precision = currencyPrecision(price.currency), text = String(price.amountMinor).padStart(precision + 1, "0"); return precision ? text.slice(0, -precision) + "." + text.slice(-precision) : text; }
function createInput(label, name, value = "", type = "text") { const wrapper = node("label", label), input = document.createElement("input"); input.name = name; input.type = type; input.value = value; if (type === "number") { input.step = "any"; input.min = "0"; } wrapper.append(input); return wrapper; }
function createSelect(label, name, values, selectedValue) { const wrapper = node("label", label), select = document.createElement("select"); select.name = name; select.setAttribute("aria-label", label); for (const value of values) select.add(new Option(Array.isArray(value) ? value[1] : value, Array.isArray(value) ? value[0] : value)); select.value = selectedValue; wrapper.append(select); return wrapper; }
function updateSimpleFields() {
  const form = $("artwork-form"); $("year-field").hidden = field(form, "certainty").value === "unknown";
  $("simple-offer").hidden = !["available", "edition-available"].includes(field(form, "availability").value);
  $("price-fields").hidden = field(form, "offerMode").value !== "price";
  $("date-year-guidance").textContent = field(form,"certainty").value === "unknown" ? "Unknown date: a year is not required. Exact and Circa require a valid year from 1 to 9999." : `${field(form,"certainty").value === "exact" ? "Exact" : "Circa"} date: Year is required (1–9999). Choose Unknown if the year is not known.`;
  if (validationAttempted) renderValidation(artworkIssues(), { focus: false });
  updateEditorActions();
}
function prominentImage(media) { $("editor-image").replaceChildren(); if (media) { const image = document.createElement("img"); image.src = `/media/${media.id}/primary`; image.alt = media.reproduction.alt; $("editor-image").append(image); } }
function artworkIssues({ preview = false } = {}) {
  const form = $("artwork-form"), certainty = field(form,"certainty").value, issues = [];
  const add = (name, text) => { const control = typeof name === "string" ? field(form,name) : name; if (control && !issues.some((issue) => issue.control === control)) issues.push({control,text}); };
  const supportedYear = (value) => /^\d{1,4}$/.test(value || "") && Number(value) >= 1 && Number(value) <= 9999;
  if (certainty !== "unknown") {
    const year = optional(form,"year"), end = optional(form,"endYear");
    if (!supportedYear(year)) add("year",`${certainty === "exact" ? "Exact" : "Circa"} dates require a valid year from 1 to 9999. Enter a year, or choose Unknown.`);
    if (end !== undefined && (!supportedYear(end) || (supportedYear(year) && Number(end) < Number(year)))) add("endYear","Enter a supported end year at or after the start year, or leave the optional end year blank.");
  }
  for (const kind of dimensions) {
    const width = number(form, `${kind}-width`), height = number(form, `${kind}-height`), depth = number(form, `${kind}-depth`);
    if ([width,height,depth].some((value) => value !== undefined)) {
      if (!(width > 0)) add(`${kind}-width`,`Enter a positive width and height for the ${kind} size, or leave this optional size blank.`);
      if (!(height > 0)) add(`${kind}-height`,`Enter a positive width and height for the ${kind} size, or leave this optional size blank.`);
      if (depth !== undefined && !(depth > 0)) add(`${kind}-depth`,`Enter a positive ${kind} depth, or leave the optional depth blank.`);
    }
  }
  const edition = ["editionSize","editionNumber","artistProofs","signed","numbered"].some((name) => optional(form,name) !== undefined);
  if (edition && !(number(form,"editionSize") > 0)) add("editionSize","Enter an edition size, or clear the optional edition information.");
  const availability = field(form,"availability").value, offered = ["available","edition-available"].includes(availability);
  if (availability !== "unknown" && !field(form,"offerReviewed").checked) add("offerReviewed","Check the availability information, or choose Not confirmed yet.");
  if (offered && !optional(form,"offerMode")) add("offerMode","Choose price by enquiry or a supplied price for an available work.");
  if (offered && field(form,"offerMode").value === "price") {
    const price = optional(form,"price"), currency = optional(form,"currency")?.toUpperCase();
    if (!price) add("price","Enter a price, or choose Price by enquiry.");
    if (!currency || !/^[A-Z]{3}$/.test(currency)) add("currency","Enter the three-letter currency for this price.");
    if (price && currency && /^[A-Z]{3}$/.test(currency)) try { priceMinor(price,currency); } catch (error) { add("price",error.message); }
  }
  if ((editingImages.length || preview) && editingImages.filter((image) => image.role === "primary").length !== 1) add($("add-artwork-view"),"Choose one primary photo before previewing this artwork.");
  for (const control of [...form.elements]) {
    if (!control.validity || control.disabled || (certainty === "unknown" && ["year","endYear"].includes(control.name))) continue;
    if (!control.validity.valid) add(control,`${control.closest("label")?.firstChild?.textContent.trim() || "This field"}: ${control.validationMessage}`);
  }
  return issues;
}
function clearValidation() {
  for (const [control, error] of errorNodes) {
    control.removeAttribute("aria-invalid");
    const remaining = (control.getAttribute("aria-describedby") || "").split(/\s+/).filter((id) => id && id !== error.id);
    if (remaining.length) control.setAttribute("aria-describedby",remaining.join(" ")); else control.removeAttribute("aria-describedby");
    error.remove();
  }
  errorNodes.clear(); validationIssues = [];
  for (const id of ["editor-validation-summary","editor-validation-summary-bottom"]) { $(id).hidden = true; $(id).textContent = ""; }
}
function renderValidation(issues, { focus = true, actionName = "Save" } = {}) {
  clearValidation(); validationIssues = issues;
  for (const [index, issue] of issues.entries()) {
    const error = node("p",issue.text,"field-error"); error.id = `artwork-field-error-${issue.control.name || "photo"}-${index}`;
    issue.control.setAttribute("aria-invalid","true");
    issue.control.setAttribute("aria-describedby",[issue.control.getAttribute("aria-describedby"),error.id].filter(Boolean).join(" "));
    (issue.control.closest("label") || issue.control).after(error); errorNodes.set(issue.control,error);
  }
  const summary = issues.length ? `${actionName === "Preview" ? "Preview blocked" : "Draft not saved"} — ${issues[0].text}` : "";
  for (const id of ["editor-validation-summary","editor-validation-summary-bottom"]) { $(id).textContent = summary; $(id).hidden = !summary; }
  if (focus && issues.length) {
    showTab("collection"); $("artwork-form").hidden = false;
    for (let parent = issues[0].control.parentElement; parent; parent = parent.parentElement) if (parent.tagName === "DETAILS") parent.open = true;
    issues[0].control.scrollIntoView({block:"center",behavior:"instant"}); issues[0].control.focus({preventScroll:true});
    message(summary,true);
  }
  updateEditorActions();
}
function validateEditedArtwork(actionName = "Save") {
  validationAttempted = true;
  const issues = artworkIssues({preview:actionName === "Preview"}); renderValidation(issues,{actionName});
  return issues.length === 0;
}
function updateEditorActions() {
  const busy = savingDraft || previewing || previewPopupBusy;
  for (const control of $("artwork-form").querySelectorAll('button[type="submit"]')) { control.disabled = busy || !editingArtwork; control.setAttribute("aria-describedby",control.closest(".form-actions") ? "editor-action-note-bottom editor-validation-summary-bottom" : "editor-action-note editor-validation-summary"); }
  for (const id of ["preview-artwork","preview-artwork-bottom"]) { $(id).disabled = busy || !editingArtwork; $(id).setAttribute("aria-describedby",id.endsWith("bottom") ? "editor-action-note-bottom editor-validation-summary-bottom" : "editor-action-note editor-validation-summary"); }
  $("editor-action-note").textContent = savingDraft ? "Saving draft…" : previewing ? "Preparing the current edited draft preview…" : !editingArtwork ? "Prepare a photo before editing this draft." : validationIssues.length ? "Correct the marked field, then click Save draft or Preview artwork again. Both actions remain available." : "Save draft checks your entries. Preview artwork validates and privately saves current edits before previewing. Optional facts may stay unknown.";
  $("editor-action-note-bottom").textContent = $("editor-action-note").textContent;
}
function openArtwork(id, { focus = true, force = false, historyMode = "push" } = {}) {
  if(!force&&editingArtwork===id&&editorDirty){showTab("collection");$("artwork-form").hidden=false;if(historyMode!=="none")updateLocation({tab:"collection",artworkId:id},{replace:historyMode==="replace"});if(focus){$("artwork-form").scrollIntoView({block:"start",behavior:"instant"});field($("artwork-form"),"title").focus({preventScroll:true});}return;}
  if(!force)rememberEditor();
  const cached=!force&&sessionEditors.get(id)?.dirty?sessionEditors.get(id):null;
  clearValidation(); validationAttempted = false;
  editingArtwork = id; pendingEditorJob = null; editorDirty = false; const work = state.catalogue.artworks.find((record) => record.id === id); if (!work) return;
  showTab("collection"); const form = $("artwork-form"); form.hidden = false; form.reset();
  for (const control of form.querySelectorAll("input,select,textarea,button")) control.disabled = false;
  $("editor-title").textContent = title(work); $("artwork-id").textContent = `Neutral identity: ${work.id}`; $("artwork-phase").textContent = phase(work);
  for (const name of ["slug", "medium", "kind", "materials", "description", "framing", "condition", "published", "featured", "selectedOrder"]) formSet(form, name, work[name]);
  formSet(form, "title", state.workflow[id].titleProvided ? work.title : ""); formSet(form, "aliases", work.aliases.join("\n")); formSet(form, "techniques", work.techniques.join("\n"));
  for (const name of ["certainty", "year", "endYear"]) formSet(form, name, work.date[name]); formSet(form, "dateLabel", work.date.label);
  const offer = work.availability; formSet(form, "availability", offer.state); formSet(form, "offerMode", offer.mode); formSet(form, "offerReviewed", offer.reviewed); formSet(form, "currency", offer.price?.currency); formSet(form, "price", priceDisplay(offer.price));
  for (const [name, key] of [["editionSize", "size"], ["editionNumber", "number"], ["artistProofs", "artistProofs"]]) formSet(form, name, work.edition?.[key]);
  for (const name of ["signed", "numbered"]) formSet(form, name, work.edition?.[name] === undefined ? "" : String(work.edition[name]));
  formSet(form, "privateNote", state.notes[id]);
  const object = work.dimensions.find((entry) => entry.kind === "object"); for (const key of ["width", "height", "depth"]) formSet(form, `object-${key}`, object?.[key]); formSet(form, "object-unit", object?.unit || "cm");
  $("dimension-fields").replaceChildren();
  for (const kind of dimensions.filter((kind) => kind !== "object")) { const size = work.dimensions.find((entry) => entry.kind === kind), group = node("div"); group.append(node("h3", `${kind === "sheet" ? "Paper / sheet" : kind[0].toUpperCase() + kind.slice(1)} size`)); for (const key of ["width", "height", "depth"]) group.append(createInput(key, `${kind}-${key}`, size?.[key] ?? "", "number")); group.append(createSelect("Unit", `${kind}-unit`, ["cm", "mm", "in"], size?.unit || "cm")); $("dimension-fields").append(group); }
  editingImages = structuredClone(work.reproductions); renderReproductions(); renderArtworkProjects(); prominentImage(imageFor(work)); updateSimpleFields();
  $("artwork-technical").replaceChildren(); for (const media of state.media.filter((media) => work.reproductions.some((image) => image.src === media.reproduction.src))) $("artwork-technical").append(node("p", `${media.name} · source SHA256 ${media.sourceSha256}`, "technical-block"));
  renderWorkListSelection();
  if(cached)restoreEditor(cached);
  $("collection").insertBefore(form, $("work-list"));
  if(historyMode!=="none")updateLocation({tab:"collection",artworkId:id},{replace:historyMode==="replace"});
  if (focus) { form.scrollIntoView({ block: "start", behavior: "instant" }); field(form,"title").focus({ preventScroll: true }); }
}
function renderWorkListSelection() { for (const card of $("work-list").querySelectorAll("[data-artwork-id]")) card.setAttribute("aria-pressed", String(card.dataset.artworkId === editingArtwork)); }
function renderArtworkProjects() {
  $("work-projects").replaceChildren();
  for (const project of state.catalogue.projects) { const link = button(project.title, () => { showTab("projects"); openProject(project.id); }); link.className = "project-chip"; if (project.memberIds.includes(editingArtwork)) link.prepend(node("span", "✓ ")); $("work-projects").append(link); }
  if (!state.catalogue.projects.length) $("work-projects").append(button("Create a project", () => { showTab("projects"); openProject(); }));
}
function syncPrimaryAlt() { const primary = editingImages.find((image) => image.role === "primary"); if (primary) primary.alt = field($("artwork-form"), "mainAlt").value.trim() || "Private selected image; alt text needs owner review"; }
function renderReproductions() {
  $("reproduction-fields").replaceChildren();
  const primary = editingImages.find((image) => image.role === "primary"); formSet($("artwork-form"), "mainAlt", primary?.alt);
  editingImages.forEach((image, index) => {
    const group = node("div", undefined, "view-editor"); group.dataset.source = image.src;
    const row = node("div", undefined, "photo-row"); const media = mediaFor(image); if (media) { const picture = document.createElement("img"); picture.src = `/media/${media.id}/thumb`; picture.alt = image.alt; row.append(picture); }
    row.append(node("strong", roles.find(([value]) => value === image.role)?.[1] || image.role)); group.append(row);
    const controls = node("div", undefined, "view-controls");
    controls.append(button("Move earlier", () => moveView(index, -1)), button("Move later", () => moveView(index, 1)), button("Remove photo", () => { syncPrimaryAlt(); editingImages.splice(index, 1); editorDirty = true; renderReproductions(); }));
    if (image.role !== "primary") controls.append(button("Use as primary image", () => { syncPrimaryAlt(); for (const entry of editingImages) if (entry === image) entry.role = "primary"; else if (entry.role === "primary") entry.role = "alternate"; editorDirty = true; renderReproductions(); prominentImage(media); }));
    group.append(controls);
    const details = node("details"), summary = node("summary", "Photo details");
    const role = createSelect("How should this image be used?", "view-role", roles, image.role), alt = createInput(`Photo description ${index + 1}`, "view-alt", image.alt), caption = createInput("Caption (optional)", "view-caption", image.caption || "");
    role.querySelector("select").addEventListener("change", (event) => {
      syncPrimaryAlt();
      if (event.target.value === "primary") { for (const entry of editingImages) if (entry === image) entry.role = "primary"; else if (entry.role === "primary") entry.role = "alternate"; }
      else image.role = event.target.value;
      editorDirty = true; renderReproductions();
    });
    alt.querySelector("input").addEventListener("input", (event) => { image.alt = event.target.value; if (image.role === "primary") formSet($("artwork-form"), "mainAlt", image.alt); editorDirty = true; });
    caption.querySelector("input").addEventListener("input", (event) => { image.caption = event.target.value.trim() || undefined; editorDirty = true; });
    details.append(summary, role, alt, caption, node("p", `${image.width}×${image.height} pixels · ${image.src}`, "technical-block")); group.append(details); $("reproduction-fields").append(group);
  });
  updateEditorActions();
}
function moveView(index, direction) { syncPrimaryAlt(); const other = index + direction; if (other < 0 || other >= editingImages.length) return; [editingImages[index], editingImages[other]] = [editingImages[other], editingImages[index]]; editorDirty = true; renderReproductions(); }
async function saveArtwork({ actionName = "Save" } = {}) {
  if (!editingArtwork) throw new Error("Wait until this photo is ready before saving");
  if (!validateEditedArtwork(actionName)) return null;
  const form = $("artwork-form"), previous = state.catalogue.artworks.find((work) => work.id === editingArtwork), sizes = [];
  for (const kind of dimensions) { const width = number(form, `${kind}-width`), height = number(form, `${kind}-height`), depth = number(form, `${kind}-depth`); if (width !== undefined || height !== undefined || depth !== undefined) { if (width === undefined || height === undefined) throw new Error(`${kind} size needs width and height, or leave its fields blank`); sizes.push({ kind, width, height, depth, unit: field(form, `${kind}-unit`).value }); } }
  const availability = { state: field(form, "availability").value, reviewed: field(form, "offerReviewed").checked };
  const offered = ["available", "edition-available"].includes(availability.state);
  if (offered) availability.mode = optional(form, "offerMode");
  const price = optional(form, "price"), currency = optional(form, "currency")?.toUpperCase(); if (offered && availability.mode === "price" && price) { if (!currency) throw new Error("A price needs its currency"); availability.price = { amountMinor: priceMinor(price, currency), currency }; }
  const editionSize = number(form, "editionSize"), editionNumber = number(form, "editionNumber"), proofs = number(form, "artistProofs"), signed = optional(form, "signed"), numbered = optional(form, "numbered"); let edition;
  if ([editionSize, editionNumber, proofs, signed, numbered].some((entry) => entry !== undefined)) { if (!editionSize) throw new Error("Supply an edition size when entering edition facts"); edition = { size: editionSize, number: editionNumber, artistProofs: proofs, signed: signed === undefined ? undefined : signed === "true", numbered: numbered === undefined ? undefined : numbered === "true" }; }
  syncPrimaryAlt();
  const record = { ...previous, title: field(form, "title").value.trim() || `Private draft ${previous.id} (title not supplied)`, slug: field(form, "slug").value.trim(), aliases: lines(field(form, "aliases").value), medium: field(form, "medium").value, kind: field(form, "kind").value, date: date(form), techniques: lines(field(form, "techniques").value), materials: optional(form, "materials"), description: optional(form, "description"), dimensions: sizes, reproductions: editingImages, published: field(form, "published").checked, featured: field(form, "featured").checked, selectedOrder: field(form, "featured").checked ? number(form, "selectedOrder") : undefined, availability, edition, framing: optional(form, "framing"), condition: optional(form, "condition") };
  savingDraft = true; updateEditorActions();
  try { await api("/api/artwork/save", { id: editingArtwork, record, note: field(form, "privateNote").value }); sessionEditors.delete(editingArtwork); await refresh({ editor: true }); message("Draft saved. Nothing has been made public."); return editingArtwork; }
  catch (error) {
    const name = /date|year/i.test(error.message) ? "year" : /slug|alias|address/i.test(error.message) ? "slug" : /price|currency/i.test(error.message) ? "price" : /availability|reviewed/i.test(error.message) ? "availability" : /edition/i.test(error.message) ? "editionSize" : "title";
    renderValidation([{control:field(form,name),text:humanReason(error.message)}],{actionName}); return null;
  }
  finally { savingDraft = false; updateEditorActions(); }
}
$("artwork-form").addEventListener("input", () => { editorDirty = true; updateSimpleFields(); });
$("artwork-form").addEventListener("submit", action(() => saveArtwork()));
for (const input of document.querySelectorAll('[name="purpose"]')) input.addEventListener("change", updateIntake);
$("show-intake").addEventListener("click", () => showIntake()); $("media-add-images").addEventListener("click", () => showIntake("media")); $("close-intake").addEventListener("click", () => { resetColourSelection({clearFiles:true}); $("intake-panel").hidden = true; $("artwork-form").hidden = !editingArtwork; });
$("add-artwork-view").addEventListener("click", () => showIntake("attach", editingArtwork));
function resetColourSelection({ clearFiles = false } = {}) {
  selectionRevision++; colourBatch = null; inspecting = false;
  $("colour-decision").hidden = true; $("colour-apply-batch").checked = false; $("intake-submit").disabled = false;
  currentJobs.clear();
  if (clearFiles) { $("files").value = ""; $("selected-file-preview").replaceChildren(); }
}
function selectedFilePreview() {
  $("selected-file-preview").replaceChildren();
  for (const file of $("files").files) {
    const card = node("div", undefined, "thumbnail-card"), image = document.createElement("img"), frame = node("span", undefined, "thumb-frame"), url = URL.createObjectURL(file);
    image.src = url; image.alt = "Selected photo"; image.addEventListener("load", () => URL.revokeObjectURL(url), { once: true }); frame.append(image); card.append(frame, node("small", file.name)); $("selected-file-preview").append(card);
  }
}
$("files").addEventListener("change", () => { resetColourSelection(); selectedFilePreview(); });
function showColourQuestion(batch) {
  if (batch.revision !== selectionRevision) return;
  const unanswered = batch.items.filter((item) => item.needsColourDecision && !item.useSrgb);
  if (!unanswered.length) return submitPreparedSelection(batch);
  colourBatch = batch; const item = unanswered[0], untaggedCount = batch.items.filter((image) => image.needsColourDecision).length;
  $("colour-image-scope").textContent = `${item.name} · image ${batch.items.indexOf(item) + 1} of ${batch.items.length}. This choice applies only to the current selection.`;
  $("colour-batch-option").hidden = untaggedCount < 2;
  $("colour-batch-scope").textContent = `Use sRGB for all ${untaggedCount} currently selected untagged images only`;
  $("colour-apply-batch").checked = false; $("colour-decision").hidden = false; $("intake-submit").disabled = true;
  $("colour-decision").scrollIntoView({ block: "center", behavior: "instant" }); $("use-srgb").focus({ preventScroll: true });
  message("Choose how to interpret this image before preparation. Nothing has been added as an artwork.");
}
async function submitPreparedSelection(batch) {
  if (batch.revision !== selectionRevision) return;
  colourBatch = null; $("colour-decision").hidden = true; $("colour-apply-batch").checked = false; $("intake-submit").disabled = true;
  try {
    for (const [index, item] of batch.items.entries()) {
      if (batch.revision !== selectionRevision) break;
      if (item.needsColourDecision && !item.useSrgb) throw new Error("Choose how to interpret this image before preparation");
      const settings = { ...batch.settings, assumeSrgb: item.useSrgb === true };
      const result = item.snapshotId ? await api("/api/snapshot/import", { id: item.snapshotId, ...settings }) : await api("/api/intake", { ...settings, name: item.file.name, lastModified: item.file.lastModified, sha256: item.sha256 }, item.bytes);
      currentJobs.add(result.jobId); incomingJobs.set(result.jobId, { purpose: settings.purpose, primary: settings.purpose === "attach" && batch.primary, revision:batch.revision });
      if (settings.purpose === "artwork" && index === 0) pendingEditorJob = result.jobId;
    }
    await refresh();
    if (state.jobs.some((job) => currentJobs.has(job.id) && job.status === "running")) message("Preparing… Your editor will open when the image is ready.");
  } finally { inspecting = false; $("intake-submit").disabled = false; }
}
$("use-srgb").addEventListener("click", action(async () => {
  const batch = colourBatch; if (!batch || batch.revision !== selectionRevision) return;
  const unanswered = batch.items.filter((item) => item.needsColourDecision && !item.useSrgb);
  if ($("colour-apply-batch").checked) for (const item of unanswered) item.useSrgb = true;
  else unanswered[0].useSrgb = true;
  await showColourQuestion(batch);
}));
$("choose-another-image").addEventListener("click", () => { resetColourSelection({ clearFiles: true }); $("artwork-form").hidden = true; message("Choose another image. No draft was created."); $("files").focus(); $("files").click(); });
$("intake-form").addEventListener("submit", action(async () => {
  if (editorDirty) throw new Error("Save the artwork you are editing before adding more photos");
  if (inspecting) return;
  const batch = { revision: selectionRevision, settings: relationship(), primary: $("intake-role").value === "primary", items: [] };
  if (batch.settings.purpose === "attach" && batch.primary && $("files").files.length > 1) throw new Error("Choose one primary image at a time");
  inspecting = true; $("intake-submit").disabled = true; message("Checking selected images…");
  try {
    for (const file of $("files").files) {
      const bytes = await file.arrayBuffer(), sha256 = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map((byte) => byte.toString(16).padStart(2, "0")).join("");
      const info = await api("/api/intake/inspect", { sha256 }, bytes);
      if (batch.revision !== selectionRevision) return;
      batch.items.push({ file, name: file.name, bytes, sha256, needsColourDecision: info.needsColourDecision, useSrgb: false });
    }
    if (!batch.items.length) throw new Error("Choose an image first");
    await showColourQuestion(batch);
  } catch (error) { inspecting = false; $("intake-submit").disabled = false; message(`Failed — ${humanReason(error.message)}`, true); }
}));
let snapshotOptions = [];
$("load-snapshot").addEventListener("click", action(async () => { snapshotOptions = await api("/api/snapshot"); options($("snapshot-id"), snapshotOptions.map((entry) => ({ id: entry.id, title: `${entry.id} · ${entry.orientation} · ${entry.width}×${entry.height}px` })), "Choose a frozen image"); }));
$("import-snapshot").addEventListener("click", action(async () => {
  const selected = snapshotOptions.find((entry) => entry.id === $("snapshot-id").value); if (!selected) throw new Error("Choose a frozen image in these technical controls");
  resetColourSelection();
  await showColourQuestion({ revision: selectionRevision, settings: relationship(), primary: $("intake-role").value === "primary", items: [{ snapshotId: selected.id, name: `Frozen image ${selected.id}`, needsColourDecision: !selected.hasEmbeddedProfile, useSrgb: false }] });
}));
function attachments(media) { return state.catalogue.artworks.filter((work) => work.reproductions.some((image) => image.src === media.reproduction.src)); }
function renderMedia() {
  $("media-library").replaceChildren(); state.media.forEach((media, index) => {
    const linked = attachments(media), card = button("", () => { mediaSelection.has(media.id) ? mediaSelection.delete(media.id) : mediaSelection.add(media.id); renderMedia(); }); card.className = "thumbnail-card"; card.dataset.mediaId = media.id; card.setAttribute("aria-label", `Select photo ${index + 1}`); card.setAttribute("aria-pressed", String(mediaSelection.has(media.id)));
    card.append(thumb(media, ""), node("strong", linked.length ? "Artwork photo" : media.disposition.includes("reference") ? "Process / reference only" : "Unattached photo"));
    card.append(node("small", linked.map(title).join(", ") || "Private")); if (mediaSelection.has(media.id)) card.append(node("span", "Selected", "selection-mark")); $("media-library").append(card);
  });
  $("media-selection-panel").hidden = !mediaSelection.size; $("media-selection-count").textContent = `${mediaSelection.size} photo${mediaSelection.size === 1 ? "" : "s"} selected`;
  workPicker($("media-targets"), "Attach to", (id) => { mediaTarget = id; renderMedia(); }, mediaTarget);
  $("media-target-summary").textContent = mediaTarget ? `Adding to: ${title(state.catalogue.artworks.find((work) => work.id === mediaTarget))}` : "Click the artwork these photos belong to.";
  $("media-details").replaceChildren(); for (const media of state.media.filter((media) => mediaSelection.has(media.id))) $("media-details").append(node("p", `${media.name} · ${media.id}\nSHA256 ${media.sourceSha256}\n${media.reproduction.width}×${media.reproduction.height}px`, "technical-block"));
}
$("clear-media-selection").addEventListener("click", () => { mediaSelection.clear(); renderMedia(); });
$("attach-selected-media").addEventListener("click", action(async () => {
  if (!mediaTarget) throw new Error("Click the target artwork first"); if (editorDirty) throw new Error("Save your artwork changes before attaching photos");
  const role = $("media-role").value;
  if (role === "primary" && mediaSelection.size > 1) throw new Error("Choose one primary image at a time");
  for (const id of mediaSelection) { await api("/api/media/attach", { mediaId: id, artworkId: mediaTarget, role: role === "primary" ? "alternate" : role }); state = await api("/api/state"); if (role === "primary") await makePrimary(mediaTarget, state.media.find((media) => media.id === id).reproduction.src); }
  mediaSelection.clear(); await refresh(); message("Photos added to the chosen artwork. Nothing is public.");
}));
function sequence(container, ids, changed) {
  container.replaceChildren(); ids.forEach((id, index) => { const work = state.catalogue.artworks.find((work) => work.id === id), item = node("li"), content = node("div"); item.dataset.artworkId = id; item.append(thumb(imageFor(work), title(work))); content.append(node("strong", title(work))); if (dateLabel(work)) content.append(node("small", dateLabel(work)));
    const controls = node("div", undefined, "sequence-controls"); for (const [label, direction] of [["Move earlier", -1], ["Move later", 1]]) { const control = button(label, () => { const other = index + direction; if (other < 0 || other >= ids.length) return; [ids[index], ids[other]] = [ids[other], ids[index]]; changed(); }); control.disabled = index + direction < 0 || index + direction >= ids.length; controls.append(control); }
    controls.append(button("Remove", () => { ids.splice(index, 1); changed(); })); content.append(controls); item.append(content); container.append(item);
  });
}
function renderProjects() { $("project-list").replaceChildren(); for (const project of state.catalogue.projects) { const item = button("", () => openProject(project.id)); item.className = "thumbnail-card"; item.dataset.projectId = project.id; const first = state.catalogue.artworks.find((work) => work.id === project.memberIds[0]); item.append(thumb(first ? imageFor(first) : null, ""), node("strong", project.title)); $("project-list").append(item); } }
function openProject(id) {
  editingProject = id || null; projectMembers = []; const form = $("project-form"); form.hidden = false; form.reset(); $("project-id").textContent = id ? `Neutral identity: ${id}` : "A neutral identity will be assigned when saved";
  if (id) { const project = state.catalogue.projects.find((entry) => entry.id === id); for (const name of ["title", "slug", "description", "published"]) formSet(form, name, project[name]); formSet(form, "aliases", project.aliases.join("\n")); for (const name of ["certainty", "year", "endYear"]) formSet(form, name, project.date?.[name]); formSet(form, "privateNote", state.notes[id]); projectMembers = [...project.memberIds]; }
  renderProjectSequence();
}
function renderProjectSequence() { sequence($("project-members"), projectMembers, renderProjectSequence); workPicker($("project-picker"), "Add to project", (id) => { projectMembers.push(id); renderProjectSequence(); }, "", projectMembers); }
$("new-project").addEventListener("click", () => openProject());
async function saveProject() {
  const form = $("project-form"), old = editingProject ? state.catalogue.projects.find((entry) => entry.id === editingProject) : {};
  if (!field(form, "title").value.trim() || !projectMembers.length) throw new Error("Give this project a title and choose at least one artwork");
  const project = await api("/api/project/save", { record: { ...old, id: editingProject || undefined, slug: optional(form, "slug"), title: field(form, "title").value.trim(), aliases: lines(field(form, "aliases").value), date: date(form, true), description: optional(form, "description"), memberIds: projectMembers, published: field(form, "published").checked }, note: field(form, "privateNote").value }); await refresh(); openProject(project.id); message("Project saved. Nothing is public."); return project.id;
}
$("project-form").addEventListener("submit", action(saveProject));
function renderSelected() { sequence($("selected-sequence"), selected, () => { selectedDirty = true; renderSelected(); }); workPicker($("selected-picker"), "Add to Selected Work", (id) => { selected.push(id); selectedDirty = true; renderSelected(); }, "", selected); }
function openCuration() {
  if (!selectedDirty) selected = state.catalogue.artworks.filter((work) => work.featured).sort((a, b) => (a.selectedOrder ?? 999999) - (b.selectedOrder ?? 999999)).map((work) => work.id);
  leadId = state.catalogue.artworks.find((work) => work.homepageLead)?.id || ""; renderSelected(); renderHomepage();
}
function renderHomepage() {
  $("current-lead").replaceChildren(); const lead = state.catalogue.artworks.find((work) => work.id === leadId);
  if (lead) { const card = workCard(lead, "Current homepage image", () => previewPage("home"), true); $("current-lead").append(card); } else $("current-lead").append(node("p", "Choose the image you want on the homepage.", "hint"));
  workPicker($("homepage-picker"), "Use on homepage", async (id) => { const savedOrder = state.catalogue.artworks.filter((work) => work.featured).sort((a, b) => (a.selectedOrder ?? 999999) - (b.selectedOrder ?? 999999)).map((work) => work.id); await api("/api/curation", { selectedIds: savedOrder, homepageLeadId: id }); await refresh(); leadId = id; renderHomepage(); message("Homepage image saved. Preview it below; nothing is public."); }, leadId);
}
async function saveCuration() { await api("/api/curation", { selectedIds: selected, homepageLeadId: leadId }); selectedDirty = false; await refresh(); openCuration(); message("Selected Work saved. Nothing is public."); }
$("save-curation").addEventListener("click", action(saveCuration));
async function buildPreview() {
  if (editingArtwork && !validateEditedArtwork("Preview")) return null;
  if (editorDirty && !await saveArtwork({actionName:"Preview"})) return null;
  previewing = true; updateEditorActions();
  try { message("Preparing your preview…"); currentPreview = await api("/api/preview/build", {}); await refresh(); }
  catch { throw new Error("The preview could not be prepared. Your draft is still private. Check your entries and try again."); }
  finally { previewing = false; updateEditorActions(); }
  $("preview-links").replaceChildren(); const record = state.catalogue.artworks.find((work) => work.id === editingArtwork) || state.catalogue.artworks[0];
  for (const [label, path] of [["Homepage", "/"], ["Selected Work", "/work/"], ["Archive", "/archive/"], ["Projects", "/projects/"], ["Artwork", `/artwork/${record.slug}/`], ["Medium", `/work/${record.medium}/`], ...state.catalogue.projects.map((project) => [project.title, `/projects/${project.slug}/`])]) { const link = node("a", `Preview ${label}`); link.href = currentPreview.origin + path; link.target = "_blank"; link.rel = "noopener noreferrer"; $("preview-links").append(link); }
  message("Preview ready. Your work is still private."); return currentPreview;
}
async function previewPage(kind) {
  if(previewPopupBusy)return;
  if (editingArtwork && !validateEditedArtwork("Preview")) return;
  previewPopupBusy=true;updateEditorActions();
  const popup = window.open("about:blank", "_blank");
  if(popup){renderPreviewStatus(popup,{failed:false,kind});popup.opener=null;}
  try { if (kind === "project") await saveProject(); if (kind === "selected" && selectedDirty) await saveCuration(); const preview = await buildPreview(); if (!preview) { if(popup)renderPreviewStatus(popup,{failed:true,kind});return; } const work = state.catalogue.artworks.find((work) => work.id === editingArtwork) || state.catalogue.artworks[0], project = state.catalogue.projects.find((entry) => entry.id === editingProject); const path = kind === "project" ? `/projects/${project.slug}/` : kind === "selected" ? "/work/" : kind === "home" ? "/" : `/artwork/${work.slug}/`; if (popup&&!popup.closed) popup.location.href = preview.origin + path; else { showTab("review"); message("Open the preview link below."); } }
  catch {if(popup&&!popup.closed)renderPreviewStatus(popup,{failed:true,kind});message("The preview could not be prepared. Your draft is still private. Check your entries and try again.",true);}
  finally{previewPopupBusy=false;updateEditorActions();}
}
function renderPreviewStatus(popup,{failed,kind}) {
  const doc=popup.document;
  doc.documentElement.lang="en";
  const css=doc.createElement("link");css.rel="stylesheet";css.href=location.origin+"/studio.css";doc.head.replaceChildren(css);
  doc.title=failed?"Preview could not be prepared":"Preparing preview — Studio";
  const viewport=doc.createElement("meta");viewport.name="viewport";viewport.content="width=device-width,initial-scale=1";doc.head.append(viewport);
  const main=doc.createElement("main"),heading=doc.createElement("h1"),status=doc.createElement("p"),note=doc.createElement("p");
  heading.textContent=failed?"Preview could not be prepared":`Preparing ${kind==="artwork"?"artwork":kind==="home"?"homepage":kind==="selected"?"Selected Work":"project"} preview…`;
  status.setAttribute("role",failed?"alert":"status");status.textContent=failed?"Return to Studio, check your entries and try Preview again.":"Please wait. This tab will open your preview when it is ready.";
  note.textContent="PRIVATE DRAFT — Nothing here is public.";note.className="hint";main.append(heading,status,note);doc.body.replaceChildren(main);
}
for (const id of ["preview-artwork", "preview-artwork-bottom"]) $(id).addEventListener("click", action(() => previewPage("artwork")));
$("preview-project").addEventListener("click", action(() => previewPage("project"))); $("preview-selected").addEventListener("click", action(() => previewPage("selected"))); $("preview-homepage").addEventListener("click", action(() => previewPage("home")));
$("build-preview").addEventListener("click", action(buildPreview));
function reviewRecord() { return [...state.catalogue.artworks, ...state.catalogue.projects].find((record) => record.id === $("review-record").value); }
function showReview() { const record = reviewRecord(); $("review-phase").textContent = record ? state.workflow[record.id]?.approved ? "Public-source approval recorded; writing is still separate." : state.workflow[record.id]?.reviewed ? "Reviewed locally; source approval is still separate." : "Draft — preview and check first." : "Choose an artwork or project"; $("approval-record").textContent = record ? JSON.stringify({ record, derivatives: record.reproductions?.flatMap((image) => [image.src, ...image.variants.map((variant) => variant.src)]) || [], privateNotesAndSourcePathsExcluded: true }, null, 2) : ""; }
function renderReview() {
  options($("review-record"), [...state.catalogue.artworks.map((work) => ({ id: work.id, title: title(work) })), ...state.catalogue.projects]); showReview(); $("export-records").replaceChildren();
  for (const record of [...state.catalogue.artworks, ...state.catalogue.projects]) { const label = node("label", undefined, "check"), input = document.createElement("input"); input.type = "checkbox"; input.value = record.id; input.dataset.kind = "reproductions" in record ? "artwork" : "project"; label.append(input, document.createTextNode(`${"reproductions" in record ? title(record) : record.title} · ${state.workflow[record.id]?.approved ? "Exact public-source approval recorded" : "Approval required"}`)); $("export-records").append(label); }
}
$("review-record").addEventListener("change", showReview);
$("mark-reviewed").addEventListener("click", action(async () => { const record = reviewRecord(); if (!record) throw new Error("Choose an artwork or project"); await api("/api/review", { id: record.id }); await refresh(); $("review-record").value = record.id; showReview(); message("Local review recorded. Public-source approval is still separate."); }));
$("approve-source").addEventListener("click", action(async () => { const record = reviewRecord(); if (!record) throw new Error("Choose an artwork or project"); await api("/api/approve", { id: record.id, confirmation: $("approval-confirmation").value, rightsConfirmed: $("rights-confirmed").checked }); $("approval-confirmation").value = ""; $("rights-confirmed").checked = false; await refresh(); $("review-record").value = record.id; showReview(); message("Exact public-source approval recorded. No repository files written; prepare a separate dry-run."); }));
$("prepare-export").addEventListener("click", action(async () => { const checked = [...$("export-records").querySelectorAll("input:checked")]; exportPlan = await api("/api/export/plan", { artworkIds: checked.filter((input) => input.dataset.kind === "artwork").map((input) => input.value), projectIds: checked.filter((input) => input.dataset.kind === "project").map((input) => input.value) }); $("export-plan").textContent = JSON.stringify(exportPlan, null, 2); $("export-details").open = true; $("write-export").disabled = !exportPlan.repositoryWritesEnabled; message("Dry-run prepared. Inspect exact metadata, image hashes and public paths before writing; no public files changed."); }));
$("write-export").addEventListener("click", action(async () => { if (!exportPlan) throw new Error("Prepare a current dry-run first"); const result = await api("/api/export/write", { token: exportPlan.token, confirmation: $("export-confirmation").value }); $("export-confirmation").value = ""; exportPlan = null; $("export-plan").textContent = JSON.stringify(result, null, 2); await refresh(); message("Approved public-source files written. No commit, deployment or launch-manifest approval performed."); }));
for (const control of document.querySelectorAll("[data-tab]")) control.addEventListener("click", () => navigateTab(control.dataset.tab));
$("refresh").addEventListener("click", action(() => refresh())); roleOptions($("intake-role")); roleOptions($("media-role"));
try { const session = await (await fetch("/api/session")).json(); token = session.token; await refresh(); navigationReady=true;const firstView=viewFromLocation();updateLocation(firstView,{replace:true});restoreNavigation(firstView);message("Studio ready. Nothing here is public."); setInterval(async () => { if (state.jobs.some((job) => job.status === "running") || incomingJobs.size) { try { await refresh(); } catch (error) { message(error.message, true); } } }, 1000); } catch (error) { message(error.message, true); }
