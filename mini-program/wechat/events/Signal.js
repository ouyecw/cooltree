import ClassUtil from '../utils/ClassUtil.js';
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

	get info()
    {
        let key,handlerList,target;
        const info=[];

        for(key in this._handlers){
            handlerList=this._handlers[key];
            for (var i = 0; i < handlerList.length; i++) {
                
                target=handlerList[i].t;
                target=target && typeof target=="object" ? ClassUtil.getQualifiedClassName(target) : target;
                info.push(key+" : "+target+" > "+(handlerList[i].f ? handlerList[i].f.name : ""));
            }
        }

        return info.join("\n");
    }
	
	/**
	 * 一次性监听
	 * @param  {Object} name 信号名称
	 * @return {Promise}
	 */
	once(name, handler, target,...args)
	{
		if(StringUtil.isEmpty(name)) return -1;
		const index=this.on(name,handler,target,...args);
        this._handlers[name][index].once=true;
		return index;
	}
	
	/**
	 * 监听
	 * @param {string} name 信号名称
	 * @param {function} handler 监听函数
	 * @param {object} target 监听目标
	 * @return {Number} 位置
	 */
	on(name,handler,target,...args)
	{
		if(StringUtil.isEmpty(name) || !handler) return -1;
		let list=this._handlers[name];
		
		if(!list){
			list=[];
			this._handlers[name]=list;
		}
		
		list.push({f:handler,t:target,args,once:false});
		return list.length-1;
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
		if(!list) {
			delete this._handlers[name];
			return false;
		}
		
		if(!handler){
			delete this._handlers[name];
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
		
		if(list.length==0) 
			delete this._handlers[name];

		return true;
	}
	
	/**
	 * 发送信号
	 * @param {string} name 信号名称
	 * @param  {...any} params 参数
	 * @return {boolean} 是否成功
	 */
	emit(name, ...args)
	{
		if(StringUtil.isEmpty(name)) return false;
		let list=this._handlers[name];
		
		if(!list || !list.length) return false;
		list=list.slice();
		
		let i,obj,temp;
		const len=list.length, params = [];
		
		for (i = 1; i < arguments.length; i++) {
		    params.push(arguments[i]);
		}
		
		for (i = 0; i < len; i++) {
		    obj = list[i];
		    if (!obj.f) continue;

			if(obj.args && obj.args.length>0) 
				temp=params.concat(obj.args);

		    obj.f.apply(obj.t || this, temp || params);
			if(obj.once) this.off(name,obj.f,obj.t);
			temp=null;
		}
		
		return true;
	}

	dispose()
	{
		this._handlers=null;
		delete this._handlers;
	}
}

module.exports = Signal;