
function Button() 
{
	UIBase.call(this);
	this.autoSize=true;
	this._auto_dispose=false;
	
	this.name = "button_"+this.name;
	this.state = "";
	
	this.mouseChildren = false;
	this.mouseEnabled=true;
	this.buttonMode=true;
	this._enable = true;
	
	this.disabled_color;
	this.over_color;
	this.out_color;

	this.tf=null;
	this.frames={};
};

Global.inherit(Button, UIBase);

Button.STATE_CHANGE="stateChange";

Button.state = {
	UP: "up",
	OVER: "over",
	DOWN: "down",
	DISABLED: "disabled"
};

Button.prototype.setup =function(up, over, down, disabled)
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
Button.prototype.setLabel = function(tf,over_color,disabled_color)
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

Button.prototype.getLabel=function()
{
	return this.tf ? this.tf.text : "";
}

Button.prototype.setupState = function(obj,label)
{
	if(this.frames==undefined || obj==undefined || StringUtil.isEmpty(label) || (!(obj instanceof Source) && !(obj instanceof Image) &&!(obj instanceof DisplayBase) && !(obj instanceof Effect) && !(obj instanceof Array))) return;
    
    var _frame=this.frames[label];
    
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

Object.defineProperty(Button.prototype,"enable",{
    get: function () {
        return this._enable;
    },
    set: function (value) {
        if(value==undefined || value==null || value==this._enable) return;
		this._enable=value;
		this.mouseEnabled=this.buttonMode=value;
		if(!this._enable) this.setState(Button.state.DISABLED) || this.setState(Button.state.DOWN) || this.setState(Button.state.OVER);
        else this.setState(Button.state.UP);
    },
    enumerable: true,
    configurable: true
});

/**
 * @param {String} b label
 * @param {Boolean} p pass
 */
Button.prototype.setState = function(b,p) 
{
	if (this.state == b && (p==undefined || ! p)) return false;
	this.state = b;
	
	if(this.tf) {
    	let color=(this.state==Button.state.DISABLED) ? this.disabled_color :(this.state==Button.state.OVER || this.state==Button.state.DOWN ? this.over_color : this.out_color);
    	if(!StringUtil.isEmpty(color)) this.tf.color=color;
    	this.tf.dispatchEvent(new Event(Button.STATE_CHANGE,this.state));
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

Button.prototype.onMouseEvent = function(b) 
{
	if (!this._enable)  return;
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
};

Button.prototype.dispose=function()
{
	if(this.frames){
		var i,j,obj;
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
	
	Button.superClass.dispose.call(this);
	delete this.frames,this.tf,this.is_reversal,this.state,this.disabled_color,this.over_color,this.out_color;;
}

Button.prototype.toString=function()
{
	return "Button";
}
