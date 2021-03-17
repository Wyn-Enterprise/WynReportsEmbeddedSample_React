# Wyn Report Viewer

## How to install

```cmd
npm i @grapecity/wyn-report-viewer --save-dev
```

## How to include

The bundles are here: `./node_modules/@grapecity/wyn-report-viewer/dist`

Using the physical path:

```html
<head>
  ...
  <link href="./node_modules/@grapecity/wyn-report-viewer/dist/viewer-app.css" rel="stylesheet">
  ...
</head>
<body>
  ...
  <script type="text/javascript" src="./node_modules/@grapecity/wyn-report-viewer/dist/viewer-app.js"></script>
  ...
</body>
```

Using the package name:

```javascript
import "@grapecity/wyn-report-viewer/dist/viewer-app.js";
import "@grapecity/wyn-report-viewer/dist/viewer-app.css";
```

Using attributes `main` and `style` from `package.json`:
```javascript
import "@grapecity/wyn-report-viewer";
```

## How to use

```html
<body onload="loadViewer()">
  ...
  <div id="viewerContainer" />
  ...
  <script type="text/javascript">
    const portalUrl = '<portalUrl>';
    async function loadViewer() {
      const referenceToken = await GrapeCity.ActiveReports.getReferenceToken(portalUrl, '<userName>', '<password>')
      const viewer = GrapeCity.ActiveReports.JSViewer.create({
        element: '#viewerContainer',
        reportID: '<reportId>',
        reportService: {
          url: portalUrl,
          securityToken: referenceToken,
        }
      });
      viewer.openReport('<reportId>');
    }
  </script>
  ...
</body>
```
