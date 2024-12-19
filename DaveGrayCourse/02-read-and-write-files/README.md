# [File System](https://nodejs.org/docs/latest-v22.x/api/fs.html)

! Asynchronous: The execution of one task isn't dependent on another. Tasks may run simultaneously.

`const fs = require("fs");`

- fs.`readFile`(path, **'utf8'**[, options], callback)
- fs.`writeFile`(file, data[, options], callback)
- fs.`appendFile`(path, data[, options], callback)
- fs.`rename`(oldPath, newPath, callback)
- fs.`existsSync`(path) // check if it exists

# File System Promises

`const fsPromises = require("fs").promises;`

- await fsPromises.readFile(path[, options])
- await fsPromises.writeFile(file, data[, options])
- await fsPromises.appendFile(path, data[, options])
- await fsPromises.rename(oldPath, newPath)
- await fsPromises.`unlink`(path) // delete

# Stream

const fs = require("fs");

- const rs = fs.`createReadStream`(path[, options])
- const ws = fs.`createWriteStream`(path[, options])
- rs.`on`() _or_ rs.`pipe`()

# Directories

const fs = require("fs");

- fs.`mkdir`(path[, options], callback) // create
- fs.`rmdir`(path[, options], callback) // delete
