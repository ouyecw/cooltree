ObjectPool={};
ObjectPool.max=50;
ObjectPool._dic={};
ObjectPool.COUNT=0;

/**
 * 创建一个对象
 * @param {Object} value class
 * @param {Array} args  params
 */
ObjectPool.create=function(value,args)
{
	let type=ClassUtil.getQualifiedClassName(value);
	let item,list=ObjectPool._dic[type];
	
	if (list && list.length)
	{
		item = list.pop();
		if (list.length == 0) delete ObjectPool._dic[type];
	}
	else{
		item=new value();
	}
	
	if(args==undefined) return item;
	value.prototype.constructor.apply(item,args);
	return item;
}

/**
 * 回收一个对象
 * 
 */
ObjectPool.remove=function(obj)
{
	if(obj==null) return;
	var str,type=ClassUtil.getQualifiedClassName(obj);
	
	if (!ObjectPool._dic[type])
		ObjectPool._dic[type] = [];
		
	if(obj.hasOwnProperty("name") && !StringUtil.isEmpty(obj.name)){
		str=obj.name;
		str=str.split("_");
		str.pop();
		
		if(ObjectPool.COUNT>10000) ObjectPool.COUNT=0;
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
ObjectPool.clear=function (value)
{
	if(value==undefined){
		ObjectPool._dic={};
	}else{
		const type=ClassUtil.getQualifiedClassName(value);
		delete ObjectPool._dic[type];
	}
}

ObjectPool.getInfo=function()
{
	var name,str="[";
	for(name in ObjectPool._dic) str+=name+":"+ObjectPool._dic[name].length+"; ";
	return str+"]";
}
