// ---- Stream for larger files ----

const fs = require("fs");
const path = require("path");

// const rs = fs.createReadStream("./files/lorem.txt", { encoding: "utf8" });
// const ws = fs.createWriteStream("./files/newLorem.txt");

const rs = fs.createReadStream(path.join(__dirname, "files", "lorem.txt"), {
  encoding: "utf8",
});

const ws = fs.createWriteStream(path.join(__dirname, "files", "new-lorem.txt"));

// ----- "copy" lorem.txt content to new-lorem.txt -----
// rs.on("data", (dataChunk) => {
//     ws.write(dataChunk);
// });

// More efficient:
rs.pipe(ws);
