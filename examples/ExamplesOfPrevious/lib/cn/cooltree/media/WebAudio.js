/**
===================================================================
WebAudio Class
===================================================================
**/

function WebAudio()
{
	EventDispatcher.call(this);
	this.__over_handler=this.__change_handler=this.bufferSource=this.buffer=this.volumeNode=this._ajax=this._audio_tag=this.element=null;
	this.loadFail=this.auto_play=this.is_init = this.loading =this.loaded = this.playing = false;
	this.currentSave=this.currentTime=0;
	this._type="web_audio";
	this.length = 0;
	this.volume=1;
}

Global.inherit(WebAudio,EventDispatcher);

WebAudio.prototype.init = function ()
{
	if(this.is_init) return false;
	this.is_init=true;
	
	try{
		this.element = new Global.canUseWebAudio();
	}
	catch(error){
		Global.canUseWebAudio=null;
		return true;
	}
	
	this.name=UniqueUtil.getName(this._type);
	this.element.id=this.name;
	
	this._ajax=new Ajax();
	this._ajax.responseType=Ajax.ARRAY_BUFFER;
	this._audio_tag = document.createElement("audio");
	Media.Container.add(this);
	
	this.__over_handler=Global.delegate(this._over_handler,this);
//	this.__change_handler=Global.delegate(this._change_handler,this);
	return false;
}

//WebAudio.prototype._change_handler=function(e){}

WebAudio.prototype._over_handler=function(e)
{
	this.close();
    this.dispatchEvent(new Event(Media.MEDIA_PLAY_COMPLETE));
}

WebAudio.prototype.load = function (url) 
{
	if(!url) return false;
	if(!this.is_init && this.init()) return false;
	
	if (typeof url !== "string") {
		if (Object.prototype.toString.apply(url) == '[object AudioBuffer]') {
			this.onload(url);
		} else if (Object.prototype.toString.apply(url) == '[object ArrayBuffer]') {
			this.loading=true;
			this.element.decodeAudioData(url, Global.delegate(this.onload,this), Global.delegate(function (error) {
				this.loadFail=true;
				this.loading=false;
				trace("[ERROR] WebAudio:AudioContext decodeAudioData error : " + error.toString());
				this.dispatchEvent(new Event(Media.MEDIA_ERROR));
			},this));
		}
		return false;
	}
	
	var c, d, s=this,q = {"mov" : ["quicktime"], "3gp" : ["3gpp"], "midi" : ["midi"], "mid" : ["midi"], "ogv" : ["ogg"], "m4a" : ["acc"], "mp3" : ["mpeg"], "wav" : ["wav", "x-wav", "wave"], "wave" : ["wav", "x-wav", "wave"], "aac" : ["mp4", "aac"]};
	d = StringUtil.getPathExt(url);
	
	if (q[d]) {
		d = q[d];
	} else {
		d = [d];
	}
	c = d.some(function (name, index, array) {
		return s._audio_tag.canPlayType("audio/" + name);
	});
	
	if (c || (!StringUtil.isEmpty(url) && url.indexOf("blob:")==0)) {
		this.loading=true;
		this._ajax.get(url,{},Global.delegate(this.onload,this),function(){
			s.loadFail=true;
			s.loading=false;
			trace("[ERROR] WebAudio: load audio fail.");
			s.dispatchEvent(new Event(Media.MEDIA_ERROR));
		});
	} else {
		this.loadFail=true;
		trace( "Not support " + d + " : " + url);
		this.dispatchEvent(new Event(Media.MEDIA_ERROR));
		return false;
	}
	
	return true;
}

WebAudio.prototype.onload =function (data) 
{
	if (Object.prototype.toString.apply(data) !== '[object AudioBuffer]') {
		this.load(data);
		return;
	};
	
	this.buffer = data;
	this.loaded =true;
	this.loading=this.loadFail=false;
	this.length = this.buffer.duration;
	this.dispatchEvent(new Event(Media.MEDIA_LOAD_COMPLETE));
	this.removeEventListener(Media.MEDIA_LOAD_COMPLETE);
	if(this.auto_play) this.play();
}

WebAudio.prototype.setCurrentTime = function (t) 
{
	if(this.element && t!=null && t>=0 && t<this.length) {
		if (this.playing) {
			try{
				this.element.currentTime = t;
			}
			catch(err){};
		} else {
			this.currentSave=t;
		}
	}
};

WebAudio.prototype.getCurrentTime = function () 
{
	if (this.playing) {
		return this.element.currentTime;
	} else {
		return this.currentSave;
	}
};

WebAudio.prototype.setVolume = function (v) 
{
	this.volume = v;
	if (this.playing && this.volumeNode) {
		this.volumeNode.gain.setValueAtTime(v,this.currentTime);
	}
};

WebAudio.prototype.getVolume = function ()
{
	return this.volume;
};

WebAudio.prototype.play = function (time=0)
{
	if (this.length <= 0 || this.playing)  return;
	this.currentTime = (time!=null && time>=0 && time<this.length ? time : this.currentSave);
	this.element.loop = false;
	this.playing = true;

	this.bufferSource = this.element.createBufferSource();
	this.bufferSource.buffer = this.buffer;
	this.volumeNode = this.element.createGain();
	this.volumeNode.gain.setValueAtTime(this.volume,this.currentTime);
	this.volumeNode.connect(this.element.destination);
	this.bufferSource.connect(this.volumeNode);
	this.currentSave = this.element.currentTime;
	
//	this.bufferSource.addEventListener("statechange",this.__change_handler,false);
	this.bufferSource.addEventListener("ended",this.__over_handler,false);
	
	if (this.bufferSource.start) {
		this.bufferSource.start(0, this.currentTime, this.length - this.currentTime);
	} else {
		this.bufferSource.noteGrainOn(0, this.currentTime, this.length - this.currentTime);
	}
};

WebAudio.prototype.stop = function () 
{
	if (!this.playing) return;
	
	if (this.bufferSource.stop) {
		this.bufferSource.stop(0);
	} else {
		this.bufferSource.noteOff(0);
	}
	
	this.currentSave = this.getCurrentTime();
	this.playing = false;
	
//	this.bufferSource.removeEventListener("statechange",this.__change_handler);
	this.bufferSource.removeEventListener("ended",this.__over_handler);
}

WebAudio.prototype.close = function () 
{
	if (this.playing) this.stop();
	this.currentTime = this.currentSave = 0;
}

WebAudio.prototype.dispose = function () 
{
	this.close();
	this.element=null;
	Media.Container.remove(this);
	if(WebAudio.superClass) WebAudio.superClass.dispose.call(this);
	delete this.element,this._type,this.loadFail,this.auto_play,this.is_init,this.loading,this.loaded,this.playing,this.length,this.__over_handler,this.__change_handler,this.volume,this.timeout,this.volumeNode,this.currentSave,this.currentTime,this._ajax,this._audio_tag;
}