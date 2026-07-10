export const htmlContent = ({ pageTitle, cleanedHtml }) => {
  return `
  <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${pageTitle} | Preview</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
              
              :root {
                  --brand-primary: #00D1FF;
                  --text-main: #0F172A;
                  --text-secondary: #64748B;
                  --bg-body: #F8FAFC;
              }

              * { margin: 0; padding: 0; box-sizing: border-box; }
              
              body {
                  font-family: 'Plus Jakarta Sans', sans-serif;
                  background-color: var(--bg-body);
                  color: var(--text-main);
                  line-height: 1.6;
                  padding: 0 10px;
              }

              .container {
                  width: 100%;
                  margin: 0 auto;
                  background: white;
                  padding: 5px;
                  overflow-x: hidden;
              }

              .header {
                  text-align: center;
                  margin-bottom: 20px;
                  border-bottom: 2px solid #F1F5F9;
              }

              .badge {
                  display: inline-block;
                  padding: 8px 18px;
                  background: #E0F7FA;
                  color: #00BCD4;
                  border-radius: 100px;
                  font-size: 11px;
                  font-weight: 800;
                  margin-bottom: 10px;
                  text-transform: uppercase;
                  letter-spacing: 0.1em;
              }

              h1 {
                  font-size: 20px;
                  font-weight: 800;
                  letter-spacing: -0.03em;
                  color: #0F172A;
                  line-height: 1.2;
              }

              .meta {
                  color: var(--text-secondary);
                  font-size: 12px;
                  font-weight: 500;
              }

              .content {
                  font-size: 14px;
                  color: #334155;
                  line-height: 1.8;
                  overflow-wrap: break-word !important;
                  word-wrap: break-word !important;
                  box-sizing: border-box !important;
              }

              .content p, .content h1, .content h2, .content li {
                  word-break: normal !important;
                  overflow-wrap: break-word !important;
                  white-space: normal !important;
                  hyphens: none !important;
                  box-sizing: border-box !important;
              }

              .content img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 8px;
                  margin: 20px 0;
              }

              /* Section specific overrides for the preview */
              [data-section-id] {
                  margin-bottom: 40px !important;
              }

              [data-section-id] h2 {
                  font-family: 'Plus Jakarta Sans', sans-serif !important;
                  font-size: 20px !important;
                  color: #0F172A !important;
                  border-bottom: 2px solid #F8FAFC !important;
                  padding-bottom: 16px !important;
                  margin-top: 0 !important;
                  letter-spacing: -0.01em !important;
              }

              .content p {
                  margin-bottom: 15px !important;
                  line-height: 1.8 !important;
              }

              /* ── Legal document list hierarchy ── */
              .content ul {
                  margin-top: 10px !important;
                  margin-bottom: 16px !important;
                  padding-left: 28px !important;
              }

              .content ol {
                  margin-top: 10px !important;
                  margin-bottom: 16px !important;
                  padding-left: 28px !important;
              }

              /* Preserve alpha and roman markers — do NOT override with decimal */
              .content ol[type="a"] { list-style-type: lower-alpha !important; }
              .content ol[type="i"] { list-style-type: lower-roman !important; }
              .content ol:not([type]) { list-style-type: decimal !important; }
              .content ul { list-style-type: disc !important; }

              .content li {
                  margin-bottom: 8px !important;
                  line-height: 1.8 !important;
                  display: list-item !important;
              }


              .footer {
                  margin-top: 100px;
                  text-align: center;
                  padding-top: 50px;
                  border-top: 1px solid #F1F5F9;
                  color: var(--text-secondary);
                  font-size: 14px;
              }

              @media (max-width: 768px) {
                  body { padding: 30px; }
                  .container { padding: 20px; }
                  h1 { font-size: 20px; }
                  [data-section-id] h2 { font-size: 20px !important; }
                  .content { font-size: 12px; }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <span class="badge">Live Document Preview</span>
                  <h1>${pageTitle}</h1>
                  <div class="meta">Review Version &bull; ${new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</div>
                  <hr style="margin-top: 10px; color: #F1F5F9;"/>
              </div>
              <div class="content">
                  ${cleanedHtml}
              </div>
              <div class="footer">
                  This is a live preview of the Privacy Policy document.
                  <br/>
                  &copy; ${new Date().getFullYear()} KEEN AS MUSTARD APP.
              </div>
          </div>
      </body>
      </html>
`;
};
