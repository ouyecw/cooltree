
DrawUtil={};

DrawUtil.rect=function(rect,target,color,alpha)
{
	var bool = (target==undefined);
	var temp;
	
	if(!bool){
		if(!(target instanceof DisplayObject) && !(target instanceof Graphics)) return;
		
		if(target instanceof DisplayObject) {
			temp=target;
			target=target.graphics;
		}
	}

	target = target || new Graphics();
	color  = color || "#000000";
	alpha  = alpha || 1;
	
	target.clear();
	target.lineStyle(1,color,alpha);
	target.beginFill(color,alpha);
	target.drawRect(rect.hasOwnProperty("x") ? rect.x : 0,rect.hasOwnProperty("y") ? rect.y : 0,rect.width,rect.height);
	target.endFill();
	
	if(!bool) return temp || target;
	return CanvasUtil.toImage(target.canvas);
}

DrawUtil.roundRect=function(rect,radius,target,color,alpha)
{
	var bool = (target==undefined);
	var temp;
	
	if(!bool){
		if(!(target instanceof DisplayObject) && !(target instanceof Graphics)) return;
		
		if(target instanceof DisplayObject) {
			temp=target;
			target=target.graphics;
		}
	}

	target = target || new Graphics();
	color  = color || "#000000";
	alpha  = alpha || 1;
	
	target.clear();
	target.lineStyle(1,color,alpha);
	target.beginFill(color,alpha);
	target.drawRoundRect(rect.hasOwnProperty("x") ? rect.x : 0,rect.hasOwnProperty("y") ? rect.y : 0,rect.width,rect.height,radius);
	target.endFill();
	
	if(!bool) return temp || target;
	return CanvasUtil.toImage(target.canvas);
}

DrawUtil.circle=function(point,radius,target,color,alpha)
{
	var bool = (target==undefined);
	var temp;
	
	if(!bool){
		if(!(target instanceof DisplayObject) && !(target instanceof Graphics)) return;
		
		if(target instanceof DisplayObject) {
			temp=target;
			target=target.graphics;
		}
	}

	target = target || new Graphics();
	color  = color || "#000000";
	alpha  = alpha || 1;
	
	target.clear();
	target.lineStyle(1,color,alpha);
	target.beginFill(color,alpha);
	target.drawCircle(point.hasOwnProperty("x") ? point.x : 0,point.hasOwnProperty("y") ? point.y : 0,radius);
	target.endFill();
	
	if(!bool) return temp || target;
	return CanvasUtil.toImage(target.canvas);
}
