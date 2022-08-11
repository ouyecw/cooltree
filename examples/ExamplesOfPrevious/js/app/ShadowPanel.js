
function ShadowPanel()
{
	DisplayObjectContainer.call(this);
	this._shape=this.bg=this._color_btn=this._color_box=this._target=this.alpha_bar=this.alpha_tf=this.angle_bar=this.angle_tf=this.distance_bar=this.distance_tf=this.blur_bar=this.blur_tf=null;
	this._enable=true;
	this._init=false;
}

Global.inherit(ShadowPanel,DisplayObjectContainer);

Object.defineProperty(ShadowPanel.prototype,"enable",{
	get: function () {
	    return this._enable;
    },

    set: function (value) {
    	if(!this._init) return;
    	this._enable=value;
    	this.mouseChildren=value;
    	this._color_btn.enable=this.alpha_bar.enable=this.angle_bar.enable=this.blur_bar.enable=this.distance_bar.enable=value;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(ShadowPanel.prototype,"target",{
	get: function () {
	    return this._target;
    },

    set: function (value) {
    	if(this._target==value || !this._init) return;
    	this.enable=(value!=null);
    	this._target=value;
    	
    	if(value==null) return;
    	this.alpha_bar.value=Math.ceil(value.alpha*100);
    	this.angle_bar.value=value.angle;
    	this.blur_bar.value=value.shadowBlur;
    	this.distance_bar.value=value.distance;
    	this._color_box.color=value.shadowColor;
    	
    	this.alpha_tf.text=Math.ceil(value.alpha*100)+"";
    	this.angle_tf.text=value.angle+"";
    	this.blur_tf.text=value.shadowBlur+"";
    	this.distance_tf.text=value.distance+"";
    },
    enumerable: true,
    configurable: true
});

ShadowPanel.prototype.init=function()
{
	if(this._init) return;
	this._init=true;
	
	var config=Main.studio.datas.config;
	this.bg=Factory.c("bs",[config.panel_color,Panel.WIDTH,205,0]);
	this.addChild(this.bg);

	this.create_bar(config.shadow_aphla_text,"alpha_tf","alpha_bar",40,0,100,this.changeAlphaHandler,true);
    this.create_bar(config.shadow_distance_text,"distance_tf","distance_bar",70,0,120,this.changeDistanceHandler);
    this.create_bar(config.shadow_angle_text,"angle_tf","angle_bar",100,0,360,this.changeAngleHandler);
    this.create_bar(config.shadow_blur_text,"blur_tf","blur_bar",130,0,120,this.changeBlurHandler);
    
    var label=Factory.c("tf",{text:config.shadow_color_text,size:14,color:Main.studio.datas.config.text_color,font:Main.studio.datas.config.text_font});
	label.moveTo(10,165);
	this.addChild(label);
    
    this._color_btn=new Button();
    this._color_box=Factory.c("bs",["#000000",32,32,0,1,"#999999"]);
    this._color_btn.setup(this._color_box);
    this._color_btn.moveTo(60,156);
    this.addChild(this._color_btn);
    this._color_btn.addEventListener(ColorPanel.CHANGE,Global.delegate(this._onChangeColor,this));
    this._color_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this.click_color,this));
    
    var _title=Factory.c("tf",{text:config.shadow_panel_text,color:config.panel_line_color,font:config.text_font,size:14,align:"left",bold:true,x:10});
    this.addChild(_title);
    
    var _line=Factory.c("bs",[config.panel_line_color,Panel.WIDTH,1]);
    this.addChild(_line);
    _line.y=20;
    
    Main.studio.container.addEventListener(Area.SELECT_ITEM,Global.delegate(this.onSelectHandler,this));
	Main.studio.container.addEventListener(Area.CANCEL_SELECTED,Global.delegate(this.onSelectHandler,this));
	
	this.enable=false;
	return this;
}

ShadowPanel.prototype._onChangeColor=function(e)
{
	if(!this._enable || StringUtil.isEmpty(e.params)) return;
	this._target.shadowColor=this._color_box.color=e.params;
}

ShadowPanel.prototype.onSelectHandler=function(e)
{
	var target=(e.type==Area.SELECT_ITEM ? e.params : null);
	if(target==null && this._target==null) return;
	
	this._shape=null;
	if(target==null || target.instance==null) {
		this.target=null;
		return;
	}
	
	var shadow,bool=(target.instance instanceof BoxShape || target.instance instanceof VideoPlayer),filters=bool ? target.instance.instance.filters : target.instance.filters;
	
	if(filters.length==0){
		shadow=new DropShadowFilter();
		filters.push(shadow);
	}
	
	this.target=filters[0];
	if(!bool) return; 
	this._shape=target.instance;
	this._target.radius=target.instance.redius;
}

ShadowPanel.prototype.click_color=function(e)
{
	Main.studio.open_color_window(e.target);
}

ShadowPanel.prototype.create_bar=function(text,tf_str,mbar_str,posY,min,max,func,bool)
{
	var label=Factory.c("tf",{text:text,size:14,color:Main.studio.datas.config.text_color,font:Main.studio.datas.config.text_font});
	this.addChild(label);
	label.moveTo(10,posY);
	
	var tf=Factory.c("tf",{text:""+(bool ? max : min),size:12,color:Main.studio.datas.config.text_color});
	this.addChild(tf);
	tf.moveTo(45,posY);
	
	var mbar=new MoveBar();
    var bar=Factory.c("bs");
    var bottom=Factory.c("bs");
    bar.setup(Main.studio.datas.config.bar_color,12,20);
    bottom.setup(Main.studio.datas.config.bottom_color,160,10);
    mbar.setup(min,max,(bool ? max : min),bar,bottom,false,true);
    mbar.moveTo(70,tf.y+3);
    this.addChild(mbar);
    
    this[tf_str]=tf;
    this[mbar_str]=mbar;
    mbar.breakTouch=true;
    mbar.addEventListener(MoveBar.CHANGE,Global.delegate(func,this));
}

ShadowPanel.prototype.changeDistanceHandler=function(e)
{
	this.distance_tf.text=Math.ceil(e.params)+"";
	if(this._target) {
		if(this._shape && this._shape.redius!=this._target.radius) this._target.radius=this._shape.redius;
		this._target.setDistance(MathUtil.int(e.params));
	}
}

ShadowPanel.prototype.changeAngleHandler=function(e)
{
	this.angle_tf.text=Math.ceil(e.params)+"";
	if(this._target) {
		if(this._shape && this._shape.redius!=this._target.radius) this._target.radius=this._shape.redius;
		this._target.angle=MathUtil.int(e.params);
		this._target.setShadowOffset();
	}
}

ShadowPanel.prototype.changeBlurHandler=function(e)
{
	this.blur_tf.text=Math.ceil(e.params)+"";
	if(this._target) {
		if(this._shape && this._shape.redius!=this._target.radius) this._target.radius=this._shape.redius;
		this._target.shadowBlur=MathUtil.int(e.params);
	}
}

ShadowPanel.prototype.changeAlphaHandler=function(e)
{
	this.alpha_tf.text=Math.ceil(e.params)+"";
	if(this._target) {
		if(this._shape && this._shape.redius!=this._target.radius) this._target.radius=this._shape.redius;
		this._target.alpha=Math.min(1,e.params*0.01);
	}
}
