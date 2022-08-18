/**
===================================================================
Source Class
===================================================================
**/

function Source(img,obj)
{
	if(obj) this.setup(img,obj);
}

Source.prototype.__class__="Source";

Source.prototype.setup=function (img,obj,isJson)
{
	isJson=(isJson==true);
	
	var bool=isJson ? !(obj.sourceSize.w==obj.spriteSourceSize.w && obj.sourceSize.h==obj.spriteSourceSize.h) : false;
	var labels=String(isJson && obj.name.indexOf(".")>=0 ? StringUtil.replaceAll(obj.name,[".png",".jpg",".gif"],["","",""]) : obj.name).split("|");
	
	this.animation=labels.length>1 ? labels[0] : "";
	this.name=labels.length>1 ? labels[1] : labels[0];
	
	labels=StringUtil.getNumber(this.name);
	this.label=labels.length>0 ? labels[0] : "";
	this.index=labels.length>1 ? MathUtil.int(labels[1]) : 0;
	
	this.rect=new Rectangle(MathUtil.format(isJson ? obj.frame.x : obj.x),MathUtil.format(isJson ? obj.frame.y : obj.y),MathUtil.format(isJson ? obj.frame.w : obj.width),MathUtil.format(isJson ? obj.frame.h : obj.height));
	
	this.width=isJson ? (bool ? obj.sourceSize.w : 0) :(obj.hasOwnProperty("frameWidth") ? MathUtil.format(obj.frameWidth) : 0);
	this.height=isJson ? (bool ? obj.sourceSize.h : 0) :(obj.hasOwnProperty("frameHeight") ? MathUtil.format(obj.frameHeight) : 0);
	
	this.reg=new Point(MathUtil.format(isJson ? (obj.hasOwnProperty("pivot") ? Number(obj.pivot)*(this.width>0 ? this.width : this.rect.width) : obj.spriteSourceSize.x) : obj.frameX),MathUtil.format(isJson ? (obj.hasOwnProperty("pivot") ? Number(obj.pivot)*(this.height>0 ? this.height : this.rect.height) : obj.spriteSourceSize.y) : obj.frameY));
    
	this.image=img || ObjectPool.create(Image);
	this.url=this.image.src;
	this.isClone=false;
}

Source.prototype.clone=function()
{
	var copy=ObjectPool.create(Source);
	copy.animation=this.animation;
	copy.name=this.name;
	copy.label=this.label;
	copy.index=this.index;
	copy.reg=this.reg.clone();
	copy.rect=this.rect.clone();
	copy.image=this.image;
	copy.width=this.width;
	copy.height=this.height;
	copy.url=this.url;
	copy.isClone=true;
	
	return copy;
}

Source.prototype.reset=function()
{
	this.name=this.animation=this.label=this.url=null;
	this.reg=this.rect=this.image=null;
	this.index=this.width=this.height=0;
	this.isClone=false;
}

Source.prototype.dispose=function()
{
	this.reset();
	delete this.name,this.animation,this.label,this.url,this.reg,this.rect,this.image,this.index,this.width,this.height,this.isClone;
}

Source.prototype.toString=function()
{
	var str="{";
	str+='"name":'+this.name+',';
	str+='"animation":'+this.animation+',';
	str+='"label":'+this.label+',';
	str+='"index":'+this.index+',';
	str+='"width":'+this.width+',';
	str+='"height":'+this.height+',';
	str+='"reg":'+this.reg.toString()+',';
	str+='"rect":'+this.rect.toString()+',';
	str+='"url":'+this.url;
	return str+"}";
}
