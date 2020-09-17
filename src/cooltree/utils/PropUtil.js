

export default class PropUtil
{
	static parseProperties(data)
	{
		const currentMap = {};
	    const newData = data.replace(/[\r\n]/g,"\n");
		const dateArray = newData.split("\n");
		
		let i,str,index,key,val;
				
		for(i=0;i<dateArray.length;i++)
		{
			str=dateArray[i];
			
			if(str == null || str.length < 3) 
			{
				continue;
			}
			
			if(str.charAt(0) == "#") 
			{
				continue;
			}
			
			index=dateArray[i].indexOf("=");
			if(index < 0) 
			{
				continue;
			}
			
			key = StringUtil.trim(str.substring(0,index));
			val = StringUtil.trim(str.substring(index+1,str.length));
			
			currentMap[key]=val;
		}
		
		return currentMap;
	}
}
