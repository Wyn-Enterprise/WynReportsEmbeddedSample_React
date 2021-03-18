const path = require('path');
const merge = require('webpack-merge');
const config = require('./webpack.config');
const port = 3000;

module.exports = merge(config, {
	mode: 'development',
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		port,
		before: (app, server, compiler) => {
			app.get('/designer-app.js', (req, res) => {
				/* Node Module */
				// res.sendfile('./node_modules/@grapecity/wyn-report-designer/dist/designer-app.js')
					
				/* Local designer-app.js (wwwroot folder) */
				res.sendfile('./src/wwwroot/wyn-report-designer/dist/designer-app.js')
				});
			app.get('/viewer-app.js', (req, res) => {
				res.sendfile('./node_modules/@grapecity/wyn-report-viewer/dist/viewer-app.js')
			});
			app.get('/vendor/*', (req, res) => {
				res.sendfile(`./src${req.originalUrl}`)
			});
		}
	}
});
