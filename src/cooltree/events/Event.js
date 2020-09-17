/**
Shine Chen 
s_c@live.com 2015/05/04

===================================================================
Event Class
===================================================================
**/

export default class Event
{
	constructor(type,params=null,label=null,target=null)
	{
		this.type   = type;
		this.label  = label;
		this.params = params;
		this.target = target;
	}
	
	clone()
	{
		return new Event(this.type,this.params,this.label,this.target);
	}
	
	reset(type=null,params=null,label=null,target=null)
	{
		this.type   = type;
		this.label  = label;
		this.params = params;
		this.target = target;
	}
	
	dispose()
	{
		delete this.type, this.target, this.params,this.label;
	}
	
	toString()
	{
		return '{"type":' + this.type + ',label":' + this.label ? this.label.toString() :'' + ',"target":' +this.target ? this.target.toString() : ''+ ',"params":' +this.params ? this.params.toString() :''+'}';
	}
}

Event.className="Event";
Event.PLAY_OVER="play_over";
Event.COMPLETE="complete";
Event.RESIZE="resize";
Event.ERROR="error";
Event.CLOSE="close";
Event.INIT="init";