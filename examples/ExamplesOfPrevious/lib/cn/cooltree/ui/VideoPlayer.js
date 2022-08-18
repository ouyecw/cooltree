
function VideoPlayer()
{
	DisplayObjectContainer.call(this);
	
	this._changeState=this.bg=this.play_btn=this._instance=this._video=this._url=null;
	this.seedTime=this._video_width=this._video_height=0;
	this.control=this._is_loading=this._is_reload=false;
	this.isStrict=this.isStop=true;
	this._volume=1;
}

VideoPlayer.PLAY="video_player_play";
VideoPlayer.ERROR="video_player_error";
VideoPlayer.READY="video_player_ready";
VideoPlayer.PAUSE="video_player_pause";
VideoPlayer.COMPLETE="video_player_play_complete";
Global.inherit(VideoPlayer,DisplayObjectContainer);

Object.defineProperty(VideoPlayer.prototype,"src",{
	get: function () {
	    return this._url;
    },

    set: function (value) {
    	this._loading(value);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(VideoPlayer.prototype,"volume",{
	get: function () {
	    return this._volume;
    },

    set: function (value) {
    	if(value==null || this._volume==value) return;
    	this._volume=value;
    	if(this._video) this._video.setVolume(this._volume);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(VideoPlayer.prototype,"instance",{
	get: function () {
	    return this._instance;
    },
    enumerable: true,
    configurable: true
});

VideoPlayer.prototype._loading=function(path)
{
	if(this._is_loading || StringUtil.isEmpty(path) || this._url==path) return;
	this._is_loading=true;
	this._is_reload=false;
	this._url=path;
	
	var video=new Video();
	video.addEventListener(Media.MEDIA_LOAD_COMPLETE,Global.delegate(this._complete_handler,this));
	video.load(this._url);
}

VideoPlayer.prototype._complete_handler=function(e)
{
	e.target.removeEventListener(Media.MEDIA_LOAD_COMPLETE);
	this._is_loading=false;
	
	if(e.target && !e.target.loadFail) {
		this.load(e.target);
		return;
	}
	
	if(this._is_reload){
		this.dispatchEvent(new Event(VideoPlayer.ERROR));
		return;
	}
	
	e.target.dispose();
	this._is_reload=true;
	this._is_loading=true;
	
	var video=new Video();
	video.addEventListener(Media.MEDIA_LOAD_COMPLETE,Global.delegate(this._complete_handler,this));
	video.load(this._url);
}

VideoPlayer.prototype.load=function(video)
{
	if(video==null) return;
	
	let vh=video.getHeight();
	let vw=video.getWidth();
	
	if(this.isStrict && (vh<=0 || vw<=0 || (Global.os==SystemType.OS_PC && (isNaN(video.length) || video.length<=0)))){
		this.dispatchEvent(new Event(VideoPlayer.ERROR));
		return;
	}
	
	if(vh) this._video_height=vh;
	if(vw) this._video_width=vw;
	
	if(this._instance){
		if(this._video && !this.isStop) this.stop();
		this._instance.removeFromParent(true);
	}
	
	this._video=video;
	this._volume=video.volume;
	this._video.element.controls = this.control ? "controls" : "";
	
	if(this._changeState==null) this._changeState=Global.delegate(this.__change_state,this);
	
	if(this.bg==null){
		trace("[INFO] VP bg:",this._video_width+"x"+this._video_height);
		this.bg=Factory.c("bs",["#000000",this._video_width,this._video_height]);
		this.addChild(this.bg);
		
		this.bg.mouseEnabled=true;
    	this.bg.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this.onMouseClick,this));    
	}else{
		this.bg.setSize(this._video_width,this._video_height);
	}
	
	if(Global.useCanvas){
		this._instance=this._video;
	}else{
		this._instance=ObjectPool.create(DOMDisplay);
		this._instance.element=this._video.element;
		this._instance.setSize(this._video_width,this._video_height);
	}
	
	this.addChild(this._instance);
	this.setSize(this._video_width,this._video_height);
	
	this.update_view(false);
	this._video.setVolume(this._volume);
	
	if(this.play_btn && !this.play_btn.hasEventListener(StageEvent.MOUSE_CLICK)) {
		this.play_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this.onMouseClick,this));
	}
	
	this.dispatchEvent(new Event(VideoPlayer.READY));
}

VideoPlayer.prototype.updateSize=function(w,h)
{
	if(this._is_loading || this._video==null || !(w && h)) return;
	
	this.setSize(w,h);
	if(this.bg) this.bg.setSize(w,h);
	if(this._instance) {
		var scale=MathUtil.getSizeScale(this._video_width,this._video_height,w,h,true);
		this._instance.scale=scale;
		this._instance.moveTo(Math.round((w-this._instance.getWidth())*0.5),Math.round((h-this._instance.getHeight())*0.5));
	}
	if(this.play_btn && this.contains(this.play_btn)) this.play_btn.moveTo(Math.ceil((w-this.play_btn.getWidth())*0.5),Math.ceil((h-this.play_btn.getHeight())*0.5));
}

VideoPlayer.prototype.onMouseClick=function(e)
{
	if(this._is_loading || this._video==null) return;
	
	switch(e.target){
		case this.play_btn:
		this.play();
		break;
			
		case this.bg:
		if(!this.isStop && this._video.playing) this.pause();
		break;
	}
}

VideoPlayer.prototype.change=function()
{
	if(this._video==null) return;
	if(!this.isStop && this._video.playing) this.pause();
	else this.play();
}

VideoPlayer.prototype.play=function()
{
	if(this._video==null || this._video.playing) return;
	this.seedTime=this.isStop ? 0 : this.seedTime;
	this.update_view(true);
	
	if(this.isStop) {
		this._video.element.addEventListener("pause",this._changeState);
    	this._video.element.addEventListener("playing",this._changeState);
		this._video.addEventListener(Media.MEDIA_PLAY_COMPLETE,Global.delegate(this.onPlayOver,this));
	}
	
	this._video.play(this.seedTime);
	this.isStop=false;
}

VideoPlayer.prototype.pause=function()
{
	if(this._video==null) return;	
	this.seedTime=this._video.getCurrentTime();
	this._video.stop();
	this.update_view(false);
}

VideoPlayer.prototype.stop=function()
{
	if(this._video==null || this.isStop) return;
	this.isStop=true;
	this.seedTime=0;
	
	this._video.stop();
	this.update_view(false);
	this._volume=this._video.volume;
	
	this._video.element.removeEventListener("playing",this._changeState);
	this._video.element.removeEventListener("pause",this._changeState);
	this._video.removeEventListener(Media.MEDIA_PLAY_COMPLETE);
}

VideoPlayer.prototype.__change_state=function(e)
{
	if(e.type=="playing"){
		if(this._video.playing) return;
		this._video.playing=true;
		this.update_view(true);
		if(this.isStop) {
			this._video.addEventListener(Media.MEDIA_PLAY_COMPLETE,Global.delegate(this.onPlayOver,this));
		}
		this.isStop=false;
		this.dispatchEvent(new Event(VideoPlayer.PLAY));
	}else if(e.type=="pause"){
		if(!this._video.playing) return;
		this._video.playing=false;
		this.seedTime=this._video.getCurrentTime();
		this.update_view(false);
		this.dispatchEvent(new Event(VideoPlayer.PAUSE));
	}
}

VideoPlayer.prototype.update_view=function(bool)
{
	this.__checkDisplayUpdate();
	
	if(bool){
		if(this.play_btn) this.play_btn.removeFromParent(false);
		
		if(Global.useCanvas && !(this.stage ? this.stage : Stage.current).hasEventListener(StageEvent.ENTER_FRAME,this.name)){
			(this.stage ? this.stage : Stage.current).addEventListener(StageEvent.ENTER_FRAME,Global.delegate(this.onEnterFrame,this),this.name);
		}
		return;
	}
	
	if(this.play_btn){
		this.play_btn.moveTo(Math.ceil((this.width-this.play_btn.getWidth())*0.5),Math.ceil((this.height-this.play_btn.getHeight())*0.5));
		this.addChild(this.play_btn);
	}
	
	if((this.stage ? this.stage : Stage.current).hasEventListener(StageEvent.ENTER_FRAME,this.name)){
		(this.stage ? this.stage : Stage.current).removeEventListener(StageEvent.ENTER_FRAME,null,this.name);
	}
}

VideoPlayer.prototype.onEnterFrame=function(e)
{
	if(Global.useCanvas) this.__checkDisplayUpdate();
}

VideoPlayer.prototype.onPlayOver=function(e)
{
	this.stop();
	this.dispatchEvent(new Event(VideoPlayer.COMPLETE));
}

VideoPlayer.prototype.dispose=function()
{
	if(this._video && !this.isStop) this.stop();
	else if((this.stage ? this.stage : Stage.current).hasEventListener(StageEvent.ENTER_FRAME,this.name)){
		(this.stage ? this.stage : Stage.current).removeEventListener(StageEvent.ENTER_FRAME,null,this.name);
	}
	
	VideoPlayer.superClass.dispose.call(this);
	delete this.isStrict,this._is_reload,this.control,this._changeState,this.bg,this.play_btn,this._instance,this._video,this._url,this.seedTime,this._video_width,this._video_height,this._is_loading,this.isStop,this._volume;
}