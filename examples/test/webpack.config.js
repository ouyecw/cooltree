const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
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
		use:{
			loader: 'babel-loader',
			options: {
				presets: ['es2015']
		    }
		}
	  }] 
	},
  optimization: {
	splitChunks: {
	  chunks: "async",
	  name: true,
	  minChunks: Infinity,
	},
	minimizer: [new UglifyJsPlugin({
		exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
		parallel: true, // 开启并行压缩，充分利用cpu
		extractComments: true, // 移除注释
		cache: true,
	})],
  },
  devServer: {
    port: 8118,
    host: '192.168.0.122',
    proxy: { 
       '/': 'http://192.168.0.201:10000/'
    }
  },
  stats: { 
	  children: false ,
  },
  plugins: [
    new webpack.DefinePlugin({
	    'version' : new Date().getTime(),
	    "is_debug": (argv.mode!="production")
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
