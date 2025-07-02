/**
===================================================================
Source Class
===================================================================
**/


import StringUtil from '../utils/StringUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import MathUtil from '../utils/MathUtil.js'

/**
 * @class
 * @module Source
 */
export default class Source
{
	/**
	 * 新建资源实例
	 */
	constructor(img=null,obj=null,isJson=false)
	{
		this.x=this.y=this.regX=this.regY=this.index=this.width=this.height=this.frame_width=this.frame_height=0;
		this.image=this.name=this.animation=this.label=null;
		this.isRotated=false;
		this.isClone=false;
		this.scale=1;
		
		if(img && obj) 
			this.setup(img,obj,isJson);
	}
	
	/**
	 * 设置
	 * @param {Image} img
	 * @param {Object} obj 资源属性
	 * @param {Boolean} isJson
	 */
	setup (img,obj,isJson=false,index=0)
	{
		if(!img || !obj || (!obj.hasOwnProperty("frame") && !obj.hasOwnProperty("width"))) return;
		
		let bool=isJson ? !(obj.sourceSize.w==obj.spriteSourceSize.w && obj.sourceSize.h==obj.spriteSourceSize.h) : false;
		let labels=String(isJson && obj.name.indexOf(".")>=0 ? StringUtil.replaceAll(obj.name,[".png",".jpg",".gif"],["","",""]) : obj.name).split("|");
		
		this.animation=labels.length>1 ? labels[0] : "";
		this.name=labels.length>1 ? labels[1] : labels[0];
		
		this.x=MathUtil.format(isJson ? obj.frame.x : obj.x);
		this.y=MathUtil.format(isJson ? obj.frame.y : obj.y);
		
		this.width=MathUtil.format(isJson ? obj.frame.w : obj.width);
		this.height=MathUtil.format(isJson ? obj.frame.h : obj.height);
		
		this.frame_width=isJson ? (bool ? obj.sourceSize.w : 0) :(obj.hasOwnProperty("frameWidth") ? MathUtil.format(obj.frameWidth) : 0);
		this.frame_height=isJson ? (bool ? obj.sourceSize.h : 0) :(obj.hasOwnProperty("frameHeight") ? MathUtil.format(obj.frameHeight) : 0);
		
		this.regX=MathUtil.format(isJson ? (obj.hasOwnProperty("pivot") ? Number(obj.pivot)*(this.frame_width>0 ? this.frame_width : this.width) :
			(obj.spriteSourceSize ? obj.spriteSourceSize.x*Source.defaultOffset : 0)) : (obj.frameX || 0));
		
		this.regY=MathUtil.format(isJson ? (obj.hasOwnProperty("pivot") ? Number(obj.pivot)*(this.frame_height>0 ? this.frame_height : this.height) : 
			(obj.spriteSourceSize ? obj.spriteSourceSize.y*Source.defaultOffset : 0)) : (obj.frameY || 0));
	    
		this.image=img;
		this.setLabel(index);
		this.isClone=false;
	}

	setLabel(index=0)
	{
		const labels=StringUtil.getNumber(this.name);
		this.label=labels.length>0 ? labels[0] : "";
		this.index=labels.length>1 ? MathUtil.int(labels[1]) : index;

		if(!StringUtil.isEmpty(this.label) && (this.label.indexOf("-")==this.label.length-1 || this.label.indexOf("_")==this.label.length-1)){
			this.label=String(this.label).substring(0,this.label.length-1);
		}

		this.label=StringUtil.trim(this.label);
	}

	setPlist(img,obj,name,index,anim="")
	{
		name=StringUtil.replaceAll(name,[".png",".jpg",".gif"],["","",""]);
		this.animation=anim;
		this.name=name;
		
		const rect=Source.format(obj.frame || obj.textureRect);
		const reg=Source.format(obj.offset || obj.spriteOffset);
		const size=Source.format(obj.sourceSize || obj.spriteSize);

		this.x=MathUtil.format(rect[0]);
		this.y=MathUtil.format(rect[1]);

		this.width=MathUtil.format(rect[2]);
		this.height=MathUtil.format(rect[3]);

		this.frame_width=MathUtil.format(size[0]);
		this.frame_height=MathUtil.format(size[1]);

		if(this.width<=0) this.width=this.frame_width;
		if(this.height<=0) this.height=this.frame_height;

		this.regX=MathUtil.format(reg[0]);
		this.regY=MathUtil.format(reg[1]);

		this.image=img;
		this.setLabel(index);
		this.isClone=false;

		this.isRotated=obj.hasOwnProperty("textureRotated") ? obj.textureRotated : (obj.hasOwnProperty("rotated") ? obj.rotated : false);
		if(!this.isRotated) return;
		const w=this.width;
		this.width=this.height;
		this.height=w;
	}

	static format(data)
	{
		data=StringUtil.replaceAll(data,["{","}"],["",""]);
		data=data.split(",");
		const array=[];
		for(let num of data){
			array.push(Number(num));
		}
		return array;
	}
	
	/**
	 * 克隆
	 */
	clone()
	{
		let copy=ObjectPool.create(Source);
		copy.animation=this.animation;
		copy.name=this.name;
		copy.label=this.label;
		copy.index=this.index;
		copy.regX=this.regX;
		copy.regY=this.regY;
		copy.x=this.x;
		copy.y=this.y;
		copy.scale=this.scale;
		copy.image=this.image;
		copy.width=this.width;
		copy.height=this.height;
		copy.frame_width=this.frame_width;
		copy.frame_height=this.frame_height;
		copy.isRotated=this.isRotated;
		copy.isClone=true;
		return copy;
	}
	
	/**
	 * 重置
	 */
	reset(img=null,obj=null)
	{
		this.x=this.y=this.regX=this.regY=this.index=this.width=this.height=this.frame_width=this.frame_height=0;
		this.image=this.name=this.animation=this.label=null;
		this.isRotated=this.isClone=false;
		this.scale=1;
		
		if(img && obj) this.setup(img,obj);
	}
	
	/**
	 * 销毁
	 */
	dispose()
	{
		this.reset();
		delete this.isRotated,this.x,this.y,this.scale,this.name,this.animation,this.label,this.regX,this.regY,this.frame_width,this.frame_height,this.image,this.index,this.width,this.height,this.isClone;
	}
	
	toString()
	{
		let str="{";
		str+='"name":'+this.name+',';
		str+='"regX":'+this.regX+',';
		str+='"regY":'+this.regY+',';
		str+='"label":'+this.label+',';
		str+='"index":'+this.index+',';
		str+='"width":'+this.width+',';
		str+='"height":'+this.height+',';
		str+='"animation":'+this.animation+',';
		str+='"frame_width":'+this.frame_width+',';
		str+='"frame_height":'+this.frame_height+',';
		
		str+='"x":'+this.x+',';
		str+='"y":'+this.y+',';
		str+='"scale":'+this.scale+',';
		str+='"isRotated":'+this.isRotated;
		return str+"}";
	}
}

Source.defaultOffset=-1;
Source.className="Source";
module.exports = Source;