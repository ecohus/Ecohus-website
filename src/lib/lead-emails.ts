// Branded confirmation email sent to the lead after a form submission.

const BRAND_GREEN = "#2C5F3E";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface ConfirmationDetail {
  label: string;
  value: string;
}

export function leadConfirmationHtml({
  name,
  intro,
  details,
}: {
  name: string;
  intro: string;
  details: ConfirmationDetail[];
}): string {
  const detailRows = details
    .map(
      (d) => `
        <tr>
          <td style="padding: 6px 16px 6px 0; color: #6B6B6B; font-size: 14px; white-space: nowrap; vertical-align: top;">${escapeHtml(d.label)}</td>
          <td style="padding: 6px 0; color: #1A1A1A; font-size: 14px;">${escapeHtml(d.value)}</td>
        </tr>`
    )
    .join("");

  return `
  <div style="background-color: #F7F4EE; padding: 32px 16px; font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; border: 1px solid #E2DDD5;">
      <div style="background-color: ${BRAND_GREEN}; padding: 24px 32px;">
        <span style="color: #FFFFFF; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">Ecohus</span>
      </div>
      <div style="padding: 32px;">
        <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 500; color: #1A1A1A;">Hej ${escapeHtml(name)},</h1>
        <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.7; color: #1A1A1A;">${escapeHtml(intro)}</p>
        ${
          details.length
            ? `<table style="border-collapse: collapse; width: 100%; margin: 0 0 24px; border-top: 1px solid #E2DDD5; padding-top: 16px;">${detailRows}</table>`
            : ""
        }
        <p style="margin: 0 0 8px; font-size: 15px; line-height: 1.7; color: #1A1A1A;">
          Vi vender tilbage til dig hurtigst muligt — som regel inden for 1-2 hverdage.
        </p>
        <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #1A1A1A;">
          Venlig hilsen<br/>
          <strong>Ecohus</strong>
        </p>
      </div>
      <div style="padding: 16px 32px; background-color: #F7F4EE; border-top: 1px solid #E2DDD5;">
        <p style="margin: 0; font-size: 12px; color: #6B6B6B;">
          Du modtager denne mail, fordi du har udfyldt en formular på ecohus.dk.
        </p>
      </div>
    </div>
  </div>`;
}

export function leadConfirmationText({
  name,
  intro,
  details,
}: {
  name: string;
  intro: string;
  details: ConfirmationDetail[];
}): string {
  const detailLines = details.map((d) => `${d.label}: ${d.value}`).join("\n");
  return [
    `Hej ${name},`,
    "",
    intro,
    "",
    detailLines,
    "",
    "Vi vender tilbage til dig hurtigst muligt — som regel inden for 1-2 hverdage.",
    "",
    "Venlig hilsen",
    "Ecohus",
  ]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n");
}
