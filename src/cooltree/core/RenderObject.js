import ObjectPool from '../utils/ObjectPool.js'
import CanvasUtil from '../utils/CanvasUtil.js'

export default class RenderObject
{
	constructor()
	{
		this.canvas=this.context=null;
		CanvasUtil.create(this);
		RenderObject.COUNT++;
	}
	
	setSize(w,h)
	{
		if(w==0 || h==0) return; 
		this.canvas.width=MathUtil.int(Math.abs(w));
		this.canvas.height=MathUtil.int(Math.abs(h));
	}
	
	clear()
	{
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.context.restore();
	}
	
	reset()
	{
		if(this.canvas.parentNode) {
			this.canvas.parentNode.removeChild(this.canvas);
		}
		
		this.clear();
	}
	
	dispose()
	{
		reset();
		RenderObject.COUNT--;
		this.canvas=this.context=null;
	}
	
	static get instance()
	{
		if(RenderObject.COUNT>=RenderObject.MAX && ObjectPool.length('RenderObject')<1) return null;
		return ObjectPool.create(RenderObject);
	}
}
RenderObject.className="RenderObject";
RenderObject.COUNT=0;
RenderObject.MAX=50;