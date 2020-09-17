const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = (env,argv) =>{
  return{
  entry: {
    main: ['./src/app/Main.js'],
  },
  output: {
    filename: 'js/[name].[hash:8].js',
    path: path.resolve(__dirname, 'bin')
  },
	module: { 
	  rules: [{ 
		test: /\.js$/, 
		exclude: /node_modules/, 
		loader: 'babel-loader',
	  }] 
	},
  optimization: {
	splitChunks: {
	  chunks: "async",
	  name: true,
	  minChunks: Infinity,
	}
  },
  devServer: {
    port: 8119,
    host: 'localhost',
    proxy: { 
       '/': 'http://192.168.0.201:10000/'
    }
  },
  stats: { 
	  children: false ,
  },
  plugins: [
    new webpack.DefinePlugin({
	   "debugMode": (argv.mode!="production")
    }),
	  
    new CleanWebpackPlugin(),
	
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      chunks: ['main'],
    }),
   
    new CopyPlugin({patterns:
		[{
		  from: 'src/assets',
		  to: 'assets',
		}]
	}),
  ],
};}
