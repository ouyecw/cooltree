/**
===================================================================
Loader Class
===================================================================
**/
import EventDispatcher from '../events/EventDispatcher.js'
import ObjectUtil from '../utils/ObjectUtil.js'
import StringUtil from '../utils/StringUtil.js'
import WebAudio from '../media/WebAudio.js'
import URLLoader from './URLLoader.js'
import Event from '../events/Event.js'
import Media from '../media/Media.js'
import Global from '../core/Global.js'
import Video from '../media/Video.js'
import Sound from '../media/Sound.js'

/**
 * @class
 * @module Loader
 * @extends EventDispatcher
 */
export default class Loader extends EventDispatcher
{
	
	/**
	 * loader
	 * @param {Object} data Array or String
	 * @param {String} locale 
	 * @param {Object} callback String or Function
	 * @param {Object} target (for callback)
	 */
	constructor(data=null,locale=null,callback=null,target=null)
	{
		super();
		this.reset();
		this.once=true;
		this.locale=locale;
		this.fontDic=this.fontFormat=null;
		if(data) this.parse(data,callback,target);
	}
	
	parse(data,callback,target)
	{
		if(data==undefined) return;
		
		if(data instanceof Array){
			this._list=data;
			this._total=this._list.length;
			return;
		}
		
		if(callback && typeof data=="string"){
			if(this.load(data)) this._feedback=(typeof callback=="string") ? callback : {c:callback,t:target};
			return;
		}
		
		this._data=data;
	}
	
	errorHandler(e)
	{
		if(e && e.target){
			if(e.target instanceof Image){
				delete this._files[this._current_name];
				e.target.onerror=null;
				e.target.onload=null;
			}else if(e.target instanceof URLLoader){
				e.target.removeEventListener(Event.ERROR,this.__error_handler);
				e.target.removeEventListener(Event.COMPLETE,this.__load_handler);
			}else{
				e.target.removeEventListener(Media.MEDIA_ERROR,this.__error_handler);
				e.target.removeEventListener(Media.MEDIA_LOAD_COMPLETE,this.__load_handler);
			}
		}
		
		this.dispatchEvent(new Event(Loader.STEP_ERROR,this._current_name,this._current_label));
		trace("[ERROR] Loading path by",this._current_name);
		
		if(this._list.length>0){
			this._loaded++;
			this.load();
			return;
		}
		
		this.dispatchEvent(new Event(Loader.LOAD_COMPLETE,this._files,this._current_label));
	}
	
	loadHandler(e)
	{
		this._loaded++;
		if(this._list==undefined) return;
		
		if(e){
			if(e.target instanceof Image){
				e.target.onload=null;
				e.target.onerror=null;
			}else if(e.target instanceof URLLoader){
				e.target.removeEventListener(Event.ERROR,this.__error_handler);
				e.target.removeEventListener(Event.COMPLETE,this.__load_handler);	
			}else if(e.target){
				e.target.removeEventListener(Media.MEDIA_ERROR,this.__error_handler);
				e.target.removeEventListener(Media.MEDIA_LOAD_COMPLETE,this.__load_handler);
			}else if(e instanceof FontFace){
				document.fonts.add(e);
			}
		}
		
		let temp,fb;
		
		if(this._list.length>0){
			if(this.hasEventListener(Loader.LOAD_PROCESS)) 
			     this.dispatchEvent(new Event(Loader.LOAD_PROCESS,Math.ceil(100*this._loaded/this._total)));
			
			temp=this._files[this._current_name];
			
			while(!this.load() && this._list.length>0) {
				trace("[WARM] Loader miss path by",this._current_name);
				this._loaded++;
				this.load();
			}
			
			if(temp) this.dispatchEvent(new Event(Loader.STEP_COMPLETE,temp,this._current_label));
			else     this.dispatchEvent(new Event(Loader.STEP_ERROR,this._current_name,this._current_label));
		}else{
			if(this._feedback==null) {
				let name=this._current_name,label=this._current_label;
				temp=this._files;
				this.reset(true);
				
				this.dispatchEvent(new Event(Loader.STEP_COMPLETE,temp[name],label));
				this.dispatchEvent(new Event(Loader.LOAD_COMPLETE,temp,label));
				
			}else{
				fb=this._feedback;
				if(typeof this._feedback=="string"){
					temp=this._files[this._current_name].content;
					this.reset(true);
					this.parse(temp);
					this.load(fb);
					return;
				}else{
					temp=this._files[this._current_name];
					this.reset(true);
					
					try{
						fb.c.call(fb.t,temp,this);
						return;
					}catch(error){
						trace("[ERROR] Loader:loadHandler()",error);
					}
				}
			}
			
			if(this._data==null && this.once) this.dispose();
		}
	}
	
	loadXML(xmlUrl,name,local)
	{
		let xmlObj;
		if (Global.root.ActionXObject) {
			let activexName = ["Microsoft.XMLHTTP","Miscrosoft.XmlDom","MSXML.DOMDocument"];
			
			for (let i = 0; i < activexName.length; i++) {
				try {
					xmlObj = new ActionXObject(activexName[i]);
					break;
				} catch (e) {}
			}
		} else if (Global.root.XMLHttpRequest) {
			xmlObj = new XMLHttpRequest();
		}
		
		if (xmlObj==undefined) return;
		
		 xmlObj.onreadystatechange=function()
	     {
		     if (xmlObj.readyState!=4) return;
		     
		     if (xmlObj.status==200) 
		     {
		     	local._files[name]=xmlObj.responseXML ? xmlObj.responseXML : xmlObj.response;
		     }
		           
		     local.loadHandler();
	     };
		 xmlObj.open("GET",xmlUrl,true);
		 xmlObj.send(null);
	}
	
	/**
	 * @param {Object | String} data Array or String
	 */
	load(data=null)
	{
		if(data==undefined && this._list==null) return false;
		
		if(typeof data == "string"){
			this._loaded=0;
			if(this._data && this._data.hasOwnProperty(data)){
				this._list=this._data[data];
				this._total=this._list.length;
				this._current_label=data;
			}else if(!StringUtil.isEmpty(data) && data.indexOf(".")>0){
				this._list=[data];
				this._total=1;
			}
		}else{
			this.parse(data);
		}
		
		if(this._list==null) return false;
		
		if(this._list.length==0){
			this.dispatchEvent(new Event(Loader.LOAD_COMPLETE,this._files,this._current_label));
			return false;
		}
		
		if(this.__load_handler==null){
			this.__load_handler=Global.delegate(this.loadHandler,this);
		}
		
		if(this.__error_handler==null){
			this.__error_handler=Global.delegate(this.errorHandler,this);
		}
		
		let url,name,type,temp=this._list.shift();
		
		if(ObjectUtil.getType(temp)=="object"){
			url=(temp.hasOwnProperty("url")) ? temp.url : temp.data;
			type=StringUtil.getPathExt(url);
			name=(temp.hasOwnProperty("label")) ? temp.label : temp.name;
			name=StringUtil.isEmpty(name) ? Loader.getName(url) : name;
		}else{
			url=String(temp);
			type=StringUtil.getPathExt(url);
			name=Loader.getName(url);
		}
		
		if(StringUtil.isEmpty(url) || StringUtil.isEmpty(type)) return false;
		url=(this.locale && !StringUtil.exist(url,"http://","https://")) ? this.locale+url : url;
		trace("[LOADING]",name,"("+(this._loaded+1)+"/"+this._total+")");
		this._current_name=name;
		
		let url_loader;
		let xmlDoc;
		let sound;
		let video;
		let font;
		let img;
		
		switch(type){
			case "mp3":
			case "wav":
			case "wave":
				sound=new (Global.canUseWebAudio && url.indexOf(",")<0 ? WebAudio : Sound)();
				
				if(sound instanceof Sound){
					sound.load(url)
				}else if(!sound.load(url)){
					sound.dispose();
					sound=new Sound();
					sound.load(url);
				}
				
				this._files[name]=sound;
				sound.addEventListener(Media.MEDIA_ERROR,this.__error_handler);
			    sound.addEventListener(Media.MEDIA_LOAD_COMPLETE,this.__load_handler);
				break;
				
			case "xml":
			case "fnt":
			case "svg":
				this.loadXML(url,name,this);
				break;
			
			case "bmp":
			case "ttf":
			case "eot":
			case "otf":
			case "woff":
			case "woff2":
				try{
					font=new FontFace(this.fontDic ? this.fontDic[StringUtil.getFileName(url)] : StringUtil.getFileName(url),"url('"+url+"')"+(!StringUtil.isEmpty(this.fontFormat) ? this.fontFormat : "format('"+(type=="eot" ? "embedded-opentype" : (type=="ttf" ? "truetype" : type))+"')"));
				    this._files[name]=font;
				    font.loaded.then(this.__load_handler).catch(this.__error_handler);
					font.load();
				}catch(error){
			    	this.errorHandler();
			    }
			    break;
				
			case "json":
			case "txt":
			case "js":
			case "css":
			case "prop":
				url_loader=new URLLoader();
				this._files[name]=url_loader;
				url_loader.addEventListener(Event.ERROR,this.__error_handler);
				url_loader.addEventListener(Event.COMPLETE,this.__load_handler);
				url_loader.load(url);
				break;
				
			case "mp4":
			case "webm":
			case "ogg":
			case "mov":
			    video=new Video();
				this._files[name]=video;
				video.addEventListener(Media.MEDIA_ERROR,this.__error_handler);
			    video.addEventListener(Media.MEDIA_LOAD_COMPLETE,this.__load_handler);
				video.load(url);
				break;
			
			case "jpeg":
			case "jpg":
			case "gif":
			case "png":
			case "webp":
			case "bmp":
				img=new Image;
				img.style.display="none";
				
				if(Loader.CORS && url && url.indexOf("http")==0){
					img.crossOrigin = Global.crossdomain;
					if(Loader.CORS>1) url=(url.indexOf("?")<0 ? url : url.split("?")[0])+"?"+Math.random();
				}
				
				img.src=url;
				this._files[name]=img;
				
				if(img.complete || img.naturalWidth || img.width ){
					this.loadHandler({target:img});
					break;
				}
				
				img.onload=this.__load_handler;
		    	img.onerror=this.__error_handler;
			    break;
			    
			default:
			    return false;
		}
		
		return true;
	}
	
	reset(part)
	{
		this._files={};
		this._total=this._loaded=0;
		this.fontFormat=this.fontDic=null;
		this._feedback=this._list=this._current_name=this._current_label=null;
		
		if(part) return;
		this.__error_handler=this.locale=this._data=this.__load_handler=null;
	}
	
	dispose()
	{
		super.dispose();
		this.reset();
		
		delete this.__error_handler;
		delete this._current_label;
		delete this.__load_handler;
		delete this._current_name;
		delete this._feedback;
		delete this.fontDic;
		delete this._loaded;
		delete this._total;
		delete this._files;
		delete this.locale;
		delete this._list;
		delete this._data;
		delete this.once;
	}
	
	static getName(url)
	{
		if(StringUtil.isEmpty(url)) return null;
		
		let arr,bool=false;
		
		try{
			arr=StringUtil.getFileName(url,1).split("/");
		}catch(err){
			bool=true;
			trace("[WARN] Loader.getName by",url);
		}
		
		if(arr==null || bool) 
			return StringUtil.getFileName(url)+"@"+StringUtil.getPathExt(url);
		
		let str=arr.pop();
		while(StringUtil.isEmpty(str) && arr.length>0) str=arr.pop();
		return str+"_"+StringUtil.getFileName(url)+"@"+StringUtil.getPathExt(url);
	}

}

Loader.CORS=0;
Loader.className="Loader";

Loader.LOAD_PROCESS="loadProcess";
Loader.LOAD_COMPLETE="loadComplete";

Loader.STEP_ERROR="stepError";
Loader.STEP_COMPLETE="stepComplete";