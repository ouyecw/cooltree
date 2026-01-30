import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import DisplayObject from '../display/DisplayObject.js'
import DisplayBase from '../display/DisplayBase.js'
import StringUtil from '../utils/StringUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import ColorUtil from '../utils/ColorUtil.js'
import ClassUtil from '../utils/ClassUtil.js'
import MathUtil from '../utils/MathUtil.js'
import Loader from '../loader/Loader.js'
import GColor from '../model/GColor.js'
import Event from '../events/Event.js'

/**
 * @class
 * @module BoxShape
 * @extends DisplayObjectContainer
 */
export default class BoxShape extends DisplayObjectContainer
{
	
	constructor() 
	{
		super();
		this._redius=0;
		this._thickness=0;
		this._fill_alpha=1;
		this.autoSize=true;
		this.syncSize=false;
		this.instance=this._stroke=this._pattern=this._pattern_src=this._color=null;
		
		this.mouseChildren=false;
		this.repeat="repeat";
	}
	
	set resize(value)
	{
		if(value && this._resize!=value){
			if(this.instance && this.instance instanceof DisplayObject) this.instance.graphics.reset();
			this.emit(new Event(DisplayBase.RESIZE));
			this.__checkDisplayUpdate();
		}
		
		this._resize=value;
	}
	
	get resize()
	{
		return this._resize;
	}
	
	get pattern()
	{
		return this._pattern;
	}
	
	set pattern(value) 
	{
    	this.resize=true;
    	this.__checkDisplayUpdate();
    	this._pattern_src=this._pattern=null;
    	
    	if(value==null || !ClassUtil.isImage(value)) return;
    	this._pattern_src=value.src;
    	if(this._fill_alpha==0)  this._fill_alpha=1;
    	this._pattern=[value,this.repeat,this._fill_alpha];
    	this.redraw();
    }
	
	get redius()
	{
		return this._redius;
	}
	
	set redius(value) 
	{
    	if(value==null) return;
    	value=Math.min(value,Math.ceil(Math.min(this.width,this.height)*0.5));
    	
    	if(value==this._redius) return;
    	this._redius=value;
    	this.resize=true;
    }
	
	get color()
	{
		return this._color;
	}
	
	set color(value) 
	{
    	this.pattern=null;
    
    	if(typeof value =="string" && StringUtil.isEmpty(value)) this._fill_alpha=0;
    	else if(this._fill_alpha==0)  this._fill_alpha=1;
    	
    	if(value==null || this._color==value) return;
    	this._color=this._format_color(value);
    }
	
	get strokeColor()
	{
		return this._stroke;
	}
	
	set strokeColor(value) 
	{
    	if(value==null || value==this._stroke) return;
    	if(StringUtil.isEmpty(value)) this.thickness=0;
    	else if(this.thickness==0) this.thickness=1;
    	this._stroke=this._format_color(value);
    	this.resize=true;
    }
	
	get thickness()
	{
		return this._thickness;
	}
	
	set thickness(value) 
	{
    	if(value==null || value==this._thickness || isNaN(value)) return;
    	this._thickness=value;
    	this.resize=true;
    }
	
	/**
	 * 圆角矩形
	 * @param {String} c 颜色 string 或者 GColor
	 * @param {Number} w 宽度
	 * @param {Number} h 高度
	 * @param {Number} r 圆角半径
	 * @param {Number} t 边框线条粗细
	 * @param {String} s 边框线条颜色
	 * @param {Number} a 填充颜色的透明度
	 */
	setup (c,w,h,r=0,t=0,s="#000000",a=1)
	{
		this._redius=r;
		this.thickness=t;
		this._stroke=this._format_color(s);
		this._fill_alpha=a;
		
		if(this.instance==null){
			this.instance=ObjectPool.create(DisplayObject);
			this.instance.setSize(w,h);
			this.addChild(this.instance);
		}
		else this.instance.moveTo(0,0);
		
		this.width=w;
		this.height=h;
		this.resize=true;
		this._color=this._format_color(c) || "#FFFFFF";
	}
	
	_format_color(c)
	{
		if(!(c && (c instanceof GColor))) return c;
		return ColorUtil.getGradientColor(c);
	}
	
	redraw()
	{
		let w=this.syncSize ? this.getWidth() :this.width;
		let h=this.syncSize ? this.getHeight() :this.height;
		
		this.instance.width=MathUtil.int(w);
		this.instance.height=MathUtil.int(h);
		
		if(this.syncSize){
			this.instance.scaleX=1/this.scaleX;
			this.instance.scaleY=1/this.scaleY;
		}
		
		let thickness=this.thickness*(this.syncSize ? (this.scaleX+this.scaleY)*0.5 : 1);
		this.instance.moveTo(-thickness*0.5,-thickness*0.5);
		this.instance.graphics.clear();
		
		if(thickness>0){
			this.instance.graphics.lineStyle(thickness,this._stroke);
		}else this.instance.graphics.stroke_style=null;
		
		if(this._pattern) this.instance.graphics.beginBitmapFill(...this._pattern);
		else this.instance.graphics.beginFill(this._color,this._fill_alpha);
		
		if(this._redius>0) this.instance.graphics.drawRoundRect(thickness*0.5,thickness*0.5,w,h,this._redius,this._redius);
		else               this.instance.graphics.drawRect(thickness*0.5,thickness*0.5,w,h);
		
		this.instance.graphics.endFill();
		if(this._parent && this._parent.autoSize) this._parent._updateSize();
	}
	
	clone  ()
	{
		let copy=ObjectPool.create(BoxShape);
		copy.param=this.param;
		
		if(this.origin) copy.origin=this.origin.clone();
		copy.setup(this._color,this.width,this.height,this._redius,this.thickness,this._stroke,this._fill_alpha);
		copy.syncSize=this.syncSize;
		
		if(this._pattern && !StringUtil.isEmpty(this._pattern_src)) {
			Loader.loadImg(this._pattern_src,(img)=>{
				copy.pattern=img;
			});
		}
		
		return copy;
	}
	
	render  ()
	{
		if(this.syncSize && (this.scaleX!=1 || this.scaleY!=1) && (this.instance.width!=this.getWidth() || this.instance.height!=this.getHeight())){
			this.resize=true;
		}
		
		if(this.resize) this.redraw();
		super.render(...arguments);
		this.resize=false;
	}
	
	reset()
	{
		if(this.instance){
			this.instance.removeFromParent(true);
			this.instance=null;
		}
		
		this._pattern_src=this._stroke=this.pattern=this._color=null;
		super.reset();
		
		this._redius=0;
		this._thickness=0;
		this._fill_alpha=1;
		this.autoSize=true;
		this.syncSize=false;
		this.mouseChildren=false;
		this.repeat="repeat";
	}
	
	dispose ()
	{
		super.dispose();
		delete this.syncSize,this._pattern_src,this._fill_alpha,this._thickness,this._stroke,this._color,this._redius,this._pattern,this.repeat;
	}
	
	toString ()
	{
		return BoxShape.name;
	}

}

BoxShape.className="BoxShape";
module.exports = BoxShape;