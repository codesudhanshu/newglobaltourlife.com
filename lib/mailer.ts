import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendContactEmail(data: {
  name: string;
  email?: string;
  phone?: string;
  message: string;
}) {
  await transporter.sendMail({
    from: `"New Global Tour Life" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_TO || "newglobaltourlife@gmail.com",
    subject: `New Enquiry from ${data.name}`,
    html: `
      <h2>New Enquiry — New Global Tour Life</h2>
      <table cellpadding="8" style="border-collapse:collapse;font-family:sans-serif;font-size:15px">
        <tr><td><b>Name</b></td><td>${data.name}</td></tr>
        <tr><td><b>Email</b></td><td>${data.email || "—"}</td></tr>
        <tr><td><b>Phone</b></td><td>${data.phone || "—"}</td></tr>
        <tr><td><b>Message</b></td><td style="white-space:pre-wrap">${data.message}</td></tr>
      </table>
    `,
  });
}
