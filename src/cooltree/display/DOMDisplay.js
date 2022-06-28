/**
===================================================================
DOMDisplay Class
===================================================================
**/

import CollisionUtil from '../utils/CollisionUtil.js'
import UniqueUtil from '../utils/UniqueUtil.js'
import StringUtil from '../utils/StringUtil.js'
import ClassUtil from '../utils/ClassUtil.js'
import CanvasUtil from '../utils/CanvasUtil.js'
import ObjectUtil from '../utils/ObjectUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import DisplayObject from './DisplayObject.js'
import BlendMode from '../type/BlendMode.js'; 
import MathUtil from '../utils/MathUtil.js'
import DOMUtil from '../utils/DOMUtil.js'
import DisplayBase from './DisplayBase.js'
import Event from '../events/Event.js'
import Global from '../core/Global.js'
import Source from '../core/Source.js'
import Graphics from './Graphics.js'
import Point from '../geom/Point.js'

const _element=Symbol("element");

/**
 * @class
 * @module DOMDisplay
 * @extends DisplayBase
 */
export default class DOMDisplay extends DisplayBase
{
	constructor()
	{
		super();
		this._blendMode=this.instance=this._rect=this._mask=this._parent_node=this[_element]=null;
		this.name=UniqueUtil.getName("dom_display");
		this.hide_over=this._global_visible=true;
		this._layer=this._depth=0;
		this.use_canvas=false;
		this.filters=[];
	}
	
	get blendMode()
	{
		return this._blendMode;
	}
	
	set blendMode(str)
	{
		if(this._blendMode==str) return;
		this._blendMode=str ? str : 'normal';
		this.__checkDisplayUpdate();
	}
	
	get layer()
	{
		return this._layer || this._depth;
	}
	
	set layer(value) 
	{
        if(this._layer==value) return;
		this._layer=value;
    }
	
	get visible()
	{
		return this._visible;
	}
	
	set visible(value) 
	{
        if(this._visible==value) return;
		this._visible=value;
		
		if(this[_element]) 
			this[_element].style.display = (!this._visible || !this._global_visible) ? "none" : "";
    }
	
	get stage()
	{
		return this._stage;
	}
	
	set stage(value) 
	{
    	if(value==null) this._global_visible=true;
        if(this._stage==value) return;
		this._stage=value;
		
		if(value) {
			this._update_visible();
			this.updateMatrix=true;
		}

		this._display(value!=null);
    }
	
	get element()
	{
		return this[_element];
	}
	
	set element(value) 
	{
        if(this[_element]==value) return;
        let node;

        if(this[_element] && this[_element].parentNode){
        	node=this[_element].parentNode;
        	node.removeChild(this[_element]);
        }
        else if(this._stage) 
        	node=this._parent_node ? this._parent_node : this._stage.div;
        	
        if(value && value.parentNode){
        	value.parentNode.removeChild(value);
        }
        
		this[_element]=value;
		if(value==null) {
			this.width=this.height=0;
			return;
		}
		
		if(StringUtil.isEmpty(this[_element].id)) this[_element].id=this.name;
		this.width=(this[_element].width==undefined || typeof(this[_element].width)!="number") ? (StringUtil.isEmpty(this[_element].style.width) ? this.width : MathUtil.int(this[_element].style.width)) : this[_element].width;
		this.height=(this[_element].height==undefined || typeof(this[_element].height)!="number") ? (StringUtil.isEmpty(this[_element].style.height) ? this.height :MathUtil.int(this[_element].style.height)) : this[_element].height;
			
		if(node) node.appendChild(this[_element]);
    }
	
	get mask()
	{
		return this._mask;
	}
	
	set mask(value) 
	{
        if(this._mask && this._mask instanceof ShapeVO && this._mask!=value){
        	ObjectPool.remove(this._mask);
        }
        
		this._mask=value;
		this.__checkDisplayUpdate();
    }
	
	get parentNode()
	{
		return this._parent_node;
	}
	
	set parentNode(value) 
	{
        if(this._parent_node==value) return;
		this._parent_node=value;
		
		if(this[_element]==null || this[_element].parentNode==this._parent_node) return;
		
		if(this[_element] && this._stage) {
		   if(this[_element].parentNode) this[_element].parentNode.removeChild(this[_element]);
		   this._display(true);
	    }
    }
	
	render  (object)
	{
		if(this[_element]==null) return;
		this._depth=this._layer ? this._layer : (++DOMDisplay._depth_count);
		this._transform(object);
	}
	
	_render (){}
	
	/**
	 * 设置显示资源
	 * @param {Source|DisplayObject|Canvas|Image|Graphics|SVGElement|DivElement} target
	 */
	setInstance(target)
	{
		if(target==undefined || target==null || this.instance==target) {
			if(this.instance!=target) this.element = this.instance = null;
			return target;
		}
		
		let temp;
		this._rect=null;
		
	    if(target instanceof HTMLImageElement){
	    	target.style.display = "none";
	    	this.element=target;
	    }
	    else if(target instanceof HTMLCanvasElement){
	    	this.element=CanvasUtil.toImage(target);
	    }
	    else if(target instanceof DisplayObject){
	    	this.setInstance(target.canvas ? target.canvas : target.instance);
	    	this.param=target.param;
	    }
	    else if(target instanceof Source){
	    	this.register_point=ObjectPool.create(Point).set(target.regX,target.regY);
	    	this._rect=target;
	    	
	    	if(this[_element]==undefined) this.element=DOMUtil.createDOM("div",{id:this.name,style:{width:target.width+"px",height:target.height+"px",backgroundImage:"url(" + target.image.src+ ")",backgroundRepeat:"no-repeat"}});
	    	else if(this.instance.image!=target.image) {
	    		this[_element].style.backgroundImage="url(" + target.image.src+ ")";
	    	}
	    }
	    else if(target instanceof Graphics){
	    	this.setInstance(target.canvas);
	    }
	    else if(target instanceof HTMLDivElement){
	    	this.element=target;
	    }
	    else if(target instanceof SVGSVGElement){
	    	this.element=target;
	    }
	    else {
	    	trace("DOMDisplay:: set instance with a invalid value.",ClassUtil.getQualifiedClassName(target),"-",ObjectUtil.getType(target));
	    	return null;
	    }
	    
	    this.instance=target;
	    
	    if(this[_element] && this._stage){
	    	this._display(true);
	    }
	    
	    if(target instanceof Source) this._transform();
	    
	    this.updateMatrix=true;
	    this.__checkDisplayUpdate();
	    this.dispatchEvent(new Event(DisplayBase.RESET_INSTANCE));
	    return this.instance;
	}
	
	_transform(target)
	{
		let bool=(this._visible && this._global_visible);
		
		this[_element].style.display = bool ? "" : "none";
		if(!bool) return;
		
		const hasUpdate=(this.updateMatrix || this._refresh);
		const matrix=this.getMatrix(target,true);
		
		let prefix = Global.cssPrefix, isEmpty=StringUtil.isEmpty(prefix),
			origin = isEmpty ? "transformOrigin" : prefix + "TransformOrigin", 
			transform = isEmpty ? "transform" : prefix + "Transform";
		
		this[_element].style.position=Global.position;
	    this[_element].style.opacity = this._alpha*this._parent_alpha;
	    this[_element].style.overflow = this.hide_over ? "hidden" : "visible";
		this[_element].style.zIndex = Global.layer+this._depth;
		
		if(this._rect){
			this.width=this._rect.width;
			this.height=this._rect.height;
			this[_element].style.backgroundPosition = (-this._rect.x) + "px " + (-this._rect.y) + "px";
		}
		
		if(this._blendMode!=null){
			this[_element].style.mixBlendMode = this._blendMode;
		}
	
		if(hasUpdate){
			const arg1=this.width>0 ? 'width' : 'height';
			const arg2=arg1=='width' ? 'height' : 'width';
					
			this[_element].style[arg1]=(this[arg1]>0 ? this[arg1]+ "px" : "100%");
			
			if(this[arg2]<=0)
				this[arg2]=this[_element]['offset'+arg2.substring(0,1).toUpperCase()+arg2.substring(1)];
			
			this[_element].style[arg2] = (this[arg2]>0 ? this[arg2]+ "px": "100%");
			
			if(Global.supportTransform){
				this[_element].style[origin] = "0% 0%";//Math.round(this.register_point.x) + "px " + Math.round(this.register_point.y) + "px";
		    	this[_element].style.top=this[_element].style.left="0px";
		    	this[_element].style[transform] = this._get_transform_css(matrix);
		    }else{
		    	this[_element].style.top=matrix.ty+"px";
				this[_element].style.left=matrix.tx+"px";
		    }
		    this._refresh=false;
		}
		
		if(this._mask){
			let isDisplay=(typeof this._mask=="string" || this._mask instanceof ShapeVO);
			let isSource=(this._mask instanceof Source);
			
			if(isDisplay){
				this[_element].style[prefix + "ClipPath"] = this[_element].style["clipPath"] = "url(#"+(typeof this._mask=="string" ? this._mask : this._mask.id+ShapeVO.CILP)+ ")";
			}else{
				this[_element].style[prefix + "MaskImage"] =  "url("+(isSource ? this._mask.image : this._mask).src+ ")";
				this[_element].style[prefix + "MaskRepeat"] = "no-repeat";
				this[_element].style[prefix + "MaskPosition"] = matrix.tx + "px " + matrix.ty + "px";
			}
		}else{
			this[_element].style[prefix + "ClipPath"] = this[_element].style["clipPath"] = this[_element].style[prefix + "MaskImage"] =this[_element].style[prefix + "MaskPosition"] ='';
		}
		
		if(this.filters && this.filters.length>0){
			let filter;
			for (let i = 0, l = this.filters.length; i < l; i++)
			{
				filter=this.filters[i];
				if(filter==undefined) continue;
				filter.show(this[_element]);
			}
		}else{
			this[_element].style[Global.cssPrefix+'BoxShadow']=this[_element].style.textShadow='';
		}
	    
	    this[_element].style.cursor = (this._cursor==null) ? "" : this._cursor;
	    this[_element].style.pointerEvents = this.mouseEnabled ? "auto" : "none" ;
	}
	
	_get_transform_css(matrix)
	{
		return matrix.toCSS();
	}
	
	_update_visible()
	{
		if(this.parent==null) return;
		let bool=true,obj=this;
		
		for(obj=obj.parent; obj!=null; obj=obj.parent)
		{
			bool=(bool && obj.visible);
			if(!bool) break;
		}
		
		this._global_visible=bool;
	}
	
	hitTestPoint (x, y, usePolyCollision)
	{
		return CollisionUtil.hitTestPoint(this, x, y, this.usePolyCollision)>0;
	};
	
	hitTestObject (object, usePolyCollision)
	{
		return CollisionUtil.hitTestObject(this, object, this.usePolyCollision)>0;
	};
	
	_display(bool)
	{
		if(bool){
			try{
				if(this[_element] && this[_element].parentNode==null){
					(this._parent_node ? this._parent_node : (this.stage.div ? this.stage.div : this.stage.canvas.parentNode)).appendChild(this[_element]);
				}
			}
			catch(err){
				trace("[ERROR]DOMDisplay _display()",this.name,err.message);
			}
		}else{
			if(this[_element]) {
			   if(this[_element].parentNode) this[_element].parentNode.removeChild(this[_element]);
			   this[_element].style.display ="none";
		    }
		}
	}
	
	reset()
	{
		super.reset();
		
		if(this._parent){
			this.removeFromParent(false);
		}
		
		if(this[_element] && this[_element].parentNode) {
			this[_element].parentNode.removeChild(this[_element]);
		}
		
		if(this.instance && (this.instance instanceof Source) && this.instance.isClone){
			ObjectPool.remove(this.instance);
		}
		
		if(this._mask && this._mask instanceof ShapeVO ) ObjectPool.remove(this._mask);
		
		this._blendMode=this.instance=this._rect=this._mask=this._parent_node=this[_element]=null;
		this.hide_over=this._global_visible=true;
		this._layer=this._depth=0;
		this.use_canvas=false;
		this.filters=[];
	}
	
	dispose ()
	{
		super.dispose();
		delete this._blendMode,this.hide_over,this._global_visible,this.filters,this._layer,this.instance,this._rect,this._depth,this[_element],this._parent_node,this._mask;
	}
	
	toString()
	{
		return DOMDisplay.name;
	}
}

DOMDisplay._depth_count=0;
DOMDisplay.className="DOMDisplay";