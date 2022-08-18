
function Sprite()
{
	DisplayObjectContainer.call(this);
	this._defs=this._rect=this._mask=this.div=null;
	this.use_canvas=Global.useCanvas;
}

Global.inherit(Sprite, DisplayObjectContainer);

Object.defineProperty(Sprite.prototype,"maskRect",{
	get: function (){
		return (this._mask ? (this._mask instanceof Rectangle ? this._mask : this._rect) : null);
	},
	set: function (value) {
		if(value) {
			this._rect=new Rectangle(value.x,value.y,value.width,value.height);
			this.setSize(this._rect.width,this._rect.height);
		}
		else this._rect=value;
	},
    enumerable: true,
    configurable: true
});

Object.defineProperty(Sprite.prototype,"defs",{
	get: function (){
		if(!this._defs && !this.use_canvas){
			this._defs=ObjectPool.create(DefsNode).init();
			this.addChild(this._defs);
		}
		return this._defs;
	},
    enumerable: true,
    configurable: true
});

Object.defineProperty(Sprite.prototype,"parentNode",{
	get: function (){
		return this._parentNode;
	},
    set: function (value) {
        if(this._parentNode==value) return;
		this._parentNode=value;
		
		if(this._parentNode && this.div){
			if(this.div.parentNode) this.div.parentNode.removeChild(this.div);
			this._parentNode.appendChild(this.div);
		}
	},
    enumerable: true,
    configurable: true
});

Object.defineProperty(Sprite.prototype,"parent",{
	get: function (){
		return this._parent;
	},
    set: function (value) {
        if(this._parent==value) return;
		this._parent=value;
		
		if(this.use_canvas) return;
		
		if(this._parent==undefined){
			if(this.div && this.div.parentNode) this.div.parentNode.removeChild(this.div);
			return;
		}

		if(this.div==undefined){
			this.div=DOMUtil.createDOM("div",{id: "sprite_"+this.name});
		}
		
		this.div.style.position=Global.position;
		var node=this._parentNode ? this._parentNode : (this._parent.parentNode ? this._parent.parentNode : (this._parent.div ? this._parent.div : (this.stage ? this.stage.div : null)));
		if(node) node.appendChild(this.div);
		
		if(this._mask && (this._mask instanceof Rectangle) && this.div){
			this.width=Math.ceil(this._mask.width);
    		this.height=Math.ceil(this._mask.height);
    	
    		this.div.style.width=this.width+"px";
    		this.div.style.height=this.height+"px";
    		this.div.style.overflow="hidden";
    	}
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Sprite.prototype,"mask",{
	get: function () {
	    return this._mask;
    },

    set: function (value) {

    	if(value && (value instanceof ShapeVO)) {
        	value=([SVGLabel.RECT,SVGLabel.CIRCLE,SVGLabel.ELLIPSE,SVGLabel.POLYGON,SVGLabel.PATH].indexOf(value.type)<0 ? null : value);
    	}
    	
        if(this._mask && this._mask!=value && (this._mask instanceof Rectangle) && this.div) {
        	this.div.style.overflow="auto";
        	ObjectPool.remove(this._mask);
        }
        
        if(this._mask && (this._mask instanceof ShapeVO) && this._mask!=value) {
        	if(!this.use_canvas) this.defs.removeClipPath(this._mask);
        	ObjectPool.remove(this._mask);
        }
        
        var bool=(this._mask!=null && this._mask!=undefined && this._mask!='');
        
        this._mask=value;
        this.maskRect=(this._mask && (this._mask instanceof ShapeVO) && this._mask.rect ? this._mask.rect : null);
        
        if(this._mask && (this._mask instanceof ShapeVO) && !this.use_canvas){
        	this.defs.addClipPath(this._mask);
        }
        
        if(!this._mask || !(this._mask instanceof Rectangle)) {
        	if(!this._mask && bool) {
        		if(!this.use_canvas) this.x+=0.00001;
        		this.__checkDisplayUpdate();
        	}
        	return;
        }
        
    	this.autoSize=false;
    	this.width=Math.ceil(this._mask.width);
    	this.height=Math.ceil(this._mask.height);
    	
    	if(!this.use_canvas){
    		this._mask.x=this._mask.y=0;
    		if(this.div==undefined) return;
    		this.div.style.width=this.width+"px";
    		this.div.style.height=this.height+"px";
    		this.div.style.overflow="hidden";
    	}
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Sprite.prototype,"stage",{
	get: function (){
		return this._stage;
	},
    set: function (value) {
        if(this._stage==value) return;
		this._stage=value;
		
		var node=(this._parentNode ? this._parentNode : (this._parent && this._parent.parentNode ? this._parent.parentNode : (this._parent && this._parent.div ? this._parent.div : (this.stage ? this.stage.div : null))));
		if(this.div) {
			if(this.div.parentNode && (!value || (node && this.div.parentNode!=node))) this.div.parentNode.removeChild(this.div);
			if(node && !this.div.parentNode && value && this._parent) node.appendChild(this.div);
		}
	
		if(this._children==undefined || this._children.length<1) return;
		var i,c,l;
		for (i = 0,l=this._children.length;i<l;i++) {
			c = this._children[i];
			c.stage=value;
		}
    },
    enumerable: true,
    configurable: true
});

Sprite.prototype.addChildAt=function(displayObject,index)
{
	var obj=Sprite.superClass.addChildAt.call(this,displayObject,index);
	if(this.use_canvas) return obj;
	
	if(this.div==undefined){
		this.div=DOMUtil.createDOM("div",{id: "sprite_"+this.name});
	}
	
	if(obj) obj.parentNode=this.div;
	return obj;
}

Sprite.prototype.render=function(target,object)
{
	if(this._children==undefined || this._children.length==0) return;
	
	if(!this.visible){
		if(this.div) this.div.style.display="none";
		return;
	}
	
	var i,len;
	
	if(this._mask && this.use_canvas){
		var obj=this.getMatrix(object).applyDisplay();
		obj.center=ObjectPool.create(Point);
		
		if(this._mask instanceof Rectangle) {
			var copy=this._mask.clone();
			copy.multiply(obj.scaleX,obj.scaleY);
			var points,radians=MathUtil.getRadiansFromDegrees(obj.rotation);
			points=copy.rotation(radians,obj.center,obj,obj.scaleX<0,obj.scaleY<0);
			ObjectPool.remove(copy);
		}
		
		(target ? target.context : this.stage.context).save();
		if(this._mask instanceof Rectangle)  (target ? target : this.stage.graphics).drawPath(points,true);
		else if(this._mask instanceof ShapeVO) (target ? target : this.stage.graphics).drawShape(this._mask,obj);

		(target ? target.context : this.stage.context).clip();
		ObjectPool.remove(obj.center);
		obj.center=null;
	}
	
	if(!this.use_canvas){
		DOMDisplay._depth_count++;
		
		if(this.div){
			this.div.style.display="";
			this.div.style.zIndex = Global.layer+DOMDisplay._depth_count;
			
			var prefix = Global.cssPrefix, 
				origin = prefix + "TransformOrigin", 
				transform = prefix + "Transform";
		
		    var hasUpdate=this._updateMatrix;
			var matrix=this.getMatrix(target);
			
			this.div.style[prefix + "ClipPath"] = this.div.style["clipPath"] = (this._mask && this._mask instanceof ShapeVO ? "url(#"+this._mask.id+ShapeVO.CILP+ ")" : "");
			
			if(hasUpdate){	
				if(Global.supportTransform){
					this.div.style[origin] = "0% 0%";
					this.div.style.top=this.div.style.left="0px";
			    	var css ="matrix("+matrix.a+","+matrix.b+","+matrix.c+","+matrix.d+","+matrix.tx+","+matrix.ty+")";
			    	this.div.style[transform] = css;
			    }else{
			    	this.div.style.top=matrix.ty+"px";
					this.div.style.left=matrix.tx+"px";
			    }
			}
		}
	}
	
	len=this._children.length;
	
	for (i=0; i < len; i++) {
		this._children[i].render.apply(this._children[i],(!this.use_canvas ? [this] : [target,false,object]));
	}
	
	if(this._mask && this.use_canvas){
		(target ? target.context : this.stage.context).restore();
	}
	
	this._updateMatrix=false;
}

Sprite.prototype.getObjectUnderPoint = function(x, y, usePixelTrace,all) 
{
	if(this.maskRect && this._checkTouch(x, y, usePixelTrace)) return null;
	return Sprite.superClass.getObjectUnderPoint.call(this,x, y, usePixelTrace,all);
}

Sprite.prototype.hitTestPoint = function(x,y, usePixelTrace) 
{
	if(this.maskRect && this._checkTouch(x, y,usePixelTrace)) return false;
	return Sprite.superClass.hitTestPoint.call(this,x, y, usePixelTrace);
}

Sprite.prototype._checkTouch=function(x,y,usePixelTrace)
{
	var bounds=this.maskRect.clone();
	var obj=this.getMatrix().applyDisplay();
	bounds.multiply(obj.scaleX,obj.scaleY);
	var data,radians=MathUtil.getRadiansFromDegrees(obj.rotation);
	
	if(usePixelTrace){
		data=Rectangle.rectangleByRadians(bounds,radians,null,obj,obj.scaleX<0,obj.scaleY<0);
		ObjectPool.remove(bounds);
	}else if(radians==0){
		bounds.x=obj.x;
		bounds.y=obj.y;
		data=bounds;
	}else{
		var points=bounds.rotation(radians,null,obj,obj.scaleX<0,obj.scaleY<0);
		data=Rectangle.createRectangle(points[0],points[1],points[2],points[3]);
		ObjectPool.remove(bounds);
	}
	
	return CollisionUtil.hitTestPoint(data, x, y,usePixelTrace)<0;
}

Sprite.prototype.dispose=function()
{
	if(this._mask && this._mask instanceof ShapeVO) {
		ObjectPool.remove(this._mask);
	}
	
	if(this.div && this.div.parentNode){
		this.div.parentNode.removeChild(this.div);
	}
	
	this.mask=null;
	Sprite.superClass.dispose.call(this);
	delete this.use_canvas,this._defs,this._mask,this.div,this.svg,this._rect;
}