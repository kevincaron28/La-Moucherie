import { NextResponse } from "next/server";
import { getRates, canadaPostConfigured } from "@/lib/canada-post";
import { isAuthorizedOperator } from "@/lib/admin";

/**
 * One-call diagnostic for the Canada Post credentials, so a failure can be read
 * directly instead of inferred from a checkout that quietly fell back to zone
 * rates.
 *
 * Renders HTML rather than JSON because the usual way to reach it is a phone
 * browser, where a Bearer header isn't something you can set — signing in as the
 * operator is. Pass ?format=json for curl and scripts.
 */
export async function GET(request: Request) {
  if (!(await isAuthorizedOperator(request))) {
    return page(
      401,
      "Not signed in",
      `<p>Sign in with the owner account, then reload this page.</p>
       <p><a href="/fr/account/login">Sign in</a></p>`
    );
  }

  const url = new URL(request.url);
  const wantsJson = url.searchParams.get("format") === "json";
  const destination = url.searchParams.get("to") ?? "M5H2N2";
  const environment =
    process.env.CANADA_POST_ENV === "prod" ? "production" : "development";

  if (!canadaPostConfigured()) {
    const body = {
      ok: false,
      reason: "CANADA_POST_API_USERNAME / CANADA_POST_API_PASSWORD are not set",
    };
    if (wantsJson) return NextResponse.json(body);
    return page(
      200,
      "Not configured",
      `<p class="bad">${body.reason}</p>
       <p>Add them in Vercel → Settings → Environment Variables, then redeploy.</p>`
    );
  }

  const quotes = await getRates(destination, 80, {
    length: 20,
    width: 15,
    height: 5,
  });

  if (!quotes) {
    const body = {
      ok: false,
      environment,
      reason: "No quotes returned — see the server logs for the Canada Post message.",
    };
    if (wantsJson) return NextResponse.json(body);
    return page(
      200,
      "No quotes returned",
      `<p class="bad">Canada Post didn't return a price.</p>
       <dl><dt>Environment</dt><dd>${environment}</dd>
           <dt>Destination</dt><dd>${escapeHtml(destination)}</dd></dl>
       <p>Most likely one of:</p>
       <ul>
         <li>Username and password are the wrong way round.</li>
         <li><code>CANADA_POST_ENV</code> is <code>${environment === "production" ? "prod" : "dev"}</code>
             but the keys belong to the other one.</li>
         <li>The API key isn't active yet in the Developer Program.</li>
       </ul>
       <p>Vercel's runtime logs carry the exact message from Canada Post,
          prefixed <code>[canada-post]</code>.</p>`
    );
  }

  const body = {
    ok: true,
    environment,
    destination,
    quotes: quotes.map((q) => ({
      service: q.serviceName,
      code: q.serviceCode,
      beforeTax: (q.baseCents / 100).toFixed(2),
      withTax: (q.dueCents / 100).toFixed(2),
      transitDays: q.transitDays,
    })),
  };
  if (wantsJson) return NextResponse.json(body);

  const rows = quotes
    .map(
      (q, i) => `<tr${i === 0 ? ' class="chosen"' : ""}>
        <td>${escapeHtml(q.serviceName)}${i === 0 ? " <span>← used</span>" : ""}</td>
        <td>$${(q.baseCents / 100).toFixed(2)}</td>
        <td><strong>$${(q.dueCents / 100).toFixed(2)}</strong></td>
        <td>${q.transitDays ?? "—"}</td>
      </tr>`
    )
    .join("");

  return page(
    200,
    "Canada Post is connected",
    `<p class="good">Live rates are working.</p>
     <dl><dt>Environment</dt><dd>${environment}</dd>
         <dt>Test parcel</dt><dd>80 g, 20×15×5 cm → ${escapeHtml(destination)}</dd></dl>
     <table>
       <thead><tr><th>Service</th><th>Before tax</th><th>You pay</th><th>Days</th></tr></thead>
       <tbody>${rows}</tbody>
     </table>
     <p class="note">The cheapest is what the tracked option charges. "You pay"
        includes tax, which is the figure that leaves your pocket at the counter.</p>`
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function page(status: number, heading: string, body: string): Response {
  return new Response(
    `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${heading} — La Moucherie</title>
<style>
  body{margin:0;padding:24px 18px;background:#faf6ec;color:#221e16;
       font:16px/1.55 ui-sans-serif,system-ui,sans-serif}
  main{max-width:640px;margin:0 auto}
  h1{font-size:1.4rem;margin:0 0 16px;color:#2a3524}
  .good{color:#2a3524;font-weight:600}
  .bad{color:#ac4d15;font-weight:600}
  dl{display:grid;grid-template-columns:auto 1fr;gap:4px 14px;margin:16px 0}
  dt{color:#6b6357}
  dd{margin:0}
  table{width:100%;border-collapse:collapse;margin:18px 0;font-size:15px}
  th,td{text-align:left;padding:8px 6px;border-bottom:1px solid #e4d8ba}
  th{color:#6b6357;font-weight:600;font-size:13px}
  tr.chosen{background:#f2e9d5}
  tr.chosen span{color:#ac4d15;font-size:12px}
  code{background:#f2e9d5;padding:1px 5px;border-radius:4px;font-size:14px}
  a{color:#ac4d15}
  .note{color:#6b6357;font-size:14px}
</style></head><body><main><h1>${heading}</h1>${body}</main></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
