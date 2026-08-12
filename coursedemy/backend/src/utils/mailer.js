const nodemailer = require('nodemailer');

// ─── Tạo transporter ──────────────────────────────────────────────────────────
// Nếu MAIL_USER / MAIL_PASS chưa được cấu hình → dùng chế độ mock (log ra console)
function createTransporter() {
  if (!process.env.MAIL_USER || process.env.MAIL_USER === 'your_gmail@gmail.com') {
    return null; // mock mode
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
}

/**
 * Gửi email mật khẩu mới cho user sau khi reset.
 * Nếu chưa cấu hình MAIL_USER → in ra console (mock mode).
 *
 * @param {string} toEmail   - Email người nhận
 * @param {string} fullName  - Tên hiển thị
 * @param {string} newPass   - Mật khẩu mới (plain text)
 * @returns {Promise<{sent: boolean, mock: boolean}>}
 */
async function sendNewPasswordEmail(toEmail, fullName, newPass) {
  const transporter = createTransporter();

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#0f172a;color:#e2e8f0;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:28px 32px;text-align:center">
        <div style="font-size:2rem">🎓</div>
        <h1 style="margin:8px 0 0;font-size:1.4rem;color:#fff">CourseDemy</h1>
      </div>
      <div style="padding:32px">
        <p style="font-size:.95rem;margin:0 0 8px">Xin chào <strong>${fullName}</strong>,</p>
        <p style="font-size:.9rem;color:#94a3b8;margin:0 0 24px">
          Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
        </p>
        <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:20px;text-align:center;margin-bottom:24px">
          <p style="margin:0 0 8px;font-size:.82rem;color:#64748b;text-transform:uppercase;letter-spacing:.5px">Mật khẩu mới của bạn</p>
          <p style="margin:0;font-size:1.6rem;font-weight:800;letter-spacing:4px;color:#a78bfa;font-family:monospace">${newPass}</p>
        </div>
        <p style="font-size:.85rem;color:#94a3b8;margin:0 0 8px">
          Lưu ý: Hãy đăng nhập và đổi mật khẩu ngay sau khi nhận được email này.
        </p>
        <p style="font-size:.82rem;color:#64748b;margin:0">
          Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
        </p>
      </div>
      <div style="padding:16px 32px;border-top:1px solid #1e293b;text-align:center">
        <p style="margin:0;font-size:.78rem;color:#475569">© 2025 CourseDemy - Nen tang hoc truc tuyen</p>
      </div>
    </div>
  `;

  // ── Mock mode (chưa cấu hình SMTP) ────────────────────────────────────────
  if (!transporter) {
    console.log('\n[MAIL MOCK] ---------------------------------------------------------');
    console.log('  To      : ' + toEmail);
    console.log('  Name    : ' + fullName);
    console.log('  New pass: ' + newPass);
    console.log('---------------------------------------------------------------------\n');
    return { sent: true, mock: true };
  }

  // ── Gửi thật ──────────────────────────────────────────────────────────────
  await transporter.sendMail({
    from: '"CourseDemy" <' + process.env.MAIL_USER + '>',
    to: toEmail,
    subject: 'Mat khau moi cua ban - CourseDemy',
    html,
  });

  return { sent: true, mock: false };
}

module.exports = { sendNewPasswordEmail };
