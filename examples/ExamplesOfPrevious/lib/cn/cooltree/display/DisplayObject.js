/**
===================================================================
DisplayObject Class
===================================================================
**/

DisplayObject.COUNT=0;

function DisplayObject()
{
	DisplayBase.call(this);
	
	this.filters=[];
	this._repeat=false;
	this._mask=null;
	
	DisplayObject.COUNT=(DisplayObject.COUNT>9999) ? 0 : DisplayObject.COUNT;
	this.name="display_object_"+(DisplayObject.COUNT++);
	this.colorTransform=null;
	this._graphics=null;
	this.blendMode=null;
	this.polyArea=null;
}

Global.inherit(DisplayObject,DisplayBase);
DisplayObject.prototype.__class__="DisplayObject";

Object.defineProperty(DisplayObject.prototype,"mask",{
	get: function () {
	    return this._mask;
    },

    set: function (value) {
    	if(!value || !(value instanceof ShapeVO) || !this.instance){
			this._mask=null;
			return;
		}
		
		this._mask=value;
    	this.__checkDisplayUpdate();
    },
    enumerable: true,
    configurable: true
});

/**
 * repeat display
 * @param {Number} w
 * @param {Number} h
 * @param {String} t repeat|repeat-x|repeat-y|no-repeat
 */
DisplayObject.prototype.repeat= function(w,h,t)
{
	if(this.instance==undefined || t=="no-repeat" || this.instance.rect==undefined || (w<=this.instance.rect.width && h<=this.instance.rect.height)){
		this._repeat=false;
		return;
	}
	
	t = t || "repeat";
	
	this.width=w;
	this.height=h;
	this._repeat=true;
	
	this.graphics.reset();
	this.graphics.beginBitmapFill(this.instance.image,t);
	this.graphics.drawRect(0,0,this.width,this.height);
	this.graphics.endFill();
}

DisplayObject.prototype._transform = function(target,obj)
{
	var _temp_context=(obj==undefined ? this.stage.context : obj.context);
	var mtx=this.getMatrix(target,true);
     _temp_context.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
	if(this.alpha>=0) _temp_context.globalAlpha*=this._alpha*this._parent_alpha;
}

DisplayObject.prototype.setInstance=function(target)
{
	if(target && (target instanceof Source) && !target.image) target=null;
	
	if(target==undefined || target==null || this.instance==target) {
		if(this.instance!=target){
			if(this.instance && (this.instance instanceof Source) && this.instance.isClone){
				ObjectPool.remove(this.instance);
			}
			this.instance=null;
			this.width=this.height=0;
		}
		
		return target;
	}
	
	if(target instanceof Image || ClassUtil.getQualifiedClassName(target)=="HTMLImageElement"){
		var temp=target;
		target=ObjectPool.create(Source);
		target.image=temp;
		target.isClone=true;
		target.width=temp.width;
		target.height=temp.height;
		target.name=""+MathUtil.randomInt();
		target.rect=new Rectangle(0,0,temp.width,temp.height);
	}
	
	if(this.instance && (this.instance instanceof Source) && this.instance.isClone){
		ObjectPool.remove(this.instance);
	}
	
	this.instance=target;
	this.name=target.name;
	
	if(!this.register_point) this.register_point=ObjectPool.create(Point);
	if(target.hasOwnProperty("reg") && target.reg) this.register_point.set(target.reg.x,target.reg.y);
	
	this.width=this.instance.rect.width;
	this.height=this.instance.rect.height;
	
	this._updateMatrix=true;
	this.__checkDisplayUpdate();
	this.dispatchEvent(new Event(DisplayBase.RESET_INSTANCE));
	return this.instance;
}

Object.defineProperty(DisplayObject.prototype,"graphics",{
	get: function () {
        this._graphics =(!this._graphics ? ObjectPool.create(GraphicsVO) : this._graphics);
	    return this._graphics;
    },

    set: function (value) {
        this._graphics =(value && !(value instanceof GraphicsVO) ? null : value);
    },
    enumerable: true,
    configurable: true
});

DisplayObject.prototype.do_actions = function(target,vo,bool)
{
	if(!target || !target.context || !vo) return;
	const canvas=(bool ? target : target.context);
	const params=vo.getValue();
	let action;
	
	if(params){
		for(let i in params) canvas[i]=params[i];
	}
	
	for(action of vo.actions)
	{
		canvas[action.method].apply(canvas,action.data);
	}
}

/**
 * 刷新呈现
 * @param {CanvasRenderingContext2D} context
 * @param {Boolean} initial
 * @param {DisplayObjectContainer} package
 */
DisplayObject.prototype._render = function(target,initial,package)
{
	if (!this.visible || this.alpha <= 0 ) 
		return;
	
	if (target==undefined){
		this.stage.context.save();
	}
	
	if(initial==undefined || initial==false) this._transform(package,target);
	
	if(this._mask){
		(target ? target : this.stage.graphics).drawShape(this._mask);
		(target ? target.context : this.stage.context).clip();
	}
	
	if(target==undefined){
		this.stage.context.globalCompositeOperation=this.blendMode;
	}
	
	if(this.filters && this.filters.length>0){
		var filter;
		for (var i = 0, l = this.filters.length; i < l; i++)
		{
			filter=this.filters[i];
			if(filter==undefined) continue;
			filter.show(target!=undefined ? target.context : this.stage.context);
		}
	}
	
	if(this._graphics){
		this.do_actions(target ? target : this.stage.graphics,this._graphics,true);
	}
	else if(this.instance && this.instance.rect){
		var _ct=(target!=undefined ? target.context : this.stage.context);
		if(_ct) _ct.drawImage(this.instance.image,this.instance.rect.x,this.instance.rect.y,this.instance.rect.width,this.instance.rect.height,0,0,this.instance.rect.width,this.instance.rect.height);
	}
	else if(this.canvas!=undefined){
		(target!=undefined ? target.context : this.stage.context).drawImage(this.canvas,0,0);
	}
	else if(this.context){
		this.do_actions(target ? target : this.stage,this.context);
	}
	
	if (target==undefined) this.stage.context.restore();
}

DisplayObject.prototype.render = function()
{
	this._render.apply(this,arguments);
}

/**
 * 碰撞点测试 (注意是全局坐标)
 * @param {Number} x
 * @param {Number} y
 */
DisplayObject.prototype.hitTestPoint = function(x,y) 
{
	return CollisionUtil.hitTestPoint(this,x,y, this.usePolyCollision)>0 ;
}

/**
 * 碰撞测试
 * @param {displayObject} obj
 */
DisplayObject.prototype.hitTestObject = function(obj) 
{
	if(obj==null || !(obj instanceof DisplayBase) ) return false;
	if(obj==this) return true;
	
	return CollisionUtil.hitTestObject(this,obj,this.usePolyCollision);
}

DisplayObject.prototype.reset =function()
{	
	if(this._parent){
		this.removeFromParent(false);
	}
	
	if(this.canvas && this.canvas.parentNode) {
		this.canvas.parentNode.removeChild(this.canvas);
	}
	
	if(this.instance && (this.instance instanceof Source) && this.instance.isClone){
		ObjectPool.remove(this.instance);
	}
	
	if(this._mask && this._mask instanceof Source){
		ObjectPool.remove(this._mask);
	}
	
	if(this._graphics)  {
        ObjectPool.remove(this._graphics);
	}
	
	if(this.context){
		ObjectPool.remove(this.context);
	}
	
	this.mask=this.instance=this._graphics=this.colorTransform=this.context=this.canvas=this.blendMode=null;
	this._repeat=false;
	this.filters=[];
	
	if(DisplayObject.superClass) DisplayObject.superClass.reset.call(this);
}

DisplayObject.prototype.dispose = function()
{
	this.reset();
	if(DisplayObject.superClass) DisplayObject.superClass.dispose.call(this);
	delete this._repeat,this.filters,this._mask,this.instance,this.colorTransform,this.blendMode,this.context,this.canvas;
}

DisplayObject.prototype.toString = function()
{
	return "DisplayObject";
}

