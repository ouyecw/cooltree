import Global from '../core/Global.js'
import Signal from '../events/Signal.js'

export default class Audio extends Signal
{
    static className="Audio";
    static STATE="audioState";

    /**
     * @param {Boolean} b 
     * 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项。
     */
    constructor(useWebAudioImplement=false)
    {
        super();
        
        this._enable=false;
        this._ready=false;

        this.instance=wx.createInnerAudioContext({
            useWebAudioImplement 
        })

        this._play_handler=Global.delegate(this.handler,this,"play");
        this._ended_handler=Global.delegate(this.handler,this,"over");
        this._pause_handler=Global.delegate(this.handler,this,"pause");
        this._error_handler=Global.delegate(this.handler,this,"error");
        this._seeked_handler=Global.delegate(this.handler,this,"seeked");
        this._canplay_handler=Global.delegate(this.handler,this,"canplay");
        this._waiting_handler=Global.delegate(this.handler,this,"waiting");
        this._seeking_handler=Global.delegate(this.handler,this,"seeking");
        this._timeUpdate_handler=Global.delegate(this.handler,this,"update");
    }

    set enable(value)
    {
        if(this._enable==value) return;
        this._enable=value;
        
        if(value){
            this.instance.onPlay(this._play_handler);
            this.instance.onEnded(this._ended_handler);
            this.instance.onPause(this._pause_handler);
            this.instance.onError(this._error_handler);
            this.instance.onSeeked(this._seeked_handler);
            this.instance.onCanplay(this._canplay_handler);
            this.instance.onWaiting(this._waiting_handler);
            this.instance.onSeeking(this._seeking_handler);
            this.instance.onTimeUpdate(this._timeUpdate_handler);
        }else{
            this.instance.offPlay(this._play_handler);
            this.instance.offEnded(this._ended_handler);
            this.instance.offPause(this._pause_handler);
            this.instance.offError(this._error_handler);
            this.instance.offSeeked(this._seeked_handler);
            this.instance.offCanplay(this._canplay_handler);
            this.instance.offWaiting(this._waiting_handler);
            this.instance.offSeeking(this._seeking_handler);
            this.instance.offTimeUpdate(this._timeUpdate_handler);
        }
    }

    get enable()
    {
        return this._enable;
    }

    get paused()
    {
        return this.instance && this.instance.paused;
    }
    
    get buffered()
    {
        return this.instance && this.instance.buffered;
    }

    //当前音频的长度（单位 s）
    get duration()
    {
        return this.instance && this.instance.duration;
    }

    set autoplay(value)
    {
        if(this.instance) this.instance.autoplay=value;
    }

    get autoplay()
    {
        return this.instance && this.instance.autoplay;
    }

    set loop(value)
    {
        if(this.instance) this.instance.loop=value;
    }

    get loop()
    {
        return this.instance && this.instance.loop;
    }

    //音量。范围 0~1。默认为 1
    set volume(value)
    {
        if(this.instance) this.instance.volume=value;
    }

    get volume()
    {
        return this.instance && this.instance.volume;
    }

    set startTime(value)
    {
        if(this.instance) this.instance.startTime=value;
    }

    get startTime()
    {
        return this.instance && this.instance.startTime;
    }

    set currentTime(value)
    {
        if(this.instance) this.instance.currentTime=value;
    }

    get currentTime()
    {
        return this.instance && this.instance.currentTime;
    }

    //播放速度。范围 0.5-2.0，默认为 1。
    set playbackRate(value)
    {
        if(this.instance) this.instance.playbackRate=value;
    }

    get playbackRate()
    {
        return this.instance && this.instance.playbackRate;
    }

    handler(state)
    {
        if(state=="canplay") this._ready=true;
        this.emit(Audio.STATE,state);
    }

    load(path)
    {
        if(!this.instance || !path) return;
        this.enable=true;
        this._ready=false;
        this.instance.src=path;
    }

    seek(time)
    {
        if(!this.instance) return;
        this.instance.seek(time);
    }

    //播放
    play()
    {
        if(!this.instance) return;
        if(this._ready) this.instance.play();
        else this.autoplay=true;
    }

    //停止
    stop()
    {
        if(!this.instance) return;
        this.instance.stop();
    }

    //暂停
    pause()
    {
        if(!this.instance) return;
        this.instance.pause();
    }

    dispose()
    {
        this.enable=false;

        if(this.instance){
            this.instance.destroy();
            this.instance=null;
        }

        this._play_handler=this._ended_handler=this._pause_handler=this._error_handler=this._seeked_handler=this._canplay_handler=this._waiting_handler=this._seeking_handler=this._timeUpdate_handler=null;

        super.dispose();
    }
}

module.exports = Audio;