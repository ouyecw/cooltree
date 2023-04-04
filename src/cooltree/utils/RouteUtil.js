import StringUtil from './StringUtil.js'

/**
 * @class
 * @module RouteUtil
 */
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
		
		try{
			navigator.clipboard.writeText(data);
			return;
		}
		catch(err){}
		
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
	
	/**
	 * 下载文件
	 *  @param {Object} data blob
	 *  @param {String} type
	 *  @example 
	 *  const data=await new Ajax().post(url,param,{ responseType: 'blob'});
	 *  RouteUtil.download(data);
	 */
	static async download(data,type="zip",name=null)
	{
		if(!data) return;
	
		const blob = (data instanceof Blob) ? data : new Blob([data], { type: "application/"+type });
		const timestamp = (new Date()).valueOf();
		
		if (window.navigator.msSaveOrOpenBlob) {
		    navigator.msSaveBlob(blob, (name || timestamp)+'.'+type);
			return;
		}
		
		RouteUtil.downloadByURL((name || timestamp)+'.'+type,URL.createObjectURL(blob));
	}
	
	/**
	 * 下载文件
	 * @param {Object} name 文件名
	 * @param {Object} url  文件地址
	 */
	static async downloadByURL(name,url)
	{
		const aLink = document.createElement("a");
		const urlObject = window.URL || window.webkitURL;
		
		aLink.href = url;
		aLink.download = name;
		
		document.body.appendChild(aLink);
		aLink.click();
		
		urlObject.revokeObjectURL(aLink.href);
		document.body.removeChild(aLink);
	}
	
	/**
	 * 打印
	 * @param {Object|String} data
	 * @param {Number} width
	 * @param {Number} height
	 */
	static print(node,width=0,height=0)
	{
		if(!node) return;
		
		const iframe = document.createElement('iframe');
		document.body.appendChild(iframe);
		
		const doc = iframe.contentWindow.document;
		doc.body.setAttribute('style',`width:${width ? width+'px' : '100%'};height:${height ? height+'px' : 'auto'}`);
		
		if(typeof node=='string'){
			doc.write(node);
			doc.close();
		}
		else  doc.body.appendChild(node);
		
		iframe.contentWindow.focus();
		iframe.contentWindow.print();
		document.body.removeChild(iframe);
	}
}