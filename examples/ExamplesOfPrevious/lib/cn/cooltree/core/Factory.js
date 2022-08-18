/**
 * 实例化工厂
 * @param {Object} generator class
 * @param {Object} properties
 * @param {Array}  params
 */
function Factory(generator,properties,params)
{
	this.generator = (typeof(generator)=="string") ? ClassUtil.getDefinitionByName(generator) : generator;
	this.properties = properties;
	this.params = params;
}

Factory.prototype.newInstance=function()
{
	if(this.generator==null) return null;
	
	var p,instance = ObjectPool.create(this.generator,this.params);
	
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
 * @param {Object || Array} properties
 * @param {Boolean} useCanvas
 */
Factory.c=function(type,properties,useCanvas)
{
	if(StringUtil.isEmpty(type)) return null;
	useCanvas=(useCanvas==undefined) ? Global.useCanvas : useCanvas;
	
	var instance;
	
	switch (type) {
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
	
	if(instance && properties) ObjectUtil.copyAttribute(instance,properties,false);
	return instance;
}
