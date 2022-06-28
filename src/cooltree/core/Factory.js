/**
 * 实例化工厂
 * @param {Object} generator class
 * @param {Object} properties
 * @param {Array}  params
 */

import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import DisplayObject from '../display/DisplayObject.js'
import DOMDisplay from '../display/DOMDisplay.js'
import StageEvent from '../events/StageEvent.js'
import StringUtil from '../utils/StringUtil.js'
import ObjectUtil from '../utils/ObjectUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import MovieClip from '../display/MovieClip.js'
import DOMMovie from '../display/DOMMovie.js'
import ClassUtil from '../utils/ClassUtil.js'
import TextField from '../text/TextField.js'
import InputText from '../text/InputText.js'
import BoxShape from '../ui/BoxShape.js'
import FontManager from './FontManager.js'
import Effect from '../model/Effect.js'
import Global from '../core/Global.js'

/**
 * @class
 * @module Factory
 */
export default class Factory
{
	
	constructor(generator,properties=null,params=null)
	{
		this.generator = (typeof(generator)=="string") ? ClassUtil.getDefinitionByName(generator) : generator;
		this.properties = properties;
		this.params = params;
	}
	
	newInstance()
	{
		if(this.generator==null) return null;
		
		let p,instance = ObjectPool.create(this.generator,this.params);
		
	    if (this.properties != null)
	    {
	    	for (p in this.properties)
			{
	    		instance[p] = this.properties[p];
			}
	   	}
	    
	   	return instance;
	}
	
	/**
	 * create Instance 获得对应实例
	 * @param {String} type
	 * dc DisplayObjectContainer
	 * tf TextField
	 * mc MovieClip
	 * do DisplayObject
	 * ef Effect
	 * bs BoxShape
	 * @param {Object|Array} properties
	 * @param {Boolean} useCanvas
	 */
	static c(type,properties,useCanvas=null)
	{
		if(StringUtil.isEmpty(type)) return null;
		useCanvas=(useCanvas==null) ? Global.useCanvas : useCanvas;
		
		let instance;
		
		switch (type) {
			case "se":
			    const bool=(!properties || !(properties instanceof Array) || properties.length<1);
			    instance=ObjectPool.create(StageEvent,bool ? null : properties);
				if(!bool) return instance;
				break;
			case "dc":
			    instance=ObjectPool.create(DisplayObjectContainer);
				break;
			case "do":
			    instance=ObjectPool.create(useCanvas ? DisplayObject : DOMDisplay);
				break;
			case "mc":
			    instance=ObjectPool.create(useCanvas ? MovieClip : DOMMovie);
				break;
			case "bs":
				instance=ObjectPool.create(BoxShape);
				instance.use_canvas=useCanvas;
				
				if(properties && ObjectUtil.getType(properties)=="array"){
					instance.setup.apply(instance,properties);
					return instance;
				}
				break;
			case "tf":
			    if(properties==undefined) return null;
			    
				if(properties.font && FontManager.has(properties.font)){
					instance=new BitmapText();
					instance.setup(properties.text,properties.font,properties.lineWidth,properties.align);
				}else{
					instance=useCanvas ? new TextField(properties.text,properties.font,properties.color,properties.size) : new InputText(properties.isInput,properties.multiline,properties.tabindex,properties.password);
				}
				break;
			case "ef":
			    instance=ObjectPool.create(Effect);
				if(properties ==undefined || properties.length==undefined || properties.length==0) return instance;
				instance.setup.apply(instance,properties);
				return instance;
		}
		
		if(instance && properties) ObjectUtil.copyAttribute(instance,properties,true);
		return instance;
	}

}

Factory.className="Factory";