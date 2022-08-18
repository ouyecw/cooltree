/**
===================================================================
Stage Class
===================================================================
**/
function Stage()
{
	DisplayObjectContainer.call(this);

	this.usePixelTrace = false;
	this.traceMouseTarget = true;
	this.timer=this.dragTarget = this.mouseTarget = this._mouseDownTarget =null;
	this.stageX=this.stageY=0;
	this.mouseX=this.mouseY=0;
	this.isFullScreen=false;
	this.auto_clear=true;
	this.last_fresh=true;
	this.auto_fresh=true;
	this.block_ratio=0.05;
	
	this._dragMouseX=this._dragMouseY=0;
	this.stageWidth=this.stageHeight=0;
	this.name="stage"+Stage.COUNT++;
	this._parent_node=null;
	this._activate=false;
	this._isTap=false;
	this._graphics=null;
	this._block=null;
	this._area=null;
	this._layer=-1;
	this.stage=this;
	
	this.context;
	this.canvas;
	this.div;

	Stage.current=this;
}

Global.inherit(Stage,DisplayObjectContainer);

/**
 * 设置全局画布
 * @param {Number} w
 * @param {Number} h
 * @param {HTMLCanvasElement} c embed html canvas element
 * @param {Boolean} e 是否可编辑
 */
Stage.prototype.initCanvas=function(w,h,c,e)
{
	var err=false;
	this.canvas=c;
	
	if(c==undefined){ 
		try{
			this.canvas=document.createElement("canvas");
		}
		catch(error){
			err=true;
			this.canvas={style:{},context:{}};
			trace("[WARN] Stage initCanvas()",error);
		}
		
		this.canvas.width=w;
		this.canvas.height=h;
		
		if(e) this.canvas.contenteditable=this.canvas.draggable=this.canvas.dropzone=true;
		
		this.canvas.offsetLeft=this.canvas.offsetTop=0;
		this.canvas.tabindex=0;
		
		this.canvas.style.left=this.canvas.style.top="0px";
		this.canvas.style.position=Global.position;
		this.canvas.style.zIndex=Global.layer;
		this.canvas.style.padding=0;
		this.canvas.style.margin=0;
		
		if(this.div==undefined){
			this.div=DOMUtil.createDOM("div",{id: "container_"+this.name,style:
			{
				overflow : "hidden",
				position: Global.position,
				height: h + "px",
				width: w + "px",
				padding:"0",
				margin:"0",
				cursor:""
			}});
			document.body.appendChild(this.div);
			this._parentNode=this.div;
		}
		
        if(!err) this.div.appendChild(this.canvas);
	}
	
	this.stageWidth=w;
	this.stageHeight=h;

	this.context=err ? this.canvas.context : this.canvas.getContext("2d");
	this.updatePosition();
	this.enable(true);
	
	if(!err) this._graphics=new Graphics(this.context);
	if(Stage.current!=this) return;
	Global.context=this.context;
	Global.canvas=this.canvas;
	Global.div=this.div;
	Global.height=h;
	Global.width=w;
}

Object.defineProperty(Stage.prototype,"graphics",{
	get: function () {
       return this._graphics;
    },
    enumerable: true,
    configurable: true
});

Stage.prototype.size=function(w,h)
{
	if(w==null || h==null || this.div==null) return;
	
	w=Math.floor(w);
	h=Math.floor(h);
	
	if(this.div){
		this.div.style.height=h + "px";
		this.div.style.width=w + "px";
	}
	
	if(this.canvas){
		this.canvas.width=w;
    	this.canvas.height=h;
	}
	
	if(Global.autoShapeSize){
		this.dispatchEvent(new Event(StageEvent.UPDATE));
	}
	
	this.stageWidth=w;
	this.stageHeight=h;
}

Stage.prototype.enable=function(bool)
{
	this.__message_handler = this.__message_handler ? this.__message_handler : Global.delegate(this._message_handler, this);
	this.__touch_handler = this.__touch_handler ? this.__touch_handler : Global.delegate(this._touchHandler, this);
	this.__mouse_handler = this.__mouse_handler ? this.__mouse_handler : Global.delegate(this._mouseHandler, this);
	this.__key_handler = this.__key_handler ? this.__key_handler : Global.delegate(this._keyHandler, this);
	this.__enter_frame = this.__enter_frame ? this.__enter_frame : Global.delegate(this._enterFrame, this);
	this.timer=this.timer ? this.timer : new Timer();
	
	var body=this.div ? this.div : document;
	
	if (Global.supportTouch)
	{
		if(bool){
			body.addEventListener("touchstart", this.__touch_handler, false);
			body.addEventListener("touchmove", this.__touch_handler, false);
			document.addEventListener("touchend", this.__touch_handler, false);
		}else{
			body.removeEventListener("touchstart", this.__touch_handler);
			body.removeEventListener("touchmove", this.__touch_handler);
			document.removeEventListener("touchend", this.__touch_handler);
		}
	}
	else
	{
		if(bool){
			body.addEventListener(Global.isFirefox ? "DOMMouseScroll" : "mousewheel", this.__mouse_handler, false);
			body.addEventListener("mousedown", this.__mouse_handler, false);
			body.addEventListener("mousemove", this.__mouse_handler, false);
			body.addEventListener("mouseenter", this.__mouse_handler, false);
			body.addEventListener("mouseleave", this.__mouse_handler, false);
			document.addEventListener("mouseup", this.__mouse_handler, false);
		}else{
			body.removeEventListener(Global.isFirefox ? "DOMMouseScroll" : "mousewheel", this.__mouse_handler);
			body.removeEventListener("mousedown", this.__mouse_handler);
			body.removeEventListener("mousemove", this.__mouse_handler);
			body.removeEventListener("mouseenter", this.__mouse_handler);
			body.removeEventListener("mouseleave", this.__mouse_handler);
			document.removeEventListener("mouseup", this.__mouse_handler);
		}
	}
	
	if(bool){
		window.addEventListener('message', this.__message_handler, false);
		document.addEventListener("keydown", this.__key_handler, false);
		document.addEventListener("keyup", this.__key_handler, false);
		
		this.timer.addEventListener(Timer.TIME,this.__enter_frame, false);
   		this.timer.start();
   		
	}else{
		window.removeEventListener('message', this.__message_handler, false);
		document.removeEventListener("keydown", this.__key_handler);
	    document.removeEventListener("keyup", this.__key_handler);
	    
	    this.timer.removeEventListener(Timer.TIME,this.__enter_frame);
    	this.timer.stop();
	}
}

Stage.prototype._message_handler=function(e)
{
	this.dispatchEvent(new Event(StageEvent.MESSAGE,e && e.data ? e.data : e));
}

Stage.prototype.resize = function(w,h) 
{
	this.dispatchEvent(new Event(StageEvent.RESIZE,{width:w,height:h}));
}

Stage.prototype._enterFrame = function(e) 
{
	if(this.auto_clear && (DisplayObjectContainer._num_canvas_target>0 || this.last_fresh)) {
		if(this.auto_fresh) this.clear();
		
		if(!DisplayObjectContainer._num_canvas_target>0 && this.last_fresh) {
			this.last_fresh=false;
			
			if(this.canvas) {
				var temp=this._parent_node;
				this._parent_node=this.canvas.parentNode;
				if(this._parent_node) this._parent_node.removeChild(this.canvas);
				else this._parent_node=temp ? temp : this.div;
			}
		}
	}

	if(this.numChildren>0) this.render();
	this.dispatchEvent(new Event(StageEvent.ENTER_FRAME));
}

Stage.prototype.render = function()
{
	if(!this.last_fresh && DisplayObjectContainer._num_canvas_target>0) {
		this.last_fresh=true;
		
		if(this.canvas && this._parent_node) {
			this._parent_node.appendChild(this.canvas);
		}
	}

	DOMDisplay._depth_count=0;
	
	if(this.auto_fresh) {
		this.auto_fresh=false;
		Stage.superClass.render.call(this);
	}
//	else trace("[PAUSE]");
}

Stage.prototype._dragHandler=function ()
{	
	var posX = this._dragMouseX;
	var posY = this._dragMouseY;
	
	var pos = this.dragTarget.origin;
	var pos2 = this.dragTarget.localToGlobal(pos);
	pos = this.dragTarget.localToGlobal(posX,posY);
	
	posX = Math.round(this.mouseX - (pos.x-pos2.x));
	posY = Math.round(this.mouseY - (pos.y-pos2.y));
	
	var point;
	
	if(this._block && !this._block.contains(posX,posY)){
		point=this.dragTarget.localToGlobal(0,0);
		
		posX = point.x+(posX-point.x)*this.block_ratio;
		posY = point.y+(posY-point.y)*this.block_ratio;
	}
	
	if(this._area){
		point=new Point(posX,posY);
		point=Rectangle.innerPoint(this._area,point);
		
		posX=point.x;
		posY=point.y;
	}
	
	pos = this.dragTarget.parent.globalToLocal(posX,posY);
	this.dragTarget.x = pos.x;
	this.dragTarget.y = pos.y;
	
	if(!this._isTap) this.dragTarget.dispatchEvent(new Event(StageEvent.DRAG_MOVE));
}

Stage.prototype.clear = function()
{
	if(this.context) this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Stage.prototype._touchHandler=function(e)
{	
	var a = e.touches && e.touches.length>0 ? e.touches[0] : (e.changedTouches && e.changedTouches.length>0 ? e.changedTouches[0] : null);
	
	if (a) {
		this.mouseX = (a.pageX || a.clientX) - this.stageX;//this.isFullScreen ? a.screenX : (a.pageX || a.clientX) - this.stageX;
		this.mouseY = (a.pageY || a.clientY) - this.stageY;//this.isFullScreen ? a.screenY : (a.pageY || a.clientY) - this.stageY;
	}
	
	if(this.traceMouseTarget ) this._getMouseTarget(e);
	
	a = {
		id    : (a ? a.identifier : 0),
		target: this.mouseTarget || this,
		mouseX: this.mouseX,
		mouseY: this.mouseY,
        button: 0
	};
	
	a.type=Stage.translationType(e.type);
	a = Global.copy(e, StageEvent, a);
	a.touchs=[];
	
	if (this.mouseTarget && this.mouseTarget.onMouseEvent && (this.mouseTarget.onMouseEvent(a), a.type == StageEvent.MOUSE_UP)) 
		this.mouseTarget.onMouseEvent(Global.copy(e, StageEvent, {type: StageEvent.MOUSE_OUT}));
	
	var i,t,type,mx,my,l=e.touches.length;
		
    for (i=0;i<l;i++){
    	t=e.touches[i];
    	if(t.target==null) continue;
    	
    	type=Stage.translationType(t.type);
    	if(type!=StageEvent.MOUSE_UP && !DOMUtil.contains(this.div,t.target)) continue;

    	mx=(t.pageX || t.clientX) - this.stageX;//this.isFullScreen ? t.screenX : (t.pageX || t.clientX) - this.stageX;
    	my=(t.pageY || t.clientY) - this.stageY;//this.isFullScreen ? t.screenY : (t.pageY || t.clientY) - this.stageY;
    	a.touchs.push({mouseX:mx,mouseY:my,type:type,id:t.identifier});
    }
    
	a.length=a.touchs ? a.touchs.length : 0;
	if (a.type==StageEvent.MOUSE_MOVE && this.dragTarget) this._dragHandler();
	
	var bool=a.target.breakTouch;
	var copy=(a.target!=this) ?  Global.copy(a,StageEvent) : null;
    var bt=this._checkMouseClick(a);
	a.target.dispatchEvent(a);
	
	if(copy) this.dispatchEvent(copy);
	if(!(Global.breakTouch || bool || bt || this.breakTouch) || a.type==StageEvent.MOUSE_UP) return;
	
	e.preventDefault();
	e.stopPropagation();
}

Stage.prototype._mouseHandler=function(e)
{
	if(e.target==null || e.type=="mouseleave" || (!DOMUtil.contains(this.div,e.target) && e.type!="mouseup")) {
		this._activate=false;
		this.dispatchEvent(new StageEvent(StageEvent.MOUSE_OUT,this._activate));
		return;
	}
	
	var mx = e.pageX - this.stageX; //this.isFullScreen ? e.screenX : e.pageX - this.stageX;
	var my = e.pageY - this.stageY; //this.isFullScreen ? e.screenY : e.pageY - this.stageY;
	
	var a = Global.copy(e,StageEvent);
	var b = (mx==this.mouseX && my==this.mouseY);
	
	if(e.type=="mouseenter"){
		a.type=StageEvent.MOUSE_OVER;
		this.updatePosition();
		
		this._activate=true;
		this.dispatchEvent(new StageEvent(StageEvent.MOUSE_OVER,this._activate));
	}else if(!this.isFullScreen && this._activate && (mx<0 || my<0 || mx>this.stageWidth || my>this.stageHeight)){
		this._activate=false;
		this.dispatchEvent(new StageEvent(StageEvent.MOUSE_OUT,this._activate));
	}else if(!this._activate && e.type!="mouseup"){
		this._activate=true;
		this.dispatchEvent(new StageEvent(StageEvent.MOUSE_OVER,this._activate));
	}
	
	if(b && e.type==StageEvent.MOUSE_MOVE){
		a.type=StageEvent.MOUSE_OVER;
	}
	
	if(e.type=="DOMMouseScroll"){
		a.type=StageEvent.MOUSE_WHEEL;
	}
	
	this.mouseX = mx;
	this.mouseY = my;
	
	if(this.traceMouseTarget) this._getMouseTarget(e);
	
	a.target = this.mouseTarget || this;
	a.mouseX = this.mouseX;
	a.mouseY = this.mouseY;
	a.delta = e.wheelDelta ? (e.wheelDelta / 120) : (- e.detail / 3); 
	
	if (this.mouseTarget && this.mouseTarget.onMouseEvent) this.mouseTarget.onMouseEvent(a);
	if (a.type==StageEvent.MOUSE_MOVE && this.dragTarget) this._dragHandler();
	this.setCursor(this.mouseTarget);
	
	var bool=a.target.breakTouch;
	var copy=(a.target!=this) ?  Global.copy(a,StageEvent) : null;
	var bt=this._checkMouseClick(a,b);
	a.target.dispatchEvent(a);
	
	if(copy) this.dispatchEvent(copy);
	if(!(Global.breakTouch || bool || bt || this.breakTouch) || a.type==StageEvent.MOUSE_UP) return;
	
	e.preventDefault();
	e.stopPropagation();
}

Stage.prototype._checkMouseClick =function (a,b)
{
	if(a.type==StageEvent.MOUSE_DOWN && this.mouseTarget){
		this._mouseDownTarget = this.mouseTarget;
		this._isTap=true;
	}
	
	if(a.type==StageEvent.MOUSE_UP){
		if(this._mouseDownTarget!=null && a.target!=this && a.target==this._mouseDownTarget){
			a.target.dispatchEvent(this.__copyStageEvent(a,this._mouseDownTarget,StageEvent.MOUSE_CLICK));
			
		    if(this._isTap) {
		    	var evt=this.__copyStageEvent(a,this._mouseDownTarget,StageEvent.MOUSE_TAP);
		    	this.__transmitEvent(evt);
		    	a.target.dispatchEvent(evt);
		    }
		}
		
		this._mouseDownTarget = null;
		this._isTap=false;
	}
	
	if(a.type==StageEvent.MOUSE_MOVE && !b) {
		this._isTap=false;
		return false;
	}
	
	if(a.target==this) return false;
	return this.__transmitEvent(a);
}

Stage.prototype.__transmitEvent = function(a)
{
	if(a==undefined || a.target==undefined) return false;
	
//	var bt=false;
	var bool,obj=a.target;
	
	for(obj=obj.parent; obj!=null && obj!=this; obj=obj.parent)
	{
		if(obj.breakTouch) return true;//bt=true;
		if(!obj.mouseEnabled) continue;
		
		if(a.type==StageEvent.MOUSE_OVER || a.type==StageEvent.MOUSE_OUT){
			bool=obj.hitTestPoint(this.mouseX,this.mouseY);
			if((a.type==StageEvent.MOUSE_OVER && bool) || (a.type==StageEvent.MOUSE_OUT && !bool)){
				obj.dispatchEvent(this.__copyStageEvent(a,obj));
			}
		}
		else obj.dispatchEvent(this.__copyStageEvent(a,obj));
	}
	
	return false;//bt;
}

Stage.prototype.__copyStageEvent =function(a,o,t)
{
	var e = Global.copy(a,StageEvent);
	e.target = o;
	e.type= t ? t : e.type;
	return e;
}

Stage.prototype._getMouseTarget = function(e) 
{
	var s,a = this.getObjectUnderPoint(this.mouseX, this.mouseY, this.usePixelTrace,false);
	var	c = this.mouseTarget;
		
	this.mouseTarget = a;
    
	if (c && c != a) 
	{
		s = new StageEvent(StageEvent.MOUSE_OUT);
		s.target = c;
		s.mouseX = this.mouseX;
		s.mouseY = this.mouseY;
		
		this.__transmitEvent(s);
		if(c.onMouseEvent)  c.onMouseEvent(s);
		if(c.dispatchEvent) c.dispatchEvent(s);
		
		if(this._mouseDownTarget==c) 
			this._mouseDownTarget=null;
	}
	
	if(a && c != a){
		s = new StageEvent(StageEvent.MOUSE_OVER);
		s.target = a;
		s.mouseX = this.mouseX;
		s.mouseY = this.mouseY;
		
		this.__transmitEvent(s);
		if(a.onMouseEvent)  a.onMouseEvent(s);
		if(a.dispatchEvent) a.dispatchEvent(s);
	}
}

/**
 * @param {DisplayBase} b target
 * @param {Rectangle} r Rectangle of area
 * @param {Boolean} l useLayer
 * @param {Rectangle} f area allow free to move
 */
Stage.prototype.startDrag = function(b,r,l,f) 
{
	if(b==undefined || b.parent==undefined) return;
	if(this.dragTarget) this.stopDrag();
	
	this.dragTarget = b;
	
	if(l){
		this._layer=b.getIndex();
		this.dragTarget.toTop();
	}
	else this._layer=-1;
	
	this._area=(r && r instanceof Rectangle) ? r : null;
	this._block=(f && f instanceof Rectangle) ? f : null;
	var p = this.dragTarget.globalToLocal(this.mouseX, this.mouseY);

	this._dragMouseX = p.x;
	this._dragMouseY = p.y;
	
}

Stage.prototype.stopDrag = function() 
{
	if(this.dragTarget==null || this.dragTarget==undefined) return;
	
	if(this._layer>=0 && this.dragTarget && this.dragTarget.parent){
		this.dragTarget.parent.addChildAt(this.dragTarget,this._layer);
	}
	
	this._dragMouseX = this._dragMouseY = 0;
	this.dragTarget = null;
	this._block = null;
	this._area = null;
	this._layer=-1;
}

Stage.prototype._keyHandler=function(e)
{
	this.dispatchEvent(new Event(e.type,(e||window.event).keyCode,e,this.mouseTarget));
}

Stage.prototype.setCursor = function(target) 
{
	this.div.style.cursor = (this.cursor==null || this.cursor=="") ? (target ? (target.cursor==null ? "" : target.cursor) : "") : this.cursor;
}

Stage.prototype.updatePosition = function()
{
	if((this.div==null || !DOMUtil.contains(document,this.div)) && (this.canvas==null || !DOMUtil.contains(document,this.canvas))) return;
	
	var offset = DOMUtil.getElementOffset(this.div || this.canvas);
//	var mode=(document.compatMode == "BackCompat");
	
//	var scroll_left=mode ? document.body.scrollLeft : document.documentElement.scrollLeft; 
//	var scroll_top=mode ? document.body.scrollTop : document.documentElement.scrollTop; 
	
	this.stageX = offset.left;//-scroll_left;
	this.stageY = offset.top;//-scroll_top;
};

Stage.prototype.getStageWidth = function() 
{
	return this.canvas.width;
}

Stage.prototype.getStageHeight = function() 
{
	return this.canvas.height;
}

Stage.prototype.toString=function()
{
	return "Stage";
}

Stage.prototype.dispose=function()
{
	this.enable(false);
	if( this.timer) this.timer.dispose();
	if(this._graphics) this._graphics.dispose();
	if(Stage.current==this) Stage.current=null;
	
	this.stage=this.context=this.canvas=this.div=null;
	Stage.superClass.dispose.call(this);
	
	delete this._graphics,this.traceMouseTarget,this._parent_node,this.dragTarget,this.mouseTarget,this._mouseDownTarget,this.timer;
	delete this.isFullScreen,this.stageX,this.stageY,this.mouseX,this.mouseY,this._dragMouseX,this._dragMouseY;
	delete this.__message_handler,this.__touch_handler,this.__mouse_handler,this.__key_handler,this.__enter_frame;
	delete this._activate,this.block_ratio,this._block,this.context,this.canvas,this.div,this.auto_clear,this.last_fresh,this.auto_fresh;
}

/*********************************
 * Static Function
 *********************************
 */

Stage.COUNT=0;
Stage.current=null;

Stage.translationType=function(t)
{
	switch (t) {
		case "touchstart":
			return StageEvent.MOUSE_DOWN;
			break;
		case "touchmove":
			return StageEvent.MOUSE_MOVE;
			break;
		case "touchend":
			return StageEvent.MOUSE_UP;
	}
	
	return "";
}