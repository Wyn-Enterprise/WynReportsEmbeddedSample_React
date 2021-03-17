# Wyn Report Designer

## How to install

```cmd
yarn add @grapecity/wyn-report-designer
```

## How to include

The bundles are here: `./node_modules/@grapecity/wyn-report-designer/dist`

Using the physical path:

```html
<head>
  ...
  <link href="./node_modules/@grapecity/wyn-report-designer/dist/designer-app.css" rel="stylesheet">
  ...
</head>
<body>
  ...
  <script type="text/javascript" src="./node_modules/@grapecity/wyn-report-designer/dist/designer-app.js"></script>
  ...
</body>
```

Using the package name:

```javascript
import "@grapecity/wyn-report-designer/dist/designer-app.js";
import "@grapecity/wyn-report-designer/dist/designer-app.css";
```

Using attributes `main` and `style` from `package.json`:
```javascript
import "@grapecity/wyn-report-designer";
```