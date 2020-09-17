import StringUtil from './StringUtil.js'

export default class RouteUtil
{
	/**
	 * @param {type} 0 all,1 ?,2 # 
	 */
	static getQuery(type=0)
	{
		const query_string=type==1 ? location.search.substr(1) : location.hash.substr(1);
		const data=StringUtil.parseParams(query_string);
		if(type!=0) return data;
		
		const data2=StringUtil.parseParams(location.search.substr(1));
		return Object.assign(data, data2);
	}
	
	/**
	 * @param {Object} data
	 */
	static copy(data)
	{
		if(!data) return;
		const transfer = document.createElement('input');
		document.body.appendChild(transfer);
		transfer.value = data;
		
		transfer.focus();
		transfer.select();
		
		try{
		  document.execCommand('copy');
		}
		catch(err){}
		
		transfer.blur();
		document.body.removeChild(transfer);
	}
}