ObjectUtil={};

ObjectUtil.getType=function(o) 
{
	if(o==null || o==undefined) return "null";
	var _t;
	return ((_t = typeof(o)) == "object" ? o == null && "null" || Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
}

ObjectUtil.toString=function(obj)
{
	return obj ? JSON.stringify(obj) : (ObjectUtil.getType(obj)=="boolean" ? "false" : "null");
}

ObjectUtil.getAttribute=function(obj,attrs)
{
	if(obj==null || StringUtil.isEmpty(attrs)) return null;
	let labels=attrs.split(".");
	
	for(let i=0,label,l=labels.length;i<l;i++) {
		label=labels[i];
		if(StringUtil.isEmpty(label)) continue;
		if(!obj || !obj[label]) return null;
		obj=obj[label];
	}
	
	return obj;
}

ObjectUtil.getLabels=function(obj)
{
	if(obj==null) return null;
	return Object.getOwnPropertyNames(obj);
}

/**
 * 清除其它属性
 * @param {Object} target
 * @param {array} attributes
 * @param {array} functions
 */
ObjectUtil.clearAttribute=function(target,attributes,functions)
{
	if(target==null || attributes==null || attributes.length<1) return;
	var i,b;
	
	for(i in target){
		b=(typeof(target[i])=="function");
		if((b && (functions==null || functions.indexOf(i)>=0)) || (!b && (attributes==null || attributes.indexOf(i)>=0))) continue;
		delete target[i];
	}
}

/**
 * @param {Object} target
 * @param {Object} data
 * @param {Boolean} must
 * @param {array} miss
 * @param {Boolean} clone
 */
ObjectUtil.copyAttribute=function(target,data,must,miss,clone)
{
	if(target==null || data==null) return;
	
	var i;
	var item;
	var type;
	var bool;
	
	for(i in data){
		item=data[i];
		if((must && !target.hasOwnProperty(i)) || (miss && miss.indexOf(i)>=0)) continue;
		
		try{
			type=typeof(target[i]);
		}
		catch(err){continue};
		
		type=(type=="null" || type=="undefined") ? typeof(item) : type;
		
		switch(type){
			case "number":
			    target[i]=isNaN(item) ? item : Number(item);
			    break;
			    
			case "boolean":
			    target[i]=(item!=undefined && (typeof(item)=="string" ? (item=="true") : item));
			    break;
 
			case "string":
			    target[i]=item;
			    break;
			    
			default:
			   target[i]=(item==null || typeof(item)=="string" || !clone) ? item : ObjectUtil.cloneObj(item);
			   break;
		}
	}
	
	return target;
}

ObjectUtil.cloneObj=function(obj)
{
	if(obj==undefined || obj==null) return;
	const type=ClassUtil.getQualifiedClassName(obj);
	const result=(type=="Object") ? {} : (type=="Array") ? [] : ClassUtil.getDefinitionByName(type);
	return ObjectUtil.copyAttribute(result,obj,false);
}

ObjectUtil.equal=function(objA,objB)
{
	if(objA==null || objB==null) return (objA==objB);
	if(typeof objA != typeof objB) return false;
	if(typeof objA!="object") return (objA==objB);
	
	var aProps,bProps,i,propName;
	
	if(objA instanceof Array && objB instanceof Array) {
		if(objA.length!=objB.length) return false;
		for(i=0,l=objA.length;i<l;i++){
			if(!ObjectUtil.equal(objA[i],objB[i])) return false;
		}
	}else{
		if(objA instanceof Array || objB instanceof Array) return false;
		aProps = Object.getOwnPropertyNames(objA);
		bProps = Object.getOwnPropertyNames(objB);
		if(aProps.length != bProps.length) return;
		for (i = 0; i < aProps.length; i++) {
        	propName = aProps[i];
        	if (!ObjectUtil.equal(objA[propName],objB[propName])) return false;
        }
	}
	
	return true;
}

ObjectUtil.remove_attribute=function(obj,att)
{
	if(obj==undefined || obj==null || !att || att=="" ||typeof obj!="object") return;
	if(obj instanceof Array){
		for(var i=0,l=obj.length;i<l;i++) ObjectUtil.remove_attribute(obj[i],att);
		return;
	}
	
	if(obj.hasOwnProperty(att)) delete obj[att];
	for(var i in obj) ObjectUtil.remove_attribute(obj[i],att);
}
