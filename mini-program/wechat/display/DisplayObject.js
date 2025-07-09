/**
===================================================================
DisplayObject Class
===================================================================
**/

import CollisionUtil from '../utils/CollisionUtil.js'
import CanvasUtil from '../utils/CanvasUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import GraphicsVO from '../model/GraphicsVO.js'
import StringUtil from '../utils/StringUtil.js'
import UniqueUtil from '../utils/UniqueUtil.js'
import ContextVO from '../model/ContextVO.js'
import ClassUtil from '../utils/ClassUtil.js'
import ShapeUtil from '../utils/ShapeUtil.js'
import DisplayBase from './DisplayBase.js'
import Loader from '../loader/Loader.js'
import Event from '../events/Event.js'
import Source from '../core/Source.js'

const _graphics=Symbol("graphics");

/**
 * @class
 * @module DisplayObject
 * @extends DisplayBase
 */
export default class DisplayObject extends DisplayBase
{
	constructor()
	{
		super();
		
		/**
		 * 是否严格渲染命令顺序
		 */
		this.strict=false;
		
		this._repeat=false;
		this._mask=null;
	
		this.name=UniqueUtil.getName("display_object");
		this[_graphics]=null;
		this._blendMode=null;
		this._context=null;
		this.polyArea=null;
		this.filters=[];
	}
	
	get blendMode()
	{
		return this._blendMode;
	}
	
	set blendMode(str)
	{
		if(this._blendMode==str) return;
		this._blendMode=str;
		this.__checkDisplayUpdate();
	}
	
	get mask()
	{
		return this._mask;
	}
	
	set mask(value) 
	{
		if(!value || !this.instance){
			this._mask=null;
			return;
		}
		
		this._mask=value;
		this.__checkDisplayUpdate();
		this.polyArea=value ? (typeof value=="string" ? ShapeUtil.getPathBounds(value,true) : value.getPoints()) : null;
    }
	
	get graphics()
	{
		this[_graphics] =(!this[_graphics] ? ObjectPool.create(GraphicsVO) : this[_graphics]);
		return this[_graphics];
	}
	
	set graphics(value) 
	{
        this[_graphics] =(value && !(value instanceof GraphicsVO) ? null : value);
    }
	
	get context()
	{
		if(!this._context){
			this._context=ObjectPool.create(ContextVO);
			this._context.strict=this.strict;
		}

		return this._context;
	}
	
	set context(value)
	{
		this._context=value;
	}
	
	/**
	 * repeat display
	 * @param {Number} w
	 * @param {Number} h
	 * @param {String} t repeat|repeat-x|repeat-y|no-repeat
	 */
	repeat(w,h,t)
	{
		if(this.instance==undefined || t=="no-repeat" || (w<=this.instance.width && h<=this.instance.height)){
			this._repeat=false;
			return;
		}
		
		t = t || "repeat";
		
		this.width=w;
		this.height=h;
		this._repeat=true;
		
		this.graphics.clear();
		this.graphics.beginBitmapFill(this.instance.image,t);
		this.graphics.drawRect(0,0,this.width,this.height);
		this.graphics.endFill();
	}
	
	_transform (target,obj)
	{
		let _temp_context=(obj==undefined ? this.stage.context : obj.context);
		let mtx=this.getMatrix(target,true);
	    _temp_context.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
		_temp_context.globalAlpha*=this.alpha*this._parent_alpha;
	}
	
	/**
	 * 设置显示资源
	 * @param {Source|Image} target
	 */
	setInstance(target)
	{
		if(target && (target instanceof Source) && !target.image) target=null;
		
		if(this.instance!=target){
			if(this.instance && (this.instance instanceof Source) && this.instance.isClone){
				ObjectPool.remove(this.instance);
			}
			this.instance=null;
			this.width=this.height=0;
		}
		
		if(target==undefined || target==null || this.instance==target) return target;
		
		if(ClassUtil.isImage(target)){
			const temp=target;
			target=ObjectPool.create(Source);
			target.image=temp;
			target.isClone=true;
			target.width=temp.width;
			target.height=temp.height;
		}
		
		if(this.instance && (this.instance instanceof Source) && this.instance.isClone){
			ObjectPool.remove(this.instance);
		}
		
		this.instance=target;
		if(!StringUtil.isEmpty(target.name) && (!this.name || this.name.indexOf("display_object")>=0)) 
			this.name=target.name;
		
		this.width=this.instance.isRotated ? this.instance.height : this.instance.width;
		this.height=this.instance.isRotated ? this.instance.width : this.instance.height;
		this.origin={x:target.regX,y:target.regY};

		this.updateMatrix=true;
		this.__checkDisplayUpdate();
		this.emit(new Event(DisplayBase.RESET_INSTANCE));
		return this.instance;
	}
	
	do_actions(target,vo,is_graphics=false)
	{
		if(!target || !target.context || !vo) return;
		const canvas=(is_graphics ? target : target.context);
		let action;
		
		if(!vo.strict){
			for(let i in vo.value) {
				if(canvas[i]==vo.value[i]) continue;
				canvas[i]=vo.value[i];
			}
		}
	
		for(action of vo.actions)
		{
			if(action.type===1) {
				try{
					canvas[action.method].apply(canvas,action.data);
				}
				catch(err){
					console.log("[ERROR]",err);
				}
			}
			else if(action.type===0) canvas[action.method]=action.data[0];
		}
	}
	
	/**
	 * 刷新呈现
	 * @param {CanvasRenderingContext2D} context
	 * @param {Boolean} initial
	 * @param {DisplayObjectContainer} upper
	 */
	_render (target=null,initial=false,upper=null)
	{
		if (!this.visible || this.alpha <= 0 || (!target && !this.stage))  return;
		if (target==undefined) this.stage.context.save();
		if(!initial) this._transform(upper,target);
		
		if(this._mask){
			if(typeof this._mask=="string") (target ? target : this.stage.graphics).drawSVGPath(this._mask);
			else (target ? target : this.stage.graphics).drawRect(this._mask.x,this._mask.y,this._mask.width,this._mask.height);
			(target ? target.context : this.stage.context).clip();
		}
		
		if(this._blendMode!=null){
			(target ? target.context : this.stage.context).globalCompositeOperation=this._blendMode;
		}
		
		if(this.filters && this.filters.length>0){
			let filter;
			for (filter of this.filters)
			{
				if(filter==undefined) continue;
				filter.show(target!=undefined ? target.context : this.stage.context);
			}
		}
		
		if(this.instance && this.instance.image){
			const ctx=(target!=undefined ? target.context : this.stage.context);
			if(this.instance.isRotated) ctx.rotate(1.5 * Math.PI);
			
			ctx.drawImage(
				this.instance.image,
				this.instance.x,
				this.instance.y,
				this.instance.width,
				this.instance.height,
				this.instance.isRotated ? -this.instance.width/this.instance.scale : 0,0,this.instance.width/this.instance.scale,
				this.instance.height/this.instance.scale);
			if(this.instance.isRotated) ctx.rotate(0.5 * Math.PI);
		}

		if(this[_graphics]){
			this.do_actions(target ? target : this.stage.graphics,this.graphics,true);
		}else if(this.context){
			this.do_actions(target ? target : this.stage,this.context);
		}
		
		if (target==undefined) this.stage.context.restore();
	}

	async cacheAsImage(width=0,height=0)
	{
		width=width || this.width;
		height=height || this.height;
		if(width<=0 || height<=0) return;

		this.setSize(width,height);
		const base64=CanvasUtil.displayToImage(this);
		if(!base64) return;
		
		if(this[_graphics]){
			ObjectPool.remove(this[_graphics]);
			this[_graphics]=null;
		}
		
		const img=await Loader.loadImage(base64);
		const source=ObjectPool.create(Source);
		source.image=img;
		source.isClone=true;
		source.width=width;
		source.height=height;
		this.setInstance(source);
	}
	
	render ()
	{
		this._render.apply(this,arguments);
	}
	
	/**
	 * 碰撞点测试 (注意是全局坐标)
	 * @param {Number} x
	 * @param {Number} y
	 */
	hitTestPoint (x,y) 
	{
		return CollisionUtil.hitTestPoint(this,x,y, this.usePolyCollision)>0 ;
	}
	
	/**
	 * 碰撞测试
	 * @param {displayObject} obj
	 */
	hitTestObject (obj) 
	{
		if(obj==null || !(obj instanceof DisplayBase) ) return false;
		if(obj==this) return true;
		
		return CollisionUtil.hitTestObject(this,obj,this.usePolyCollision);
	}
	
	reset ()
	{	
		super.reset();
		
		if(this._parent){
			this.removeFromParent(false);
		}
		
		if(this.instance && (this.instance instanceof Source) && this.instance.isClone){
			ObjectPool.remove(this.instance);
		}
		
		if(this[_graphics])  {
	        ObjectPool.remove(this[_graphics]);
		}
		
		if(this.context){
			ObjectPool.remove(this.context);
		}
		
		this.mask=this.instance=this[_graphics]=this._context=this._blendMode=null;
		this._repeat=false;
		this.strict=false;
		this.filters=[];
	}
	
	dispose ()
	{
		super.dispose();
		delete this.strict,this._repeat,this.filters,this._mask,this.instance,this._blendMode,this._context;
	}
	
	toString ()
	{
		return DisplayObject.name;
	}
}

DisplayObject.className="DisplayObject";
module.exports = DisplayObject;