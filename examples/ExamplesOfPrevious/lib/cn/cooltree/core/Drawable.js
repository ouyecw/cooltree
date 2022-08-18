
function Drawable(drawable, isDOM)
{
	this.rawDrawable = null;
	this.domDrawable = null;	
	this.set(drawable, isDOM);
}

/**
 * 根据context上下文获取不同的Drawable包装的对象。
 * @param {DisplayObject} obj 指定的显示对象。
 * @param {Context} context 指定的渲染上下文。
 * @return 返回包装的可绘制对象。
 */
Drawable.prototype.get = function(obj, context)
{
	if(context == null )
	{
		return this.rawDrawable;
	}else
	{
        if(this.domDrawable == null)
		{
			this.domDrawable = DOMUtil.createDOMDrawable(obj, {image:this.rawDrawable});
		}
		return this.domDrawable;
	}
};

/**
 * 设置Drawable对象。
 * @param drawable 一个可绘制对象。
 * @param {Boolean} isDOM 指定参数drawable是否为一个DOM对象。默认为false。
 */
Drawable.prototype.set = function(drawable, isDOM)
{
	if(Drawable._isDrawable(drawable)) this.rawDrawable = drawable;
	if(isDOM === true)
	{
		this.domDrawable = drawable;
	}else if(this.domDrawable)
	{
		this.domDrawable.style.backgroundImage = "url(" + this.rawDrawable.src + ")";
	}
};

Drawable.prototype.dispose= function()
{
	if(this.domDrawable && this.domDrawable.parentNode) {
		this.domDrawable.parentNode.removeChild(this.domDrawable);
	}
	
	if(this.rawDrawable && this.rawDrawable.parentNode) {
		this.rawDrawable.parentNode.removeChild(this.rawDrawable);
	}
	
	delete this.domDrawable,this.rawDrawable;
}

Drawable._isDrawable=function (elem)
{
	if(elem == null) return false;
	return (elem instanceof HTMLImageElement) || 
	  	   (elem instanceof HTMLCanvasElement) ||
	   	   (elem instanceof HTMLVideoElement);
};
