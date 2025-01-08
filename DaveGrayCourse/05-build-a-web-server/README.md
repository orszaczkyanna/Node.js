# [HTTP Server](https://nodejs.org/docs/latest-v22.x/api/http.html#httpcreateserveroptions-requestlistener)

```javascript
const http = require("node:http");
const PORT = process.env.PORT || 3500;

const server = http.createServer((req, res) => {
  console.log(req.url, req.method); // /new-page GET

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      data: "Hello World!",
    })
  );
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

# Common Methods and Properties

**Server and Environment Setup**

- `process.env.PORT` Retrieves the port number from **_environment variables_**. Commonly used to configure the server port.
- [`http.createServer()`](https://nodejs.org/docs/latest-v22.x/api/http.html#httpcreateserveroptions-requestlistener) Creates a new HTTP server that handles incoming requests.
- [`server.listen()`](https://nodejs.org/docs/latest-v22.x/api/net.html#serverlisten) Starts the server and listens for incoming connections on a specified port.

**HTTP Response Handling**

- [`res.writeHead()`](https://nodejs.org/docs/latest-v22.x/api/http.html#responsewriteheadstatuscode-statusmessage-headers) Sets the response status code and headers before sending the response.
- [`res.end()`](https://nodejs.org/docs/latest-v22.x/api/http.html#responseenddata-encoding-callback) Ends the response and sends it to the client.
- [`res.statusCode = 500`](https://nodejs.org/docs/latest-v22.x/api/http.html#responsestatuscode) Sets the HTTP status code for the response, here indicating a server error.

**JSON Utilities**

- [`JSON.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) Converts a JSON string into a **_JavaScript object_**.
- [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) Converts a JavaScript object into a JSON **_string_**.

# [Common HTTP Status Codes](https://www.geeksforgeeks.org/10-most-common-http-status-codes/)

- `200` OK / Success
- `301` Permanent Redirect
- `404` Not Found
- `500` Internal Server Error
