# 22HM1A3331
URL Shortener Microservice
This is a backend project built with Node.js and Express as part of the Affordmed Campus Hiring Evaluation. The service provides URL shortening, redirection, and usage analytics with logging.
■ How to Run
1. Make sure Node.js is installed (check with: node -v).
2. Navigate to the project folder:
cd C:\Test\affordmed
3. Install dependencies:
npm install express nanoid
4. Start the server:
node server.js
5. Open in browser:
http://localhost:3000
You should see the message:
 Your server is running on port 3000
■ API Endpoints
1. Create Short URL (POST /shorturls)
Request Body:
{
"url": "https://www.google.com",
 "shortcode": "abcd1",
"validity": 10
}
Response:
{
 "shortcode": "abcd1",
"shortUrl": "http://localhost:3000/abcd1"
}
2. Redirect to Original URL (GET /:shortcode)
Example: http://localhost:3000/abcd1

3. Retrieve Short URL Statistics (GET /shorturls/:shortcode)
Example: http://localhost:3000/shorturls/abcd1
Response:
{
 "originalUrl": "https://www.google.com",
 "createdAt": "2025-09-06T12:00:00.000Z",
 "expiry": "2025-09-06T12:30:00.000Z",
 "totalClicks": 3,
 "clicks": [
 {
 "time": "2025-09-06T12:05:00.000Z",
 "referrer": "direct",
 "ip": "::1",
 "geo": "India"
 }
 ]
}

■ Logging
All requests are logged into app.log.
Example log entry:
{"time":"2025-09-06T09:28:13.369Z","method":"GET","url":"/abcd1","ip":"::1"}
■ Features
- Shorten any valid URL
- Custom or auto-generated shortcodes
- Expiry time for links (default: 30 minutes)
- Redirect to original URL
- Track analytics (clicks, referrer, IP, location)
- Structured logging
