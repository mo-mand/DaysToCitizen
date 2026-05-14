// Email sender — uses Resend in production; logs to console in development.

const FROM = process.env.EMAIL_FROM ?? 'DaysToCitizen <noreply@daystocitizen.ca>';

export async function sendOtpEmail(to: string, code: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    // Development fallback: print to server console
    console.log(`\n┌─────────────────────────────────────┐`);
    console.log(`│  DaysToCitizen — OTP for ${to}`);
    console.log(`│  Code: ${code}  (valid 10 min)`);
    console.log(`└─────────────────────────────────────┘\n`);
    return;
  }

  const { Resend } = await import('resend');
  const resend = new Resend(key);

  const result = await resend.emails.send({
    from: FROM,
    to,
    subject: `Your DaysToCitizen verification code: ${code}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
        <h1 style="font-size:22px;color:#111;margin-bottom:8px">Your sign-in code</h1>
        <p style="color:#555;margin-bottom:24px">
          Use the code below to sign in to <strong>DaysToCitizen</strong>.
          It expires in 10 minutes.
        </p>
        <div style="background:#f4f4f4;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px">
          <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#D52B1E">${code}</span>
        </div>
        <p style="color:#888;font-size:13px">
          If you didn't request this code, you can safely ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
        <p style="color:#aaa;font-size:12px">
          DaysToCitizen &mdash; Canadian citizenship day tracker
          &mdash; <a href="https://daystocitizen.ca" style="color:#aaa">daystocitizen.ca</a>
        </p>
      </div>
    `,
  });

  if (result.error) {
    throw new Error(`Resend error: ${result.error.name ?? 'unknown'} — ${result.error.message ?? JSON.stringify(result.error)}`);
  }
}
