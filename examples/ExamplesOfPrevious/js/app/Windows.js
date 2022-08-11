
function Windows()
{
	DisplayObjectContainer.call(this);
	this.content_height=this.slide_bar=this.area_rect=this._bg=this._close_btn=this.win_title=this._win_bar=this.container=this.control=null;
	this._is_init=false;
	this.bar_width=4;
}

Global.inherit(Windows,DisplayObjectContainer);

Windows.CLOSE="windows_close";

Windows.prototype.setup=function(w,h,bar_height,bar_color,bar_title,close_btn,bg_color,title_color)
{
	if(!this._is_init) this._init();
	this.control.setDimension(w-this.bar_width*2,h,UIOrientation.isY,true,true);
	this.control.y=this._bg.y=bar_height;
	this._win_bar.setSize(w,bar_height);
	this._win_title.text=bar_title;
	this._win_bar.color=bar_color;
	this._bg.setSize(w,h);
	
	if(bg_color){
		this._bg.color=bg_color;
		
		if(!this.contains(this._bg)) 
			this.addChildAt(this._bg,0);
			
		if(!this._bg.hasEventListener(StageEvent.MOUSE_DOWN))
			this._bg.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._mouse_down_handler,this));
	}else{
		if(this.contains(this._bg)) 
			this.removeChild(this._bg);
		this._bg.removeEventListener(StageEvent.MOUSE_DOWN);
	}
	
	if(title_color){
		this._win_title.color=title_color;
	}
	
	if(this._close_btn){
		this._close_btn.removeFromParent(true);
	}
	
	this._close_btn=close_btn;
	this.addChild(this._close_btn);
	this._win_title.y=Math.floor(Math.max(0,(bar_height-this._win_title.size)*0.4));
	this._close_btn.moveTo(w-close_btn.getWidth()-2,(bar_height-close_btn.getHeight())*0.5);
	this._close_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this._close_handler,this));
}

Windows.prototype.size=function(w,h)
{
	if(!this._is_init || w==null || h==null) return;
	this.control.setDimension(w-this.bar_width*2,h,UIOrientation.isY,true,true);
	this.control._recovery_scale();
	
	this._close_btn.x=w-this._close_btn.getWidth()-2;
	this._bg.setSize(w,h);
}

Windows.prototype._init=function()
{
	if(this._is_init) return;
	this._is_init=true;
	
	this._bg=Factory.c("bs",["#FFFFFF",100,300]);
	this._bg.mouseEnabled=true;
	this.addChild(this._bg);
	
	this.control=new UIContainer();
	this.control.setDimension(100,300-this.bar_width*2,UIOrientation.isXY,true,true);
	this.addChild(this.control);
	
	this.container=Factory.c("dc");
	this.control.instance=this.container;
	
	this._win_bar=Factory.c("bs",["#666666",100,50]);
	this.addChild(this._win_bar);
	
	var bar_mc=Factory.c("bs");
    var bottom=Factory.c("bs");

    bar_mc.setup("#999999",this.bar_width*2,300,this.bar_width);
    bottom.setup("#E0E0E0",this.bar_width*2,this.bar_width);
    
	this.slide_bar=new SlideBar();
	this.slide_bar.setup(this.container,this.control.mask,bar_mc,bottom,true,true,{x:this.control.x,y:this.control.y});
	this.addChild(this.slide_bar);
	
    this.control.y=this._bg.y=100;
    this._win_bar._cursor="move";
    this._win_bar.mouseEnabled=true;
    this._win_bar.mouseChildren=false;
    
    this._win_title=Factory.c("tf",{text:"title",size:16,font:"Microsoft YaHei",color:"#FFFFFF"});
    this.addChild(this._win_title);
    this._win_title.moveTo(7,4);
    
    this._win_title.selectable=false;
    this._win_title.mouseEnabled=false;
    
    this._win_bar.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._mouse_down_handler,this));
}

Windows.prototype.add=function(target,height)
{
	if(target==null) return;
	var w=this.container.width;
	var h=this.container.height;
	this.container.addChild(target);
	
	this.container._updateSize();
	this.content_height=this.container.height;
	if(w==this.container.width && h==this.container.height && height==null) return;
	if(height) this.content_height=this.container.height=height;
	this.control._recovery_scale();
}

Windows.prototype.remove=function(target)
{
	var w=this.container.width;
	var h=this.container.height;
	var bool=false;
	
	if(target){
		bool=this.container.contains(target);
		if(bool) this.container.removeChild(target);
	}else{
		bool=(this.container.numChildren>0);
		this.container.removeAllChildren(false);
	}
	
	this.container._updateSize();
	if(w==this.container.width && h==this.container.height) return bool;
	this.control._recovery_scale();
	return bool;
}

Windows.prototype._mouse_down_handler=function(e)
{
	Stage.current.startDrag(this,this.area_rect);
	Stage.current.addEventListener(StageEvent.MOUSE_UP,Global.delegate(this._mouse_up_handler,this),this.name);
}

Windows.prototype._mouse_up_handler=function(e)
{
	Stage.current.removeEventListener(StageEvent.MOUSE_UP,null,this.name);
	Stage.current.stopDrag();
}

Windows.prototype._close_handler=function(e)
{
//	this.removeFromParent(false);
	this.dispatchEvent(new Event(Windows.CLOSE));
}