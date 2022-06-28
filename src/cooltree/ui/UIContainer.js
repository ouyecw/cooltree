
import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import UIOrientation from '../model/UIOrientation.js'
import DisplayBase from '../display/DisplayBase.js'
import TweenLite from '../transitions/TweenLite.js'
import StageEvent from '../events/StageEvent.js'
import Rectangle from '../geom/Rectangle.js'
import MathUtil from '../utils/MathUtil.js'
import Event from '../events/Event.js'
import Global from '../core/Global.js'
import Point from '../geom/Point.js'
import UIBase from './UIBase.js'

/**
 * @class
 * @module UIContainer
 * @extends UIBase
 */
export default class UIContainer extends UIBase
{
	constructor()
	{
		super();
		
		/**
		 * 超出范围后 弹回的时间
		 */
		this.back_time=0.16;
		
		/**
		 * 允许超出范围的百分比
		 */
		this.out_percent=0.5;
		
		/**
		 * 时间系数 越大惯性移动越平滑
		 */
		this.time_ratio=0.0014;
		
		/**
		 * 惯性移动的速度系数 越大越敏感
		 */
		this.inertia_ratio=1.2;
		
		/**
		 * 惯性移动的长度 最大与最小值
		 */
		this.min_migration_length=1;
		this.max_migration_length=10;
		
		/**
		 * 缓动效果
		 */
		this.back_ease="easeoutquad";
		
		this._orientation=0;
		this._overflow=false;
		
		this._press_point=null;
		this._drag_area=null;
		this._inertia=false;
		this._drag_time=0;
		
		this._initial_width=this._initial_height=this._mask_width=this._mask_height=0;
	}
	
	/**
	 * 设置显示范围
	 * @param {Number} w
	 * @param {Number} h
	 * @param {Number} orientation (UIOrientation) 允许拖拽的方向
	 * @param {Boolean} overflow 是否支持超出范围拖拽
	 * @param {Boolean} inertia  是否支持拖拽惯性移动
	 */
	setDimension(w,h,orientation,overflow,inertia)
	{
		this._initial_width=this._mask_width=w;
		this._initial_height=this._mask_height=h;
		
		this._inertia=inertia;
		this._overflow=overflow;
		this.max_migration_length=Math.floor(Math.max(w,h)*1.2);
		
		if(orientation!=undefined) this._orientation=orientation;
		if(this._register_instance!=undefined) this._control_orientation();
	}
	
	initialize()
	{	
		if(this._register_instance && (this._register_instance instanceof DisplayObjectContainer)) this._register_instance._updateSize();
		if(this._register_instance!=undefined && this._mask_width>0 && this._mask_height>0) this._control_orientation();
	}
	
	_control_orientation()
	{	
		if(this._mask_width>0 && this._mask_height>0) {
			let rect=this._mask ? this._mask : new Rectangle();
			rect.height=this._mask_height;
			rect.width=this._mask_width;
			this.mask=rect;
		}
		
		if(this._orientation==0) return;
		this._register_instance.addEventListener(DisplayBase.RESIZE,Global.delegate(this._reset_hold_control,this),this.name);
		this._reset_hold_control(null);
	}
	
	_reset_hold_control(e)
	{
		let bool=(((this._orientation==UIOrientation.isX || this._orientation==UIOrientation.isXY) && this._register_instance.width>this._mask_width) || ((this._orientation==UIOrientation.isY || this._orientation==UIOrientation.isXY) && this._register_instance.height>this._mask_height));
		this.mouseEnabled=this._register_instance.mouseEnabled=bool;
		
		if(bool) {
			if(!this._register_instance.hasEventListener(StageEvent.MOUSE_DOWN))
				this._register_instance.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._mouse_drag_handler,this),this.name);
	    }
		else {
			this._register_instance.removeEventListener(StageEvent.DRAG_MOVE,null,this.name);
			this._register_instance.removeEventListener(StageEvent.MOUSE_DOWN,null,this.name);
		}
	}
	
	_mouse_drag_handler(e)
	{
		let pos=this.localToGlobal(0,0);
		let pos2=this._register_instance.localToGlobal(0,0);
		
		let w=(this._orientation==UIOrientation.isY) ? 0 : Math.max(0,this._register_instance.getWidth()-this._mask_width);
		let h=(this._orientation==UIOrientation.isX) ? 0 : Math.max(0,this._register_instance.getHeight()-this._mask_height);
	
	    let free;
	    if(this._overflow){
	    	free=new Rectangle(w>0 ? pos.x-w : pos2.x,h>0 ? pos.y-h : pos2.y,w,h);
	    }
	    
		w=w>0 ? w+(this._overflow ? this._mask_width*this.out_percent : 0) : 0;
		h=h>0 ? h+(this._overflow ? this._mask_height*this.out_percent : 0) : 0;
		
		let rect=new Rectangle(w>0 ? pos.x-w : pos2.x,h>0 ? pos.y-h : pos2.y,w>0 ? w+(this._overflow ? this._mask_width*this.out_percent : 0) : 0,h>0 ? h+(this._overflow ? this._mask_height*this.out_percent : 0) : 0);
		
		if(this._inertia){
			this._drag_area=free ? free : rect;
	    	this._drag_time=new Date().getTime();
			this._press_point=new Point(e.mouseX,e.mouseY);
	    }
	
		TweenLite.remove(this._register_instance);
		this._register_instance.addEventListener(StageEvent.DRAG_MOVE,Global.delegate(this._drag_move_handler,this),this.name);
		
		(this.stage ? this.stage : Stage.current).startDrag(this._register_instance,rect,false,free);
		(this.stage ? this.stage : Stage.current).addEventListener(StageEvent.MOUSE_UP,Global.delegate(this._mouse_up_handler,this),this.name);
	}
	
	_drag_move_handler(e)
	{
		this.dispatchEvent(new Event(UIContainer.DRAG_MOVE));
	}
	
	_mouse_up_handler(e)
	{
		if(e){
			let bool=true,posX,posY;
			
			if(this._overflow){
				posX=this._register_instance.x>=0 ? 0 : (this._register_instance.x<(this._mask_width-this._register_instance.getWidth()) ? (this._mask_width-this._register_instance.getWidth()) : this._register_instance.x);
				posY=this._register_instance.y>=0 ? 0 : (this._register_instance.y<(this._mask_height-this._register_instance.getHeight()) ? (this._mask_height-this._register_instance.getHeight()) : this._register_instance.y);
				
				if(posX!=this._register_instance.x || posY!=this._register_instance.y) {
					bool=false;
					TweenLite.to(this._register_instance,this.back_time,{ease:this.back_ease,x:posX,y:posY});
				}
			}
			
		    if(this._inertia && bool){
		    	posX=e.mouseX-this._press_point.x;
		    	posY=e.mouseY-this._press_point.y;
		    	
		    	let length=MathUtil.format(Math.sqrt(posX*posX+posY*posY));
		    	let time=new Date().getTime()-this._drag_time;
		    	let speed=length/time;
		    	
		    	if(length>8){
		    		let data=this._count_speed(posX,posY,speed);
		    		TweenLite.to(this._register_instance,data.time,{ease:this.back_ease,x:data.x,y:data.y});
		    	}
		    }
		}
		else if(this._overflow){
			TweenLite.remove(this._register_instance);
		}
		
		this._drag_time=0;
		this._drag_area=null;
		this._press_point=null;
		
		(this.stage ? this.stage : Stage.current).stopDrag();
		(this.stage ? this.stage : Stage.current).mouseTarget=null;
		(this.stage ? this.stage : Stage.current).removeEventListener(StageEvent.MOUSE_UP,null,this.name);
		this._register_instance.removeEventListener(StageEvent.DRAG_MOVE,null,this.name);
	}
	
	_count_speed(offsetX,offsetY,speed)
	{
		let data={};
		
		speed=MathUtil.clamp(speed,0.3,4.5);
		data.x=offsetX*speed*this.inertia_ratio;
		data.y=offsetY*speed*this.inertia_ratio;
		
		Point.clamp(data,this.min_migration_length,this.max_migration_length);
		data.x=MathUtil.format(this._register_instance.x+data.x);
		data.y=MathUtil.format(this._register_instance.y+data.y);
		
		if(this._drag_area) {
			let point=this.globalToLocal(Rectangle.innerPoint(this._drag_area,this.localToGlobal(data.x,data.y)));
		    data.x=MathUtil.format(point.x);
		    data.y=MathUtil.format(point.y);
		}
		
		let length=Math.sqrt((data.x-this._register_instance.x)*(data.x-this._register_instance.x)+(data.y-this._register_instance.y)*(data.y-this._register_instance.y));
		data.time=Math.min(1,MathUtil.format((length/speed)*this.time_ratio));
	
		return data;
	}
	
	moveTo(x,y)
	{
		super.moveTo(x,y);
		if(this._register_instance) this._register_instance.dispatchEvent(new Event(Event.RESIZE,{w:this._mask_width,h:this._mask_height},{x:this.x,y:this.y}));
	}
	
	render  ()
	{
		if((this.scaleX!=1 && this.scaleX!=0) || (this.scaleY!=1 && this.scaleY!=0)) {
			this._recovery_scale(true);
		}
		
		super.render(...arguments);
	}
	
	_recovery_pos()
	{
		if(this._register_instance.x<0 && (this._register_instance.getWidth()+this._register_instance.x)<this._mask_width){
			this._register_instance.x=this._mask_width-this._register_instance.getWidth();
		}else if(this._register_instance.x>0 && (this._register_instance.getWidth()+this._register_instance.x)>this._mask_width){
			this._register_instance.x=0;
		}
		
		if(this._register_instance.y<0 && (this._register_instance.getHeight()+this._register_instance.y)<this._mask_height){
			this._register_instance.y=this._mask_height-this._register_instance.getHeight();
		}else if(this._register_instance.y>0 && (this._register_instance.getHeight()+this._register_instance.y)>this._mask_height){
			this._register_instance.y=0;
		}
	}
	
	_recovery_scale(bool)
	{
		this._mask_width=MathUtil.format(this._initial_width*this.scaleX);
		this._mask_height=MathUtil.format(this._initial_height*this.scaleY);
		
		if(bool) this.scaleX=this.scaleY=1;
		this._recovery_pos();
		
		if(this._mask){
			this._mask.width=this._mask_width;
			this._mask.height=this._mask_height;
			this.mask=this._mask;
		}
		
	    if(this._register_instance!=undefined) {
	    	this._reset_hold_control(null);
	    	this._register_instance.resize=true;
	    	this._register_instance.dispatchEvent(new Event(Event.RESIZE,{w:this._mask_width,h:this._mask_height},{x:this.x,y:this.y,r:this.rotation}));
	    }
	}
	
	updateSizeInArea(area_width,area_height)
	{
		this._initial_height=this.instance.getHeight();
		this._initial_width=this.instance.getWidth();
		let count=0;
		
		if(this._initial_width>area_width){
			this.scaleX=area_width/this._initial_width;
			count+=1;
		}
		
		if(this._initial_height>area_height){
			this.scaleY=area_height/this._initial_height;
			count+=2;
		}
		
		if(count<3 && count!=1) this._mask_width=this._initial_width;
		if(count<3 && count!=2) this._mask_height=this._initial_height;
		if(count==0) this._recovery_scale();
	}
	
	reset()
	{
		if(this._register_instance){
			if(this._register_instance.hasEventListener(StageEvent.MOUSE_DOWN)){
				this._mouse_up_handler(null);
				this._register_instance.removeEventListener(StageEvent.MOUSE_DOWN,null,this.name);
			}
			
			if(this._register_instance.hasEventListener(DisplayBase.RESIZE)){
				this._register_instance.removeEventListener(DisplayBase.RESIZE,null,this.name);
			}
		}
		
		super.reset();
		this.back_time=0.16;
		this.out_percent=0.5;
		this.time_ratio=0.0014;
		this.inertia_ratio=1.2;
		this.min_migration_length=1;
		this.max_migration_length=10;
		this.back_ease="easeoutquad";
		this._overflow=this._inertia=false;
		this._press_point=this._drag_area=null;
		this._orientation=this._drag_time=this._initial_width=this._initial_height=this._mask_width=this._mask_height=0;		
	}
	
	dispose()
	{	
		super.dispose();
		delete this._initial_width,this._initial_height,this.time_ratio,this.min_migration_length,this.max_migration_length,this.inertia_ratio,this._drag_area,this._press_point,this._inertia,this._drag_time,this.back_ease,this.out_percent,this.back_time,this._orientation,this._overflow,this._mask_width,this._mask_height;
	}
}

UIContainer.DRAG_MOVE="drag_container";
UIContainer.className="UIContainer";