import EventDispatcher from '../events/EventDispatcher.js'
import StringUtil from '../utils/StringUtil.js'
import Global from '../core/Global.js'
import Event from '../events/Event.js'

/**
 * @class
 * @module WasmFile
 * @extends EventDispatcher
 */
export default class WasmFile extends EventDispatcher
{
	constructor()
	{
		super();
		this.module = null;
	}
	
	/**
	 * 加载文件链接地址
	 * @param {String} url
	 */
	async load(url)
	{
		if(!Global.supportWebAssembly){
			this.dispatchEvent(new Event(Event.ERROR));
			return;
		}
		
		let response,buffer;
		
		try{
			response = await fetch(url);
			buffer = await response.arrayBuffer();
			this.module = await WebAssembly.compile(buffer);
			this.dispatchEvent(new Event(Event.COMPLETE));
		}
		catch(err){
			this.dispatchEvent(new Event(Event.ERROR));
		}
	}
	
	/**
	 * 获取实例
	 * var memory = new WebAssembly.Memory({initial:10, maximum:100});
	 * var options= { imports: { memory }}；
	 * @param {Object} options is importObject 
	 */
	async getInstance(options={})
	{
		if(!Global.supportWebAssembly || !this.module) return;
		const instance = await WebAssembly.instantiate(this.module,options);
		return instance;
	}
	
	dispose()
	{
		this.module = null;
		super.dispose();
	}
}