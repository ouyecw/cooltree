/**
 * @class
 * @module MapUtil
 */
export default class MapUtil
{
	static mapToObj(strMap,toArray=false)
	{
		if(toArray) return [...strMap];
		let obj = Object.create(null);
	    for (let [k,v] of strMap) {
	      if(typeof k=="object") return MapUtil.mapToObj(strMap,true);
	      obj[k] = v;
	    }
	    return obj;
	}
	
	static objToMap(obj)
	{
		if(obj instanceof Array) return new Map(obj);
		let strMap = new Map();
	    for (let k of Object.keys(obj)) {
	       strMap.set(k, obj[k]);
	    }
	    return strMap;
	}
}
