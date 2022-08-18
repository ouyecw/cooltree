/**
===================================================================
StageEvent Class
===================================================================
**/

function StageEvent(type,params,label,target)
{
	Event.call(this,type,params,label,target);
	this.delta = this.mouseY = this.mouseX = 0;
	this.length=this.touchs = null;
}

Global.inherit(StageEvent,Event);
StageEvent.prototype.__class__="StageEvent";

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

StageEvent.prototype.setup=function(type,params,label,target,mouseX,mouseY,delta,length,touchs)
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
}

StageEvent.prototype.clone=function()
{
	var evt=new StageEvent();
	evt.setup(this.type,this.params,this.label,this.target,mouseX,mouseY,delta,length,touchs);
	return evt;
}

StageEvent.prototype.dispose=function()
{
	StageEvent.superClass.dispose.call(this);
	delete this.delta,this.mouseY,this.mouseX,this.length,this.touchs;
}

StageEvent.prototype.toString = function() 
{
	return "[StageEvent length="+this.length+", type=" + this.type + ", mouseX=" + this.mouseX + ", mouseY=" + this.mouseY + ", delta="+this.delta+"]";
}
