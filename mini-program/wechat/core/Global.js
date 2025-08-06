import GraphicsVO from '../model/GraphicsVO.js'
import ObjectPool from '../utils/ObjectPool.js'
import ClassUtil from '../utils/ClassUtil.js'
import ContextVO from '../model/ContextVO.js'
import Signal from '../events/Signal.js'
import Requst from '../net/Requst.js'
import Storage from './Storage.js'

export default class Global
{
	static className="Global";
	static _gc_list=["StageEvent","DisplayObjectContainer","Graphics","DisplayObject","MovieClip","BoxShape","Matrix"];
	
	 /**
	 * --------------------------------------------
	 *              小程序参数
	 * --------------------------------------------
	 */
	//是否展示状态
	static is_show=false;
	//是否是开发模式 true开发模式  false发布版本
	static dev=true;
	//是否是PC端浏览
	static isPC=false;
	
	/*系统信息
	platform,windowWidth,windowHeight..
	参看 https://developers.weixin.qq.com/miniprogram/dev/api/base/system/system-info/wx.getSystemInfoSync.html
	*/
	static system=null;
	/**
	 * 设备基础信息
	 * https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getDeviceInfo.html
	 */
	static deviceInfo=null;
	//设备像素比
	static ratio=0;
	
	/*小程序启动时的参数
	query,scene,path..
	参看 https://developers.weixin.qq.com/miniprogram/dev/api/base/app/life-cycle/wx.getLaunchOptionsSync.html
	*/
	static params=null;

	/**
	 * 游戏帧频(帧/秒)
	 */
	static fps=60;

	/**
	 * 运行帧频倍数
	 */
	static multiple=1;
	
	/**
	 * --------------------------------------------
	 *              基础控制器
	 * --------------------------------------------
	 */
	//页面请求
	static _request=null;
	
	//缓存
	static _storage=null;

	//事件发送器
	static _dispatcher=null;

	//场景
    static _stage=null;
    
	static get stage()
	{
		return Global._stage;
	}

	static set stage(value)
	{
		if(Global._stage==value) return;
		if(Global._stage) Global._stage.dispose();
		Global._stage=value;
	}

	//配置数据
	static config=null;

	static get dispatcher()
	{
		if(!this._dispatcher) this._dispatcher=new Signal();
		return this._dispatcher;
	}
	
	static get request()
	{
		if(!this._request) this._request=new Requst(this.config?.request_path);
		return this._request;
	}
	
	static get storage()
	{
		if(!this._storage) this._storage=new Storage();
		return this._storage;
	}
	
	/**
	 * 初始化实例
	 * @param {Object} options
	 */
	static init(options)
	{
		if(!Global || Global.params) return;
		Global.params=options;

		ContextVO.INIT_CLASS();
	    GraphicsVO.INIT_CLASS();
		

      /**
       *  pixelRatio	number	设备像素比
          screenWidth	number	屏幕宽度，单位px
          screenHeight	number	屏幕高度，单位px
          windowWidth	number	可使用窗口宽度，单位px
          windowHeight	number	可使用窗口高度，单位px
          statusBarHeight	number	状态栏的高度，单位px
          screenTop	number	窗口上边缘的y值
       */
		Global.system = wx.getWindowInfo();
		Global.ratio=Global.system ? Global.system.pixelRatio : 1;
		console.log("[INIT]",options,Global.system);

		try{
			Global.deviceInfo = wx.getDeviceInfo();
		}catch(err){}
		Global.isPC=Global.deviceInfo ? (Global.deviceInfo.platform=="devtools" || Global.deviceInfo.platform=="windows") : false;
	}

	/*
	@param object Object 代理对象
	@param target Object 代理目标
	@param property String 目标属性
	@param property String 代理属性
	*/
	static proxy(o,t,p,d)
	{
		o[p]=function()
		{
			return t[p].apply(t, arguments) || o;
		}
		
		d && (o[d]=o[p]);
	}
	
	/**
	 * 改变func函数的作用域scope，即this的指向。
	 * @param {Function} func 要改变函数作用域的函数。
	 * @param {Object} self 指定func函数的作用对象。
	 * @return {Function} 一个作用域为参数self的功能与func相同的新函数。
	 */
	static delegate (func, self)
	{
		let context = self ;
	  	let args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : [];
	  	
		return function() 
		{
			let newArgs = Array.prototype.concat.apply(args, arguments);
	  		return func.apply(context, newArgs);
		}
	}

	static gc(obj)
	{
		const type=ClassUtil.getQualifiedClassName(obj);
		if(Global._gc_list.indexOf(type)<0) return false;
		return ObjectPool.remove(obj);
	}
}

module.exports = Global;