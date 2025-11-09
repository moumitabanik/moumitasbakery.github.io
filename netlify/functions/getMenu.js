const { Client } = require('pg');

exports.handler = async function(event, context) {
  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL, // provided by Neon
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // Fetch all menu items
    const res = await client.query('SELECT * FROM menu'); 

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify(res.rows),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
