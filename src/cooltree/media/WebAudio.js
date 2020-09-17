/**
===================================================================
WebAudio Class
===================================================================
**/
import Media from './Media.js'
import Ajax from '../net/Ajax.js'
import Global from '../core/Global.js'
import Event from '../events/Event.js'
import UniqueUtil from '../utils/UniqueUtil.js'
import StringUtil from '../utils/StringUtil.js'
import EventDispatcher from '../events/EventDispatcher.js'

export default class WebAudio extends EventDispatcher
{
	constructor()
	{
		super();
		this.__over_handler=this.__change_handler=this.bufferSource=this.buffer=this.volumeNode=this._ajax=this._audio_tag=this.element=null;
		this.loadFail=this.auto_play=this.is_init = this.loading =this.loaded = this.playing = false;
		this.currentSave=this.currentTime=0;
		this._type="web_audio";
		this.length = 0;
		this.volume=1;
	}
	
	init  ()
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
	
	//_change_handler(e){}
	
	_over_handler(e)
	{
		this.close();
	    this.dispatchEvent(new Event(Media.MEDIA_PLAY_COMPLETE));
	}
	
	load  (url) 
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
		
		let c, d, s=this,q = {"mov" : ["quicktime"], "3gp" : ["3gpp"], "midi" : ["midi"], "mid" : ["midi"], "ogv" : ["ogg"], "m4a" : ["acc"], "mp3" : ["mpeg"], "wav" : ["wav", "x-wav", "wave"], "wave" : ["wav", "x-wav", "wave"], "aac" : ["mp4", "aac"]};
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
			this._ajax.get(url).then(function(res){
				this.onload(res);
			}.bind(this)).catch(function(err){
				this.loadFail=true;
				this.loading=false;
				trace("[ERROR] WebAudio: load audio fail.");
				this.dispatchEvent(new Event(Media.MEDIA_ERROR));
			}.bind(this));
		} else {
			this.loadFail=true;
			trace( "Not support " + d + " : " + url);
			this.dispatchEvent(new Event(Media.MEDIA_ERROR));
			return false;
		}
		
		return true;
	}
	
	onload  (data) 
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
	
	setCurrentTime  (t) 
	{
		if(!(this.element && t!=null && t>=0 && t<this.length) ) return;
		try{
			this.element.currentTime = t;
		}
		catch(err){};
		this.currentTime=t;
	};
	
	getCurrentTime  () 
	{
		return this.currentTime;
	};
	
	setVolume  (v) 
	{
		this.volume = v;
		if (this.playing && this.volumeNode) {
			this.volumeNode.gain.setValueAtTime(v,this.currentTime);
		}
	};
	
	getVolume  ()
	{
		return this.volume;
	};
	
	play  (bool)
	{
		if (this.length == 0 || this.playing)  return;
		if(bool) this.currentTime = 0;
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
			this.bufferSource.start(0, this.currentTime%this.length);
		} else {
			this.bufferSource.noteGrainOn(0, this.currentTime%this.length);
		}
	};
	
	stop  () 
	{
		if (!this.playing) return;
		
		try{
			if (this.bufferSource.stop)  this.bufferSource.stop(0);
			else this.bufferSource.noteOff(0);
		}catch(err){};
		
		this.currentTime+=this.element.currentTime-this.currentSave;
		this.playing = false;
		
	//	this.bufferSource.removeEventListener("statechange",this.__change_handler);
		this.bufferSource.removeEventListener("ended",this.__over_handler);
	}
	
	close  () 
	{
		if (this.playing) this.stop();
		this.currentTime = this.currentSave = 0;
	}
	
	dispose  () 
	{
		this.close();
		super.dispose();
		this.element=null;
		Media.Container.remove(this);
		delete this.element,this._type,this.loadFail,this.auto_play,this.is_init,this.loading,this.loaded,this.playing,this.length,this.__over_handler,this.__change_handler,this.volume,this.timeout,this.volumeNode,this.currentSave,this.currentTime,this._ajax,this._audio_tag; 
	}
}

WebAudio.className="WebAudio";