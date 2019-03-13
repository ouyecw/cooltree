/**
 * ================================================
 *  URLLoader class
 * ================================================
 * Shine Chen s_c@live.com 2015/05/04
 */

class URLLoader extends EventDispatcher
{
	constructor()
	{
		super();
		this.content = null;
		this.type = null;
	}
	
	load  (u) 
	{
		let type;
		const target=this;
		const ext = StringUtil.getPathExt(u);
		
		if (ext == "txt") {
			type = URLLoader.TYPE_TEXT;
		} else if (ext == "json") {
			type = URLLoader.TYPE_JSON;
		}else if (ext == "js") {
			type = URLLoader.TYPE_JS;
		}else if (ext == "prop") {
			type = URLLoader.TYPE_PROP;
		}else if (ext == "css") {
			type = URLLoader.TYPE_CSS;
		}
		else retrun;
		this.type =type;
	
		if (type == URLLoader.TYPE_TEXT || type == URLLoader.TYPE_JSON || type == URLLoader.TYPE_PROP) {
			let ajax = new Ajax();
			ajax.get(u, {}, function (data) {
				target.content = data;
				target.dispatchEvent(Factory.c("ev",[Event.COMPLETE]));
				target.removeEventListener(Event.COMPLETE);
				target.removeEventListener(Event.ERROR);
			},function (a){
				target.content = null;
				target.dispatchEvent(Factory.c("ev",[Event.ERROR]));
				target.removeEventListener(Event.COMPLETE);
				target.removeEventListener(Event.ERROR);
			});
		}
	    else if (type == URLLoader.TYPE_JS) {
			target.content = document.createElement("script");
			target.content.onload =function() {
				target.dispatchEvent(Factory.c("ev",[Event.COMPLETE]));
				target.removeEventListener(Event.COMPLETE);
	            target.removeEventListener(Event.ERROR);
			};
			
			target.content.onerror =function() {
				target.dispatchEvent(Factory.c("ev",[Event.ERROR]));
				target.removeEventListener(Event.COMPLETE);
				target.removeEventListener(Event.ERROR);
			};
			
			target.content.src = u;
			target.content.type = "text/javascript";
			document.querySelector('head').appendChild(target.content);
		}
		else if (type == URLLoader.TYPE_CSS) {
			target.content = document.createElement("link");
			target.content.rel = "stylesheet";
			target.content.type = "text/css";
			
			target.content.onload =function () {
				target.dispatchEvent(Factory.c("ev",[Event.COMPLETE]));
				target.removeEventListener(Event.COMPLETE);
				target.removeEventListener(Event.ERROR);
			}
			
			target.content.onerror =function () {
				target.dispatchEvent(Factory.c("ev",[Event.ERROR]));
				target.removeEventListener(Event.COMPLETE);
				target.removeEventListener(Event.ERROR);
			};
			
			target.content.href = u;
			document.querySelector('head').appendChild(target.content);
		}
	}
	
	/**
	 * @param {Object} data
	 * @param {String} type svg "image/svg+xml" xml "text/xml"
	 */
	static parseXML (data, type) 
	{
		let n = null;
	
		if(Global.root.DOMParser){
			try{
				n = (new DOMParser).parseFromString(data, type);
			}catch(e){}
		}
		else if(Global.root.ActiveXObject){
			let xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
			for(let i=0;i<xmlDomVersions.length;i++){
				try{
					n = new ActiveXObject(xmlDomVersions[i]);
					break;
				}catch(e){}
			}
			
			if(n){
				n.async = false;
				n.loadXML(data);
			}
		}
		
		return n;
	//	return window.DOMParser ? n = (new DOMParser).parseFromString(data, type) : (n = new ActiveXObject("Microsoft.XMLDOM"), n.async = !1, n.loadXML(data)), n;
	}

}

URLLoader.TYPE_TEXT = "text";
URLLoader.TYPE_JSON = "json";
URLLoader.TYPE_PROP = "prop";

URLLoader.TYPE_CSS = "css";
URLLoader.TYPE_JS  = "js";

