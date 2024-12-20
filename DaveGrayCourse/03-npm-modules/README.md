# NPM

https://www.npmjs.com/

- nodemon https://www.npmjs.com/package/nodemon `npm i nodemon -g`
- date-fns https://www.npmjs.com/package/date-fns `npm i date-fns`
- uuid https://www.npmjs.com/package/uuid `npm i uuid`
- axios https://www.npmjs.com/package/axios `npm i axios`

# CLI Commands

https://docs.npmjs.com/cli/v11/

## Initialize

npm init `-y` // generate without questions

## Install

- npm install // install the node modules based on the package.json file
- npm install axios // install production dependencies for build
- npm install nodemon `-g` // install globally
- npm install nodemon `-D` // install dev dependencies
- npm install uuid`@8.3.2` // install specific version

aliases: add, i

## Update

- npm update

aliases: up, upgrade

## Uninstall

- npm uninstall uuid
- npm remove nodemon **-D** // uninstall but doesn't change the scripts
- npm remove nodemon **-g**

aliases: un, remove, rm

## Start

- npm start
- npm run dev

# package.json

- package-lock.json // handled by npm, don't change anything
- dependencies // production dependencies
- semantic versioning: MAJOR.MINOR.PATCH
  - `^`11.0.3 // update **_minor and patch_** but not major
  - `~`11.0.3 // update **_patch_** but not major and minor
  - 11.0.3 // only this version for this project
  - "uuid": `"*"` // update everything to the latest version
- for nodemon:

```
  "scripts": {
    "start": "node index",
    "dev": "nodemon index"
  },
```
