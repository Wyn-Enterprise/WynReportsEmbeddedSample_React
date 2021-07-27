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
			app.get('/vendor/*', (req, res) => {
				res.sendfile(`./src${req.originalUrl}`)
			});
		}
	}
});