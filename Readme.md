# Wyn Designer Sample
---
This sample demonstrates the use of Wyn ReportDesigner connected to the Wyn portal.

## System requirements

This sample requires:
 * [Node.js](https://nodejs.org/en/download/) 10.14.0 or newer
 * [Wyn Enterprise](https://wyn.grapecity.com/demos/request/trial) 4.0.1173.0 or newer

## Build and run the sample

### Description

We download the given packages and update reporting sample packages. After we compile the sample and run it.

### Steps

1. Install [Wyn Enterprise](https://wyn.grapecity.com/demos/request/trial) to your  machine
2. Execute `run-yarn.cmd` ( or `run-npm.cmd` )
3. Open http://localhost:3000 by browser

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

### About semantic versioning

package.json
```
"package-name": "~x.y.z"
```

- x - major releases
- y - minor releases
- z - patch releases
- ~ - updating packages as instructed will update to the latest patch

### Documentation

- [Developer Documentation](https://wyn.grapecity.com/docs/dev-docs/)
- [Embedding Wyn Report Viewer and Designer Using Div Tags](https://wyn.grapecity.com/docs/dev-docs/Embedding-Wyn/Embedding-Designer-Viewer-Using-Div)
