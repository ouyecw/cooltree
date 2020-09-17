
import Global from '../core/Global.js'
import Event from '../events/Event.js'
import DOMUtil from '../utils/DOMUtil.js'
import MediaManager from './MediaManager.js'
import UniqueUtil from '../utils/UniqueUtil.js'
import StringUtil from '../utils/StringUtil.js'
import DisplayObject from '../display/DisplayObject.js'

export default class Media extends DisplayObject
{
	constructor()
	{
		super();
		this.__over_handler=this.__update_handler=this.__load_handler=this.__error_handler=null;
		this.loadFail=this.once=this.auto_play=this.is_init = this.loading =this.loaded = this.playing = false;
		this.list=this._type=this.element=null;
		this.auto_next=true; 
		this.seed_time=0;
		this.length = 0;
		this.current=0;
		this.volume=1;
		
		this.delay_id=0;
		this.delay_max=30;
		this.delay_count=0;
		this.delay_time=500;
	}
	
	init  ()
	{
		if(this.is_init) return;
		this.is_init=true;
		
		this.name=UniqueUtil.getName(this._type);
	    this.element = document.createElement(this._type);
	    this.element.id=this.name;

		this.element.controls = "";
		this.element.preload  = "auto";
		
		this.list=[];
		Media.Container.add(this);
		this.canvas = this.element;
		
		this.__delay_handler=Global.delegate(this._delay,this);
		this.__over_handler=Global.delegate(this._play_over,this);
		this.__load_handler=Global.delegate(this._load_handler,this);
		this.__update_handler=Global.delegate(this._time_update,this);
		this.__error_handler=Global.delegate(this._error_handler,this);
		this.element.addEventListener("error",this.__error_handler, false);
	}
	
	_delay()
	{
		if(this.element.readyState>0){
			this._load_complete();
			return;
		}
		
		if(this.delay_count<=0){
			trace("[ERROR] MEDIA ERROR !!");
			this.dispatchEvent(new Event(Media.MEDIA_ERROR));
			return;
		}
		
		this.delay_count--;
		this.delay_id=setTimeout(this.__delay_handler, this.delay_time);
	}
	
	_load_handler(e)
	{
		this.length=(this.element.duration==null) ? 0 : Math.max(0,this.element.duration);
		if(e.type.indexOf("canplay")!=0 || this.loaded) return;
		this._load_complete();
	}
	
	_load_complete()
	{
		this.dispatchEvent(new Event(Media.MEDIA_LOAD_COMPLETE));
		if(this.delay_id) clearTimeout(this.delay_id);
		this.delay_id=0;
		
		this.loaded =true;
		this.loading=false;
		
		if(this.auto_play && !this.playing) {
			if(this.once) this.auto_play=this.once=false;
			this.play();
		}
	}
	
	_error_handler(e)
	{
		this.loading=false;
		this.loadFail=true;
		trace("[ERROR] Media",e);
		this.dispatchEvent(new Event(Media.MEDIA_ERROR));
		
		if(this.auto_next && this.list.length>1){
			this.current=(this.current>=this.list.length ? 0 : this.current+1);
			this._start_load();
		}
		else this.close();
	}
	
	_play_over(e)
	{
		this.dispatchEvent(new Event(Media.MEDIA_PLAY_COMPLETE));
		
		if(this.auto_next && this.list.length>1){
			this.current=(this.current>=this.list.length ? 0 : this.current+1);
			this._start_load();
		}
		else this.close();
	}
	
	_time_update(e)
	{
		this.length=(this.element.duration==null) ? 0 : Math.max(0,this.element.duration);
		this.seed_time=this.element.currentTime;
	}
	
	setVolume  (v) 
	{
		if(this.volume == v) return;
		this.volume = v;
		
		if(this.playing){
			this.element.volume=this.volume;
			if(this.volume>0) this.element.muted=false;
		}
	}
	
	getVolume  ()
	{
		return this.volume;
	}
	
	setCurrentTime  (t) 
	{
		if(this.element && t!=null && t>=0 && t<this.length) {
			try{
				this.element.currentTime = t;
			}
			catch(err){};
		}
	}
	
	getCurrentTime  () 
	{
		return this.element ? this.element.currentTime : 0;
	}
	
	load  (args)
	{
		if(!this.is_init) this.init();
		
		if(typeof args=="number"){
			if(!this.loading){
				let old=this.current;
				this.current=args;
				if(!this._start_load()) this.current=old;
			}
			return;
		}
		
		if(typeof args=="string" && args.indexOf(",")>0){
			args=args.split(",");
		}
		
		if(!(args instanceof Array)){
			if(typeof args=="string"){
				args={url:args};
			}
			args=[args];
		}else{
			ArrayUtil.each(args,function(item,index){
				if(typeof item=="string") args[index]={url:item};
			});
		}
		
		for (let source,obj,type,bool,i=0,l=args.length;i<l;i++){
			obj=args[i];
			if(StringUtil.isEmpty(obj.url)) continue;
			type=this._type+'/'+this._fit_name(StringUtil.getPathExt(obj.url))+("codecs" in obj ? ';codecs="'+obj.codecs+'"' :'');
			bool=this.element.canPlayType(type);
			if(!bool && obj.url.indexOf("blob:")!=0) continue;
			if(bool){
				source=DOMUtil.createDOM("source",{type:type,src:obj.url});
				this.element.appendChild(source);
			}
			this.list.push(obj);
		}
		
		if(!this.loading && this.list.length>0) this._start_load();
		else if(args.length>0 && this.list.length==0){
			this.dispatchEvent(new Event(Media.MEDIA_ERROR));
		}
	}
	
	_fit_name(name)
	{
		switch(name)
		{
			case "mov": return "quicktime";
			case "3gp": return "3gpp";
			case "mid": return "midi";
			case "ogv": return "ogg";
			case "m4a": return "acc";
			default : return name;
		}
	}
	
	_start_load()
	{
		if(!this.element || this.current<0 || this.list.length==0 || this.current>=this.list.length){
			return false;
		}
		
		this.close();
		this.loading=true;
		
		this.element.addEventListener("loadedmetadata",this.__load_handler, false);
		this.element.addEventListener("canplaythrough",this.__load_handler, false);
		this.element.addEventListener('loadeddata',this.__load_handler, false);
		this.element.addEventListener("canplay",this.__load_handler, false);
		this.element.src=this.list[this.current].url;
		this.element.load();
		
		if(Global.ios){
			this.delay_count=this.delay_max;
			this.delay_id=setTimeout(this.__delay_handler, this.delay_time);
		}
		
		return true;
	}
	
	close()
	{
		if(!this.element) return;
		this.element.removeEventListener("loadedmetadata",this.__load_handler);
		this.element.removeEventListener("canplaythrough",this.__load_handler);
		this.element.removeEventListener("loadeddata",this.__load_handler);
		this.element.removeEventListener("canplay",this.__load_handler);
		
		if(this.delay_id) clearTimeout(this.delay_id);
		this.delay_id=0;
		
		if(this.playing) this.stop();
		this.loadFail=this.loaded =this.loading=this.playing = false;
		this.seed_time=0;
	}
	
	play  (bool)
	{
		if(!this.element) return;
		
		if(!this.loaded){
			if(!this.loading && this.list.length>0){
				if(!this.auto_play){
					this.once=this.auto_play=true;
				}
				this._start_load();
			}
			return;
		}
		
		if(this.playing) this.stop();
		
		if(bool) this.seed_time=0;
		if(this.seed_time>0){
			try{
				this.element.currentTime = this.seed_time;
			}
			catch(err){}
		}
		
		this.element.addEventListener("timeupdate",this.__update_handler,false);
		this.element.addEventListener("ended",this.__over_handler,false);
		if(this.volume>0) this.element.volume=this.volume;
		else this.element.muted=true;
		this.playing = true;
		this.element.play();
	}
	
	stop  ()
	{
		if(!this.element) return;
		this.seed_time=this.element.currentTime;
		this.element.removeEventListener("timeupdate",this.__update_handler);
		this.element.removeEventListener("ended",this.__over_handler);
		this.playing = false;
		this.element.pause();
	}
	
	dispose  ()
	{
		this.close();
		super.dispose();
		this.list=this.canvas=null;
		Media.Container.remove(this);
		delete this.delay_id,this.delay_max,this.delay_count,this.delay_time,this.loadFail,this.once,this.loaded,this.list,this.loading,this.playing,this.element,this.seed_time,this.length,this.current,this.volume,this.auto_play,this._type,this.auto_next,this.__over_handler,this.__update_handler,this.__load_handler,this.__error_handler;
	}
}

Media.MEDIA_ERROR="mediaError";
Media.MEDIA_LOAD_COMPLETE="mediaLoadComplete";
Media.MEDIA_PLAY_COMPLETE="mediaPlayComplete";
Media.Container=new MediaManager();
Media.className="Media";
