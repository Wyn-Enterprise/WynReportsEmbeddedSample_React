# Wyn Designer Sample

This sample demonstrates the use of GrapeCity ActiveReports WynDesigner connected to the Wyn portal.

## System requirements

This sample requires:
 * [Node.js](https://nodejs.org/en/download/) 10.14.0 or newer

## Build and run the sample

### Description

We download the given packages and update reporting sample packages. After we compile the sample and run it.

### About semantic versioning

package.json
```
"package-name": "~x.y.z"
```

- x - major releases
- y - minor releases
- z - patch releases
- ~ - updating packages as instructed will update to the latest patch

### Steps

1. Execute `run-yarn.cmd` ( or `run-npm.cmd` )
2. Open http://localhost:3000 by browser

or manually yarn

1. Open cmd.exe and go to the root of the directory WynDesignerSample
2. Enter `yarn`
3. Enter `yarn upgrade @grapecity/wyn-report-viewer`
4. Enter `yarn upgrade @grapecity/wyn-report-designer`
5. Enter `yarn dev`
6. Open http://localhost:3000 by browser

or manually npm

1. Open cmd.exe and go to the root of the directory WynDesignerSample
2. Enter `npm install`
3. Enter `npm update @grapecity/wyn-report-viewer --latest`
4. Enter `npm update @grapecity/wyn-report-designer --latest`
5. Enter `npm run dev`
6. Open http://localhost:3000 by browser

## Available portal list

 - https://portal41-cn.grapecitydev.com/ - cn 4.1
 - https://portal41-en.grapecitydev.com/ - en 4.1
 - https://portal-4-cn.grapecitydev.com/ - cn 4.0
 - https://portal-4-en.grapecitydev.com/ - en 4.0
 - https://gces-dev-cn.grapecitydev.com/ - cn dev
 - https://gces-dev-en.grapecitydev.com/ - en dev

## Cross-Origin Resource Sharing of portals

All portals are configured with these permissions:

 - Access-Control-Allow-Origin `3000`, `42002`, `42008` ports
 - Access-Control-Expose-Headers `content-disposition`, `location`
