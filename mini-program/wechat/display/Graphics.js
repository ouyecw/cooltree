/**
===================================================================
Graphics Class
===================================================================
**/

import StringUtil from '../utils/StringUtil.js'
import UniqueUtil from '../utils/UniqueUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import ArrayUtil from '../utils/ArrayUtil.js'
import Rectangle from '../geom/Rectangle.js'
import Global from '../core/Global.js'
import Point from '../geom/Point.js'

/**
 * @class
 * @module Graphics
 */
export default class Graphics
{
	constructor(context=null)
	{
		if(!context){
			if(!Global?.instance.stage) return;
			this.canvas=Global.stage.canvas;
			this.context=Global.stage.context;
		}else{
			this.context=context;
			this.canvas=context.canvas;
		}
		
		this.name=UniqueUtil.getName("Graphics");
		
		Global.proxy( this , this.context , "arc");
		Global.proxy( this , this.context , "moveTo");
		Global.proxy( this , this.context , "lineTo");
		Global.proxy( this , this.context , "beginPath");
		Global.proxy( this , this.context , "closePath");
		Global.proxy( this , this.context , "bezierCurveTo");
		Global.proxy( this , this.context , "quadraticCurveTo","curveTo");
	}
	
	/**
	定义图形线条类型
	@param thickness number 线条宽度>0
	@param style String 颜色值 或者 CanvasGradient 对象 或 CanvasPattern 对象
	@param alpha number 线条透明度=>0
	@param cap String 线条的末端形状 "butt" 短直角 "round" 圆形 "square"长直角
	@param joint String 线条的接头方式 "round" 圆角 "bevel" 斜角（外边缘相交填充的三角形） "miter" 直角相交（外边缘一直扩展到它们相交）
	@param miterLimit number joint=="miter"时候斜连接长度和线条宽度的最大比率
	*/
	lineStyle(thickness=1,style="#000000",alpha=1,cap="butt",joint="miter",miterLimit=10)
	{
		this.line_cap=cap;
		this.stroke_style=style;
		this.line_join=joint;
		this.line_alpha=alpha;
		this.line_width=thickness;
		this.miter_limit=miterLimit;
		
		this.line_width=this.line_width<=0 ? 0 : this.line_width;
		this.stroke_style=this.stroke_style+"";
		
		this.context.lineCap=this.line_cap;
		this.context.lineJoin=this.line_join;
		this.context.lineWidth=this.line_width;
		this.context.miterLimit=this.miter_limit;
		this.context.strokeStyle=this.stroke_style;
	}
	
	/**
	清除定义图形
	*/
	clearRect(w=0,h=0)
	{
		if(!this.context) return;
		if(w>0 && h>0)
			this.rectangle=(this.rectangle || ObjectPool.create(Rectangle)).set(0,0,w,h);

		if(!this.rectangle) return;
		this.context.clearRect(this.rectangle.x,this.rectangle.y,this.rectangle.width,this.rectangle.height);
		this.context.restore();
	}
	
	beginFill(style, alpha)
	{
		this.fill_alpha=(alpha==undefined) ? 1 : alpha;
		this.fill_style=style || "#FFFFFF";
		this.context.fillStyle=this.fill_style;
		return this;
	}
	
	endFill(fill=true)
	{
		const old_alpha=this.context.globalAlpha;
		
		if (fill && this.fill_style)
		{
			this.context.fillStyle=this.fill_style;
			this.context.globalAlpha=old_alpha*this.fill_alpha;
			this.context.fill();
		}
		
		if (this.stroke_style && this.line_width>0 && this.line_alpha>0)
		{
			
			this.context.strokeStyle=this.stroke_style;
			this.context.globalAlpha=old_alpha*this.line_alpha;
			this.context.stroke();
		}
		
		this.context.globalAlpha=old_alpha;
	}
	
	/**
	图片填充
	@param image Image 贴图 Image 对象或一个 Canvas 元素
	
	@param repetitionStyle
	•"repeat" - 在各个方向上都对图像贴图。默认值。
	•"repeat-x" - 只在 X 方向上贴图。
	•"repeat-y" - 只在 Y 方向上贴图。
	•"no-repeat" - 不贴图，只使用它一次。
	*/
	beginBitmapFill(image, repetitionStyle, alpha)
	{
		this.fill_style=this.context.createPattern(image, repetitionStyle || "no-repeat");
		this.fill_alpha=(alpha==undefined) ? 1 : alpha;
		this.context.fillStyle=this.fill_style;
	}
	
	/**
	线性颜色渐变图形填充
	@param xStart, yStart number 渐变的起始点的坐标。
	@param xEnd, yEnd number 渐变的结束点的坐标。
	@param offsetlist,colorList Array 
	offset >=0 And <=1 表示渐变的开始点和结束点之间的范围百分比
	color 颜色字符串
	*/		
	linearGradientFill(xStart, yStart, xEnd, yEnd, offsetlist, colorList)
	{
		let fillStyle=this.context.createLinearGradient(xStart, yStart, xEnd, yEnd);
	    let len=Math.min(offsetlist.length,colorList.length);
		for (let i=0 ; i<len ; i++) fillStyle.addColorStop(offsetlist[i], colorList[i]+"");
		this.fill_style=fillStyle;
		return fillStyle;
	}
	
	/**
	放射颜色渐变图形填充
	@param xStart, yStart number 开始圆的圆心的坐标。 
	@param radiusStart number 开始圆的直径。
	@param xEnd, yEnd number 结束圆的圆心的坐标。
	@param radiusEnd number 结束圆的直径。
	@param offsetlist,colorList Array 
	offset >=0 And <=1 表示渐变的开始点和结束点之间的范围百分比
	color 颜色字符串
	*/
	radialGradientFill(xStart, yStart, radiusStart, xEnd, yEnd, radiusEnd, offsetlist, colorList)
	{
		let fillStyle=this.context.createRadialGradient(xStart, yStart, radiusStart, xEnd, yEnd, radiusEnd);
		let len=Math.min(offsetlist.length,colorList.length);
		for (let i=0 ; i<len ; i++) fillStyle.addColorStop(offsetlist[i], colorList[i]+"");
		this.fill_style=fillStyle;
		return fillStyle;
	}
	
	/**
	绘制矩形路径
	*/
	drawRect(x, y, width, height)
	{
		this.beginPath();
		this.context.rect(x, y, width, height);
		this.closePath();
	}
	
	/**
	绘制圆角矩形路径
	@param rx,ry number 圆角半径
	*/
	drawRoundRect(x, y, width, height, rx,ry)
	{
		this.beginPath();
		
		if(ry && ry!=rx){
			this.moveTo(x+width, y+height-ry);
			this.curveTo(x+width, y+height, x+width - rx, y+height);
			this.lineTo(x + rx, y+height);
			this.curveTo(x, y+height, x, y+height - ry);
			this.lineTo(x, y + ry);
			this.curveTo(x, y, x + rx, y);
			this.lineTo(x+width - rx, y);
			this.curveTo(x+width, y, x+width, y + ry);
			this.lineTo(x+width, y+height-ry);
		}
		else{
			this.moveTo(x + rx, y);
			this.lineTo(x + width - rx, y);
			this.arc(x + width - rx, y + rx, rx, -Math.PI / 2, 0, false);
			this.lineTo(x + width, y + height - rx);
			this.arc(x + width - rx, y + height - rx, rx, 0, Math.PI / 2, false);
			this.lineTo(x + rx, y + height);
			this.arc(x + rx, y + height - rx, rx, Math.PI / 2, Math.PI, false);
			this.lineTo(x, y + rx);
			this.arc(x + rx, y + rx, rx, Math.PI, Math.PI * 3 / 2, false);
		}
		
		this.closePath();
	}

	/**
	 * 圆角矩形
	 * @param {Number} x 
	 * @param {Number} y 
	 * @param {Number} width 
	 * @param {Number} height 
	 * @param {Number} r0 左上
	 * @param {Number} r1 右上
	 * @param {Number} r2 右下
	 * @param {Number} r3 左下
	 */
	drawSpecialRect(x, y, width, height,r0,r1,r2,r3)
	{
		this.beginPath();
		this.moveTo(x + r0, y);
		this.lineTo(x + width - r1, y);
		this.arc(x + width - r1, y + r1, r1, -Math.PI / 2, 0, false);
		this.lineTo(x + width, y + height - r2);
		this.arc(x + width - r2, y + height - r2, r2, 0, Math.PI / 2, false);
		this.lineTo(x + r3, y + height);
		this.arc(x + r3, y + height - r3, r3, Math.PI / 2, Math.PI, false);
		this.lineTo(x, y + r0);
		this.arc(x + r0, y + r0, r0, Math.PI, Math.PI * 3 / 2, false);
		this.closePath();
	}
	
	/**
	 * 绘制路径
	 * @param {Array} array
	 * @param {Boolean} isClose
	 */
	drawPath(array,isClose=true)
	{
		if(array==undefined || array.length<2) return;
		
		this.beginPath();
		let isArray=(array[0] instanceof Array);
		this.moveTo((isArray ? array[0][0] : array[0].x), (isArray ? array[0][1] : array[0].y));
		
		for (let i=1;i<array.length;i++){
			this.lineTo(isArray ? array[i][0] : array[i].x, isArray ? array[i][1] : array[i].y);
		}
		
		if(isClose) this.closePath();
	}
	
	/**
	绘制圆形路径
	*/
	drawCircle(x, y, radius)
	{
		this.beginPath();
		this.arc(x , y , radius, 0, Math.PI * 2, 0);
		this.closePath();
	}
	
	/**
	绘制椭圆形路径
	*/
	drawEllipse(x, y, width, height)
	{
		if (width == height) return this.drawCircle(x, y, width/2);
		
		width=width / 2;
		height=height / 2;
		
		let dw=0.5522847498307933 * width; 
		let dh=0.5522847498307933 * height;
		
		x+=width;
		y+=height;
		
		this.beginPath();
		this.moveTo(x + width, y);
		this.bezierCurveTo(x + width, y - dh, x + dw, y - height, x, y - height);
		this.bezierCurveTo(x - dw, y - height, x - width, y - dh, x - width, y);
		this.bezierCurveTo(x - width, y + dh, x - dw, y + height, x, y + height);
		this.bezierCurveTo(x + dw, y + height, x + width, y + dh, x + width, y);
		this.closePath();
	}
	
	/**
	 * n边形
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 * @param {Number} n
	 */
	createPolygon(x, y,radius,n) 
	{
		if(n<3) return;
		
	    let dx,dy,i;
	    this.beginPath();
	    dx = Math.sin(0);
	    dy = Math.cos(0);
	    
	    const dig = Math.PI / n * ((n%2==0) ? 2 : (n-1));
	    
	    for (i = 0; i < n; i++) {
	        dx = Math.sin(i * dig);
	        dy = Math.cos(i * dig);
	        this.lineTo(x + dx * radius, y + dy * radius);
	    }
	    
	    this.closePath();
	}
	
	/**
	 * 根据参数指定的SVG数据绘制一条路径。
	 * 代码示例: 
	 * <p>let path = "M250 150 L150 350 L350 350 Z";</p>
	 * <p>let shape = new Graphics();</p>
	 * <p>shape.drawSVGPath(path).beginFill("#0ff").endFill();</p>
	 */
	drawSVGPath (pathData,pts)
	{
		let cmd,old,point=ObjectPool.create(Point),j=0,path = pathData.split(/(?=[a-zA-Z])/);
		this.beginPath();
		
		for(let str,k,p,i = 0, len = path.length; i < len; i++)
		{
			str = StringUtil.trim(path[i]), cmd = str[0].toUpperCase(), p = ArrayUtil.format(str.substring(1).split(/,| |-/));
			
			if(StringUtil.isEmpty(cmd)) cmd = old;
			else old=cmd;
	
			switch(cmd)
			{
				case "M":
					point.set(pts ? pts[j].x : p[0],pts ? pts[j].y : p[1]);
					this.moveTo(point.x,point.y);
					j++;
					break;
				case "L":
					k=0;
					for(let n=Math.floor(p.length*0.5);k<n;k++){
						if(pts){
							this.lineTo(pts[j].x,pts[j].y);
							j++;
						}
						else this.lineTo(p[k*2],p[k*2+1]);
					}
					
					k--;
					point.set(pts ? pts[j-1].x :p[k*2],pts ? pts[j-1].y :p[k*2+1]);
					break;
				case "Q":
					k=0;
					for(let n=Math.floor(p.length/4);k<n;k++){
						if(pts) {
							this.curveTo(pts[j].x,pts[j].y,pts[j+1].x,pts[j+1].y);
							j+=2;
					    }
						else this.curveTo(p[k*4],p[k*4+1],p[k*4+2],p[k*4+3]);
					}
					
					k--;
					point.set(pts ? pts[j-1].x : p[k*4+2],pts ? pts[j-1].y : p[k*4+3]);
					break;
					
				case "C":
					k=0;
					for(let n=Math.floor(p.length/6);k<n;k++){
						if(pts) {
							this.bezierCurveTo(pts[j].x,pts[j].y,pts[j+1].x,pts[j+1].y,pts[j+2].x,pts[j+2].y);
							j+=3;
					    }
						else this.bezierCurveTo(p[k*6],p[k*6+1],p[k*6+2],p[k*6+3],p[k*6+4],p[k*6+5]);
					}
					
					k--;
					point.set(pts ? pts[j-1].x : p[k*6+4],pts ? pts[j-1].y : p[k*6+5]);
					break;
					
				case "H":
				case "V":
				    point.set(cmd=="H" ? parseFloat(p[0]) : point.x,cmd=="H" ? point.y : parseFloat(p[0]));
				    this.lineTo(point.x,point.y);
				    break;
				case "Z":
					this.closePath();
					break;
				default:
				    console.log("[Graphics]drawSVGPath() miss",str);
					break;
			}
		}
		
		ObjectPool.remove(point);
		return this;
	};
	
	reset(context=null)
	{
		if(context){
			this.context=context;
			this.canvas=context.canvas;
			if(this.canvas.width!=Global.stage.stageWidth) this.canvas.width=Global.stage.stageWidth;
			if(this.canvas.height!=Global.stage.stageHeight) this.canvas.height=Global.stage.stageHeight; 
		}
		
		this.clearRect();
		if(this.rectangle) ObjectPool.remove(this.rectangle);
		this.fill_style=this.rectangle=null;
		this.fill_alpha=1;

		this.line_alpha=1;
		this.line_width=1;
		this.miter_limit=10;
		this.line_cap="butt";
		this.line_join="miter";
		this.stroke_style="#000000";
		
	}
	
	dispose()
	{
		this.reset();
		delete this.name,this.rectangle,this.line_cap,this.line_join,this.line_alpha,this.stroke_style,this.line_width,this.miter_limit,this.fill_alpha,this.fill_style,this.context,this.canvas;
	}
	
	toString()
	{
		return 'Graphics';
	}

}

Graphics.className="Graphics";
module.exports =Graphics;