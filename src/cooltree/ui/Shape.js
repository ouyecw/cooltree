import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import DisplayBase from '../display/DisplayBase.js'
import StringUtil from '../utils/StringUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import ColorUtil from '../utils/ColorUtil.js'
import MathUtil from '../utils/MathUtil.js'
import SVGUtil from '../utils/SVGUtil.js'
import Factory from '../core/Factory.js'
import ShapeVO from '../model/ShapeVO.js'
import GColor from '../model/GColor.js'
import Global from '../core/Global.js'
import Event from '../events/Event.js'

/**
 * @class
 * @module Shape
 * @extends DisplayObjectContainer
 */
export default class Shape extends DisplayObjectContainer
{
	constructor() 
	{
		super();
		this._thickness=0;
		this._fill_alpha=1;
		this._dash=this._rect=this._vo=this.instance=this._stroke=this._pattern=this._pattern_src=this._color=null;
		
		this.use_canvas=Global.useCanvas;
		this.mouseChildren=false;
		this.repeat="repeat";
	}
	
	get pattern()
	{
		return this._pattern;
	}
	
	set pattern(value) 
	{
    	if(this._pattern && this._pattern.parentNode){
    		this._pattern.parentNode.removeChild(this._pattern);
    	}
    	
    	this.resize=true;
    	this.__checkDisplayUpdate();
    	this._pattern_src=this._pattern=null;
    	
    	if(value==null || !(value instanceof Image)) return;
    	this._pattern_src=value.src;
    	
    	let svg=SVGUtil.supported;
    	if(this._fill_alpha==0)  this._fill_alpha=1;
    	this._pattern=value ? (this.use_canvas ? [value,this.repeat,this._fill_alpha] : (svg ? SVGUtil.create("pattern",{id:this.name+"_pattern",width:value.width,height:value.height,patternUnits:"userSpaceOnUse"}) : value)) : value;
    	
    	if(this.instance.element==null) this.redraw();
    	if(value && !this.use_canvas && svg && this.instance.element){
    		let image=SVGUtil.create("image",{x:0,y:0,width:value.width,height:value.height});
    		image.setAttributeNS(SVGUtil.xlink,"href", value.src); 
    		this._pattern.appendChild(image);
    		
    		let defs=this.instance.element.getElementsByTagName('defs')[0];
    		if(defs==undefined){
    			defs=SVGUtil.create("defs");
    			this.instance.element.appendChild(defs);
    		}
    		defs.appendChild(this._pattern);
    	}
    }
	
	set resize(value)
	{
		if(value && this._resize!=value){
			if(this.use_canvas && this.instance) this.instance.graphics.reset();
			this.dispatchEvent(new Event(DisplayBase.RESIZE));
			this.__checkDisplayUpdate();
		}
		
		this._resize=value;
	}
	
	get resize()
	{
		return this._resize;
	}
	
	get dash()
	{
		return this._dash;
	}
	
	//虚线例如："10,10"
	set dash(value) 
	{
    	if(value==this._dash) return;
    	this._dash=value;
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
    	if(value==null || value==this._thickness) return;
    	this._thickness=value;
    	this.resize=true;
    }
	
	/**
	 * 设置图形及样式
	 * @param {ShapeVO} vo 图形数据
	 * @param {String} c 颜色 string 或者 GColor
	 * @param {Number} t 边框线条粗细
	 * @param {String} s 边框线条颜色
	 * @param {Number} a 填充颜色的透明度
	 */
	setup (vo,c,t,s,a)
	{
		if(!vo) return this;
		if(this._vo && this._vo instanceof ShapeVO){
			if(vo && this._vo.type!=vo.type && this.instance.element){
				this.instance.element=null;
			}
			ObjectPool.remove(this._vo);
		}
		
		this._vo=vo;
		
		let _style=this._vo.properties.style;
		_style=_style?_style:{};
		delete this._vo.properties.style;
		
		this._thickness=t==0 ? 0 :(t || _style.strokeWidth ||0);
		this._stroke=this._format_color(s) || _style.stroke || "#000000";
		this._fill_alpha=(a==undefined) ? (_style.fillOpacity || _style.opacity || this._fill_alpha) : a;
		
		if(this.instance==null){
			this.instance=Factory.c("do",null,this.use_canvas);
			this.instance.hide_over=false;
			this.addChild(this.instance);
		}
		else this.instance.moveTo(0,0);
		
		if(this._vo.rect) {
			this._rect=this._vo.rect.clone();
	//		this.instance.moveTo(-this._rect.x,-this._rect.y);
			this.setSize(this._rect.width,this._rect.height);
		}
		
		this._color=this._format_color(c) || _style.fill || "#FFFFFF";
		this.resize=true;
		return this;
	}
	
	_format_color(c)
	{
		if(!(c && (c instanceof GColor))) return c;
		if(this.use_canvas) return ColorUtil.getGradientColor(c);
		if(this.instance==null || this.instance.element==null) return c;
		
		let defs=this.instance.element.getElementsByTagName('defs')[0];
		if(defs==undefined){
			defs=SVGUtil.create("defs");
			this.instance.element.appendChild(defs);
		}
		
		let gradient=this.instance.element.getElementById(this.name+"_gradient");
		if(gradient && gradient.parentNode) gradient.parentNode.removeChild(gradient);
		
		let obj={id:this.name+"_gradient"};
		if(c.type==0){
			obj.x1=MathUtil.int(100*c.xStart/c.radiusStart)+"%";
			obj.y1=MathUtil.int(100*c.yStart/c.radiusEnd)+"%";
			obj.x2=MathUtil.int(100*c.xEnd/c.radiusStart)+"%";
			obj.y2=MathUtil.int(100*c.yEnd/c.radiusEnd)+"%";
		}else{
			obj.fx=MathUtil.int(100*c.xStart/(c.radiusEnd*2))+"%";
			obj.fy=MathUtil.int(100*c.yStart/(c.radiusEnd*2))+"%";
			obj.cx=MathUtil.int(100*c.xEnd/(c.radiusEnd*2))+"%";
			obj.cy=MathUtil.int(100*c.yEnd/(c.radiusEnd*2))+"%";
			obj.r=MathUtil.int(100*(c.radiusStart*2)/c.radiusEnd)+"%";
		}
		
		gradient=SVGUtil.create(c.type==0 ? "linearGradient" : "radialGradient",obj); 
		let i,sc,len=c.offsetlist.length;
		
		for(i=0;i<len;i++){
			sc=SVGUtil.create("stop",{"offset":c.offsetlist[i],"stop-color":c.colorList[i]});
		    gradient.appendChild(sc);
		}
		
		defs.appendChild(gradient);
		return "url(#"+this.name+"_gradient)";
	}
	
	redraw()
	{
		this.__checkDisplayUpdate();
		this.instance.width=this.width;
		this.instance.height=this.height;
		
		if(this.use_canvas && this.instance.graphics){
			if(this._thickness>0){
				this.instance.graphics.lineStyle(this._thickness,this._stroke);
			}else this.instance.graphics.stroke_style=null;
			
			if(this._pattern) this.instance.graphics.beginBitmapFill(...this._pattern);
			else  this.instance.graphics.beginFill(this._color,this._fill_alpha);
			this.instance.graphics.drawShape(this._vo);
			this.instance.graphics.endFill();
			return;
		}
		
		if(!SVGUtil.supported) return;
			
		let shape;
		if(this.instance.element==undefined) {
			this.instance.element=SVGUtil.create("svg",{style:{width:this.width+"px",height:this.height+"px"}});
			shape=SVGUtil.create(this._vo.type,this._vo.properties);
		    this.instance.element.appendChild(shape);
		}
		else {
			shape=this.instance.element.getElementsByTagName(this._vo.type)[0];
			if(this._vo.properties) SVGUtil.setAttributes(shape,this._vo.properties);
		}
	
		shape.style.stroke=this._stroke;
		shape.style.strokeWidth=this._thickness;
		shape.style.fillOpacity=this._fill_alpha;
		shape.style.fill=this._pattern ? 'url(#' + this._pattern.id + ')' : this._format_color(this._color);
		
		shape.setAttribute("stroke-dasharray",!StringUtil.isEmpty(this._dash) ? this._dash : '');
		if(this._parent && this._parent.autoSize) this._parent._updateSize();
	}
	
	clone  ()
	{
		let copy=ObjectPool.create(Shape);
		copy.param=this.param;
		if(this.origin) copy.origin=this.origin.clone();
		
		copy.setup(this._vo.clone(),this._color,this._thickness,this._stroke,this._fill_alpha);
		copy._dash=this._dash;

		if(this._pattern && !StringUtil.isEmpty(this._pattern_src)) {
			let img=new Image();
			img.onload=function(){
				this.onload=null;
				copy.pattern=img;
			}
			img.src=this._pattern_src;
		}
		return copy;
	}
	
	render  ()
	{
		if(this.resize) this.redraw();
		super.render(...arguments);
		this.resize=false;
	}
	
	reset()
	{
		if(this._vo) ObjectPool.remove(this._vo);
		if(this._rect) ObjectPool.remove(this._rect);
		this._rect=this._vo=this._pattern_src=this._stroke=this.pattern=this._color=null;
		
		if(this.instance){
			this.instance.removeFromParent(true);
			this.instance=null;
		}
		
		super.reset();
		this._dash=null;
		this._thickness=0;
		this._fill_alpha=1;
		this.autoSize=true;
		
		this.repeat="repeat";
		this.mouseChildren=false;
		this.use_canvas=Global.useCanvas;
		
	}
	
	dispose ()
	{
		super.dispose();
		delete this.use_canvas,this._dash,this._rect,this._vo,this._pattern_src,this._fill_alpha,this._thickness,this._stroke,this._color,this._pattern,this.repeat;
	}
	
	toString ()
	{
		return Shape.name;
	}
}

Shape.className="Shape";