/**
 * @class
 * @module UniqueUtil
 */
export default class UniqueUtil
{
	static getName(label)
	{
		if(!UniqueUtil.dic.hasOwnProperty(label) || !Number.isFinite(UniqueUtil.dic[label])){
			UniqueUtil.dic[label]=0;
		}else{
			UniqueUtil.dic[label]++;
		}
		
		return label+UniqueUtil.dic[label];
	}
}

UniqueUtil.dic={};