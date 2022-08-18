/**
===================================================================
Timer Class
===================================================================
**/

function Timer(r)
{
	EventDispatcher.call(this);
	
	this._start_time=0;
	this._is_start=false;
	this._interval_id=null;
	this._frame_rate=(r==undefined) ? Timer.fps : r;
}

Global.inherit(Timer,EventDispatcher);
Timer.TIME="time";
Timer.fps=30;

Timer.prototype.setFrameRate=function(rate)
{
	this._frame_rate=rate;
	if(this._is_start) this.start();
}

Timer.prototype.getFrameRate=function()
{
	return this._frame_rate;
}

Timer.prototype.isStart=function()
{
	return this._is_start;
}

Timer.prototype._onTimeHandler=function()
{
	this.dispatchEvent(new Event(Timer.TIME));
}

Timer.prototype.start=function()
{
	if(this._frame_rate<=0) return;
	if(this._interval_id!=null) clearInterval(this._interval_id);
	this._interval_id=setInterval(Global.delegate(this._onTimeHandler,this),Math.ceil(1000/this._frame_rate));
    this._start_time=(new Date()).getTime();
    this._is_start=true;
}

Timer.prototype.stop=function()
{
	if(this._interval_id!=null) clearInterval(this._interval_id);
	this._interval_id=null;
	this._is_start=false;
	this._start_time=0;
}

Timer.prototype.dispose=function()
{
	Timer.superClass.dispose.call(this);
	stop();
	delete this._start_time,this._interval_id,this._frame_rate,this._is_start;
}

Timer.prototype.toString=function()
{
	return "Timer";
}

Timer.delayCall=function(second,callback,params,target,id)
{
	if(second<=0 || callback==undefined) return;
	
	if(id) clearTimeout(id);
	return setTimeout(function(){ callback.apply(target,params); },1000*second);
}
