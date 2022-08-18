/**
===================================================================
DisplayObjectContainer Class
===================================================================
**/
function DisplayObjectContainer()
{
	DisplayBase.call(this);
	
	DisplayObjectContainer.COUNT=(DisplayObjectContainer.COUNT>9999) ? 0 : DisplayObjectContainer.COUNT;
	this.name="container_"+(DisplayObjectContainer.COUNT++);
	this.mouseChildren=true;
	this.autoSize = false;
	this._parentNode=null;
	this._children=[];
}

DisplayObjectContainer.COUNT=0;
DisplayObjectContainer._num_canvas_target=0;
Global.inherit(DisplayObjectContainer,DisplayBase);
DisplayObjectContainer.prototype.__class__="DisplayObjectContainer";

Object.defineProperty(DisplayObjectContainer.prototype,"stage",{
	get: function (){
		return this._stage;
	},
    set: function (value) {
        if(this._stage==value) return;
		this._stage=value;
		
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

Object.defineProperty(DisplayObjectContainer.prototype,"alpha",{
	get: function (){
		return this._alpha;
	},
    set: function (value) {
        if(this._alpha==value) return;
		this._alpha=value;
		this.__checkDisplayUpdate();
		this._update_parent_alpha();
    },
    enumerable: true,
    configurable: true
});

DisplayObjectContainer.prototype._update_parent_alpha=function()
{
	if(this._children.length<1) return;
	var i,c,l;
	for (i = 0,l=this._children.length;i<l;i++) {
		c = this._children[i];
		c._parent_alpha=this._alpha*this._parent_alpha;
		if(c instanceof DisplayObjectContainer) c._update_parent_alpha();
	}
}

Object.defineProperty(DisplayObjectContainer.prototype,"visible",{
	get: function (){
		return this._visible;
	},
    set: function (value) {
        if(this._visible==value) return;
		this._visible=value;
		this.__checkDisplayUpdate();
		
		if(this._children.length<1) return;
		this._update_child_visible();
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayObjectContainer.prototype,"updateMatrix",{
	get: function (){
		return this._updateMatrix;
	},
    set: function (value) {
        if(value) this.__checkDisplayUpdate();
    	
        if(this._updateMatrix==value) return;
		this._updateMatrix=value;
		
		if(value && this._bounds) this._bounds.width=this._bounds.heigth=0;
		
		if(!value || this._children.length<1) return;
		var i,c,l;
		for (i = 0,l=this._children.length;i<l;i++) {
			c = this._children[i];
			c.updateMatrix=true;
		}
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayObjectContainer.prototype,"parentNode",{
	get: function (){
		return this._parentNode;
	},
    set: function (value) {
        if(this._parentNode==value) return;
		this._parentNode=value;
		
		if(this._children.length<1) return;
		var i,c,l;
		for (i = 0,l=this._children.length;i<l;i++) {
			c = this._children[i];
			if(!(c instanceof DisplayObject)) c.parentNode=value;
		}
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayObjectContainer.prototype,"numChildren",{
	get: function (){
		return this._children.length;
	},
    enumerable: true,
    configurable: true
});

DisplayObjectContainer.prototype._update_child_visible=function()
{
	var i,c,l;
	for (i = 0,l=this._children.length;i<l;i++) {
		c = this._children[i];
		
		if(c instanceof DisplayObjectContainer)
			c._update_child_visible();
		else if(c instanceof DOMDisplay) 
			c._update_visible();
	}
}

DisplayObjectContainer.prototype.addChild=function(displayObject)
{
	if(displayObject==undefined) return ;
	return this.addChildAt(displayObject,this._children.length);
}

DisplayObjectContainer.prototype.addChildAt=function(displayObject,index)
{
	if(displayObject==undefined) return ;
	
	displayObject.parent && displayObject.parent.removeChild(displayObject);
	this._children.splice(index, 0, displayObject);
	
	if(displayObject instanceof DisplayObject) DisplayObjectContainer._num_canvas_target++;
	else displayObject.parentNode=this._parentNode;
	
	displayObject.stage=this.stage;
	displayObject.parent=this;
	
	displayObject.updateMatrix=true;
	displayObject._parent_alpha=this._alpha*this._parent_alpha;
	
	if(this.autoSize) {
		this._updateSize();
	}else{
		this.width=Math.max(this.width,displayObject.getWidth());
		this.height=Math.max(this.height,displayObject.getHeight());
	}
	
	return displayObject;
}

DisplayObjectContainer.prototype._updateSize=function()
{
	if(this._children==undefined || this._children.length==0) return;
	
	var i,c,l, bounds,rect=new Rectangle();
	
	for (i = 0,l=this._children.length;i<l;i++) {
		c = this._children[i];
		bounds= c.getBounds(this);
		rect=rect.union(bounds);
	}
	
	this._minX=Math.floor(rect.x);
	this._minY=Math.floor(rect.y);
	
	this.width=Math.ceil(rect.width);
	this.height=Math.ceil(rect.height);
}

DisplayObjectContainer.prototype.removeChild=function(displayObject)
{
	return this.removeChildAt(this._children.indexOf(displayObject));
}

DisplayObjectContainer.prototype.removeChildAt=function(index)
{
	if (index < 0 || index > (this._children.length - 1)) return null;
	var displayObject=this._children[index];
	displayObject.stage=displayObject.parent=null;
	this._children.splice(index,1);
	displayObject._parent_alpha=1;
	
	if(this._children.length==0) this.width=this.height=0;
	else if(this.autoSize)  this._updateSize();
	
	if(displayObject instanceof DisplayObject) DisplayObjectContainer._num_canvas_target--;
	else displayObject.parentNode=null;
	
	return displayObject;
}

DisplayObjectContainer.prototype.getChildByName=function(name)
{
	if(StringUtil.isEmpty(name)) return;
	
	var i;
	var len=this._children.length;
	
	for (i=0; i < len; i++) 
	{
		if (this._children[i].name == name) return this._children[i];
	}
	return null;
}

DisplayObjectContainer.prototype.getChildAt=function(index)
{
	if (index < 0 || index > (this._children.length - 1)) return null;
	return this._children[index];
}

DisplayObjectContainer.prototype.removeAllChildren=function(bool)
{
	if(this._children==undefined || this._children.length<1) return;
	
	var i,c,l;
	for (i = 0,l=this._children.length;i<l;i++) {
		c = this._children[i];
		c.stage=c.parent=null;
		c._parent_alpha=1;
		
		if(c instanceof DisplayObject) DisplayObjectContainer._num_canvas_target--;
		else c.parentNode=null;
		
		if(bool && !Global.gc(c)){
			try{
				c.dispose();
			}
			catch(e){}
		}
		
	}
	
	this._children=[];
	this.width=this.height=0;
}

DisplayObjectContainer.prototype.contains=function(displayObject)
{
	return this._children.indexOf(displayObject)!=-1;
}

DisplayObjectContainer.prototype.render=function()
{
	if(this._children==undefined || this._children.length==0) return;
	
	var i,child;
	
	for (i=0; i < this._children.length; i++) {
		child=this._children[i];
		if(!this.visible && (child instanceof DisplayObject)) continue;
		child.render.apply(child,arguments)
	}
	
	this._updateMatrix=false;
}

DisplayObjectContainer.prototype.swapChildrenAt=function(index1, index2)
{
	const len=this._children.length;
	if(len==0 || index1>=len || index1<0) return;
	
	index2=index2<0 ? 0 :(index2>=len ? len-1 : index2);
    const temp=this._children[index1];
    this._children[index1]=this._children[index2];
    this._children[index2]=temp;
}

DisplayObjectContainer.prototype.setChildIndex=function(child, index)
{
	const pos=this._children.indexOf(child);
	if(child==null || pos<0 || pos==index) return;
	this._children.splice(pos,1);
	this._children.splice(index, 0, child);
}

/**
 * 点碰撞子对象 
 * all true-返回所以碰撞列表  false-返回最上层碰撞对象
 * @param {Number} x
 * @param {Number} y
 * @param {Boolean} usePixelTrace
 * @param {Boolean} all
 */
DisplayObjectContainer.prototype.getObjectUnderPoint = function(x, y, usePixelTrace,all) 
{
	if (all) var g = [];
	
	for (let i = this._children.length - 1; i >= 0; i--) {
		let h = this._children[i];
		if (h == null || !h.visible) continue;
		
		if ((h instanceof DisplayObjectContainer) && h.mouseChildren && h.numChildren > 0) {
			let j = h.getObjectUnderPoint(x, y, usePixelTrace, all);
			if (j){
				if (!all) return j;
				if(j.length > 0) g = g.concat(j);
			}else if (h.mouseEnabled && h.hitTestPoint(x, y, usePixelTrace)){
				if (!all) return h;
				g.push(h);
			}
		} else if (h.mouseEnabled && h.hitTestPoint(x,y, usePixelTrace)){
			if (!all) return h;
			g.push(h);
		}
	}
	
	return all ? g : null;
}

DisplayObjectContainer.prototype.hitTestPoint = function(x,y, usePixelTrace) 
{
	if(this._children.length<=0) return false;
	
	if(!this.mouseChildren && this.autoSize){
		return CollisionUtil.hitTestPoint(this,x,y, this.usePolyCollision)>0 ;
	}
	
	for (let i = this._children.length - 1; i >= 0; i--) {
		let h = this._children[i];
		if(this.usePolyCollision && !h.usePolyCollision) h.usePolyCollision=true;
		if(h.hitTestPoint(x,y, usePixelTrace)) return true;
	}
	
	return false;
}

DisplayObjectContainer.prototype.hitTestObject = function(obj, usePixelTrace) 
{
	let i,h,j,g;
	
	for (i = this._children.length - 1; i >= 0; i--) {
		h = this._children[i];
		if(!(obj instanceof DisplayObjectContainer)) {
			if(h.hitTestObject(obj,usePixelTrace)) return true;
			continue;
		}
		
		for (j = obj._children.length - 1; j >= 0; j--) {
		    g = obj._children[i];
		    if(h.hitTestObject(g,usePixelTrace)) return true;
		}
	}
	
	return false;
}

DisplayObjectContainer.prototype.catchAsImage=function ()
{
	if(this._children.length<=1) return;
	
	this._updateSize();
	const image=CanvasUtil.containerToImage(this);
	this.removeAllChildren(true);
	
	var display_obj=Factory.c("do");
	display_obj.setInstance(image);
	this.addChild(display_obj);
}

DisplayObjectContainer.prototype.reset=function()
{
	this.parentNode=null;
	this.removeAllChildren(true);
	
	this.name=null;
	this.autoSize = false;
	this.mouseChildren=true;
	
	DisplayObjectContainer.superClass.reset.call(this);
}

DisplayObjectContainer.prototype.dispose=function()
{
	DisplayObjectContainer.superClass.dispose.call(this);
	delete this._parentNode,this.autoSize,this._children,this.mouseChildren;
}

DisplayObjectContainer.prototype.toString=function()
{
	return "DisplayObjectContainer";
}