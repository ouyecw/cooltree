
import DisplayObjectContainer from './DisplayObjectContainer.js'
import CollisionUtil from '../utils/CollisionUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import UniqueUtil from '../utils/UniqueUtil.js'
import ShapeUtil from '../utils/ShapeUtil.js'
import Rectangle from '../geom/Rectangle.js'
import MathUtil from '../utils/MathUtil.js'
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
		this._blendMode=this._rect=this._mask=null;
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
	
	/**
	 * 获取遮罩图形
	 */
	get mask()
	{
		return this._mask;
	}
	
	/**
	 * 设置遮罩图形
	 * @param {String|Rectangle} value
	 */
	set mask(value) 
	{
		if(!value) return;
        this._mask=value;
        this.maskRect=(this._mask && typeof this._mask =="string") ? ShapeUtil.getPathBounds(this._mask) : null;
        
        this.updateMatrix=true;
    	this.autoSize=false;

    	this.width=Math.ceil(this.maskRect.width);
    	this.height=Math.ceil(this.maskRect.height);
    }
	
	render(target,object)
	{
		if(this._children==undefined || this._children.length==0 || !this.visible) return;
		const matrix=this.getMatrix(target,true);
		
		if(this._mask){
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
			if(this._mask instanceof Rectangle)  (target || this.stage.graphics).drawPath(points,true);
			else this.drawShape(target || this.stage.graphics,this._mask,obj);
	
			(target ? target.context : this.stage.context).clip();
			ObjectPool.remove(obj.center);
			obj.center=null;
		}
		
		
		let i,len;
		len=this._children.length;
		
		for (i=0; i < len; i++) {
			this._children[i].render.apply(this._children[i],[target,false,object]);
		}
		
		if(this._mask){
			(target ? target.context : this.stage.context).restore();
		}
	}

	drawShape(target,path,offset)
	{
		const pts=ShapeUtil.getPathBounds(path,true);
		Point.matrix(pts,offset);
		target.drawSVGPath(path,pts);
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
		if(this._mask && this._mask instanceof Rectangle) {
			ObjectPool.remove(this._mask);
		}
		
		if(this._rect){
			ObjectPool.remove(this._rect);
		}
		
		super.reset();
		this._blendMode=this._rect=this._mask=null;
	}
	
	dispose()
	{
		super.dispose();
		delete this._blendMode,this._mask,this._rect;
	}
}

Sprite.className="Sprite";
module.exports = Sprite;