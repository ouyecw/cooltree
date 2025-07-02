
import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import TweenLite from '../transitions/TweenLite.js'
import ObjectUtil from '../utils/ObjectUtil.js'
import Factory from '../core/Factory.js'
import Event from '../events/Event.js'

export default class LoadingBar extends DisplayObjectContainer
{
	static className="LoadingBar";

	constructor(options)
	{
		super();
		
		this._options={
			width:800,
			height:60,
			radius:30,
			bgColor:'#555555',
			color:'#ff5500',
			texture:null,
			bgTexture:null,
			speed:0.01,
			line:3,
			lineColor:'#000000',
			ty:0,
			tf:{
				font:'微软雅黑',
				size:28,
				color:"#FFFFFF",
				stroke:"#ffff00",
				info:"",
				width:80
			}
		}
		
		this.percent=0;
		this._args=this.bg=this.bar=this.tf=null;
		this.init(options);
	}
	
	init(options)
	{
		if(options) ObjectUtil.copyAttribute(this._options,options,true);
		
		this.bg=Factory.c("bs",[this._options.bgColor,this._options.width,this._options.height,this._options.radius,this._options.line,this._options.lineColor])	
		this.addChild(this.bg);
		
		if(!this._options.tf) return;
		
		this.tf=Factory.c("tf",{
			bold:true,
			fillType:this._options.tf.stroke ? "both" : "fill",
			text:this._options.tf.info+this.percent+"%",
			font:this._options.tf.font,
			size: this._options.tf.size,
			color:this._options.tf.color,
			strokeColor:this._options.tf.stroke,
			lineWidth:this._options.tf.width
		});
		this.tf.moveTo((this._options.width-this.tf.width)*0.5,(this._options.height-this.tf.height)*0.5+this._options.ty);
		this.addChild(this.tf);
	}
	
	change(percent)
	{
		if(percent<this.percent || percent>100) return;
		this.percent=percent;
		
		const offset=this._options.line*0.5 || 0;
		const max=(this._options.width-offset*2);
		const current=percent*0.01*max;

		if(!this._args){
			const num=Math.min(this._options.radius,this._options.height*0.5-offset);
			this._args=[this._options.color,
						Math.max(offset*2,num),
						this._options.height-offset*2,
						num,0];
		}
		
		if(!this.bar){
			this.bar=Factory.c("bs",this._args);
			this.addChildAt(this.bar,1);
			this.bar.moveTo(offset,offset);
		}
		
		if(current<=this._args[1]) return;
		const time=(current-this._args[1])*this._options.speed;
		const obj={1:current};
		
		obj.onUpdate=()=>{
			if(isNaN(this._args[1])) {
				this._args[1]=this.bar.width;
				TweenLite.remove(this._args);
				return;
			}

			this.bar.width=this._args[1];

			if(!this.tf) return;
			this.tf.text=this._options.tf.info+Math.ceil(100*this._args[1]/max)+"%";
			this.tf.moveTo((this._options.width-this.tf.width)*0.5,(this._options.height-this.tf.height)*0.5+this._options.ty);
		}
		
		if(this.percent==100) obj.onComplete=()=>{
			this.emit(new Event(LoadingBar.COMPLETE));
		}
		
		TweenLite.remove(this._args);
		TweenLite.to(this._args,time,obj);
	}
}

LoadingBar.COMPLETE="loading_complete";
module.exports =LoadingBar;