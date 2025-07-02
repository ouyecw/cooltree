
/**
 * @class
 * @module ClassUtil
 */
export default class ClassUtil
{
	static getQualifiedClassName(value) 
	{
		if(!value) return null;
		if(value.className) return value.className;
		if(value.constructor && value.constructor.name) {
			if(value.constructor.name=="Function") return value.name;
			return value.constructor.name;
		}
		
		let prototype;
		
		try{
			prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
		}
	    catch(e){
	    	console.log("[ERROR] ClassUtil.getQualifiedClassName",e);
	    	return;
	    }
	    
	    if (prototype.hasOwnProperty("__class__")) {
	        return prototype["__class__"];
	    }
	    let constructorString = prototype.constructor.toString();
	    let index = constructorString.indexOf("(");
	    let className = constructorString.substring(9, index);
	    Object.defineProperty(prototype, "__class__", {
	        value: className,
	        enumerable: false,
	        writable: true
	    });
	    return className;
	}

	static getClassName(value) 
	{
		const type=typeof value;
		return type=="object" ? Object.prototype.toString.call(value) : type;
	}

	static isImage(value)
	{
		if(ClassUtil.getClassName(value)=="[object HTMLImageElement]") return true;
		return /^[A-Za-z]\d$/.test(ClassUtil.getQualifiedClassName(value));
	}

	static getQualifiedSuperclassName(value) 
	{
	    let prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
	    if (prototype.hasOwnProperty("__superclass__")) {
	        return prototype["__superclass__"];
	    }
		
		let name,superClass=ClassUtil.getQualifiedClassName(value),superProto = Object.getPrototypeOf(prototype);
		
		while(superProto && superProto.constructor){
			name=ClassUtil.getQualifiedClassName(superProto.constructor);
			if(name && name.trim()!='' && name.trim()!='Object'){
				superClass=name.trim()+"."+superClass;
			}
			superProto = superProto.constructor.prototype ? Object.getPrototypeOf(superProto.constructor.prototype) : null;
		}
	
	    Object.defineProperty(prototype, "__superclass__", {
	        value: superClass,
	        enumerable: false,
	        writable: true
	    });
	    return superClass;
	}
}

module.exports = ClassUtil;
