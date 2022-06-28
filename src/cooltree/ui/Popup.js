
import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import TweenLite from '../transitions/TweenLite.js'
import ObjectUtil from '../utils/ObjectUtil.js'
import StringUtil from '../utils/StringUtil.js'
import Factory from '../core/Factory.js'
import Stage from '../display/Stage.js'
import Global from '../core/Global.js'

/**
 * @class
 * @module Popup
 */
export default class Popup
{
	constructor(config=null)
	{
		this.config={
			font:'微软雅黑',
			space:30,         //样式间隔大小
			max:3,            //弹出信息最多3个
			maxWidth:800,
			percent:0.9,
			fontColor:'#ffffff',
			color:"#000000",
			fontSize:32,
			delay:3,      //弹出信息的停留时间
			radius:12,
			time:0.3,
			alpha:0.5
		}
		
		if(config)
			ObjectUtil.copyAttribute(this.config,config,true);
		
		this.itemWidth=(Global.width<this.config.maxWidth ? Global.width : this.config.maxWidth)*this.config.percent;
		this.popupContainer=Factory.c("dc");
		this.dataList=[];
		this.lock=false;
		this.posY=0;
	}
	
	push(str)
	{
		if(StringUtil.isEmpty(str) || this.dataList.length>9) return;
		
		if(!this.popupContainer.parent){
			Stage.current.addChild(this.popupContainer);
			this.resize(Global.width);
		}
		else this.popupContainer.toTop();
		
		if(this.popupContainer.numChildren>=this.config.max || this.lock){
			this.dataList.push(str);
			return;
		}
		
		const item=this._create(str);
		item.y=-this.posY-item.height-this.config.space*0.5;
		this.popupContainer.addChild(item);
		this.posY+=item.height+this.config.space;
		item.alpha=0;
		
		this.lock=true;
		TweenLite.remove(this.popupContainer);
		TweenLite.to(this.popupContainer,0.4,{y:this.posY});
		TweenLite.to(item,0.4,{alpha:1,delay:0.2,onComplete:this._on_ready.bind(this),onCompleteParams:[item]});
	}
	
	_create(content)
	{
		const tf=Factory.c("tf",{
			font:this.config.font,
			size:this.config.fontSize,
			color:this.config.fontColor,
			text:content});
			
		const item=Factory.c("bs",[
			this.config.color,
			this.itemWidth,
			this.config.fontSize+this.config.space*2,
			this.config.radius,
			0,"",this.config.alpha
			]);
			
		item.addChild(tf);
		tf.moveTo((this.itemWidth-content.length*this.config.fontSize)*0.5,this.config.space);
		return item;
	}
	
	_on_ready(item)
	{
		this.lock=false;
		
		TweenLite.to(item,this.config.time,{alpha:0,y:item.y+item.height*0.5,delay:this.config.delay,onComplete:res=>{
			const bool=(this.popupContainer.numChildren>=this.config.max);
			item.removeFromParent(true);
			
			if(!bool || !this.dataList.length) {
				if(this.popupContainer.numChildren==0) this.popupContainer.removeFromParent();
				return;
			}
			
			this.push(this.dataList.shift());
		}});
		
		if(this.popupContainer.numChildren>=this.config.max) return;
		if(this.dataList.length) this.push(this.dataList.shift());
	}
	
	resize(w)
	{
		if(!this.popupContainer || !this.popupContainer.parent) return;
		this.popupContainer.x=(w-this.itemWidth)*0.5;
	}
}