/**
 * @class
 * @module BGAudio
 */
import Global from '../core/Global.js'
import Signal from '../events/Signal.js'
import MathUtil from '../utils/MathUtil.js'
import ObjectUtil from '../utils/ObjectUtil.js'

export default class BGAudio extends Signal
{
    static className="BGAudio";

    //播放状态改变
    static CHNAGE="change";

    //加载可播放
    static READY="ready";

    //各种延迟
    static SEEK="seek";

    //更新播放时间
    static UPDATE="update";

    //上一首或下一首
    static NEXT="next";

    //报错
    static ERROR="error";

    constructor(options,advanced=false)
    {
        this.config={
            playbackRate:1,//播放速度。范围 0.5-2.0，默认为 1
            audioType:"audio",//音频类型。可设置 "audio" 和 "music" 两种值
            title:"",//音乐标题（必填）
            epname:"",//专辑名
            singer:"",//歌手名
            coverImgUrl:"",//封面图 URL
            src:""//设置了 src 之后会自动播放
        }

        if(options)
			ObjectUtil.copyAttribute(this.config,options,true);

        this.controller = wx.getBackgroundAudioManager();
        this.options=this.config;
        this.state=null;

        this.controller.onError(Global.delegate(this.errorHandler,this));
        this.controller.onCanplay(Global.delegate(this.readyHandler,this));
        this.controller.onPlay(Global.delegate(this.changeHandler,this,"play"));
        this.controller.onStop(Global.delegate(this.changeHandler,this,"stop"));
        this.controller.onEnded(Global.delegate(this.changeHandler,this,"over"));
        this.controller.onPause(Global.delegate(this.changeHandler,this,"pause"));
        if(!advanced) return;

        this.controller.onNext(Global.delegate(this.nextHandler,this,true));
        this.controller.onPrev(Global.delegate(this.nextHandler,this,false));
        this.controller.onTimeUpdate(Global.delegate(this.updateHandler,this));
        this.controller.onSeeked(Global.delegate(this.seekHandler,this,'seeked'));
        this.controller.onSeeking(Global.delegate(this.seekHandler,this,'seeking'));
        this.controller.onWaiting(Global.delegate(this.seekHandler,this,'waiting'));
    }

    set options(ops)
    {
        if(!ops) return;

        if(!ops.src){
            delete ops["src"];
            this.enable=false;
        }
        else this.enable=true;
        ObjectUtil.copyAttribute(this.controller,ops);
    }

    errorHandler(e)
    {
        console.log("[BGAudio] onError",e);
        this.emit(BGAudio.ERROR);
        this.state="error";
    }

    /**
     * 背景音频播放状态改变时
     * @param {string} state play,stop,pause,over
     */
    changeHandler(state)
    {
        this.state=state;
        this.emit(BGAudio.CHNAGE,state);
    }

    //背景音频播放进度更新事件，只有小程序在前台时会回调
    updateHandler()
    {
        this.emit(BGAudio.UPDATE,this.currentTime);
    }

    /**
     * 背景音频缓冲事件
     * @param {string} state seeked,seeking,waiting
     */
    seekHandler(state)
    {
        this.state=state;
        this.emit(BGAudio.SEEK,state);
    }

    /**
     * 用户在系统音乐播放面板点击下一曲/上一曲
     * @param {Boolean} bool true->next; false->prev
     */
    nextHandler(bool)
    {
        this.emit(BGAudio.NEXT,bool);
    }

    readyHandler()
    {
        this.state="ready";
        this.emit(BGAudio.READY);
    }

    //播放
    play(path="")
    {
        if((!path && !this.enable) || this.state=="play") return;
        if(path) this.controller.src=path;
        else this.controller.play();
        this.enable=true;
    }

    //跳转（s）
    seek(time)
    {
        if(!this.enable) return;
        time=MathUtil.clamp(time,0,this.duration);
        this.controller.seek(time);
    }

    //停止
    stop()
    {
        if(!this.enable || this.state=="stop")return;
        this.controller.stop();
    }

    //暂停
    pause()
    {
        if(!this.enable || this.paused)return;
        this.controller.pause();
    }
    
    //当前是否暂停或停止
    get paused()
    {
        return this.controller.paused;
    }

    //当前音频的播放位置（单位：s）
    get currentTime()
    {
        return this.controller.currentTime;
    }

    //当前音频的长度（单位：s）
    get duration()
    {
        return this.controller.duration;
    }

    //音频已缓冲的时间，仅保证当前播放时间点到此时间点内容已缓冲
    get buffered()
    {
        return this.controller.buffered;
    }
}

module.exports = BGAudio;

