import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import DisplayBase from '../display/DisplayBase.js'
import StageEvent from '../events/StageEvent.js'
import DoubleClick from '../utils/DoubleClick.js'
import Global from '../core/Global.js'
import Point from '../geom/Point.js'
import QuickUI from '../utils/QuickUI.js'
import DisplayUtil from '../utils/DisplayUtil.js'
import MathUtil from '../utils/MathUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import UIContainer from '../ui/UIContainer.js'
import Stage from '../display/Stage.js'
import Factory from '../core/Factory.js'
import Event from '../events/Event.js'

/**
 * @class
 * @module Transformer
 * @extends DisplayObjectContainer
 */
export default class Transformer extends DisplayObjectContainer
{
	constructor()
	{
		super();
		
		/**
		 * 需要绘制线框时 线框的宽度
		 */
		this.lineWidth=2;
		
		/**
		 * 默认按钮的半径
		 */
		this.round=16;
		
		/**
		 * 是否移动端支持手指缩放旋转
		 */
		this.support_finger=true;
		
		/**
		 * 是否允许拖拽旋转对象角度
		 */
		this.rotate=true;
		
		/**
		 * 是否允许键盘方向键微调操控（PC端）
		 */
		this.key_control=true;
		
		/**
		 * 是否允许鼠标滚轮缩放（PC端）
		 */
		this.wheel_control=true;
		
		/**
		 * 是否允许拖拽变形拉伸对象（前提是this.rotate为false）
		 */
		this.is_free=false;
		
		/**
		 * 相对坐标的百分比 默认中心点
		 */
		this.pos_percent={x:0.5,y:0.5};
		
		/**
		 * 相对转换数据 {rotation:0,scaleX:1,scaleY:1}
		 */
		this.relative_data;
		
		/**
		 * 缩放的最小值
		 */
		this.min_size=0;
	
		/**
		 * 调节坐标差值
		 */
		this.adjust_pos=null;
		
		this._min_scale=this._point1=this._point2=this._finger_center=this._center=this._target=this._btn=this._redraw=this._canvas=this._color=this._point=null;
		this._target_center=this._move_point=this._target_angle=this._target_rotation=this._target_scaleX=this._target_scaleY=this._target_distance=this._target_offsetX=this._target_offsetY=null;
		this._cache_point={x:0,y:0};
		this._double_finger=false;
		this._has_key_down=false;
		this.mouseEnabled=true;
		this._state=0;
	}
	
	get target()
	{
		return this._target;
	}
	
	set target(value) 
	{
    	if(this._target==value) return;
		
		if(this._target && this._target instanceof UIContainer){
			this._target.resizeMask(this._target.width,this._target.height);
		}
		
        this._target=value;
        this.visible=(value!=null);
        
        if(this._target && (this._target instanceof DisplayBase)) this._init_transformer();
        else this._clear_transformer();
        this.update_relative_data();
    }
	
	/**
	 * 设置
	 * @param {DisplayBase} target 需要变形对象
	 * @param {Button}      btn    控制变形按钮
	 * @param {Boolean}     redraw 是否绘制线框
	 * @param {String}      color  绘制线框颜色
	 */
	setup(target,btn,redraw,color="#888888")
	{
		this._btn=(btn || QuickUI.getButton(this.round));
		this._redraw=Boolean(redraw);
		this._color=color;
		this.target=target;
	}
	
	update_relative_data(bool)
	{
		if(!this._target || !this._target.parent) return;
		this.relative_data=this._target.parent.getMatrix().applyDisplay();
		this.relative_data.radians=MathUtil.getRadiansFromDegrees(this.relative_data.rotation);
		
		if(bool) return;
		this.sync_display();
	}
	
	sync_display()
	{
		if(!this._target || !this._target.parent) return;
		DisplayUtil.copyTransform(this._target,this._canvas,this.relative_data,true);
		this._btn.moveTo(this.globalToLocal(this._canvas.localToGlobal(this._point.x,this._point.y)));
		this._canvas.thickness=(this.lineWidth*2/(this._canvas.scaleX+this._canvas.scaleY));
		this._canvas.resize=true;
	}
	
	_update_target_size()
	{
		this._target_rect=this._target.getBounds(this._target);
		
		if(this.adjust_pos && this.adjust_pos.x) this._target_rect.x+=this.adjust_pos.x;
		if(this.adjust_pos && this.adjust_pos.y) this._target_rect.y+=this.adjust_pos.y;
		
		if(this._canvas==undefined) this._canvas=Factory.c("bs");
		this._canvas.setup("#FFFFFF",this._target.width,this._target.height,0,this._redraw ? this.lineWidth :0,this._color,0);
		if(Global.useCanvas) this._canvas.instance.moveTo(-this.lineWidth*0.5,-this.lineWidth*0.5);
		
		if(!this._point) this._point = ObjectPool.create(Point);
		this._point.set(this._target_rect.x + this._target_rect.width,  this._target_rect.y + this._target_rect.height);
		
		if(!this._center) this._center = ObjectPool.create(Point);
		this._center.set(this._target_rect.x + this._target_rect.width*this.pos_percent.x,  this._target_rect.y + this._target_rect.height*this.pos_percent.y);
		
		this._canvas.thickness=(this.lineWidth*2/(this._canvas.scaleX+this._canvas.scaleY));
		this._canvas.resize=true;
		
		if(this.min_size>0) this._min_scale=MathUtil.format(this.min_size/Math.min(this._target_rect.width,this._target_rect.height));
	}
	
	_init_transformer()
	{
		this._clear_transformer();
		this._update_target_size();
		
		if(!this.contains(this._canvas)) this.addChild(this._canvas);
		this._canvas.syncSize=true;
		
		this._canvas.usePolyCollision=true;
		this._canvas.mouseEnabled=true;
		this._canvas.breakTouch=true;
		
		if(!this.contains(this._btn)) {
			this._btn.breakTouch=true;
			this.addChild(this._btn);
		}
		
		this._btn.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._trans_mouse_down,this),this.name);
	    this._canvas.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._drag_mouse_down,this),this.name);
	
		this._canvas.matrix=this._target.matrix;
		this._btn.moveTo(this.globalToLocal(this._canvas.localToGlobal(this._point.x,this._point.y)));
		
		if(Global.isPC){
			if(this.wheel_control) this._canvas.addEventListener(StageEvent.MOUSE_WHEEL, Global.delegate(this._mouse_wheel_handle,this),this.name);
			if(this.key_control)   (this.stage ? this.stage : Stage.current).addEventListener(StageEvent.KEY_DOWN,Global.delegate(this._key_down,this),this.name);
		}
	}
	
	_mouse_wheel_handle(e)
	{
		if(!this.wheel_control) return;
		let sca=Math.max(this._min_scale,Math.abs(this._canvas.scaleX+e.delta*0.05));
		let dot=this._canvas.globalToLocal(e.mouseX,e.mouseY);
	
		this._canvas.scale=sca;
		dot=this._canvas.localToGlobal(dot);
		
		let poi=ObjectPool.create(Point).set(MathUtil.format(this._canvas.x+e.mouseX-dot.x),MathUtil.format(this._canvas.y+e.mouseY-dot.y));
		this._canvas.moveTo(poi);
		
		DisplayUtil.copyTransform(this._canvas,this._target,this.relative_data);
		this._canvas.thickness=(this.lineWidth*2/(this._canvas.scaleX+this._canvas.scaleY));
		
		this._btn.moveTo(this.globalToLocal(this._canvas.localToGlobal(this._point.x,this._point.y)));
		this.dispatchEvent(new Event(Transformer.SCALE));
		ObjectPool.remove(poi);
	}
	
	_key_up(e)
	{
		if(this._has_key_down) {
			(this.stage ? this.stage : Stage.current).removeEventListener(StageEvent.KEY_UP,null,this.name);
			this.dispatchEvent(new Event(Transformer.MOVE));
		}
		
		this._has_key_down=false;
	}
	
	_key_down(e)
	{
		if(this.stage==null || this._target==null || !(this._target instanceof DisplayBase) || e==undefined || e.target!=this._canvas) return;
		
		let bool=false;
		switch(e.params){
			case 37:
			bool=true;
			this._canvas.x-=1;
			break;
			
			case 38:
			bool=true;
			this._canvas.y-=1;
			break;
			
			case 39:
			bool=true;
			this._canvas.x+=1;
			break;
			
			case 40:
			bool=true;
			this._canvas.y+=1;
			break;
			
			case 46:
			this.dispatchEvent(new Event(Transformer.DELETE));
			return;
		}
		
		if(bool) {
			this._has_key_down=true;
			this._drag_mouse_move(null);
			(this.stage ? this.stage : Stage.current).addEventListener(StageEvent.KEY_UP,Global.delegate(this._key_up,this),this.name);
			
			if(e.label) {
				e.label.preventDefault();
				e.label.stopPropagation();
			}
		}
	}
	
	_drag_mouse_down(e)
	{
		this._double_finger=(e.length==2);
		this._state=(this.support_finger && this._double_finger ? 3 : 1);
		
		if(this.support_finger && this._double_finger){
			this._point1=e.touchs[0];
			this._point2=e.touchs[1];
			
			this._target_scaleX = this._canvas.scaleX;
			this._target_scaleY = this._canvas.scaleY;
			
			this._target_rotation=this._canvas.rotation;
			this._target_angle=MathUtil.getAngle(this._point1.mouseX,this._point1.mouseY,this._point2.mouseX,this._point2.mouseY);
			
			this._finger_center=ObjectPool.create(Point).set((this._point1.mouseX+this._point2.mouseX)*0.5,(this._point1.mouseY+this._point2.mouseY)*0.5);
		    this._finger_center=this._canvas.globalToLocal(this._finger_center);
			
		    this._target_distance=Math.sqrt((this._point1.mouseX-this._point2.mouseX)*(this._point1.mouseX-this._point2.mouseX)+(this._point1.mouseY-this._point2.mouseY)*(this._point1.mouseY-this._point2.mouseY));
		}
		else {
			this._cache_point.x=this._canvas.x;
			this._cache_point.y=this._canvas.y;
			(this.stage ? this.stage : Stage.current).startDrag(this._canvas);
		}
		
		(this.stage ? this.stage : Stage.current).addEventListener(StageEvent.MOUSE_UP, Global.delegate(this._drag_mouse_up,this),this.name);
		(this.stage ? this.stage : Stage.current).addEventListener(StageEvent.MOUSE_MOVE, Global.delegate(this._drag_mouse_move,this),this.name);
	}
	
	_drag_mouse_move(e)
	{
		if(!this.support_finger || !this._double_finger){
			this._target.moveTo(this._target.parent.globalToLocal(this._canvas.localToGlobal(0,0)));
			this._btn.moveTo(this.globalToLocal(this._canvas.localToGlobal(this._point.x,this._point.y)));
			return;
		}
		
		if(e.length!=2) return;
		if((this._point1.id!=e.touchs[0].id && this._point2.id!=e.touchs[1].id) && (this._point1.id!=e.touchs[1].id && this._point2.id!=e.touchs[0].id)) return;
			
		if(this._point1.id!=e.touchs[0].id){
			this._point1=e.touchs[1];
			this._point2=e.touchs[0];
		}else{
			this._point1=e.touchs[0];
			this._point2=e.touchs[1];
		}
		
		// if(this.rotate){
			let rad = MathUtil.getAngle(this._point1.mouseX,this._point1.mouseY,this._point2.mouseX,this._point2.mouseY);
			this._canvas.rotation=MathUtil.format(this._target_rotation+MathUtil.getDegreesFromRadians(rad-this._target_angle));
		// }
		
		let offX,offY,dis,cen,nce,poi;
		dis= Math.sqrt((this._point1.mouseX-this._point2.mouseX)*(this._point1.mouseX-this._point2.mouseX)+(this._point1.mouseY-this._point2.mouseY)*(this._point1.mouseY-this._point2.mouseY));
		offX=offY= dis/this._target_distance;
		
		offX=Math.max(this._min_scale,MathUtil.format(this._target_scaleX*offX));
		offY=Math.max(this._min_scale,MathUtil.format(this._target_scaleY*offY));
	
		this._canvas.scaleX=offX;
		this._canvas.scaleY=offY;
		
		cen = this._canvas.localToGlobal(this._finger_center.x,this._finger_center.y);
		nce = ObjectPool.create(Point).set((this._point1.mouseX+this._point2.mouseX)*0.5,(this._point1.mouseY+this._point2.mouseY)*0.5);
		poi = ObjectPool.create(Point).set(MathUtil.format(this._canvas.x+nce.x-cen.x),MathUtil.format(this._canvas.y+nce.y-cen.y));
	
		this._canvas.moveTo(poi);
		DisplayUtil.copyTransform(this._canvas,this._target,this.relative_data);
		this._btn.moveTo(this.globalToLocal(this._canvas.localToGlobal(this._point.x,this._point.y)));
		this.dispatchEvent(new Event(Transformer.SCALING));
		
		ObjectPool.remove(nce);
		ObjectPool.remove(poi);
	}
	
	_trans_mouse_down(e)
	{
		this._target_center=this._canvas.localToGlobal(this._center.x,this._center.y);
		this._move_point=this._canvas.localToGlobal(this._point.x,this._point.y);
		
		this._target_distance=Point.distance(this._target_center,this._move_point);
		this._target_rotation=this._canvas.rotation;
		this._target_angle=MathUtil.getAngle(this._target_center.x,this._target_center.y,this._move_point.x, this._move_point.y);
		
		if(!this.rotate && this.is_free && this.relative_data && this.relative_data.radians!=0){
			Point.rotate(this._move_point,this.relative_data,this.relative_data.radians,true);
		}
		
		this._target_scaleX = this._canvas.scaleX;
		this._target_scaleY = this._canvas.scaleY;
		
		this._target_offsetX = Math.max( 0, this._move_point.x-this._target_center.x);
		this._target_offsetY = Math.max( 0, this._move_point.y-this._target_center.y);
		
		(this.stage ? this.stage : Stage.current).addEventListener(StageEvent.MOUSE_UP, Global.delegate(this._drag_mouse_up,this),this.name);
		(this.stage ? this.stage : Stage.current).addEventListener(StageEvent.MOUSE_MOVE, Global.delegate(this._trans_mouse_move,this),this.name);
	}
	
	_trans_mouse_move(e)
	{
		let pos = ObjectPool.create(Point).set(e.mouseX, e.mouseY);
		
		if(this.rotate){
			let rad = MathUtil.getAngle(this._target_center.x,this._target_center.y,pos.x, pos.y);
			this._canvas.rotation=MathUtil.format(this._target_rotation+MathUtil.getDegreesFromRadians(rad-this._target_angle));
		}
		
		let offX,offY,dis;
		if(!this.rotate && this.is_free){
			
			if(this.relative_data && this.relative_data.radians!=0){
				Point.rotate(pos,this.relative_data,this.relative_data.radians,true);
			}
			
			offX=Math.max( 0, (pos.x-this._target_center.x))/this._target_offsetX;
			offY=Math.max( 0, (pos.y-this._target_center.y))/this._target_offsetY;
		}
		else {
			dis= Point.distance(this._target_center,pos);
			offX=offY= dis/this._target_distance;
		}
		
		offX=Math.max(this._min_scale,MathUtil.format(this._target_scaleX*offX));
		offY=Math.max(this._min_scale,MathUtil.format(this._target_scaleY*offY));
		
		if(!(!this.rotate && this.is_free && (offX==this._min_scale || offY==this._min_scale))){
			this._canvas.scaleX=offX;
			this._canvas.scaleY=offY;
			
			if(this._redraw) this._canvas.thickness=(this.lineWidth*2/(offX+offY));
		}
		
		let cen = this._canvas.localToGlobal(this._center.x,this._center.y);
		this._btn.moveTo(!this.rotate || offX==this._min_scale || offY==this._min_scale ? this.globalToLocal(this._canvas.localToGlobal(this._point.x,this._point.y)) : this.globalToLocal(e.mouseX, e.mouseY));
		this._canvas.moveTo(MathUtil.format(this._canvas.x+this._target_center.x-cen.x),MathUtil.format(this._canvas.y+this._target_center.y-cen.y));
		DisplayUtil.copyTransform(this._canvas,this._target,this.relative_data);
		this._state=2;
		
		ObjectPool.remove(pos);
		this.dispatchEvent(new Event(Transformer.SCALING));
	}
	
	_drag_mouse_up(e)
	{
		(this.stage ? this.stage : Stage.current).stopDrag();
		(this.stage ? this.stage : Stage.current).removeEventListener(StageEvent.MOUSE_UP, null,this.name);
		(this.stage ? this.stage : Stage.current).removeEventListener(StageEvent.MOUSE_MOVE, null,this.name);
		this._finger_center,this._point1=this._point2=this._target_center=this._move_point=this._target_scaleX = this._target_scaleY = this._target_distance=this._target_rotation=this._target_angle=null;
	    
	    if(this._state==1 && DoubleClick.check()) this.dispatchEvent(new Event(Transformer.DOUBLE_CLICK));
	    else if(this._state==1 && Math.sqrt((this._cache_point.x-this._canvas.x)*(this._cache_point.x-this._canvas.x)+(this._cache_point.y-this._canvas.y)*(this._cache_point.y-this._canvas.y))<3) this.dispatchEvent(new Event(Transformer.CLICK));
	    else if(this._state>0) this.dispatchEvent(new Event(this._state==1 ? Transformer.MOVE : Transformer.SCALE));
	
	    this._state=0;
	}
	
	_clear_transformer()
	{
		if(this._canvas) {
			if( this.contains(this._canvas))this._canvas.removeFromParent(false);
		 	this._canvas.removeEventListener(StageEvent.MOUSE_DOWN,null,this.name);
		 	
		 	if(Global.isPC && this.wheel_control) 
		 		this._canvas.removeEventListener(StageEvent.MOUSE_WHEEL, null,this.name);
		 	
		 	this._canvas.reset();
		}
		  
		if(this._btn){
			this._btn.removeEventListener(StageEvent.MOUSE_DOWN,null,this.name);
			if(this.contains(this._btn)) this._btn.removeFromParent(false);
		}
		
		if(Global.isPC && this.key_control && (this.stage ? this.stage : Stage.current).hasEventListener(StageEvent.KEY_DOWN,this.name)){
			(this.stage ? this.stage : Stage.current).removeEventListener(StageEvent.KEY_DOWN,null,this.name);
			(this.stage ? this.stage : Stage.current).removeEventListener(StageEvent.KEY_UP,null,this.name);
		}
		
		this._drag_mouse_up(null);
	}
	
	dispose()
	{
		super.dispose();
		delete this._finger_center,this._double_finger,this._point1,this._point2,this._cache_point,this._state,this.relative_data,this._center,this._color,this._target,this._btn,this._redraw,this._canvas;
		delete this.support_finger,this._min_scale,this.min_size,this.wheel_control,this._has_key_down,this.key_control,this.is_free,this.pos_percent,this.rotate,this.round,this.lineWidth,this._target_center,this._move_point,this._target_angle,this._target_rotation,this._target_scaleX,this._target_scaleY,this._target_distance,this._target_offsetX,this._target_offsetY;
	}
}

Transformer.className="Transformer";
Transformer.MOVE="transformer_move";
Transformer.SCALE="transformer_scale";
Transformer.CLICK="transformer_click";
Transformer.DELETE="transformer_delete";
Transformer.SCALING="transformer_scaling";
Transformer.DOUBLE_CLICK="transformer_double_click";
	
