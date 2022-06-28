
import ArrayUtil from './ArrayUtil.js'

/**
 * @class
 * @module JSONUtil
 */
export default class JSONUtil
{
	/**
	 * 压缩对象
	 * @property {Object|Array} data 
	 * @property dic 不需要传值
	 */
	static encode(data,dic=null)
	{
		if(!data) return;
		
		const isRoot=dic==null;
		const isArray=data instanceof Array;
		
		dic=isRoot ? [] : dic;
		data=isArray ? data : [data];

		let ki,o,sub,length,keys,indexs,klength,result,i,j;	
		length = data.length;
		keys=[];
		
		if(length>1){
			for(i of data){
				j= Object.keys(i||{});
				keys=keys.concat(j);
			}
			
			keys=ArrayUtil.createUniqueCopy(keys);
		}else{
			keys=Object.keys(length && data[0] ? data[0] : {});
		}
		
		indexs = keys.map(prop=>{
			if(dic.indexOf(prop)>=0) return dic.indexOf(prop);
			
			dic.push(prop);
			return dic.length-1;
		});
			
		for (
			klength = keys.length,
			result = Array(length * klength),
			
			i = 0,
			j = 0;
			i < length; 
			++i
		){
			for (
				o = data[i], ki = 0;
				ki < klength;
			){
				sub=o[keys[ki++]];
				result[j++] = typeof sub=="object" ? JSONUtil.encode(sub,dic) : sub;
			}
		}
		
		const obj=[[klength].concat(indexs, result),isArray?1:0];
		if(isRoot) obj.push(dic.reverse());
		return obj;
	}
	
	/**
	 * 解压数据
	 * @property {Array} data 
	 * @property dic 不需要传值
	 */
	static discode(data,dic=null)
	{
		if(!data || data.length<2 || data.length>3 || !data[0] || !data[0].length) return;
		let length,klength,result,ki, o,prop,item,hlist,i,j;
		
		dic=dic || data[2].reverse();
		hlist=data[0];
		
		for (length = hlist.length,
			klength = hlist[0],
			
			result = Array(((length - klength - 1) / klength) || 0),
			i = 1 + klength,
			j = 0;
			i < length;) 
		{
			for (
				result[j++] = (o = {}), ki = 0;
				ki < klength;
			){
				prop=hlist[++ki];
				prop=dic[prop];
				item=hlist[i++];
				
				if(item!=undefined) 
					o[prop] = typeof item=="object" ? JSONUtil.discode(item,dic) : item;
			}
		}
		
		return data[1] ? result : result[0];
	}
}