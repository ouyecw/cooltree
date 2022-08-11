
function ShapePanel()
{
	this.image_btn=this.line=this.fill=this.thickness_bar=this.scale_bar=this.radian_bar=this.bg=this._tf=this._target=null;
	DisplayObjectContainer.call(this);
	this._enable=true;
	this._init=false;
}

Global.inherit(ShapePanel,DisplayObjectContainer);

Object.defineProperty(ShapePanel.prototype,"enable",{
	get: function () {
	    return this._enable;
    },

    set: function (value) {
    	if(!this._init) return;
    	this._enable=value;
    	this.mouseChildren=value;
    	this.image_btn.enable=this.scale_bar.enable=this.line.enable=this.fill.enable=this.thickness_bar.enable=this.radian_bar.enable=value;
   },
    enumerable: true,
    configurable: true
});

Object.defineProperty(ShapePanel.prototype,"target",{
	get: function () {
	    return this._target;
    },

    set: function (value) {
    	if(this._target==value || !this._init) return;
    	
    	this._target=value;
    	this.enable=(value!=null);
    	
    	if(this._target){
    		this.radian_bar.enable=(this._target.parent.type!=3);
    		var num=Math.floor(Math.min(this._target.width,this._target.height)*0.5);
    		
    		if(this._target.parent.type!=3){
    			this.radian_bar.max=num;
    			this.radian_bar.value=this._target.redius;
    		}
    		
    		this.thickness_bar.value=this._target._thickness;
    		
    		num=Math.round((this._target.height/this._target.width)*1000);
    		if(num<100 || num>4000 || this._target.parent.type==3) this.scale_bar.enable=false;
    		else                   this.scale_bar.value=num;
         
    		this.set_color(this.fill,this._target.color);
    		this.set_color(this.line,this._target.strokeColor);
    	}
    },
    enumerable: true,
    configurable: true
});

ShapePanel.prototype.set_color=function(btn,color)
{
	if(StringUtil.isEmpty(color)){
		btn.instance.color="#FFFFFF";
		if(!btn.contains(btn.none_icon)) btn.addChild(btn.none_icon);
	}else{
		if(btn.contains(btn.none_icon)) btn.removeChild(btn.none_icon);
		btn.instance.color=color;
	}
}

ShapePanel.prototype.init=function()
{
	if(this._init) return;
	this._init=true;
	
	var config=Main.studio.datas.config;
	this.bg=Factory.c("bs",[config.panel_color,Panel.WIDTH,172,0]);
	this.addChild(this.bg);
	
	var label=Factory.c("tf",{text:config.shape_angle_text,color:config.text_color,font:config.text_font,size:14});
    label.moveTo(5,35);
    this.addChild(label);
	
	var _title=Factory.c("tf",{y:2,text:config.shape_panel_text,color:config.panel_line_color,font:config.text_font,size:14,align:"left",bold:true,x:10});
    this.addChild(_title);
    
    var _line=Factory.c("bs",[config.panel_line_color,Panel.WIDTH,1]);
    this.addChild(_line);
    _line.y=22;
	
	this.radian_bar=new MoveBar();
    var bar=Factory.c("bs");
    var bottom=Factory.c("bs");
    bar.setup(config.bar_color,12,20);
    bottom.setup(config.bottom_color,190,10);
    this.radian_bar.setup(0,100,100,bar,bottom,false,true);
    this.radian_bar.moveTo(40,37);
    this.addChild(this.radian_bar);
    this.radian_bar.addEventListener(MoveBar.CHANGE,Global.delegate(this.changeRadianHandler,this));
    
    label=Factory.c("tf",{text:config.shape_frame_text,color:config.text_color,font:config.text_font,size:14});
    label.moveTo(5,65);
    this.addChild(label);
    
    this.thickness_bar=new MoveBar();
    this.thickness_bar.setup(0,80,0,bar.clone(),bottom.clone(),false,true);
    this.thickness_bar.moveTo(40,67);
    this.addChild(this.thickness_bar);
    this.thickness_bar.addEventListener(MoveBar.CHANGE,Global.delegate(this.changeThicknessHandler,this));

    label=Factory.c("tf",{text:config.shape_scale_text,color:config.text_color,font:config.text_font,size:14});
    label.moveTo(5,95);
    this.addChild(label);
	
	this.scale_bar=new MoveBar();
    this.scale_bar.setup(100,4000,1000,bar.clone(),bottom.clone(),false,true);
    this.scale_bar.moveTo(40,97);
    this.addChild(this.scale_bar);
    this.scale_bar.breakTouch=true;
    this.scale_bar.addEventListener(MoveBar.CHANGE,Global.delegate(this.changeScaleHandler,this));
	
    this.line=this.addChild(this.getBtn());
    this.fill=this.addChild(this.getBtn());
    
    label=Factory.c("tf",{text:config.shape_fill_text,color:config.text_color,font:config.text_font,size:14});
    label.moveTo(5,135);
    this.addChild(label);
    this.fill.moveTo(51,126);
    
    label=Factory.c("tf",{text:config.shape_color_text,color:config.text_color,font:config.text_font,size:14});
    label.moveTo(87,135);
    this.addChild(label);
    this.line.moveTo(130,126);
    
    label=Factory.c("tf",{text:config.shape_image_text,color:config.text_color,font:config.text_font,size:14});
    label.moveTo(164,135);
    this.addChild(label);
    
    this.image_btn=new Button();
	var asset=MovieManager.getData("color");
	this.image_btn.setup(asset[42],asset[43]);
	this.addChild(this.image_btn);
	this.image_btn.scale=0.65;
	this.image_btn.moveTo(206,125);
	this.image_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this._onImageClick,this));
	
	Main.studio.container.addEventListener(Area.SELECT_ITEM,Global.delegate(this.onSelectHandler,this));
	Main.studio.container.addEventListener(Area.CANCEL_SELECTED,Global.delegate(this.onSelectHandler,this));
	
	this.enable=false;
	return this;
}

ShapePanel.prototype.getBtn=function()
{
	var btn=new Button();
	var assets=MovieManager.getData("color");
    var bs=Factory.c("bs",["#000000",32,32,0,1,"#999999"]);
    
    var icon=Factory.c("do");
    icon.setInstance(assets[16]);
    btn.none_icon=icon;
    icon.scale=0.5;
    
    btn.setup(bs);
    btn.addEventListener(ColorPanel.CHANGE,Global.delegate(this._onChangeColor,this));
	btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this._onClickHandler,this));

	return btn;
}

ShapePanel.prototype._onImageClick=function(e)
{
	var _this=this;
	if(this._target==null) return;
	
	Main.studio.file.auto_parse=true;
    Main.studio.file.element.accept="image/*";
	Main.studio.file.removeEventListener(File.COMPLETE);
	Main.studio.file.addEventListener(File.COMPLETE,function(e){
		this.removeEventListener(File.COMPLETE);
		var file=new Image();
		file.onload=function(){
			this.onload=this.onerror=null;
			_this.set_color(_this.fill,"");
	    	_this.target.pattern=file;
		};
		
    	file.onerror=function(){
    		Main.studio.warn("图片解析失败.");
    	}
    	
		file.src=e.params[0];
	});
	
	Main.studio.file.open();
}

ShapePanel.prototype._onChangeColor=function(e)
{
	if(!this._enable) return;
	this.set_color(e.target,e.params);
	Main.studio.commands.push(Command.create(Command.ATTRIBUTE,this._target.parent.name,this._target[(e.target==this.fill ? "color" : "strokeColor")],e.params,(e.target==this.fill ? "color" : "strokeColor"),this._target.getIndex()));
	this._target[(e.target==this.fill ? "color" : "strokeColor")]=e.params;
}

ShapePanel.prototype._onClickHandler=function(e)
{
	if(this._target==null) return;
	Main.studio.open_color_window(e.target);
}

ShapePanel.prototype.onSelectHandler=function(e)
{
	var target=(e.type==Area.SELECT_ITEM ? e.params : null);
	if((target==null && this._target==null)) return;
	
	if(target && target.type<2){
		if(this._target) this.target=null;
		return;
	}
	
	if(target==null) this.target=null;
	else {    
		this.target=target.instance;
	}
}

ShapePanel.prototype.changeRadianHandler=function(e)
{
	if(this._target==null) return;
	if(e.label) Main.studio.commands.push(Command.create(Command.ATTRIBUTE,this._target.parent.name,this._target.redius,e.params,"redius",this._target.getIndex()));
	this._target.redius=e.params;
}

ShapePanel.prototype.changeThicknessHandler=function(e)
{
	if(this._target==null) return;
	if(e.label) Main.studio.commands.push(Command.create(Command.ATTRIBUTE,this._target.parent.name,this._target.thickness,e.params,"thickness",this._target.getIndex()));
	this._target.thickness=e.params;
	if(this._target.parent) this._target.parent._updateSize();
}

ShapePanel.prototype.changeScaleHandler=function(e)
{
	if(this._target==null) return;
	var num=Math.max(1,this._target.width*(e.params*0.001));
	if(e.label) Main.studio.commands.push(Command.create(Command.ATTRIBUTE,this._target.parent.name,this._target.height,num,"height",this._target.getIndex()));
	this._target.height=num;
	if(this._target.parent) this._target.parent._updateSize();
	Main.studio.dispatchEvent(new Event(EditItem.UPDATE_SIZE));
}