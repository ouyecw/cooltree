/**
===================================================================
StageEvent Class
===================================================================
**/

import Event from './Event.js'
import Factory from '../core/Factory.js'

/**
 * @class
 * @module StageEvent
 * @extends Event
 */
export default class StageEvent extends Event
{
	constructor(type,params,label,target)
	{
		super(type,params,label,target);
		this.length=this.delta = this.mouseY = this.mouseX = 0;
		this.touchs = null;
	}
	
	setup(type,params,label,target,mouseX,mouseY,delta,length,touchs)
	{
		this.type   = type;
		this.label  = label;
		this.params = params;
		this.target = target;
		
		this.length = length;
		this.touchs = touchs;
		
		this.delta  = (delta==null ? 0 : delta);
		this.mouseY = (mouseY==null ? 0 : mouseY);
		this.mouseX = (mouseX==null ? 0 : mouseX);
		return this;
	}
	
	reset(...args)
	{
		super.reset(...args);
		this.length=this.delta = this.mouseY = this.mouseX = 0;
		this.touchs = null;
	}
	
	clone()
	{
		return Factory.c("se").setup(this.type,this.params,this.label,this.target,mouseX,mouseY,delta,length,touchs);
	}
	
	dispose()
	{
		super.dispose();
		delete this.delta,this.mouseY,this.mouseX,this.length,this.touchs;
	}
	
	toString () 
	{
		return "[StageEvent length="+this.length+", type=" + this.type + ", mouseX=" + this.mouseX + ", mouseY=" + this.mouseY + ", delta="+this.delta+"]";
	}
}

StageEvent.className="StageEvent";
StageEvent.MESSAGE     = "win_message";
StageEvent.ENTER_FRAME = "enterframe";
StageEvent.MOUSE_WHEEL = "mousewheel";
StageEvent.MOUSE_CLICK = "mouseclick";
StageEvent.MOUSE_DOWN  = "mousedown";
StageEvent.MOUSE_MOVE  = "mousemove";
StageEvent.MOUSE_OVER  = "mouseover";
StageEvent.MOUSE_TAP   = "mousetap";
StageEvent.MOUSE_OUT   = "mouseout";
StageEvent.MOUSE_UP    = "mouseup";
StageEvent.RESIZE      = "resize";

StageEvent.DRAG_MOVE = "drag_move";
StageEvent.KEY_DOWN  = "keydown";
StageEvent.KEY_UP    = "keyup";
StageEvent.UPDATE    = "update";