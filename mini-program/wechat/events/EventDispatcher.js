/**
Shine Chen 
s_c@live.com 2015/05/04

===================================================================
EventDispatcher Class
===================================================================
**/

import StringUtil from '../utils/StringUtil.js'
import Global from '../core/Global.js'

/**
 * @class
 * @module EventDispatcher
 */
export default class EventDispatcher
{
	static className="EventDispatcher";
	static _current_instance=null;

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
	
	has(eventType,id=null)
	{
		if(!StringUtil.isEmpty(id) && this.caches){
			return (this.caches[eventType+"#"+id]!=undefined);
		}
		
		return (this.listeners && this.listeners[eventType] != undefined);
	}
	
	on(eventType, func,target=null,id=null)
	{
		if(!(typeof eventType==="string" && typeof func==="function")) return;
		if(!StringUtil.isEmpty(id) && this.has(eventType,id)) return;
		
		if(this.listeners[eventType] == undefined) this.listeners[eventType]=[];
		if(this.listeners[eventType].indexOf(func)==-1) this.listeners[eventType].push({f:func,t:target});
		
		if(id){
			this.caches=this.caches || {};
			this.caches[eventType+"#"+id]=func;
		}
	}
	
	off(eventType, func,id=null)
	{
		if(this.listeners==undefined || this.listeners[eventType] == undefined) return;
		
		if(func==undefined){
			if(StringUtil.isEmpty(id) || this.caches==undefined || typeof id!="string"){
				this._remove_listeners(eventType);
				return;
			}
			
			func=this.caches[eventType+"#"+id];
			delete this.caches[eventType+"#"+id];
		}
		
		if(typeof func!="function") return;
		
		let len=this.listeners[eventType].length;
		for(let i=0; i<len ;i++)
		{
			let sub_func=this.listeners[eventType][i];
			if(sub_func && sub_func.f==func){
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
	
	emit(eventObj)
	{
		const list=this.listeners;
		if(eventObj== undefined || !eventObj.hasOwnProperty("type") || !eventObj.type ||list==undefined || list[eventObj.type] == undefined) {
			if(eventObj) {
				try{
					eventObj.dispose();
				}
				catch (err){}
			}
			return false;
		}
		
		let listener;
		const map=list[eventObj.type].slice();
		eventObj[eventObj.target ? "currentTarget" :"target"]=this;
		for(listener of map) listener.f.call(listener.t,eventObj);
		if(eventObj && !Global.gc(eventObj)) eventObj.dispose();
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

module.exports =EventDispatcher;