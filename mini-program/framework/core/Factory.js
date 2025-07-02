/**
 * 实例化工厂
 * @param {Object} generator class
 * @param {Object} properties
 * @param {Array}  params
 */

import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import DisplayObject from '../display/DisplayObject.js'
import StringUtil from '../utils/StringUtil.js'
import ObjectUtil from '../utils/ObjectUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import MovieClip from '../display/MovieClip.js'
import BitmapText from '../text/BitmapText.js'
import ClassUtil from '../utils/ClassUtil.js'
import TextField from '../text/TextField.js'
import FontManager from './FontManager.js'
import Sprite from '../display/Sprite.js'
import BoxShape from '../ui/BoxShape.js'
import Effect from '../model/Effect.js'

/**
 * @class
 * @module Factory
 */
export default class Factory
{
	static className="Factory";

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
	 * sp Sprite
	 * @param {Object|Array} properties
	 */
	static c(type,properties)
	{
		if(StringUtil.isEmpty(type)) return null;
		
		let instance;
		
		switch (type) {
			case "dc":
			    instance=ObjectPool.create(DisplayObjectContainer);
				break;
			case "do":
			    instance=ObjectPool.create(DisplayObject);
				break;
			case "sp":
				instance=ObjectPool.create(Sprite);
				break;
			case "mc":
			    instance=ObjectPool.create(MovieClip);
				break;
			case "bs":
				instance=ObjectPool.create(BoxShape);
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
					instance=new TextField(properties.text,properties.font,properties.color,properties.size);
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

module.exports = Factory;