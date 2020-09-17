
import DisplayBase from '../display/DisplayBase.js'
import StageEvent from '../events/StageEvent.js'
import Event from '../events/Event.js'
import Global from '../core/Global.js'
import MoveBar from './MoveBar.js'

export default class SlideBar extends MoveBar
{
	constructor()
	{
		super();
		this.space=0;
		this.delta=0.05;
		this.minSize=12;
		this.useWheel=this.isScale=this.autoVisible=true;
		this._offset=this._rect=this._target=this._up_btn=this._down_btn=null;
	}
	
	get upBtn()
	{
		return this._up_btn;
	}
	
	set upBtn(value) 
	{
    	if(value==null || value==this._up_btn) return;
    	this._up_btn=value;
    }
	
	get downBtn()
	{
		return this._down_btn;
	}
	
	set downBtn(value) 
	{
    	if(value==null || value==this._down_btn) return;
    	this._down_btn=value;
    }

	get target()
	{
		return this._target;
	}
	
	set target(value) 
	{
    	if(value==null || value==this._target) return;
    	let bool=this.enable;
    	
    	this.enable=false;
    	this._target=value;
    	
    	this._target.x=this._rect.x;
	    this._target.y=this._rect.y;
	    
	    this.enable=bool;
	    this.dataSync(true);
    }
	
	/**
	 * @param {DisplayBase} target
	 * @param {Rectangle} rect
	 * @param {DisplayBase} bar
	 * @param {DisplayBase} bottom
	 * @param {Boolean} isY
	 * @param {Boolean} isScale
	 * @param {Point} offset
	 * @param {DisplayBase} upBtn
	 * @param {DisplayBase} downBtn
	 */
	setup(target,rect,bar,bottom,isY,isScale,offset,upBtn,downBtn)
	{
		this._rect=rect;
		this._target=target;
		
		if(this.useWheel){
			this._target.mouseEnabled=true;
	//		this._target.breakTouch=true;
		}
		
		this.bar=bar;
		this.bottom=bottom;
		this._offset=offset;
		
		this.useUpdate=true;
		this.isY=isY || false;
		this.isScale=isScale || false;
		
		if(upBtn) this._up_btn=upBtn;
		if(downBtn) this._down_btn=downBtn;
		
		this._min=0;
		this._value=0;
		this.resetRange();
		this.initLayout(this._offset);
	}
	
	resetRange(e)
	{
		this.max=Math.max(0,Math.ceil(this.isY ? this._target.getHeight()-this._rect.height : this._target.getWidth()-this._rect.width));
	    
	    let bool=!(this._max==0 && this.autoVisible);
		this.bottom.visible=this.bar.visible=bool;
		
	    if(this._down_btn) this._down_btn.visible=bool;
	    if(this._up_btn) this._up_btn.visible=bool;
	    
	    if(e) this.updataSync();
	}
	
	initLayout(offset)
	{
		this._target.x=this._rect.x;
		this._target.y=this._rect.y;
		
		let w=this._up_btn ? this._up_btn.getWidth() : 0;
		let h=this._up_btn ? this._up_btn.getHeight() : 0;
		
		this.bottom.x=(this.isY ? (this._rect.x + this._rect.width + this.space) : this._rect.x + w)+(offset ? offset.x : 0);
		this.bottom.y=(this.isY ? this._rect.y+h : this._rect.y+ this._rect.height+ this.space)+(offset ? offset.y : 0);
		
		if(this.isY) this.bottom.height=this._rect.height-2*h;
		else         this.bottom.width=this._rect.width-2*w;
		
		this.initialize();
		
		if(this._up_btn){
			if(!this.contains(this._up_btn)) this.addChild(this._up_btn);
			this._up_btn.moveTo((this.isY ? (this._rect.x + this._rect.width+ this.space) : this._rect.x)+(offset ? offset.x : 0),(this.isY ? this._rect.y : this._rect.y+ this._rect.height+ this.space)+(offset ? offset.y : 0));
		}
		
		if(this._down_btn){
			if(!this.contains(this._down_btn)) this.addChild(this._down_btn);
			this._down_btn.moveTo((this.isY ? (this._rect.x + this._rect.width+ this.space) : this._rect.x + this._rect.width-w)+(offset ? offset.x : 0),(this.isY ? this._rect.y+ this._rect.height-h : this._rect.y+ this._rect.height+ this.space)+(offset ? offset.y : 0));
		}
		
	}
	
	_reset_handler(e)
	{
		if(e.params){
			this._rect.width=(e.params.hasOwnProperty("w") ? e.params.w : this._rect.width);
			this._rect.height=(e.params.hasOwnProperty("h") ? e.params.h : this._rect.height);
			this.initLayout(this._offset);
			this.updataSync();
		}
		
		if(e.label){
			if(e.label.hasOwnProperty("r")) this.rotation=e.label.r;
			if(e.label.hasOwnProperty("x")) this.x=e.label.x;
			if(e.label.hasOwnProperty("y")) this.y=e.label.y;
		}
	}
	
	_activate_bar(bool)
	{
		super._activate_bar(bool);
		
		if(bool){
			if(this._target) {
				this._target.addEventListener(Event.RESIZE,Global.delegate(this._reset_handler,this),this.name);
				this._target.addEventListener(DisplayBase.RESIZE,Global.delegate(this.resetRange,this),this.name);
				this._target.addEventListener(StageEvent.DRAG_MOVE,Global.delegate(this.dragHandler,this),this.name);
				this._target.addEventListener(DisplayBase.RESET_INSTANCE,Global.delegate(this.resetRange,this),this.name);
				if(this.useWheel) this._target.addEventListener(StageEvent.MOUSE_WHEEL,Global.delegate(this.wheelHandler,this),this.name);
			}
			
			if(this._up_btn) this._up_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this._clickUpBtn,this));
			if(this._down_btn) this._down_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this._clickDownBtn,this));
			return;
		}
		
		if(this._target) {
			this._target.removeEventListener(Event.RESIZE,null,this.name);
			this._target.removeEventListener(DisplayBase.RESIZE,null,this.name);
			this._target.removeEventListener(StageEvent.DRAG_MOVE,null,this.name);
			this._target.removeEventListener(StageEvent.MOUSE_WHEEL,null,this.name);
			this._target.removeEventListener(DisplayBase.RESET_INSTANCE,null,this.name);
		}
		
		if(this._up_btn) this._up_btn.removeEventListener(StageEvent.MOUSE_CLICK);
		if(this._down_btn) this._down_btn.removeEventListener(StageEvent.MOUSE_CLICK);
	}
	
	dragHandler(e)
	{
		this.value=this.isY ? this._rect.y-this._target.y : this._rect.x-this._target.x;
	}
	
	wheelHandler(e)
	{
		this.updataSync(this._value+(e.delta<0 ? 1 : -1)*Math.max(1,Math.ceil(this.delta*this._max)));
	}
	
	barSync()
	{
		if(this.isScale){
			if(this.isY) this.bar.height=Math.max(this.bottom.height*(1-this.max/this.bottom.height),this.minSize);
			else         this.bar.width=Math.max(this.bottom.width*(1-this.max/this.bottom.width),this.minSize);
		}
		
		super.barSync();
	}
	
	dataSync(bool)
	{
		if(bool==undefined) super.dataSync();
		
		if(this.isY) this._target.y=this._rect.y-this._value;
		else         this._target.x=this._rect.x-this._value;
	}
	
	updataSync(v)
	{
		this.value=(v==undefined) ? (this.isY ? this._rect.y-this._target.y : this._rect.x-this._target.x) : v;
		this.dataSync(true);
	}
	
	_clickUpBtn(e)
	{
		this.updataSync(this._value-Math.max(1,Math.ceil(this.delta*this._max*2)));
	}
	
	_clickDownBtn(e)
	{
		this.updataSync(this._value+Math.max(1,Math.ceil(this.delta*this._max*2)));
	}
	
	dispose()
	{
		super.dispose();
		delete this._offset,this._target,this._up_btn,this._down_btn,this._rect;
		delete this.useWheel,this.space,this.delta,this.minSize,this.isScale,this.autoVisible;
	}
}

SlideBar.className="SlideBar";