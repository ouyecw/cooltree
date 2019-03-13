
class ArrayUtil
{
	/**
	 * 搜索数组属性值 返回位置
	 * @param {Array} array
	 * @param {String} property
	 * @param {Object} data
	 */
	static indexByProperty(array,property,data)
	{
		if(array==null || array.length<1 || StringUtil.isEmpty(property)) return -1;
		return array.findIndex(function(value, index, arr) {
		  return value[property]==data;
		});
	}
	
	/**
	 * 数组排序
	 * @param {Array} array       数组
	 * @param {String} property   数组每项的属性 可以为null
	 * @param {Boolean} order     true 由大到小 false||null 由小到大
	 * @param {Number}  num       字符串位数
	 */
	static sort(array,property,order,num)
	{
		if(array==null || array.length<2 ) return;
					
		return MathUtil.sort(array,function(a,b){
	        let value1 = StringUtil.isEmpty(property) ? a : a[property];
	        let value2 = StringUtil.isEmpty(property) ? b : b[property];
	        let is_number=!isNaN(parseFloat(value1));
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
	static createUniqueCopy(array)
	{
		return [...new Set(array)];
	}
	
	/**
	 * 根据一个长度（整数） 生成一数组
	 * @param {Number} length 整数
	 * @param {Boolean} order true 由大到小 false 由小到大
	 */
	static buildNumberArray(length,order)
	{
		if(length==null || isNaN(Number(length))) return null;
		length=MathUtil.int(length);
		let r=[],i=(order ? length-1 : 0);
		
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
	static mixArray(array)
	{
		if(array==null) return;
		let i,d,l=array.length,r=MathUtil.randomInt(l);
		
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
	static sameItems(arrayA,arrayB,order)
	{
		if(arrayA==null || arrayB==null) return null;
		if(order==true) return (arrayA.join(",")==arrayB.join(","));
		if(arrayA.length!=arrayB.length) return false;
		
		for(let i in arrayA){
			if(arrayB.indexOf(arrayA[i])<0) return false;
		}
		
		return true;
	}
	
	/**
	 * 复制数组
	 * @param {Array} source 目标数组
	 * @param {Array} array  复制对象
	 */
	static copyArray(source=[],array)
	{
		source.push(...array);
		return source;
	}
	
	/**
	 * 每一项调用
	 * @param {Array} array
	 * @param {Function} func
	 * @param {Object} target
	 */
	static each(array,func,target)
	{
		if (!array || !array.length) return array;
		for (let [index, elem] of array.entries()) {
		  func.apply(target,[elem,index,array]);
		}
		return array;
	}
	
	static format(array)
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
}
