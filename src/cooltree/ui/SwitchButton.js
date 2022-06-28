import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import DropShadowFilter from '../filters/DropShadowFilter.js'
import TweenLite from '../transitions/TweenLite.js'
import StageEvent from '../events/StageEvent.js'
import ObjectPool from '../utils/ObjectPool.js'
import ObjectUtil from '../utils/ObjectUtil.js'
import Rectangle from '../geom/Rectangle.js'
import Factory from '../core/Factory.js'
import Point from '../geom/Point.js'
import Global from '../core/Global.js'
import Event from '../events/Event.js'

/**
 * @class
 * @module SwitchButton
 * @extends DisplayObjectContainer
 */
export default class SwitchButton extends DisplayObjectContainer
{
	constructor()
	{
		super();
		
		this.space=2;
		this.redius=20;
		this.length=85;
		this.lock=false;
		this.bool=false;
		this.speed=1000;
		this.drag_rate=5;
		this.has_shadow=true;
		this.color="#FFFFFF";
		this.bg_color="#666666";
		this.sd_color="#000000";
		this.md_color="#FFF888";
		this.is_drag=this.is_open=false;
		this.hold_rect=this.point=this.point2=this.shadow=this.middle=this.bottom=this.bar=null;
	}
	
	get value()
	{
		return this.bool;
	}
	
	set value(value) 
	{
    	if(this.bool==value) return;
    	this.bool=value;
    	
    	if(!this.bottom) return;
    	this.sync_data(true);
    	this.dispatchEvent(new Event(SwitchButton.CHANGE,this.bool));
    }
	
	setup(config)
	{
		if(config) ObjectUtil.copyAttribute(this,config,true);
		
		if(!this.bottom){
			this.bottom=Factory.c("bs",[this.bg_color,this.length+this.space*2,(this.redius+this.space)*2,this.redius+this.space]);
			this.addChild(this.bottom);
			
			this.bottom.mouseEnabled=true;
			this.bottom.addEventListener(StageEvent.MOUSE_TAP,Global.delegate(this.change_handler,this));
		}else{
			this.bottom.setSize(this.length+this.space*2,(this.redius+this.space)*2);
			this.bottom.redius=this.redius+this.space;
			this.bottom.color=this.bg_color;
		}
		
		if(!this.middle){
			this.middle=this.bottom.clone();
			this.middle.color=this.md_color;
			this.middle.mouseEnabled=false;
			this.addChild(this.middle);
		}else{
			this.middle.setSize(this.length+this.space*2,(this.redius+this.space)*2);
			this.middle.redius=this.redius+this.space;
			this.middle.color=this.md_color;
		}
		
		if(!this.bar){
			this.bar=Factory.c("bs",[this.color,this.redius*2,this.redius*2,this.redius]);
			this.addChild(this.bar);
			
			this.bar.buttonMode=this.bar.mouseEnabled=true;
			this.bar.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this.mouse_handler,this));
		}else{
			this.bar.setSize(this.redius*2,this.redius*2);
			this.bar.redius=this.redius;
			this.bar.color=this.color;
		}
		
		this.bar.y=this.redius+this.space;
		this.bar.origin={x:this.redius,y:this.redius};
		
		if(!this.shadow && this.has_shadow){
			this.shadow=new DropShadowFilter(1,30,this.redius*0.3,this.sd_color,1,this.redius);
		}else{
			this.shadow=null;
		}
		
		if(this.shadow && this.bar.instance.filters && this.bar.instance.filters.indexOf(this.shadow)<0){
			this.bar.instance.filters=[this.shadow];
		}
		else if(!this.shadow) this.bar.instance.filters=[];
		
		this.sync_data();
		this.setSize(this.length+this.space*2,(this.redius+this.space)*2);
	}
	
	change_handler(e)
	{
		if(this.lock) return;
		this.value=!this.bool;
	}
	
	mouse_handler(e)
	{
		if(!this.stage || this.lock) return;
		if(!this.point) this.point=ObjectPool.create(Point);
		this.point.set(e.mouseX,e.mouseY);
		this.is_open=(!this.bool);
		this.is_drag=false;
		this.lock=true;
		
		this.stage.addEventListener(StageEvent.MOUSE_UP,Global.delegate(this.mouse_up,this),this.name);
		this.stage.addEventListener(StageEvent.MOUSE_MOVE,Global.delegate(this.mouse_move,this),this.name);
	}
	
	mouse_move(e)
	{
		if(!this.point2) this.point2=ObjectPool.create(Point);
		let oldX=this.point2.x;
		this.point2.set(e.mouseX,e.mouseY);
		
		if(!this.is_drag && Point.distance(this.point,this.point2)>this.drag_rate){
			let posA=this.localToGlobal(this.space+this.redius,this.space+this.redius);
			let posB=this.localToGlobal(this.length+this.space-this.redius,this.space+this.redius);
			if(!this.hold_rect) this.hold_rect=new Rectangle();
			this.hold_rect.data={x:posA.x,y:posA.y,width:Math.abs(posB.x-posA.x)};
			
			this.stage.startDrag(this.bar,this.hold_rect);
			this.middle.visible=true;
			this.is_drag=true;
		}
		else if(this.is_drag){
			this.is_open=(this.point2.x>=oldX);
			this._change_middle();
		}
	}
	
	mouse_up(e)
	{
		this.stage.removeEventListener(StageEvent.MOUSE_UP,null,this.name);
		this.stage.removeEventListener(StageEvent.MOUSE_MOVE,null,this.name);
		
		this.lock=false;
		if(!this.is_drag){
			this.change_handler();
			return;
		}
		
		this.stage.stopDrag();
		
		if(this.bool!=this.is_open){
			this.value=this.is_open;
			return;
		}
		
		this.sync_data(true);
	}
	
	_change_middle()
	{
		this.middle.width=this.redius+this.bar.x+this.space;
	}
	
	sync_data(use_tween)
	{
		let posX=(this.bool ? this.length+this.space-this.redius : this.space+this.redius);
		
		if(!use_tween || posX==this.bar.x) {
			this.bar.x=posX;
			this.middle.visible=this.bool;
			return;
		}
		
		this.lock=true;
		this.middle.visible=true;
		TweenLite.remove(this.bar);
		TweenLite.to(this.bar,Math.abs(posX-this.bar.x)/this.speed,{x:posX,onUpdate:Global.delegate2(this._change_middle,this),onCompleteParams:[this],onComplete:function(t){
			t.lock=false;
			if(t.bool) t.middle.width=t.bottom.width;
			else t.middle.visible=false;
		}});
	}
	
	reset()
	{
		this.space=2;
		this.redius=20;
		this.length=85;
		this.lock=false;
		this.bool=false;
		this.speed=1000;
		this.drag_rate=5;
		this.has_shadow=true;
		this.color="#FFFFFF";
		this.bg_color="#666666";
		this.sd_color="#000000";
		this.md_color="#FFF888";
		this.is_drag=this.is_open=false;
		this.hold_rect=this.point=this.point2=this.shadow=this.middle=this.bottom=this.bar=null;
		super.reset();
	}
	
	dispose()
	{
		super.dispose();
		if(point) ObjectPool.remove(point);
		if(point2) ObjectPool.remove(point2);
		delete this.drag_rate,this.hold_rect,this.lock,this.point,this.point2,this.space,this.redius,this.length,this.bool,this.speed,this.has_shadow,this.color,this.bg_color,this.sd_color,this.shadow,this.bottom,this.bar;
	}
}

SwitchButton.CHANGE="switch_button_change";
SwitchButton.className="SwitchButton";