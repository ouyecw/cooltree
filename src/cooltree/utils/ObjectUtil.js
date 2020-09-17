import ObjectPool from './ObjectPool.js'
import StringUtil from './StringUtil.js'

export default class ObjectUtil
{
	static getType(o) 
	{
		if(o==null || o==undefined) return "null";
		let _t;
		return ((_t = typeof(o)) == "object" ? o == null && "null" || Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
	}
	
	/**
	 * Remove undefined keys from Object
	 *
	 * @param  {Object} options
	 * @return {Object}
	 */
	static removeUndefinedKeys(obj) 
	{
	  for (let key in obj) {
	    if (typeof obj[key] === 'undefined') {
	      delete obj[key]
	    }
	  }
	
	  return obj
	}
	
	static toString(obj)
	{
		return obj ? JSON.stringify(obj) : (ObjectUtil.getType(obj)=="boolean" ? "false" : "null");
	}
	
	static getAttribute(obj,attrs)
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
	
	static toArray(obj)
	{
		if(!obj) return null;
		const arr=[];
		
		for(let i in obj)
		{
			arr.push({name:i,value:obj[i]});
		}
		
		return arr;
	}
	
	static getLabels(obj)
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
	static clearAttribute(target,attributes,functions)
	{
		if(target==null || attributes==null || attributes.length<1) return;
		let i,b;
		
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
	static copyAttribute(target,data,must,miss,clone)
	{
		if(target==null || data==null) return;
		
		let i;
		let item;
		let type;
		let bool;
		
		for(i in data){
			item=data[i];
			if((must && !(i in target)) || (miss && miss.indexOf(i)>=0)) continue;
			
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
	
	static cloneObj(origin)
	{
		if(origin==undefined || origin==null) return null;
		let originProto = Object.getPrototypeOf(origin);
		return Object.assign(Object.create(originProto), origin);
	}
	
	static equal(objA,objB)
	{
		if(objA==null || objB==null) return (objA==objB);
		if(typeof objA != typeof objB) return false;
		if(typeof objA!="object") return (objA==objB);
		
		let aProps,bProps,i,propName;
		
		if(objA instanceof Array && objB instanceof Array) {
			if(objA.length!=objB.length) return false;
			for(i=0,l=objA.length;i<l;i++){
				if(!ObjectUtil.equal(objA[i],objB[i])) return false;
			}
		}else{
			if(objA instanceof Array || objB instanceof Array) return false;
			aProps = Object.getOwnPropertyNames(objA);//Reflect.ownKeys(objA);
			bProps = Object.getOwnPropertyNames(objB);//Reflect.ownKeys(objB);
			if(aProps.length != bProps.length) return;
			for (i = 0; i < aProps.length; i++) {
	        	propName = aProps[i];
	        	if (!ObjectUtil.equal(objA[propName],objB[propName])) return false;
	        }
		}
		
		return true;
	}
	
	static remove_attribute(obj,att)
	{
		if(obj==undefined || obj==null || !att || att=="" ||typeof obj!="object") return;
		if(obj instanceof Array){
			for(let i=0,l=obj.length;i<l;i++) ObjectUtil.remove_attribute(obj[i],att);
			return;
		}
		
		if(obj.hasOwnProperty(att)) delete obj[att];
		for(let i in obj) ObjectUtil.remove_attribute(obj[i],att);
	}
	
	static copy (a, b, d, f) 
	{
		if (!a || typeof a != "object") return a;
		let c,e;
		if (a instanceof a.constructor && a.constructor !== Object) {
			if(b){
				c = ObjectPool.create(b);
				
				for (e in a){
					if(!f && typeof(a[e])=="function") continue;
					if (c.hasOwnProperty(e)) c[e] = a[e];
				}
			}
			else c = ObjectUtil.cloneObj(a);
		} 
		else for (e in c = {}, a) c[e] = a[e]; 
		
		if (d) for (e in d)  c[e] = d[e];
		return c
	}
}
