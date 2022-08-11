
function TextPanel()
{
	DisplayObjectContainer.call(this);
	
	this._init=this._enable=false;
	this._input_width=this._input_height=this._color_btn=this._leading=this._spacing=this._scale_bar=this._ltr=this._utd=this._bold=this._italic=this._line=this._left=this._center=this._right=null;
	this.bg=this.btns=this._target=this._font=this._size=null;
}

Global.inherit(TextPanel,DisplayObjectContainer);

Object.defineProperty(TextPanel.prototype,"enable",{
	get: function () {
	    return this._enable;
    },

    set: function (value) {
    	if(!this._init) return;
    	this._enable=value;
    	this.mouseChildren=value;
//  	this._spacing.enable=this._leading.enable=this._scale_bar.enable=this._size.enable=this._font.enable=this._ltr.enable=this._utd.enable=this._bold.enable=this._italic.enable=this._line.enable=this._left.enable=this._center.enable=this._right.enable=value;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(TextPanel.prototype,"target",{
	get: function () {
	    return this._target;
    },

    set: function (value) {
    	if(this._target==value || !this._init) return;
    	
    	this._target=value;
    	this.enable=(value!=null);
    	this.set_target_data(value);
    },
    enumerable: true,
    configurable: true
});

TextPanel.prototype.set_target_data=function(t)
{
	var clear=(t==null);
	this._set_bool_btn(this._bold,clear ? false : t.bold);
	this._set_bool_btn(this._italic,clear ? false : t.italic);
	this._set_bool_btn(this._line,clear ? false : t.underline);
	this._set_bool_btn(this._left,clear ? true : (t.align=="start" || t.align=="left"));
	this._set_bool_btn(this._center,clear ? false : t.align=="center");
	this._set_bool_btn(this._right,clear ? false : t.align=="right");
	this._set_bool_btn(this._ltr,clear ? true : !t.writingMode);
	this._set_bool_btn(this._utd,clear ? false : t.writingMode);
	
	this._input_width.text=clear ? "0" : ""+t.width;
	this._input_height.text=clear ? "0" : ""+t.height;
	
	this._size.select(clear ? 8 : t.size);
	this._leading.select( clear ? 1 : t.leading);
	this._spacing.select(clear ? 1 : t.lineHeight);
	this._font.select(clear ? "Microsoft YaHei" : t.font);
	this._scale_bar.value=clear ? 300 : Math.ceil((t.width/t.height)*100);
	this._color_btn.instance.color=clear ? "#000000" : t.color;
	
	this.__checkDisplayUpdate();
}

TextPanel.prototype._set_bool_btn=function(btn,bool)
{
	if(btn.selected!=bool) {
		var up=btn.frames[Button.state.UP];
		var over=btn.frames[Button.state.OVER];
		
		btn.frames[Button.state.UP]=over;
		btn.frames[Button.state.OVER]=up;
		
		btn.setState(Button.state.UP,true);
	}
	
	btn.selected=bool;
}

TextPanel.prototype.init=function()
{
	if(this._init) return;
	this._init=true;
	
	var assets=MovieManager.getData("color");
	var config=Main.studio.datas.config;
	
	this.bg=Factory.c("bs",[config.panel_color,Panel.WIDTH,330,0]);
	this.addChild(this.bg);
	
	this._bold=this.addChild(this.getBtn(assets,25,26));
	this._italic=this.addChild(this.getBtn(assets,27,28));
	this._line=this.addChild(this.getBtn(assets,29,30));
	this._left=this.addChild(this.getBtn(assets,31,32));
	this._center=this.addChild(this.getBtn(assets,33,34));
	this._right=this.addChild(this.getBtn(assets,35,36));
	this._ltr=this.addChild(this.getBtn(assets,37,38));
	this._utd=this.addChild(this.getBtn(assets,39,40));
	
	this.btns=[this._bold,this._italic,this._line,this._left,this._center,this._right,this._ltr,this._utd];
	LayoutUtil.tile(this.btns,4,false,new Rectangle(15,80,54,54));
	
	this._input_width=new InputField();
	this._input_height=new InputField();
	this._input_width.setup(82,20,18,8,null,null,"#999999");
	this._input_height.setup(82,20,18,8,null,null,"#999999");
	this._input_width.moveTo(35,285);
	this._input_height.moveTo(152,285);
	this.addChild(this._input_width);
	this.addChild(this._input_height);
	this._input_width.addEventListener(InputField.CHANGE,Global.delegate(this.changeSizeHandler,this));
	this._input_height.addEventListener(InputField.CHANGE,Global.delegate(this.changeSizeHandler,this));
	
	this._color_btn=new Button();
    var color_box=Factory.c("bs",["#000000",32,32,0,1,"#999999"]);
    this._color_btn.setup(color_box);
    this._color_btn.moveTo(40,235);
    this.addChild(this._color_btn);
    this._color_btn.addEventListener(ColorPanel.CHANGE,Global.delegate(this._onChangeColor,this));
    this._color_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this.click_color,this));
    
	this._scale_bar=new MoveBar();
	this._scale_bar.isOrder=false;
	this._scale_bar.breakTouch=true;
	
    var bar=Factory.c("bs");
    var bottom=Factory.c("bs");
    bar.setup(config.bar_color,12,20);
    bottom.setup(config.bottom_color,110,10);
    this._scale_bar.setup(2,900,300,bar,bottom,false,true);
    
    this.addChild(this._scale_bar);
    this._scale_bar.moveTo(125,246);
    this._scale_bar.addEventListener(MoveBar.CHANGE,Global.delegate(this.changeScaleHandler,this));
	
	var _title=Factory.c("tf",{y:2,text:config.text_panel_text,color:config.panel_line_color,font:config.text_font,size:14,align:"left",bold:true,x:10});
    this.addChild(_title);
    
    var _line=Factory.c("bs",[config.panel_line_color,Panel.WIDTH,1]);
    this.addChild(_line);
    _line.y=22;
    
    var _label=Factory.c("tf",{text:config.font_leading_text,color:config.text_color,font:config.text_font,size:14});
    _label.moveTo(5,205);
    this.addChild(_label);
    
    _label=Factory.c("tf",{text:config.font_spacing_text,color:config.text_color,font:config.text_font,size:14});
    _label.moveTo(120,205);
    this.addChild(_label);
    
    _label=Factory.c("tf",{text:config.font_color_text,color:config.text_color,font:config.text_font,size:14});
    _label.moveTo(5,244);
    this.addChild(_label);
    
    _label=Factory.c("tf",{text:config.font_scale_text,color:config.text_color,font:config.text_font,size:14});
    _label.moveTo(80,244);
    this.addChild(_label);
    
    _label=Factory.c("tf",{text:config.font_text_width,color:config.text_color,font:config.text_font,size:14});
    _label.moveTo(5,290);
    this.addChild(_label);
    
     _label=Factory.c("tf",{text:config.font_text_height,color:config.text_color,font:config.text_font,size:14});
    _label.moveTo(122,290);
    this.addChild(_label);
	
	this._leading=this.getComboList(Main.studio.datas.font.leading,assets,60);
	this._leading.addEventListener(ComboList.SELECT,Global.delegate(this.onSelectLeading,this));
	this.addChild(this._leading);
	this._leading.moveTo(55,200);
	
	this._spacing=this.getComboList(Main.studio.datas.font.line,assets,60);
	this._spacing.addEventListener(ComboList.SELECT,Global.delegate(this.onSelectSpacing,this));
	this.addChild(this._spacing);
	this._spacing.moveTo(170,200);
	
	this._font=this.getComboList(Main.studio.datas.font.typeface,assets,90);
	this._font.addEventListener(ComboList.SELECT,Global.delegate(this.onSelectFont,this));
	this.addChild(this._font);
	this._font.moveTo(20,40);
	
	this._size=this.getComboList(Main.studio.datas.font.size,assets,90);
	this._size.addEventListener(ComboList.SELECT,Global.delegate(this.onSelectSize,this));
	this.addChild(this._size);
	this._size.moveTo(130,40);
	
	this._size.spread=this._font.spread=1;
	this._leading.breakTouch=this._spacing.breakTouch=this._font.breakTouch=this._size.breakTouch=true;
	
	Main.studio.container.addEventListener(Area.SELECT_ITEM,Global.delegate(this.onSelectHandler,this));
	Main.studio.container.addEventListener(Area.CANCEL_SELECTED,Global.delegate(this.onSelectHandler,this));
	Main.studio.container.addEventListener(Area.UPDATE_SIZE,Global.delegate(this.updateSizeHandler,this));
	
	this.enable=false;
	return this;
}

TextPanel.prototype.updateSizeHandler=function(e)
{
	if(!this._init || !this._enable || this._target==null) return;
	this._input_width.text=""+this._target.width;
	this._input_height.text=""+this._target.height;
}

TextPanel.prototype.changeSizeHandler=function(e)
{
	if(isNaN(e.params)) return;
	this._target[(e.target==this._input_width ? "width" : "height")]=Number(e.params);
	if(this._target.parent) this._target.parent._updateSize();
	Main.studio.dispatchEvent(new Event(EditItem.UPDATE_SIZE));
}

TextPanel.prototype._onChangeColor=function(e)
{
	if(!this._enable || StringUtil.isEmpty(e.params)) return;
	this._color_btn.instance.color=e.params;
	Main.studio.commands.push(Command.create(Command.ATTRIBUTE,this._target.parent.name,this._target.color,e.params,"color",this._target.getIndex()));
	this._target.color=e.params;
}

TextPanel.prototype.click_color=function(e)
{
	Main.studio.open_color_window(e.target);
}

TextPanel.prototype.changeScaleHandler=function(e)
{
	if(this._target==null) return;
	this._target.height=this._target.width/(e.params*0.01);
	if(this._target.parent) this._target.parent._updateSize();
	Main.studio.dispatchEvent(new Event(EditItem.UPDATE_SIZE));
	this.updateSizeHandler();
}

TextPanel.prototype.onSelectHandler=function(e)
{
	var target=(e.type==Area.SELECT_ITEM ? e.params : null);
	if((target==null && this._target==null)) return;
	
	if(target && !(target instanceof TextItem)){
		if(this._target) this.target=null;
		return;
	}
	
	if(target==null) this.target=null;
	else             this.target=target.instance;
}

TextPanel.prototype.getComboList=function(datas,assets,w)
{
	var btn=new Button();
	btn.setup(assets[20],assets[21]);
	
	var cl=new ComboList();
	cl.text_font=Main.studio.datas.config.text_font;
	cl.text_over_color=Main.studio.datas.config.text_color;
	cl.item_bg_color=Main.studio.datas.config.combolist_color;
	cl.item_over_color=Main.studio.datas.config.item_over_color;
	cl.item_frame_color=Main.studio.datas.config.combolist_frame_color;
	cl.text_normal_color=Main.studio.datas.config.combolist_text_color;
	
	cl.setup(datas,w,250,btn);
	var bg=Factory.c("bs",[Main.studio.datas.config.combolist_color,w,27,0,1,Main.studio.datas.config.combolist_frame_color]);
	cl.addChildAt(bg,0);
	bg.x=-5;
	
	cl._bar.bar.color=Main.studio.datas.config.slide_bar_color;
	cl._bar.bottom.color=Main.studio.datas.config.slide_bottom_color;
	cl.addEventListener(ComboList.SPREAD,Global.delegate(this._spreadHandler,this));
	return cl;
}

TextPanel.prototype._spreadHandler=function (e)
{
	if(e.params) Main.studio.checkItemEnable(e.target,this._unableComboList,this);
	else Main.studio.removeItemEnable(e.target);
}

TextPanel.prototype._unableComboList=function(cl)
{
	if(cl) cl._closeList();
}

TextPanel.prototype.getBtn=function(a,n,o)
{
	var btn=new Button();
	btn.selected=false;
	btn.setup(a[n-1],a[o-1]);
	btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this._onClickHandler,this));
	btn.scale=0.72;
	return btn;
}

TextPanel.prototype._onClickHandler=function(e)
{
	if(this._target==null) return;
	var btn=e.target;
	
	switch(btn){
		case this._bold:
		this._set_bool_btn(btn,!btn.selected);
		this._target.bold=btn.selected;
		break;
		case this._italic:
		this._set_bool_btn(btn,!btn.selected);
		this._target.italic=btn.selected;
		break;
		case this._line:
		this._set_bool_btn(btn,!btn.selected);
		this._target.underline=btn.selected;
		break;
		case this._left:
		this._set_bool_btn(btn,true);
		this._set_bool_btn(this._center,false);
		this._set_bool_btn(this._right,false);
		this._target.align="left";
		break;
		case this._center:
		this._set_bool_btn(btn,true);
		this._set_bool_btn(this._left,false);
		this._set_bool_btn(this._right,false);
		this._target.align="center";
		break;
		case this._right:
		this._set_bool_btn(btn,true);
		this._set_bool_btn(this._center,false);
		this._set_bool_btn(this._left,false);
		this._target.align="right";
		break;
		case this._ltr:
		this._set_bool_btn(btn,!btn.selected);
		this._set_bool_btn(this._utd,!btn.selected);
		this._target.writingMode=!this._target.writingMode;
		break;
		case this._utd:
		this._set_bool_btn(btn,!btn.selected);
		this._set_bool_btn(this._ltr,!btn.selected);
		this._target.writingMode=!this._target.writingMode;
		break;
	}
	
	Main.studio.dispatchEvent(new Event(EditItem.UPDATE_SIZE));
}

TextPanel.prototype.onSelectFont=function(e)
{
	if(this._target==null) return;
	Main.studio.commands.push(Command.create(Command.ATTRIBUTE,this._target.parent.name,this._target.font,e.params,"font",this._target.getIndex()));
	this._target.font=e.params;
}

TextPanel.prototype.onSelectSize=function(e)
{
	if(this._target==null) return;
	Main.studio.commands.push(Command.create(Command.ATTRIBUTE,this._target.parent.name,this._target.size,Number(e.params),"size",this._target.getIndex()));
	this._target.size=Number(e.params);
}

TextPanel.prototype.onSelectLeading=function(e)
{
	if(this._target==null) return;
	Main.studio.commands.push(Command.create(Command.ATTRIBUTE,this._target.parent.name,this._target.leading,e.params,"leading",this._target.getIndex()));
	this._target.leading=e.params;
}

TextPanel.prototype.onSelectSpacing=function(e)
{
	if(this._target==null) return;
	Main.studio.commands.push(Command.create(Command.ATTRIBUTE,this._target.parent.name,this._target.lineHeight,e.params,"lineHeight",this._target.getIndex()));
	this._target.lineHeight=e.params;
}


