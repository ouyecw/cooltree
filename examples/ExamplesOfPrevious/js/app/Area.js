
function Area()
{
	this.altKey=this.tdata=this.relative=this.transformer=this.img=this.img_path=this.tf=this.bg=this.editor=this.container=this.background=null;
	DisplayObjectContainer.call(this);
}

Area.SCALE=1;
Area.MIN_SCALE=1;
Area.MAX_SCALE=8;
Area.PHOTO_SCALE=0.5;

Area.WIDTH=1080;
Area.HEIGHT=1920;

Area.UPDATE_SIZE="area_update_size";
Area.SELECT_ITEM="area_select_item";
Area.CANCEL_SELECTED="area_cancel_selected";

Global.inherit(Area,DisplayObjectContainer);

Area.prototype.init=function()
{
	var assets=MovieManager.getData("color");
	var scale_btn;
	
	scale_btn=new Button();
	scale_btn.setup(assets[18],assets[19]);
	scale_btn.scale=0.3;
	
	this.relative={scaleX:1,scaleY:1};
	this.transformer=new Transformer();
	this.transformer.relative_data=this.relative;
	this.transformer.setup(null,scale_btn,true,Main.studio.datas.config.transformer_color);
	
	this.tf=Factory.c("tf",{text:(MathUtil.int(Area.SCALE*100)+"%"),size:16,color:"#666666"});
	var tf_bg=Factory.c("bs",["#FFFFFF",42,22]);
	tf_bg.alpha=0.6;
	
	tf_bg.moveTo(2,(Number(Main.studio.datas.config.display_bar_top)==1 ? Number(Main.studio.datas.config.item_height)+1 :0));
	this.tf.moveTo(4,(Number(Main.studio.datas.config.display_bar_top)==1 ? Number(Main.studio.datas.config.item_height)+1 :0));
	
	var dc=Factory.c("dc");
	this.editor=new UIContainer();
	this.container=Factory.c("dc");
	this.background=Factory.c("dc");
	this.background.mouseChildren=false;
	
	this.bg=Factory.c("bs");
    var w=window.innerWidth,h=window.innerHeight-Number(Main.studio.datas.config.item_height);
    this.bg.setup(Main.studio.datas.config.bg_color,w,h+Number(Main.studio.datas.config.item_height),0);
	
	dc.addChild(this.background);
	dc.addChild(this.container);
	
	this.addChild(this.bg);
	this.addChild(this.editor);
	this.addChild(this.transformer);
	
	this.addChild(tf_bg);
	this.addChild(this.tf);
	
	this.setBG(null);
	dc._updateSize();
	this.altKey=false;
	
	var scale=MathUtil.getSizeScale(Area.WIDTH,Area.HEIGHT,w,h,true);
	this.editor.setDimension(MathUtil.format(scale*Area.WIDTH),MathUtil.format(scale*Area.HEIGHT),UIOrientation.isXY,true,true);
	this.editor.instance=dc;
	this.center();
	
	this.transformer.addEventListener(Transformer.DELETE,Global.delegate(this.removeItem,this));
	this.transformer.addEventListener(Transformer.MOVE,Global.delegate(this.changeItemTransformer,this));
	this.transformer.addEventListener(Transformer.SCALE,Global.delegate(this.changeItemTransformer,this));
	this.transformer.addEventListener(Transformer.DOUBLE_CLICK,Global.delegate(this.doubleClickTransformer,this));
	
	this.editor.addEventListener(UIContainer.DRAG_MOVE,Global.delegate(this.onDragHandler,this));
	this.editor.addEventListener(StageEvent.MOUSE_WHEEL,Global.delegate(this.onScaleHandler,this));
	
	Main.studio.addEventListener(EditItem.UPDATE_SIZE,Global.delegate(this.onUpdateSize,this));
	Stage.current.addEventListener(StageEvent.KEY_DOWN,Global.delegate(this.onKeyDown,this),this.name);
	Stage.current.addEventListener(StageEvent.KEY_UP,Global.delegate(this.onKeyUp,this),this.name);
	
	return this;
}

Area.prototype.onKeyDown=function(e)
{
	if(e.params==90 && e.label && (e.label.ctrlKey || e.label.metaKey)){
		if(this.transformer.target) this.unableTransformer();
		Command.run(Main.studio.commands.getPrec());
	}
	
	this.altKey=(e.params==18);
}

Area.prototype.onKeyUp=function(e)
{
	this.altKey=false;
}

Area.prototype.removeItem=function(e)
{
	if(this.transformer.target==null) return;
	var depth=this.transformer.target.getIndex();
	this.transformer.target.removeFromParent(false);
	Main.studio.commands.push(Command.create(Command.DELETE,this.transformer._target,depth));
	this.unableTransformer();
}

Area.prototype.catchPicture=function()
{
	if(this.transformer && this.transformer.target) this.unableTransformer();
	var _scale=(Main.catch_pic_height && Main.catch_pic_width) ? MathUtil.getSizeScale(Area.WIDTH,Area.HEIGHT,Main.catch_pic_width,Main.catch_pic_height) : 1;
	
	if(Global.useCanvas)
		return CanvasUtil.containerToImage(this.editor.instance,"image/jpeg");
		
	var temp=Factory.c("dc");
	var obj,i,d,p,f,item,dy=0;
	
	if(this.img){
		obj=ObjectPool.create(DisplayObject);
		obj.setInstance(this.img);
		obj.scale=MathUtil.format(MathUtil.getSizeScale(this.img.width,this.img.height,Area.WIDTH,Area.HEIGHT,false));
	    obj.moveTo(Math.round((Area.WIDTH-obj.getWidth())*0.5),Math.round((Area.HEIGHT-obj.getHeight())*0.5));
	}else{
		obj=ObjectPool.create(DisplayObject);
		obj.setSize(Area.WIDTH,Area.HEIGHT);
		obj.graphics.canvas.width=Area.WIDTH;
		obj.graphics.canvas.height=Area.HEIGHT;
		
		obj.graphics.stroke_style=null;
		obj.graphics.beginFill(Main.studio.datas.config.blank_color,1);
		obj.graphics.drawRect(0,0,Area.WIDTH,Area.HEIGHT);
	}
	
	temp.addChild(obj);
	
	for(i=0;i<this.container.numChildren;i++){
		item=this.container.getChildAt(i);
		d=item.getData();
		dy=0;
		
		if(item.type==0){
			obj=ObjectPool.create(DisplayObject);
			obj.setInstance(item.instance.instance);
		}else if(item.type==-1){
			obj=Factory.c("dc");
			f=ObjectPool.create(DisplayObject);
			p=item.instance.instance.element;
			f.graphics.context.drawImage(p,0,0,item.instance._video_width,item.instance._video_height,0,0,item.instance._video_width,item.instance._video_height);
		    obj.addChild(f);
		    f=ObjectPool.create(DisplayObject);
		    f.setInstance(MovieManager.getData("play_btn")[0]);
		    f.moveTo(Math.round((item.instance._video_width-f.getWidth())*0.5),Math.round((item.instance._video_height-f.getHeight())*0.5));
		    obj.addChild(f);
		}else if(item.type==1){
			obj=ObjectPool.create(TextField);
			obj.autoSize=false;
			ObjectUtil.copyAttribute(obj,d.data,false,["text","width","height","lineWidth"]);
			obj.lineWidth=(d.data.lineWidth>0 ? d.data.lineWidth : (d.data.writingMode ? d.data.height : d.data.width));
			obj.height=d.data.height;
			obj.width=d.data.width;
			obj.text=d.data.text;
		}else{
			obj=ObjectPool.create(DisplayObject);
			obj.setSize(d.data.width,d.data.height);
			obj.graphics.canvas.width=Math.max(Area.WIDTH,d.data.width);
			obj.graphics.canvas.height=Math.max(Area.HEIGHT,d.data.height);
			if(d.data.thickness>0) obj.graphics.lineStyle(d.data.thickness,d.data.strokeColor);
			else obj.graphics.stroke_style=null;
			
			if(!StringUtil.isEmpty(item.instance._pattern_src)){
				p=new Image();
				p.src=item.instance._pattern_src;
				p=obj.graphics.context.createPattern(p,"repeat");
			}
			
			obj.graphics.beginFill(p ? p : d.data.color,p==null && StringUtil.isEmpty(d.data.color) ? 0 : 1);
			obj.graphics.drawRoundRect(d.data.thickness,d.data.thickness,d.data.width,d.data.height,d.data.redius);
		    dy=Math.ceil(d.data.thickness*0.5);
		    obj.graphics.endFill();
		}
		
		p=null;
		f=(item.instance instanceof BoxShape || item.instance instanceof VideoPlayer) ? item.instance.instance.filters : item.instance.filters;
		if(obj.filters && f && f.length>0){
			for(var k=0;k<f.length;k++) {
				(item.instance instanceof VideoPlayer ? obj.getChildAt(0) : obj).filters.push(f[k]);
			}
		}
		
		ObjectUtil.copyAttribute(obj,d,false,["binding","data","type","x","y","shadow"]);
		obj.moveTo(d.x-dy,d.y-dy);
		if(obj) temp.addChild(obj);
		f=null;
	}
	
	var target=CanvasUtil.create();
	
	if(Main.catch_pic_height && Main.catch_pic_width) {
		var dc=Factory.c("dc");
		temp.scale=_scale;
		dc.addChild(temp);
		temp=dc;
	}
	
	target.canvas.width=Main.catch_pic_width ? Main.catch_pic_width : Area.WIDTH;
	target.canvas.height=Main.catch_pic_height ? Main.catch_pic_height : Area.HEIGHT;
	CanvasUtil._renderContainer(target,temp,temp);
	
	var d="";
	try{
		d=target.canvas.toDataURL("image/jpeg");
	}catch(err){};
	
	temp.removeAllChildren(true);
	ObjectPool.remove(temp);
	
	return d;
}

Area.prototype.optimization=function()
{
	if(this.container==null || this.container.numChildren<1) return true;
	
	var pos=this.container.localToGlobal(0,0);
	var frame=new Rectangle(pos.x,pos.y,Area.WIDTH*this.editor.instance.scale,Area.HEIGHT*this.editor.instance.scale);
	
	for(var child,rect,i=0,l=this.container.numChildren;i<l;i++){
    	child=this.container._children[i];
    	rect=child.getBounds();
    	rect=new Rectangle(rect.x,rect.y,rect.width,rect.height);
    	
    	if(!frame.intersects(rect)){
    		ObjectPool.remove(child);
    		i--;
    		l--;
    	}
   }
	
	return false;
}

Area.prototype.checkItemPass=function()
{
	var list={data:[],load:[]};
	for(var child,i=0,l=this.container.numChildren;i<l;i++){
		child=this.container._children[i];
		
//		if(child.type==1 && child.instance && StringUtil.isEmpty(child.instance.binding)){
//			return '第'+i+' "'+child.instance.text+'"'+'该文本没有绑定字段！';
//		}
		
		if(child.type==-1) {
			if(!StringUtil.isEmpty(child.path)) {
				list.data.push(child.getData());
				continue;
			}
			
			list.data.push(child);
			list.load.push(list.data.length-1);
		}
		else if(child.type==0) {
			if(!StringUtil.isEmpty(child.path)) {
				list.data.push(child.getData());
				continue;
			}
			
			list.data.push(child);
			list.load.push(list.data.length-1);
		}
		else if(child.type>1 && child.instance && child.instance.pattern){
			if(!StringUtil.isEmpty(child.path)) {
				list.data.push(child.getData());
				continue;
			}
			
			list.data.push(child);
			list.load.push(list.data.length-1);
		}
		else list.data.push(child.getData());
	}
	return list;
}

Area.prototype.cacheItemData=function()
{
	var list={data:[]};
	for(var child,temp,i=0,l=this.container.numChildren;i<l;i++){
		child=this.container._children[i];
		temp=child.getData();
		
		if(child.type==0) {
			temp.img=(Global.useCanvas ? child.instance.instance.image : child.instance.instance).src;
		}
		else if(child.type>1 && child.instance && child.instance.pattern){
			temp.data.pattern=child.instance._pattern_src;
		}
		else if(child.type==-1) {
			temp.video=child.instance.src;
		}
		
		list.data.push(temp);
	}
	return list;
}

Area.prototype.onUpdateSize=function(e)
{
	if(this.transformer==null || this.transformer.target==null) return;
	var temp=this.transformer.target;
	this.transformer.target=null;
	this.transformer.target=temp;
}

Area.prototype.doubleClickTransformer=function(e)
{
	if(e==null || this.transformer.target==null) return;
    if(this.transformer.target instanceof TextItem) this.transformer.target.edit();
    else if(this.transformer.target instanceof VideoItem)  this.transformer.target.change();
}

Area.prototype.changeItemTransformer=function(e)
{
	if(e==null || this.transformer.target==null) return;
	var data={x:this.transformer.target.x,y:this.transformer.target.y,s:this.transformer.target.scale,r:this.transformer.target.rotation};
	
    if(e.type==Transformer.MOVE && this.altKey) {
    	this.transformer.target.moveTo(this.tdata.x,this.tdata.y);
    	var copy=this.copyItem(this.transformer.target,data);
    	
    	if(copy){
    		
    		this.unableTransformer();
    		this.tapItem({target:copy});
    	}
    }
    else
    	Main.studio.commands.push(e.type==Transformer.MOVE ? Command.create(Command.MOVE,this.transformer.target.name,this.tdata,data) : Command.create(Command.SCALE,this.transformer.target.name,this.tdata,data));
    
    this.tdata=data;
    if(e.type==Transformer.MOVE) return;
    var isText=(this.transformer.target instanceof TextItem);
    
    if(isText){
    	this.transformer.target.reset_size();
    	this.onUpdateSize();
    	this.dispatchEvent(new Event(Area.UPDATE_SIZE));
    }
}

Area.prototype.copyItem=function(item,data)
{
	if(item==null || data==null) return null;
	var index=item.getIndex();
	var copy=item.clone();
	copy.moveTo(data.x,data.y);
	this.container.addChildAt(copy,index);
	
	copy._updateSize();
	copy.instance.mouseEnabled=true;
	copy.addEventListener(StageEvent.MOUSE_TAP,Global.delegate(this.tapItem,this));
	
	Main.studio.commands.push(Command.create(Command.CREATE,copy.name));
	this.altKey=false;
	
	return copy;
}

Area.prototype.addItem=function(instance,bool,c,m)
{
	if(instance==null) return;
	
	var item=ObjectPool.create(c ? c : EditItem);
	item.setInstance(instance);
	
	if(item.instance==undefined){
		ObjectPool.remove(item);
		trace("[ERROR]Area.addItem()");
		return null;
	}
	
	this.container.addChild(item);
	
	if(bool) {
		item._updateSize();
		item.instance.mouseEnabled=true;
		if(!m) this.tapItem({target:item});
		item.addEventListener(StageEvent.MOUSE_TAP,Global.delegate(this.tapItem,this));
	}
	
	return item;
}

Area.prototype.tapItem=function(e)
{
	if(e && e.target) {
		this.transformer.target=e.target;
		this.tdata={x:e.target.x,y:e.target.y,s:e.target.scale,r:e.target.rotation};
        this.dispatchEvent(new Event(Area.SELECT_ITEM,e.target));
        Main.studio.checkItemEnable(this.transformer,this.unableTransformer,this);
	}
}

Area.prototype.setBG=function(img)
{
	this.img=null;
	
	if(img==null){
		img=Factory.c("bs",[Main.studio.datas.config.blank_color,Area.WIDTH,Area.HEIGHT,0]);
	}
	else{
		if(img.width==0 || img.height==0) return;
		this.img=img;
		this.img_path=null;
		
		var child=this.background.getChildAt(0);
		if(child && (child instanceof UIBase)){
			child.instance.setInstance(img);
			child.instance.scale=MathUtil.getSizeScale(img.width,img.height,Area.WIDTH,Area.HEIGHT,false);
			child.instance.moveTo((Area.WIDTH-child.getWidth())*0.5,(Area.HEIGHT-child.getHeight())*0.5);
			return;
		}
		
		child=Factory.c("do");
		child.setInstance(img);
		child.scale=MathUtil.getSizeScale(img.width,img.height,Area.WIDTH,Area.HEIGHT,false);
		child.moveTo((Area.WIDTH-child.getWidth())*0.5,(Area.HEIGHT-child.getHeight())*0.5);
		
		img=new UIBase();
		img.instance=child;
		img.mask=new Rectangle(0,0,Area.WIDTH,Area.HEIGHT);
	}
	
	this.background.removeAllChildren(true);
	this.background.addChild(img);
}

Area.prototype.center=function()
{
	this.onDragHandler();
	var b=(Number(Main.studio.datas.config.display_bar_top)==1);
	var w=window.innerWidth,h=window.innerHeight-Number(Main.studio.datas.config.item_height),bool=(w>850);
	this.editor.instance.scale=MathUtil.getSizeScale(Area.WIDTH,Area.HEIGHT,bool ? w : w-260,h,true)*Area.SCALE;
	this.editor.updateSizeInArea(bool ? w : w-260,h);
	this.editor.x=bool ? (w-this.editor._mask_width)*0.5 : 260+(w-260-this.editor._mask_width)*0.5;
	this.editor.y=b ? Number(Main.studio.datas.config.item_height) : 0;
	this.relative.scaleX=this.relative.scaleY=1/this.editor.instance.scale;
}

Area.prototype.unableTransformer=function(t)
{
	if(this.transformer.target) this.dispatchEvent(new Event(Area.CANCEL_SELECTED));
	this.transformer.target=null;
}

Area.prototype.onDragHandler=function(e)
{
	this.unableTransformer();
	Main.studio.removeItemEnable(this.transformer);
}

Area.prototype.onScaleHandler=function(e)
{
	this.scaleShow(e.delta*0.1);
}

Area.prototype.scaleShow=function(num)
{
	var old_scale=Area.SCALE;
	Area.SCALE=MathUtil.clamp(Area.SCALE+num,Area.MIN_SCALE,Area.MAX_SCALE);
	
	if(old_scale!=Area.SCALE) {
		this.tf.text=MathUtil.int(Area.SCALE*100)+"%";
		this.center();
	}
}
