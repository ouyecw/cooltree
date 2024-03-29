/**
===================================================================
MovieClip Class
===================================================================
**/
function MovieClip(s)
{
	DisplayObject.call(this);
	
	this.label;
	this._frames=[];
	this._paused=true;
	
	this._replay_time=0;
	this._reverse_play=false;
	this._count=this._rate=1;
	
	this._frame=1;
	this._current_frame=1;
	if(s) this.setFrames(s);
}

Global.inherit(MovieClip,DisplayObject);
MovieClip.prototype.__class__="MovieClip";

MovieClip.prototype.clearAllFrames=function()
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

MovieClip.prototype.setFrames=function(data)
{
	if(data==null || !(data instanceof Array) || data.length<=0) return;
	
	var i,l=data.length;
	for(i=0;i<l;i++) this.addFrame(data[i]);
	if(this._frames.length>0) this.gotoAndPlay(1);
}

MovieClip.prototype.addFrame=function (f,i)
{
	if(f==undefined || f==null) return;
	if(!(f instanceof Source) && !(f instanceof DisplayObject)) return;
	if(i==undefined) this._frames.push(f);
	else             this._frames.splice(i, 0, f);
	
	const bool=(f instanceof DisplayObject);	
	this.width=bool ? f.width : Math.max(this.width,f.rect ? f.rect.width : 0,f.width);
	this.height=bool ? f.height : Math.max(this.height,f.rect ? f.rect.height : 0,f.height);
	this.name=bool ? this.name : f.animation+(StringUtil.isEmpty(f.label) ? "" :(":"+f.label));
}

MovieClip.prototype.getFrame=function (i)
{
	return (i>=0 && i<this._frames.length) ? this._frames[i] : null;
}

/**
 * remove frame 
 * @param {Number} i
 */
MovieClip.prototype.removeFrame=function (i)
{
	if(i<0 || i>=this._frames.length) return;
	var frame=this._frames.splice(i, 1);
	this._remove_frame(frame);
}

MovieClip.prototype._remove_frame=function(frame)
{
	if(frame==undefined || frame==null) return;
	
	if(frame instanceof Source && frame.isClone){
		ObjectPool.remove(frame);
	}
	else if(frame instanceof DisplayObject){
		frame.removeFromParent(true);
	}
}

MovieClip.prototype.play=function(time)
{
	this._replay_time=(time==undefined) ? 0 : time;
	this._paused=false;
}

MovieClip.prototype.stop=function()
{
	this._paused=true;
}
	
MovieClip.prototype.gotoAndStop=function(index)
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

MovieClip.prototype.gotoAndPlay=function(index)
{
	this.gotoAndStop(index);
	this._paused=false;
}

MovieClip.prototype.nextFrame=function()
{
	this._frame=this._reverse_play ? (this._current_frame<=1 ? this._frames.length : (this._current_frame-1)) : (this._current_frame>=this._frames.length ? 1 : (this._current_frame+1));
}

Object.defineProperty(MovieClip.prototype,"totalFrame",{
    get: function () {
        return this._frames.length;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(MovieClip.prototype,"currentFrame",{
    get: function () {
       return this._current_frame;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(MovieClip.prototype,"rate",{
    get: function () {
        return this._rate;
    },
    set: function (value) {
        if(value==undefined || value==null || value<=1 || value==this._rate) return;
		this._rate=MathUtil.int(value);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(MovieClip.prototype,"reverse",{
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

MovieClip.prototype.render=function()
{
	if (!this.visible || this.alpha <= 0) return;
	
	if((!this._paused || this.instance==null || (this._frame!=this._current_frame)) && this._frames.length>0) {
		this.label=this.name;
		this._current_frame=this._frame;
		var target=this._frames[this._current_frame-1];
		
		if(target && (target instanceof DisplayObject)){
			this.setInstance(target.instance);
			
			this.height=target.getHeight();
			this.width=target.getWidth();
	    }else{
	    	this._frames[this._current_frame-1]=this.setInstance(target);
	    }
	    
		var temp=this.label;
		this.label=this.name;
		this.name=temp;
		
		if(!this._paused){
			this._count--;
		
			if(this._count<=0 ){
				this.nextFrame();
				
				if(((this._reverse_play && this._current_frame<=1)||(!this._reverse_play && this._current_frame>=this._frames.length)) && this._replay_time>0){
					this._replay_time--;
					if(this._replay_time==0) {
						this._paused=true;
						this.dispatchEvent(new Event(Event.PLAY_OVER));
					}
				}
			}
			
			this._count=(this._count<=0) ? this._rate : this._count;
		}
	}
	
	MovieClip.superClass.render.apply(this,arguments);
}

MovieClip.prototype.reset=function()
{
	this.clearAllFrames();
	
	this.label=null;
	this._paused=true;
	this._replay_time=0;
	this._reverse_play=false;
	this._frame=this._count=this._rate=this._current_frame=1;
	MovieClip.superClass.reset.call(this);
}

MovieClip.prototype.dispose=function()
{
	this.reset();
	MovieClip.superClass.dispose.call(this);
	delete this._frame,this._count,this._rate,this._reverse_play,this._replay_time,this._frames,this._paused,this._current_frame,this.label;
}

MovieClip.prototype.toString=function()
{
	return "MovieClip";
}
