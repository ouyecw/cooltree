import StringUtil from './StringUtil.js'
import ObjectUtil from './ObjectUtil.js'
import MathUtil from './MathUtil.js'

/**
 * @class
 * @module ArrayUtil
 */
export default class ArrayUtil
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
		  return (typeof value=="object" && ObjectUtil.getAttribute(value,property)==data);
		});
	}
	
	/**
	 * 数组排序
	 * @param {Array} array       数组
	 * @param {String} property   数组每项的属性 可以为null
	 * @param {Boolean} order     true 由大到小 false||null 由小到大
	 * @param {Number}  num       字符串位数
	 */
	static sort(array,property=null,order=false,num=null)
	{
		if(array==null || array.length<2 ) return array;
					
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
	 * @param {String} property
	 * @param {Boolean} original 是原对象还是仅返还属性值
	 * @param {Array} target 返回对象
	 * @param {String} 包含子数组的属性
	 */
	static createUniqueCopy(array,property=null,original=true,target=null,attr=null)
	{
		if(!array) return null;
		if(!property) return [...new Set(array)];
		
		const arr=target ? target : [];
		let item,index;
		
		for(item of array){
			index=arr.length ? (original ? ArrayUtil.indexByProperty(arr,property,item[property]) : arr.indexOf(item[property])) : -1;
			if(index>=0) continue;
			arr.push(original ? item : item[property]);
			if(!attr || !item[attr] || !item[attr].length) continue;
			ArrayUtil.createUniqueCopy(item[attr],property,original,arr,attr);
		}
		
		return arr;
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
	static equal(arrayA,arrayB,order)
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
	 * 两个数组相减 arrayA减arrayB
	 * @param {Array} arrayA
	 * @param {Array} arrayB
	 */
	static subtract(arrayA,arrayB)
	{
		if(!arrayB) return arrayA;
		arrayA=ArrayUtil.copyArray(arrayA);
		
		for(let item of arrayB){
			const index=arrayA.indexOf(item);
			if(index>=0) arrayA.splice(index,1);
		}
		
		return arrayA;
	}
	
	/**
	 * 两个数组相加 arrayA加arrayB去重
	 * @param {Array} arrayA
	 * @param {Array} arrayB
	 * @param {Number} length 限制长度 0为不限制
	 */
	static add(arrayA,arrayB,length=0)
	{
		if(!arrayB) return arrayA;
		arrayA=ArrayUtil.createUniqueCopy(arrayA.concat(arrayB));
		if(length && arrayA.length>length) arrayA=arrayA.slice(0,length);
		return arrayA;
	}
	
	/**
	 * 复制数组
	 * @param {Array} array  复制对象
	 * @param {Array} source 目标数组
	 */
	static copyArray(array,source=[])
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
	
	/**
	 * 一个数组，根据长度，截取成二维数组
	 * @param {Object} array
	 * @param {Object} length
	 */
	static slice(array,length)
	{
		if(array.length<=length) return [array];
		const n=Math.ceil(array.length/length);
		const d=[];
		
		for(let i=0;i<n;i++){
			d.push(array.slice(i*length,Math.min((i+1)*length,array.length)));
		}
		
		return d;
	}
}
