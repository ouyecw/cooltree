import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import TweenLite from '../transitions/TweenLite.js'
import StageEvent from '../events/StageEvent.js'
import LayoutUtil from '../utils/LayoutUtil.js'
import Rectangle from '../geom/Rectangle.js'
import UIContainer from './UIContainer.js'
import Sprite from '../display/Sprite.js'
import Factory from '../core/Factory.js'
import SlideBar from './SlideBar.js'
import Button from './Button.js'
import Global from '../core/Global.js'
import Event from '../events/Event.js'

/**
 * @class
 * @module ComboList
 * @extends DisplayObjectContainer
 */
export default class ComboList extends DisplayObjectContainer
{	
	constructor()
	{
		super();
		this._value=this._current=this._btn=this._datas=this._tf=this._sprite=this._bar=this._container=this._control=this._list=null;
		this._btn_height=this._timeID=this._list_width=this._list_height=0;
		this._downspread=this._init=this._enable=this._block=false;
		
		this.item_bg_color="#FFFFFF";
		this.item_over_color="#E6F4AC";
		this.item_frame_color="#CCCCCC";
		
		this.text_font="Microsoft YaHei";
		this.text_over_color="#666666";
		this.text_normal_color="#CCCCCC";
		
		this.delay_time=1000;
		this.item_rect=null;
		this.item_height=23;
		this.font_size=16;
		this.bar_width=4;
		this.spread=0;
		this.space=1;
	}
	
	get enable()
	{
		return this._enable;
	}
	
	set enable(value) 
	{
    	if(!this._init) return;
    	this._enable=value;
    	this._btn.enable=value;
    	if(!value) this._closeList();
    }
	
	get value()
	{
		return this._value;
	}
	
	get current()
	{
		return this._current;
	}
	
	set current(value) 
	{
    	if(!this._init || value==undefined || this._datas==undefined || value<0 || value>=this._datas.length) return;
    	let bool=(this._current!=value);
    	
    	let old_item=this._datas[this._current];
    	if(old_item) old_item.enable=true;
    	let new_item=this._datas[value];
    	
    	if(new_item) {
    		new_item.enable=false;
    		this._value=new_item.datas;
    		this._tf.text=new_item.getLabel();
    	}
    	
    	this._current=value;
    	if(bool) this.dispatchEvent(new Event(ComboList.SELECT,this._value)); 
    }
	
	select(d)
	{
		if(d==null || !this._init || this._datas==null || this._datas.length<1) return false;
		for(let btn,i=0,l=this._datas.length;i<l;i++){
			btn=this._datas[i];
			if(btn && btn.datas==d) {
				this.current=(btn.index-1);
				return true;
			}
		}
		return false;
	}
	
	initialize()
	{
		if(this._init) return;
		this._init=true;
		
		this._datas=[];
		this._list=Factory.c("dc");
		this._container=Factory.c("dc");
		this._container.setSize(this._list_width-this.bar_width*2,this._list_height);
		
		this._control=new UIContainer();
		this._control.setDimension(this._list_width-this.bar_width*2,this._list_height,UIOrientation.isY,true,false);
		this._control.instance=this._container;
		this._list.addChild(this._control);
		
		let bar_mc=Factory.c("bs");
	    let bottom=Factory.c("bs");
	
	    bar_mc.setup("#999999",this.bar_width*2,this._list_height,this.bar_width);
	    bottom.setup("#E0E0E0",this.bar_width*2,this.bar_width);
	  
		this._bar=new SlideBar();
		this._bar.setup(this._container,this._control.mask,bar_mc,bottom,true,true,{x:this._control.x,y:this._control.y});
		this._list.addChild(this._bar);
		
		this._sprite=new Sprite();
		this._sprite.addChild(this._list);
		this._sprite.mask=new Rectangle(0,0,this._list_width,this._list_height);
		this.addChild(this._sprite);
		
		this._tf=Factory.c("tf",{text:"",size:this.font_size,color:"#666666",font:this.text_font});
		this._tf.width=this._tf.lineWidth=this._list_width-this._btn.getWidth();
		this._tf.height=this._btn_height;
		
		let shape=Factory.c("bs",["#FFFFFF",this._tf.width,this._tf.height]);
		shape.alpha=0;
		this._btn.addChild(shape);
		shape.moveTo(-this._tf.width,(this._tf.height-(this.font_size+4))*0.5);
		
		this.addChild(this._btn);
		this.moveTo(this._btn.x,this._btn.y);
		this._btn.moveTo(this._tf.width,0);
		this._sprite.moveTo(0,this._tf.height);
		this._btn._updateSize();
		
		this._tf.moveTo(0,(this._tf.height-(this.font_size+4))*0.5);
		this.addChild(this._tf);
		
		this._list.mouseEnabled=true;
		this._list.addEventListener(StageEvent.MOUSE_OVER,Global.delegate(this._stopCountTime,this),this.name);
		this._list.addEventListener(StageEvent.MOUSE_OUT,Global.delegate(this._startCountTime,this),this.name);
		
		this._btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this._onClickHandler,this),this.name);
	    this._btn.addEventListener(StageEvent.MOUSE_OVER,Global.delegate(this._stopCountTime,this),this.name);
		this._btn.addEventListener(StageEvent.MOUSE_OUT,Global.delegate(this._startCountTime,this),this.name);
	    this._sprite.visible=false;
	}
	
	_onClickHandler(e)
	{
		if(!this._sprite.visible) this._openList(); 
		else this._closeList();
	}
	
	setup(datas,w,h,btn,current)
	{
		this._btn=btn;
		this._list_width=w;
		this._list_height=h;
		this._btn_height=btn.getHeight();
		this._current=(current==undefined) ? 0: current;
		
		if(!this._init) this.initialize();
		if(datas==undefined || datas.length==undefined || datas.length<1) return;
		
		for(let i=0,l=datas.length;i<l;i++){
			this.addItem(datas[i],false);
		}
		
		this._refresh();
		this.current=this._current;
	}
	
	addItem(data,noRefresh)
	{
		if(data==undefined) return;
		if(this.item_rect==null) this.item_rect=new Rectangle(0,0,this._list_width-this.bar_width*2,this.item_height);
		
		let v=(data.hasOwnProperty("value") || data.value) ? data.value : data;
		let l=(data.hasOwnProperty("label") || data.label) ? data.label : v;
		
		let btn=new Button();
	    let shape=Factory.c("bs");
	    
	    shape.setup(this.item_bg_color,this._list_width-this.bar_width*2,this.item_height,0,1,this.item_frame_color);
	    
	    btn.instance=shape;
	    btn.setup([Factory.c("ef",[Effect.COLOR,this.item_bg_color,0.15])],[Factory.c("ef",[Effect.COLOR,this.item_over_color,0.15])]);
	    
	    btn.setLabel({text:l,font:this.text_font,color:this.text_normal_color,size:this.font_size},this.text_over_color);
	    btn.datas=v;
	    
		this._container.addChild(btn);
		btn.index=this._datas.push(btn);
	
		btn.setSize(shape.width,shape.height);
		btn.addEventListener(StageEvent.MOUSE_TAP,Global.delegate(this._onTapHandler,this),this.name);
		
		if(noRefresh==undefined) this._refresh();
	}
	
	_refresh()
	{
		if(this._datas==undefined || this._datas.length<1) return;
		
		LayoutUtil.tile(this._datas,1,false,this.item_rect);
		this._container._updateSize();
		this._control._recovery_scale();
		this._bar.barSync();
	}
	
	_onTapHandler(e)
	{
		let btn=e.target;
		if(btn==undefined) return;
		this.current=(btn.index-1);
		this._closeList();
	}
	
	_startCountTime(e)
	{  
		if(!this._sprite.visible) return;
		if(this._timeID>0) clearTimeout(  this._timeID );
		this._timeID=setTimeout(Global.delegate(this._closeList,this),this.delay_time) 
	}
	
	_stopCountTime(e)
	{  
		clearTimeout(  this._timeID );
	}
			
	_openList() 
	{
		if(this._block) return;
	
	    this._block=true;
		let pos=this.localToGlobal(0,0);
		this._downspread=(this.stage && this.stage.stageHeight) ? (pos.y+this._list_height<this.stage.stageHeight) : (pos.y-this._list_height<0);
		this._downspread=(this.spread==1) ? true : (this.spread==0 ? this._downspread : false);
		
		let h=Math.min(this._list_height,this._container.height);
		let d=Math.max(0,this._list_height-this._container.height);
		
		this._sprite.visible=true;
		this._sprite.moveTo(0,this._downspread ? this._btn_height+this.space : -this.space-h-d);
		this._list.y=this._downspread ? -this._list.height : h;
		
		TweenLite.remove(this._list);
		TweenLite.to(this._list,0.5,{y:this._downspread ? 0 :d,onComplete:Global.delegate(this._outCompleteHandle,this)});
	}
	
	_closeList()
	{
		if(this._block) return;
	
	    this._block=true;
		this._stopCountTime();
		TweenLite.remove(this._list);
		TweenLite.to(this._list,0.4,{y:this._downspread ? -this._list_height : this._list_height,onComplete:Global.delegate(this._inCompleteHandle,this)}); 
	}
	
	_inCompleteHandle()
	{
		this._block=false;
		this._sprite.visible=false;
		this.dispatchEvent(new Event(ComboList.SPREAD,false));
	}
	
	_outCompleteHandle()
	{
		this._block=false;
		this.dispatchEvent(new Event(ComboList.SPREAD,true));
	}
	
	dispose()
	{
		this._closeList();
		this._stopCountTime();
		
		if(this._btn){
			this._btn.removeEventListener(StageEvent.MOUSE_CLICK,null,this.name);
	   		this._btn.removeEventListener(StageEvent.MOUSE_OVER,null,this.name);
		    this._btn.removeEventListener(StageEvent.MOUSE_OUT,null,this.name);
		}
		
		super.dispose();
		
		delete this._block,this._value,this._current,this._btn,this._datas,this._tf,this._sprite,this._bar,this._container,this._control,this._list;
		delete this.text_font,this.item_bg_color,this.item_over_color,this.item_frame_color,this.text_over_color,this.text_normal_color;
		delete this._btn_height,this._timeID,this._list_width,this._list_height,this._downspread,this._init,this._enable;
		delete this.spread,this.delay_time,this.item_rect,this.item_height,this.font_size,this.bar_width;
	}
}

ComboList.SELECT="combo_list_select";
ComboList.SPREAD="combo_list_spread";
ComboList.className="ComboList";