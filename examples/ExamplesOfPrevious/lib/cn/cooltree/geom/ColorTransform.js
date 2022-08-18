/**
===================================================================
ColorTransform Class
===================================================================
**/

function ColorTransform (redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset)
{
	this.redMultiplier = redMultiplier;
	this.greenMultiplier = greenMultiplier;
	this.blueMultiplier = blueMultiplier;
	this.alphaMultiplier = alphaMultiplier;
	this.redOffset = redOffset;
	this.greenOffset = greenOffset;
	this.blueOffset = blueOffset;
	this.alphaOffset = alphaOffset;
	
	this._update=true;
}

Object.defineProperty(ColorTransform.prototype,"update",{
	get: function () {
		var bool=this._update;
		if(this._update) this._update=false;
        return bool;
    },

    set: function (value) {
        if(this._update==value) return;
		this._update=value;
    },
    enumerable: true,
    configurable: true
});

ColorTransform.prototype.setColor=function(color,add)
{
	add=add || 0;
	color=ColorUtil.toColor(color);
	this.redMultiplier=this.greenMultiplier=this.blueMultiplier=this.alphaMultiplier=add;
	
	this.redOffset   = ColorUtil.getRed(color);
	this.greenOffset = ColorUtil.getGreen(color);
	this.blueOffset  = ColorUtil.getBlue(color);
	this.alphaOffset = ColorUtil.getAlpha(color);
	this._update=true;
}

ColorTransform.prototype.toString = function()
{
	return '{"redOffset":'+this.redOffset+',"greenOffset":'+this.greenOffset+',"blueOffset":'+this.blueOffset+',"alphaOffset":'+this.alphaOffset+
	       ',"redMultiplier":'+this.redMultiplier+',"greenMultiplier":'+this.greenMultiplier+',"blueMultiplier":'+this.blueMultiplier+',"alphaMultiplier":'+this.alphaMultiplier+'}';
}