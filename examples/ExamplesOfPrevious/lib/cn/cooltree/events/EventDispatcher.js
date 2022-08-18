/**
Shine Chen 
s_c@live.com 2015/05/04

===================================================================
EventDispatcher Class
===================================================================
**/

function EventDispatcher()
{
	this.caches=null;
	this.listeners={};
}

EventDispatcher.prototype.reset=function()
{
	this.caches=null;
	this.listeners={};
}

EventDispatcher.prototype.hasEventListener=function(eventType,id)
{
	if(!StringUtil.isEmpty(id) && this.caches){
		return (this.caches[eventType+"#"+id]!=undefined);
	}
	
	return (this.listeners && this.listeners[eventType] != undefined);
}

EventDispatcher.prototype.addEventListener=function(eventType, func,id)
{
	if(!(typeof eventType=="string" && typeof func=="function")) return;
	if(!StringUtil.isEmpty(id) && this.hasEventListener(eventType,id)) return;
	
	if(this.listeners[eventType] == undefined) this.listeners[eventType]=[];
	if(this.listeners[eventType].indexOf(func)==-1) this.listeners[eventType].push(func);
	
	if(id){
		this.caches=this.caches || {};
		this.caches[eventType+"#"+id]=func;
	}
}

EventDispatcher.prototype.removeEventListener=function(eventType, func,id)
{
	if(this.listeners==undefined || this.listeners[eventType] == undefined) return;
	
	if(func==undefined){
		if(StringUtil.isEmpty(id) || this.caches==undefined){
			delete this.listeners[eventType];
			return;
		}
		
		func=this.caches[eventType+"#"+id];
		delete this.caches[eventType+"#"+id];
	}
	
	if(ObjectUtil.getType(func)!="function") return;
	
	var len=this.listeners[eventType].length;
	for(var i=0; i<len ;i++)
	{
		var sub_func=this.listeners[eventType][i];
		if(sub_func==func){
			this.listeners[eventType].splice(i, 1);
			len--;
			i--;
			break;
		}
	}
	
	if(this.listeners[eventType].length==0) {
		delete this.listeners[eventType];
		if(this.caches==undefined) return;
		
		for (var i in this.caches){
			if(i.indexOf(eventType)==0) delete this.caches[i];
		}
	}
}

EventDispatcher.prototype.dispatchEvent=function(eventObj)
{
	const list=this.listeners;
	if(eventObj== undefined || !eventObj.hasOwnProperty("type") || list==undefined || list[eventObj.type] == undefined) return false;
	if(eventObj.target==null) eventObj.target=this;
	var i,listener,map=list[eventObj.type].slice();
	
	for(i in map)
	{
		listener = map[i];
		if(typeof(listener) == "function")
		{
			listener.call(this,eventObj);
		}
	}
	
	return true;
}

EventDispatcher.prototype.dispose=function()
{
	this.caches=null;
	if(this.listeners==undefined) return;
	for(var type in this.listeners) delete this.listeners[type];
	delete this.listeners,this.caches;
}

EventDispatcher.prototype.toString=function()
{
	return '{"listeners":'+ObjectUtil.toString(this.listeners)+'}';
}

EventDispatcher._current_instance=null;

EventDispatcher.instance=function()
{
	EventDispatcher._current_instance=EventDispatcher._current_instance || new EventDispatcher();
	return EventDispatcher._current_instance;
}