
class CanvasMaster extends EventDispatcher
{
	constructor()
	{
		super();
		this.graphics=this._current=this._queue_list=this._graphics_list=null;
		this._init();
	}
	
	_init()
	{
		if(this._graphics_list || CanvasMaster.number<=0) return;
		this._graphics_list=[];
		let i,graphics;
		
		for(i=0;i<CanvasMaster.number;i++){
			graphics=ObjectPool.create(Graphics);
			this._graphics_list.push(graphics);
		}
	}
	
	push(vo,width,height,callback,...args)
	{
		if(!this._graphics_list || !vo) return;
		if(!this._queue_list) this._queue_list=[];
		this._queue_list.push({t:vo.type_id,p:vo.getValue(),f:vo.actions,w:width,h:height,c:callback,a:args.length?args:null});
		
		ObjectPool.remove(vo);
		if(this._current) return;
		
		this._run();
		this.dispatchEvent(Factory.c("ev",[CanvasMaster.STARTUP]));
	}
	
	_run()
	{
		if(!this._graphics_list || !this._graphics_list.length) return;
		
		if(this._queue_list.length==0){
			this._current=null;
			this.dispatchEvent(Factory.c("ev",[CanvasMaster.COMPLETE]));
			return;
		}
		
		this._current=this._queue_list.shift();
		this.graphics=this._graphics_list.shift();
		const target=(this._current.t==0 ? this.graphics.context : this.graphics);
		
		this._do_actions(target,this._current.p,this._current.f);
		this._render(this.graphics,this._current.w,this._current.h,this._current.c);
	}
	
	_do_actions(target,params,actions)
	{
		if(!target) return;
		
		if(params){
			for(let i in params) target[i]=params[i];
		}
		
		while(actions && actions.length){
			let action=actions.shift();
			target[action.method].apply(target,action.data);
		}
	}
	
	_render(graphics,w,h,callback)
	{
		const source=ObjectPool.create(Source),_this=this;
	    source.image=CanvasUtil.toImage(graphics.canvas);
	    
	    if(w>graphics.canvas.width || h>graphics.canvas.height){
	    	source.scale=MathUtil.getSizeScale(w,h,graphics.canvas.width,graphics.canvas.height,true);
	    	w=w*source.scale;
	    	h=h*source.scale;
	    }
	   
	    source.isClone=true;
		source.height=h;
		source.width=w;
		
		Promise.resolve().then(function() {
			if(callback) callback(source);
			if(_this._graphics_list) {
				graphics.reset();
				_this._graphics_list.push(graphics);
			}
			_this._run();
		});
		
		this._run();
	}
	
	size(w,h)
	{
		if(!this._graphics_list || !this._graphics_list.length) return;
		let graphics;
		
		for(graphics of this._graphics_list) {
			graphics.canvas.height=h;
			graphics.canvas.width=w;
		}
	}
	
	dispose()
	{
		if(this._graphics_list && this._graphics_list.length>0){
			while(this._graphics_list.length) ObjectPool.remove(this._graphics_list.pop());
		}
		
		super.dipose();
		this.graphics=this._queue_list=this._current=this._graphics_list=null;
		delete this.graphics,this._current,this._graphics_list,this._queue_list;
	}
}

CanvasMaster.number=2;
CanvasMaster.STARTUP="canvas_draw_startup";
CanvasMaster.COMPLETE="canvas_draw_complete";
