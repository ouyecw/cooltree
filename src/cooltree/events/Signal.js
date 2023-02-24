import StringUtil from '../utils/StringUtil.js'

/**
 * @class
 * @module Signal
 */
export default class Signal
{
	constructor()
	{
		this._handlers={};
	}
	
	/**
	 * 一次性监听
	 * @param  {Object} name 信号名称
	 * @return {Promise}
	 */
	once(name)
	{
		if(StringUtil.isEmpty(name)) return null;
		return new Promise((resolve, reject) => { 
			let list=this._handlers[name];
			
			if(!list){
				list=[];
				this._handlers[name]=list;
			}
			
			list.push({f:resolve,t:null,o:true});
		});
	}
	
	/**
	 * 监听
	 * @param {string} name 信号名称
	 * @param {function} handler 监听函数
	 * @param {object} target 监听目标
	 * @return {boolean} 是否成功
	 */
	on(name,handler,target=null)
	{
		if(StringUtil.isEmpty(name) || !handler) return false;
		let list=this._handlers[name];
		
		if(!list){
			list=[];
			this._handlers[name]=list;
		}
		
		list.push({f:handler,t:target});
		return true;
	}
	
	/**
	 * 取消监听
	 * @param {string} name 信号名称
	 * @param {function} handler 监听函数
	 * @param {object} target 监听目标
	 * @return {boolean} 是否成功
	 */
	off(name,handler=null,target=null)
	{
		if(StringUtil.isEmpty(name)) return false;
		const list=this._handlers[name];
		if(!list) return false;
		
		if(!handler){
			this._handlers[name]=null;
			return true;
		}
		
		let i,obj,len=list.length;
		
		for (i = 0; i < len; i++) {
			obj=list[i];
			
			if(!obj || !obj.f){
				list.splice(i, 1);
				len--;
				i--;
			}
			
			if(obj.f==handler && (!target || obj.t==target)){
				list.splice(i, 1);
				break;
			}
		}
		
		return true;
	}
	
	/**
	 * 发送信号
	 * @param {string} name 信号名称
	 * @param  {...any} params 参数
	 * @return {boolean} 是否成功
	 */
	send(name, ...args)
	{
		if(StringUtil.isEmpty(name)) return false;
		let list=this._handlers[name];
		
		if(!list || !list.length) return false;
		list=list.slice();
		
		let i,obj;
		const len=list.length, params = [];
		
		for (i = 1; i < arguments.length; i++) {
		    params.push(arguments[i]);
		}
		
		for (i = 0; i < len; i++) {
		    obj = list[i];
		    if (!obj.f) continue;
		    obj.f.apply(obj.t || this, params);
			if(obj.o) this.off(name,obj.f);
		}
		
		return true;
	}
}