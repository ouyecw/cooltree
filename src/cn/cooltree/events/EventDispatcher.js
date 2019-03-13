/**
Shine Chen 
s_c@live.com 2015/05/04

===================================================================
EventDispatcher Class
===================================================================
**/

class EventDispatcher
{
	constructor()
	{
		this.caches=null;
		this.listeners={};
	}
	
	reset()
	{
		this.caches=null;
		this.listeners={};
	}
	
	hasEventListener(eventType,id)
	{
		if(!StringUtil.isEmpty(id) && this.caches){
			return (this.caches[eventType+"#"+id]!=undefined);
		}
		
		return (this.listeners && this.listeners[eventType] != undefined);
	}
	
	addEventListener(eventType, func,id)
	{
		if(!(typeof eventType==="string" && typeof func==="function")) return;
		if(!StringUtil.isEmpty(id) && this.hasEventListener(eventType,id)) return;
		
		if(this.listeners[eventType] == undefined) this.listeners[eventType]=[];
		if(this.listeners[eventType].indexOf(func)==-1) this.listeners[eventType].push(func);
		
		if(id){
			this.caches=this.caches || {};
			this.caches[eventType+"#"+id]=func;
		}
	}
	
	removeEventListener(eventType, func,id=null)
	{
		if(this.listeners==undefined || this.listeners[eventType] == undefined) return;
		
		if(func==undefined){
			if(StringUtil.isEmpty(id) || this.caches==undefined){
				this._remove_listeners(eventType);
				return;
			}
			
			func=this.caches[eventType+"#"+id];
			delete this.caches[eventType+"#"+id];
		}
		
		if(typeof func!=="function") return;
		
		let len=this.listeners[eventType].length;
		for(let i=0; i<len ;i++)
		{
			let sub_func=this.listeners[eventType][i];
			if(sub_func==func){
				this.listeners[eventType].splice(i, 1);
				len--;
				i--;
				break;
			}
		}
		
		if(this.listeners[eventType].length==0) this._remove_listeners(eventType);
	}
	
	_remove_listeners(type)
	{
		delete this.listeners[type];
		if(this.caches==undefined) return;
		
		for (let i in this.caches){
			if(i.indexOf(type)==0) delete this.caches[i];
		}
	}
	
	dispatchEvent(eventObj)
	{
		const list=this.listeners;
		if(eventObj== undefined || !eventObj.hasOwnProperty("type") || list==undefined || list[eventObj.type] == undefined) {
			if(eventObj && !Global.gc(eventObj)) eventObj.dispose();
			return false;
		}
		
		let listener;
		const map=list[eventObj.type].slice();
		if(eventObj.target==null) eventObj.target=this;
		for(listener of map) listener.call(this,eventObj);
		if(!Global.gc(eventObj)) eventObj.dispose();
		return true;
	}
	
	dispose()
	{
		this.caches=null;
		if(this.listeners==undefined) return;
		for(let type in this.listeners) delete this.listeners[type];
		delete this.listeners,this.caches;
	}
	
	toString()
	{
		return '{"listeners":'+ObjectUtil.toString(this.listeners)+'}';
	}

	static instance()
	{
		EventDispatcher._current_instance=EventDispatcher._current_instance || new EventDispatcher();
		return EventDispatcher._current_instance;
	}
}

EventDispatcher._current_instance=null;