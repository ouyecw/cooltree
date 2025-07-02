/**
===================================================================
StageEvent Class
===================================================================
**/

import Event from './Event.js'
import ObjectPool from '../utils/ObjectPool.js'

/**
 * @class
 * @module StageEvent
 * @extends Event
 */
export default class StageEvent extends Event
{
	static ENTER_FRAME = "enterframe";
	static MOUSE_CLICK = "mouseclick";
	static MOUSE_DOWN  = "mousedown";
	static MOUSE_MOVE  = "mousemove";
	static MOUSE_OVER  = "mouseover";
	static MOUSE_TAP   = "mousetap";
	static MOUSE_OUT   = "mouseout";
	static MOUSE_UP    = "mouseup";
	static RESIZE      = "resize";

	static DRAG_MOVE = "drag_move";
	static UPDATE    = "update";

	constructor(type,params,label,target)
	{
		super(type,params,label,target);
		this.delta = this.mouseY = this.mouseX = 0;
		this.currentTarget=this.touchs = null;
	}
	
	setup(type,target,mouseX,mouseY,delta,touchs,params=null,label=null,currentTarget)
	{
		this.type   = type;
		this.label  = label;
		this.params = params;
		this.target = target;
		this.touchs = touchs;
		
		this.delta  = (delta==null ? 0 : delta);
		this.mouseY = (mouseY==null ? 0 : mouseY);
		this.mouseX = (mouseX==null ? 0 : mouseX);

		this.currentTarget=currentTarget;
		return this;
	}

	clone(target=null)
	{
		return ObjectPool.create(StageEvent).setup(
			this.type,this.target,this.mouseX,this.mouseY,this.delta,this.touchs,this.params,this.label,target || this.currentTarget
		)
	}
	
	reset(...args)
	{
		super.reset(...args);
		this.length=this.delta = this.mouseY = this.mouseX = 0;
		this.currentTarget=this.touchs = null;
	}
	
	dispose()
	{
		super.dispose();
		delete this.currentTarget,this.delta,this.mouseY,this.mouseX,this.length,this.touchs;
	}
	
	toString () 
	{
		return "[StageEvent type=" + this.type + ", mouseX=" + this.mouseX + ", mouseY=" + this.mouseY + ", delta="+this.delta+"]";
	}
}

StageEvent.className="StageEvent";
module.exports =StageEvent;