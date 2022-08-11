
function InputField()
{
	this._bg=this._label=this._tf=null;
	DisplayObjectContainer.call(this);
}

Global.inherit(InputField,DisplayObjectContainer);
InputField.CHANGE="input_field_change";

Object.defineProperty(InputField.prototype,"text",{
	get: function () {
	    return this._label ? this._label.text : "";
    },

    set: function (value) {
    	if(this._label==null || StringUtil.isEmpty(value)) return;
    	this._label.text=value;
    },
    enumerable: true,
    configurable: true
});

InputField.prototype.setup=function(w,h,size,max,tcolor,bcolor,fcolor)
{
	if(!StringUtil.isEmpty(fcolor)){
		this._bg=Factory.c("bs",["#ffffff",w+2,h+2,0,1,fcolor,0]);
		this._bg.mouseEnabled=true;
		this.addChild(this._bg);
	}
	
	this._label=Factory.c("tf",{text:"",size:size,color:(tcolor || "#999999")});
	this._label.setSize(w,h);
	this._label.mouseEnabled=(this._bg==null);
	this.addChild(this._label);
	if(this._bg) this._label.moveTo(2,2);
	
	this._tf=new InputText(true,false,1,false);
	this._tf.bgColor=(bcolor || "#DFF4FF");
	this._tf.setSize(w+2,h);
	this._tf.size=size;
	this._tf.maxChars=max;
	this._tf.mouseEnabled=true;
	this._tf.moveTo(this._bg ? 2 : 1,this._bg ? 0 : -2);
	
	(this._bg ? this._bg : this._label).addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this.onDoubleClick,this));
	this._tf.element.addEventListener(StageEvent.KEY_DOWN,Global.delegate(this.onKeyHandler,this));
}

InputField.prototype.onDoubleClick=function(e)
{
	if(DoubleClick.check() && !this.contains(this._tf)){
		this._tf.text=this._label.text;
		this._label.text="";
		this.addChild(this._tf);
		Main.studio.checkItemEnable(this._tf,this.cancel_select,this,true);
	}
}

InputField.prototype.cancel_select=function()
{
	if(this.contains(this._tf)){
		var bool=(this._label.text==this._tf.text);
		this._label.text=this._tf.text;
		this._tf.removeFromParent(false);
		if(!bool) this.dispatchEvent(new Event(InputField.CHANGE,StringUtil.trim(this._tf.text)));
	}
}

InputField.prototype.onKeyHandler=function(e)
{
	if(e.keyCode== "13") this.cancel_select();
}
