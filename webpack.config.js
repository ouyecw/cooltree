const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = (env,argv) =>{
  return{
  entry: {
	  main:['./src/cooltree/index.js'],
  },
  output: {
	  libraryTarget: "commonjs2",
	  filename: 'npm_cooltree.js',
      path: path.resolve(__dirname, 'bin')
  },
	module: { 
	  rules: [{ 
		test: /\.js$/, 
		exclude: /node_modules/, 
		use:{
			loader: 'babel-loader',
			options: {
				presets: ['env']
		    }
		}
	  }] 
	},
	optimization: {
		minimizer: [new UglifyJsPlugin({
			exclude: /\.min\.js$/, 
			parallel: true, 
			extractComments: true, 
			cache: true,
		})],
		splitChunks: {
		  chunks: "async",
		  name: true,
		  minChunks: Infinity,
		}
	},
	stats: { 
		children: false ,
	},
  plugins: [
	new webpack.DefinePlugin({
	    'versionTime' : new Date().getTime()
	}),
	
    new CleanWebpackPlugin(),

  ],
};}
