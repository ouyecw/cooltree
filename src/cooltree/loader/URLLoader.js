/**
 * ================================================
 *  URLLoader class
 * ================================================
 * Shine Chen s_c@live.com 2015/05/04
 */
import EventDispatcher from '../events/EventDispatcher.js'
import StringUtil from '../utils/StringUtil.js'
import Event from '../events/Event.js'
import Global from '../core/Global.js'
import Ajax from '../net/Ajax.js'

/**
 * @class
 * @module URLLoader
 * @extends EventDispatcher
 */
export default class URLLoader extends EventDispatcher
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
		
		if (ext == "txt" || ext == "atlas") {
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
		else type = URLLoader.TYPE_BUFFER;
		this.type =type;
	
		if (type == URLLoader.TYPE_JS) {
			target.content = document.createElement("script");
			target.content.onload =function() {
				target.emit(new Event(Event.COMPLETE));
				target.off(Event.COMPLETE);
	            target.off(Event.ERROR);
			};
			
			target.content.onerror =function() {
				target.emit(new Event(Event.ERROR));
				target.off(Event.COMPLETE);
				target.off(Event.ERROR);
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
				target.emit(new Event(Event.COMPLETE));
				target.off(Event.COMPLETE);
				target.off(Event.ERROR);
			}
			
			target.content.onerror =function () {
				target.emit(new Event(Event.ERROR));
				target.off(Event.COMPLETE);
				target.off(Event.ERROR);
			};
			
			target.content.href = u;
			document.querySelector('head').appendChild(target.content);
		}
		else {
			let ajax = new Ajax(URLLoader.getType(type));
			ajax.get(u).then(function(data){
				target.content = data;
				target.emit(new Event(Event.COMPLETE));
				target.off(Event.COMPLETE);
				target.off(Event.ERROR);
			}).catch(function(error){
				console.log("[ERROR]",error);
				target.content = null;
				target.emit(new Event(Event.ERROR));
				target.off(Event.COMPLETE);
				target.off(Event.ERROR);
			});
		}
	}

	static getType(type)
	{
		switch(type)
		{
			case URLLoader.TYPE_TEXT:
				return Ajax.TEXT;

			case URLLoader.TYPE_JSON:
				return Ajax.JSON;

			case URLLoader.TYPE_PROP:
				return Ajax.PROP;
		}

		return Ajax.ARRAY_BUFFER;
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
	}

}

URLLoader.TYPE_BUFFER = "arraybuffer";
URLLoader.TYPE_TEXT   = "text";
URLLoader.TYPE_JSON   = "json";
URLLoader.TYPE_PROP   = "prop";

URLLoader.TYPE_CSS = "css";
URLLoader.TYPE_JS  = "js";

URLLoader.className="URLLoader";