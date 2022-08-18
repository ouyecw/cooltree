ClassUtil={};
ClassUtil.__getDefinitionByName__cache={};

var __global = __global || this;

ClassUtil.getQualifiedClassName=function (value) 
{
	var prototype;
	
	try{
		prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
	}
    catch(e){
    	trace("[ERROR] ClassUtil.getQualifiedClassName",e);
    	return;
    }
    
    if (prototype.hasOwnProperty("__class__")) {
        return prototype["__class__"];
    }
    var constructorString = prototype.constructor.toString();
    var index = constructorString.indexOf("(");
    var className = constructorString.substring(9, index);
    Object.defineProperty(prototype, "__class__", {
        value: className,
        enumerable: false,
        writable: true
    });
    return className;
}

ClassUtil.getQualifiedSuperclassName=function (value) 
{
    var prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
    if (prototype.hasOwnProperty("__superclass__")) {
        return prototype["__superclass__"];
    }
    var superProto = Object.getPrototypeOf(prototype);
    if (superProto == null)
        return null;
    var superClass = ClassUtil.getQualifiedClassName(superProto.constructor);
    if (!superClass)
        return null;
    Object.defineProperty(prototype, "__superclass__", {
        value: superClass,
        enumerable: false,
        writable: true
    });
    return superClass;
}

ClassUtil.getDefinitionByName=function (name) 
{
    if (StringUtil.isEmpty(name)) return null;
    var definition = ClassUtil.__getDefinitionByName__cache[name];
    
    if (definition) {
        return definition;
    }
    
    var paths = name.split(".");
    var length = paths.length;
    definition = __global;
    
    for (var i = 0; i < length; i++) {
        var path = paths[i];
        definition = definition[path];
        if (!definition) {
            return null;
        }
    }
    
    ClassUtil.__getDefinitionByName__cache[name] = definition;
    return definition;
}
