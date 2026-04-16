import { ContactFormData } from "../validations/contact.schema"

/**
 * Returns the high-fidelity HTML template for the contact confirmation email.
 * Mirrors the "Frosted Nebula" aesthetic of our core platform templates.
 */
export function getContactConfirmationHtml(data: ContactFormData) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cosynq.ryne.dev"
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transmission Received - cosynq</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Quicksand:wght@600;700&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0a0a12; 
      color: #F8FAFC;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #0a0a12;
      padding: 40px 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #11111a; 
      border-radius: 24px;
      border: 1px solid #1E293B;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    }
    .header {
      background: linear-gradient(135deg, rgba(124, 212, 250, 0.15) 0%, rgba(212, 179, 255, 0.15) 100%);
      border-bottom: 1px solid #1E293B;
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-family: 'Quicksand', sans-serif;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #F8FAFC;
    }
    .header p {
      margin: 8px 0 0;
      font-size: 14px;
      color: #7CD4FA; 
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      margin: 0 0 16px;
      font-family: 'Quicksand', sans-serif;
      font-size: 22px;
      font-weight: 600;
      color: #F8FAFC;
    }
    .content p {
      margin: 0 0 24px;
      font-size: 16px;
      line-height: 1.6;
      color: #CBD5E1;
    }
    .summary-box {
      background-color: rgba(124, 212, 250, 0.05);
      border: 1px solid rgba(124, 212, 250, 0.1);
      border-radius: 16px;
      padding: 24px;
      margin: 24px 0;
    }
    .summary-box h3 {
      margin: 0 0 12px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #7CD4FA;
    }
    .summary-box p {
      margin: 0;
      font-style: italic;
      color: #94A3B8;
    }
    .footer {
      padding: 24px 30px;
      background-color: #0B0C10;
      text-align: center;
      font-size: 13px;
      color: #64748B;
    }
    .footer a {
      color: #D4B3FF;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background-color: #1E293B;
      margin: 32px 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>cosynq</h1>
        <p>Signal Synchronized</p>
      </div>
      
      <div class="content">
        <h2>Greetings, Commander. 🌟</h2>
        <p>
          Your transmission has been successfully received by our command center. We are currently processing your signal and will establish orbit shortly.
        </p>
        
        <div class="summary-box">
          <h3>Broadcast Frequency</h3>
          <p>"${data.subject}"</p>
        </div>

        <p>
          One of our sanctuary administrators will review your dispatch and reach out to <strong>${data.email}</strong> as soon as possible.
        </p>
        
        <div class="divider"></div>
        
        <p style="font-size: 13px; color: #64748B; text-align: center;">
          This is an automated confirmation that your signal has reached the cosynq orbit. No further action is required at this time.
        </p>
      </div>
      
      <div class="footer">
        <p>© 2026 cosynq. All rights reserved.</p>
        <p>
          <a href="${siteUrl}">Visit Hub</a> &nbsp;•&nbsp; 
          <a href="${siteUrl}/privacy">Privacy Policy</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `
}
