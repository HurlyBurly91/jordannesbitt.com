import { draftEnquiry, type EnquiryRecipient, type EnquiryWork } from "../lib/enquiry.ts";
const form = document.querySelector<HTMLFormElement>("[data-enquiry-form]");
const data = document.getElementById("enquiry-data");
if (form && data) {
  const { recipient, works }: { recipient: EnquiryRecipient | null; works: EnquiryWork[] } = JSON.parse(data.textContent ?? "{}");
  const work = form.elements.namedItem("work") as HTMLSelectElement;
  const message = form.elements.namedItem("message") as HTMLTextAreaElement;
  const website = form.elements.namedItem("website") as HTMLInputElement;
  const requested = new URLSearchParams(location.search).get("work");
  if (works.some((entry) => entry.id === requested)) work.value = requested!;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const draft = draftEnquiry({ recipient, work: works.find((entry) => entry.id === work.value), message: message.value, website: website.value });
    const status = document.querySelector<HTMLElement>("[data-enquiry-status]")!;
    const link = document.querySelector<HTMLAnchorElement>("[data-draft-link]")!;
    status.textContent = draft.message;
    status.dataset.status = draft.status;
    link.hidden = draft.status !== "ready";
    if (draft.href) link.href = draft.href; else link.removeAttribute("href");
  });
  form.querySelector("fieldset")!.disabled = false;
}
