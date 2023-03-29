import DOMDisplay from '../display/DOMDisplay.js'
import StringUtil from '../utils/StringUtil.js'
import MathUtil from '../utils/MathUtil.js'
import SVGUtil from '../utils/SVGUtil.js'
import GColor from '../model/GColor.js'
import Global from '../core/Global.js'

/**
 * @class
 * @module SVGText
 * @extends DOMDisplay
 */
export default class SVGText extends DOMDisplay
{
	constructor(w,h)
	{
		super();
		
		this._size=12;
		this._leading=0;
		this._lineWidth=0;
		this._thickness=0;
		this._lineHeight=1;
		this._fill_alpha=1;
		
		this._text="";
		this._color="#000000";
		this._textAlign="left";
		this._stroke_color="#000000";
		this._font="Microsoft YaHei";
		
		this.autoSize=false;
		this._instance=null;
		this._selectable=true;
		this._textAdjust=false;
		this._writingMode=this._underline=this._bold=this._italic=false;
		
		this.setSize(w,h);
		this.element=SVGUtil.create("svg");
	//	this.hide_over=false;
	}
	
	get selectable()
	{
		return this._selectable;
	}
	
	set selectable(value) 
	{
        this._selectable=value;
        this._cursor=value ? "text" : "default";
        
        if(this._instance) {
        	this._instance.style.userSelect=this._selectable ? "text" : "none" ;
        	this._instance.style[Global.cssPrefix+"UserSelect"]=this._selectable ? "text" : "none" ;
        }
	}
	
	get text()
	{
		return this._text;
	}
	
	set text(value) 
	{
    	this._text=value;
    	this._set_text(value);
    }
	
	get writingMode()
	{
		return this._writingMode;
	}
	
	set writingMode(value) 
	{
        if(this.element==undefined || this._writingMode==value) return;
		this._writingMode=value;
		this.text=this.text;
	}
	
	get italic()
	{
		return this._italic;
	}
	
	set italic(value) 
	{
        if(this.element==undefined || this._italic==value) return;
		this._italic=value;
		
		if(this._instance)
			this._instance.style.fontStyle=this._italic ? "italic" : "normal";
    }
	
	get bold()
	{
		return this._bold;
	}
	
	set bold(value) 
	{
        if(this.element==undefined || this._bold==value) return;
		this._bold=value;
		
		if(this._instance)
			this._instance.style.fontWeight=this._bold ? "bold" : "normal";
	}
	
	get size()
	{
		return this._size;
	}
	
	set size(value) 
	{
        if(this.element==undefined || this._size==value) return;
		this._size=value;
	    this.text=this.text;
	}
	
	get color()
	{
		return this._color;
	}
	
	set color(value) 
	{
    	if(this._color==value) return;
    	this._color=this._format_color(value);
    	
		if(!StringUtil.isEmpty(this._color) && this._instance)
			this._instance.style.fill=this._color;
    }
	
	get font()
	{
		return this._font;
	}
	
	set font(value) 
	{
    	if(StringUtil.isEmpty(value) || this._font==value) return;
    	this._font=value;

		if(this._instance)
			this._instance.style.fontFamily=this._font;
    }
	
	get align()
	{
		return this._textAlign;
	}
	
	set align(value) 
	{
        if(this.element==undefined || this._textAlign==value) return;
		this._textAlign=value;
		
		if(this._instance)
			this._instance.style.textAlign=this._textAlign;
	}
	
	get underline()
	{
		return this._underline;
	}
	
	set underline(value) 
	{
        if(this.element==undefined || this._underline==value) return;
		this._underline=value;
		
		if(this._instance)
			this._instance.style.textDecoration=this._underline ? "underline" :"none";
	}
	
	get textAdjust()
	{
		return this._textAdjust;
	}
	
	/**
	 * 是否自动化布局 
	 */
	set textAdjust(value) 
	{
        if(this.element==undefined || this._textAdjust==value) return;
		this._textAdjust=value;
		this.text=this.text;
	}
	
	get leading()
	{
		return this._leading;
	}
	
	set leading(value) 
	{
        if(this.element==undefined || this._leading==value) return;
	
		this._leading=value;
		this.text=this.text;
    }
	
	get lineHeight()
	{
		return this._lineHeight;
	}
	
	/**
	 * 行间距
	 * @param {Number} a
	 */
	set lineHeight(value) 
	{
        if(this.element==undefined || this._lineHeight==value) return;
	
		this._lineHeight=value;
		this.text=this.text;
    }
	
	get lineWidth()
	{
		return this._lineWidth;
	}
	
	/**
	 * 行宽
	 * @param {Number} l
	 */
	set lineWidth(value) 
	{
        if(value==null || this._lineWidth==value) return;
		this._lineWidth=value;
		this.text=this.text;
    }
	
	get strokeColor()
	{
		return this._stroke_color;
	}
	
	set strokeColor(value) 
	{
    	if(value==null || value==this._stroke_color) return;
    	this._stroke_color=this._format_color(value);
    	
		if(!StringUtil.isEmpty(this._stroke_color) && this._instance)
			this._instance.style.stroke=this._stroke_color;
    }
	
	get thickness()
	{
		return this._thickness;
	}
	
	set thickness(value) 
	{
    	if(value==null || value==this._thickness) return;
    	this._thickness=value;
    	
    	if(this._instance)
			this._instance.style.strokeWidth=this._thickness;
    }
	
	_set_text(str)
	{
		if(StringUtil.isEmpty(str)) return;
		
		let texts=this._text.split(/\r\n|\r|\n|<br(?:[ \/])*>/);
		let lineHeight =this._size * this._lineHeight;
		let i,j,d,line,l=texts.length,max=Math.floor(this._lineWidth/(this._size+this._leading));
		
		if(this.autoSize && this._lineWidth>0) {
		    this[this._writingMode ? "height" : "width"] = this._lineWidth ;
		}
		
		let dy = this._writingMode ? this.width-lineHeight*0.5 : lineHeight;
		
		if(this._instance) {
			this._instance.innerHTML="";
			this._instance.setAttribute("transform","translate(0, 0)");
		}else	this._instance=SVGUtil.create("text",{width:this.width,height:this.height});
		
		if(this.autoSize && this._lineWidth>0) {
		    this._instance.setAttribute(this._writingMode ? "height" : "width",this[this._writingMode ? "height" : "width"]);
		}
		
		SVGUtil.setAttributes(this._instance,{
		style:{
			fill:this._color,
			fillOpacity:this._fill_alpha,
			stroke:this._stroke_color,
			strokeWidth:this._thickness,
			fontStyle:this._italic ? "italic" : "normal",
			fontWeight:this._bold ? "bold" : "normal",
			fontSize:this._size+ "px",
			fontFamily:this._font,
			textDecoration:this._underline ? "underline" :"none",
			textAlign:this._textAlign,
			letterSpacing:(this._leading-(this._writingMode && !this._textAdjust ? Math.ceil(this._size/3.6) : 0))+"px"
		}});
		
		this._instance.style["writingMode"]=this._writingMode ? "tb-rl" : "lr-tb";
		this._instance.style[Global.cssPrefix+"WritingMode"]=this._writingMode ? "tb-rl" : "lr-tb";
		
		for (i=0;i<l;i++){
			line=texts[i];
			
			if(max>0 && line.length>max){
				d=StringUtil.toArray(line,max);
				for (j=0;j<d.length;j++){
					this.__create_text(d[j],dy,Math.ceil(lineHeight));
					dy = this._writingMode ? (dy-lineHeight) : (dy+lineHeight);
				}
				continue;
			}
	        
	        this.__create_text(line,dy,Math.ceil(lineHeight));
			dy = this._writingMode ? (dy-lineHeight) : (dy+lineHeight);
		}
	
		if(this.autoSize) {
			if(this._writingMode && dy<0){
				this.width=Math.abs(dy)+this.width-lineHeight*0.5;
				this._instance.setAttribute("width",this.width);
				this._instance.setAttribute("transform","translate("+Math.abs(dy+lineHeight*0.5)+", 0)");
			}else if(!this._writingMode && dy>0){
				this.height = dy;
				this._instance.setAttribute("height",this.height);
			}
		}
		
		if(this._instance && this._instance.parentNode==null) 
			this.element.appendChild(this._instance);
			
		this.selectable=this._selectable;
	}
	
	__create_text(str,dy,h,first)
	{
		let w=(this._lineWidth>0 ? this._lineWidth : this.width);
		let dx=StringUtil.countLeftSpace(str)*(this._size+this._leading);
		let param={x:this._writingMode ? dy : dx,y:this._writingMode ? dx : dy,textLength:w,lengthAdjust:"spacing"};
		
		if(this._textAdjust){
			param.textLength=(w-dx);
			param.lengthAdjust="spacing";
		}
	
		let text=SVGUtil.create("tspan",param);
		text.innerHTML=str;
	    this._instance.appendChild(text);
	}
	
	_format_color(c)
	{
		if(this.element==null || c==null) return c;
		if(c && c instanceof HTMLImageElement) return this._set_pattern(c);
		if(!(c && (c instanceof GColor))) return c;
		
		let defs=this.element.getElementsByTagName('defs')[0];
		if(defs==undefined){
			defs=SVGUtil.create("defs");
			this.element.appendChild(defs);
		}
		
		let gradient=this.element.getElementById(this.name+"_gradient");
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
			obj.r="50%";
		}
		
		gradient=SVGUtil.create(c.type==0 ? "linearGradient" : "radialGradient",obj); 
		let i,sc,len=c.offsetlist.length;
		
		if(c.type==1 && c.radiusStart>0 && c.offsetlist[0]<c.radiusStart/c.radiusEnd){
			c.offsetlist[0]=c.radiusStart/c.radiusEnd;
		}
		
		for(i=0;i<len;i++){
			sc=SVGUtil.create("stop",{"offset":c.offsetlist[i],"stop-color":c.colorList[i]});
		    gradient.appendChild(sc);
		}
		
		defs.appendChild(gradient);
		return "url(#"+this.name+"_gradient)";
	}
	
	_set_pattern(c)
	{
		let defs=this.element.getElementsByTagName('defs')[0];
		if(defs==undefined){
			defs=SVGUtil.create("defs");
			this.element.appendChild(defs);
		}
		
		let pattern=this.element.getElementById(this.name+"_pattern");
		if(pattern && pattern.parentNode) pattern.parentNode.removeChild(pattern);
		
		pattern=SVGUtil.create("pattern",{id:this.name+"_pattern",width:c.width,height:c.height,patternUnits:"userSpaceOnUse"})
	    let image=SVGUtil.create("image",{x:0,y:0,width:c.width,height:c.height});
		image.setAttributeNS(SVGUtil.xlink,"href", c.src); 
		
		pattern.appendChild(image);
		defs.appendChild(pattern);
		
		return "url(#"+this.name+"_pattern)";
	}
	
	clone()
	{
		let svg_text=new SVGText(this.width,this.height);
		svg_text.autoSize=this.autoSize;
		svg_text._size=this._size;
		svg_text._leading=this._leading;
		svg_text._lineWidth=this._lineWidth;
		svg_text._thickness=this._thickness;
		svg_text._lineHeight=this._lineHeight;
		svg_text._fill_alpha=this._fill_alpha;
		svg_text._stroke_color=this._stroke_color;
		svg_text._writingMode=this._writingMode;
		svg_text._selectable=this._selectable;
		svg_text._textAdjust=this._textAdjust;
		svg_text._textAlign=this._textAlign;
		svg_text._underline=this._underline;
		svg_text._italic=this._italic;
		svg_text._color=this._color;
		svg_text._font=this._font;
		svg_text._bold=this._bold;
		svg_text.text=this._text;
		return svg_text;
	}
	
	dispose()
	{
		super.dispose();
		delete this._size,this._leading,this._lineWidth,this._thickness,this._lineHeight,this._fill_alpha,this._text,this._color,this._textAlign,this._stroke_color,this._font,this.autoSize,this._instance,this._selectable,this._textAdjust,this._writingMode,this._underline,this._bold,this._italic;
	}
}

SVGText.className="SVGText";