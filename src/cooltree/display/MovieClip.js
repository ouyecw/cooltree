/**
===================================================================
MovieClip Class
===================================================================
**/
import Source from '../core/Source.js'
import MathUtil from '../utils/MathUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import DisplayObject from './DisplayObject.js'
import StringUtil from '../utils/StringUtil.js'

const _rate=Symbol("rate");
const _swing_play=Symbol("swingPlay");
const _reverse_play=Symbol("reversePlay");
const _current_frame=Symbol("currentFrame");

/**
 * @class
 * @module MovieClip
 * @extends DisplayObject
 */
export default class MovieClip extends DisplayObject
{
	/**
	 * 新建动画实例
	 * @param {Array} data [Source|DisplayObject]
	 */
	constructor(s=null)
	{
		super();
		
		this.label;
		this._frames=[];
		this._paused=true;
		
		this._replay_time=0;
		this[_swing_play]=false;
		this[_reverse_play]=false;
		this._count=this[_rate]=1;
		
		this._frame=1;
		this[_current_frame]=1;
		if(s) this.setFrames(s);
	}
	
	get swing()
	{
		return this[_swing_play];
	}
	
	/**
	 * 总帧数
	 */
	get totalFrame()
	{
		return this._frames.length;
	}
	
	/**
	 * 当前帧数
	 */
	get currentFrame()
	{
		return this[_current_frame];
	}
	
	get rate()
	{
		return this[_rate];
	}
	
	/**
	 * 动画播放频率
	 * @param {Number} value
	 */
	set rate(value) 
	{
        if(value==undefined || value==null || value<1 || value==this[_rate]) return;
		this[_rate]=Math.abs(MathUtil.int(value));
    }
	
	get reverse()
	{
		return this[_reverse_play];
	}
	
	/**
	 * 反序/正序
     * movie reverse play
     * @param {Boolean} value
     */
	set reverse(value) 
	{
        if(value==undefined || value==null || value==this[_reverse_play]) return;
		this[_reverse_play]=Boolean(value);
    }
	
	/**
	 * 是否摇摆播放
	 * @param {Boolean} value
	 */
	set swing(value)
	{
		if(value==undefined || value==null || value==this[_swing_play]) return;
		this[_swing_play]=Boolean(value);
	}
	
	/**
	 * 清除全部帧
	 */
	clearAllFrames()
	{
		if(this._frames==undefined) return;
		
		let value;
		while(this._frames.length>0){
			value=this._frames.pop();
			this._remove_frame(value);
		}
		
		this._frame=this[_current_frame]=1;
		this._paused=true;
	}
	
	/**
	 * 设置显示资源数组
	 * @param {Array} data [Source|DisplayObject]
	 */
	setFrames(data)
	{
		if(data==null || !(data instanceof Array) || data.length<=0) return;
		
		let i,l=data.length;
		for(i=0;i<l;i++) this.addFrame(data[i]);
		if(this._frames.length>0) this.gotoAndPlay(1);
	}
	
	/**
	 * 动画添加帧
	 * @param {Source | DisplayObject} f 帧内容
	 * @param {Number} i 第几帧
	 */
	addFrame (f,i)
	{
		if(f==undefined || f==null) return;
		if(!(f instanceof Source) && !(f instanceof DisplayObject)) return;
		if(i==undefined) this._frames.push(f);
		else             this._frames.splice(i, 0, f);
		
		const bool=(f instanceof DisplayObject);	
		this.width=bool ? f.width : Math.max(this.width,f.frame_width,f.width);
		this.height=bool ? f.height : Math.max(this.height,f.frame_height,f.height);
		this.name=bool ? this.name : f.animation+(StringUtil.isEmpty(f.label) ? "" :(":"+f.label));
	}
	
	/**
	 * 获取帧内容
	 * @param {Number} i 帧数
	 * @return {DisplayObject | Source} 
	 */
	getFrame (i)
	{
		return (i>=0 && i<this._frames.length) ? this._frames[i] : null;
	}
	
	/**
	 * 删除帧
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
	 * @param {Number} index
	 */
	gotoAndPlay(index)
	{
		this.gotoAndStop(index);
		this._paused=false;
	}
	
	/**
	 * 跳至下一帧
	 */
	nextFrame()
	{
		this._frame=this[_reverse_play] ? (this[_current_frame]<=1 ? this._frames.length : (this[_current_frame]-1)) : (this[_current_frame]>=this._frames.length ? 1 : (this[_current_frame]+1));
	}
	
	render()
	{
		if (!this.visible || this.alpha <= 0) return;
		
		if((!this._paused || this.instance==null || (this._frame!=this[_current_frame])) && this._frames.length>0) {
			this.label=this.name;
			this[_current_frame]=this._frame;
			let target=this._frames[this[_current_frame]-1];
			
			if(target && (target instanceof DisplayObject)){
				this.setInstance(target.instance);
				
				this.height=target.getHeight();
				this.width=target.getWidth();
		    }else{
		    	this._frames[this[_current_frame]-1]=this.setInstance(target);
		    }
		    
			let temp=this.label;
			this.label=this.name;
			this.name=temp;
			
			if(!this._paused){
				this._count--;
			
				if(this._count<=0 ){
					if(((this[_reverse_play] && this[_current_frame]<=1)||(!this[_reverse_play] && this[_current_frame]>=this._frames.length))){     
						
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
		
		super.render(...arguments);
	}
	
	/**
	 * 重置
	 */
	reset(s=null)
	{
		super.reset();
		this.clearAllFrames();
		
		this.label=null;
		this._paused=true;
		this._replay_time=0;
		this[_swing_play]=false;
		this[_reverse_play]=false;
		this._frame=this._count=this[_rate]=this[_current_frame]=1;
		if(s) this.setFrames(s);
	}
	
	/**
	 * 销毁
	 */
	dispose()
	{
		super.dispose();
		delete this[_swing_play],this._frame,this._count,this[_rate],this[_reverse_play],this._replay_time,this._frames,this._paused,this[_current_frame],this.label;
	}
	
	toString()
	{
		return MovieClip.name;
	}
}

MovieClip.className="MovieClip";