/**
===================================================================
DOMMovie Class
===================================================================
**/
import Source from '../core/Source.js'
import Event from '../events/Event.js'
import DOMDisplay from './DOMDisplay.js'
import DisplayObject from './DisplayObject.js'
import ObjectPool from '../utils/ObjectPool.js'
import StringUtil from '../utils/StringUtil.js'

const reverse_play=Symbol("reversePlay");

export default class DOMMovie extends DOMDisplay
{
	constructor(s=null)
	{
		super();
		
		this.label;
		this._frames=[];
		this._paused=true;
		this._replay_time=0;
		this[reverse_play]=false;
		this._frame=this._current_frame=1;
		
		if(s) this.setFrames(s);
	}
	
	get reverse()
	{
		return this[reverse_play];
	}
	
	/**
     * movie reverse play
     * @param {Boolean} value
     */
	set reverse(value) 
	{
        if(value==undefined || value==null || value==this[reverse_play]) return;
		this[reverse_play]=Boolean(value);
    }
	
	get totalFrame()
	{
		return this._frames.length;
	}
	
	clearAllFrames()
	{
		if(this._frames==undefined) return;
		
		let value;
		while(this._frames.length>0){
			value=this._frames.pop();
			this._remove_frame(value);
		}
		
		this._frame=this._current_frame=1;
		this._paused=true;
	}
	
	setFrames(data)
	{
		if(data==null) return;
		for(let i in data) this.addFrame(data[i]);
		if(this._frames.length>0) this.gotoAndPlay(1);
	}
	
	addFrame (f,i)
	{
		if(f==undefined || f==null || !(f instanceof Source)) return;
		
		if(i==undefined) this._frames.push(f);
		else             this._frames.splice(i, 0, f);
		
		this.width=Math.max(this.width,f.frame_width,f.width);
		this.height=Math.max(this.height,f.frame_height,f.height);
	}
	
	getFrame (i)
	{
		return (i>=0 && i<this._frames.length) ? this._frames[i] : null;
	}
	
	/**
	 * remove frame 
	 * @param {Number} i
	 */
	removeFrame (i)
	{
		if(i<0 || i>=this._frames.length) return;
		let frame=this._frames.splice(i, 1);
		this._remove_frame(frame);
	}
	
	_remove_frame(frame)
	{
		if(frame==undefined || frame==null) return;
		
		if(frame instanceof Source && frame.isClone){
			ObjectPool.remove(frame);
		}
		else if(frame instanceof DisplayObject){
			frame.removeFromParent(true);
		}
	}
	
	play(time)
	{
		this._replay_time=(time==undefined) ? 0 : time;
		this._paused=false;
	}
	
	stop()
	{
		this._paused=true;
	}
		
	gotoAndStop(index)
	{
		if(this._frames==undefined) return;
		
		if( typeof index == "string"){
			let i;
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
	
	gotoAndPlay(index)
	{
		this.gotoAndStop(index);
		this._paused=false;
	}
	
	nextFrame()
	{
		this._frame=this[reverse_play] ? (this._current_frame<=1 ? this._frames.length : (this._current_frame-1)) : (this._current_frame>=this._frames.length ? 1 : (this._current_frame+1));
	}
	
	render(object)
	{
		if (!this.visible || this.alpha <= 0) {
			super.render(object);
			return;
		}
		
		if((!this._paused || this.instance==null || (this._frame!=this._current_frame)) && this._frames.length>0) {
			this._current_frame=this._frame;
			const target=this._frames[this._current_frame-1];
			this.setInstance(target);
			this.label=target.animation+(StringUtil.isEmpty(target.label) ? "" :(":"+target.label));
			
			if(!this._paused){
				this.nextFrame();
				
				if(((this[reverse_play] && this._current_frame<=1)||(!this[reverse_play] && this._current_frame>=this._frames.length)) && this._replay_time>0){
					this._replay_time--;
					if(this._replay_time==0) {
						this._paused=true;
						this.dispatchEvent(new Event(Event.PLAY_OVER));
					}
				}
			}
		}
	
		super.render(object);
	}
	
	reset()
	{
		super.reset();
		this.clearAllFrames();
		
		this.label=null;
		this._paused=true;
		this._replay_time=0;
		this[reverse_play]=false;
		this._frame=this._current_frame=1;
	}
	
	dispose()
	{
		super.dispose();
		delete this._frame,this[reverse_play],this._frames,this._paused,this._current_frame,this.label,this._replay_time;
	}
	
	toString()
	{
		return DOMMovie.name;
	}
}
DOMMovie.className="DOMMovie";