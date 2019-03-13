/**
 * =========================================
 *  Ajax Class
 * =========================================
 */

class Ajax
{
	constructor()
	{
		this.responseType = null;
		this._responseType= null;
	}
	
	/**
	 * GET请求
	 * @param {String} url 
	 * @param {Object} data
	 * @param {Function} oncomplete
	 * @param {Function} onerror
	 * @param {Boolean} use_form_data 是否使用表格数据传值
	 * @param {Boolean} async true为同步
	 */
	get  (url, data, oncomplete, onerror,use_form_data,async) 
	{
		this.getRequest("GET", url, data, oncomplete, onerror,use_form_data,async);
	}
	
	/**
	 * POST请求
	 * @param {String} url 
	 * @param {Object} data
	 * @param {Function} oncomplete
	 * @param {Function} onerror
	 * @param {Boolean} use_form_data 是否使用表格数据传值
	 * @param {Boolean} async true为同步
	 */
	post  (url, data, oncomplete, onerror,use_form_data,async) 
	{
		this.getRequest("POST", url, data, oncomplete, onerror,use_form_data,async);
	}
	
	getHttp  () 
	{
		let XmlHttp;
	    if (Global.root.ActiveXObject) {
	        let arr = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.5.0",
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
	
	getRequest  (t, url, d, oncomplete, err,use_form_data,async) 
	{
		let s = this, k, data = "", a = "",block=(use_form_data==true),sub,st;
		async=(async==true ? false : true);
		s.err = err;
		let ajax = s.getHttp();
		if (!ajax) {
			return;
		}
		
		if(d && typeof d !="string" && !block){
			for (k in d) {
				sub=d[k];
				st=(typeof sub)
				
				if(st!="number" && (st!="string" || (sub.indexOf("data:")==0 && sub.indexOf(";base64,")>0))){
					block=true;
					break;
				}
				
				data += (a + k + "=" + sub);
				a = "&";	
			}
		}
		
		if(d && typeof d !="string" && block){
			data=new FormData();
			for (k in d) {
				sub=d[k];
				st=(typeof sub);
				
				if(st=="string" && (sub.indexOf("data:")==0 && sub.indexOf(";base64,")>0)){
					sub=sub.split(",");
					sub.shift();
					sub=sub.join(",");
				}
				
				data.append(k, sub);
			}
		}
		
		if(d && typeof d =="string"){
			data=d;
		}
		
		if (t.toLowerCase() == "get" && data.length > 0) {
			url += ((url.indexOf('?') >= 0 ? '&' : '?') + data);
			data = null;
		}
		ajax.open(t, url, async);
	
		if(!block) ajax.setRequestHeader("Content-Type", (s.responseType == Ajax.JSON) ? "application/json" :"application/x-www-form-urlencoded");
		
		ajax._responseType=StringUtil.getPathExt(url);
		
		if (s.responseType) {
			try{
				ajax.responseType = s.responseType;
			}catch(e){
				if(s.responseType == Ajax.JSON) ajax._responseType = "json";
			}
			
			s.responseType = Ajax.TEXT;
		}
		
		ajax.onreadystatechange = function () {
			if (ajax.readyState == 4) {
				if (ajax.status >= 200 && ajax.status < 300 || ajax.status === 304) {
					if (oncomplete) {
						if(ajax._responseType == Ajax.JSON){
							oncomplete(JSON.parse(ajax.responseText));
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
				} else {
					if (err) {
						err(ajax);
					}
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