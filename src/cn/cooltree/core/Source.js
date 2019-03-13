/**
===================================================================
Source Class
===================================================================
**/

class Source
{
	constructor(img=null,obj=null)
	{
		this.x=this.y=this.regX=this.regY=this.index=this.width=this.height=this.frame_width=this.frame_height=0;
		this.image=this.name=this.animation=this.label=this.url=null;
		this.isClone=false;
		this.scale=1;
		if(img && obj) this.setup(img,obj);
	}
	
	setup (img,obj,isJson)
	{
		if(!img) return;
		isJson=(isJson==true);
		
		let bool=isJson ? !(obj.sourceSize.w==obj.spriteSourceSize.w && obj.sourceSize.h==obj.spriteSourceSize.h) : false;
		let labels=String(isJson && obj.name.indexOf(".")>=0 ? StringUtil.replaceAll(obj.name,[".png",".jpg",".gif"],["","",""]) : obj.name).split("|");
		
		this.animation=labels.length>1 ? labels[0] : "";
		this.name=labels.length>1 ? labels[1] : labels[0];
		
		labels=StringUtil.getNumber(this.name);
		this.label=labels.length>0 ? labels[0] : "";
		this.index=labels.length>1 ? MathUtil.int(labels[1]) : 0;
		
		this.x=MathUtil.format(isJson ? obj.frame.x : obj.x);
		this.y=MathUtil.format(isJson ? obj.frame.y : obj.y);
		this.width=MathUtil.format(isJson ? obj.frame.w : obj.width);
		this.height=MathUtil.format(isJson ? obj.frame.h : obj.height);
		
		this.frame_width=isJson ? (bool ? obj.sourceSize.w : 0) :(obj.hasOwnProperty("frameWidth") ? MathUtil.format(obj.frameWidth) : 0);
		this.frame_height=isJson ? (bool ? obj.sourceSize.h : 0) :(obj.hasOwnProperty("frameHeight") ? MathUtil.format(obj.frameHeight) : 0);
		
		this.regX=MathUtil.format(isJson ? (obj.hasOwnProperty("pivot") ? Number(obj.pivot)*(this.frame_width>0 ? this.frame_width : this.width) : -obj.spriteSourceSize.x) : obj.frameX);
		this.regY=MathUtil.format(isJson ? (obj.hasOwnProperty("pivot") ? Number(obj.pivot)*(this.frame_height>0 ? this.frame_height : this.height) : -obj.spriteSourceSize.y) : obj.frameY);
	    
		this.url=img.src;
		if(Global.useCanvas && Global.useCache && (this.width!=img.width || this.height!=img.height)){
			let canvas=CanvasUtil.splitFrames(img,this.x,this.y,this.width,this.height);
			if(canvas){
				this.image=canvas;
				this.x=this.y=0;
			}
			else this.image=img;
		}
		else this.image=img;
		
		this.isClone=false;
	}
	
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
		copy.url=this.url;
		copy.isClone=true;
		return copy;
	}
	
	reset(img=null,obj=null)
	{
		this.x=this.y=this.regX=this.regY=this.index=this.width=this.height=this.frame_width=this.frame_height=0;
		this.image=this.name=this.animation=this.label=this.url=null;
		this.isClone=false;
		this.scale=1;
		
		if(img && obj) this.setup(img,obj);
	}
	
	dispose()
	{
		this.reset();
		delete this.x,this.y,this.scale,this.name,this.animation,this.label,this.url,this.regX,this.regY,this.frame_width,this.frame_height,this.image,this.index,this.width,this.height,this.isClone;
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
		str+='"url":'+this.url+',';
		str+='"scale":'+this.scale;
		return str+"}";
	}
}