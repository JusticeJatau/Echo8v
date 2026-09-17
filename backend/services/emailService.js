export async function sendEnquiryEmail(enquiry) {
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.RESEND_FROM ||
    !process.env.ENQUIRY_NOTIFICATION_TO
  ) {
    throw new Error("Resend is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    signal: AbortSignal.timeout(15000),
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.RESEND_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM,
      to: [process.env.ENQUIRY_NOTIFICATION_TO],
      reply_to: enquiry.email,
      subject: "New Echo8V enquiry: " + (enquiry.interest || "General enquiry"),
      text: [
        "Name: " + enquiry.name,
        "Email: " + enquiry.email,
        "Organisation: " + (enquiry.organisation || "Not provided"),
        "Interest: " + (enquiry.interest || "General enquiry"),
        "",
        enquiry.message,
      ].join("\n"),
    }),
  });

  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Resend could not send the notification.");
  return data.id;
}
