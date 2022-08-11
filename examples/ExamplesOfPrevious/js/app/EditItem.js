
function EditItem()
{
	DisplayObjectContainer.call(this);
	this._register_instance=null;
	this.binding=this.path="";
	this.bool=true;
	this.type=0;
}

Global.inherit(EditItem,DisplayObjectContainer);

EditItem.UPDATE_SIZE="item_update_size";

Object.defineProperty(EditItem.prototype,"instance",{
	get: function () {
	    return this._register_instance;
    },

    set: function (value) {
    	var depth=0;
    	
    	if(this._register_instance!=null) {
    		depth=this._register_instance.getIndex();
    		depth=Math.max(0,depth);
    		
			this._register_instance.removeFromParent(true);
			this._register_instance =null;
		}
    	
    	if(value==null) return;
    	this.mouseEnabled=true;
    	this.mouseChildren=false;
    	this.usePolyCollision=true;
    	
        this._register_instance =value;
        this.addChildAt(this._register_instance,depth);
        this._updateSize();
    },
    enumerable: true,
    configurable: true
});

EditItem.prototype.setInstance=function(target)
{
	if(target==undefined || target==null ) return;
	
	if(target instanceof Image || ClassUtil.getQualifiedClassName(target)=="HTMLImageElement"){
		this.instance=Factory.c("do");
		this.instance.setInstance(target);
	}
	else if(target instanceof DisplayBase){
		this.instance=target;
	}
}

EditItem.prototype.getData=function()
{
	var filters,obj={};
	obj.type=this.type;
	
	obj.x=MathUtil.format(this.x);
	obj.y=MathUtil.format(this.y);
	
	obj.scaleX=MathUtil.format(this.scaleX);
	obj.scaleY=MathUtil.format(this.scaleY);
	
	obj.binding=this.binding;
	obj.alpha=MathUtil.format(this.alpha);
	obj.rotation=MathUtil.format(this.rotation);
	
	if(obj.type<1){
		obj.data=this.path;
		filters=this.instance.filters;
	}
	else if(obj.type==1){
		obj.data={};
		obj.data.text=this.instance.text;
		obj.data.font=this.instance.font;
		obj.data.size=this.instance.size;
		obj.data.bold=this.instance.bold;
		obj.data.color=this.instance.color;
		obj.data.align=this.instance.align;
		obj.data.italic=this.instance.italic;
		obj.data.leading=this.instance.leading;
		obj.data.underline=this.instance.underline;
		obj.data.lineHeight=this.instance.lineHeight;
		obj.data.writingMode=this.instance.writingMode;
		
		filters=this.instance.filters;
		obj.data.tie=1;
		
		if(!obj.data.writingMode && Global.useCanvas && this.instance._fontMetrics){
			obj.data.tie=Math.floor(this.instance.height/this.instance._fontMetrics.height);
		} 
		
		obj.data.width=MathUtil.format(this.instance.width);
		obj.data.height=MathUtil.format(this.instance.height);
		obj.data.lineWidth=MathUtil.format(this.instance.lineWidth);
	}
	else{
		obj.data={};
		obj.data.color=this.instance.color;
		obj.data.strokeColor=this.instance.strokeColor;
		
		filters=this.instance.instance.filters;
		obj.data.width=MathUtil.format(this.instance.width);
		obj.data.redius=MathUtil.format(this.instance.redius);
		obj.data.height=MathUtil.format(this.instance.height);
		obj.data.thickness=MathUtil.format(this.instance.thickness);
		obj.data.pattern=this.path;
		
		obj.x=MathUtil.format(this.x);
		obj.y=MathUtil.format(this.y);
	}
	
	if(filters && filters.length>0){
		var filter=filters[0];
		if(filter && filter.alpha>0 && !(filter.shadowBlur==0 && filter.distance==0)){
			obj.shadow=filter.toString();
		}
	}
	
	return obj;
}

EditItem.prototype.reset=function()
{
	if(this._register_instance){
		this._register_instance.removeFromParent(true);
	}
	
	this.type=0;
	this.path="";
	this.bool=true;
	this.binding="";
	this._register_instance=null;
	EditItem.superClass.reset.call(this);
}

EditItem.prototype.clone=function()
{
	var copy=ObjectPool.create(EditItem);
	var obj,img,filters,target;
	
	if(this.type==0){
		obj=Factory.c("do");
		img=this.instance.instance;
		var image=new Image();
		image.src=(img instanceof Image || ClassUtil.getQualifiedClassName(img)=="HTMLImageElement") ? img.src :img.image.src;
		obj.setInstance(image);
		obj.setSize(this.instance.width,this.instance.height);
		filters=this.instance.filters;
	}else{
		obj=this.instance.clone();
		filters=this.instance.instance.filters;
	}
	
	copy.setInstance(obj);
	target=this.type==0 ? copy.instance : copy.instance.instance;
	
	copy.type=this.type;
	copy.path=this.path;
	copy.param=this.param;
	copy.binding=this.binding;
	
	if(filters && filters.length>0){
		for(var i=0;i<filters.length;i++){
			var filter=filters[i];
			target.filters.push(filter.clone());
		}
	}
	
	return copy;
}
