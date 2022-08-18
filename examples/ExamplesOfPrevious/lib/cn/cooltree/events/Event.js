/**
Shine Chen 
s_c@live.com 2015/05/04

===================================================================
Event Class
===================================================================
**/

function Event(type,params,label,target)
{
	this.type   = type;
	this.label  = label;
	this.params = params;
	this.target = target;
}

Event.prototype.__class__="Event";
Event.PLAY_OVER="play_over";
Event.COMPLETE="complete";
Event.RESIZE="resize";
Event.ERROR="error";
Event.CLOSE="close";
Event.INIT="init";

Event.prototype.clone=function()
{
	return new Event(this.type,this.params,this.label,this.target);
}

Event.prototype.dispose=function()
{
	delete this.type, this.target, this.params,this.label;
}

Event.prototype.toString=function()
{
	return '{"type":' + this.type + ',label":' + this.label ? this.label.toString() :'' + ',"target":' +this.target ? this.target.toString() : ''+ ',"params":' +this.params ? this.params.toString() :''+'}';
}

