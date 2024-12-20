const { format } = require("date-fns");
const { v4: uuid } = require("uuid"); // : as
// import { v4 as uuidv4 } from 'uuid';

// - other ways: -
// const { v4 } = require("uuid");
// const uuid = require("uuid"); // => console.log(uuid.v4());

// ----- date-fns -----

console.log(format(new Date(), "yyyy-MM-dd\tHH:mm:ss"));
console.log(format(new Date(1987, 1, 11, 21, 20, 5), "yyyy-MM-dd\tHH:mm:ss"));
// 2024-12-17      15:41:50
// 1987-02-11      21:20:05

// ----- uuid -----
console.log(uuid()); // 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
