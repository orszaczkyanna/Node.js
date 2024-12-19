const fs = require("fs");
const path = require("path");

// --------------------- readFile ----------------------

// fs.readFile(path[, options], callback)
fs.readFile(
  path.join(__dirname, "files", "starter.txt"),
  "utf8",
  (err, data) => {
    if (err) throw err;
    console.log(data.toString());
  }
);

// Ha megadom az utf8-t már nem kell a .toString()

// // 1) "utf8"
// fs.readFile("./files/starter.txt", "utf8", (err, data) => {
//   if (err) throw err;
//   console.log(data.toString());
// });

// // 2) {encoding: "utf8"}
// fs.readFile("./files/starter.txt", { encoding: "utf8" }, (err, data) => {
//   if (err) throw err;
//   console.log(data);
// });

// // 3) .toString()
// fs.readFile("./files/starter.txt", (err, data) => {
//   if (err) throw err;
//   console.log(data.toString());
// });

// --------------------- writeFile ----------------------
// fs.writeFile(file, data[, options], callback)
// utf8 default, nem kell megadni
fs.writeFile(
  path.join(__dirname, "files", "reply.txt"),
  "Nice to meet you.",
  (err) => {
    if (err) throw err;
    console.log("Write complete");

    // --------------------- appendFile ----------------------
    // fs.appendFile(path, data[, options], callback)
    // Ha a fájl nem létezik, létrehozza
    fs.appendFile(
      path.join(__dirname, "files", "reply.txt"),
      "\nYou, as well.",
      (err) => {
        if (err) throw err;
        console.log("Append complete");

        // --------------------- rename ----------------------
        // fs.rename(oldPath, newPath, callback)
        fs.rename(
          path.join(__dirname, "files", "reply.txt"),
          path.join(__dirname, "files", "newReply.txt"),
          (err) => {
            if (err) throw err;
            console.log("Rename complete");
          }
        );
      }
    );
  }
);

// exit on uncaught errors
process.on("uncaughtException", (err) => {
  console.error(`There was an uncaught error: ${err}`);
  process.exit(1);
});
