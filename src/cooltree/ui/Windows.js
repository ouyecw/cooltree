import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import StageEvent from '../events/StageEvent.js'
import UIContainer from './UIContainer.js'
import Factory from '../core/Factory.js'
import Stage from '../display/Stage.js'
import Global from '../core/Global.js'
import SlideBar from './SlideBar.js'
import Event from '../events/Event.js'

/**
 * @class
 * @module Windows
 * @extends DisplayObjectContainer
 */
export default class Windows extends DisplayObjectContainer
{
	constructor()
	{
		super();
		this.slide_bar=this.area_rect=this._bg=this._close_btn=this.win_title=this._win_bar=this.container=this.control=null;
		this._is_init=false;
		this.bar_width=4;
	}
	
	setup(w,h,bar_height,bar_color,bar_title,close_btn,bg_color)
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
		
		if(this._close_btn){
			this._close_btn.removeFromParent(true);
		}
		
		this._close_btn=close_btn;
		this.addChild(this._close_btn);
		this._win_title.y=Math.floor(Math.max(0,(bar_height-this._win_title.size)*0.4));
		this._close_btn.moveTo(w-close_btn.getWidth()-2,(bar_height-close_btn.getHeight())*0.5);
		this._close_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this._close_handler,this));
	}
	
	_init()
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
		
		let bar_mc=Factory.c("bs");
	    let bottom=Factory.c("bs");
	
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
	
	add(target,height)
	{
		if(target==null) return;
		let w=this.container.width;
		let h=this.container.height;
		this.container.addChild(target);
		
		this.container._updateSize();
		if(w==this.container.width && h==this.container.height && height==null) return;
		if(height) this.container.height=height;
		this.control._recovery_scale();
	}
	
	remove(target)
	{
		let w=this.container.width;
		let h=this.container.height;
		let bool=false;
		
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
	
	_mouse_down_handler(e)
	{
		(this.stage ? this.stage : Stage.current).startDrag(this,this.area_rect);
		(this.stage ? this.stage : Stage.current).addEventListener(StageEvent.MOUSE_UP,Global.delegate(this._mouse_up_handler,this),this.name);
	}
	
	_mouse_up_handler(e)
	{
		(this.stage ? this.stage : Stage.current).removeEventListener(StageEvent.MOUSE_UP,null,this.name);
		(this.stage ? this.stage : Stage.current).stopDrag();
	}
	
	_close_handler(e)
	{
		this.removeFromParent(false);
		this.dispatchEvent(new Event(Windows.CLOSE));
	}
}

Windows.CLOSE="windows_close";
Windows.className="Windows";