/**
===================================================================
Stage Class
===================================================================
**/
import DisplayObjectContainer from './DisplayObjectContainer.js'
import StageEvent from '../events/StageEvent.js'
import ObjectPool from '../utils/ObjectPool.js'
import StringUtil from '../utils/StringUtil.js'
import ArrayUtil from '../utils/ArrayUtil.js'
import Rectangle from '../geom/Rectangle.js'
import AppEvent from '../type/AppEvent.js'
import Global from '../core/Global.js'
import Event from '../events/Event.js'
import Graphics from './Graphics.js'
import Point from '../geom/Point.js'

/**
 * @class
 * @module Stage
 * @extends DisplayObjectContainer
 */
export default class Stage extends DisplayObjectContainer
{
	static className="Stage";
	static TAP_OFFSET=10;
	
	constructor()
	{
		super();

		/**
		 * this.background={alpha:0.1,color:"#FFFFFF"}
		 */
		this.background=null;

		this.usePixelTrace = false;
		this.breakTouch=false;
		this._enable=true;
		this.isTap=true;

		this._run_time=0;
		this._graphics=null;
		this.touches=[];

		/**
		 * 精准触摸canvas对象
		 */
		this.aimAtStage=false;

		/**
		 * 高清模式
		 */
		this.highDefinition=false;

		this.auto_fresh=true;
		this.stage=this;
		
		this.pixelRatio=1;
		this.context=null;
		this.canvas=null;

		/**
		 * 以下是触摸相关
		 */
		this.delta=0;
		this.mouseX=0;
		this.mouseY=0;

		this.startX=0;
		this.startY=0;

		this.stageID;
		this.stageX=0;
		this.stageY=0;

		this.mouseTarget=null;
		this.mouseDownTarget=null;

		/**
		 * 以下是拖拽相关
		 */
		this._area=null;
		this._block=null;
		this.dragTarget =null;

		this._layer=-1;
		this._dragMouseX = 0;
		this._dragMouseY = 0;

		//减速
		this.block_ratio=0.05;
	}

	get graphics()
	{
		return this.context ? this._graphics||=new Graphics(this.context) : null;
	}

	set enable(bool)
	{
		if(this._enable==bool) return;
		this._enable=bool;

		if(!bool && this.canvas && this.touches && this.touches.length>0){
			this.touches=[];
		}

		if(!bool || !this.canvas) return;
		this.auto_fresh=true;
		this.canvas.requestAnimationFrame(this.enterFrame.bind(this));
	}

	get enable()
	{
		return this._enable;
	}
	
	/**
	 * 设置全局画布
	 * @param {String} id 
	 */
	initCanvas(id)
	{
		if(StringUtil.isEmpty(id)) return null;
		this.stageID=id;

		wx.createSelectorQuery()
			.select(`#${id}`)
			.fields({
				node: true,
				size: true,
			})
			.exec(this.init.bind(this));
		return this;
	}

	init(res)
	{
		const temp=res[0];
		if(!temp) return;
		Global.stage=this;

		this.canvas=temp.node;
		this.context=this.canvas.getContext('2d');
		
		this.pixelRatio=Global.ratio;
		this.size(temp.width,temp.height);
		console.log("[STAGE STARTUP] W:"+temp.width,"H:"+temp.height);
		
		if(this._enable) this.canvas.requestAnimationFrame(this.enterFrame.bind(this));
		Global.dispatcher.emit(AppEvent.STARTUP);
	}
	
	size(w,h)
	{
		if(w==null || h==null) return;
		
		w=Math.ceil(w);
		h=Math.ceil(h);
		
		if(this.canvas){
			this.canvas.width=w* this.pixelRatio;
	    	this.canvas.height=h* this.pixelRatio;

			if(!this.highDefinition)
				this.context.scale(this.pixelRatio, this.pixelRatio);
		}
		
		this.stageWidth =w * (this.highDefinition ? this.pixelRatio : 1);
		this.stageHeight=h * (this.highDefinition ? this.pixelRatio : 1);
		
		this.emit(new Event(StageEvent.UPDATE));
	}

	onTouchStart(e)
	{
		if(!this._enable || (this.aimAtStage && (!e.target || e.target.id!=this.stageID))) return;
		const touches = e.touches;
		let bool=false;

        for (const touch of touches) {
            if (this.touches.length < 2) {
				const x = ((touch.pageX || touch.clientX) - this.stageX) * (this.highDefinition ? this.pixelRatio : 1);
				const y = ((touch.pageY || touch.clientY) - this.stageY) * (this.highDefinition ? this.pixelRatio : 1);

				if(this.touches.length==0){
					this.mouseX=this.startX=x;
					this.startY=this.mouseY=y;
					bool=true;
				}	

                this.touches.push({
                    id: touch.identifier,x,y
                });
            }
        }

		if(!bool) return;
		this.mouseTarget=this.getObjectUnderPoint(this.mouseX, this.mouseY, this.usePixelTrace,false);
		this.mouseDownTarget=this.mouseTarget;

		this.isTap=true;
		this._dipatch_event(StageEvent.MOUSE_DOWN);
	}

	onTouchMove(e)
	{
		if(!this._enable || (this.aimAtStage && (!e.target || e.target.id!=this.stageID))) {
			if(this.mouseTarget) this.onTouchEnd({touches:[]});
			return;
		}

		let mouseX,mouseY,index;
		const touches = e.touches;
		let i,l=touches.length,touch;
		for (i=0;i<l;i++) {
			touch=touches[i];
			index=ArrayUtil.indexByProperty(this.touches,"id",touch.identifier);
			if(index<0) continue;
			
			const x = ((touch.pageX || touch.clientX) - this.stageX)* (this.highDefinition ? this.pixelRatio : 1);
			const y = ((touch.pageY || touch.clientY) - this.stageY)* (this.highDefinition ? this.pixelRatio : 1);
			this.touches[index].x=x;
			this.touches[index].y=y;

			if(i==0){
				mouseX=x;
				mouseY=y;
			}
		}

		if((mouseX!=undefined && mouseY!=undefined) && (mouseX!=this.mouseX || mouseY!=this.mouseY)){
			this.mouseX=mouseX;
			this.mouseY=mouseY;

			this.mouseTarget=this.getObjectUnderPoint(this.mouseX, this.mouseY, this.usePixelTrace,false);
			if(this.isTap && this.mouseDownTarget && this.mouseTarget!=this.mouseDownTarget) {
				if(this.mouseDownTarget && this.mouseDownTarget.onMouseEvent){
					this.mouseDownTarget.onMouseEvent(ObjectPool.create(StageEvent).setup(
						StageEvent.MOUSE_OUT,this.mouseTarget,this.mouseX,this.mouseY,0,this.touches
					))
				}
				this.isTap=false;
			}
		}

		if(this.dragTarget) this._dragHandler();
		this._dipatch_event(StageEvent.MOUSE_MOVE);
	}

	onTouchEnd(e)
	{
		if(!this._enable) return;
		let i,l=this.touches.length,touch,bool=false;

		for(i=0;i<l;i++){
			touch=this.touches[i];
			if(ArrayUtil.indexByProperty(e.touches,"identifier",touch.id)>=0) continue;
			if(i==0) bool=true;
			this.touches.splice(i,1);
			l--;
			i--;
		}

		if(!bool) return;
		if(this.mouseDownTarget && this.mouseDownTarget==this.mouseTarget){
			this._dipatch_event(StageEvent.MOUSE_CLICK);
			
			if(this.isTap && Math.hypot(this.mouseX-this.startX,this.mouseY-this.startY)<=Stage.TAP_OFFSET)
				this._dipatch_event(StageEvent.MOUSE_TAP);
		}

		this._dipatch_event(StageEvent.MOUSE_UP);
		this.mouseDownTarget=this.mouseTarget=null;
		this.startX=this.startY=0;
	}

	_dipatch_event(type)
	{
		const event=ObjectPool.create(StageEvent).setup(
			type,this.mouseTarget,this.mouseX,this.mouseY,0,this.touches
		);

		let obj=this.mouseTarget;
		if(this.mouseChildren && this.mouseTarget){
			if(this.mouseTarget.mouseEnabled){
				if(this.mouseTarget.onMouseEvent)  
					this.mouseTarget.onMouseEvent(event);
	
				if(this.mouseTarget.emit)  
					this.mouseTarget.emit(event.clone(this.mouseTarget));
			}

			for(obj=obj.parent; obj!=null && obj!=this; obj=obj.parent)
			{
				if(obj.breakTouch) break;
				if(!obj.mouseEnabled || !obj.emit) continue;
				obj.emit(event.clone(obj));
				if(obj==this) return;
			}
		}

		if(type==StageEvent.MOUSE_TAP || type==StageEvent.MOUSE_CLICK) return;
		this.emit(event);
	}

	/**
	 * @param {DisplayBase} b target
	 * @param {Rectangle} r Rectangle of area
	 * @param {Boolean} l useLayer
	 * @param {Rectangle} f area allow free to move
	 */
	startDrag (b,r,l,f) 
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
		const p = this.dragTarget.globalToLocal(this.mouseX, this.mouseY);
	
		this._dragMouseX = p.x;
		this._dragMouseY = p.y;
	}
	
	stopDrag () 
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

	_dragHandler ()
	{	
		let posX = this._dragMouseX;
		let posY = this._dragMouseY;
		
		let pos = this.dragTarget.origin;
		let pos2 = this.dragTarget.localToGlobal(pos ? pos.x : 0,pos ? pos.y : 0);
		pos = this.dragTarget.localToGlobal(posX,posY);
		
		posX = Math.round(this.mouseX - (pos.x-pos2.x));
		posY = Math.round(this.mouseY - (pos.y-pos2.y));
		
		let point;
		
		if(this._block && !this._block.contains(posX,posY)){
			point=this.dragTarget.localToGlobal(0,0);
			
			posX = point.x+(posX-point.x)*this.block_ratio;
			posY = point.y+(posY-point.y)*this.block_ratio;
			
			ObjectPool.remove(point);
		}
		
		if(this._area){
			point=ObjectPool.create(Point).set(posX,posY);
			point=Rectangle.innerPoint(this._area,point);
			
			posX=point.x;
			posY=point.y;
			ObjectPool.remove(point);
		}
		
		if(pos) ObjectPool.remove(pos);
		pos = this.dragTarget.parent.globalToLocal(posX,posY);
		this.dragTarget.x = pos.x;
		this.dragTarget.y = pos.y;
		
		this.dragTarget.emit(new Event(StageEvent.DRAG_MOVE));
	    if(pos2) ObjectPool.remove(pos2);
	    if(pos) ObjectPool.remove(pos);
	}
	
	enterFrame (e) 
	{
		if(this._run_time>9999999) this._run_time=0;
		this._run_time++;

		if(Global.multiple<2 || this._run_time%Global.multiple==0){
			if(this.auto_fresh) {
				this.clear();
	
				if(this.numChildren>0) {
					this.auto_fresh=false;
					this.render();
				}
			}
	
			this.emit(new Event(StageEvent.ENTER_FRAME));
		}

		if(this._enable) this.canvas.requestAnimationFrame(this.enterFrame.bind(this));
	}
	
	clear ()
	{
		if(!this.context || !this.canvas) return;
		
		if(!this.background) this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
		else{
			this.context.globalAlpha=this.background.alpha;
			this.context.fillStyle=this.background.color;
			
			this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
			this.context.globalAlpha=1;
		}
	}
	
	dispose()
	{
		if(this._graphics) 
			this._graphics.dispose();

		this.aimAtStage=this.usePixelTrace=this.auto_fresh=this._enable=false;
		this._layer=this._run_time=this.block_ratio=this._dragMouseX = this._dragMouseY = this.delta=this.mouseX=this.mouseY=this.stageX=this.stageY=0;
		this.dragTarget=this._block=this._area=this.stageID=this.mouseDownTarget=this.mouseTarget=this._touches=this.background=this.stage=this.context=this.canvas=null;
		super.dispose();
	}
}

module.exports =Stage;