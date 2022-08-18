
function TouchScale()
{
	this.limit_rect=this.limit_scale=this._target_scaleX =this._target_scaleY =this._target_angle=this._target_rotation=this._target_distance=this._center=this._point1=this._point2=this._double_finger=this._canvas=this._target=null;
	DisplayObjectContainer.call(this);
	this.wheel=this.rotate=this.mouseEnabled=true;
}

Global.inherit(TouchScale, DisplayObjectContainer);

Object.defineProperty(TouchScale.prototype,"target",{
	get: function (){
		return this._target;
	},
    set: function (value) {
        this._target=value;
        
        if(this._target && (this._target instanceof DisplayBase)) this._init_transformer();
        else this._clear_transformer();
    },
    enumerable: true,
    configurable: true
});

TouchScale.prototype._init_transformer=function()
{
	this._clear_transformer();
	
	if(this._canvas==undefined) this._canvas=Factory.c("bs");
	this._canvas.setup("#FFFFFF",this._target.width,this._target.height,0,0,0,0);
	
	if(!this.contains(this._canvas)) this.addChild(this._canvas);
	this._canvas.mouseEnabled=true;
	this._canvas.breakTouch=true;
	
	this._canvas.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._drag_mouse_down,this),this.name);
	this._canvas.matrix=this._target.matrix;

    if(this.wheel) this._canvas.addEventListener(StageEvent.MOUSE_WHEEL, Global.delegate(this._mouse_wheel_handle,this),this.name);
}

TouchScale.prototype._mouse_wheel_handle=function(e)
{
	var sca=this._canvas.scaleX+e.delta*0.1;
	var dot=this._canvas.globalToLocal(e.mouseX,e.mouseY);
	if(this.limit_scale) sca=MathUtil.clamp(sca,this.limit_scale.min,this.limit_scale.max);

	this._canvas.scale=sca;
	dot=this._canvas.localToGlobal(dot);
	
	var poi=new Point(MathUtil.format(this._canvas.x+e.mouseX-dot.x),MathUtil.format(this._canvas.y+e.mouseY-dot.y));
	if(this.limit_rect) poi = Rectangle.innerPoint(this._count_limit_area(),poi);

	this._canvas.moveTo(poi);
	DisplayUtil.copyTransform(this._canvas,this._target);
}

TouchScale.prototype.sync=function()
{
	if(this._canvas && this._target){
		DisplayUtil.copyTransform(this._target,this._canvas);
	}
}

TouchScale.prototype._drag_mouse_down=function(e)
{
	this._double_finger=(e.length==2);
	
	if(this._double_finger){
		this._point1=e.touchs[0];
		this._point2=e.touchs[1];
		
		this._target_scaleX = this._canvas.scaleX;
		this._target_scaleY = this._canvas.scaleY;
		
		this._target_rotation=this._canvas.rotation;
		this._target_angle=MathUtil.getAngle(this._point1.mouseX,this._point1.mouseY,this._point2.mouseX,this._point2.mouseY);
		
		this._center=new Point((this._point1.mouseX+this._point2.mouseX)*0.5,(this._point1.mouseY+this._point2.mouseY)*0.5);
	    this._center=this._canvas.globalToLocal(this._center);
	    
	    this._target_distance=Math.sqrt((this._point1.mouseX-this._point2.mouseX)*(this._point1.mouseX-this._point2.mouseX)+(this._point1.mouseY-this._point2.mouseY)*(this._point1.mouseY-this._point2.mouseY));
	}
	else {
		(this.stage ? this.stage : Stage.current).startDrag(this._canvas,this.limit_rect ? this._count_limit_area() : null);
		this._point1=this._point2=null;
	}

	(this.stage ? this.stage : Stage.current).addEventListener(StageEvent.MOUSE_UP, Global.delegate(this._drag_mouse_up,this),this.name);
	(this.stage ? this.stage : Stage.current).addEventListener(StageEvent.MOUSE_MOVE, Global.delegate(this._drag_mouse_move,this),this.name);
}

TouchScale.prototype._drag_mouse_move=function(e)
{
	if(!this._double_finger) this._target.moveTo(this._target.parent.globalToLocal(this._canvas.localToGlobal(0,0)));
	else if(e.length==2){
		if((this._point1.id!=e.touchs[0].id && this._point2.id!=e.touchs[1].id) && (this._point1.id!=e.touchs[1].id && this._point2.id!=e.touchs[0].id)) return;
		
		if(this._point1.id!=e.touchs[0].id){
			this._point1=e.touchs[1];
			this._point2=e.touchs[0];
		}else{
			this._point1=e.touchs[0];
			this._point2=e.touchs[1];
		}
		
		if(this.rotate){
			var rad = MathUtil.getAngle(this._point1.mouseX,this._point1.mouseY,this._point2.mouseX,this._point2.mouseY);
			this._canvas.rotation=MathUtil.format(this._target_rotation+MathUtil.getDegreesFromRadians(rad-this._target_angle));
		}
		
		var offX,offY,dis,cen,nce,poi;
		dis= Math.sqrt((this._point1.mouseX-this._point2.mouseX)*(this._point1.mouseX-this._point2.mouseX)+(this._point1.mouseY-this._point2.mouseY)*(this._point1.mouseY-this._point2.mouseY));
		offX=offY= dis/this._target_distance;
		
		offX=MathUtil.format(this._target_scaleX*offX);
		offY=MathUtil.format(this._target_scaleY*offY);
		
		if(this.limit_scale){
			offX=MathUtil.clamp(offX,this.limit_scale.min,this.limit_scale.max);
			offY=MathUtil.clamp(offY,this.limit_scale.min,this.limit_scale.max);
		}
		
		this._canvas.scaleX=offX;
		this._canvas.scaleY=offY;
		
		cen = this._canvas.localToGlobal(this._center);
		nce = new Point((this._point1.mouseX+this._point2.mouseX)*0.5,(this._point1.mouseY+this._point2.mouseY)*0.5);
		poi = new Point(MathUtil.format(this._canvas.x+nce.x-cen.x),MathUtil.format(this._canvas.y+nce.y-cen.y));
		
		if(this.limit_rect){
			poi = Rectangle.innerPoint(this._count_limit_area(),poi);
		}
		
		this._canvas.moveTo(poi);
		DisplayUtil.copyTransform(this._canvas,this._target);
	}
}

TouchScale.prototype._count_limit_area=function()
{
	var ch=this._canvas.getHeight();
	var cw=this._canvas.getWidth();
	var r=new Rectangle();
	
	var bool_w=(cw>this.limit_rect.width);
	var bool_h=(cw>this.limit_rect.height);
	
	r.x = bool_w ? (this.limit_rect.right-cw) : this.limit_rect.x;
	r.y = bool_h ? (this.limit_rect.bottom-ch) : this.limit_rect.y;
	
	r.width=Math.abs(this.limit_rect.width-cw);
	r.height=Math.abs(this.limit_rect.height-ch);
	
	return r;
}

TouchScale.prototype._drag_mouse_up=function(e)
{
	if(!this._double_finger) (this.stage ? this.stage : Stage.current).stopDrag();
	(this.stage ? this.stage : Stage.current).removeEventListener(StageEvent.MOUSE_UP, null,this.name);
	(this.stage ? this.stage : Stage.current).removeEventListener(StageEvent.MOUSE_MOVE, null,this.name);
	this._target_scaleX = this._target_scaleY = this._target_distance=this._target_rotation=this._target_angle=this._center=this._point1=this._point2=null;
}

TouchScale.prototype._clear_transformer=function()
{
	if(this._canvas) {
		if( this.contains(this._canvas))this._canvas.removeFromParent(false);
	 	this._canvas.removeEventListener(StageEvent.MOUSE_DOWN,null,this.name);
	 	this._canvas.removeEventListener(StageEvent.MOUSE_WHEEL,null,this.name);
	}
	
	this._drag_mouse_up(null);
}

TouchScale.prototype.dispose=function()
{
	this.target=null;
	TouchScale.superClass.dispose.call(this);
	delete this.limit_rect,this.limit_scale,this.wheel,this._canvas,this._target,this.rotate,this._target_scaleX,this._target_scaleY,this._target_distance,this._target_rotation,this._target_angle,this._center,this._point1,this._point2;
}