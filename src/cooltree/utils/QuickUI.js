import DOMUtil from './DOMUtil.js'
import Global from '../core/Global.js'
import Button from '../ui/Button.js'
import StringUtil from './StringUtil.js'
import Effect from '../model/Effect.js'
import ColorUtil from './ColorUtil.js'
import Factory from '../core/Factory.js'
import Loader from '../loader/Loader.js'
import TweenLite from '../transitions/TweenLite.js'
import GColor from '../model/GColor.js'

/**
 * @class
 * @module QuickUI
 */
export default class QuickUI
{
	/**
	 * 快速创建默认样式按钮
	 * @param {Number} r 圆半径
	 * @param {Number} w 宽度
	 * @param {Number} h 高度
	 * @param {String} c1 颜色（渐变1/初始）
	 * @param {String} c2 颜色（渐变2/结束）
	 * @param {Number} t  边线粗细
	 * @param {Number} c3 边线颜色
	 * @param {Number} s  按钮样式
	 */
	static getButton(r,w,h,c1,c2,t,c3,s)
	{
		r=(r==undefined) ? 0 : r;
		w=(w==undefined) ? 0 : w;
		h=(h==undefined) ? 0 : h;
		
		c1=(c1==undefined) ? "#FF9E26" : ColorUtil.formatColor(c1);
		c2=(c2==undefined) ? "#FF7C0D" : ColorUtil.formatColor(c2);
		
		let btn=new Button();
	    let shape=Factory.c("bs");
	    let bool=(w==0 && h==0);
	    
	    w=Math.max(r*2 , w);
		h=Math.max(r*2 , h);
		
		let color=bool ? new GColor(1,r,r,r,r,[0.1,1],[c1,c2],r*0.25,r) : new GColor(0,0,0,0,h,[0.1,0.9],[c1,c2],w,h);
	    shape.setup(color,w,h,r,t,c3);
	    shape.origin={x:w*0.5,y:h*0.5};
	    btn.instance=shape;
	    
	    if(Global.isPC && (s==undefined || s==0)){
	    	btn.setup([Factory.c("ef",[Effect.MOVE,"{0,0}",0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)]),Factory.c("ef",[Effect.SHADOW,[4,70,10,"#222222",0.5,r],0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)])],[Factory.c("ef",[Effect.MOVE,"{0,3}",0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)]),Factory.c("ef",[Effect.SHADOW,[0,70,0,"#000000",0.5,r],0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)])]);
	    }else{
	    	btn.setup([Factory.c("ef",[Effect.SCALE,1,0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)])],null,[Factory.c("ef",[Effect.SCALE,0.89,0.11,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.OUT)])]);
	    }
	    return btn;
	}
	
	/**
	 * 快速创建图片显示对象
	 * @param {String} url
	 */
	static getImage(url,callback,only_image,errorback)
	{
		if(StringUtil.isEmpty(url)) return null;
		
		let dc,img=new Image();
		if(!only_image) dc=Factory.c("do");
	
		if(Loader.CORS && url && url.indexOf("http")==0){
			img.crossOrigin = Global.crossdomain;
			if(Loader.CORS>1) url=(url.indexOf("?")<0 ? url : url.split("?")[0])+"?"+Math.random();
		}
		
		img.src=url;
		
		if(img.complete){
			if(!only_image) dc.setInstance(img);
			dc=only_image ? img : dc;
			
			if(callback) callback(dc);
			return dc;
		}
		
		img.onload=function(){
			img.onerror=img.onload=null;
			if(!only_image) dc.setInstance(img);
			if(callback) callback(only_image ? img :dc);
			only_image=errorback=null;
		}
		
		img.onerror=function(){
			img.onerror=img.onload=null;
			if(errorback) errorback(only_image ? null :dc);
			only_image=errorback=null;
		}
		
		return dc ? dc : img;
	}
	
	/**
	 * 快速加载图片
	 * @param {String} url
	 * @param {Object} config 
	 *      {cors:"是否跨域",random:"是否添加随机参数"} 
	 */
	static loadImage(url,config=null)
	{
		return new Promise(resolve => {
			if(!url || url.trim()=='') return resolve(null);
			url=url.trim();
			
			const img=new Image();
			
			if(config){
				if(config.cors) img.crossOrigin = "anonymous";
				if(config.random) url=(url.indexOf("?")<0 ? url : url.split("?")[0])+"?"+Math.random();
			}
			
			img.src=url;
			if(img.complete) return resolve(img);
	
			img.onload=function(){
				img.onerror=img.onload=null;
				resolve(img);
			}
			
			img.onerror=function(){
				img.onerror=img.onload=null;
				resolve(null);
			}
		});
	}
	
	/**
	 * 队列加载图片
	 * @param {Array} list
	 * @param {Object} config {cors:"是否跨域",random:"是否添加随机参数"} 
	 */
	static queue(list,config=null)
	{
		if(!list || !list.length) return new Error('[QuickUI] wrong args');
		
		let i=0,length=list.length;
		const array=[];
		
		const func=async resolve => {
			if(i==length) return resolve(array);
			
			const img=await QuickUI.loadImage(list[i],config);
			if(img) array.push(img);
			
			i++;
			func(resolve);
		}
		
		return new Promise(func)
	}
	
	/**
	 * 获取一个简单的矩形显示对象
	 * @param {Number} w 宽度
	 * @param {Number} h 高度
	 * @param {String} c 颜色或者图片
	 * @param {Boolean} use_canvas 是否使用canvas模式
	 */
	static rectDisplay(w,h,c,use_canvas)
	{
		if(!w || !h ) return;
		c=c||"#000000";
		use_canvas=(use_canvas==null ? Global.useCanvas : use_canvas);
		
		let is_img=(typeof c!="string" && (c instanceof Image || ClassUtil.getQualifiedClassName(c)=="HTMLImageElement"));
		let obj=Factory.c("do",null,use_canvas);
		
		if(use_canvas){
			if(is_img){
				obj.setInstance(c);
				obj.repeat(w,h);
			}else{
				obj.graphics.lineStyle(0);
				obj.graphics.beginFill(c);
				obj.graphics.drawRect(0,0,w,h);
				obj.graphics.endFill();
			}
		}else{
			let args={width:w+"px",height:h+"px",overflow:"hidden"};
			if(is_img) args.background='url('+c.src+')';
			else args.backgroundColor=c;
			obj.element=DOMUtil.createDOM("div",{style:args});
		}
		
		obj.setSize(w,h);
		return obj;
	}
}
