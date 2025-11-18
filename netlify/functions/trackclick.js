// // netlify/functions/trackclick.js
// const { Client } = require("pg");
// const fetch = require("node-fetch"); // Netlify supports this
// const nodemailer = require("nodemailer");

// exports.handler = async function (event, context) {
//   try {
//     const { productName, price, ref } = JSON.parse(event.body);

//     // --- GET IP ---
//     const ip =
//       event.headers["x-forwarded-for"]?.split(",")[0] ||
//       event.headers["client-ip"] ||
//       "UNKNOWN";

//     const userAgent = event.headers["user-agent"] || "UNKNOWN";

//     const numericPrice = price;

//     // --- GET LOCATION FROM IP ---
//     let city = "UNKNOWN";
//     let region = "UNKNOWN";
//     let country = "UNKNOWN";

//     try {
//       if (ip !== "UNKNOWN" && ip !== "::1" && !ip.startsWith("127.")) {
//         const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
//         const geoData = await geoRes.json();

//         city = geoData.city || "UNKNOWN";
//         region = geoData.region || "UNKNOWN";
//         country = geoData.country_name || "UNKNOWN";
//       }
//     } catch (geoErr) {
//       console.log("Geo Lookup Failed:", geoErr);
//     }

//     // --- SAVE IN DB ---
//     const client = new Client({
//       connectionString: process.env.NETLIFY_DATABASE_URL,
//       ssl: { rejectUnauthorized: false },
//     });

//     await client.connect();

//     await client.query(
//       `INSERT INTO whatsapp_clicks 
//         (product, price, ref, ip, city, region, country, user_agent, created_at)
//        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
//       [productName, numericPrice, ref, ip, city, region, country, userAgent]
//     );

//     await client.end();

//     // --- SEND EMAIL USING GMAIL SMTP ---
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: true, // port 465 requires secure
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: `"Bakery Alerts" <${process.env.SMTP_USER}>`,
//       to: process.env.ALERT_EMAIL,
//       subject: "New WhatsApp Order Inquiry",
//       html: `
//         <h3>New WhatsApp Order Click</h3>
//         <p><b>Product:</b> ${productName}</p>
//         <p><b>Price:</b> ₹${numericPrice}</p>
//         <p><b>Ref ID:</b> ${ref}</p>
//         <p><b>IP:</b> ${ip}</p>
//         <p><b>City:</b> ${city}</p>
//         <p><b>Region:</b> ${region}</p>
//         <p><b>Country:</b> ${country}</p>
//         <p><b>User Agent:</b> ${userAgent}</p>
//         <p><i>Sent automatically from your website.</i></p>
//       `,
//     });

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ success: true }),
//     };
//   } catch (err) {
//     console.error("TRACKCLICK ERROR:", err);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: err.message }),
//     };
//   }
// };



const { Client } = require("pg");
const { Resend } = require("resend");
const https = require("https");

// Helper: Fetch JSON without node-fetch
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            resolve(null);
          }
        });
      })
      .on("error", () => resolve(null));
  });
}

exports.handler = async function (event, context) {
  try {
    const { productName, price, ref } = JSON.parse(event.body);

    // -----------------------------------------
    // GET REAL CLIENT IP
    // -----------------------------------------
    let ip =
      event.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      event.headers["client-ip"] ||
      "UNKNOWN";

    const userAgent = event.headers["user-agent"] || "UNKNOWN";

    // -----------------------------------------
    // GEO LOOKUP
    // -----------------------------------------
    let city = "UNKNOWN",
      region = "UNKNOWN",
      country = "UNKNOWN";

    try {
        async function getGeo(ip) {
            let geo = await fetchJSON(`https://ipapi.co/${ip}/json/`);
            if (!geo || !geo.city) {
                geo = await fetchJSON(`https://ipwhois.app/json/${ip}`);
            }
            return geo;
        }

        const geo = await getGeo(ip);
        city = geo?.city || "UNKNOWN";
        region = geo?.region || geo?.regionName || "UNKNOWN";
        country = geo?.country_name || geo?.country || "UNKNOWN";

    } catch {}

    // -----------------------------------------
    // DATABASE INSERT
    // -----------------------------------------
    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    await client.query(
      `INSERT INTO whatsapp_clicks 
       (product, price, ref, ip, city, region, country, user_agent, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [productName, price, ref, ip, city, region, country, userAgent]
    );

    await client.end();

    // -----------------------------------------
    // SEND EMAIL VIA RESEND
    // -----------------------------------------
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Bakery Alerts <onboarding@resend.dev>",
      to: process.env.ALERT_EMAIL,
      subject: "New WhatsApp Order Inquiry",
      html: `
        <h3>New WhatsApp Order Click</h3>
        <p><b>Product:</b> ${productName}</p>
        <p><b>Price:</b> ₹${price}</p>
        <p><b>Ref ID:</b> ${ref}</p>
        <hr>
        <p><b>IP:</b> ${ip}</p>
        <p><b>City:</b> ${city}</p>
        <p><b>Region:</b> ${region}</p>
        <p><b>Country:</b> ${country}</p>
        <p><b>User Agent:</b> ${userAgent}</p>
        <hr>
        <p><i>Sent automatically from your website.</i></p>
      `,
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error("TRACKCLICK ERROR:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
