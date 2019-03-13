
class ObjectPool
{
	/**
	 * 创建一个对象
	 * @param {Object} value class
	 * @param {Array} args  params
	 */
	static create(value,args)
	{
		let type=ClassUtil.getQualifiedClassName(value);
		let item,list=ObjectPool._dic[type];
		
		if (list && list.length)
		{
			item = list.pop();
			if (list.length == 0) delete ObjectPool._dic[type];
			if(item && args && (args instanceof Array) && item.reset && typeof item.reset=="function"){
				item.reset(...args);
			}
		}
		else if(args && (args instanceof Array)){
			item=new value(...args);
		}
		else{
			item=new value();
		}
		
		return item;
	}
	
	/**
	 * 有多少该类型缓存
	 */
	static length(value)
	{
		const type=(typeof value==="string" ? value : ClassUtil.getQualifiedClassName(value));
		const list=ObjectPool._dic[type];
		return !list ? 0 : list.length;
	}
	
	/**
	 * 回收一个对象
	 * 
	 */
	static remove(obj)
	{
		if(obj==null) return;
		let str,type=ClassUtil.getQualifiedClassName(obj);
		
		if (!ObjectPool._dic[type])
			ObjectPool._dic[type] = [];
			
		if(obj.hasOwnProperty("name") && !StringUtil.isEmpty(obj.name)){
			str=obj.name;
			str=str.split("_");
			str.pop();
			
			if(ObjectPool.COUNT>900000) ObjectPool.COUNT=0;
			else   ObjectPool.COUNT++;
			
			str.push("pool"+ObjectPool.COUNT);
			str=str.join("_");
		}
				
		try{
			obj.reset();
		}
		catch(e){
			try{
				obj.dispose();
			}
			catch(e) {
				trace("[WARN] ObjectPool.remove dispose class by",type,"detail:"+e.toString());
			}
			return false;
		}
		
		if(ObjectPool.max>0 && (ObjectPool._dic[type]).length>=ObjectPool.max){
			try{
				obj.dispose();
			}
			catch(e) {};
			
			obj=null;
			return false;
		}
				
		if((ObjectPool._dic[type]).indexOf(obj)==-1) {
			if(!StringUtil.isEmpty(str)) obj.name=str;
			(ObjectPool._dic[type]).push(obj);
		}	
		
		return true;
	}
	
	/**
	 * 清除缓存
	 * 
	 */
	static clear (value)
	{
		if(value==undefined){
			ObjectPool._dic={};
		}else{
			const type=ClassUtil.getQualifiedClassName(value);
			delete ObjectPool._dic[type];
		}
	}
	
	static getInfo()
	{
		let name,str="[";
		for(name in ObjectPool._dic) str+=name+":"+ObjectPool._dic[name].length+"; ";
		return str+"]";
	}
}

ObjectPool.max=50;
ObjectPool._dic={};
ObjectPool.COUNT=0;
