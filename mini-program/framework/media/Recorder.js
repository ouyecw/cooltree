import Global from '../core/Global.js'
import Signal from '../events/Signal.js'
import ObjectUtil from '../utils/ObjectUtil.js'

export default class Recorder extends Signal
{
    static className="Recorder";

    static ERROR="recorderError";
    static COMPLETE="recorderComplete";

    constructor(options)
    {
        super();

        this.options = {
            duration: 10000,       //录音的时长，单位 ms，最大值 600000（10 分钟）
            sampleRate: 44100,     //采样率 48000,44100,32000,24000,22050
            numberOfChannels: 1,   //录音通道数 1,2
            format: 'mp3',         //mp3,aac,wav,PCM
            encodeBitRate: 192000//, //编码码率 8000~48000
            // frameSize: 50          //指定帧大小，单位 KB。传入 frameSize 后，每录制指定帧大小的内容后，会回调录制的文件内容，不指定则不会回调。暂仅支持 mp3、pcm 格式
        }

        this.paused=false;
        this.started=false;
        this.instance = wx.getRecorderManager();

        if(options)
			ObjectUtil.copyAttribute(this.options,options,true);

        this._over_handle=Global.delegate(this.onEnd,this);
        this._error_handle=Global.delegate(this.onError,this);

        this.instance.onStop(this._over_handle);
        this.instance.onError(this._error_handle);
        this.instance.onFrameRecorded(this._over_handle);
    }

    onEnd(e)
    {
        this.started=false;
        this.emit(Recorder.COMPLETE,e.tempFilePath || e.frameBuffer);
    }

    onError(msg)
    {
        this.started=false;
        console.log("[Recorder]",msg);
        this.emit(Recorder.ERROR,msg);
    }

    get pause()
    {
        return this.paused;
    }

    set pause(value)
    {
        if(this.paused==value || !this.started) return;
        this.paused=value;

        this.instance && this.instance[value ? "pause" : "resume"]();
    }

    start()
    {
        if(this.started) return;
        this.started=true;
        this.instance && this.instance.start(this.options);
    }

    stop()
    {
        if(!this.started) return;
        this.started=false;
        this.instance && this.instance.stop();
    }

    dispose()
    {
        this.started=false;
        this.instance=null;
        super.dispose();
    }
}

module.exports = Recorder;