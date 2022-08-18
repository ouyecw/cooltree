
function DOMDisplay3D()
{
	DOMDisplay.call(this);
	this._z=this._rotationX=this._rotationY=0;
	this._scaleZ=1;
}

Global.inherit(DOMDisplay3D,DOMDisplay);
DOMDisplay3D.prototype.__class__="DOMDisplay3D";

Object.defineProperty(DOMDisplay3D.prototype,"z",{
	get: function (){
		return this._z;
	},
    set: function (value) {
        if(this._z==value|| isNaN(value))return;
        
		this._z=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DOMDisplay3D.prototype,"scaleZ",{
	get: function (){
		return this._scaleZ;
	},
    set: function (value) {
        if(this._scaleZ==value|| isNaN(value)) return;
            
		this._scaleZ=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DOMDisplay3D.prototype,"rotationX",{
	get: function (){
		return this._rotationX;
	},
    set: function (value) {
        if(this._rotationX==value|| isNaN(value)) return;
            
		this._rotationX=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DOMDisplay3D.prototype,"rotationY",{
	get: function (){
		return this._rotationY;
	},
    set: function (value) {
        if(this._rotationY==value|| isNaN(value)) return;
            
		this._rotationY=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

DOMDisplay3D.prototype._get_transform_css=function(matrix)
{
	var css = "";
	css += "translate3d(" + (matrix.tx-(this.register_point ? this.register_point.x : 0)) + "px, " + (matrix.ty-(this.register_point ? this.register_point.y : 0)) + "px, "+(this._z-(this.register_point ? this.register_point.z : 0))+"px)"
		+ "rotate3d(1, 0, 0, " + this.rotationX + "deg)"
		+ "rotate3d(0, 1, 0, " + this.rotationY + "deg)"
		+ "rotate3d(0, 0, 1, " + this.rotation + "deg)"
		+ "scale3d(" + this.scaleX + ", " + this.scaleY + ", "+this.scaleZ+")";	
	return css;
}