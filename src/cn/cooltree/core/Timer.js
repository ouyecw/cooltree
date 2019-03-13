/**
===================================================================
Timer Class
===================================================================
**/
class Timer extends EventDispatcher
{
	constructor(r)
	{
		super();
		this._start_time=0;
		this._is_start=false;
		this._interval_id=null;
		this._frame_rate=(r ? r : Math.ceil(1000/Timer.fps));
		this.__handler=Global.delegate(this._onTimeHandler,this);
	}
	
	setFrameRate(rate)
	{
		this._frame_rate=rate;
		if(this._is_start) this.start();
	}
	
	getFrameRate()
	{
		return this._frame_rate;
	}
	
	isStart()
	{
		return this._is_start;
	}
	
	_onTimeHandler()
	{
		this.dispatchEvent(Factory.c("ev",[Timer.TIME]));
	}
	
	start()
	{
		if(this._frame_rate<=0) return;
		if(this._interval_id!=null) clearInterval(this._interval_id);
		this._interval_id=setInterval(this.__handler,this._frame_rate);
	    this._start_time=(new Date()).getTime();
	    this._is_start=true;
	}
	
	stop()
	{
		if(this._interval_id!=null) clearInterval(this._interval_id);
		this._interval_id=null;
		this._is_start=false;
		this._start_time=0;
	}
	
	dispose()
	{
		super.dispose();
		
		this.stop();
		delete this._start_time,this._interval_id,this._frame_rate,this._is_start;
	}
	
	toString()
	{
		return Timer.name;
	}
	
	static delayCall(second,callback,params=[],target=null,id=null)
	{
		if(second<=0 || callback==undefined) return;
		
		if(id) clearTimeout(id);
		return setTimeout(() => callback.apply(target,params),1000*second);
	}

}

Timer.TIME="timer_count";
Timer.fps=60;
