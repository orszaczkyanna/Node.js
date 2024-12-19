const fsPromises = require("fs").promises;

const fileOps = async () => {
  try {
    const data = await fsPromises.readFile("start.txt", "utf8");

    await fsPromises.unlink("start.txt"); // delete the file

    await fsPromises.writeFile("promiseWrite.txt", data);

    await fsPromises.appendFile("promiseWrite.txt", "You, as well.");

    await fsPromises.rename("promiseWrite.txt", "promiseComplete.txt");
  } catch (err) {
    console.log(err);
  }
};

fileOps();
