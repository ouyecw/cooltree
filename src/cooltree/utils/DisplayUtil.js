import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import DisplayObject from '../display/DisplayObject.js'
import StringUtil from './StringUtil.js'
import ObjectPool from './ObjectPool.js'
import ClassUtil from './ClassUtil.js'
import Global from '../core/Global.js'
import SVGUtil from './SVGUtil.js'

/**
 * @class
 * @module DisplayUtil
 */
export default class DisplayUtil
{
	/**
	 * 将数据对象复制到目标对象
	 * @param {Object} obj     数据对象
	 * @param {Object} target  目标对象
	 * @param {Object} data    相对数据
	 * @param {Object} bool    true相反
	 */
	static copyTransform (obj,target,data,bool)
	{
		if(obj==undefined || target==undefined || target.parent==undefined) return;
		let r=(data && data.hasOwnProperty("rotation") ? data.rotation : 0);
		let sx=(data && data.hasOwnProperty("scaleX") ? data.scaleX : 1);
		let sy=(data && data.hasOwnProperty("scaleY") ? data.scaleY : 1);
		
		target.rotation=obj.rotation+(bool ? r : -r);
		target.scaleX=obj.scaleX*(bool ? sx : 1/sx);
		target.scaleY=obj.scaleY*(bool ? sy : 1/sy);
		target.moveTo(target.parent.globalToLocal(obj.localToGlobal(0,0)));
	}
	/**
	 * @param {Object} gt get target
	 * @param {Object} ct container target
	 */
	static equalOrContain  (gt,ct)
	{
		if(gt==null || ct==null) return false;
		if(!(ct instanceof DisplayObjectContainer)) return (gt==ct);
		for(let obj=gt; obj!=null; obj=obj.parent)
		{
			if(obj==ct) return true;
		}
	    return false;
	}
	
	/**
	 * 字体大小不变的情况下，根据文本框高度控制文本内容
	 * @param {TextField} tf  文本框
	 * @param {Number} value  文本框高度
	 * @param {String} suffix 文本后缀
	 * @returns 
	 */
	static holdHeight(tf,value,suffix="..")
	{
		if(tf==null || StringUtil.isEmpty(tf.text)) return;
		tf._update();

		if(value<=0 || tf.getHeight()<=value) return;
		const num=suffix.length+1;
		let count=0;

		while(tf.getHeight()>value && count<80)
		{
			tf.text=tf.text.slice(0,tf.text.length-num)+suffix;
			tf._update();
			count++;
		}
	}

	/**
	 * 文本框文本内容不变的情况下，缩小文本字体适应文本框大小
	 * @param {TextField|InputText} tf   文本框
	 * @param {Number} minSize 最小字体
	 * @returns 
	 */
	static autoSizeFromText (tf,minSize)
	{
		if(tf==null || StringUtil.isEmpty(tf.text)) return;
		let sh,th,bool,type=ClassUtil.getQualifiedClassName(tf);
		if(!(type=="InputText" || (type=="TextField" && tf.lineWidth>0))) return;
		
		minSize=minSize || 8;
		bool=(type=="InputText");
		 
		tf.render();
		th=tf.height;
		sh=(bool ? tf.element : tf).scrollValue;
		if(sh<=th) return;
		
		while(tf.size>minSize && sh>th){
	    	tf.size=tf.size-1;
	    	
	    	tf.render();
	    	sh=(bool ? tf.element : tf).scrollValue;
	    }
	}
	
	/**
	 *  @param {String} xml 
	 *  @param {Number} scale 
	 *  @param {Boolean} useCanvas
	 */
	static getSVG(xml,scale=1,useCanvas=null)
	{
		if(!xml) return null;
		useCanvas=useCanvas==null ? Global.useCanvas : useCanvas;
		const rect=SVGUtil.getRect(xml);
		let pic;
		
		if(useCanvas){
			pic=ObjectPool.create(DisplayObject);
		    pic.context.drawSvg(xml,0,0,rect ? rect.width*scale : null,rect ? rect.height*scale : null);
		   
		}else{
			pic=SVGUtil.getElement(xml);
			pic.scale=scale;
		}
		
		if(rect){
			pic.height=rect.height*scale;
			pic.width=rect.width*scale;
		}
		
		return pic;
	}
}
