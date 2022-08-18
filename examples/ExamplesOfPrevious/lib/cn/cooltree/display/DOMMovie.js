/**
===================================================================
DOMMovie Class
===================================================================
**/

function DOMMovie(s)
{
	DOMDisplay.call(this);
	
	this.label;
	this._frames=[];
	this._paused=true;
	this._replay_time=0;
	this._reverse_play=false;
	this._frame=this._current_frame=1;
	
	if(s) this.setFrames(s);
}

Global.inherit(DOMMovie,DOMDisplay);
DOMMovie.prototype.__class__="DOMMovie";

DOMMovie.prototype.clearAllFrames=function()
{
	if(this._frames==undefined) return;
	
	var value;
	while(this._frames.length>0){
		value=this._frames.pop();
		this._remove_frame(value);
	}
	
	this._frame=this._current_frame=1;
	this._paused=true;
}

DOMMovie.prototype.setFrames=function(data)
{
	if(data==null) return;
	for(var i in data) this.addFrame(data[i]);
	if(this._frames.length>0) this.gotoAndPlay(1);
}

DOMMovie.prototype.addFrame=function (f,i)
{
	if(f==undefined || f==null || !(f instanceof Source)) return;
	
	if(i==undefined) this._frames.push(f);
	else             this._frames.splice(i, 0, f);
	
	this.width=Math.max(this.width,f.rect ? f.rect.width : 0,f.width);
	this.height=Math.max(this.height,f.rect ? f.rect.height : 0,f.height);
}

DOMMovie.prototype.getFrame=function (i)
{
	return (i>=0 && i<this._frames.length) ? this._frames[i] : null;
}

Object.defineProperty(DOMMovie.prototype,"totalFrame",{
    get: function () {
        return this._frames.length;
    },
    enumerable: true,
    configurable: true
});

/**
 * remove frame 
 * @param {Number} i
 */
DOMMovie.prototype.removeFrame=function (i)
{
	if(i<0 || i>=this._frames.length) return;
	var frame=this._frames.splice(i, 1);
	this._remove_frame(frame);
}

DOMMovie.prototype._remove_frame=function(frame)
{
	if(frame==undefined || frame==null) return;
	
	if(frame instanceof Source && frame.isClone){
		ObjectPool.remove(frame);
	}
	else if(frame instanceof DisplayObject){
		frame.removeFromParent(true);
	}
}

DOMMovie.prototype.play=function(time)
{
	this._replay_time=(time==undefined) ? 0 : time;
	this._paused=false;
}

DOMMovie.prototype.stop=function()
{
	this._paused=true;
}
	
DOMMovie.prototype.gotoAndStop=function(index)
{
	if(this._frames==undefined) return;
	
	if( typeof index == "string"){
		var i;
		const len=this._frames.length;
		
		for(i=0;i<len;i++){
			if(this._frames[i] && this._frames[i].label==index){
				index=Number(i)+1;
				break;
			}
		}
	}
	
	if(index<1 || index>this._frames.length) return;
	this._frame=index;
	this._paused=true;
}

DOMMovie.prototype.gotoAndPlay=function(index)
{
	this.gotoAndStop(index);
	this._paused=false;
}

DOMMovie.prototype.nextFrame=function()
{
	this._frame=this._reverse_play ? (this._current_frame<=1 ? this._frames.length : (this._current_frame-1)) : (this._current_frame>=this._frames.length ? 1 : (this._current_frame+1));
}

DOMMovie.prototype.render=function(object)
{
	if (!this.visible || this.alpha <= 0) {
		DOMMovie.superClass.render.call(this,object);
		return;
	}
	
	if((!this._paused || this.instance==null || (this._frame!=this._current_frame)) && this._frames.length>0) {
		this._current_frame=this._frame;
		const target=this._frames[this._current_frame-1];
		this.setInstance(target);
		this.label=target.animation+(StringUtil.isEmpty(target.label) ? "" :(":"+target.label));
		
		if(!this._paused){
			this.nextFrame();
			
			if(((this._reverse_play && this._current_frame<=1)||(!this._reverse_play && this._current_frame>=this._frames.length)) && this._replay_time>0){
				this._replay_time--;
				if(this._replay_time==0) {
					this._paused=true;
					this.dispatchEvent(new Event(Event.PLAY_OVER));
				}
			}
		}
	}

	DOMMovie.superClass.render.call(this,object);
}

Object.defineProperty(DOMMovie.prototype,"reverse",{
    get: function () {
        return this._reverse_play;
    },
    /**
     * movie reverse play
     * @param {Boolean} value
     */
    set: function (value) {
        if(value==undefined || value==null || value==this._reverse_play) return;
		this._reverse_play=value;
    },
    enumerable: true,
    configurable: true
});

DOMMovie.prototype.reset=function()
{
	this.clearAllFrames();
	
	this.label=null;
	this._paused=true;
	this._replay_time=0;
	this._reverse_play=false;
	this._frame=this._current_frame=1;
	DOMMovie.superClass.reset.call(this);
}

DOMMovie.prototype.dispose=function()
{
	this.reset();
	DOMMovie.superClass.dispose.call(this);
	delete this._frame,this._reverse_play,this._frames,this._paused,this._current_frame,this.label,this._replay_time;
}

DOMMovie.prototype.toString=function()
{
	return "DOMMovie";
}
