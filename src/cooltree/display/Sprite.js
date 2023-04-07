import DisplayObjectContainer from './DisplayObjectContainer.js'
import CollisionUtil from '../utils/CollisionUtil.js'
import UniqueUtil from '../utils/UniqueUtil.js'
import Rectangle from '../geom/Rectangle.js'
import DOMUtil from '../utils/DOMUtil.js'
import ShapeVO from '../model/ShapeVO.js'
import ObjectPool from '../utils/ObjectPool.js'
import MathUtil from '../utils/MathUtil.js'
import DOMDisplay from './DOMDisplay.js'
import Global from '../core/Global.js'
import SVGLabel from '../type/SVGLabel.js'
import DefsNode from './DefsNode.js'
import Point from '../geom/Point.js'

/**
 * @class
 * @module Sprite
 * @extends DisplayObjectContainer
 */
export default class Sprite extends DisplayObjectContainer
{
	constructor()
	{
		super();
		this.name=UniqueUtil.getName("sprite");
		this._blendMode=this._defs=this._rect=this._mask=this.div=null;
	}
	
	get blendMode()
	{
		return this._blendMode;
	}
	/**
	 * Blend模式
	 * display/BlendMode
	 * @param {String} str
	 */
	set blendMode(str)
	{
		if(this._blendMode==str) return;
		this._blendMode=str;
		this.__checkDisplayUpdate();
	}
	
	/**
	 * 获取遮罩矩形区域
	 */
	get maskRect()
	{
		return (this._mask ? (this._mask instanceof Rectangle ? this._mask : this._rect) : null);
	}
	
	/**
	 * 设置遮罩矩形区域
	 * @param {Rectangle} value
	 */
	set maskRect(value) 
	{
		if(value) {
			this._rect=new Rectangle(value.x,value.y,value.width,value.height);
			this.setSize(this._rect.width,this._rect.height);
		}
		else this._rect=value;
	}
	
	get defs()
	{
		if(!this._defs && !this.use_canvas){
			this._defs=ObjectPool.create(DefsNode).init();
			this.addChild(this._defs);
		}
		return this._defs;
	}
	
	get parentNode()
	{
		return this._parentNode;
	}
	
	set parentNode(value) 
	{
        if(this._parentNode==value) return;
		this._parentNode=value;
		
		if(this._parentNode && this.div){
			if(this.div.parentNode) this.div.parentNode.removeChild(this.div);
			this._parentNode.appendChild(this.div);
		}
	}
	
	get parent()
	{
		return this._parent;
	}
	
	set parent(value) 
	{
        if(this._parent==value) return;
		this._parent=value;
		
		if(this.use_canvas) return;
		
		if(this._parent==undefined){
			if(this.div && this.div.parentNode) this.div.parentNode.removeChild(this.div);
			return;
		}

		if(this.div==undefined){
			this.div=DOMUtil.createDOM("div",{id: "sprite_"+this.name});
		}
		
		this.div.style.position=Global.position;
		let node=this._parentNode ? this._parentNode : (this._parent.parentNode ? this._parent.parentNode : (this._parent.div ? this._parent.div : (this.stage ? this.stage.div : null)));
		if(node) node.appendChild(this.div);
		
		if(this._mask && (this._mask instanceof Rectangle) && this.div){
			this.width=Math.ceil(this._mask.width);
    		this.height=Math.ceil(this._mask.height);
    	
    		this.div.style.width=this.width+"px";
    		this.div.style.height=this.height+"px";
    		this.div.style.overflow="hidden";
    	}
    }
	
	/**
	 * 获取遮罩图形
	 */
	get mask()
	{
		return this._mask;
	}
	
	/**
	 * 设置遮罩图形
	 * @param {ShapeVO|Rectangle} value
	 */
	set mask(value) 
	{
    	if(value && (value instanceof ShapeVO)) {
        	value=([SVGLabel.RECT,SVGLabel.CIRCLE,SVGLabel.ELLIPSE,SVGLabel.POLYGON,SVGLabel.PATH].indexOf(value.type)<0 ? null : value);
    	}
    	
        if(this._mask && this._mask!=value && (this._mask instanceof Rectangle) && this.div) {
        	this.div.style.overflow="auto";
        	ObjectPool.remove(this._mask);
        }
        
        if(this._mask && (this._mask instanceof ShapeVO) && this._mask!=value) {
        	if(!this.use_canvas) this.defs.removeClipPath(this._mask);
        	ObjectPool.remove(this._mask);
        }
        
        let bool=(this._mask!=null && this._mask!=undefined && this._mask!='');
        
        this._mask=value;
        this.maskRect=(this._mask && (this._mask instanceof ShapeVO) && this._mask.rect ? this._mask.rect : null);
        
        if(this._mask && (this._mask instanceof ShapeVO) && !this.use_canvas){
        	this.defs.addClipPath(this._mask);
        }
        
        this.updateMatrix=true;
        if(!this._mask || !(this._mask instanceof Rectangle)) {
        	if(!this._mask && bool) {
        		if(!this.use_canvas) this.x+=0.00001;
        		this.__checkDisplayUpdate();
        	}
        	return;
        }
        
    	this.autoSize=false;
    	this.width=Math.ceil(this._mask.width);
    	this.height=Math.ceil(this._mask.height);
    	
    	if(this.use_canvas) return;
		this._mask.x=this._mask.y=0;
		if(this.div==undefined) return;
		this.div.style.overflow="hidden";
		this.div.style.width=this.width+"px";
		this.div.style.height=this.height+"px";
    }
	
	get stage()
	{
		return this._stage;
	}
	
	set stage(value) 
	{
        if(this._stage==value) return;
		this._stage=value;
		
		let node=(this._parentNode ? this._parentNode : (this._parent && this._parent.parentNode ? this._parent.parentNode : (this._parent && this._parent.div ? this._parent.div : (this.stage ? this.stage.div : null))));
		if(this.div) {
			if(this.div.parentNode && (!value || (node && this.div.parentNode!=node))) this.div.parentNode.removeChild(this.div);
			if(node && !this.div.parentNode && value && this._parent) node.appendChild(this.div);
		}
	
		if(this._children==undefined || this._children.length<1) return;
		let i,c,l;
		for (i = 0,l=this._children.length;i<l;i++) {
			c = this._children[i];
			c.stage=value;
		}
    }
	
	addChildAt(displayObject,index)
	{
		let obj=super.addChildAt(displayObject,index);
		if(this.use_canvas) return obj;
		
		if(this.div==undefined){
			this.div=DOMUtil.createDOM("div",{id: "sprite_"+this.name});
		}
		
		if(obj) obj.parentNode=this.div;
		return obj;
	}
	
	render(target,object)
	{
		if(this._children==undefined || this._children.length==0) return;
		
		if(!this.visible){
			if(this.div) this.div.style.display="none";
			return;
		}
		
		const has_change=(this.updateMatrix || this._refresh);
		const matrix=this.getMatrix(target,true);
		
		if(this._mask && this.use_canvas){
			let points,obj=(object ? this.getMatrix(object) : matrix).applyDisplay();
			obj.center=ObjectPool.create(Point);
			
			if(this._mask instanceof Rectangle) {
				let copy=this._mask.clone();
				copy.multiply(obj.scaleX,obj.scaleY);
				let radians=MathUtil.getRadiansFromDegrees(obj.rotation);
				points=copy.rotation(radians,obj.center,obj,obj.scaleX<0,obj.scaleY<0);
				ObjectPool.remove(copy);
			}
			
			(target ? target.context : this.stage.context).save();
			if(this._mask instanceof Rectangle)  (target ? target : this.stage.graphics).drawPath(points,true);
			else if(this._mask instanceof ShapeVO) (target ? target : this.stage.graphics).drawShape(this._mask,obj);
	
			(target ? target.context : this.stage.context).clip();
			ObjectPool.remove(obj.center);
			obj.center=null;
		}
		
		if(!this.use_canvas){
			DOMDisplay._depth_count++;
			
			if(this.div){
				if(this.div.style.display!="") this.div.style.display="";
				this.div.style.zIndex = Global.layer+DOMDisplay._depth_count;
				
				if(this._blendMode!=null){
					this.div.style.mixBlendMode = this._blendMode ? this._blendMode : 'normal';
				}
				
				if(has_change){
					this._refresh=false;
					const prefix = Global.cssPrefix,
						transform = (prefix==="" ? "transform" : prefix + "Transform"),
						origin = (prefix==="" ? "transformOrigin" : prefix + "TransformOrigin");
			
					this.div.style[prefix + "ClipPath"] = this.div.style["clipPath"] = (this._mask && this._mask instanceof ShapeVO ? "url(#"+this._mask.id+ShapeVO.CILP+ ")" : "");
				
					if(Global.supportTransform){
						this.div.style[origin] = "0% 0%";
						this.div.style.top=this.div.style.left="0px";
				    	this.div.style[transform] = matrix.toCSS();
				    }else{
				    	this.div.style.top=matrix.ty+"px";
						this.div.style.left=matrix.tx+"px";
				    }
				}
			}
		}
		
		let i,len;
		len=this._children.length;
		
		for (i=0; i < len; i++) {
			this._children[i].render.apply(this._children[i],(!this.use_canvas ? [this] : [target,false,object]));
		}
		
		if(this._mask && this.use_canvas){
			(target ? target.context : this.stage.context).restore();
		}
	}
	
	getObjectUnderPoint (x, y, usePixelTrace,all) 
	{
		if(this.maskRect && this._checkTouch(x, y, usePixelTrace)) return null;
		return super.getObjectUnderPoint(x, y, usePixelTrace,all);
	}
	
	hitTestPoint (x,y, usePixelTrace) 
	{
		if(this.maskRect && this._checkTouch(x, y,usePixelTrace)) return false;
		return super.hitTestPoint(x, y, usePixelTrace);
	}
	
	_checkTouch(x,y,usePixelTrace)
	{
		let bounds=this.maskRect.clone();
		let obj=this.getMatrix().applyDisplay();
		bounds.multiply(obj.scaleX,obj.scaleY);
		let data,radians=MathUtil.getRadiansFromDegrees(obj.rotation);
		
		if(usePixelTrace){
			data=Rectangle.rectangleByRadians(bounds,radians,null,obj,obj.scaleX<0,obj.scaleY<0);
			ObjectPool.remove(bounds);
		}else if(radians==0){
			bounds.x=obj.x;
			bounds.y=obj.y;
			data=bounds;
		}else{
			let points=bounds.rotation(radians,null,obj,obj.scaleX<0,obj.scaleY<0);
			data=Rectangle.createRectangle(points[0],points[1],points[2],points[3]);
			ObjectPool.remove(bounds);
		}
		
		return CollisionUtil.hitTestPoint(data, x, y,usePixelTrace)<0;
	}
	
	/**
	 * 重置实例数据
	 */
	reset()
	{
		if(this._mask && this._mask instanceof ShapeVO) {
			ObjectPool.remove(this._mask);
		}
		
		if(this.div && this.div.parentNode){
			this.div.parentNode.removeChild(this.div);
		}
		
		if(this._rect){
			ObjectPool.remove(this._rect);
		}
		
		super.reset();
		this._blendMode=this._defs=this._rect=this._mask=this.div=null;
	}
	
	dispose()
	{
		super.dispose();
		delete this._blendMode,this._defs,this._mask,this.div,this.svg,this._rect;
	}
}

Sprite.className="Sprite";