// netlify/functions/trackclick.js
const { Client } = require("pg");
const nodemailer = require("nodemailer");

exports.handler = async function(event, context) {
  try {
    const { productName, price, ref } = JSON.parse(event.body);

    const ip =
      event.headers["x-forwarded-for"]?.split(",")[0] ||
      event.headers["client-ip"] ||
      "UNKNOWN";

    const userAgent = event.headers["user-agent"] || "UNKNOWN";

    // Clean the price
    const numericPrice = price;

    // --- Save click in DB ---
    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();

    await client.query(
      `INSERT INTO whatsapp_clicks 
      (product, price, ref, ip, user_agent, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())`,
      [productName, numericPrice, ref, ip, userAgent]
    );

    await client.end();

    // --- SEND EMAIL NOTIFICATION ---
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // 16-digit app password
      }
    });
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "LOADED" : "MISSING");

    await transporter.sendMail({
      from: `"Bakery Website" <${process.env.SMTP_USER}>`,
      to: process.env.ALERT_EMAIL,
      subject: "New Order Inquiry (WhatsApp Click)",
      html: `
        <h3>New WhatsApp Order Click</h3>
        <p><b>Product:</b> ${productName}</p>
        <p><b>Price:</b> ₹${numericPrice}</p>
        <p><b>Ref ID:</b> ${ref}</p>
        <p><b>IP:</b> ${ip}</p>
        <p><b>User Agent:</b> ${userAgent}</p>
        <p><i>Sent automatically from your website.</i></p>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    console.error("TRACKCLICK ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
