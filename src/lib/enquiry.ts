export type EnquiryRecipient = { email: string; label: string; representative?: string };
export type EnquiryWork = { id: string; title: string; url: string };
export function draftEnquiry({ recipient, work, message, website = "" }: { recipient?: EnquiryRecipient | null; work?: EnquiryWork | null; message: string; website?: string }) {
  if (website.trim()) return { status: "blocked", message: "Leave the website field empty before preparing a draft." };
  if (!recipient || !/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(recipient.email)) return { status: "error", message: "A reviewed public enquiry recipient has not been configured." };
  if (!message.trim() || message.length > 4000) return { status: "error", message: "Enter a message of up to 4,000 characters to prepare a draft." };
  const subject = work ? `Artwork enquiry — ${work.title.replace(/[\r\n]/g, " ")} [${work.id}]` : "General artwork enquiry";
  const body = `${work ? `Work: ${work.title}\nID: ${work.id}\nURL: ${work.url}\n\n` : ""}${message.trim()}`;
  return { status: "ready", message: "Email draft prepared locally. Open it in your mail app to send; a draft is not delivery confirmation.", href: `mailto:${encodeURIComponent(recipient.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
