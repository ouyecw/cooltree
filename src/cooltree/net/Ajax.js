/**
 * =========================================
 *  Ajax Class
 * =========================================
 */
import StringUtil from '../utils/StringUtil.js'
import Global from '../core/Global.js'

export default class Ajax
{
	constructor(type="json")
	{
		this.responseType = type;
		this._responseType= null;
	}
	
	/**
	 * GET请求
	 * @param {String} url 
	 * @param {Object} data
	 * @param {Object} config
	 * {useFormData 是否使用表格数据传值 ,withCredentials,async 异步/同步,headers}
	 */
	get  (url, data, config=null) 
	{
		return new Promise(function(resolve, reject){ 
			this.getRequest("GET", url, data, resolve, reject,config)
		}.bind(this));
	}
	
	/**
	 * POST请求
	 * @param {String} url 
	 * @param {Object} data
	 * @param {Object} config 
	 * {useFormData 是否使用表格数据传值 ,withCredentials,async 异步/同步,headers}
	 */
	post  (url, data, config=null) 
	{
		if(Ajax.POST_USE_FORMDATA) {
			if(!config) config={};
			config.useFormData=true;
		}
		
		return new Promise(function(resolve, reject){ 
			this.getRequest("POST", url, data, resolve, reject,config)
		}.bind(this));
	}
	
	getHttp  () 
	{
		let XmlHttp;
	    if (Global.root.ActiveXObject) {
	        const arr = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.5.0",
	            "MSXML2.XMLHttp.4.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp", "Microsoft.XMLHttp"];
	        for (let i = 0; i < arr.length; i++) {
	            try {
	                XmlHttp = new ActiveXObject(arr[i]);
	                return XmlHttp;
	            }
	            catch (error) { }
	        }
	    }
	    else {
	        try {
	            XmlHttp = new XMLHttpRequest();
	            return XmlHttp;
	        }
	        catch (otherError) { }
	    }
	    
	    return false;
	}
	
	getRequest  (t, url, d, oncomplete, onerror,config=null) 
	{
		let s = this, k, data = "", a = "",block=(config && config.useFormData==true),sub,st;
		const is_async=(config && config.async==true ? false : true);
		
		const ajax = s.getHttp();
		if (!ajax) return;
		
		if(config && config.with_credentials){
			try{
				ajax.withCredentials = true;
			}
			catch(error){};
		}
		
		if(d && typeof d !="string" && !block){
			for (k in d) {
				sub=d[k];
				st=(typeof sub)
				
				if(st!="number" && (st!="string" || (sub.indexOf("data:")==0 && sub.indexOf(";base64,")>0))){
					block=true;
					break;
				}
				
				data += (a + k + "=" + encodeURIComponent(sub));
				a = "&";	
			}
		}
		
		if(d && typeof d !="string" && block && !(d instanceof FormData)){
			data=new FormData();
			for (k in d) {
				sub=d[k];
				st=(typeof sub);
				
				if(Ajax.REMOVE_TYPE && st=="string" && (sub.indexOf("data:")==0 && sub.indexOf(";base64,")>0)){
					sub=sub.split(",");
					sub.shift();
					sub=sub.join(",");
				}
				
				data.append(k, sub);
			}
		}else if(!data && d && typeof d =="string"){
			data=d;
		}
		
		if (t.toLowerCase() == "get" && typeof data =="string" && data.length > 0) {
			url += ((url.indexOf('?') >= 0 ? '&' : '?') + data);
			data = null;
		}
		
		ajax.open(t, url, is_async);
		
		const headers=config && config.headers ? config.headers : null;
		// (!block && s.responseType == Ajax.JSON ? {"Content-Type":"application/json"} : null);
					
		if(headers){
			for(let name in headers){
				try{
					ajax.setRequestHeader(name,headers[name]);
				}
				catch(error){};
			}
		}
		
		ajax._responseType=StringUtil.getPathExt(url);
		
		if (s.responseType) {
			try{
				ajax.responseType = s.responseType;
			}
			catch(error){};
			ajax._responseType = s.responseType;
		}
		
		ajax.onreadystatechange = function () {
			if (ajax.readyState == 4) {
				if (ajax.status >= 200 && ajax.status < 300 || ajax.status === 304) {
					if (oncomplete) {
						if(ajax._responseType == Ajax.JSON){
							oncomplete(ajax.response || JSON.parse(ajax.responseText));
						}
						else if(ajax._responseType == Ajax.PROP){
							oncomplete(PropUtil.parseProperties(ajax.responseText));
						}
						else if (ajax.responseType == Ajax.ARRAY_BUFFER || ajax.responseType == Ajax.BLOB || ajax.responseType == Ajax.JSON) {
							oncomplete(ajax.response);
						} 
						else if (ajax.responseText.length > 0) {
							oncomplete(ajax.responseText);
						} 
						else {
							oncomplete(null);
						}
					}
				} 
				else if (onerror){
					onerror(ajax.status);
				}
	 		}
		};
		ajax.send(data);
	}
}

Ajax.TEXT = "text";
Ajax.JSON = "json";
Ajax.BLOB = "blob";
Ajax.PROP = "prop";
Ajax.ARRAY_BUFFER = "arraybuffer";

//base64图片数据，是否移除头部类型
Ajax.REMOVE_TYPE=false;

//post数据时，是否自动默认表格数据
Ajax.POST_USE_FORMDATA=false;

Ajax.className="Ajax";