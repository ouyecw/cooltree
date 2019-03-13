/**
===================================================================
DisplayBase Class
===================================================================
**/

const _draggable=Symbol("draggable");

const _x=Symbol("x");
const _y=Symbol("y");
const _skewX=Symbol("skewX");
const _skewY=Symbol("skewY");
const _width=Symbol("width");
const _height=Symbol("height");
const _scaleX=Symbol("scaleX");
const _scaleY=Symbol("scaleY");
const _rotation=Symbol("rotation");

class DisplayBase extends EventDispatcher
{
	constructor()
	{
		super();
		this._cursor=this.name=this.register_point=this._parent=this._temp_matrix=this._matrix=this.polyArea=this._stage=this._bounds=null;
		this[_height]=this[_width]=this[_y]=this[_x]=this[_rotation]=this[_skewX]=this[_skewY]=this._minX=this._minY=0;
		this[_scaleY]=this[_scaleX]=this._alpha=this._parent_alpha=1;
		this._refresh=this._resize=this.mouseEnabled=false;
		this.usePolyCollision=false;
		this._updateMatrix=true;
		this.breakTouch=false;
		this[_draggable]=false;
		this._visible=true;
	}
	
	set buttonMode(value)
	{
		this._cursor=value ? "pointer" : "";
	}
	
	get buttonMode()
	{
		return (this._cursor=="pointer");
	}
	
	set resize(value)
	{
		this._resize=value;
			
		if(this._resize){
			this.dispatchEvent(Factory.c("ev",[DisplayBase.RESIZE]));
			this.__checkDisplayUpdate();
		}
	}
	
	get resize()
	{
		return this._resize;
	}
	
	get stage()
	{
		return this._stage;
	}
	
	set stage(value)
	{
		if(this._stage==value) return;
		this._stage=value;
	}
	
	set visible(value)
	{
		value=Boolean(value);
		if(this._visible==value) return;
		this._visible=value;
		this.__checkDisplayUpdate();
	}
	
	get visible()
	{
		return this._visible;
	}
	
	set parent(value) 
	{
        if(this._parent==value) return;
		this._parent=value;
    }
	
	get parent()
	{
		return this._parent;
	}

	set alpha(value) 
	{
        if(this._alpha==value || Number.isNaN(value)) return;
		this._alpha=MathUtil.clamp(value,0,1);
		this.__checkDisplayUpdate();
		this.updateMatrix=true;
    }
	
	get alpha()
	{
		return this._alpha;
	}
	
	get updateMatrix()
	{
		return this._updateMatrix;
	}
	
	set updateMatrix(value) 
	{
		if(value)this.__checkDisplayUpdate();
        if(this._updateMatrix==value) return;
		this._updateMatrix=value;
		
		if(value && this._bounds) this._bounds.width=this._bounds.heigth=0;
    }
	
	get skewX()
	{
		return this[_skewX];
	}
	
	set skewX(value) 
	{
        if(this[_skewX]==value||Number.isNaN(value)) return;
              
		this[_skewX]=MathUtil.format(value);
		this.updateMatrix=true;
    }
	
	get skewY()
	{
		return this[_skewY];
	}
	
	set skewY(value) 
	{
        if(this[_skewY]==value || Number.isNaN(value)) return;
              
		this[_skewY]=MathUtil.format(value);
		this.updateMatrix=true;
    }
	
	get x()
	{
		return this[_x];
	}
	
	set x(value)
	{
		if(this[_x]==value|| Number.isNaN(value))return;
	        
		this[_x]=MathUtil.format(value);
		this.updateMatrix=true;
	}
	
	get y()
	{
		return this[_y];
	}
	
	set y(value)
	{
		if(this[_y]==value|| Number.isNaN(value))return;
	        
		this[_y]=MathUtil.format(value);
		this.updateMatrix=true;
	}
	
	get width()
	{
		return this[_width];
	}
	
	set width(value) 
	{
        if(this[_width]==value || Number.isNaN(value)) return;     
        
		this[_width]=MathUtil.format(Math.max(0,value));
		this.updateMatrix=true;
		this.resize=true;
    }
	
	get height()
	{
		return this[_height];
	}
	
	set height(value) 
	{
        if(this[_height]==value || Number.isNaN(value)) return;  
            
		this[_height]=MathUtil.format(Math.max(0,value));
		this.updateMatrix=true;
		this.resize=true;
    }
	
	get scaleX()
	{
		return this[_scaleX];
	}
	
	set scaleX(value) 
	{
        if(this[_scaleX]==value|| Number.isNaN(value)) return;
            
		this[_scaleX]=MathUtil.format(value);
		this.updateMatrix=true;
    }
	
	get scaleY()
	{
		return this[_scaleY];
	}
	
	set scaleY(value) 
	{
        if(this[_scaleY]==value|| Number.isNaN(value)) return;
            
		this[_scaleY]=MathUtil.format(value);
		this.updateMatrix=true;
    }
	
	get rotation()
	{
		return this[_rotation];
	}
	
	set rotation(value) 
	{
        if(this[_rotation]==value || Number.isNaN(value)) return;
              
		this[_rotation]=MathUtil.format(value);
		this.updateMatrix=true;
    }
	
	get param()
	{
		const str=DisplayBase.toString(this);
		return JSON.parse(str);
	}
	
	set param(value) 
	{
        if(value==undefined || value==null) return;
        if(value.hasOwnProperty("matrix")) delete value.matrix;
        if(value.hasOwnProperty("name")) delete value.name;
        
		ObjectUtil.copyAttribute(this,value,true);
		this.updateMatrix=true;
		this.resize=true;
    }
	
	get origin()
	{
		return this.register_point;
	}
	
	set origin(value) 
	{
        if(value==undefined || value==null) return;
        
        if(this.register_point==undefined) {
        	if(value instanceof Point) {
        		this.register_point=value;
        		this.updateMatrix=true;
        	}
        	else this.register_point=ObjectPool.create(Point);
        }
        
        if(this.register_point.x==value.x && this.register_point.y==value.y) return;
        
		this.register_point.x=value.x;
		this.register_point.y=value.y;
		
		if(value instanceof Point) ObjectPool.remove(value);
		this.updateMatrix=true;
    }
	
	get matrix()
	{
		if(this.updateMatrix) {
			this.getMatrix(null,true);
			this._refresh=true;
		}
		
		return this._matrix ? this._matrix : this.getMatrix();
	}
	
	set matrix(value) 
	{
        if(value==undefined || value==null || !(value instanceof Matrix) ) return;
		let mtx1=this.getMatrix().clone();
		let mtx2=this.getMatrix(this);
		
		mtx1.invert();
		mtx1.concat(mtx2);
		
		value.concat(mtx1);
		ObjectPool.remove(mtx1);
		value.applyDisplay(this);
    }
	
	get scale()
	{
		return (this[_scaleX]==this[_scaleY]) ? this[_scaleX] : NaN;
	}
	
	set scale(value) 
	{
        if(value==undefined || value==null || Number.isNaN(value)) return;
        
		this[_scaleX]=this[_scaleY]=MathUtil.format(value);
		this.updateMatrix=true;
    }
	
	get cursor()
	{
		return this._cursor;
	}
	
	set cursor(value) 
	{
        if(value==this._cursor) return;
		this._cursor=value;
    }
	
	get draggable()
	{
		return this[_draggable];
	}
	
	set draggable(value) 
	{
        if(value==undefined || value==null || this[_draggable]==value) return;
		this[_draggable]=value;
		this.breakTouch=this.mouseEnabled=value;
    }
	
	__checkDisplayUpdate()
	{
		if(this._stage && !this._stage.auto_fresh) this._stage.auto_fresh=true;
	}
	
	setSize(w,h)
	{
		if(w==undefined || Number.isNaN(w) || h==undefined || Number.isNaN(h) || (this[_width]==w && this[_height]==h)) return;
		this.height=h;
		this.width=w;
	}
	
	getMatrix (target,isDraw)
	{
		if(this._matrix && !this.updateMatrix && !target && isDraw) return this._matrix;
		
		if(this._temp_matrix==undefined) this._temp_matrix=ObjectPool.create(Matrix);
		else this._temp_matrix.reset();
		
		if(this._matrix && !this.updateMatrix && !target && !isDraw){
			this._temp_matrix.setup(this._matrix.a, this._matrix.b, this._matrix.c, this._matrix.d, this._matrix.tx, this._matrix.ty);
			return this._temp_matrix;
		}
		
		if(target==this) return this._temp_matrix;
		this._temp_matrix.concatTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.origin ? this.origin.x : 0, this.origin ? this.origin.y : 0,this.skewX,this.skewY);
		
		if(this.parent && target!=this.parent) {
			this._temp_matrix.concat(this.parent.matrix);
			
			if(target){
				const mtx=target.matrix.clone().invert();
				this._temp_matrix.concat(mtx);
				ObjectPool.remove(mtx);
			}
	    }
		
		if(this.updateMatrix && !target && isDraw) {
			if(!this._matrix) this._matrix=this._temp_matrix.clone();
			else this._matrix.setup(this._temp_matrix.a, this._temp_matrix.b, this._temp_matrix.c, this._temp_matrix.d, this._temp_matrix.tx, this._temp_matrix.ty);
			this.updateMatrix=false;
		}
		
		return this._temp_matrix;
	}
	
	localToGlobal (posX, posY)
	{
		if(posY==undefined && (posX instanceof Point)){
			const pos=posX;
			posY=pos.y;
			posX=pos.x;
			ObjectPool.remove(pos);
		}
	
		const matrix=this.getMatrix();
		const mtx=ObjectPool.create(Matrix);
		mtx.setup(1, 0, 0, 1, posX, posY);
		mtx.concat(matrix);
		const point=ObjectPool.create(Point).set(mtx.tx, mtx.ty);
		ObjectPool.remove(mtx);
		return point;
	}
			
	globalToLocal (posX, posY)
	{
		if(posY==undefined && (posX instanceof Point)){
			const pos=posX;
			posY=pos.y;
			posX=pos.x;
			ObjectPool.remove(pos);
		}
			
		const matrix=this.getMatrix();
		matrix.invert();
		const mtx=ObjectPool.create(Matrix);
		mtx.setup(1, 0, 0, 1, posX, posY);
		mtx.concat(matrix);
	    const point=ObjectPool.create(Point).set(mtx.tx, mtx.ty);
		ObjectPool.remove(mtx);
		return point;
	}
	
	localToTarget (posX, posY,target)
	{
		if(target==undefined || target==null) return this.localToGlobal(posX, posY);
		return target.globalToLocal(this.localToGlobal(posX, posY));
	}
	
	getWidth ()
	{
		return Math.ceil(Math.abs(this.width * this.scaleX));
	}
			
	getHeight ()
	{
		return Math.ceil(Math.abs(this.height * this.scaleY));
	}
	
	getBounds (target)
	{
		let w = (this.getWidth()/Math.abs(this.scaleX));
		let h = (this.getHeight()/Math.abs(this.scaleY));
		
		let posX=this._minX;
		let posY=this._minY;
		let i,poly,bool=(target==undefined && this._bounds);
		
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
		
		let mtx = this.getMatrix(target);
		poly = poly || (bool ? this._bounds : [{x:posX, y:posY}, {x:posX+w, y:posY}, {x:posX+w, y:posY+h}, {x:posX, y:posY+h}]);
		
		let vertexs =bool ? this._bounds : [],len = poly.length, v, minX, maxX, minY, maxY;	
		v = mtx.transformPoint(poly[0], true, false);
		
		minX = maxX = v.x;
		minY = maxY = v.y;
		vertexs[0] = v;
		
		for(let i = 1; i < len; i++)
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
	
	getIndex()
	{
		if(this.parent==null || !this.parent.contains(this)) return -1;
		return this.parent._children.indexOf(this);
	}
	
	toTop()
	{
		if(this.parent==null || !this.parent.contains(this)) return;
		this.parent.setChildIndex(this,this.parent.numChildren-1);
	}
	
	toBottom()
	{
		if(this.parent==null || !this.parent.contains(this)) return;
		this.parent.setChildIndex(this,0);
	}
	
	moveTo(x,y)
	{
		if(y==undefined && (x instanceof Point)){
			y=x.y;
			x=x.x;
		}
		
		if((this[_x]==x && this[_y]==y) || Number.isNaN(x) || Number.isNaN(y))  return;
		
		this[_x]=x;
		this[_y]=y;
		
		this.updateMatrix=true;
	}
	
	removeFromParent (bool)
	{
		if(this.parent==null || !this.parent.contains(this)) {
			if(bool && !Global.gc(this)) this.dispose();
			return;
		}
		
		this.parent.removeChild(this);
		if(bool && !Global.gc(this)) this.dispose();
	}
	
	reset ()
	{
		if(this._parent) this.removeFromParent(false);
		if(this._matrix) ObjectPool.remove(this._matrix);
		if(this._temp_matrix) ObjectPool.remove(this._temp_matrix);
		if(this.register_point) ObjectPool.remove(this.register_point);
		
		super.reset();
		this.stage=null;
		this._visible=this._updateMatrix=true;
		this[_scaleY]=this[_scaleX]=this._alpha=this._parent_alpha=1;
	    this._minX=this._minY=this[_skewX]=this[_skewY]=this[_height]=this[_width]=this[_y]=this[_x]=this[_rotation]=0;
	    this._refresh=this._resize=this.mouseEnabled=this.usePolyCollision=this.breakTouch=this[_draggable]=false;
	    this._cursor=this._bounds=this._matrix=this._temp_matrix=this.register_point=this.parent=this.polyArea=this.name=null;
	}
	
	dispose ()
	{
		this.reset();
		super.dispose();
		delete this._refresh,this._cursor,this._bounds,this._minX,this._minY,this._temp_matrix,this.breakTouch,this._resize,this[_skewX],this[_skewY],this._stage,this._updateMatrix,this.polyArea,this[_draggable],this.usePolyCollision,this._matrix,this.register_point,this[_height],this[_width],this[_y],this[_x],this[_rotation],this[_scaleY],this[_scaleX],this._alpha,this.mouseEnabled,this._visible,this.name,this._parent,this._parent_alpha;
	}
	
	render  (){}
	
	static toString (obj)
	{
		let str="{";
		str+='"x":'+obj.x+',';
		str+='"y":'+obj.y+',';
		str+='"width":'+obj.width+',';
		str+='"height":'+obj.height+',';
		str+='"rotation":'+obj.rotation+',';
		str+='"scaleX":'+obj.scaleX+',';
		str+='"scaleY":'+obj.scaleY+',';
		str+='"skewX":'+obj.skewX+',';
		str+='"skewY":'+obj.skewY+',';
		str+='"_minX":'+obj._minX+',';
		str+='"_minY":'+obj._minY+',';
		str+='"origin":'+(!obj.origin ? 'null' : obj.origin.toString())+',';
		str+='"mouseEnabled":'+obj.mouseEnabled+',';
		str+='"visible":'+obj.visible+',';
		str+='"name":"'+obj.name+'",';
		str+='"breakTouch":"'+obj.breakTouch+'",';
		str+='"alpha":'+obj.alpha+',';
		str+='"draggable":'+obj.draggable+',';
		str+='"_cursor":"'+(!obj._cursor ? '' : obj._cursor)+'",';
		if(this.polyArea) str+='"polyArea":'+obj.polyArea.toString()+',';
		str+='"usePolyCollision":'+obj.usePolyCollision+',';
		str+='"matrix":'+(obj._matrix ? obj._matrix.toString() : '""');
		return str+"}";
	}	
}

DisplayBase.RESIZE="display_base_resize";
DisplayBase.RESET_INSTANCE = "display_reset_instance";