const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

const logEvents = require("./logEvents");

const EventEmitter = require("events");
class Emitter extends EventEmitter {}
const myEmitter = new Emitter();
myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName)); // add listener for the log event

const PORT = process.env.PORT || 3500;

// Serve file if it exists or return a 404 if it doesn't
const serveFile = async (filePath, contentType, response) => {
  try {
    // const rawData = await fsPromises.readFile(filePath, "utf8");
    const rawData = await fsPromises.readFile(
      filePath,
      !contentType.includes("image") ? "utf8" : "" // ensure that images are displayed properly
    );
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    // response.writeHead(200, { "Content-Type": contentType });
    response.writeHead(filePath.includes("404.html") ? 404 : 200, {
      "Content-Type": contentType,
    });
    // response.end(data); // send the data back
    response.end(
      contentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (err) {
    console.error(err);
    myEmitter.emit("log", `${err.name}: ${err.message}`, "errLog.txt"); // emit event
    response.statusCode = 500; // server error
    response.end(); // => res.end()
  }
};

// Create Server
const server = http.createServer((req, res) => {
  console.log(req.url, req.method); // /new-page GET
  myEmitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt"); // emit event

  const extension = path.extname(req.url); // .html or .json etc.
  let contentType; // text/html or application/json

  // -- Set Content-Type based on file extension --
  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default: // .html
      // It could just be the slash "/"
      contentType = "text/html";
  }

  // -- Determine the file path based on the request URL and content type --
  let filePath = // e.g. ./views/index.html
    // contentType => conditional statement
    // path.join => result
    contentType === "text/html" && req.url === "/" // -- if --
      ? path.join(__dirname, "views", "index.html") // views/index.html
      : contentType === "text/html" && req.url.slice(-1) === "/" // -- else if --
      ? path.join(__dirname, "views", req.url, "index.html") // views/subdir/
      : contentType === "text/html" // -- else if --
      ? path.join(__dirname, "views", req.url) // views/new-page.html
      : path.join(__dirname, req.url); // --default-- css or image etc
  // .slice(-1): the last character

  // Makes .html extension not required in the browser
  // if we only type e.g., "new-page" into the URL without an extension, then append ".html" to it
  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  const fileExists = fs.existsSync(filePath);

  // -- Serve file or return 404 --
  if (fileExists) {
    // serve the file
    serveFile(filePath, contentType, res);
  } else {
    // 404 not found
    // 301 redirect
    switch (path.parse(filePath).base) {
      // base: 'example.html',
      case "old-page.html":
        // status code, value
        res.writeHead(301, { Location: "/new-page.html" });
        res.end();
        break;
      case "www-page.html":
        res.writeHead(301, { Location: "/" });
        res.end();
        break;
      default:
        // serve a 404 response
        // serveFile(filePath, contentType, res);
        serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
        break;
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
