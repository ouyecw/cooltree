import Graphics from '../display/Graphics.js'
import ObjectPool from './ObjectPool.js'
import ClassUtil from './ClassUtil.js'


/**
 * @class
 * @module CanvasUtil
 */
export default class CanvasUtil
{
	static _canvas=null;
	
	static create(width,height)
	{
		if(CanvasUtil._canvas){
			const context = CanvasUtil._canvas.getContext('2d');
			context.clearRect(0, 0, CanvasUtil._canvas.width, CanvasUtil._canvas.height);
			CanvasUtil._canvas.height=Math.ceil(height);
			CanvasUtil._canvas.width=Math.ceil(width);
			return {canvas:CanvasUtil._canvas,context};
		}

		CanvasUtil._canvas=wx.createOffscreenCanvas({type: '2d', width, height})
		const context = CanvasUtil._canvas.getContext('2d');
		return {canvas:CanvasUtil._canvas,context};
	}
	
	static displayToImage(displayObject)
	{
		if(!displayObject) return null;
		const obj=CanvasUtil.create(displayObject.width,displayObject.height);

		const graphics=ObjectPool.create(Graphics,[obj.context]);
		displayObject._render(graphics);

		const base64=obj.canvas.toDataURL('image/png');
		ObjectPool.remove(graphics);
		return base64;
	}
	
	static getPixelAphla(context,x,y)
	{
		if(context==null || x>context.width || y>context.height) return 255;
		return context.getImageData(x,y,1,1).data[3];
	}
	
	/**
	 * @param {DisplayObjectContainer} container
	 */
	static containerToImage(container)
	{
		if(!container) return;
		const obj=CanvasUtil.create(container.width,container.height);
		const graphics=ObjectPool.create(Graphics,[obj.context]);
		
		if(ClassUtil.getQualifiedSuperclassName(container).indexOf('BoxShape')>=0) 
			container.redraw();

		CanvasUtil._renderContainer(graphics,container,container);
		const base64=obj.canvas.toDataURL('image/png');
		ObjectPool.remove(graphics);
		return base64;
	}

	static _renderContainer(target,self,container)
	{
		let i,c,l,d;
		for (i = 0,l=self._children.length;i<l;i++) {
			c = self._children[i];
			d = ClassUtil.getQualifiedSuperclassName(c).split('.');
			if(d.indexOf('DisplayObjectContainer')>=0){
				try{
					if(d.indexOf('Sprite')>=0 || (c.name && (''+c.name).indexOf('sprite')==0)) 
						c.render(target,container);
					else {
						if(d.indexOf('BoxShape')>=0) c.redraw();
						CanvasUtil._renderContainer(target,c,container);
					}
						
				}catch(err){
					trace("[ERROR]",err);
				}
				
				continue;
			}
			
			target.context.save();
			c._render(target,false,container);
			target.context.restore();
		}
	}
}

module.exports = CanvasUtil;
