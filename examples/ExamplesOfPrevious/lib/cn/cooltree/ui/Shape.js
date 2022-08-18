
function Shape() 
{
	this._thickness=0;
	this._fill_alpha=1;
	this._dash=this._rect=this._vo=this.instance=this._stroke=this._pattern=this._pattern_src=this._color=null;
	
	DisplayObjectContainer.call(this);
	this.use_canvas=Global.useCanvas;
	this.repeat="repeat";
	this.mouseChildren=false;
}

Global.inherit(Shape, DisplayObjectContainer);
Shape.prototype.__class__="Shape";

/**
 * 设置图形及样式
 * @param {ShapeVO} vo 图形数据
 * @param {String} c 颜色 string 或者 GColor
 * @param {Number} t 边框线条粗细
 * @param {String} s 边框线条颜色
 * @param {Number} a 填充颜色的透明度
 */
Shape.prototype.setup =function(vo,c,t,s,a)
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

Object.defineProperty(Shape.prototype,"resize",{
	get: function (){
		return this._resize;
	},
    set: function (value) {
		if(value && this._resize!=value){
			if(this.use_canvas && this.instance) this.instance.graphics.reset();
			this.dispatchEvent(new Event(DisplayBase.RESIZE));
			this.__checkDisplayUpdate();
		}
		
		this._resize=value;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Shape.prototype,"pattern",{
	get: function () {
	    return this._pattern;
    },

    set: function (value) {
    	if(this._pattern && this._pattern.parentNode){
    		this._pattern.parentNode.removeChild(this._pattern);
    	}
    	
    	this.resize=true;
    	this.__checkDisplayUpdate();
    	this._pattern_src=this._pattern=null;
    	
    	if(value==null || !(value instanceof Image)) return;
    	this._pattern_src=value.src;
    	
    	var svg=SVGUtil.supported();
    	if(this._fill_alpha==0)  this._fill_alpha=1;
    	this._pattern=value ? (this.use_canvas ? [value,this.repeat,this._fill_alpha] : (svg ? SVGUtil.create("pattern",{id:this.name+"_pattern",width:value.width,height:value.height,patternUnits:"userSpaceOnUse"}) : value)) : value;
    	
    	if(this.instance.element==null) this.redraw();
    	if(value && !this.use_canvas && svg && this.instance.element){
    		var image=SVGUtil.create("image",{x:0,y:0,width:value.width,height:value.height});
    		image.setAttributeNS(SVGUtil.xlink,"href", value.src); 
    		this._pattern.appendChild(image);
    		
    		var defs=this.instance.element.getElementsByTagName('defs')[0];
    		if(defs==undefined){
    			defs=SVGUtil.create("defs");
    			this.instance.element.appendChild(defs);
    		}
    		defs.appendChild(this._pattern);
    	}
    },
    enumerable: true,
    configurable: true
});

//虚线例如："10,10"
Object.defineProperty(Shape.prototype,"dash",{
	get: function () {
	    return this._dash;
    },

    set: function (value) {
    	if(value==this._dash) return;
    	this._dash=value;
    	this.resize=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Shape.prototype,"color",{
	get: function () {
	    return this._color;
    },

    set: function (value) {
    	this.pattern=null;
    
    	if(typeof value =="string" && StringUtil.isEmpty(value)) this._fill_alpha=0;
    	else if(this._fill_alpha==0)  this._fill_alpha=1;
    	
    	if(value==null || this._color==value) return;
    	this._color=this._format_color(value);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Shape.prototype,"strokeColor",{
	get: function () {
	    return this._stroke;
    },

    set: function (value) {
    	if(value==null || value==this._stroke) return;
    	if(StringUtil.isEmpty(value)) this.thickness=0;
    	else if(this.thickness==0) this.thickness=1;
    	this._stroke=this._format_color(value);
    	this.resize=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Shape.prototype,"thickness",{
	get: function () {
	    return this._thickness;
    },

    set: function (value) {
    	if(value==null || value==this._thickness) return;
    	this._thickness=value;
    	this.resize=true;
    },
    enumerable: true,
    configurable: true
});

Shape.prototype._format_color=function(c)
{
	if(!(c && (c instanceof GColor))) return c;
	if(this.use_canvas) return ColorUtil.getGradientColor(c);
	if(this.instance==null || this.instance.element==null) return c;
	
	var defs=this.instance.element.getElementsByTagName('defs')[0];
	if(defs==undefined){
		defs=SVGUtil.create("defs");
		this.instance.element.appendChild(defs);
	}
	
	var gradient=this.instance.element.getElementById(this.name+"_gradient");
	if(gradient && gradient.parentNode) gradient.parentNode.removeChild(gradient);
	
	var obj={id:this.name+"_gradient"};
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
	var i,sc,len=c.offsetlist.length;
	
	for(i=0;i<len;i++){
		sc=SVGUtil.create("stop",{"offset":c.offsetlist[i],"stop-color":c.colorList[i]});
	    gradient.appendChild(sc);
	}
	
	defs.appendChild(gradient);
	return "url(#"+this.name+"_gradient)";
}

Shape.prototype.redraw=function()
{
	this.__checkDisplayUpdate();
	this.instance.width=this.width;
	this.instance.height=this.height;
	
	if(this.use_canvas && this.instance.graphics){
		if(this._thickness>0){
			this.instance.graphics.lineStyle(this._thickness,this._stroke);
		}else this.instance.graphics.stroke_style=null;

		this.instance.graphics.beginFill(this._pattern ? this._pattern : this._color,this._fill_alpha);
		this.instance.graphics.drawShape(this._vo);
		this.instance.graphics.endFill();
		return;
	}
	
	if(this.use_canvas || !SVGUtil.supported()) return;
		
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

Shape.prototype.clone  = function()
{
	var copy=ObjectPool.create(Shape);
	
	copy.setup(this._vo.clone(),this._color,this._thickness,this._stroke,this._fill_alpha);
	copy.param=this.param;
	copy._dash=this._dash;
	copy.origin=this.origin.clone();
	
	if(this._pattern && !StringUtil.isEmpty(this._pattern_src)) {
		var img=new Image();
		img.onload=function(){
			this.onload=null;
			copy.pattern=img;
		}
		img.src=this._pattern_src;
	}
	return copy;
}

Shape.prototype.render  = function()
{
	if(this.resize) this.redraw();
	Shape.superClass.render.apply(this,arguments);
	this.resize=false;
}

Shape.prototype.reset=function()
{
	this._dash=null;
	this._thickness=0;
	this._fill_alpha=1;
	this.autoSize=true;
	
	if(this._vo) ObjectPool.remove(this._vo);
	if(this._rect) ObjectPool.remove(this._rect);
	this._rect=this._vo=this._pattern_src=this._stroke=this.pattern=this._color=null;
	
	if(this.instance){
		this.instance.removeFromParent(true);
		this.instance=null;
	}
	
	this.use_canvas=Global.useCanvas;
	Shape.superClass.reset.call(this);
}

Shape.prototype.dispose =function()
{
	Shape.superClass.dispose.call(this);
	delete this.use_canvas,this._dash,this._rect,this._vo,this._pattern_src,this._fill_alpha,this._thickness,this._stroke,this._color,this._pattern,this.repeat;
}

Shape.prototype.toString = function()
{
	return "Shape";
}
