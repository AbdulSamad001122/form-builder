import { Resend } from "resend";
import { env } from "../env";

export const resend = new Resend(env.RESEND_API_KEY);

interface GenerateEmailPayload {
  formTitle: string;
  formDescription?: string | null;
  respondentEmail: string;
  answers: Array<{ label: string; value: string }>;
}


export function generateSubmissionEmailHtml({
  formTitle,
  formDescription,
  respondentEmail,
  answers,
}: GenerateEmailPayload): string {
  const answersHtml = answers
    .map(
      (ans) => `
        <div style="padding: 16px; border-bottom: 1px solid #f3f4f6;">
            <div style="font-size: 13px; font-weight: 700; color: #4b5563; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">${ans.label}</div>
            <div style="font-size: 15px; color: #1f2937; line-height: 1.5; white-space: pre-wrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${ans.value}</div>
        </div>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>New Form Submission</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 30px 15px;">
            <tr>
                <td align="center">
                    <table width="100%" max-width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #4f46e5, #06b6d4); padding: 40px 30px; text-align: center;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">New Submission Received</h1>
                                <p style="color: rgba(255, 255, 255, 0.85); margin: 8px 0 0 0; font-size: 15px;">${formTitle}</p>
                            </td>
                        </tr>
                        <!-- Info section -->
                        <tr>
                            <td style="padding: 30px 30px 20px 30px; border-bottom: 1px solid #f3f4f6;">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td style="padding-bottom: 8px;">
                                            <span style="font-size: 12px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;">Respondent</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span style="font-size: 16px; font-weight: 600; color: #111827; background-color: #ecfeff; color: #0891b2; padding: 6px 12px; border-radius: 9999px; display: inline-block;">${respondentEmail}</span>
                                        </td>
                                    </tr>
                                    ${
                                      formDescription
                                        ? `
                                    <tr>
                                        <td style="padding-top: 15px;">
                                            <span style="font-size: 12px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;">Form Description</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="font-size: 14px; color: #4b5563; line-height: 1.5; padding-top: 4px;">
                                            ${formDescription}
                                        </td>
                                    </tr>
                                    `
                                        : ""
                                    }
                                </table>
                            </td>
                        </tr>
                        <!-- Answers -->
                        <tr>
                            <td style="background-color: #fafafa;">
                                <div style="padding: 10px 0;">
                                    ${answersHtml}
                                </div>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 30px; text-align: center; background-color: #ffffff; border-top: 1px solid #f3f4f6;">
                                <p style="margin: 0; font-size: 13px; color: #9ca3af;">Powered by <strong>Formit</strong></p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
}
