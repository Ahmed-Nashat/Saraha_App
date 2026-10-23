export const signupOtpTemplate = ({ name, otp }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code - Saraha</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa; padding: 48px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 480px; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #09090b; padding: 32px 28px; text-align: center;">
              <h1 style="margin: 0; font-size: 22px; color: #ffffff; font-weight: 700; letter-spacing: -0.5px; text-transform: uppercase;">Saraha</h1>
              <p style="margin: 4px 0 0; color: #a1a1aa; font-size: 13px; font-weight: 400;">Account Verification</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 28px;">
              <h2 style="margin: 0 0 12px; font-size: 18px; color: #09090b; font-weight: 600;">Hello, ${name}</h2>
              <p style="margin: 0 0 24px; font-size: 14px; color: #52525b; line-height: 1.6;">
                Use the one-time verification code below to confirm your email and complete your sign up:
              </p>

              <!-- Monochromatic OTP Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                <tr>
                  <td align="center" style="background-color: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; padding: 18px;">
                    <span style="font-size: 32px; font-weight: 700; letter-spacing: 10px; color: #09090b; font-family: 'SF Mono', Monaco, Menlo, 'Courier New', monospace;">${otp}</span>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: #71717a; line-height: 1.5;">
                This code expires in <strong>5 minutes</strong>. Do not share it with anyone.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 32px;"><hr style="border: none; border-top: 1px solid #e5e5e5; margin: 0;"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #a1a1aa; line-height: 1.5;">
                If you did not request this email, no action is needed.
              </p>
              <p style="margin: 6px 0 0; font-size: 11px; color: #a1a1aa;">© ${new Date().getFullYear()} Saraha. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
 </body>
</html>
`;

export const forgetPasswordOtpTemplate = ({ name, otp }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password - Saraha</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa; padding: 48px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 480px; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #09090b; padding: 32px 28px; text-align: center;">
              <h1 style="margin: 0; font-size: 22px; color: #ffffff; font-weight: 700; letter-spacing: -0.5px; text-transform: uppercase;">Saraha</h1>
              <p style="margin: 4px 0 0; color: #a1a1aa; font-size: 13px; font-weight: 400;">Password Reset</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 28px;">
              <h2 style="margin: 0 0 12px; font-size: 18px; color: #09090b; font-weight: 600;">Hello, ${name}</h2>
              <p style="margin: 0 0 24px; font-size: 14px; color: #52525b; line-height: 1.6;">
                Use the one-time verification code below to reset your password:
              </p>

              <!-- Monochromatic OTP Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                <tr>
                  <td align="center" style="background-color: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; padding: 18px;">
                    <span style="font-size: 32px; font-weight: 700; letter-spacing: 10px; color: #09090b; font-family: 'SF Mono', Monaco, Menlo, 'Courier New', monospace;">${otp}</span>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: #71717a; line-height: 1.5;">
                This code expires in <strong>5 minutes</strong>. Do not share it with anyone.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 32px;"><hr style="border: none; border-top: 1px solid #e5e5e5; margin: 0;"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #a1a1aa; line-height: 1.5;">
                If you did not request a password reset, please ignore this email.
              </p>
              <p style="margin: 6px 0 0; font-size: 11px; color: #a1a1aa;">© ${new Date().getFullYear()} Saraha. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const twoFactorOtpTemplate = ({ name, otp }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Two-Factor Authentication - Saraha</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa; padding: 48px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 480px; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #09090b; padding: 32px 28px; text-align: center;">
              <h1 style="margin: 0; font-size: 22px; color: #ffffff; font-weight: 700; letter-spacing: -0.5px; text-transform: uppercase;">Saraha</h1>
              <p style="margin: 4px 0 0; color: #a1a1aa; font-size: 13px; font-weight: 400;">Two-Factor Authentication</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px 28px;">
              <h2 style="margin: 0 0 12px; font-size: 18px; color: #09090b; font-weight: 600;">Hello, ${name}</h2>
              <p style="margin: 0 0 24px; font-size: 14px; color: #52525b; line-height: 1.6;">
                A sign-in attempt was detected for your account. Use the verification code below to complete your login:
              </p>

              <!-- Monochromatic OTP Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                <tr>
                  <td align="center" style="background-color: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; padding: 18px;">
                    <span style="font-size: 32px; font-weight: 700; letter-spacing: 10px; color: #09090b; font-family: 'SF Mono', Monaco, Menlo, 'Courier New', monospace;">${otp}</span>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: #71717a; line-height: 1.5;">
                This code expires in <strong>5 minutes</strong>. If this wasn't you, someone may know your password—please reset it immediately.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 32px;"><hr style="border: none; border-top: 1px solid #e5e5e5; margin: 0;"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #a1a1aa; line-height: 1.5;">
                Saraha Security Team
              </p>
              <p style="margin: 6px 0 0; font-size: 11px; color: #a1a1aa;">© ${new Date().getFullYear()} Saraha. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

