/**
===================================================================
DisplayBase Class
===================================================================
**/

function DisplayBase()
{
	EventDispatcher.call(this);
	this._cursor=this.name=this.register_point=this._parent=this._temp_matrix=this._matrix=this.polyArea=this._stage=this._bounds=null;
	this._height=this._width=this._y=this._x=this._rotation=this._skewX=this._skewY=this._minX=this._minY=0;
	this._scaleY=this._scaleX=this._alpha=this._parent_alpha=1;
	this._resize=this.mouseEnabled=false;
	this.usePolyCollision=false;
	this._updateMatrix=true;
	this.breakTouch=false;
	this._draggable=false;
	this._visible=true;
}

Global.inherit(DisplayBase,EventDispatcher);

Object.defineProperty(DisplayBase.prototype,"buttonMode",{
	get: function (){
		return (this._cursor=="pointer");
	},
    set: function (value) {
		this._cursor=value ? "pointer" : "";
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"resize",{
	get: function (){
		return this._resize;
	},
    set: function (value) {
		this._resize=value;
		
		if(this._resize){
			this.dispatchEvent(new Event(DisplayBase.RESIZE));
			this.__checkDisplayUpdate();
		}
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"stage",{
	get: function (){
		return this._stage;
	},
    set: function (value) {
        if(this._stage==value) return;
		this._stage=value;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"visible",{
	get: function (){
		return this._visible;
	},
    set: function (value) {
        if(this._visible==value) return;
		this._visible=value;
		this.__checkDisplayUpdate();
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"parent",{
	get: function (){
		return this._parent;
	},
    set: function (value) {
        if(this._parent==value) return;
		this._parent=value;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"alpha",{
	get: function (){
		return this._alpha;
	},
    set: function (value) {
        if(this._alpha==value || isNaN(value)) return;
		this._alpha=MathUtil.clamp(value,0,1);
		this.__checkDisplayUpdate();
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"updateMatrix",{
	get: function (){
		return this._updateMatrix;
	},
    set: function (value) {
    	if(value) this.__checkDisplayUpdate();
    	
        if(this._updateMatrix==value) return;
		this._updateMatrix=value;
		
		if(value && this._bounds) this._bounds.width=this._bounds.heigth=0;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"skewX",{
	get: function (){
		return this._skewX;
	},
    set: function (value) {
        if(this._skewX==value||isNaN(value)) return;
              
		this._skewX=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"skewY",{
	get: function (){
		return this._skewY;
	},
    set: function (value) {
        if(this._skewY==value || isNaN(value)) return;
              
		this._skewY=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"x",{
	get: function (){
		return this._x;
	},
    set: function (value) {
        if(this._x==value|| isNaN(value))return;
        
		this._x=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"y",{
	get: function (){
		return this._y;
	},
    set: function (value) {
        if(this._y==value|| isNaN(value))return;
          
		this._y=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"width",{
	get: function (){
		return this._width;
	},
    set: function (value) {
        if(this._width==value || isNaN(value)) return;     
        
		this._width=Math.max(0,value);
		this.updateMatrix=true;
		this.resize=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"height",{
	get: function (){
		return this._height;
	},
    set: function (value) {
        if(this._height==value || isNaN(value)) return;  
            
		this._height=Math.max(0,value);
		this.updateMatrix=true;
		this.resize=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"scaleX",{
	get: function (){
		return this._scaleX;
	},
    set: function (value) {
        if(this._scaleX==value|| isNaN(value)) return;
            
		this._scaleX=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"scaleY",{
	get: function (){
		return this._scaleY;
	},
    set: function (value) {
        if(this._scaleY==value || isNaN(value)) return;
              
		this._scaleY=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"rotation",{
	get: function (){
		return this._rotation;
	},
    set: function (value) {
        if(this._rotation==value || isNaN(value)) return;
              
		this._rotation=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"param",{
	get: function (){
		const str=DisplayBase.toString(this);
		return JSON.parse(str);
	},
    set: function (value) {
        if(value==undefined || value==null) return;
        if(value.hasOwnProperty("name")) delete value.name;
        
		ObjectUtil.copyAttribute(this,value,false);
		this.updateMatrix=true;
		this.resize=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"origin",{
    get: function () {
    	if(this.register_point==undefined) this.register_point=ObjectPool.create(Point);
        return this.register_point;
    },
    set: function (value) {
        if(value==undefined || value==null) return;
        if(this.register_point==undefined) this.register_point=ObjectPool.create(Point);
        if(this.register_point.x==value.x && this.register_point.y==value.y) return;
        
		this.register_point.x=value.x;
		this.register_point.y=value.y;
		
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"matrix",{
    get: function () {
        return this._matrix || this.getMatrix();
    },
    set: function (value) {
        if(value==undefined || value==null || !(value instanceof Matrix) ) return;
		var mtx1=this.getMatrix().clone();
		var mtx2=this.getMatrix(this);
		
		mtx1.invert();
		mtx1.concat(mtx2);
		
		value.concat(mtx1);
		ObjectPool.remove(mtx1);
		value.applyDisplay(this);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"scale",{
	get: function (){
		return (this._scaleX==this._scaleY) ? this._scaleX : NaN;
	},
    set: function (value) {
        if(value==undefined || value==null || isNaN(value)) return;
        
		this._scaleX=this._scaleY=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"cursor",{
	get: function (){
		return this._cursor;
	},
    set: function (value) {
        if(value==this._cursor) return;
		this._cursor=value;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"draggable",{
    get: function () {
        return this._draggable;
    },
    set: function (value) {
        if(value==undefined || value==null || this._draggable==value) return;
		this._draggable=value;
		this.breakTouch=this.mouseEnabled=value;
    },
    enumerable: true,
    configurable: true
});

DisplayBase.prototype.__checkDisplayUpdate= function()
{
	if(this._stage && !this._stage.auto_fresh) this._stage.auto_fresh=true;
}

DisplayBase.prototype.setSize=function(w,h)
{
	if(w==undefined || isNaN(w) || h==undefined || isNaN(h) || (this._width==w && this._height==h)) return;
	
	this._width=w;
	this._height=h;
	
	this.resize=true;
	this.updateMatrix=true;
}

DisplayBase.prototype.getMatrix = function(target,isDraw)
{
	if(this._matrix && !this.updateMatrix && target==undefined) 
		return this._matrix;
	
	if(this._temp_matrix==undefined) this._temp_matrix=ObjectPool.create(Matrix);
	else this._temp_matrix.reset();
	
	if(target && target==this) {}
	else if(this.parent) {
		for(obj=this; obj!=null && !(target && target==obj); obj=obj.parent)
		{	
	        this._temp_matrix.concatTransform(obj.x, obj.y, obj.scaleX, obj.scaleY, obj.rotation, obj.origin.x, obj.origin.y,obj.skewX,obj.skewY);
		}
    }
	
	if(this.updateMatrix && target==undefined && isDraw) {
		if(this._matrix==undefined) this._matrix=this._temp_matrix.clone();
		else this._matrix.setup(this._temp_matrix.a, this._temp_matrix.b, this._temp_matrix.c, this._temp_matrix.d, this._temp_matrix.tx, this._temp_matrix.ty);
		this.updateMatrix=false;
	}
	
	return this._temp_matrix;
}

DisplayBase.prototype.addEventListener=function(eventType, func,id)
{
	if(this.listeners==undefined) this.listeners={};
	DisplayBase.superClass.addEventListener.call(this,eventType,func,id);
}

DisplayBase.prototype.localToGlobal = function(posX, posY)
{
	if(posY==undefined && (posX instanceof Point)){
		posY=posX.y;
		posX=posX.x;
	}

	var matrix=this.getMatrix();
	var mtx=ObjectPool.create(Matrix);
	mtx.setup(1, 0, 0, 1, posX, posY);
	mtx.concat(matrix);
	var point=new Point(mtx.tx, mtx.ty);
	ObjectPool.remove(mtx);
	return point;
}
		
DisplayBase.prototype.globalToLocal = function(posX, posY)
{
	if(posY==undefined && (posX instanceof Point)){
		posY=posX.y;
		posX=posX.x;
	}
		
	var matrix=this.getMatrix().clone();
	matrix.invert();
	var mtx=ObjectPool.create(Matrix);
	mtx.setup(1, 0, 0, 1, posX, posY);
	mtx.concat(matrix);
    var point=new Point(mtx.tx, mtx.ty);
	ObjectPool.remove(matrix);
	ObjectPool.remove(mtx);
	return point;
}

DisplayBase.prototype.localToTarget = function(posX, posY,target)
{
	if(target==undefined || target==null) return this.localToGlobal(posX, posY);
	
	var point=this.localToGlobal(posX, posY);
	return target.globalToLocal(point.x, point.y);
}

DisplayBase.prototype.getWidth = function()
{
	return Math.ceil(Math.abs(this.width * this.scaleX));
}
		
DisplayBase.prototype.getHeight = function()
{
	return Math.ceil(Math.abs(this.height * this.scaleY));
}

DisplayBase.prototype.getBounds = function(target)
{
	var w = (this.getWidth()/Math.abs(this.scaleX));
	var h = (this.getHeight()/Math.abs(this.scaleY));
	
	var posX=this._minX;
	var posY=this._minY;
	var i,poly,bool=(target==undefined && this._bounds);
	
	if(this.polyArea){
		if(this._bounds==undefined) this._bounds=ObjectUtil.cloneObj(this.polyArea);
		else{
			for(i=0;i<this.polyArea.length;i++){
				this._bounds[i].x=this.polyArea[i].x;
				this._bounds[i].y=this.polyArea[i].y;
			}
		}
		
		poly=this._bounds;
	}
	else if(bool){
		if(this._bounds.width>0 && this._bounds.height>0) return this._bounds;
		
		this._bounds[0].x=posX;this._bounds[0].y=posY;
		this._bounds[1].x=posX+w;this._bounds[1].y=posY;
		this._bounds[2].x=posX+w;this._bounds[2].y=posY+h;
		this._bounds[3].x=posX;this._bounds[3].y=posY+h;
	}
	
	var mtx = this.getMatrix(target);
	poly = poly || (bool ? this._bounds : [{x:posX, y:posY}, {x:posX+w, y:posY}, {x:posX+w, y:posY+h}, {x:posX, y:posY+h}]);
	
	var vertexs =bool ? this._bounds : [],len = poly.length, v, minX, maxX, minY, maxY;	
	v = mtx.transformPoint(poly[0], true, false);
	
	minX = maxX = v.x;
	minY = maxY = v.y;
	vertexs[0] = v;
	
	for(var i = 1; i < len; i++)
	{
		v = mtx.transformPoint(poly[i], true, false);
		if(minX > v.x) minX = v.x;
		else if(maxX < v.x) maxX = v.x;
		if(minY > v.y) minY = v.y;
		else if(maxY < v.y) maxY = v.y;
		vertexs[i] = v;
	}
	
	vertexs.x = minX;
	vertexs.y = minY;
	vertexs.width = maxX - minX;
	vertexs.height = maxY - minY;
	
	if(target==undefined && this._bounds==undefined) this._bounds=vertexs;
	return vertexs;
}

DisplayBase.prototype.getIndex=function()
{
	if(this.parent==null || !this.parent.contains(this)) return -1;
	return this.parent._children.indexOf(this);
}

DisplayBase.prototype.toTop=function()
{
	if(this.parent==null || !this.parent.contains(this)) return;
	this.parent.setChildIndex(this,this.parent.numChildren-1);
}

DisplayBase.prototype.toBottom=function()
{
	if(this.parent==null || !this.parent.contains(this)) return;
	this.parent.setChildIndex(this,0);
}

DisplayBase.prototype.moveTo=function(x,y)
{
	if(y==undefined && (x instanceof Point)){
		y=x.y;
		x=x.x;
	}
	
	if((this._x==x && this._y==y) || isNaN(x) || isNaN(y))  return;
	
	this._x=x;
	this._y=y;
	
	this.updateMatrix=true;
}

DisplayBase.prototype.render  = function(){}

DisplayBase.prototype.removeFromParent = function(bool)
{
	if(this.parent==null || !this.parent.contains(this)) {
		if(bool && !Global.gc(this)) this.dispose();
		return;
	}
	
	this.parent.removeChild(this);
	if(bool && !Global.gc(this)) this.dispose();
}

DisplayBase.prototype.reset = function()
{
	if(this._parent) this.removeFromParent(false);
	if(this._matrix) ObjectPool.remove(this._matrix);
	if(this._temp_matrix) ObjectPool.remove(this._temp_matrix);
	if(this.register_point) ObjectPool.remove(this.register_point);
	if(DisplayBase.superClass) DisplayBase.superClass.reset.call(this);
	
	this.stage=null;
	this._visible=this._updateMatrix=true;
	this._scaleY=this._scaleX=this._alpha=this._parent_alpha=1;
    this._minX=this._minY=this._skewX=this._skewY=this._height=this._width=this._y=this._x=this._rotation=0;
    this._resize=this.mouseEnabled=this.usePolyCollision=this.breakTouch=this._draggable=false;
    this._cursor=this._bounds=this._matrix=this._temp_matrix=this.register_point=this.parent=this.polyArea=this.name=null;
}

DisplayBase.prototype.dispose = function()
{
	this.reset();
	if(DisplayBase.superClass) DisplayBase.superClass.dispose.call(this);
	delete this._cursor,this._bounds,this._minX,this._minY,this._temp_matrix,this.breakTouch,this._resize,this._skewX,this._skewY,this._stage,this._updateMatrix,this.polyArea,this._draggable,this.usePolyCollision,this._matrix,this.register_point,this._height,this._width,this._y,this._x,this._rotation,this._scaleY,this._scaleX,this._alpha,this.mouseEnabled,this._visible,this.name,this._parent,this._parent_alpha;
}

DisplayBase.RESIZE="display_base_resize";
DisplayBase.RESET_INSTANCE = "display_reset_instance";

DisplayBase.toString = function(obj)
{
	var str="{";
	str+='"_x":'+obj._x+',';
	str+='"_y":'+obj._y+',';
	str+='"_width":'+obj._width+',';
	str+='"_height":'+obj._height+',';
	str+='"_rotation":'+obj._rotation+',';
	str+='"_scaleX":'+obj._scaleX+',';
	str+='"_scaleY":'+obj._scaleY+',';
	str+='"_skewX":'+obj._skewX+',';
	str+='"_skewY":'+obj._skewY+',';
	str+='"_minX":'+obj._minX+',';
	str+='"_minY":'+obj._minY+',';
	str+='"origin":'+(obj.origin==null ? '""' : obj.origin.toString())+',';
	str+='"mouseEnabled":'+obj.mouseEnabled+',';
	str+='"_visible":'+obj._visible+',';
	str+='"name":"'+obj.name+'",';
	str+='"breakTouch":"'+obj.breakTouch+'",';
	str+='"alpha":'+obj.alpha+',';
	str+='"_draggable":'+obj._draggable+',';
	str+='"_cursor":"'+obj._cursor+'",';
	if(this.polyArea) str+='"polyArea":'+obj.polyArea.toString()+',';
	str+='"usePolyCollision":'+obj.usePolyCollision+',';
	str+='"matrix":'+(obj._matrix ? obj._matrix.toString() : '""');
	return str+"}";
}