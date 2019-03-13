
class Button extends DisplayObjectContainer
{
	constructor() 
	{
		super();
		this.autoSize=true;
		
		this.name = "button_"+this.name;
		this.state = "";
		
		this._register_instance=null;
		this.mouseChildren = false;
		this.mouseEnabled=true;
		this.buttonMode=true;
		this._enable = true;
		
		this.disabled_color;
		this.over_color;
		this.out_color;
	
		this.tf=null;
		this.frames={};
	}
	
	get instance()
	{
		return this._register_instance;
	}
	
	set instance(value) 
	{
    	let depth=null;
    	
    	if(this._register_instance!=null) {
    		if(this._register_instance.parent){
    			depth=this._register_instance.getIndex();
	    		depth=Math.max(0,depth);
				this._register_instance.removeFromParent(false);
    		}
    		
			this._register_instance =null;
		}
    	
    	if(value==null) return;
    	
        this._register_instance =value;
        if(depth!=null && !isNaN(""+depth)) this.addChildAt(this._register_instance,depth);
        else this.addChild(this._register_instance);
        
        this._updateSize();
    }
	
	get enable()
	{
		return this._enable;
	}
	
	set enable(value) 
	{
        if(value==undefined || value==null || value==this._enable) return;
		this._enable=value;
		this.mouseEnabled=this.buttonMode=value;
		if(!this._enable) this.setState(Button.state.DISABLED) || this.setState(Button.state.DOWN) || this.setState(Button.state.OVER);
        else this.setState(Button.state.UP);
    }
	
	setup (up, over, down, disabled)
	{
		up && this.setupState(up,Button.state.UP);
		over && this.setupState(over,Button.state.OVER);
		down && this.setupState(down,Button.state.DOWN);
		disabled && this.setupState(disabled,Button.state.DISABLED);
		
		this.setState(Button.state.UP);
	}
	
	/**
	 * @param {Object} tf 
	 * @param {String} over_color
	 * @param {String} disabled_color
	 */
	setLabel (tf,over_color,disabled_color)
	{
		if(this.tf) this.tf.removeFromParent(true);	
		if(!tf)return;
	
		this.tf=(tf instanceof DisplayBase) ? f : Factory.c("tf",tf);
		this.tf.mouseEnabled=false;
		this.addChild(this.tf);
		
		this.out_color=tf.color;
		this.over_color=over_color;
		this.disabled_color=disabled_color;
	}
	
	getLabel()
	{
		return this.tf ? this.tf.text : "";
	}
	
	setupState (obj,label)
	{
		if(this.frames==undefined || obj==undefined || StringUtil.isEmpty(label) || (!(obj instanceof Source) && !(obj instanceof Image) &&!(obj instanceof DisplayBase) && !(obj instanceof Effect) && !(obj instanceof Array))) return;
	    
	    let _frame=this.frames[label];
	    
	    if(_frame){
	    	if(_frame instanceof DisplayBase) {
	    		if(obj instanceof Source){
	    			_frame.setInstance(obj);
	    			return;
	    		}
	    		else _frame.removeFromParent(true);
	    	}
			else if(_frame instanceof Effect) ObjectPool.remove(_frame);
			else if(_frame instanceof Array){
				for(j=0;j<_frame.length;j++) ObjectPool.remove(_frame[j]);
			}
	    }
	    
	    if(obj instanceof Source || obj instanceof Image){
	    	let temp=Factory.c("do");
	    	temp.setInstance(obj);
	    	obj=temp;
	    }
	    
	    this.frames[label]=obj;
	}
	
	/**
	 * @param {String} b label
	 * @param {Boolean} p pass
	 */
	setState (b,p) 
	{
		if (this.state == b && (p==undefined || ! p)) return false;
		this.state = b;
		
		if(this.tf) {
	    	let color=(this.state==Button.state.DISABLED) ? this.disabled_color :(this.state==Button.state.OVER || this.state==Button.state.DOWN ? this.over_color : this.out_color);
	    	if(!StringUtil.isEmpty(color)) this.tf.color=color;
	    	this.tf.dispatchEvent(Factory.c("ev",[Button.STATE_CHANGE,this.state]));
	    }
	
		if(this.frames.hasOwnProperty(this.state) && this.frames[b]) {
			if(this.frames[b] instanceof DisplayBase) this.instance=this.frames[b];
			else if(this.instance==undefined) return;
			else if(this.frames[b] instanceof Effect || this.frames[b] instanceof Array){
				Effect.run(this.instance,this.frames[b]);
			}
		}
	    else if(!this.tf) return false;
	    
	    this.__checkDisplayUpdate();
		return true;
	};
	
	onMouseEvent (b) 
	{
		if (!b || !this._enable)  return;
		
		switch (b.type) {
			case "mousemove":
				this.setState(Button.state.OVER);
				break;
			case "mouseout":
				this.setState(Button.state.UP);
				break;
			case "mousedown":
				if(!this.setState(Button.state.DOWN)) this.setState(Button.state.OVER);
				break;
			case "mouseup":
				if(this.state !=Button.state.OVER) this.setState(Button.state.UP);
		}
	}
	
	dispose()
	{
		this._register_instance.removeFromParent(true);
		this._register_instance=null;
		
		if(this.frames){
			let i,j,obj;
			for(i in this.frames){
				obj=this.frames[i];
				if(obj) {
					if(obj instanceof DisplayBase) obj.removeFromParent(true);
					else if(obj instanceof Effect) ObjectPool.remove(obj);
					else if(obj instanceof Array){
						for(j=0;j<obj.length;j++) ObjectPool.remove(obj[j]);
					}
				}
				delete this.frames[i];
			}
		}
		
		super.dispose();
		delete this._register_instance,this.frames,this.tf,this.is_reversal,this.state,this.disabled_color,this.over_color,this.out_color;;
	}
	
	toString()
	{
		return Button.name;
	}
}

Button.STATE_CHANGE="stateChange";
	
Button.state = {
	UP: "up",
	OVER: "over",
	DOWN: "down",
	DISABLED: "disabled"
};
