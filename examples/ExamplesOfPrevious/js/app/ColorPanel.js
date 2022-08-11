
function ColorPanel()
{
	this._cv=this._bright_bar=this._color_bar=this._color=this._label=this._none=this._white=this._black=this._yellow=this._green=this._blue=this._red=this._violet=this.bg=this._target=null;
	DisplayObjectContainer.call(this);
	this._enable=true;
	this._init=false;
}

ColorPanel.CHANGE="color_change";

Global.inherit(ColorPanel,DisplayObjectContainer);

Object.defineProperty(ColorPanel.prototype,"enable",{
	get: function () {
	    return this._enable;
    },

    set: function (value) {
    	if(!this._init) return;
    	this._enable=value;
    	this.mouseChildren=value;
//  	this._color_bar.enable=this._bright_bar.enable=this._none.enable=this._white.enable=this._black.enable=this._yellow.enable=this._violet.enable=this._green.enable=this._blue.enable=this._red.enable=value;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(ColorPanel.prototype,"target",{
	get: function () {
	    return this._target;
    },

    set: function (value) {
    	if(!this._init) return;
    	
    	this._target=value;
    	this.enable=(value!=null);
    	
    	this._color.color=(value ? value.instance.color :"#FFFFFF");
    	this.setBrightColor(value ? value.instance.color :"");
    	this._label.text=(value ? value.instance.color :"");
    },
    enumerable: true,
    configurable: true
});

ColorPanel.prototype.init=function()
{
	if(this._init) return;
	this._init=true;

	var config=Main.studio.datas.config;
	this._color=Factory.c("bs",[config.panel_color,126,25]);
	this._color.moveTo(3,3);
	this.addChild(this._color);
	
	this._label=new InputField();
	this._label.setup(110,26,16,7);
	this._label.moveTo(3,5);
	this.addChild(this._label);
	this._label.addEventListener(InputField.CHANGE,Global.delegate(this.onChangeHandler,this))
	
	var assets=MovieManager.getData("color");
	this._none=this.addChild(this.getBtn(assets,15,16,""));
	this._violet=this.addChild(this.getBtn(assets,6,13,"#FF00FF"));
	this._yellow=this.addChild(this.getBtn(assets,3,10,"#FFFF00"));
	this._white=this.addChild(this.getBtn(assets,1,8,"#FFFFFF"));
	this._black=this.addChild(this.getBtn(assets,2,9,"#000000"));
	this._green=this.addChild(this.getBtn(assets,4,11,"#00FF00"));
	this._blue=this.addChild(this.getBtn(assets,7,14,"#0000FF"));
	this._red=this.addChild(this.getBtn(assets,5,12,"#FF0000"));
	
	var btns=[this._none,this._white,this._black,this._yellow,this._violet,this._green,this._blue,this._red];
	LayoutUtil.tile(btns,4,false,new Rectangle(3,32,32,32));
	
	this._bright_bar=new MoveBar();
    var bar=Factory.c("bs",[config.bar_color,3,30]);
    var bottom=Factory.c("bs",["#f1f1f1",126,30]);
    this._bright_bar.setup(1,20,10,bar,bottom,false,true);
    this._bright_bar.moveTo(3,100);
    this.addChild(this._bright_bar);
    this._bright_bar.addEventListener(MoveBar.CHANGE,Global.delegate(this.changeBrightHandler,this));
	
	this._color_bar=new MoveBar();
    var bar=Factory.c("bs",[config.bar_color,3,30]);
    var gcolor=new GColor(0,0,15,126,15,[0,0.25,0.5,0.75,1],["#F7221C","#FFF600","#00FF2F","#0C01FF","#ED2225"],126,30);
    var bottom=Factory.c("bs",[gcolor,126,30]);
    this._color_bar.setup(1,40,1,bar,bottom,false,true);
    this._color_bar.moveTo(3,132);
    this.addChild(this._color_bar);
    this._color_bar.addEventListener(MoveBar.CHANGE,Global.delegate(this.changeColorHandler,this));
	this.enable=false;
	
	return this;
}

ColorPanel.prototype.setColor=function(c,b)
{
	if(this._target==null) return;
	var bool=StringUtil.isEmpty(c);
	this._label.text=(bool ? "" : c);
	this._color.color=(!bool ? c :"#FFFFFF");
	if(b) this.setBrightColor(c);
	this._target.dispatchEvent(new Event(ColorPanel.CHANGE,c));
}

ColorPanel.prototype.setBrightColor=function(c)
{
	this._cv=c;
	if(StringUtil.isEmpty(c)){
		this._bright_bar.bottom.color="#f1f1f1";
		return;
	}
	
	this._bright_bar.value=10;
	this._bright_bar.bottom.color=new GColor(0,0,15,126,15,[0,0.5,1],["#FFFFFF",c,"#000000"],126,30);
}

ColorPanel.prototype.changeColorHandler=function(e)
{
	var v=e.params;
	var a=["#F7221C","#FFF600","#00FF2F","#0C01FF","#ED2225"];
	if(v==1 || v%10==0) return v==1 ? a[0] : a[v*0.1];
	var n1=Math.floor(v*0.1);
	var n2=n1+1;
	var c1=a[n1];
	var c2=a[n2];
	var n=MathUtil.format((v-n1*10)*0.1);
	var c=ColorUtil.interpolateColor(c1,c2,n);
	this.setColor(ColorUtil.formatColor(c),true);
}

ColorPanel.prototype.changeBrightHandler=function(e)
{
	if(StringUtil.isEmpty(this._cv)) return;
	if(e.params==10) return this._cv;
	var c=e.params>10 ? "#000000" : "#FFFFFF";
	var n=e.params>10 ? Math.ceil(e.params-10)*0.1 : Math.floor(10-e.params)*0.1;
	var v=ColorUtil.interpolateColor(this._cv,c,n);
	this.setColor(ColorUtil.formatColor(v));
}

ColorPanel.prototype.onChangeHandler=function(e)
{
	this.setColor(e.params,true);
	this.__checkDisplayUpdate();
}

ColorPanel.prototype.getBtn=function(a,n,o,d)
{
	var btn=new Button();
	btn.setup(a[n-1],a[o-1]);
	btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this._onClickHandler,this));
	btn.scale=0.42;
	btn.datas=d;
	return btn;
}

ColorPanel.prototype._onClickHandler=function(e)
{
	if(this._target==null) return;
	this.setColor(e.target.datas,true);
	this.__checkDisplayUpdate();
}