/**
===================================================================
Global Object
===================================================================
**/

import SystemType from '../type/SystemType.js'
import TimeUtil from '../utils/TimeUtil.js'
import StringUtil from '../utils/StringUtil.js'
import WordUtil from '../utils/WordUtil.js'
import ContextVO from '../model/ContextVO.js'
import GraphicsVO from '../model/GraphicsVO.js'
import ClassUtil from '../utils/ClassUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import Storage from '../plus/Storage.js'
import Stage from '../display/Stage.js'

export default class Global
{
	static setup(n)
	{
		if(StringUtil.isEmpty(n)) return;
		n=n.toLowerCase();
	
		if (n.indexOf(SystemType.OS_IPHONE) > 0) {
			Global.os = SystemType.OS_IPHONE;
			Global.ios = true;
		} else if (n.indexOf(SystemType.OS_IPOD) > 0) {
			Global.os = SystemType.OS_IPOD;
			Global.ios = true;
		} else if (n.indexOf(SystemType.OS_IPAD) > 0) {
			Global.os = SystemType.OS_IPAD;
			Global.ios = true;
		} else if (n.indexOf(SystemType.OS_ANDROID) > 0) {
			Global.os = SystemType.OS_ANDROID;
			Global.android = true;
			Global.isBrokenAndroid=(n.match(/android 2\.[12]/)!== null);
		} else if (n.indexOf(SystemType.OS_WINDOWS_PHONE) > 0) {
			Global.os = SystemType.OS_WINDOWS_PHONE;
		} else if (n.indexOf(SystemType.OS_BLACK_BERRY) > 0) {
			Global.os = SystemType.OS_BLACK_BERRY;
		}
		
		Global.isPC=(Global.os==SystemType.OS_PC);
		Global.isQQBrowser=(/qqbrowser/i).test(n);
		Global.isWebKit = (/webkit/i).test(n);
		Global.isOpera = (/opera/i).test(n);
		Global.isIE = (/msie/i).test(n);
		Global.isFirefox = (/firefox/i).test(n);
		Global.isChrome = (/chrome/i).test(n);
		Global.isSafari = (/safari/i).test(n) && !Global.isChrome;
		Global.isWeixin=(n.match(/MicroMessenger/i)=="micromessenger");
		Global.cssPrefix = Global.isWebKit ? "webkit" : Global.isFirefox ? "Moz" : Global.isOpera ? "o" : Global.isIE ? "ms" : "";
	
		Global.supportStorage  = "localStorage" in Global.root;
		Global.supportOrientation = "orientation" in Global.root;
		Global.supportDeviceMotion = "ondevicemotion" in Global.root;
		Global.supportTouch = "ontouchstart" in Global.root;
		
		Global.pixelRatio=Global.root.devicePixelRatio;
		Global.canUseWebAudio =  (Global.root["AudioContext"] || Global.root[Global.cssPrefix+"AudioContext"]);
		
		Global.animationFrame=(Global.root["requestAnimationFrame"] || Global.root[Global.cssPrefix+"RequestAnimationFrame"]);
		if(Global.animationFrame) Global.animationFrame=Global.root[Global.animationFrame.name].bind(Global.root);
		Global.supportCanvas = document.createElement("canvas").getContext != null;
		Global.useCanvas=Global.supportCanvas;
		
		const testElem = document.createElement("div");
	    Global.supportTransform = (testElem.style[Global.cssPrefix + "Transform"] != undefined);
	    Global.supportSVG = (!! document.createElementNS && !! document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect);
	    Global.language = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || "";
	    if(!StringUtil.isEmpty(Global.language)) WordUtil.language=WordUtil.format(Global.language);
		
		try{
			Global.version=TimeUtil.auto(new Date(versionTime));
			console.log("\u001b[32m[COOLTREE VERSION]",Global.version);
		}
		catch(err){};
	    
	    ContextVO.INIT_CLASS();
	    GraphicsVO.INIT_CLASS();
	}
	
	static reszie(w,h)
	{
		Global.width=Math.floor(w);
		Global.height=Math.floor(h);
		
		if(Stage.current) {
			Stage.current.size(w,h);
			Stage.current.auto_fresh=true;
		}
	}
	
	/**
	 * 获得屏幕分辨率的宽
	 */
	static getScreenWidth()
	{
		return Global.root.screen.width;
	}
	
	/**
	 * 获得屏幕分辨率的高
	 */
	static getScreenHeight()
	{
		return Global.root.screen.height;
	}
	
	
	/*
	 * 获得页面参数
	 */
	static GetQueryString(name)
	{
	     let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     let r = Global.root.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}
	
	/**
	 * 调试输出
	 */
	static trace()
	{
		if(!Global.debug) return;
		
		let str="";
		let i;
		
		for(i=0; i<arguments.length;i++){
			str+=arguments[i]+" ";
		}
		
		if(StringUtil.isEmpty(str)) return;
		
		if(console != undefined && typeof console.log == "function" && !Global.htmlDebug){
			console.log.apply(console,arguments);
		}else{
			if(Global.output==undefined) {
				Global.output = document.createElement("div");
				Global.output.id="global_output";
				Global.output.style.position="absolute";
				Global.output.style.zIndex=Global.layer+10;
				Global.output.style.height=Math.ceil((Global.canvas ? Global.canvas.height : Global.root.innerHeight)*0.5)+"px";
				Global.output.style.width=Math.ceil((Global.canvas ? Global.canvas.width: Global.root.innerWidth)*0.5)+"px";
				Global.output.style.fontSize=Global.fontSize+"px";
				Global.output.style.color="#880000";
				Global.output.style.left="3px";
			}
			
			if(Global.output_list==undefined) Global.output_list=[];
			Global.output_list.push("<br>"+str+"</br>");
			if(Global.output_list.length>12) Global.output_list.shift();
			Global.output.innerHTML=Global.output_list.join(" ");
			
			if(Global.output.parentNode==undefined){
				if(Global.div){
	//				Global.output.style.position="relative";
					Global.div.appendChild(Global.output);
				}else{
					document.body.appendChild(Global.output);
				}
			}    
		}
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
		let context = self || Global.root;
	  	if (arguments.length > 2) 
	  	{
	    	let args = Array.prototype.slice.call(arguments, 2);    	
	    	return function() 
	    	{
	      		let newArgs = Array.prototype.concat.apply(args, arguments);
	      		return func.apply(context, newArgs);
	    	};
	  	}else 
	  	{
	    	return function() {return func.apply(context, arguments);};
	  	}
	};
	
	static delegate2 (func, self)
	{
		let context = self || Global.root;
	  	let args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : [];
	  	
		return function() 
		{
	  		let newArgs = args.slice();
	  		for(let i=arguments.length-1;i>=0;i--) 
	  			newArgs.unshift(arguments[i]);
	  		
	  		newArgs.push(this);
	  		return func.apply(context, newArgs);
		};
	};
	
	static gc(obj)
	{
		let type=ClassUtil.getQualifiedClassName(obj);
		if(Global._gc_list.indexOf(type)<0) return false;
		return ObjectPool.remove(obj);
	}
	
	static get local()
	{
		if(Global.__local) return Global.__local;
		Global.__local=new Storage();
		return Global.__local;
	}
	
	static get root()
	{
		if(Global.__root) return Global.__root;
		if (typeof self !== 'undefined')   { Global.__root= self;   return self; }
		if (typeof window !== 'undefined') { Global.__root= window; return window; }
		if (typeof global !== 'undefined') { Global.__root= global; return global; }
		throw new Error('unable to locate global object');
	}
}

Global._gc_list=["StageEvent","Shape","DisplayObjectContainer","Graphics","DisplayObject","DOMDisplay","MovieClip","DOMMovie","BoxShape"];//,"Matrix","Source","Effect"
Global.__local=Global.__local_cache=Global.__root=Global.canvas=Global.context=null;

/**
 * 当前版本
 */
Global.version='';

/**
 * canvas深度（z方向）
 */
Global.layer=5;

/**
 * debug模式
 */
Global.debug=true;

/**
 * 操作系统
 */
Global.os=SystemType.OS_PC;

/**
 * IOS系统
 */
Global.ios=false;

/**
 * Android系统
 */
Global.android=false;

/**
 * Checks whether this is a broken Android implementation.
 */
Global.isBrokenAndroid=false;

/**
 * IE 浏览器
 */
Global.isIE=false;

/**
 * firefox 浏览器
 */
Global.isFirefox=false;

/**
 * Opera 浏览器
 */
Global.isOpera=false;

/**
 * WebKit 浏览器
 */
Global.isWebKit=false;

/**
 * Chrome 浏览器
 */
Global.isChrome=false;

/**
 * Safari 浏览器
 */
Global.isSafari=false;

/**
 * QQ 浏览器
 */
Global.isQQBrowser=false;

/**
 * 舞台方向
 */
Global.aspectRatio=SystemType.NONE;

/**
 * 全局字体
 */
Global.font="Helvetica,Arial";

/**
 * 是否SVG图形 动画
 */
Global.supportSVG = false;

/**
 * 是否支持触摸屏
 */
Global.supportTouch = false;

/**
 * 是否支持画布
 */
Global.supportCanvas = false;

/**
 * 是否支持本地存储
 */
Global.supportStorage = false;

/**
 * 是否支持重力感应
 */
Global.supportOrientation = false;

/**
 * 是否支持震动
 */
Global.supportDeviceMotion = false;

/**
 * 是否CSS矩阵转换
 */
Global.supportTransform=false;

/**
 * CSS前缀
 */
Global.cssPrefix="";

/**
 * 页面内部输出调试
 */
Global.htmlDebug=false;

/**
 * 打断页面鼠标事件
 */
Global.breakTouch=false;

/**
 * 语言
 */
Global.language;

/**
 * 容器
 */
Global.div;

/**
 * 字体大小
 */
Global.fontSize=8;

/**
 * 使用画布
 */
Global.useCanvas=true;

/**
 * 全局宽度
 */
Global.width=0;

/**
 * 全局高度
 */
Global.height=0;

/**
 * 全局的坐标属性 "relative"/"absolute"
 */
Global.position="absolute";

/**
 * 自适应图形尺寸
 */
Global.autoShapeSize=true;

/**
 * 是否支持web Audio
 */
Global.canUseWebAudio=false;

/**
 * 是否是微信环境
 */
Global.isWeixin=false;

/**
 * 使用canvas的情况下，精灵图资源使用canvas缓存
 */
Global.useCache=true;

/**
 * 是否是PC端
 */
Global.isPC=true;

/**
 * 浏览器是否支持requestAnimationFrame方法
 */
Global.animationFrame=null;

/**
 * 分辨率与像素比
 */
Global.pixelRatio=1;

Global.crossdomain="anonymous";
Global.className="Global";

Global.setup(navigator.userAgent);
if(Global.root && Global.root.trace == undefined) Global.root.trace = Global.trace;