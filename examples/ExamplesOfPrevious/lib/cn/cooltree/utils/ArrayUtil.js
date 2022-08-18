ArrayUtil={};

/**
 * 搜索数组属性值 返回位置
 * @param {Array} array
 * @param {String} property
 * @param {Object} data
 * @param {Boolean} all 所有项或者第一个项
 */
ArrayUtil.indexByProperty=function(array,property,data,all)
{
	if(array==null || array.length<1 || StringUtil.isEmpty(property)) return -1;
	var i,d,l=array.length,r=[];
	
	for(i=0;i<l;i++)
	{
		d=array[i];
		if(d && d.hasOwnProperty(property) && d[property]==data){
			if(!all) return i;
			r.push(i);
		}
	}
	
	return r.length<1 ? -1 : r;
}

/**
 * 数组排序
 * @param {Array} array       数组
 * @param {String} property   数组每项的属性 可以为null
 * @param {Boolean} order     true 由大到小 false||null 由小到大
 * @param {Number}  num       字符串位数
 */
ArrayUtil.sort=function(array,property,order,num)
{
	if(array==null || array.length<2 ) return;
				
	return MathUtil.sort(array,function(a,b){
        var value1 = StringUtil.isEmpty(property) ? a : a[property];
        var value2 = StringUtil.isEmpty(property) ? b : b[property];
        var is_number=!isNaN(parseFloat(value1));
        value1 = is_number ? parseFloat(value1) : StringUtil.trim(value1);
        value2 = is_number ? parseFloat(value2) : StringUtil.trim(value2);
        if(is_number) return (order ? value2>value1 : value1>value2);
        value1 = value1.length>0 ? value1.toLowerCase() : "";
        value2 = value2.length>0 ? value2.toLowerCase() : "";
        value1 = (num && value1.length>num) ? value1.substr(0,num) : value1;
        value2 = (num && value2.length>num) ? value2.substr(0,num) : value2;
        return (order ? value2>value1 : value1>value2);
	});
}

/**
 * 拷贝一个数组中数据（剔除重复数据）
 * @param {Array} array
 */
ArrayUtil.createUniqueCopy=function(array)
{
	if(array==null || array.length<1) return [];
	var i,d,l=array.length,r=[];
	
	for(i=0;i<l;i++)
	{
		d=array[i];
		if(r.indexOf(d)==-1){
			r.push(d);
		}
	}
	
	return r;
}

/**
 * 根据一个长度（整数） 生成一数组
 * @param {Number} length 整数
 * @param {Boolean} order true 由大到小 false 由小到大
 */
ArrayUtil.buildNumberArray=function(length,order)
{
	if(length==null || isNaN(Number(length))) return null;
	length=MathUtil.int(length);
	var r=[],i=(order ? length-1 : 0);
	
	while(order ? i>0 : i<length) {
		r.push(i);
		i=(order ? i-1 : i+1);
	}
	
	return r;
}

/**
 * 混乱数组
 * @param {Array} array
 */
ArrayUtil.mixArray=function(array)
{
	if(array==null) return;
	var i,d,l=array.length,r=MathUtil.randomInt(l);
	
	for(i=0;i<l;i++)
	{
		if(r!=i){
			d=array[r];
			array[r]=array[i];
			array[i]=d;
		}
		
		r=MathUtil.randomInt(l);
	}
	
	return array;
}

/**
 * 两个数组 所有项是否相同
 * @param {Array} arrayA
 * @param {Array} arrayB
 * @param {Boolean} order 是否顺序也要相同
 */
ArrayUtil.sameItems=function(arrayA,arrayB,order)
{
	if(arrayA==null || arrayB==null) return null;
	if(order==true) return (arrayA.join(",")==arrayB.join(","));
	if(arrayA.length!=arrayB.length) return false;
	
	for(var i in arrayA){
		if(arrayB.indexOf(arrayA[i])<0) return false;
	}
	
	return true;
}

/**
 * 复制数组
 * @param {Array} source 目标数组
 * @param {Array} array  复制对象
 */
ArrayUtil.copyArray=function(source,array)
{
	source || (source=[]);
	if (!array)return source;
	source.length=array.length;
	var i=0,len=array.length;
	for (i=0;i < len;i++){
		source[i]=array[i];
	}
	return source;
}

/**
 * 每一项调用
 * @param {Array} array
 * @param {Function} func
 * @param {Object} target
 */
ArrayUtil.each=function(array,func,target)
{
	if (!array || !array.length) return array;
	var i=0,len=array.length;
	for (i=0;i < len;i++){
		func.apply(target,[array[i],i,array]);
	}
	return array;
}

ArrayUtil.format=function(array)
{
	if (!array || !array.length) return [];
	let i=0,item,len=array.length;
	for (i=0;i < len;i++){
		item=array[i];
		if(StringUtil.isEmpty(item)) {
			array.splice(i,1);
			len--;
			i--;
		}
	}
	return array;
}