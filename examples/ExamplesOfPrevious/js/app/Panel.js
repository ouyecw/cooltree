
function Panel()
{
	this.lock_obj=this.scale_container=this.big_btn=this.small_btn=this.clear_all=this.fwidth=this.assets=this.container=this.preview_btn=this.last_step=this.bg_btn=this.rect_btn=this.circle_btn=this.image_btn=this.font_btn=this.active_btn=this.conform_btn=this.magnifier_btn=null
	UIContainer.call(this);
	this.isLock=false;
}

Global.inherit(Panel,UIContainer);

Panel.prototype.init=function()
{
	this.lock_obj={};
	this.container=Factory.c("dc");
	this.assets=MovieManager.getData("icon");

    var pos={s:0,p:Number(Main.studio.datas.config.item_space)};
	this.last_step=this.container.addChild(this.createButton(1,8,pos));
	this.rect_btn=this.container.addChild(this.createButton(2,9,pos));
	this.circle_btn=this.container.addChild(this.createButton(3,10,pos));
	this.font_btn=this.container.addChild(this.createButton(21,22,pos));
	this.image_btn=this.container.addChild(this.createButton(5,12,pos));
	this.active_btn=this.container.addChild(this.createButton(6,13,pos));
	this.bg_btn=this.container.addChild(this.createButton(23,24,pos));
	this.magnifier_btn=this.container.addChild(this.createButton(15,18,pos));
	this.clear_all=this.container.addChild(this.createButton(27,28,pos));
	this.preview_btn=this.container.addChild(this.createButton(25,26,pos));
	this.conform_btn=this.container.addChild(this.createButton(7,14,pos));
	
	this.small_btn=this.createButton(17,20,null,true);
	this.big_btn=this.createButton(16,19,null,true);
	this.scale_container=Factory.c("dc");
	
	this.scale_container.addChild(this.big_btn);
	this.scale_container.addChild(this.small_btn);
	
	this.small_btn.moveTo(0,-this.small_btn.getHeight());
	this.big_btn.moveTo(0,-this.small_btn.y-this.big_btn.getHeight());
	
	this.fwidth=this.container.width=pos.s;
	this.setDimension(pos.s,Number(Main.studio.datas.config.item_height),UIOrientation.isX,true,false);
	this.instance=this.container;
	return this;
}

Panel.prototype.createButton=function(normal,over,pos,bool)
{
	var btn=new Button();
    var shape=Factory.c("bs");
    
    var w=Number(Main.studio.datas.config.item_width),h=Number(Main.studio.datas.config.item_height);
    shape.setup(Main.studio.datas.config.item_color,w,h,0,1,Main.studio.datas.config.item_frame_color);
//  shape.origin={x:w*0.5,y:h*0.5};
    
    btn.instance=shape;
    btn.setup([Factory.c("ef",[Effect.COLOR,Main.studio.datas.config.item_color,0.15])],[Factory.c("ef",[Effect.COLOR,Main.studio.datas.config.item_over_color,0.15])]);
    
    var normal_obj=Factory.c("mc");
    var asset=[this.assets[normal-1],this.assets[over-1]];
   
    normal_obj.scale=Number(Main.studio.datas.config.item_scale);
    normal_obj.setFrames(asset);
    
    normal_obj.stop();
    normal_obj.name="icon";
    normal_obj.moveTo((w-normal_obj.getWidth())*0.5,(h-normal_obj.getHeight())*0.5);
    
    if(pos!=undefined) {
    	btn.x=pos.s;
    	pos.s+=w+pos.p;
    }
    
    btn.addChild(normal_obj);
    btn.addEventListener(StageEvent.MOUSE_OUT,Global.delegate(this.onMouse,this));
    btn.addEventListener(StageEvent.MOUSE_OVER,Global.delegate(this.onMouse,this));
    if(pos!=undefined || bool) btn.addEventListener(StageEvent.MOUSE_TAP,Global.delegate(this.onTapHandler,this));
    return btn;
}

Panel.prototype.onMouse=function(e)
{
	if(e.target==undefined ) return;
	var icon=e.target.getChildByName("icon");
	if(icon==undefined) return;
	icon.gotoAndStop(e.type==StageEvent.MOUSE_OVER ? 2 : 1);
}

Panel.prototype.missScaleBtn=function()
{
	if(this.scale_container.parent){
		this.scale_container.removeFromParent(false);
	}
	
	this.__checkDisplayUpdate();
}

Panel.prototype.addVideo=function(e)
{
	this.isLock=false;
	e.target.removeEventListener(VideoPlayer.READY);
	var item=Main.studio.container.addItem(e.target,true,VideoItem);
	if(name) Main.studio.commands.push(Command.create(Command.CREATE,item.name));
}

Panel.prototype.check_double_click=function(id)
{
	if(this.lock_obj.id!=id){
		this.lock_obj.id=id;
		this.lock_obj.time=(new Date()).getTime();
		return false;
	}
	
	var now=(new Date()).getTime();
	if((now-this.lock_obj.time)<8000){
		return true;
	}
	
	this.lock_obj.time=now;
	return false;
}

Panel.prototype.onTapHandler=function(e)
{
	if(this.isLock) return;
	var _this=this;
	
	switch(e.target)
	{
		case this.last_step:
			Command.run(Main.studio.commands.getPrec());
		    break;
		    
		case this.rect_btn:
		    DrawControl.begin(1);
		    break;
		    
    	case this.circle_btn:
			DrawControl.begin(2);
		    break;
		      
	    case this.font_btn:
	        var tf=Factory.c("tf",{text:"双击输入文字",font:"Microsoft YaHei",size:Number(Main.studio.datas.config.default_font_size),color:"#000000",isInput:false});
			tf.width=Math.ceil(Number(Main.studio.datas.config.default_font_size)*6);
			var name=Main.studio.container.addItem(tf,true,TextItem).name;
			if(name) Main.studio.commands.push(Command.create(Command.CREATE,name));
//			if(!Global.useCanvas && tf) tf.hide_over=false;
			if(tf) tf.autoSize=false;
		    break;
		    
	    case this.image_btn:
	        if(this.check_double_click("img")) return;
	        
	        Main.studio.file.max_size=6;
	    	Main.studio.file.auto_parse=true;
	        Main.studio.file.element.accept="image/*";
			Main.studio.file.removeEventListener(File.COMPLETE);
			Main.studio.file.addEventListener(File.COMPLETE,function(e){
				this.removeEventListener(File.COMPLETE);
				_this.lock_obj.time=0;
				
				var file=new Image();
				file.onload=function(){
					this.onload=this.onerror=null;
					var name=Main.studio.container.addItem(this,true).name;
			    	if(name) Main.studio.commands.push(Command.create(Command.CREATE,name));
				};
				
		    	file.onerror=function(){
		    		Main.studio.warn("图片解析失败.");
		    	}
		    	
				file.src=e.params[0];
			});
			
			Main.studio.file.open();
		    break;
		    
	    case this.active_btn:
	        if(this.check_double_click("video")) return;
	        
	        Main.studio.file.max_size=60;
	    	Main.studio.file.auto_parse=false;
			Main.studio.file.element.accept="video/*";
			Main.studio.file.removeEventListener(File.COMPLETE);
			Main.studio.file.addEventListener(File.COMPLETE,function(e){
				this.removeEventListener(File.COMPLETE);
				_this.lock_obj.time=0;
				var file=e.params[0];
				if(file==null) return;
				
				var asset=MovieManager.getData("play_btn");
				var player=new VideoPlayer();
				var btn=new Button();
				btn.setup(asset[0],asset[1]);
				player.play_btn=btn;
				
				player.file=file;
				player.addEventListener(VideoPlayer.READY,Global.delegate(_this.addVideo,_this));
				player.src=URL.createObjectURL(file);
				_this.isLock=true;
			});
			
			Main.studio.file.open();
		    break;
		    
	    case this.bg_btn:
	        if(this.check_double_click("bg")) return;
	        
	        Main.studio.file.max_size=10;
	    	Main.studio.file.auto_parse=true;
	        Main.studio.file.element.accept="image/*";
	        Main.studio.file.removeEventListener(File.COMPLETE);
			Main.studio.file.addEventListener(File.COMPLETE,function(e){
				this.removeEventListener(File.COMPLETE);
				_this.lock_obj.time=0;
				var file=new Image();
				
				file.onload=function(){
					this.onload=this.onerror=null;
					Main.studio.commands.push(Command.create(Command.CHANGE,"bg",Main.studio.container.img,file));
			    	Main.studio.container.setBG(file);
				};
				
		    	file.onerror=function(){
		    		Main.studio.warn("背景图片解析失败.");
		    	}
		    	
				file.src=e.params[0];
			});
			
			Main.studio.file.open();
		    break;
		    
	    case this.magnifier_btn:
			if(this.scale_container.parent==null){
				Main.studio.addChild(this.scale_container);
				var b=(Number(Main.studio.datas.config.display_bar_top)==1);
				var pos=this.container.localToGlobal(this.magnifier_btn.x,this.magnifier_btn.y+(b ? 2 : -1)*this.small_btn.getHeight());
				this.scale_container.moveTo(pos);
			    Main.studio.checkItemEnable(this.scale_container,this.missScaleBtn,this,true);
			}
		    break;
		    
		case this.small_btn:
			Main.studio.container.scaleShow(-0.2);
			break;
		    
		case this.big_btn:
			Main.studio.container.scaleShow(0.2);
			break;
		    
		case this.clear_all:
		    if(Main.studio.container.container.numChildren<1 && Main.studio.container.img==null) return;
		   
		    for(var child,i=0,l=Main.studio.container.container.numChildren;i<l;i++){
		    	child=Main.studio.container.container._children[i];
		    	Main.studio.commands.push(Command.create(Command.DELETE,child,i,null,null,null,true));
		    }
		    
		    Main.studio.commands.push(Command.create(Command.CHANGE,"bg",Main.studio.container.img,null,null,null,true));
		    Main.studio.container.setBG(null);
		    
		    Main.studio.container.container.removeAllChildren(false);
			Main.studio.container.unableTransformer();
		    break;
		    
	    case this.preview_btn:
//	        if(this._cache_image==null){
//	        	this._cache_image=Factory.c("do");
//	        	this._cache_image.y=80;
//	        	this.stage.addChild(this._cache_image);
//	        }
//	        
//	        var _this=this,img=new Image();
//	        img.src=Main.studio.container.catchPicture();
//	        
//	        img.onload=function(){
//				this.onload=null;
//				_this._cache_image.setInstance(img);
//		    }

			Main.studio.preview();
		    break;
		    
	    case this.conform_btn:
	        if(this.check_double_click("save")) return;
			Main.studio.save();
		    break;
	}
}

Panel.WIDTH=240;
