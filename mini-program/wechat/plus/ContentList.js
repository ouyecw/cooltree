import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import UIOrientation from '../model/UIOrientation.js'
import CanvasUtil from '../utils/CanvasUtil.js'
import ObjectUtil from '../utils/ObjectUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import UIContainer from '../ui/UIContainer.js'
import ArrayUtil from '../utils/ArrayUtil.js'
import Rectangle from '../geom/Rectangle.js'
import QuickUI from '../utils/QuickUI.js'
import Loader from '../loader/Loader.js'
import Factory from '../core/Factory.js'
import Source from '../core/Source.js'
import Global from '../core/Global.js'
import TweenLite from '../transitions/TweenLite.js'
import MathUtil from '../utils/MathUtil.js'

export default class ContentList extends DisplayObjectContainer
{
    static className="ContentList";
	
	controller;
	container;
	hold_size;
	line_img;
	old_list;
	bounds;
	datas;
	space;
	bg;
	
	constructor(options)
	{
		super();
        
		this.ops={
			width:Global.stage.stageWidth,
			height:500,
			isY:true,
			space:10,
			line:{
				width:0.9,
				height:2,
				color:"#f6f6f7"
			},
			className:ContentItem
		}

		if(options)
			ObjectUtil.copyAttribute(this.ops,options,true);

		this.bounds=ObjectPool.create(Rectangle);
		this.bounds.set(0,0,this.ops.width,this.ops.height);
		this.space=this.ops.space+(this.ops.line ? (this.ops.isY ? this.ops.line.height : this.ops.line.width) :0);
		this.hold_size=0;
		this.datas=[];
		this.init();
    }

	get scroll()
	{
		return this.controller ? this.controller.scroll : false;
	}

	async init()
	{
		this.container=Factory.c("dc");
		this.controller=new UIContainer();
		this.controller.setDimension(this.ops.width,this.ops.height,this.ops.isY ? UIOrientation.isY : UIOrientation.isX,true,true);
		this.controller.on(UIContainer.DRAG_MOVE,this.dragHandler,this);
		this.controller.instance=this.container;
		this.addChild(this.controller);

		if(!this.ops.line) return;
		const w=this.ops.isY && this.ops.line.width<1 ? this.ops.line.width*Global.stage.stageWidth : this.ops.line.width;
		const h=!this.ops.isY && this.ops.line.height<1 ? this.ops.line.height*Global.stage.stageWidth : this.ops.line.height;
		const obj=QuickUI.rectDisplay(w,h,this.ops.line.color);
		
		const base64=CanvasUtil.displayToImage(obj);
		const img=await Loader.loadImage(base64);
		this.line_img=ObjectPool.create(Source);
		this.line_img.image=img;
		this.line_img.width=w;
		this.line_img.height=h;
		ObjectPool.remove(obj);
	}

	dragHandler(e=null)
	{
		this.bounds.set(Math.max(0,-this.container.x),Math.max(0,-this.container.y),this.ops.width,this.ops.height);
		this.bg[this.ops.isY ? "y" : "x"]=-this.container[this.ops.isY ? "y" : "x"];
		const list=this._check_data();
		
		if(this.old_list && ArrayUtil.equal(list,this.old_list,false)) return;
		let del_list,add_list,item,data,index,line;

		if(!this.old_list){
			add_list=list;
		}else{
			add_list=ArrayUtil.subtract(list,this.old_list);
			del_list=ArrayUtil.subtract(this.old_list,list);
		}

		if(del_list && del_list.length>0){
			for(index of del_list){
				item=this.container.getChildByName("item"+index);
				if(!item) continue;
				item.removeFromParent();
				ObjectPool.remove(item);
			}
		}

		if(add_list && add_list.length>0){
			const sw=Global.stage.stageWidth;
			const sh=Global.stage.stageHeight;

			for(index of add_list){
				item=ObjectPool.create(this.ops.className);
				item.name="item"+index;
				data=this.datas[index];
				item.setup(data);
				item.moveTo(data._rect.x,data._rect.y);

				if(this.line_img && this.ops.line){
					line=Factory.c("do");
					line.setInstance(this.line_img);
					line.moveTo(this.ops.isY ? (sw-line.width)*0.5 : data._rect.width,
								this.ops.isY ? data._rect.height : (sh-line.height)*0.5);
					item.addChild(line);
				}

				this.container.addChild(item);
			}
		}

		this.old_list=list;
		this.container[this.ops.isY ? "height" : "width"]=this.hold_size;
		this.__checkDisplayUpdate();
	}

	//列表回到底部
	toEnd(time=0)
	{
		if(!this.ops) return;
		this.toScroll(this.hold_size,time);
	}

	//列表回到顶部
	toStart(time=0)
	{
		this.toScroll(0,time);
	}

	/**
	 * 列表移动
	 * @param {Number} value 位置
	 * @param {Number} time  时长（默认0）
	 */
	toScroll(value,time=0)
	{
		if(!this.scroll || !this.container) return;

		value=MathUtil.clamp(-value,this.ops[this.ops.isY ? "height" : "width"]-this.hold_size,0);
		if(this.container[this.ops.isY ? "y" : "x"]==value) return;

		if(time<=0){
			this.container[this.ops.isY ? "y" : "x"]=value;
			this.dragHandler();
			return;
		}

		const obj={
			onUpdate:()=>{
				this.dragHandler();
			}
		}

		obj[this.ops.isY ? "y" : "x"]=value;
		TweenLite.remove(this.container);
		TweenLite.to(this.container,time,obj);
	}

	addData(data,size)
	{
		if(!data || !data.length) return;
		this.datas=this.datas.concat(data);
		this.hold_size+=data.length*this.space+size;

		if(!this.bg) {
			this.bg=Factory.c("bs",[
				"#ff8899",
				this.ops.isY ? this.ops.width : Math.min(this.hold_size,this.ops.width),
				this.ops.isY ? Math.min(this.hold_size,this.ops.height) : this.ops.height,
				0,0,"#000000",0
			]);
			this.bg.mouseEnabled=true;
		}
		else{
			this.bg[this.ops.isY ? "height" : "width"]=Math.min(this.hold_size,this.ops[this.ops.isY ? "height" : "width"]);
		}
		
		if(!this.container.contains(this.bg)) 
			this.container.addChildAt(this.bg,0);
		
		this.dragHandler();
	}

	_check_data()
	{
		const list=[];
		let i,data,l=this.datas.length,pos=0,b=this.ops.isY;

		for(i=0;i<l;i++){
			data=this.datas[i];

			if(!data._rect) {
				data._rect={x:0,y:0,width:b ? this.ops.width : data.size,height:b ? data.size : this.ops.height};
				data._rect[b ? "y" : "x"]=pos;
				data._space=this.space;
			}

			pos=data._rect[b ? "y" : "x"] +data._rect[b ? "height" : "width"]+this.space;
			if(this.bounds.intersects(data._rect)) list.push(i);
		}

		return list;
	}

	clear()
	{
		this.bounds.set(0,0,this.ops.width,this.ops.height);
		this.container.moveTo(0,0);
		this.old_list=null;
		this.hold_size=0;
		this.datas=[];
		let item;

		while(this.container.numChildren>0){
			item=this.container.removeChildAt(0);
			ObjectPool.remove(item);
		}

		this.bg=null;
	}

	dispose()
	{
		this.clear();
		if(this.bounds) ObjectPool.remove(this.bounds);
		super.dispose();
	}
}

export class ContentItem extends DisplayObjectContainer
{
	static className="ContentItem";
	data=null;

	reset()
	{
		this.data=null;
		super.reset();
	}

	setup(data)
	{
		if(!data) return;
		this.data=data;
	}
}

module.exports ={ContentList,ContentItem};