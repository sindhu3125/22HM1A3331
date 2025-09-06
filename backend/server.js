const express = require("express");
const { nanoid } = require("nanoid");
const logger = require("./logger");

const app = express();
app.use(express.json());
app.use(logger);

// In-memory store for URLs
// Structure: { shortcode: { url, expiry, createdAt, clicks: [] } }
const urls = {};

// ============ Helpers ============
function isValidUrl(str) {
  try { new URL(str); return true; } catch { return false; }
}

function isValidShortcode(code) {
  return /^[a-zA-Z0-9]{3,10}$/.test(code);
}

// ============ Routes ============

// Health Check
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "URL Shortener is running" });
});

// Create Short URL
app.post("/shorturls", (req, res) => {
  const { url, validity, shortcode } = req.body;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: "Invalid or missing URL" });
  }

  let code = shortcode || nanoid(6);

  if (shortcode) {
    if (!isValidShortcode(shortcode)) {
      return res.status(400).json({ error: "Invalid shortcode format" });
    }
    if (urls[shortcode]) {
      return res.status(409).json({ error: "Shortcode already in use" });
    }
  } else {
    while (urls[code]) code = nanoid(6);
  }

  const minutes = validity ? parseInt(validity) : 30;
  const expiry = new Date(Date.now() + minutes * 60 * 1000);

  urls[code] = {
    url,
    expiry: expiry.toISOString(),
    createdAt: new Date().toISOString(),
    clicks: []
  };

  return res.status(201).json({
    shortLink: `http://localhost:3000/${code}`,
    expiry: expiry.toISOString(),
  });
});

// Redirect to original URL + log analytics
app.get("/:shortcode", (req, res) => {
    res.send("Your server running on port 3000");
  const entry = urls[req.params.shortcode];
  if (!entry) return res.status(404).json({ error: "Shortcode not found" });
  if (new Date() > new Date(entry.expiry)) {
    return res.status(410).json({ error: "Link expired" });
  }

  entry.clicks.push({
    time: new Date().toISOString(),
    referrer: req.get("referer") || "direct",
    ip: req.ip,
    geo: "India" // mocked location
  });

  return res.redirect(entry.url);
});

// Retrieve Short URL Statistics
app.get("/shorturls/:shortcode", (req, res) => {
  const entry = urls[req.params.shortcode];
  if (!entry) return res.status(404).json({ error: "Shortcode not found" });

  res.json({
    originalUrl: entry.url,
    createdAt: entry.createdAt,
    expiry: entry.expiry,
    totalClicks: entry.clicks.length,
    clicks: entry.clicks
  });
});

// ============ Start Server ============
app.listen(3000, () => {
  require("fs").appendFileSync("app.log", `Server started at ${new Date().toISOString()}\n`);
});