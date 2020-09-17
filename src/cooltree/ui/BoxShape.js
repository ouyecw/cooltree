import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import DisplayObject from '../display/DisplayObject.js'
import DisplayBase from '../display/DisplayBase.js'
import StringUtil from '../utils/StringUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import ColorUtil from '../utils/ColorUtil.js'
import MathUtil from '../utils/MathUtil.js'
import SVGUtil from '../utils/SVGUtil.js'
import Factory from '../core/Factory.js'
import GColor from '../model/GColor.js'
import Global from '../core/Global.js'
import Event from '../events/Event.js'

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
		
		this.use_canvas=Global.useCanvas;
		this.mouseChildren=false;
		this.repeat="repeat";
		this._dash=null;
	}
	
	set resize(value)
	{
		if(value && this._resize!=value){
			if(this.instance && this.instance instanceof DisplayObject) this.instance.graphics.reset();
			this.dispatchEvent(new Event(DisplayBase.RESIZE));
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
    	if(value==null || value==this._thickness || isNaN(value)) return;
//  	let old=this._thickness;
    	this._thickness=value;
//  	this.instance.moveTo(-this._thickness*0.5,-this._thickness*0.5);
//  	this.height=this.height+(this._thickness-old)*2;
//  	this.width=this.width+(this._thickness-old)*2;
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
			this.instance=Factory.c("do",null,this.use_canvas);
			this.instance.hide_over=false;
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
		
		if(this.use_canvas && this.instance.graphics){
			if(thickness>0){
				this.instance.graphics.lineStyle(thickness,this._stroke);
			}else this.instance.graphics.stroke_style=null;
			
			if(this._pattern) this.instance.graphics.beginBitmapFill(...this._pattern);
			else this.instance.graphics.beginFill(this._color,this._fill_alpha);
			
			if(this._redius>0) this.instance.graphics.drawRoundRect(thickness*0.5,thickness*0.5,w,h,this._redius);
			else               this.instance.graphics.drawRect(thickness*0.5,thickness*0.5,w,h);
			
			this.instance.graphics.endFill();
			return;
		}
		
		if(!SVGUtil.supported){
			if(this.instance.element==undefined) this.instance.element=DOMUtil.createDOM("div",{style:{backgroundColor:this._color,width:w+"px",height:h+"px"}});
			else {
				this.instance.element.style.backgroundColor=this._color;
				this.instance.element.style.backgroundImage=this._pattern ? "url(" + this._pattern.src + ")" : "";
				this.instance.element.style.backgroundRepeat=this.repeat;
			}
			return;
		}
			
		let rect;
		if(this.instance.element==undefined) {
			this.instance.element=SVGUtil.create("svg",{style:{width:w+"px",height:h+"px"}});
			rect=SVGUtil.create("rect",{"stroke-dasharray":(!StringUtil.isEmpty(this._dash) ? this._dash : ''),x:0,y:0,rx:this._redius,ry:this._redius,width:w,height:h,style:{fill:this._format_color(this._color),fillOpacity:this._fill_alpha,stroke:this._stroke,strokeWidth:thickness}});
		    this.instance.element.appendChild(rect);
		    return;
		}
		
		rect=this.instance.element.getElementsByTagName('rect')[0];
	
		rect.style.stroke=this._stroke;
		rect.style.strokeWidth=thickness;
		rect.style.fillOpacity=this._fill_alpha;
		rect.style.fill=this._pattern ? 'url(#' + this._pattern.id + ')' : this._format_color(this._color);
		
		rect.setAttribute("stroke-dasharray",!StringUtil.isEmpty(this._dash) ? this._dash : '');
		rect.setAttribute("height", h+thickness);
		rect.setAttribute("width", w+thickness);
		rect.setAttribute("ry", this._redius);
		rect.setAttribute("rx", this._redius);
		
		if(this._parent && this._parent.autoSize) this._parent._updateSize();
	}
	
	clone  ()
	{
		let copy=ObjectPool.create(BoxShape);
		copy.param=this.param;
		
		if(this.origin) copy.origin=this.origin.clone();
		copy.setup(this._color,this.width,this.height,this._redius,this.thickness,this._stroke,this._fill_alpha);
		copy.syncSize=this.syncSize;
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
		
		this._dash=null;
		this._redius=0;
		this._thickness=0;
		this._fill_alpha=1;
		this.autoSize=true;
		this.syncSize=false;
		this.mouseChildren=false;
		
		this.repeat="repeat";
		this.use_canvas=Global.useCanvas;
	}
	
	dispose ()
	{
		super.dispose();
		delete this.use_canvas,this.syncSize,this._dash,this._pattern_src,this._fill_alpha,this._thickness,this._stroke,this._color,this._redius,this._pattern,this.repeat;
	}
	
	toString ()
	{
		return BoxShape.name;
	}

}

BoxShape.className="BoxShape";