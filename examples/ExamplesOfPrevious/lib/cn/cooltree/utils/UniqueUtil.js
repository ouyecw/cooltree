UniqueUtil={}

UniqueUtil.dic={};

UniqueUtil.getName=function(label)
{
	if(!UniqueUtil.dic.hasOwnProperty(label)){
		UniqueUtil.dic[label]=0;
	}else{
		UniqueUtil.dic[label]++;
	}
	
	return label+UniqueUtil.dic[label];
}
