
function TextItem()
{
	EditItem.call(this);
	this.type=1;
}

Global.inherit(TextItem,EditItem);

TextItem.prototype.render  = function()
{
	if(this.instance && ((this.scaleX!=1 && this.scaleX!=0) || (this.scaleY!=1 && this.scaleY!=0))) {
	  	this.instance.scaleX=1/this.scaleX;
	  	this.instance.scaleY=1/this.scaleY;
	}
	
	TextItem.superClass.render.apply(this,arguments);
}

TextItem.prototype.reset_size=function()
{
	if(this.instance==null) return;
	
	var w=this.getWidth();
	var h=this.getHeight();
	
	this.scaleX=this.scaleY=this.instance.scaleX=this.instance.scaleY=1;
	this.height=this.instance.height=h;
	this.width=this.instance.width=w;
	
	this.instance.lineWidth=this.instance.writingMode ? h : w;
}

TextItem.prototype.edit=function()
{
	if(Global.useCanvas) Main.studio.enbale(false,true);

    Main.studio.container.unableTransformer();
	var str=StringUtil.trim(this.instance.text);
	this.instance.text="";
	
	if(!Global.useCanvas){
		Main.studio.input.x=Main.studio.input.y=Main.studio.input.rotation=0;
	}
	
	Main.studio.input.font=this.instance.font;
	Main.studio.input.size=this.instance.size;
	Main.studio.input.bold=this.instance.bold;
	Main.studio.input.align=this.instance.align;
	Main.studio.input.color="#000000";//this.instance.color;
	Main.studio.input.italic=this.instance.italic;
	Main.studio.input.text=(str=="双击输入文字" ? "" :str);
	Main.studio.input.underline=this.instance.underline;
	Main.studio.input.writingMode=this.instance.writingMode;
	
	Main.studio.input.visible=true;
//	Main.studio.input.element.focus();
	
	if(Global.useCanvas){
		Main.studio.input.width=this.width;
		Main.studio.input.height=this.height;
	
		Main.studio.input.moveTo(0,0);
		this.addChild(Main.studio.input);
	}else{
		var scale=Main.studio.container.editor.instance.scale;
		Main.studio.input.setSize(Math.max(this.width,360),Math.max(this.height,200));
		Main.studio.input.scale=scale;
		Main.studio.input.rotation=this.rotation;
		Main.studio.addChild(Main.studio.input);
		Main.studio.input.moveTo(this.localToGlobal(0,0));
	}
	
	if(!Global.useCanvas) Main.studio.checkItemEnable(Main.studio.input,this.input_complete,this,true)
	else Main.studio.addEventListener(Studio.CLOSE,Global.delegate(this.input_complete,this),this.name);
}

TextItem.prototype.input_complete=function(e)
{
	Main.studio.removeEventListener(Studio.CLOSE,null,this.name);
	Main.studio.input.removeFromParent(false);
	Main.studio.input.visible=false;
	
	var str=Main.studio.input.text;
	this.instance.text=StringUtil.isEmpty(str) ? "双击输入文字": str;
	Main.studio.container.tapItem({target:this});
}

TextItem.prototype.clone=function()
{
	var copy=ObjectPool.create(TextItem);
	var obj=this.instance;
	
	var tf=Factory.c("tf",{text:obj.text,font:obj.font,size:obj.size,color:obj.color,isInput:false});
	
	tf.autoSize=false;
	tf.bold=this.instance.bold;
	tf.align=this.instance.align;
	tf.italic=this.instance.italic;
	tf.leading=this.instance.leading;
	tf.underline=this.instance.underline;
	tf.lineHeight=this.instance.lineHeight;
	tf.writingMode=this.instance.writingMode;
	
	tf.width=MathUtil.format(this.instance.width);
	tf.height=MathUtil.format(this.instance.height);
	tf.lineWidth=MathUtil.format(this.instance.lineWidth);
	
	copy.setInstance(tf);
	
	copy.type=this.type;
	copy.path=this.path;
	copy.param=this.param;
	copy.binding=this.binding;
	
	if(this.instance.filters.length>0){
		for(var i=0;i<this.instance.filters.length;i++){
			var filter=this.instance.filters[i];
			copy.instance.filters.push(filter.clone());
		}
	}
	
	return copy;
}

