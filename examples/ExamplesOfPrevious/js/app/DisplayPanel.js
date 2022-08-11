
function DisplayPanel()
{
	this._word=this._target=this._target_alpha=this.bg=this.no_btn=this.del_btn=this.up_btn=this.down_btn=this.alpha_bar=this.alpha_tf=null;
	DisplayObjectContainer.call(this);
	this._init=this._enable=false;
}

Global.inherit(DisplayPanel,DisplayObjectContainer);

Object.defineProperty(DisplayPanel.prototype,"enable",{
	get: function () {
	    return this._enable;
    },

    set: function (value) {
    	if(!this._init) return;
    	this._word.enable=this.no_btn.enable=this.alpha_bar.enable=this.del_btn.enable=this.up_btn.enable=this.down_btn.enable=value;
    	this.mouseChildren=value;
    	this._enable=value;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayPanel.prototype,"target",{
	get: function () {
	    return this._target;
    },

    set: function (value) {
    	if(this._target==value || !this._init) return;
    	
    	this._target=value;
    	this.enable=(value!=null);
    	
    	if(value) {
    		this._target_alpha=this.alpha_bar.value=Math.max(1,Math.ceil(this._target.alpha*100));
    		this.alpha_tf.text=Math.ceil(this._target.alpha*100)+"";
    		this._word.select(this._target.binding);
    	}
    },
    enumerable: true,
    configurable: true
});

DisplayPanel.prototype.init=function()
{
	if(this._init) return;
	this._init=true;
	
	var config=Main.studio.datas.config;
	
	this.bg=Factory.c("bs",[config.panel_color,Panel.WIDTH,200,0]);
	this.addChild(this.bg);
	
	var _label=Factory.c("tf",{text:config.display_aphla_text,color:config.text_color,font:config.text_font,size:14});
    _label.moveTo(5,35);
    this.addChild(_label);
	
	this.alpha_tf=Factory.c("tf",{text:"100",size:12,color:config.text_color});
	this.addChild(this.alpha_tf);
	this.alpha_tf.moveTo(50,37);
	
	this.alpha_bar=new MoveBar();
    var bar=Factory.c("bs");
    var bottom=Factory.c("bs");
    bar.setup(config.bar_color,12,20);
    bottom.setup(config.bottom_color,160,10);
    this.alpha_bar.setup(1,100,100,bar,bottom,false,true);
    this.alpha_bar.moveTo(72,this.alpha_tf.y+1);
    this.addChild(this.alpha_bar);
    this.alpha_bar.breakTouch=true;
    this.alpha_bar.addEventListener(MoveBar.CHANGE,Global.delegate(this.changeAlphaHandler,this));
    
    _label=Factory.c("tf",{text:config.display_bind_text,color:config.text_color,font:config.text_font,size:14});
    _label.moveTo(5,71);
    this.addChild(_label);
    
    this.no_btn=this.addChild(Main.studio.panel.createButton(33,34));
    this.up_btn=this.addChild(Main.studio.panel.createButton(29,30));
    this.del_btn=this.addChild(Main.studio.panel.createButton(35,36));
    this.down_btn=this.addChild(Main.studio.panel.createButton(31,32));
    this.no_btn.scale=this.up_btn.scale=this.del_btn.scale=this.down_btn.scale=MathUtil.format(0.6*(0.8/Number(Main.studio.datas.config.item_scale)));
    
    this.del_btn.moveTo(_label.x+1,106);
    var offset=Math.ceil((this.del_btn.getWidth()-config.display_delete_text.length*14)*0.5);
    _label=Factory.c("tf",{x:this.del_btn.x+offset,y:this.del_btn.y+55,text:config.display_delete_text,color:config.text_color,font:config.text_font,size:14});
    this.addChild(_label);
    
    this.up_btn.moveTo( this.del_btn.x+this.del_btn.getWidth()+5,this.del_btn.y);
    _label=Factory.c("tf",{x:this.up_btn.x+offset,y:_label.y,text:config.display_up_text,color:config.text_color,font:config.text_font,size:14});
    this.addChild(_label);
    
    this.down_btn.moveTo( this.up_btn.x+this.up_btn.getWidth()+5,this.up_btn.y);
    _label=Factory.c("tf",{x:this.down_btn.x+offset,y:_label.y,text:config.display_down_text,color:config.text_color,font:config.text_font,size:14});
    this.addChild(_label);
    
    this.no_btn.moveTo( this.down_btn.x+this.down_btn.getWidth()+5,this.down_btn.y);
    _label=Factory.c("tf",{x:this.no_btn.x+offset,y:_label.y,text:config.display_zero_text,color:config.text_color,font:config.text_font,size:14});
    this.addChild(_label);
    
    this.no_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this.onClickHandler,this));
    this.up_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this.onClickHandler,this));
    this.del_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this.onClickHandler,this));
    this.down_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this.onClickHandler,this));
	
	var _title=Factory.c("tf",{text:config.display_panel_text,color:config.panel_line_color,font:config.text_font,size:14,align:"left",bold:true,x:10});
    this.addChild(_title);
    
    var _line=Factory.c("bs",[config.panel_line_color,Panel.WIDTH,1]);
    this.addChild(_line);
    _line.y=20;
	
	this._word=this.getComboList(Main.studio.datas.binding,MovieManager.getData("color"),160);
	this._word.addEventListener(ComboList.SELECT,Global.delegate(this.onSelectWord,this));
	this.addChild(this._word);
	this._word.moveTo(72,66);
	this._word.breakTouch=true;
	
	Main.studio.container.addEventListener(Area.SELECT_ITEM,Global.delegate(this.onSelectHandler,this));
	Main.studio.container.addEventListener(Area.CANCEL_SELECTED,Global.delegate(this.onSelectHandler,this));
	
	this.enable=(this._target!=null);
	
	return this;
}

DisplayPanel.prototype.getComboList=function(datas,assets,w)
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

DisplayPanel.prototype._spreadHandler=function (e)
{
	if(e.params) Main.studio.checkItemEnable(e.target,this._unableComboList,this);
	else Main.studio.removeItemEnable(e.target);
}

DisplayPanel.prototype.onSelectWord=function(e)
{
	if(this._target==null) return;
	this._target.binding=e.params;
}

DisplayPanel.prototype.onSelectHandler=function(e)
{
	this.target=(e.type==Area.SELECT_ITEM ? e.params : null);
}

DisplayPanel.prototype.onClickHandler=function(e)
{
	if(!this._enable) return;
	var depth=this._target.getIndex();
	var max=Main.studio.container.container.numChildren-1;
	
	switch(e.target)
	{
		case this.up_btn:
			if(depth>=max) return;
			Main.studio.container.container.setChildIndex(this._target,depth+1);
			Main.studio.commands.push(Command.create(Command.DEPTH,this._target.name,depth,depth+1));
		    break;
		    
		case this.del_btn:
		    this._target.removeFromParent(false);
			Main.studio.commands.push(Command.create(Command.DELETE,this._target,depth));
			Main.studio.container.unableTransformer();
		    this.target=null;
		    break;
		    
    	case this.down_btn:
			if(depth<1) return;
			Main.studio.container.container.setChildIndex(this._target,depth-1);
			Main.studio.commands.push(Command.create(Command.DEPTH,this._target.name,depth,depth-1));
		    break;
		    
	    case  this.no_btn:
	        Main.studio.commands.push(Command.create(Command.ATTRIBUTE,this._target.name,this._target.rotation,0,"rotation"));
	    	this._target.rotation=0;
	    	Main.studio.dispatchEvent(new Event(EditItem.UPDATE_SIZE));
	    	break;
   }
}

DisplayPanel.prototype.changeAlphaHandler=function(e)
{
	this.alpha_tf.text=Math.ceil(e.params)+"";
	if(this._target) this._target.alpha=Math.min(1,e.params*0.01);
	
	if(e.label){
		if(this._target_alpha!=e.params) Main.studio.commands.push(Command.create(Command.ATTRIBUTE,this._target.name,Math.min(1,this._target_alpha*0.01),Math.min(1,e.params*0.01),"alpha"));
	    this._target_alpha=e.params;
	};
}
