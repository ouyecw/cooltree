import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import CanvasUtil from '../utils/CanvasUtil.js'
import TouchScale from '../ui/TouchScale.js'
import Factory from '../core/Factory.js'
import Global from '../core/Global.js'

/**
 * @class
 * @module ImageEditor
 * @extends DisplayObjectContainer
 */
export default class ImageEditor extends DisplayObjectContainer
{
	constructor()
	{
		super();
		this.mouseEnabled=true;
		this._bottom=this._right=this._left=this._top=this._image=this._frame_alpha=this._img_width=this._img_height=this._target=this._transformer=this._overlay=this._container=null;
	}
	
	get target()
	{
		return this._target;
	}
	
	set target(value) 
	{
    	if(this._container==null) return;
        this._target=value;
        
        if(value) {
        	this._container.addChild(this._target);
        	
        	if(this.width>0 && this.height>0) 
        		this._target.moveTo((this.width-this._target.getWidth())*0.5,(this.height-this._target.getHeight())*0.5);
            
            this._transformer.target=this._target;
        }
        else      this._container.removeAllChildren();
    }

	init(image,imgw,imgh,width,height,alpha)
	{
		if(!Global.supportCanvas){
			trace("[ERROR]ImageEditor your browser can't support canvas.");
			return;
		}
		
		this._image=image;
		this._img_width=imgw;
		this._img_height=imgh;
		this._frame_alpha=alpha;
		
		this._container=Factory.c("dc");
		this.addChild(this._container);
		
		this._overlay=Factory.c("dc");
		this.addChild(this._overlay);
		
		this._transformer=new TouchScale();
		this.addChild(this._transformer);
		
		this._bottom=Factory.c("bs");
		this._right=Factory.c("bs");
		this._left=Factory.c("bs");
		this._top=Factory.c("bs");
		
		this._overlay.addChild(this._bottom);
		this._overlay.addChild(this._image);
		this._overlay.addChild(this._right);
		this._overlay.addChild(this._left);
		this._overlay.addChild(this._top);
		
		this._bottom.alpha=this._right.alpha=this._left.alpha=this._top.alpha=this._frame_alpha;
		this.resizeFrame(width,height);
	}
	
	resizeFrame(w,h)
	{
		let first=(this.width==0 && this.height==0);
		
		this._image.moveTo(Math.floor((w-this._image.width)*0.5),Math.floor((h-this._image.height)*0.5));
		this._bottom.setup("#000000",w,Math.max(0,h-this._image.y-this._image.height));
		this._bottom.moveTo(0,this._image.y+this._image.height);
		
		this._top.setup("#000000",w,Math.ceil(Math.max(0,this._image.y)));
		this._top.moveTo(0,this._image.y-this._top.height);
		
		this._left.setup("#000000",Math.max(0,this._image.x),h<this._image.height ? h : Math.max(0,h-Math.max(0,h-this._image.y-this._image.height)-Math.ceil(Math.max(0,this._image.y))));
		this._left.moveTo(this._image.x-this._left.width,Math.max(0,this._top.y+this._top.height));
		
		this._right.setup("#000000",Math.max(0,w-this._image.x-this._image.width),Math.max(0,this._left.height));
		this._right.moveTo(this._image.x+this._image.width,this._left.y);
		
		if(this._target && !first){
			this._target.moveTo((w-this._target.getWidth())*0.5,(h-this._target.getHeight())*0.5);
		    this._transformer.sync();
		}
	
	    this.height=h;
	    this.width=w;
	}
	
	/**
	 * * @param {String} type 参数type在image/png，image/jpeg,image/svg+xml等 MIME类型中选择（可以不填，默认是image/jpeg）
	 */
	screenshot(type)
	{
		if(this._target==null || this.width==0 || this.height==0) return null;
		let point,obj=CanvasUtil.create();
		obj.canvas.width=Math.ceil(this.width);
		obj.canvas.height=Math.ceil(this.height);
		
		if(Global.useCanvas){
			CanvasUtil._renderContainer(obj,this._container,this._container);
		}else{
			let mtx=this._target.getMatrix(this._container,true);
	     	obj.context.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
			obj.context.drawImage(this._target.element, 0, 0, Math.ceil(this.width), Math.ceil(this.height),0,0, Math.ceil(this.width), Math.ceil(this.height));
		}
		
		let temp=CanvasUtil.create();
		temp.canvas.width=this._img_width;
		temp.canvas.height=this._img_height;
		point=this._container.globalToLocal(this._image.localToGlobal(0,0));
		temp.context.drawImage(obj.canvas, point.x, point.y, this._img_width, this._img_height,0,0, this._img_width, this._img_height);
		return temp.canvas.toDataURL(type || "image/jpeg");
	}
	
	dispose()
	{
		super.dispose();
		delete this._bottom,this._right,this._left,this._top,this._image,this._frame_alpha,this._img_width,this._img_height,this._target,this._transformer,this._overlay,this._container;
	}

}

ImageEditor.className="ImageEditor";