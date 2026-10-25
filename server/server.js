require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

// Allow requests from FoundIt frontend
app.use(cors());
app.use(express.json());

// Configure Gmail Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // e.g. yourname@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD // 16-character App Password
  }
});

// Verify SMTP connection on startup
transporter.verify((error) => {
  if (error) {
    console.warn('⚠️ [Mail Server] Gmail SMTP configuration missing or invalid in .env:');
    console.warn('   Ensure GMAIL_USER and GMAIL_APP_PASSWORD are set correctly.');
  } else {
    console.log('✅ [Mail Server] Connected to Gmail SMTP successfully! Ready to deliver verification codes.');
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'FoundIt Mail Server',
    configured: !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
  });
});

// Endpoint: Send Verification Code
app.post('/api/send-code', async (req, res) => {
  const { email, code, name } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, error: 'Email and verification code are required.' });
  }

  // Ensure Gmail credentials are configured
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return res.status(500).json({
      success: false,
      error: 'Gmail SMTP credentials not set on server. Please fill .env file.'
    });
  }

  const recipientName = name ? name.trim() : 'Student';

  const mailOptions = {
    from: `"FoundIt Campus Security" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `FoundIt Security Code: ${code}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B1020; margin: 0; padding: 24px; color: #F8FAFC; }
          .card { max-width: 480px; margin: 0 auto; background-color: #172033; border: 1px solid #293449; border-radius: 20px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
          .logo { text-align: center; margin-bottom: 24px; }
          .logo-badge { display: inline-block; background: linear-gradient(135deg, #6366F1, #22D3EE); color: white; font-weight: 800; font-size: 20px; padding: 10px 20px; border-radius: 12px; letter-spacing: -0.5px; }
          .title { font-size: 20px; font-weight: 700; text-align: center; margin-bottom: 8px; color: #F8FAFC; }
          .subtitle { font-size: 13px; color: #94A3B8; text-align: center; margin-bottom: 24px; }
          .code-box { background-color: #111827; border: 1px solid #6366F1; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 24px; }
          .code-text { font-family: monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #34D399; margin: 0; }
          .meta { font-size: 11px; color: #FBBF24; margin-top: 8px; }
          .warning { font-size: 12px; color: #94A3B8; line-height: 1.6; border-top: 1px solid #293449; padding-top: 16px; }
          .footer { text-align: center; font-size: 11px; color: #64748B; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">
            <span class="logo-badge">FoundIt</span>
          </div>
          <div class="title">Email Verification Code</div>
          <div class="subtitle">Hello ${recipientName}, use the security code below to complete your university account verification:</div>
          
          <div class="code-box">
            <div class="code-text">${code}</div>
            <div class="meta">⏱️ Valid for 10 minutes (Single use)</div>
          </div>

          <div class="warning">
            🛡️ <strong>Security Tip:</strong> Never share this verification code with anyone. FoundIt staff will never ask for your code.
          </div>

          <div class="footer">
            FoundIt — Smart University Lost & Found System<br>
            Campus Security & Administration Desk
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ [Mail Server] Verification code successfully sent to ${email} (MessageId: ${info.messageId})`);
    res.json({
      success: true,
      message: `Verification code sent to ${email}`,
      messageId: info.messageId
    });
  } catch (err) {
    console.error('❌ [Mail Server] Error sending email:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to deliver email through Gmail SMTP: ' + err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 FoundIt Mail Server is running on http://localhost:${PORT}`);
  console.log(`📡 Ready to send codes from http://localhost:${PORT}/api/send-code`);
});
