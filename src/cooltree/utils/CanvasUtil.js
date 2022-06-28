import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import Graphics from '../display/Graphics.js'
import StringUtil from './StringUtil.js'
import ObjectPool from './ObjectPool.js'
import ClassUtil from './ClassUtil.js'
import MathUtil from './MathUtil.js'

/**
 * @class
 * @module CanvasUtil
 */
export default class CanvasUtil
{
	static create(t)
	{
		let s = t||{};
		
		if (!s.canvas) {
			s.canvas = document.createElement("canvas");
			s.context = s.canvas.getContext("2d");
		}
		
		return s;
	}
	
	static getCache(image,type)
	{
		let target=CanvasUtil.create();
		target.canvas.width=image.width;
		target.canvas.height=image.height;
		target.context.drawImage(image, 0, 0, image.width, image.height);
		return target.canvas.toDataURL(type || "image/png");
	}
	
	static splitFrames(image,x,y,w,h)
	{
		if(!image || !w || !h) return null;
		let canvas = document.createElement("canvas");
		let context= canvas.getContext("2d");
		
		canvas.height=h;
		canvas.width=w;
		
		context.drawImage(image, x, y, w, h,0,0,w, h);
		return canvas;
	}
	
	/**
	 * canvas to Image
	 * @param {HTMLCanvasElement} canvas 
	 * @param {String} type 参数type在image/png，image/jpeg,image/svg+xml等 MIME类型中选择（可以不填，默认是image/png）。
	 * */
	static toImage(canvas,type)
	{
		if(canvas==null) return;
		const image    = new Image();
		
		try{
			image.src    = canvas.toDataURL(type || "image/png");
		}
		catch(error){
			trace("[ERROR]",error);
			return null;
		}
		
		image.height = MathUtil.int(canvas.height);
		image.width  = MathUtil.int(canvas.width);
		return image;
	}
	
	/**
	 * 
	 * @param {Image} img image target
	 * @param {Number} w frame's width
	 * @param {Number} h frame's height
	 * @param {Boolean} fit fit to frame
	 */
	static cutImage(img,w,h,fit)
	{
		if(img==null || (img.width==w && img.height==h)) return img;
		let scale=MathUtil.getSizeScale(img.width,img.height,w,h,fit);
		let obj=CanvasUtil.create();
		
		obj.canvas.width=w;
		obj.canvas.height=h;
		obj.context.scale(scale, scale);
		obj.context.translate((w-img.width*scale)*0.5, (h-img.height*scale)*0.5);
		obj.context.drawImage(img,0,0,img.width,img.height,0,0,img.width,img.height);
		return CanvasUtil.toImage(obj.canvas);
	}
	
	static toCanvas(img,target,clear)
	{
		if(img==null) return;
		
		clear=(clear==undefined || clear==true);
		target= target||CanvasUtil.create();
		
		if(clear) target.context.clearRect(0, 0, target.canvas.width, target.canvas.height);
		target.canvas.height = img.height;
		target.canvas.width  = img.width;
		
		target.context.drawImage(img, 0, 0);
		return target.canvas;
	}
	
	static getPixelAphla(context,x,y)
	{
		if(context==null || x>context.width || y>context.height) return 255;
		return context.getImageData(x,y,1,1).data[3];
	}
	
	static clearContext(context)
	{
		if(context) context.clear(0,0,context.width,context.height);
	}
	
	/**
	 * @param {DisplayObjectContainer} container
	 * @param {String} type 为null返回图片，否则返回图片数据
	 * @param {Number} w 宽度
	 * @param {Number} h 高度
	 * @param {String} fill_color 填充色
	 */
	static containerToImage(container,type,w,h,fill_color)
	{
		if(container==undefined) return;
		
		const target=ObjectPool.create(Graphics);
		target.canvas.width=Math.ceil(w || container.width);
		target.canvas.height=Math.ceil(h || container.height);
		
		if(!StringUtil.isEmpty(fill_color)) {
			target.beginFill(fill_color);
			target.drawRect(0,0,target.canvas.width,target.canvas.height);
			target.endFill();
		}
		
		CanvasUtil._renderContainer(target,container,container);
		let data;
		
		if(type){
			try{
				data=target.canvas.toDataURL(type|| "image/png");
			}catch(error){
				trace("[ERROR]",error);
				return null;
			}
		}
		else data=CanvasUtil.toImage(target.canvas,!StringUtil.isEmpty(fill_color) ? "image/jpg" : null);
		
		ObjectPool.remove(target);
		return data;
	}
	
	static _renderContainer(target,self,container)
	{
		let i,c,l;
		for (i = 0,l=self._children.length;i<l;i++) {
			c = self._children[i];
			if(c instanceof DisplayObjectContainer){
				try{
					if(ClassUtil.getQualifiedSuperclassName(c).split('.').indexOf('Sprite')>=0 || (c.name && (''+c.name).indexOf('sprite')==0)) 
						c.render(target,container);
					else 
						CanvasUtil._renderContainer(target,c,container)
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
	
	/**
	 * @param {Context} context
	 * @param {Rectangle} rect
	 * @param {ColorTransform} colorTransform
	 * @param {Context} display
	 * @param {Rectangle} rect2
	 */
	static colorTransform(context,rect,colorTransform,display,rect2)
	{
		const x = rect.x >> 0, y = rect.y >> 0, w = rect.width >> 0, h = rect.height >> 0;
		const temp = (display && rect2) ? display.getImageData(rect2.x,rect2.y,rect2.width,rect2.height).data : null;
		
		const img = context.getImageData(x,y,w,h);
		const data = img.data;
		
		for (let i = 0, l = data.length; i < l; i += 4) {
			let r = i, g = i + 1, b = i + 2, a = i + 3;
			if((temp && temp[a]<1) || data[a]<1) continue;
	
			data[r] = data[r] * colorTransform.redMultiplier   + colorTransform.redOffset;
			data[g] = data[g] * colorTransform.greenMultiplier + colorTransform.greenOffset;
			data[b] = data[b] * colorTransform.blueMultiplier  + colorTransform.blueOffset;
			data[a] = data[a] * colorTransform.alphaMultiplier + colorTransform.alphaOffset;
		}
		
		context.putImageData(img,x,y,0,0,w,h);
	}
}
