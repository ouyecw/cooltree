/**
===================================================================
DOMDisplay Class
===================================================================
**/

DOMDisplay.COUNT=0;
DOMDisplay._depth_count=0;

function DOMDisplay()
{
	DisplayBase.call(this);
	this.instance=this._rect=this._mask=this._parent_node=this._element=null;
	this.hide_over=this._global_visible=true;
	this._layer=this._depth=0;
	this.filters=[];
	
	DOMDisplay.COUNT=(DOMDisplay.COUNT>9999) ? 0 : DOMDisplay.COUNT;
	this.name="dom_display_"+(DOMDisplay.COUNT++);
}

Global.inherit(DOMDisplay,DisplayBase);
DOMDisplay.prototype.__class__="DOMDisplay";

Object.defineProperty(DOMDisplay.prototype,"layer",{
	get: function (){
		return this._layer || this._depth;
	},
    set: function (value) {
        if(this._layer==value) return;
		this._layer=value;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DOMDisplay.prototype,"visible",{
	get: function (){
		return this._visible;
	},
    set: function (value) {
        if(this._visible==value) return;
		this._visible=value;
		
		if(this._element) 
			this._element.style.display = (!this._visible || !this._global_visible) ? "none" : "";
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DOMDisplay.prototype,"stage",{
	get: function (){
		return this._stage;
	},
    set: function (value) {
    	if(value==null) this._global_visible=true;
        if(this._stage==value) return;
		this._stage=value;
		
		if(value) {
			this._update_visible();
			this._updateMatrix=true;
		}

		this._display(value!=null);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DOMDisplay.prototype,"element",{
	get: function (){
		return this._element;
	},
    set: function (value) {
        if(this._element==value) return;
        var node;

        if(this._element && this._element.parentNode){
        	node=this._element.parentNode;
        	node.removeChild(this._element);
        }
        else if(this._stage) 
        	node=this._parent_node ? this._parent_node : this._stage.div;
        	
        if(value && value.parentNode){
        	value.parentNode.removeChild(value);
        }
        
		this._element=value;
		if(value==null) {
			this.width=this.height=0;
			return;
		}
		
		if(StringUtil.isEmpty(this._element.id)) this._element.id=this.name;
		this.width=(this._element.width==undefined || typeof(this._element.width)!="number") ? (StringUtil.isEmpty(this._element.style.width) ? this.width : MathUtil.int(this._element.style.width)) : this._element.width;
		this.height=(this._element.height==undefined || typeof(this._element.height)!="number") ? (StringUtil.isEmpty(this._element.style.height) ? this.height :MathUtil.int(this._element.style.height)) : this._element.height;

		if(node) node.appendChild(this._element);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DOMDisplay.prototype,"mask",{
	get: function (){
		return this._mask;
	},
    set: function (value) {
        if(this._mask && this._mask instanceof ShapeVO && this._mask!=value){
        	ObjectPool.remove(this._mask);
        }
        
		this._mask=value;
		this.__checkDisplayUpdate();
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DOMDisplay.prototype,"parentNode",{
	get: function (){
		return this._parent_node;
	},
    set: function (value) {
        if(this._parent_node==value) return;
		this._parent_node=value;
		
		if(this._element==null || this._element.parentNode==this._parent_node) return;
		
		if(this._element && this._stage) {
		   if(this._element.parentNode) this._element.parentNode.removeChild(this._element);
		   this._display(true);
	    }
    },
    enumerable: true,
    configurable: true
});

DOMDisplay.prototype.render  = function(object)
{
	if(this._element==null) return;
	this._depth=this._layer ? this._layer : (++DOMDisplay._depth_count);
	this._transform(object);
}

DOMDisplay.prototype._render = function(target,initial,package){}

DOMDisplay.prototype.setInstance=function(target)
{
	if(target==undefined || target==null || this.instance==target) {
		if(this.instance!=target) this.element = this.instance = null;
		return target;
	}
	
	var temp;
	this._rect=null;
	
    if(target instanceof HTMLImageElement){
    	target.style.display = "none";
    	this.element=target;
    }
    else if(target instanceof HTMLCanvasElement){
    	this.element=CanvasUtil.toImage(target);
    }
    else if(target instanceof DisplayObject){
    	this.setInstance(target.canvas ? target.canvas : target.instance);
    	this.param=target.param;
    }
    else if(target instanceof Source){
    	this.register_point=(target.hasOwnProperty("reg")) ? target.reg.clone() : ObjectPool.create(Point);
    	this._rect=target.rect;
    	
    	if(this._element==undefined) this.element=DOMUtil.createDOM("div",{id:this.name,style:{width:target.rect.width+"px",height:target.rect.height+"px",backgroundImage:"url(" + target.image.src+ ")",backgroundRepeat:"no-repeat"}});
    	else if(this.instance.image!=target.image) {
    		this._element.style.backgroundImage="url(" + target.image.src+ ")";
    	}
    }
    else if(target instanceof Graphics){
    	this.setInstance(target.canvas);
    }
    else if(target instanceof HTMLDivElement){
    	this.element=target;
    }
    else if(target instanceof SVGSVGElement){
    	this.element=target;
    }
    else {
    	trace("DOMDisplay:: set instance with a invalid value.",ClassUtil.getQualifiedClassName(target),"-",ObjectUtil.getType(target));
    	return null;
    }
    
    this.instance=target;
    
    if(this._element && this._stage){
    	this._display(true);
    }
    
    if(target instanceof Source) this._transform();
    
    this._updateMatrix=true;
    this.__checkDisplayUpdate();
    this.dispatchEvent(new Event(DisplayBase.RESET_INSTANCE));
    return this.instance;
}

DOMDisplay.prototype._transform=function(target)
{
	var bool=(this._visible && this._global_visible);
	
	this._element.style.display = bool ? "" : "none";
	if(!bool) return;
	
	var hasUpdate=this._updateMatrix;
	var matrix=this.getMatrix(target,true);
	
	var prefix = Global.cssPrefix, isEmpty=StringUtil.isEmpty(prefix),
		origin = isEmpty ? "transformOrigin" : prefix + "TransformOrigin", 
		transform = isEmpty ? "transform" : prefix + "Transform";
	
    this._element.style.opacity = this._alpha*this._parent_alpha;
    
    this._element.style.position=Global.position;
    this._element.style.overflow = this.hide_over ? "hidden" : "visible";
	this._element.style.zIndex = Global.layer+this._depth;
	
	if(this._rect){
		this.width=this._rect.width;
		this.height=this._rect.height;
		this._element.style.backgroundPosition = (-this._rect.x) + "px " + (-this._rect.y) + "px";
	}

	if(hasUpdate){
		this._element.style.width =(this.width>0 ? this.width+ "px" : "100%");
		this._element.style.height = (this.height>0 ? this.height+ "px": "100%");
		
		if(Global.supportTransform){
			this._element.style[origin] = "0% 0%";//Math.round(this.register_point.x) + "px " + Math.round(this.register_point.y) + "px";
	    	this._element.style.top=this._element.style.left="0px";
	    	this._element.style[transform] = this._get_transform_css(matrix);
	   }else{
	    	this._element.style.top=matrix.ty+"px";
			this._element.style.left=matrix.tx+"px";
	    }
	}
	
	if(this._mask){
		var isDisplay=(typeof this._mask=="string" || this._mask instanceof ShapeVO);
		var isSource=(this._mask instanceof Source);
		
		if(isDisplay){
			this._element.style[prefix + "ClipPath"] = this._element.style["clipPath"] = "url(#"+(typeof this._mask=="string" ? this._mask : this._mask.id+ShapeVO.CILP)+ ")";
		}else{
			this._element.style[prefix + "MaskImage"] =  "url("+(isSource ? this._mask.image : this._mask).src+ ")";
			this._element.style[prefix + "MaskRepeat"] = "no-repeat";
			this._element.style[prefix + "MaskPosition"] = matrix.tx + "px " + matrix.ty + "px";
		}
	}else{
		this._element.style[prefix + "ClipPath"] = this._element.style["clipPath"] = this._element.style[prefix + "MaskImage"] =this._element.style[prefix + "MaskPosition"] ='';
	}
	
	if(this.filters && this.filters.length>0){
		var filter;
		for (var i = 0, l = this.filters.length; i < l; i++)
		{
			filter=this.filters[i];
			if(filter==undefined) continue;
			filter.show(this._element);
		}
	}else{
		this._element.style[Global.cssPrefix+'BoxShadow']=this._element.style.textShadow='';
	}
    
    this._element.style.cursor = (this._cursor==null) ? "" : this._cursor;
    this._element.style.pointerEvents = this.mouseEnabled ? "auto" : "none" ;
}

DOMDisplay.prototype._get_transform_css=function(matrix)
{
	return matrix.toCSS();
}

DOMDisplay.prototype._update_visible=function()
{
	if(this.parent==null) return;
	var bool=true,obj=this;
	
	for(obj=obj.parent; obj!=null; obj=obj.parent)
	{
		bool=(bool && obj.visible);
		if(!bool) break;
	}
	
	this._global_visible=bool;
}

DOMDisplay.prototype.hitTestPoint = function(x, y, usePolyCollision)
{
	return CollisionUtil.hitTestPoint(this, x, y, this.usePolyCollision)>0;
};

DOMDisplay.prototype.hitTestObject = function(object, usePolyCollision)
{
	return CollisionUtil.hitTestObject(this, object, this.usePolyCollision)>0;
};

DOMDisplay.prototype._display=function(bool)
{
	if(bool){
		try{
			if(this._element && this._element.parentNode==null){
				(this._parent_node ? this._parent_node : (this.stage.div ? this.stage.div : this.stage.canvas.parentNode)).appendChild(this._element);
			}
		}
		catch(err){
			trace("[ERROR]DOMDisplay _display()",this.name,err.message);
		}
	}else{
		if(this._element) {
		   if(this._element.parentNode) this._element.parentNode.removeChild(this._element);
		   this._element.style.display ="none";
	    }
	}
}

DOMDisplay.prototype.reset=function()
{
	if(this._parent){
		this.removeFromParent(false);
	}
	
	if(this._element && this._element.parentNode) {
		this._element.parentNode.removeChild(this._element);
	}
	
	if(this.instance && (this.instance instanceof Source) && this.instance.isClone){
		ObjectPool.remove(this.instance);
	}
	
	this.instance=this._rect=this._mask=this._parent_node=this._element=null;
	this.hide_over=this._global_visible=true;
	this._layer=this._depth=0;
	this.filters=[];
	
	if(DOMDisplay.superClass) DOMDisplay.superClass.reset.call(this);
}

DOMDisplay.prototype.dispose = function()
{
	if(this._mask && this._mask instanceof ShapeVO ) ObjectPool.remove(this._mask);
	this.reset();
	
	if(DOMDisplay.superClass) DOMDisplay.superClass.dispose.call(this);
	delete this.hide_over,this._global_visible,this.filters,this._layer,this.instance,this._rect,this._depth,this._element,this._parent_node,this._mask;
}

DOMDisplay.prototype.toString=function()
{
	return "DOMDisplay";
}
