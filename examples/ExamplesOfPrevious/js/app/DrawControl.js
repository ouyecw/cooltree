
DrawControl={};
DrawControl.lock=false;
DrawControl.type=0;
DrawControl.mouse=null;
DrawControl.shape=null;
DrawControl.name=null;

DrawControl.begin=function(type)
{
	if(DrawControl.lock || type==undefined) return;
	DrawControl.lock=true;
	
	Main.studio.enbale();
	DrawControl.type=type;
	Stage.current.cursor="crosshair";
	Stage.current.addEventListener(StageEvent.MOUSE_DOWN,DrawControl.start_draw);
}

DrawControl.start_draw=function(e)
{
	var color=Main.studio.datas.config.default_shape_color;
	DrawControl.mouse=Main.studio.container.container.globalToLocal(e.mouseX,e.mouseY);
	DrawControl.shape=Factory.c("bs",[color,1,1,0,Number(Main.studio.datas.config.default_shape_thickness),"#000000",StringUtil.isEmpty(color) ? 0 : 1]);
	DrawControl.name=Main.studio.container.addItem(DrawControl.shape,true).name;
	
	DrawControl.shape.parent.moveTo(DrawControl.mouse);
	if(!Global.useCanvas) DrawControl.shape.hide_over=false;
	DrawControl.shape.parent.type=(DrawControl.type==1 ? 2 :3);
	
	Stage.current.addEventListener(StageEvent.MOUSE_MOVE,DrawControl.drawing);
	Stage.current.addEventListener(StageEvent.MOUSE_UP,DrawControl.end_draw);
}

DrawControl.drawing=function(e)
{
	var pos=Main.studio.container.container.globalToLocal(e.mouseX,e.mouseY);
	var w=Math.max(1,pos.x-DrawControl.mouse.x);
	var h=Math.max(1,pos.y-DrawControl.mouse.y);
	
	if(DrawControl.type==2) {
		var r=Math.max(w,h);
		DrawControl.shape.setSize(r,r);
		DrawControl.shape.redius=r*0.5;
	}else{
		DrawControl.shape.setSize(w,h);
	}
	
	DrawControl.shape.parent._updateSize();
	Main.studio.dispatchEvent(new Event(EditItem.UPDATE_SIZE));
}

DrawControl.end_draw=function(e)
{
	Stage.current.removeEventListener(StageEvent.MOUSE_DOWN,DrawControl.start_draw);
	Stage.current.removeEventListener(StageEvent.MOUSE_MOVE,DrawControl.drawing);
	Stage.current.removeEventListener(StageEvent.MOUSE_UP,DrawControl.end_draw);
	Stage.current.cursor="";
	
	Main.studio.enbale(true);
	if(DrawControl.shape.width<5 && DrawControl.shape.height<5 && DrawControl.shape.parent){
		ObjectPool.remove(DrawControl.shape.parent);
		Main.studio.container.unableTransformer();
	}else{
		Main.studio.dispatchEvent(new Event(EditItem.UPDATE_SIZE));
		Main.studio.container.dispatchEvent(new Event(Area.SELECT_ITEM,DrawControl.shape.parent));
	    Main.studio.commands.push(Command.create(Command.CREATE,DrawControl.name));
	}
	
	DrawControl.shape.__checkDisplayUpdate();
	
	DrawControl.type=0;
	DrawControl.name=null;
	DrawControl.lock=false;
	DrawControl.mouse=DrawControl.shape=null;
}
