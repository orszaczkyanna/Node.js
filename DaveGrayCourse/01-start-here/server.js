console.log("Hello World!");
console.log(global);
// global object instead of window object (global object is much smaller)
//      setInterval
//      setTimeout

// --------------------------------
// Common Core modules - CommonJS modules (require)
const os = require("os"); // instead of import
const path = require("path");

// os
console.log(os.type()); // Windows_NT
console.log(os.version()); // Windows 10 Pro
console.log(os.homedir()); // C:\Users\Name

console.log(__dirname); // C:\Users\Name\Desktop\NodeJS\01-start-here
console.log(__filename); // C:\Users\Name\Desktop\NodeJS\01-start-here\server.js

// path
console.log(path.dirname(__filename)); // C:\Users\Name\Desktop\NodeJS\01-start-here
console.log(path.basename(__filename)); // server.js
console.log(path.extname(__filename)); // .js

console.log(path.parse(__filename));
// {
//   root: 'C:\\',
//   dir: 'C:\\Users\\Name\\Desktop\\NodeJS\\01-start-here',
//   base: 'server.js',
//   ext: '.js',
//   name: 'server'
// }

// ------- Create own module -------

const math = require("./math");
console.log(math);

console.log(math.subtract(2, 3)); // -1
console.log(math.divide(8, 5)); // 1.6

// ------- Destructuring -------

const { add } = require("./math");
const { subtract, multiply, divide } = require("./math");

console.log(add(2, 6)); // 8
console.log(multiply(2, 6)); // 12
