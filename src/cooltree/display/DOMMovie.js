/**
===================================================================
DOMMovie Class
===================================================================
**/
import Source from '../core/Source.js'
import Event from '../events/Event.js'
import DOMDisplay from './DOMDisplay.js'
import MathUtil from '../utils/MathUtil.js'
import DisplayObject from './DisplayObject.js'
import ObjectPool from '../utils/ObjectPool.js'
import StringUtil from '../utils/StringUtil.js'

const _rate=Symbol("rate");
const _swing_play=Symbol("swingPlay");
const _reverse_play=Symbol("reversePlay");

/**
 * @class
 * @module DOMMovie
 * @extends DOMDisplay
 */
export default class DOMMovie extends DOMDisplay
{
	constructor(s=null)
	{
		super();
		
		this.label;
		this._frames=[];
		this._paused=true;
		this._replay_time=0;
		this[_swing_play]=false;
		this[_reverse_play]=false;
		this._count=this[_rate]=this._frame=this._current_frame=1;
		
		if(s) this.setFrames(s);
	}
	
	get currentFrame()
	{
		return this._current_frame;
	}
	
	get rate()
	{
		return this[_rate];
	}
	
	get swing()
	{
		return this[_swing_play];
	}
	
	get reverse()
	{
		return this[_reverse_play];
	}
	
	/**
     * movie reverse play
     * @param {Boolean} value
     */
	set reverse(value) 
	{
        if(value==undefined || value==null || value==this[_reverse_play]) return;
		this[_reverse_play]=Boolean(value);
    }
	
	set swing(value)
	{
		if(value==undefined || value==null || value==this[_swing_play]) return;
		this[_swing_play]=Boolean(value);
	}
	
	set rate(value)
	{
	    if(value==undefined || value==null || value<1 || value==this[_rate]) return;
		this[_rate]=Math.abs(MathUtil.int(value));
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
	
	/**
	 * 设置显示资源数组
	 * @param {Array} data [Source]
	 */
	setFrames(data)
	{
		if(data==null) return;
		for(let i in data) this.addFrame(data[i]);
		if(this._frames.length>0) this.gotoAndPlay(1);
	}
	
	/**
	 * 添加帧
	 * @param {Object} f
	 * @param {Object} i
	 */
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
	
	/**
	 * 播放
	 * @param {Number} time 循环次数
	 */
	play(time)
	{
		this._replay_time=(time==undefined) ? 0 : time;
		this._paused=false;
	}
	
	/**
	 * 停止播放
	 */
	stop()
	{
		this._paused=true;
	}
	
	/**
	 * 跳转到index帧停止播放
	 * @param {Number} index
	 */
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
	
	/**
	 * 跳转到index帧开始播放
	 * @param {Object} index
	 */
	gotoAndPlay(index)
	{
		this.gotoAndStop(index);
		this._paused=false;
	}
	
	nextFrame()
	{
		this._frame=this[_reverse_play] ? (this._current_frame<=1 ? this._frames.length : (this._current_frame-1)) : (this._current_frame>=this._frames.length ? 1 : (this._current_frame+1));
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
				this._count--;
							
				if(this._count<=0 ){
					if(((this[_reverse_play] && this._current_frame<=1)||(!this[_reverse_play] && this._current_frame>=this._frames.length))){
						
						if(this[_swing_play]){
							this.reverse=!this[_reverse_play];
						}
						
						if(this._replay_time>0){
							this._replay_time--;
							if(this._replay_time==0) {
								this._paused=true;
								this.dispatchEvent(new Event(Event.PLAY_OVER));
							}
						}
						else this.dispatchEvent(new Event(Event.PLAY_OVER));
					}
					
					this.nextFrame();
				}
				
				this._count=(this._count<=0) ? this[_rate] : this._count;
				this.__checkDisplayUpdate();
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
		this[_swing_play]=false,
		this[_reverse_play]=false;
		this._count=this[_rate]=this._frame=this._current_frame=1;
	}
	
	dispose()
	{
		super.dispose();
		delete this._count,this[_rate],this[_swing_play],this._frame,this[_reverse_play],this._frames,this._paused,this._current_frame,this.label,this._replay_time;
	}
	
	toString()
	{
		return DOMMovie.name;
	}
}
DOMMovie.className="DOMMovie";