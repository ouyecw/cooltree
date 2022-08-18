/**
===================================================================
Global Object
===================================================================
**/

Global={};
Global.canvas=Global.context=null;

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
 * 是否触摸屏
 */
Global.canTouch=false;

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

//计时器
Global.animFrame=null;

Global.setup=function(n)
{
	if(StringUtil.isEmpty(n)) return;
	n=n.toLowerCase();
    
	if (n.indexOf(SystemType.OS_IPHONE) > 0) {
		Global.os = SystemType.OS_IPHONE;
		Global.canTouch = true;
		Global.ios = true;
	} else if (n.indexOf(SystemType.OS_IPOD) > 0) {
		Global.os = SystemType.OS_IPOD;
		Global.canTouch = true;
		Global.ios = true;
	} else if (n.indexOf(SystemType.OS_IPAD) > 0) {
		Global.os = SystemType.OS_IPAD;
		Global.ios = true;
		Global.canTouch = true;
	} else if (n.indexOf(SystemType.OS_ANDROID) > 0) {
		Global.os = SystemType.OS_ANDROID;
		Global.canTouch = true;
		Global.android = true;
		Global.isBrokenAndroid=(n.match(/android 2\.[12]/)!== null);
	} else if (n.indexOf(SystemType.OS_WINDOWS_PHONE) > 0) {
		Global.os = SystemType.OS_WINDOWS_PHONE;
		Global.canTouch = true;
	} else if (n.indexOf(SystemType.OS_BLACK_BERRY) > 0) {
		Global.os = SystemType.OS_BLACK_BERRY;
		Global.canTouch = true;
	}
	
	Global.isQQBrowser=(/qqbrowser/i).test(n);
	Global.isWebKit = (/webkit/i).test(n);
	Global.isOpera = (/opera/i).test(n);
	Global.isIE = (/msie/i).test(n);
	Global.isFirefox = (/firefox/i).test(n);
	Global.isChrome = (/chrome/i).test(n);
	Global.isSafari = (/safari/i).test(n) && !Global.isChrome;
	Global.isWeixin=(n.match(/MicroMessenger/i)=="micromessenger");
	Global.cssPrefix = Global.isWebKit ? "webkit" : Global.isFirefox ? "Moz" : Global.isOpera ? "o" : Global.isIE ? "ms" : "";

	Global.supportStorage  = "localStorage" in window;
	Global.supportOrientation = "orientation" in window;
	Global.supportDeviceMotion = "ondevicemotion" in window;
	Global.supportTouch = "ontouchstart" in window;
	Global.canUseWebAudio = (window["AudioContext"] || window[Global.cssPrefix+"AudioContext"]);
	
	Global.animFrame=(window.requestAnimationFrame || window[Global.cssPrefix+"RequestAnimationFrame"] || null);
	Global.supportCanvas = document.createElement("canvas").getContext != null;
	Global.useCanvas=Global.supportCanvas;
	
	const testElem = document.createElement("div");
    Global.supportTransform = (testElem.style[Global.cssPrefix + "Transform"] != undefined);
    Global.supportSVG = (!! document.createElementNS && !! document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect);
    Global.language = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || "";
    if(!StringUtil.isEmpty(Global.language)) WordUtil.language=WordUtil.format(Global.language);
}

Global.setup(navigator.userAgent);

Global.reszie=function(w,h)
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
Global.getScreenWidth=function()
{
	return window.screen.width;
}

/**
 * 获得屏幕分辨率的高
 */
Global.getScreenHeight=function()
{
	return window.screen.height;
}


/*
 * 获得页面参数
 */
Global.GetQueryString=function(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

/**
 * 调试输出
 */
Global.trace=function()
{
	if(!Global.debug) return;
	
	var str="";
	var i;
	
	for(i=0; i<arguments.length;i++){
		str+=arguments[i]+" ";
	}
	
	if(console != undefined && typeof console.log == "function" && !Global.htmlDebug){
		console.log(str);
	}else{
		if(Global.output==undefined) {
			Global.output = document.createElement("div");
			Global.output.id="global_output";
			Global.output.style.position="absolute";
			Global.output.style.zIndex=Global.layer+10;
			Global.output.style.height=Math.ceil((Global.canvas ? Global.canvas.height : window.innerHeight)*0.5)+"px";
			Global.output.style.width=Math.ceil((Global.canvas ? Global.canvas.width: window.innerWidth)*0.5)+"px";
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
Global.proxy=function(o,t,p,d)
{
	o[p]=function()
	{
		return t[p].apply(t, arguments) || o;
	}
	
	d && (o[d]=o[p]);
}

const emptyConstructor = function() {};

Global.inherit=function(childClass, parentClass,attributes) 
{
  	emptyConstructor.prototype = parentClass.prototype;
  	childClass.superClass = parentClass.prototype;
  	childClass.prototype = new emptyConstructor();
  	childClass.prototype.constructor = childClass;
	
	if(attributes==undefined || attributes==null) return;
	for (var i in attributes){
		childClass.prototype[i]=attributes[i];
	}
}

/**
 * 改变func函数的作用域scope，即this的指向。
 * @param {Function} func 要改变函数作用域的函数。
 * @param {Object} self 指定func函数的作用对象。
 * @return {Function} 一个作用域为参数self的功能与func相同的新函数。
 */
Global.delegate = function(func, self)
{
	var context = self || window;
  	if (arguments.length > 2) 
  	{
    	var args = Array.prototype.slice.call(arguments, 2);    	
    	return function() 
    	{
      		var newArgs = Array.prototype.concat.apply(args, arguments);
      		return func.apply(context, newArgs);
    	};
  	}else 
  	{
    	return function() {return func.apply(context, arguments);};
  	}
};

Global.delegate2 = function(func, self)
{
	var context = self || window;
  	var args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : [];
  	
	return function() 
	{
  		var newArgs = args.slice();
  		for(var i=arguments.length-1;i>=0;i--) 
  			newArgs.unshift(arguments[i]);
  		
  		newArgs.push(this);
  		return func.apply(context, newArgs);
	};
};

Global._gc_list=["Shape","DisplayObjectContainer","Graphics","DisplayObject","DOMDisplay","MovieClip","DOMMovie","Matrix","Source","Effect","BoxShape"];

Global.gc=function(obj)
{
	var type=ClassUtil.getQualifiedClassName(obj);
	if(Global._gc_list.indexOf(type)==-1) return false;
	return ObjectPool.remove(obj);
}

Global.local=function()
{
	var local=window.localStorage;
	local=(local==undefined || local==null) ? window.sessionStorage : local;
	
	if(local==undefined || local==null){
		if(Global.__local_cache==undefined) {
			Global.__local_cache={};
			Global.__local_cache._cache={};
			Global.__local_cache.setItem=function(label,data){Global.__local_cache._cache[label]=data};
			Global.__local_cache.getItem=function(label){ return Global.__local_cache._cache[label]};
		    Global.__local_cache.clear=function(){Global.__local_cache._cache={}};
		}
		
		local = Global.__local_cache;
	}
	
	return local;
}

Global.copy = function(a, b, d, f) 
{
	if (typeof a != "object") return a;
	var c = a.valueOf();
	if (a != c) return new a.constructor(c);
	if (a instanceof a.constructor && a.constructor !== Object) {
		var c = b ? ObjectPool.create(b) : Global.clone(a.constructor.prototype),
			e;
			
		for (e in a){
			if(!f && typeof(a[e])=="function") continue;
			if (b || a.hasOwnProperty(e)) c[e] = a[e]
		}
			
	} else
		for (e in c = {}, a) c[e] = a[e]; if (d)
		for (e in d) c[e] = d[e];
	return c
}

Global.clone = function(a) 
{
	Global._cloneFunc.prototype = a;
	return new Global._cloneFunc
}

Global._cloneFunc = function() {}

if(window.trace == undefined) window.trace = Global.trace;