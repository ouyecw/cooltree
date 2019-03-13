
class MoveBar extends DisplayObjectContainer
{
	constructor()
	{
		super();
		
		this._enable=this.isInitialized=this.useUpdate=this.isY=false;
		this.mouseEnabled=this.mouseChildren=true;
		this._mousePos=this.bar=this.bottom=null;
		this._min=this._max=this._value=0;
		this.isOrder=true;
	}
	
	get enable()
	{
		return this._enable;
	}
	
	set enable(value) 
	{
    	if(value==null || value==this._enable) return;
    	this._enable=value;
    	this._activate_bar(this._enable);
    }
	
	get min()
	{
		return this._min;
	}
	
	set min(value) 
	{
    	if(value==null || value==this._min) return;
    	this._min=value;
    	this.barSync();
    }
	
	get max()
	{
		return this._max;
	}
	
	set max(value) 
	{
    	if(value==null || value==this._max) return;
    	this._max=value;
    	this.barSync();
    }
	
	get value()
	{
		return this._value;
	}
	
	set value(value) 
	{
    	if(value==null || value==undefined) return;
    	value=MathUtil.clamp(value,this._min,this._max);
    	
    	if(value==this._value) return;
    	this._value=value;
    	
    	this.barSync();
//  	this.dispatchEvent(Factory.c("ev",[MoveBar.CHANGE,this._value]));
    }

	/**
	 * 设置参数
	 * @param {Number} min       最小值
	 * @param {Number} max       最大值
	 * @param {Number} value     初始值
	 * @param {DisplayBase} bar   移动条
	 * @param {DisplayBase} bottom 底板
	 * @param {Boolean} isY        方向
	 * @param {Boolean} update     是否实时更新
	 */
	setup(min,max,value,bar,bottom,isY=false,update=false)
	{
		this.bar=bar;
		this.bottom=bottom;
		
		this._min=min;
		this._max=max;
		this._value=value;
		
		this.isY=Boolean(isY);
		this.useUpdate=Boolean(update);
		
		if(this.bar && this.bottom) this.initialize();
	}
	
	initialize()
	{	
		if(!this.contains(this.bottom)) this.addChild(this.bottom);
		if(!this.contains(this.bar))    this.addChild(this.bar);
		
		if(!this.isY){
			this.bar.x=this.bottom.x+this.bar.getWidth()/2;
			this.bar.y=this.bottom.y+(this.bottom.getHeight()-this.bar.getHeight())*0.5;
		}else{
			this.bar.x=this.bottom.x+(this.bottom.getWidth()-this.bar.getWidth())*0.5;
			this.bar.y=this.bottom.y+this.bottom.getHeight()-this.bar.getHeight()/2;
		}
		
		this.enable=this.isInitialized=true;
		this.barSync();
	}
	
	_activate_bar(bool)
	{
		if(this.bar==undefined ||  this.bottom==undefined) return;
		this.bar.mouseEnabled=this.bottom.mouseEnabled=this.bar.buttonMode=bool;
		this.bar.breakTouch=bool;
		
		if(bool){
			this.bar.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._mouse_down_bar, this));
			if(this.bottom.alpha>0 && this.bottom.visible) this.bottom.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._mouse_move_handler, this));
			return;
		}
		
		this.bar.removeEventListener(StageEvent.MOUSE_DOWN);
		this.bottom.removeEventListener(StageEvent.MOUSE_DOWN);
	}
	
	_mouse_down_bar(e)
	{
		this._mousePos=this.bar.globalToLocal(e.mouseX,e.mouseY);
		(this.stage ? this.stage : Stage.current).addEventListener(StageEvent.MOUSE_MOVE,Global.delegate(this._mouse_move_handler, this),this.name);
		(this.stage ? this.stage : Stage.current).addEventListener(StageEvent.MOUSE_UP,Global.delegate(this._mouse_up_bar, this),this.name);
	}
	
	_mouse_up_bar(e)
	{
		(this.stage ? this.stage : Stage.current).removeEventListener(StageEvent.MOUSE_MOVE,null,this.name);
		(this.stage ? this.stage : Stage.current).removeEventListener(StageEvent.MOUSE_UP,null,this.name);
		
		this._mousePos=null;
		this.dataSync();
	}
	
	_mouse_move_handler(e)
	{
		let offset;
		
		if(this._mousePos){
			offset=(this.bar.origin ? this._mousePos.subtract(this.bar.origin) : this._mousePos.clone());
		}
		
		let pos=this.globalToLocal((e ? e.mouseX : (this.stage ? this.stage : Stage.current).mouseX)-(offset ? offset.x : 0),(e ? e.mouseY : (this.stage ? this.stage : Stage.current).mouseY)-(offset ? offset.y : 0))
		let xmouse=pos.x,ymouse=pos.y;
		
		if(this.isY){
			if(ymouse<=this.bottom.y){
				this.bar.y=this.bottom.y;
			}else if( ymouse>=(this.bottom.y+this.bottom.getHeight()-this.bar.getHeight())){
				this.bar.y=(this.bottom.y+this.bottom.getHeight()-this.bar.getHeight());
			}else{
				this.bar.y+=ymouse-this.bar.y;
			}
			
		}else{
			if(xmouse<=this.bottom.x){
				this.bar.x=this.bottom.x;
			}else if(xmouse>=(this.bottom.x+this.bottom.getWidth()-this.bar.getWidth())){
				this.bar.x=(this.bottom.x+this.bottom.getWidth()-this.bar.getWidth());
			}else{
				this.bar.x+=xmouse-this.bar.x;	
			}
		}
		
		if(this.useUpdate || (e.target==this.bottom)) this.dataSync();
	}
	
	dataSync()
	{
		let value=0;
		if(this.isY){
		    value=MathUtil.format(((this.bar.y-this.bottom.y)/(this.bottom.getHeight()-this.bar.getHeight()))*(this._max-this._min));
		}else{
			value=MathUtil.format(((this.bar.x-this.bottom.x)/(this.bottom.getWidth()-this.bar.getWidth()))*(this._max-this._min));
		}
		
		if(this.isOrder){
			this._value=(this._min+value)>=this._max ? this._max : (this._min+value);
		}else{
			this._value=(this._max-value)<=this._min ? this._min : (this._max-value);
		}
	
		this.dispatchEvent(Factory.c("ev",[MoveBar.CHANGE,this._value,(this._mousePos==null)]));
	}
	
	barSync()
	{
		if(!this.isInitialized || this.bar==undefined ||  this.bottom==undefined) return;
		let value=0;
		
		if(this.isOrder){
			value=this._value-this._min;
		}else{
			value=this._max-this._value;
		}
		
		if(this.isY){
		    this.bar.y=((value/(this._max-this._min))*(this.bottom.getHeight()-this.bar.getHeight()))+this.bottom.y;
		}else{
			this.bar.x=((value/(this._max-this._min))*(this.bottom.getWidth()-this.bar.getWidth()))+this.bottom.x;
		}
	}
	
	dispose()
	{	
		this.enable=false;
		super.dispose();
		delete this._mousePos,this._enable,this.isInitialized,this.useUpdate,this.isY,this._min,this._max,this._value,this.bar,this.bottom,this.isOrder;
	}

}

MoveBar.CHANGE="moveBarChange";
