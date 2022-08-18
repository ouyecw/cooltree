
function Media()
{
	DisplayObject.call(this);
	this.__over_handler=this.__update_handler=this.__load_handler=this.__error_handler=null;
	this.loadFail=this.once=this.auto_play=this.is_init = this.loading =this.loaded = this.playing = false;
	this.list=this._type=this.element=null;
	this.auto_next=true; 
	this.seed_time=0;
	this.length = 0;
	this.current=0;
	this.volume=1;
	
	this.delay_id=0;
	this.delay_max=50;
	this.delay_count=0;
	this.delay_time=500;
}

Global.inherit(Media,DisplayObject);

Media.MEDIA_ERROR="mediaError";
Media.MEDIA_LOAD_COMPLETE="mediaLoadComplete";
Media.MEDIA_PLAY_COMPLETE="mediaPlayComplete";
Media.Container=new MediaManager();

Media.prototype.init = function ()
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

Media.prototype._delay=function()
{
	if(this.element.readyState>0){
		this._load_complete();
		return;
	}
	
	if(this.delay_count<=0){
		this.loadFail=true;
		trace("[ERROR] MEDIA ERROR !!");
		this.once=this.loaded =this.loading=false;
		this.dispatchEvent(new Event(Media.MEDIA_ERROR));
		return;
	}
	
	this.delay_count--;
	this.delay_id=setTimeout(this.__delay_handler, this.delay_time);
}

Media.prototype._load_handler=function(e)
{
	this.length=(!this.element.duration ? this.length : Math.max(this.length,this.element.duration));
	if(e.type.indexOf("canplay")!=0 || this.loaded) return;
	this._load_complete();
}

Media.prototype._load_complete=function()
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

Media.prototype._error_handler=function(e)
{
	this.loading=false;
	this.loadFail=true;
	this.dispatchEvent(new Event(Media.MEDIA_ERROR));
	
	if(this.auto_next && this.list.length>1){
		this.current=(this.current>=this.list.length ? 0 : this.current+1);
		this._start_load();
	}
	else this.close();
}

Media.prototype._play_over=function(e)
{
	this.dispatchEvent(new Event(Media.MEDIA_PLAY_COMPLETE));
	
	if(this.auto_next && this.list.length>1){
		this.current=(this.current>=this.list.length ? 0 : this.current+1);
		this._start_load();
	}
	else this.close();
}

Media.prototype._time_update=function(e)
{
	this.length=(this.element.duration==null) ? 0 : Math.max(0,this.element.duration);
	this.seed_time=this.element.currentTime;
}

Media.prototype.setVolume = function (v) 
{
	if(this.volume == v) return;
	this.volume = v;
	
	if(this.playing){
		this.element.volume=this.volume;
		if(this.volume>0) this.element.muted=false;
	}
}

Media.prototype.getVolume = function ()
{
	return this.volume;
}

Media.prototype.setCurrentTime = function (t) 
{
	if(this.element && t!=null && t>=0 && t<this.length) {
		try{
			this.element.currentTime = t;
		}
		catch(err){};
	}
}

Media.prototype.getCurrentTime = function () 
{
	return this.element ? this.element.currentTime : 0;
}

Media.prototype.load = function (args)
{
	if(!this.is_init) this.init();
	
	if(typeof args=="number"){
		if(!this.loading){
			var old=this.current;
			this.current=args;
			if(!this._start_load()) this.current=old;
		}
		return true;
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
	
	for (var source,obj,type,bool,i=0,l=args.length;i<l;i++){
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
	
	return true;
}

Media.prototype._fit_name=function(name)
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

Media.prototype._start_load=function()
{
	if(!this.element || this.current<0 || this.list.length==0 || this.current>=this.list.length){
		return false;
	}
	
	this.close();
	this.loading=true;
	
	this.element.addEventListener("loadedmetadata",this.__load_handler, false);
	this.element.addEventListener("canplaythrough",this.__load_handler, false);
	this.element.addEventListener("durationchange",this.__load_handler, false);
	this.element.addEventListener('loadeddata',this.__load_handler, false);
	this.element.addEventListener("canplay",this.__load_handler, false);
	
	if(Global.ios){
		this.delay_count=this.delay_max;
		this.delay_id=setTimeout(this.__delay_handler, this.delay_time);
	}
	
	this.element.src=this.list[this.current].url;
	this.element.load();
	return true;
}

Media.prototype.close=function()
{
	if(!this.element) return;
	
	this.element.removeEventListener("loadedmetadata",this.__load_handler);
	this.element.removeEventListener("canplaythrough",this.__load_handler);
	this.element.removeEventListener("durationchange",this.__load_handler);
	this.element.removeEventListener("loadeddata",this.__load_handler);
	this.element.removeEventListener("canplay",this.__load_handler);
	
	if(this.delay_id) clearTimeout(this.delay_id);
	this.delay_id=0;
	
	if(this.playing) this.stop();
	this.once=this.loadFail=this.loading=this.playing = false;
	this.seed_time=0;
}

Media.prototype.play = function (time=0)
{
	if(!this.element) return;
	
	if(!this.loaded || this.element.readyState<1){
		if(!this.loading && this.list.length>0){
			if(!this.auto_play){
				this.once=this.auto_play=true;
			}
			this._start_load();
		}
		return;
	}
	
	if(this.playing) this.stop();
	
	this.seed_time=(time!=null && time>=0 && time<this.length ? time : this.seed_time);
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

Media.prototype.stop = function ()
{
	if(!this.element) return;
	this.seed_time=this.element.currentTime;
	this.element.removeEventListener("timeupdate",this.__update_handler);
	this.element.removeEventListener("ended",this.__over_handler);
	this.playing = false;
	this.element.pause();
}

Media.prototype.dispose = function ()
{
	if(this.element) this.element.removeEventListener("error",this.__error_handler);
	
	this.close();
	this.list=this.canvas=null;
	Media.Container.remove(this);
	Media.superClass.dispose.call(this);
	delete this.delay_id,this.delay_max,this.delay_count,this.delay_time,this.loadFail,this.once,this.loaded,this.list,this.loading,this.playing,this.element,this.seed_time,this.length,this.current,this.volume,this.auto_play,this._type,this.auto_next,this.__over_handler,this.__update_handler,this.__load_handler,this.__error_handler;
}
