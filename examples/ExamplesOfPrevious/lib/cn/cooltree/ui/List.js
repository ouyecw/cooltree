
function List()
{
	DisplayObjectContainer.call(this);
	this.disable_ft_color="#D5D5D5";
	this.over_ft_color="#000000";
	this.line_color="#D6D6D6";
	this.disable_color="#E0E0E0";
	this.over_color="#D8D8D8";
	this.bg_color="#F2F2F2";
	
	this.speed=300;
	this.canPush=false;
	this.useWheel=true;
	this.multiSelection=false;
	this.common_color=this.selectedList=null;
	this.item_height=this.w=this.h=this.time=0;
	this._handler=this.control=this._selected=this.container=this.tf_obj=this._datas=null;
}

Global.inherit(List, DisplayObjectContainer);
List.CHANGE="list_select_change";

List.prototype.setup  = function(width,height,item_height,tf_obj,multi)
{
	this.w=width;
	this.h=height;
	this.tf_obj=tf_obj;
	this.setSize(width,height);
	this.item_height=item_height;
	this.multiSelection=(multi==true);
	if(tf_obj) this.common_color=tf_obj.color;
	if(this.multiSelection) this.selectedList=[];
	if(Global.os==SystemType.OS_PC) this.time=0.5;
	this._handler=Global.delegate(this._click_item,this);
}

Object.defineProperty(List.prototype,"selected",{
	get: function (){
		return this.multiSelection ? this.selectedList : this._selected;
	},
    set: function (value) {
       if(this.multiSelection){
       		if(!this.container || !this.container.numChildren) return;
       		let bool=(!value || !value.length);
       		ArrayUtil.each(this.container._children,function(item){
       			if((bool && item.bool) || (!bool && ((!item.bool && value.indexOf(item.data)>=0) || item.bool))) this._click_item(item);
       		},this);
       		return;
       }
       
       if(this._selected==value) return;
       if(this._selected) this._selected.enable=true;
       
       this._selected=value;
       if(value) this._selected.enable=false;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(List.prototype,"data",{
	get: function (){
		return this._datas;
	},
    set: function (value) {
       this._datas=value;
       
       if(!value || !value.length){
          this.clear();
          return;
       }
       
       if(!this.container){
       	  let bool=(!this.canPush && this.h/this.item_height>=value.length);
       	  this.container=Factory.c("dc");
       	  
       	  if(!bool) {
       	  	this.control=new UIContainer();
       	  	this.control.instance=this.container;
       	  	this.control.setDimension(this.w,this.h,UIOrientation.isY,true,true);
       	  }
       	  
       	  this.addChild(this.control ? this.control : this.container);
       	  
       	  if(Global.os==SystemType.OS_PC && this.useWheel) {
       	  	this.container.mouseEnabled=true;
       	  	this.container.addEventListener(StageEvent.MOUSE_WHEEL,Global.delegate(this._mouse_wheel,this));
       	  }
       }
       
       ArrayUtil.each(this._datas,function(data){
       	  this.addItem(data);
       },this);
		
    },
    enumerable: true,
    configurable: true
});

List.prototype._mouse_wheel=function(e)
{
	let bool=(e.delta>0);
	if((!bool && (this.container.y<=(this.h-this.container.height))) || (bool && (this.container.y>=0))) return;
	let posY=this.container.y+(bool ? this.item_height : -this.item_height);
	posY=bool ? Math.min(0,posY) : Math.max(this.h-this.container.height,posY);
	let time=Math.abs(this.container.y-posY)/this.speed;
	TweenLite.remove(this.container);
	TweenLite.to(this.container,time,{y:posY});
}

/**
 * 添加子对象
 * @param {Object} data {label:"名称",value:"数值"}
 */
List.prototype.addItem  = function(data)
{
	if(!data) return;
	let item=new Button();
	item.instance=Factory.c("bs",[this.bg_color,this.w-2,this.item_height-2,0,1,this.line_color]);
	item.setup([Factory.c("ef",[Effect.COLOR,this.bg_color,this.time])],[Factory.c("ef",[Effect.COLOR,this.over_color,this.time])],[Factory.c("ef",[Effect.COLOR,this.disable_color,this.time])]);
	
	this.tf_obj.width=this.tf_obj.size*data.label.length;
	this.tf_obj.height=this.tf_obj.size+1;
	this.tf_obj.text=data.label;
	
	this.tf_obj.y=(this.item_height-this.tf_obj.height)*0.5;
	this.tf_obj.x=(this.w-this.tf_obj.width)*0.5;
	item.setLabel(this.tf_obj,this.over_ft_color,this.disable_ft_color);
	item.data=data.value;
	item.bool=false;
	
	this.container.addChild(item);
	LayoutUtil.tile(this.container._children,1,false);
	this.container.height=(this.container.numChildren*this.item_height);
	item.addEventListener(StageEvent.MOUSE_TAP,this._handler);
}

List.prototype._click_item=function(e)
{
	if(!e) return;
	let btn=(e instanceof Button ? e : e.target);
	
	if(this.multiSelection){
		if(btn.bool){
			let index=this.selectedList.indexOf(btn);
			if(index>=0) this.selectedList.splice(index,1);
			btn.setupState([Factory.c("ef",[Effect.COLOR,this.bg_color,this.time])],Button.state.UP);
			btn.setupState([Factory.c("ef",[Effect.COLOR,this.disable_color,this.time])],Button.state.OVER);
			btn.out_color=this.common_color;
		}else{
			this.selectedList.push(btn);
			btn.setupState([Factory.c("ef",[Effect.COLOR,this.over_color,this.time])],Button.state.UP);
			btn.setupState([Factory.c("ef",[Effect.COLOR,this.over_color,this.time])],Button.state.OVER);
			btn.out_color=btn.over_color;
		}
		
		btn.state=null;
		btn.bool=!btn.bool;
		btn.setState(Button.state.UP);
		return;
	}
	
	this.selected=btn;
	this.dispatchEvent(new Event(List.CHANGE,btn.data,btn.tf.text));
}

List.prototype.size=function(w,h)
{
	if(!this.container || !this.container.numChildren) return;
	
	ArrayUtil.each(this.container._children,function(item){
		item.instance.width=w;
		item.tf.x=(w-this.tf_obj.size*item.tf.text.length)*0.5;
	},this);
	
	if(this.control) this.control.updateSizeInArea(w,h);
}

List.prototype.clear=function()
{
	if(!this.container) return;
	this.container.removeFromParent(true);
	if(this.control) this.control.dispose();
	this.container=this.control=null;
}

List.prototype.dispose=function()
{
	this.clear();
	List.superClass.dispose.call(this);
	delete this.speed,this.useWheel,this.disable_ft_color,this.over_ft_color,this.line_color,this.disable_color,this.over_color,this.bg_color,this.canPush,this.item_height,this.w,this.h,this._handler,this.control,this._selected,this.container,this.tf_obj,this._datas;
}

