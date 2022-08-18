
CanvasUtil={}

CanvasUtil.create=function(t)
{
	var s = t||{};
	
	if (!s.canvas) {
		s.canvas = document.createElement("canvas");
		s.context = s.canvas.getContext("2d");
	}
	
	return s;
}

CanvasUtil.getCache=function(image,type)
{
	var target=CanvasUtil.create();
	target.canvas.width=image.width;
	target.canvas.height=image.height;
	target.context.drawImage(image, 0, 0, image.width, image.height);
	return target.canvas.toDataURL(type || "image/png");
}

/**
 * canvas to Image
 * @param {HTMLCanvasElement} canvas 
 * @param {String} type 参数type在image/png，image/jpeg,image/svg+xml等 MIME类型中选择（可以不填，默认是image/png）。
 * */
CanvasUtil.toImage=function(canvas,type)
{
	if(canvas==null) return;
	var image    = new Image();
	image.src    = canvas.toDataURL(type || "image/png");
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
CanvasUtil.cutImage=function(img,w,h,fit)
{
	if(img==null || (img.width==w && img.height==h)) return img;
	var scale=MathUtil.getSizeScale(img.width,img.height,w,h,fit);
	var obj=CanvasUtil.create();
	
	obj.canvas.width=w;
	obj.canvas.height=h;
	obj.context.scale(scale, scale);
	obj.context.translate((w-img.width*scale)*0.5, (h-img.height*scale)*0.5);
	obj.context.drawImage(img,0,0,img.width,img.height,0,0,img.width,img.height);
	return CanvasUtil.toImage(obj.canvas);
}

CanvasUtil.toCanvas=function(img,target,clear)
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

CanvasUtil.getPixelAphla=function(context,x,y)
{
	if(context==null || x>context.width || y>context.height) return 255;
	return context.getImageData(x,y,1,1).data[3];
}

CanvasUtil.clearContext=function(context)
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
CanvasUtil.containerToImage=function(container,type,w,h,fill_color)
{
	if(container==undefined) return;
	
	let target=ObjectPool.create(Graphics);
	target.canvas.width=Math.ceil(w || container.width);
	target.canvas.height=Math.ceil(h || container.height);
	
	if(!StringUtil.isEmpty(fill_color)) {
		target.beginFill(fill_color);
		target.drawRect(0,0,target.canvas.width,target.canvas.height);
		target.endFill();
	}
	
	CanvasUtil._renderContainer(target,container,container);
	const data=type ? target.canvas.toDataURL(type|| "image/png") : CanvasUtil.toImage(target.canvas,!StringUtil.isEmpty(fill_color) ? "image/jpg" : null);
	ObjectPool.remove(target);
	return data;
}

CanvasUtil._renderContainer=function(target,self,container)
{
	var i,c,l;
	for (i = 0,l=self._children.length;i<l;i++) {
		c = self._children[i];
		if(c instanceof DisplayObjectContainer){
			try{
				if(c instanceof Sprite) c.render(target,container);
				else CanvasUtil._renderContainer(target,c,container)
			}catch(err){
				trace(err);
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
CanvasUtil.colorTransform=function(context,rect,colorTransform,display,rect2)
{
	const x = rect.x >> 0, y = rect.y >> 0, w = rect.width >> 0, h = rect.height >> 0;
	const temp = (display && rect2) ? display.getImageData(rect2.x,rect2.y,rect2.width,rect2.height).data : null;
	
	const img = context.getImageData(x,y,w,h);
	const data = img.data;
	
	for (var i = 0, l = data.length; i < l; i += 4) {
		var r = i, g = i + 1, b = i + 2, a = i + 3;
		if((temp && temp[a]<1) || data[a]<1) continue;

		data[r] = data[r] * colorTransform.redMultiplier   + colorTransform.redOffset;
		data[g] = data[g] * colorTransform.greenMultiplier + colorTransform.greenOffset;
		data[b] = data[b] * colorTransform.blueMultiplier  + colorTransform.blueOffset;
		data[a] = data[a] * colorTransform.alphaMultiplier + colorTransform.alphaOffset;
	}
	
	context.putImageData(img,x,y,0,0,w,h);
}
