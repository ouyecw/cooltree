import Sprite from '../display/Sprite.js'
import Rectangle from '../geom/Rectangle.js'
import StringUtil from '../utils/StringUtil.js'
import MathUtil from '../utils/MathUtil.js'
import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import TweenLite from '../transitions/TweenLite.js'
import StageEvent from '../events/StageEvent.js'
import LayoutUtil from '../utils/LayoutUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import Factory from '../core/Factory.js'
import Global from '../core/Global.js'
import Point from '../geom/Point.js'
import Event from '../events/Event.js'

/**
 * @class
 * @module ScrollTouchList
 * @extends Sprite
 */
export default class ScrollTouchList extends Sprite
{
	constructor()
	{
		super();
	
	    /**
	     * 每项之间的空隙
	     */
	    this.space=0;
	    
	    /**
	     * 助动的摩擦系数
	     */
	    this.offset=1;
	    this.mouseEnabled=true;
	    
		this._portrait=true;
		this._is_init=this._is_next=this._has_drag=this._is_full=false;
		this._bg_color=this._base_size=this._temp_item=this._bg=this._temp_point=this._time=this._start_point=this._complete=this._length=this._hold_rect=this._free_rect=this._current=this._middle=this._list=this._container=this._max_num=this._max_num=this._item_class=this._list_width=this._list_height=this._item_size=this._datas=null;
	}
	
	get data()
	{
		return this._datas;
	}
	
	/**
	 * 列表数据
	 * @param {Array} value 列表数据
	 */
	set data(value) 
	{
        if(this._datas==value && this._container) return;
		this._datas=value;
		
		if(this._list_height==null || value==null) return;
		if(this._container) this.clear();
		this.init();
    }
	
	get listWidth()
	{
		return this._list_width;
	}
	
	/**
	 * 重新设置列表宽度
	 * @param {Number} value 列表宽度
	 */
	set listWidth(value) 
	{
        if(value==null || this._list_width==value) return;
		this._list_width=value;
		
		if(this._list==null || this._list.length<1) return;
		
		if(this._portrait){
			if(this._bg) this._bg.width=this._list_width;
			for(let i in this._list) this._list[i].itemWidth=this._list_width;
			this.mask=new Rectangle(0,0,this._list_width,this._list_height);
			return;
		}
		
		let curr=this._current;
		this.clear();
		this.init(curr);
    }
	
	get listHeight()
	{
		return this._list_height;
	}
	
	/**
	 * 重新设置列表高度
	 * @param {Object} value  列表高度
	 */
	set listHeight(value) 
	{
        if(value==null || this._list_height==value) return;
		this._list_height=value;
		
		if(this._list==null || this._list.length<1) return;
		
		if(!this._portrait){
			if(this._bg) this._bg.height=this._list_height;
			for(let i in this._list) this._list[i].itemHeight=this._list_height;
			this.mask=new Rectangle(0,0,this._list_width,this._list_height);
			return;
		}
		
		let curr=this._current;
		this.clear();
		this.init(curr);
    }
	
	get current()
	{
		return this._current;
	}
	
	set current(value) 
	{
        if(this._current==value) return;
        
        if(this._current!=null && this._temp_item){
        	this._temp_item.selected=false;
        }
        
		this._current=value;
    }
	
	/**
	 * 设置列表参数
	 * @param {Number} width  宽度
	 * @param {Number} height 高度
	 * @param {Number} item_size 子项尺寸
	 * @param {Class} item_class 子项类
	 * @param {Boolean} portrait 是否是竖排 true竖排列表 false横排列表
	 * @param {String} color     是否需要底色 有的话传入颜色值 
	 * @param {Number} index     是否跳转至对应项
	 */
	setup(width,height,item_size,item_class,portrait=true,color=null,index=0)
	{
		if(item_class==null) return;
		this._item_class=item_class;
		this._portrait=!(portrait==false);
		this._base_size=this._portrait ? height : width;
		this._item_size=item_size;
		this._list_height=height;
		this._list_width=width;
		this._bg_color=color;
		
		if(this._datas==null) return;
		if(this._container) this.clear();
		this.init(index);
	}
	
	/**
	 * 清除列表
	 */
	clear()
	{
		if(this._datas==null || this._list==null) return;
		
		let i,l=this._list.length,item;
		TweenLite.remove(this._container);
		
		for(i=0;i<l;i++){
			item=this._list[i];
			item.removeEventListener(StageEvent.MOUSE_TAP);
			item.removeFromParent(false);
			ObjectPool.remove(item);
		}
		
		this.mask=null;
		this.removeAllChildren(true);
		this._current=this._temp_item=this._hold_rect=this._free_rect=this._container=this._list=null;
	}
	
	init(index)
	{
		index=(index==null) ? 0 : index;
		
		if(!StringUtil.isEmpty(this._bg_color)){
			if(this._bg && this.contains(this._bg)) this._bg.removeFromParent(true);
			
			this._bg=Factory.c("bs",[this._bg_color,this._list_width,this._list_height]);
			this._bg.mouseEnabled=true;
		    this.addChildAt(this._bg,0);
		}
		
	    this._middle=Math.ceil((this._portrait ? this._list_height : this._list_width)*0.5)-Math.floor(this._item_size*0.5);
	    this._max_num=Math.ceil((this._portrait ? this._list_height : this._list_width)/(this._item_size+this.space))+2;
	    this._length=(this._item_size+this.space)*this._datas.length-this.space;
	    this._is_full=(this._datas.length>this._max_num);
	    this._container=new DisplayObjectContainer();
	    this.addChild(this._container);
	    this._list=[];
	    
	//  let line=Factory.c("bs",["#000000",this._list_width+20,2]);
	//  line.moveTo(-10, this._middle+Math.floor(this._item_size*0.5)-1);
	//  this.addChild(line);
	
	    this._container.mouseEnabled=true;
	    this._container.moveTo(this._portrait ? 0 : this._middle,this._portrait ? this._middle : 0);
	    this.mask=new Rectangle(0,0,this._list_width,this._list_height);
	    
	    this._free_rect=new Rectangle(0,0,this._portrait ? 0 : this._length,this._portrait ? this._length : 0);
	    this._hold_rect=new Rectangle(0,0,this._portrait ? 0 : this._free_rect.width+this._list_width,this._portrait ? this._free_rect.height+this._list_height : 0);
	    
	    this._create_list();
	    
	    if(this._list.length>0) {
	    	this._temp_item=this._list[0];
	    	this._list[0].selected=true;
	    	this.current=0;
	    	
	    	if(index>0) this.goto(index,true);
	    	else {
	    		this._update_items_state();
	    		this.dispatchEvent(new Event(ScrollTouchList.SELECT,this._datas[0]));
	    	}
	    }
	    
	    if(this._is_init) return;
	    this._is_init=true;
	    
	    this._complete=Global.delegate(this.onTweenComplete,this);
	    this.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this.onMouseDown,this));
	    this.addEventListener(StageEvent.MOUSE_WHEEL,Global.delegate(this.onMouseWheel,this));
	}
	
	onMouseDown(e)
	{
		this._has_drag=false;
		TweenLite.remove(this._container);
		this._start_point=new Point(e.mouseX,e.mouseY);
		this.stage.addEventListener(StageEvent.MOUSE_MOVE,Global.delegate(this.onMouseMove,this),this.name);
		this.stage.addEventListener(StageEvent.MOUSE_UP,Global.delegate(this.onMouseUp,this),this.name);
	}
	
	onMouseMove(e)
	{
		let point=new Point(e.mouseX,e.mouseY);
	
		if(!this._has_drag && Point.distance(this._start_point,point)>5){
			let pos=this.localToGlobal(this._portrait ? 0 : this._middle,this._portrait ? this._middle : 0);
	
			this._free_rect.x=this._portrait ? pos.x : pos.x-this._length;
			this._free_rect.y=this._portrait ? pos.y-this._length : pos.y;
			
			this._hold_rect.x=this._portrait ? this._free_rect.x : Math.ceil(this._free_rect.x-this._list_width*0.5);
			this._hold_rect.y=this._portrait ? Math.ceil(this._free_rect.y-this._list_height*0.5) : this._free_rect.y;
			
			this._has_drag=true;
			this._is_next=(this._portrait ? (pos.y<this._start_point.y) : (pos.x<this._start_point.x));
			this.stage.startDrag(this._container,this._hold_rect,false,this._free_rect);
			this._time=new Date().getTime();
			this._start_point=point;
		}
		
		if(!this._has_drag) return;
		let label=(this._portrait ? "y" : "x");
		
		if((this._is_next && (point[label]<=(this._temp_point ? this._temp_point : this._start_point)[label])) || (!this._is_next && (point[label]>=(this._temp_point ? this._temp_point : this._start_point)[label]))){
			this._temp_point=point;
		}else{
			this._start_point=this._temp_point=point;
			this._time=new Date().getTime();
			this._is_next=!this._is_next;
		}
		
		this._update_list();
	}
	
	onMouseUp(e)
	{
		this.stage.removeEventListener(StageEvent.MOUSE_MOVE,null,this.name);
		this.stage.removeEventListener(StageEvent.MOUSE_UP,null,this.name);
		
		this._has_drag=false;
		this.stage.stopDrag();
		
		if(e==null) {
			this._start_point=this._temp_point=this._time=null;
			return;
		}
	
		let delay=new Date().getTime()-this._time;
		if(delay==0 || this._temp_point==null){
			this._move_current_item();
		}else{
			this._move_list_by_speed(this._portrait ? (Math.abs(this._start_point.y-this._temp_point.y)/delay) : (Math.abs(this._start_point.x-this._temp_point.x)/delay));
		}
	    
	    this._start_point=this._temp_point=this._time=null;
		let bool=this._portrait ? (this._container.y>this._middle || this._container.y<this._middle-this._length+this._item_size) : (this._container.x>this._middle || this._container.x<this._middle-this._length+this._item_size);
		if(!bool) return;
		
		let posX=this._portrait ? 0 : (this._container.x>this._middle ? this._middle : (this._container.x<this._middle-this._length+this._item_size ? this._middle-this._length+this._item_size : this._container.x));
		let posY=this._portrait ? (this._container.y>this._middle ? this._middle : (this._container.y<this._middle-this._length+this._item_size ? this._middle-this._length+this._item_size : this._container.y)) : 0;
		TweenLite.to(this._container,0.16,{ease:"easeoutquad",x:posX,y:posY,onComplete:this._complete});
	}
	
	_move_list_by_speed(speed)
	{
		if(speed==null) return;
		
		if(speed==0 || speed<0.1){
			this._move_current_item();
			return;
		}
		
		let offset=0.3;
		let num=MathUtil.format(speed*(this._item_size+this.space)*this.offset);
		let time=Math.max(0.1,MathUtil.format((num*this.offset*offset)/this._item_size));
		this.moveList(num,time);
	}
	
	/**
	 * 移动列表
	 * @param {Number} num  移动列表距离
	 * @param {Number} time 移动列表时间
	 */
	moveList(num,time)
	{
		if(num==null || num==0) return;
		let label=(this._portrait ? "y" : "x");
		let pos=Math.ceil((this._container[label]+(this._is_next ? -1 : 1)*num)/(this._item_size+this.space));
		pos=pos*(this._item_size+this.space)-(pos>1 ? this.space+this._item_size*0.5 : this._item_size*0.5);
		pos=(pos>this._middle) ? this._middle : (pos<this._middle-this._length+this._item_size ? this._middle-this._length+this._item_size : pos);
		
		if(time==0){
			this._container[label]=pos;
			this.reset_list();
			return;
		}
		
		let obj={};
		obj[label]=pos;
		obj.onComplete=this._complete;
		obj.onUpdate=Global.delegate(this._update_list,this);
		TweenLite.to(this._container,time,obj);
	}
	
	onTweenComplete()
	{
		this._update_items_state();
		this._move_current_item();
	//	this.dispatchEvent(new Event(ScrollTouchList.SELECT,this._datas[this._current]));
	}
	
	onMouseWheel(e)
	{
		this._is_next=(e.delta<0);
		TweenLite.remove(this._container);
		this._move_list_by_speed(Math.abs(e.delta));
	}
	
	onMouseTap(e)
	{
		let item=e.target;
		if(item==null ) return;
		this.goto(item.index);
	}
	
	/**
	 * 跳转至对应项
	 * @param {Number} index 项的索引
	 * @param {Boolean} skip 是否缓动 true列表移动至对应项 false列表直接刷新至对应项
	 */
	goto(index,skip)
	{
		if(index<0 || index>=this._datas.length || this._current==index) return;
		
		TweenLite.remove(this._container);
		let label=(this._portrait ? "y" : "x");
		
		let temp=((index+1)*(this._item_size+this.space))-(index>0 ? this.space : 0);
		temp=temp+this._container[label]-this._middle-this._item_size;
		this._is_next=(temp>0);
		
		let offset=0.1;
		let num=Math.abs(temp);
		let time=skip ? 0 : Math.max(0.1,MathUtil.format((num*this.offset*offset)/this._item_size));
		this.moveList(num,time);
	}
	
	/**
	 * 根据列表位置 刷新显示内容
	 */
	reset_list()
	{
		if(this._list==null || this._list.length<1) return;
		let i,j,l=this._list.length,item;
		let label=(this._portrait ? "y" : "x");
		let offset=this._container[label];
		let index=Math.abs(Math.ceil((this._middle-offset+this._item_size*0.5)/(this._item_size+this.space)));
		
		index=index>0 ? index-1 : 0;
		let half=Math.ceil(this._max_num*0.5)-(this._max_num%2==0 ? 0 : 1);
		let start=(index-half);
		
		start=(index+half>(this._datas.length-1)) ? this._datas.length-this._list.length : start;
		start=start<0 ? 0 : start;
		
		for(i=0;i<l;i++){
			item=this._list[i];
			
			item.index=start;
			item.selected=false;
			item.data=this._datas[start];
			
			item[label]=start*(this._item_size+this.space);
			if(start==index) j=i;
			start++;
		}
		
		this._update_items_state(j);
		this._move_current_item();
	}
	
	_create_list()
	{
		if(this._datas==null || this._datas.length<1) return;
		let i,data,item,len=Math.min(this._datas.length,this._max_num);
		
		for(i=0;i<len;i++){
			data=this._datas[i];
			item=ObjectPool.create(this._item_class);
			
			this._list.push(item);
			this._container.addChild(item);
			item.set(data,this._portrait ? this._list_width : this._item_size,this._portrait ? this._item_size : this._list_height);
			
			item.index=i;
			item.addEventListener(StageEvent.MOUSE_TAP,Global.delegate(this.onMouseTap,this));
		}
		
		LayoutUtil.tile(this._list,1,!this._portrait,new Rectangle(0,0,this._portrait ? this._list_width : this._item_size,this._portrait ? this._item_size : this._list_height),new Point(this._portrait ? 0 : this.space,this._portrait ? this.space : 0));
	}
	
	_update_list()
	{
		this._update_items_state();
		if(!this._is_full) return;
		
		let end=(this._is_next ? this._list[this._list.length-1] : this._list[0]);
		let index=end.index;
		
		if((this._is_next && index>=(this._datas.length-1)) || (!this._is_next && index<=0)) return;
		
		let item=(this._is_next ? this._list[0] : this._list[this._list.length-1]);
		let point={x:(item.x+this._container.x),y:(item.y+this._container.y)}
		let label=(this._portrait ? "y" : "x");
		
		if(this._is_next){
			if(point[label]>-this._item_size) return;
			
			this._list.shift();
			item.index=index+1;
			item.data=this._datas[item.index];
			item.selected=(item.index==this._current);
			
			this._list.push(item);
			item[label]=end[label]+(this._item_size+this.space);
		}else{
			if(point[label]<(this._portrait ? this._list_height : this._list_width)+this._item_size) return;
			
			this._list.pop();
			item.index=index-1;
			item.data=this._datas[item.index];
			item.selected=(item.index==this._current);
			if(item.selected) this._temp_item=item;
			
			this._list.unshift(item);
			item[label]=end[label]-(this._item_size+this.space);
		}
	}
	
	_update_items_state(index)
	{
		if(this._list==null || this._list.length<1) return;
		
		let target=(index==null) ? this._middle : (this._list[index][label]+this._container[label]);
		let i,j=0,l=this._list.length,item,min,dy;
		let label=(this._portrait ? "y" : "x");
		
		for(i=0;i<l;i++){
			item=this._list[i];
			dy=Math.abs(item[label]+this._container[label]-target);
			
			if(i==0) min=dy;
			else if(dy<min){
				min=dy;
				j=i;
			}
			
			item.update(MathUtil.format((this._middle-dy)/this._middle));
		}
		
		j=(index==null) ? j : index;
		this.current=this._list[j].index;
		this._temp_item=this._list[j];
		this._list[j].selected=true;
	}
	
	_move_current_item()
	{
		let label=(this._portrait ? "y" : "x");
		let offest=(this._temp_item[label]+this._container[label]-this._middle);
		this._container[label]-=offest;
		this.dispatchEvent(new Event(ScrollTouchList.SELECT,this._datas[this._current]));
	}
	
	dispose()
	{
		this.clear();
		super.dispose();
	    delete this._bg_color,this.space,this.offset,this.mouseEnabled,this._portrait,this._is_init,this._is_next,this._has_drag,this._is_full,this._temp_item,this._bg,this._temp_point,this._time,this._start_point,this._complete,this._length,this._hold_rect,this._free_rect,this._current,this._middle,this._list,this._container,this._max_num,this._max_num,this._item_class,this._list_width,this._list_height,this._item_size,this._datas;
	}
}

ScrollTouchList.SELECT="stl_select_item";
ScrollTouchList.className="ScrollTouchList";