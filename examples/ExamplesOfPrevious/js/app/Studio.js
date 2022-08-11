
function Studio()
{
	DisplayObjectContainer.call(this);
	this.is_submit=this.submit_btn=this.file_lock=this.img_data=this.img_btn=this.save_btn=this.bg_bar=this.cpanel=this.color_window=this.cache_obj=this.windows=this.modify=this.__key_handler=this.mc=this.ajax=this.index=this.updata=this.box=this.spanel=this.close=this.black=this.input=this.dp=this.list=this.commands=this.datas=this.container=this.panel=this.tpanel=this.wpanel=this.file=null;
}

Studio.CLOSE="window_close";
Global.inherit(Studio,DisplayObjectContainer);

Studio.prototype.init=function(d,m)
{
	this.datas=d;
	this.list=[];
	this.is_submit=false;
	this.modify=(m==true);
	this.commands=new CommandList();
	
	this.__key_handler=Global.delegate(this.onKeyHandler,this);
	
	this.container=new Area().init();
	this.container.breakTouch=true;
	this.addChild(this.container);
	
	if(!StringUtil.isEmpty(this.datas.config.display_bar_color)){
		this.bg_bar=Factory.c("bs",[this.datas.config.display_bar_color,window.innerWidth,Number(this.datas.config.item_height)]);
	    this.bg_bar.y=(Number(this.datas.config.display_bar_top)==1) ? 0 : window.innerHeight-Number(this.datas.config.item_height);
	    this.addChild(this.bg_bar);
	}
	
	var label="提交审核";
	label=(Main.power && Main.status!=2 ? "通过审核" : label);
	
	if(!((Main.power && Main.status==2) || (!Main.power && Main.status>=1))){
		this.submit_btn=QuickUI.getButton(0,110,30,this.datas.config.item_over_color,this.datas.config.window_color);
		this.submit_btn.setLabel(label,"微软雅黑",this.datas.config.window_text_color,20,false,null,0,180,50);
		this.submit_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this.onSubmitHandler,this));
		this.submit_btn.moveTo(272,135);
	}
	
	this.img_btn=QuickUI.getButton(0,80,30,this.datas.config.item_over_color,this.datas.config.window_color);
	this.save_btn=QuickUI.getButton(0,80,30,this.datas.config.item_over_color,this.datas.config.window_color);
	
	this.img_btn.setLabel("换截图","微软雅黑",this.datas.config.window_text_color,20,false,null,0,140,50);
	this.save_btn.setLabel("保 存","微软雅黑",this.datas.config.window_text_color,20,false,null,0,130,50);
	
	this.img_btn.moveTo(this.submit_btn ? 65 : 100,135);
	this.save_btn.moveTo(this.submit_btn ? 165 : 220,135);
	
	this.img_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this.onImgHandler,this));
	this.save_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this.onSaveHandler,this));
	
	this.panel=new Panel().init();
	this.panel.breakTouch=true;
	
	this.file=new File(false,"image/*");
	this.file.image_to_base64=true;
	this.file.visible=false;
	this.addChild(this.file);
	this.file.addEventListener(File.LIMIT,Global.delegate(this.fileSizeOut,this));
	
	this.tpanel=new TextPanel().init();
//	this.tpanel.breakTouch=true;
	this.spanel=new ShapePanel().init();
	this.wpanel=new ShadowPanel().init();
	this.dp=new DisplayPanel().init();
	
	var assets=MovieManager.getData("color");
	var btn=new Button();
	btn.scale=0.3;
	btn.setup(assets[40],assets[41]);
	
	this.windows=new Windows();
	this.windows.setup(Panel.WIDTH+10,Math.min(600,window.innerHeight-30-Number(Main.studio.datas.config.item_height)),30,Main.studio.datas.config.window_color,Main.studio.datas.config.window_text,btn,Main.studio.datas.config.window_bg_color,Main.studio.datas.config.window_text_color);
	
	this.windows.slide_bar.bottom.color=this.datas.config.slide_bottom_color;
	this.windows.slide_bar.bar.color=this.datas.config.slide_bar_color;
	this.windows._win_title.font=Main.studio.datas.config.text_font;
//	this.windows.control.breakTouch=true;
	
	btn=new Button();
	btn.scale=0.2;
	btn.setup(assets[40],assets[41]);
	this.cpanel=new ColorPanel().init();
	this.color_window=new Windows();
	this.color_window.setup(132,165,20,this.datas.config.window_color,Main.studio.datas.config.color_text,btn,Main.studio.datas.config.window_bg_color,Main.studio.datas.config.window_text_color);
    this.color_window.add(this.cpanel);
    this.cpanel.moveTo(this.color_window.bar_width);
    this.color_window._win_title.size=12;
    this.color_window._win_title.y=4;

	this.addChild(this.panel);
	this.black=Factory.c("bs",["#000000",500,500]);
	this.black.instance.mouseEnabled=true;
	this.black.instance.alpha=0.1;
	this.black.mouseChildren=true;
	
	this.mc=MovieManager.getInstance("Spinner");
	
	this.mc.stop();
	this.mc.visible=false;
	this.black.addChild(this.mc);
	
	this.box=Factory.c("bs",["#FFFFFF",280,100]);
	var tf=Factory.c("tf",{size:20});
	tf.width=tf.lineWidth=280;
	tf.height=100;
	tf.align="center";
	tf.name="warn_tf";
	this.box.addChild(tf);
	tf.moveTo(10,10);
	this.black.addChild(this.box);
	this.box.visible=false;
	
	this.close=new Button();
	this.close.scale=0.8;
	this.close.setup(assets[40],assets[41]);
	this.black.addChild(this.close);
	this.close.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this.onCloseHandler,this));
	
	this.input=new InputText(true,true,1,false);
	this.input.bgColor=this.datas.config.input_bg_color;
	this.input.mouseEnabled=true;
	this.input.visible=false;
	this.addChild(this.input);
	
	this.windows.addEventListener(Windows.CLOSE,Global.delegate(this.onCloseWindow,this));
	this.color_window.addEventListener(Windows.CLOSE,Global.delegate(this.onCloseWindow,this));
	
	this.container.addEventListener(Area.SELECT_ITEM,Global.delegate(this.onSelectHandler,this));
	this.container.addEventListener(Area.CANCEL_SELECTED,Global.delegate(this.onSelectHandler,this));
	this.container.transformer.addEventListener(Transformer.CLICK,Global.delegate(this.activeWindows,this));
	
	Stage.current.addEventListener(StageEvent.RESIZE,Global.delegate(this.onResizeHandler,this),this.name);
	Stage.current.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this.mouseDownHandler,this),this.name);
	
	if(this.modify) this._show_all_items();
	this.onResizeHandler();
}

Studio.prototype.fileSizeOut=function(e)
{
	this.warn("FAIL:"+e.params.join(",")+"等文件大小超出限定"+this.file.max_size+"M。");
}

Studio.prototype.onCloseWindow=function(e)
{
	e.target.removeFromParent(false);
	this.__checkDisplayUpdate();
}

Studio.prototype.activeWindows=function(e)
{
	if(this.windows==null || this.windows.parent) return; 
	this.addChildAt(this.windows,2);
	this.windows.moveTo(MathUtil.clamp(this.windows.x,0,window.innerWidth-Panel.WIDTH-10),MathUtil.clamp(this.windows.y,0,window.innerHeight-this.windows._bg.height));
}

Studio.prototype.onSelectHandler=function(e)
{
	if(e.type==Area.CANCEL_SELECTED){
		this.windows.removeFromParent(false);
		this.cancel_select();
		return;
	}
	
	var bool=true;
	
	if(e.params && e.params.type!=this.cache_obj) {
		this.cache_obj=e.params.type;
		bool=this.windows.remove();
		
		var i,p,array,posY=0;
		if(this.cache_obj==1){
			array=[[this.tpanel,2],[this.wpanel,0],[this.dp,1]];
		}else if(this.cache_obj>1){
			array=[[this.spanel,1],[this.wpanel,0],[this.dp,2]];
		}else{
			array=[[this.wpanel,0],[this.dp,1]];
		}
		
		var list=new Array(array.length);
		for(i=0;i<array.length;i++){
			p=array[i][0];
			p.y=posY;
			posY+=p.bg.height;
			list[(array[i][1])]=p;
		}
		
		for(i=0;i<list.length;i++){
			this.windows.add.apply(this.windows,[list[i],posY]);
		}
		
		var ch=this.windows.content_height;
		var dh=window.innerHeight-30-Number(this.datas.config.item_height);
		if(ch) dh=Math.min(ch,dh);
		this.windows.size(Panel.WIDTH+10,dh);
	}
	
	if(this.contains(this.windows)) return;
	if(bool) this.activeWindows();
	else {
		var w=window.innerWidth;
		this.addChildAt(this.windows,2);
		var b=(Number(this.datas.config.display_bar_top)==1);
	    this.windows.moveTo((w>850) ? w-Panel.WIDTH-12 : 1,(w>850 ? 2 : 20)+(b ? Number(this.datas.config.item_height) : 0));
	}
}

Studio.prototype._show_all_items=function()
{
	if(Main.mode_data==null) return;
	var s,i,d,item,l=Main.mode_data.data.length;
	
	if(!StringUtil.isEmpty(Main.mode_data.background)) {
		Main.studio.container.setBG(AssetManager.getSource(Loader.getName(Main.mode_data.background)));
		this.container.img_path=Main.mode_data.background;
	}
	
	for(i=0;i<l;i++){
		d=Main.mode_data.data[i];
		
		if(d.type==0){
			item=this.container.addItem(AssetManager.getSource(Loader.getName(d.data)),true,null,true);
			if(item) item.path=d.data;
		}else if(d.type==-1){
			var asset=MovieManager.getData("play_btn");
			var player=new VideoPlayer();
			var btn=new Button();
			btn.setup(asset[0],asset[1]);
			player.play_btn=btn;
			player.load(AssetManager.getSource(Loader.getName(d.data)));
			item=this.container.addItem(player,true,VideoItem,true);
			if(item) item.path=d.data;
		}else if(d.type==1){
			item=Factory.c("tf",{text:"",size:d.data.size,color:d.data.color});
			
			ObjectUtil.copyAttribute(item,d.data,false,["width","height","lineWidth","binding","text"]);
			item.autoSize=false;
			
			item.width=Number(d.data.width);
			item.height=Number(d.data.height);
			item.lineWidth=Number(d.data.lineWidth)>0 ? Number(d.data.lineWidth) : (d.data.writingMode ? Number(d.data.height) : Number(d.data.width));
			
			item.text=StringUtil.trim(d.data.text);
			item=this.container.addItem(item,true,TextItem,true);
			
			if(!d.hasOwnProperty("binding") && !StringUtil.isEmpty(d.data.binding)){
				d.binding=(d.data.binding=="none" ? "" : d.data.binding);
			}
		}else{
			item=Factory.c("bs",["#FFFFFF",d.data.width,d.data.height,d.data.redius,d.data.thickness]);
			ObjectUtil.copyAttribute(item,d.data,false,["pattern"]);
			if(!StringUtil.isEmpty(d.data.pattern)) {
				item.pattern=AssetManager.getSource(Loader.getName(d.data.pattern));
			}
			item=Main.studio.container.addItem(item,true,null,true);
			if(item) item.path=d.data.pattern;
		}
		
		if(item==null){
			trace("[ERROR]Studio._show_all_items()",i,ObjectUtil.toString(d));
			continue;
		}
		
		ObjectUtil.copyAttribute(item,d,false,["data","x","y","shadow"]);
		
		if(d.shadow){
			try{
				if(typeof d.shadow=="string") d.shadow=JSON.parse(d.shadow);
				s=new DropShadowFilter(d.shadow.distance,d.shadow.angle,d.shadow.shadowBlur,d.shadow.shadowColor,d.shadow.alpha,d.shadow.radius);
			    ((item.instance instanceof BoxShape || item.instance instanceof VideoPlayer) ? item.instance.instance : item.instance).filters.push(s);
			}
			catch(err){
				trace("[ERROR] shadow by",d.shadow);
			};
		}
		
		item.binding=(d.hasOwnProperty("binding") && d.binding) ? d.binding : "";
		item.moveTo(d.x,d.y);
	}
}

Studio.prototype.onCloseHandler=function(e)
{
	if(this.box.contains(this.input)){
		this.input.visible=false;
		this.input.removeFromParent(false);
	}
	
	this.enbale(true);
	this.dispatchEvent(new Event(Studio.CLOSE));
}

Studio.prototype.enbale=function(bool,v,m)
{
	Stage.current.cursor="";
	if(bool && this.black.parent==null) return;
	
	if(bool){
		this.mc.stop();
		this.mc.visible=false;
		this.box.visible=this.close.visible=false;
		this.black.removeFromParent(false);
	}else{
		if(v) this.close.visible=true;
		else  this.close.visible=false;
		
		if(!Global.useCanvas){
			this.box._update_child_visible();
		}
		
		if(m){
			this.mc.play();
			this.mc.visible=true;
			Stage.current.cursor="wait";
			
			if(this.img_btn && this.img_btn.parent) this.img_btn.removeFromParent(false);
			if(this.save_btn && this.save_btn.parent) this.save_btn.removeFromParent(false);
			if(this.submit_btn && this.submit_btn.parent) this.submit_btn.removeFromParent(false);
		}else{
			this.mc.stop();
			this.mc.visible=false;
		}

		this.addChild(this.black);
		this.onResizeHandler();
	}
}

Studio.prototype.preview=function()
{
	Global.local().clear();
	
	this.container.optimization()
	if(this.container.container==null){
		this.warn("内容不能为空.");
		return;
	}
	
	if(this.container.img==null) {
		this.warn("预览前请先选择一个背景图片.");
		return;
	}
	
	var temp=this.container.cacheItemData();
	if(this.container.img) temp.background=this.container.img.src;
	
	var label="studio_data";//+(new Date()).getTime();
	var str=JSON.stringify(temp);
	Global.local().setItem(label,str);
	window.open(Main.preview_path+label);
}

Studio.prototype.save=function()
{
	this.updata=null;
	
	this.container.optimization()
	if( this.container.container==null ){
		this.warn("内容不能为空.");
		return;
	}
	
	var temp=this.container.checkItemPass();
	if(typeof(temp)=="string") {
		this.warn(temp);
		return;
	}
	
	this.updata=temp;
	this.warn("请输入模版名称：",true);
}

Studio.prototype.save_next=function()
{
	this.enbale(false,false,true);
	this.box.visible=false;
	
	if(this.ajax==undefined) this.ajax=new Ajax();
	
	if(this.updata.load.length>0 || (this.container.img && StringUtil.isEmpty(this.container.img_path))) {
		this.index=0;
		this.upload_assets();
	}
	else this.post_data();
}

Studio.prototype.upload_assets=function()
{
	var temp,target,type,bool,obj,_this=this;
	
	if(this.index<this.updata.load.length){
		target=this.updata.data[this.updata.load[this.index]];
		bool=(target.type!=-1);
		
		if(bool){
			temp=(target.type>1) ? target.instance._pattern_src :(Global.useCanvas ? target.instance.instance.image : target.instance.instance).src;
			type=StringUtil.getBase64Type(temp);
			obj={img:temp,type:type};
		}else{
			obj={file:target.instance.file};
		}
		
		this.ajax.post(bool ? Main.upload_asset_path : Main.upload_video_path,obj,function(data){
	    	trace("[COMPLETE]",data);
	    	data=(typeof(data)=="string") ? JSON.parse(data) : data;
	    	if(data.result==1 || data.result=="1" || data.code==1 || data.code=="1"){
	    		target.path=bool ? data.path : "/media/"+data.fpath;
		    	_this.updata.data[_this.updata.load[_this.index]]=target.getData();
		    	_this.index++;
		    	_this.upload_assets();
	    	}
	    	else _this.warn(data.err_msg);
	    },
	    function(data){
	    	trace("[ERROR]",data);
	    });
	}
	else if(this.container.img){
		temp=this.container.img.src;
		type=StringUtil.getBase64Type(temp);
		
		this.ajax.post(Main.upload_asset_path,{img:temp,type:type},function(data){
	    	trace("[COMPLETE]",data);
	    	data=(typeof(data)=="string") ? JSON.parse(data) : data;
	    	if(data.result==1 || data.result=="1"){
	    		_this.updata.background=data.path;
		    	_this.post_data();
	    	}
	    	else _this.warn(data.err_msg);
	    },
	    function(data){
	    	trace("[ERROR]",data);
	    });
	}
	
	else this.post_data();
}

Studio.prototype.post_data=function()
{
	if(this.updata==null) return;
	delete this.updata.load;
	this.updata.render=Global.useCanvas ? 1 : 0;
	
	if(!StringUtil.isEmpty(this.container.img_path)){
		this.updata.background=this.container.img_path;
	}
	
	var _this=this,temp=JSON.stringify(this.updata);
	var _data={thumbnail:(this.img_data ? this.img_data : this.container.catchPicture()),data:temp,name:this.updata.name};
	_data.status=(this.is_submit ? (!Main.power ? 1 : 2) : (!Main.power ? (Main.status>0 ? 1 : 0) : Main.status));
	
	if(Main.mode_id && Main.mode_data){
		_data.id=Main.mode_id;
	}
	
	if(this.is_submit && Main.power && !StringUtil.isEmpty(Main.manager)){
		_data.audit_user=Main.manager;
	}
	
	if(!StringUtil.isEmpty(Main.user)){
		_data.add_user=Main.user;
	}
	
	this.ajax.post(Main.post_data_path,_data,function(data){
		_this.enbale(true);
		_this.img_data=null;
    	trace("[COMPLETE]",data);
    	
    	data=(typeof(data)=="string") ? JSON.parse(data) : data;
    	if(data.result==1 || data.result=="1" ){
    		_this.updata=null;
    		_this.warn("模版添加成功，模版ID"+data.id);
    	}
    	else _this.warn(data.err_msg);
    },
    function(data){
    	this.enbale(true);
    	trace("[ERROR]",data);
    });
}

Studio.prototype.warn=function(str,in_name)
{
	this.mc.stop();
	this.mc.visible=false;
			
	this.close.visible=this.box.visible=true;
	this.box.getChildByName("warn_tf").text=str;
	
	if(in_name==true){
		this.file_lock=false;
		this.box.setSize(350,160);
		this.box.mouseChildren=true;
		
		this.input.moveTo(10,45);
		this.input.visible=true;
		this.input.text=(this.updata && this.updata.hasOwnProperty("name") ? this.updata.name : (Main.mode_data ? Main.mode_data.name : ""));
		this.input.color="#000000";
		this.input.font="Microsoft YaHei";
		this.input.size=24;
		this.input.setSize(330,60);
		this.input.rotation=0;
		this.input.writingMode=false;
		this.input.scaleX=this.input.scaleY=1;
		this.box.addChild(this.input);
		this.input.stage=Stage.current;
		this.input.element.addEventListener(StageEvent.KEY_DOWN,this.__key_handler);
		
		this.box.addChild(this.img_btn);
		this.box.addChild(this.save_btn);
		this.box.addChild(this.submit_btn);
	}else{
		this.box.setSize(300,140);
		this.box.mouseChildren=false;
		
		if(this.img_btn && this.img_btn.parent) this.img_btn.removeFromParent(false);
		if(this.save_btn && this.save_btn.parent) this.save_btn.removeFromParent(false);
		if(this.submit_btn && this.submit_btn.parent) this.submit_btn.removeFromParent(false);
	}
	
	if(this.black.parent==null) this.enbale(false,true);
	else this.onResizeHandler();
}

Studio.prototype.onKeyHandler=function(e)
{
	if(e && e.keyCode== "13") this.onSaveHandler(e);
}

Studio.prototype.onImgHandler=function(e)
{
	if(this.file_lock) return;
	this.file_lock=true;
	var _this=this;
	
	this.file.max_size=6;
	this.file.auto_parse=true;
	this.file.element.accept="image/*";
	this.file.removeEventListener(File.COMPLETE);
	this.file.addEventListener(File.COMPLETE,function(e){
		_this.file_lock=false;
		this.removeEventListener(File.COMPLETE);
		if(e && e.params && e.params.length>0) _this.img_data=e.params[0];
	});		
	this.file.open();
}

Studio.prototype.onSubmitHandler=function(e)
{
	this.onSaveHandler();
}

Studio.prototype.onSaveHandler=function(e)
{
	this.is_submit=(e==undefined || e==null);
	this.input.element.removeEventListener(StageEvent.KEY_DOWN,this.__key_handler);
	var str=StringUtil.trim(this.input.text);
	
	if(this.box.contains(this.input)){
		this.input.visible=false;
		this.input.removeFromParent(false);
	}
	
	if(StringUtil.isEmpty(str)){
		this.warn("模版名称不能为空！");
	}else{
		this.updata.name=str;
		this.save_next();
	}
}

Studio.prototype.onResizeHandler=function(e)
{
	var w=window.innerWidth;
	var h=window.innerHeight;
	var b=(Number(this.datas.config.display_bar_top)==1);
	
	if(this.windows){
		if(this.windows.parent){
			var p=w-Panel.WIDTH-12;
			this.windows.x=(this.windows.x>p) ? p: this.windows.x;
		}
		
		var ch=this.windows.content_height;
		var dh=h-30-Number(Main.studio.datas.config.item_height);
		if(ch) dh=Math.min(ch,dh);
		this.windows.size(Panel.WIDTH+10,dh);
	}

	if(this.container){
		this.container.bg.width=w;
		this.container.bg.height=h;
		this.container.center();
	}
	
	if(this.black && this.black.parent){
		this.black.setSize(w,h);
		
		if(this.box.visible){
			this.box.moveTo((w-this.box.getWidth())*0.5,(h-this.box.getHeight())*0.5);
		}
		
		if(this.mc.visible){
			this.mc.moveTo((w-this.mc.getWidth())*0.5,(h-this.mc.getHeight())*0.5);
		}
		
		if(this.close.visible){
			this.close.moveTo(w-55,6);
			this.close.toTop();
		}
	}
	
	if(this.bg_bar){
		this.bg_bar.width=w;
	    this.bg_bar.y=b ? 0 : h-Number(this.datas.config.item_height);
	}
	
	if(this.panel){
		if(w<this.panel.fwidth) this.panel.scaleX=w/this.panel.fwidth;
		else                    this.panel._recovery_scale(true);
		this.panel.moveTo(MathUtil.format((w-(this.panel.scaleX*this.panel.fwidth))*0.5),b ? 0 : h-Number(this.datas.config.item_height));
		this.panel.missScaleBtn();
	}
	
	this.__checkDisplayUpdate();
}

Studio.prototype.open_color_window=function(target)
{
	if(!this.contains(this.color_window)) this.addChildAt(this.color_window,3);
	this.color_window.moveTo(target.localToGlobal(0,32));
	this.cpanel.target=target;
	this.checkItemEnable(this.color_window,this.cancel_select,this,true);
}

Studio.prototype.cancel_select=function(t)
{
	if(this.color_window==null) return;
	this.color_window.removeFromParent(false);
	if(t==null) this.removeItemEnable(this.color_window);
}

Studio.prototype.mouseDownHandler=function(e)
{
	if(this.list==null || this.list.length<1) return;
	
	for(var obj,i=0,l=this.list.length;i<l;i++) {
		obj=this.list[i];
		if(obj && !DisplayUtil.equalOrContain(e.target,obj.t) && (obj.b || (!DisplayUtil.equalOrContain(e.target,this.windows) && !DisplayUtil.equalOrContain(e.target,this.color_window)))){
			obj.c.apply(obj.s,[obj.t]);
			this.list.splice(i,1);
			i--;
			l--;
		}
	}
}

Studio.prototype.checkItemEnable=function(target,callback,self,noItem)
{
	if(this.list==null) return;
	if(this.list.length>3) this.list.shift();
	this.list.push({t:target,c:callback,s:self,b:noItem});
}

Studio.prototype.removeItemEnable=function(target)
{
	if(target==null || this.list==null || this.list.length<1) return;
	for(var obj,i=0,l=this.list.length;i<l;i++) {
		obj=this.list[i];
		if(obj==null || obj.t==target){
			this.list.splice(i,1);
			i--;
			l--;
		}
	}
}
