
function Bitmap()
{
	DisplayObject.constructor.call(this);
	this.drawable=null;
}

Global.inherit(Bitmap,DisplayObject);

Bitmap.prototype.getDrawable = function(context)
{
	return this.drawable && this.drawable.get(this, context);
};

Bitmap.prototype.setInstance=function(target)
{
	if(target==undefined || target==null) return null;
	
	if(this.drawable == null)
	{
		this.drawable = new Drawable(drawable);
	}else if(this.drawable.rawDrawable != drawable)
	{
		this.drawable.set(drawable);
	}
}

Bitmap.prototype.hitTestPoint = function(x, y, usePolyCollision)
{
	return CollisionUtil.hitTestPoint(this, x, y, usePolyCollision);
};

Bitmap.prototype.hitTestObject = function(object, usePolyCollision)
{
	return CollisionUtil.hitTestObject(this, object, usePolyCollision);
};

Bitmap.prototype._render = function(target,initial,package)
{
	Global.context.save();
	this._transform();
	Global.context.drawImage(this.getDrawable(Global.context),0, 0, this.width, this.height, 0, 0, this.width, this.height);
	Global.context.restore();	
}

Bitmap.prototype.dispose=function()
{
	if(this.drawable) {
		this.drawable.dispose();
	}
	
	delete this.drawable;
	Bitmap.superClass.dispose.call(this);
}
