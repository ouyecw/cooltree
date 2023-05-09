/**
===================================================================
Graphics Class
===================================================================
**/
import StringUtil from '../utils/StringUtil.js'
import UniqueUtil from '../utils/UniqueUtil.js'
import CanvasUtil from '../utils/CanvasUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import ArrayUtil from '../utils/ArrayUtil.js'
import ShapeUtil from '../utils/ShapeUtil.js'
import Rectangle from '../geom/Rectangle.js'
import SVGLabel from '../type/SVGLabel.js'
import ShapeVO from '../model/ShapeVO.js'
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
			CanvasUtil.create(this);
			this.canvas.width=Global.width;
			this.canvas.height=Global.height;
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
		
		this.line_width=this.line_width<=0 ? 0.1 : this.line_width;
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
	clear()
	{
		if(!this.context) return;
		this.rectangle=this.rectangle || ObjectPool.create(Rectangle).set(0,0,this.context.canvas.width,this.context.canvas.height);
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
		
		if (this.stroke_style)
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
	    this.drawPath(Point.polygonPoints(x, y,radius,n));
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
				    trace("[Graphics]drawSVGPath() miss",str);
					break;
			}
		}
		
		ObjectPool.remove(point);
		return this;
	};
	
	/**
	 * @param {ShapeVO} vo      图形数据模型
	 * @param {Object}  offset  变换数据 x,y,scaleX,scaleY,rotation,center(中心点)
	 * @param {Boolean} fill    是否填充样式 true填充
	 */
	drawShape(vo,offset=null,fill=false)
	{
		if(!vo || !(vo instanceof ShapeVO)) return;
		
		if(fill && vo.properties.style){
			let style=vo.properties.style;
			
			if(style.fill) {
				if(style.fill.indexOf("#")==0) this.beginFill(style.fill,style.fillOpacity || style.opacity);
				else if(AssetManager.getSource(style.fill)) this.beginBitmapFill(AssetManager.getSource(style.fill).image);
			}
			
			if(style.stroke && style.stroke.indexOf("#")==0) this.lineStyle(style.strokeWidth,style.stroke,style.strokeOpacity || style.opacity);
		}
		
		let path,points,pts;
		
		switch(vo.type)
		{
			case SVGLabel.LINE:
			points=[[vo.properties.x1, vo.properties.y1],[vo.properties.x2, vo.properties.y2]];
			if(offset) path=ShapeUtil.pointsToPath(points);
			else this.drawPath(points,false);
			break;
			
			case SVGLabel.POLYLINE:
			case SVGLabel.POLYGON:
			points=ArrayUtil.each(vo.properties.points.split(/ /),function(d,i,a){a[i]=d.split(/,/);});
			if(offset) path=ShapeUtil.pointsToPath(points,vo.type==SVGLabel.POLYGON);
			else this.drawPath(points,vo.type==SVGLabel.POLYGON);
			break;
			
			case SVGLabel.RECT:
			if(offset) path=ShapeUtil.rectToPath(vo.properties);
			else this.drawRoundRect(vo.properties.x||0,vo.properties.y||0,vo.properties.width,vo.properties.height,vo.properties.rx||0,vo.properties.ry||0);
			break;
			
			case SVGLabel.CIRCLE:
			if(offset) path=ShapeUtil.ellipseToPath(vo.properties);
			else this.drawCircle(vo.properties.cx||0,vo.properties.cy||0,vo.properties.r);
			break;
			
			case SVGLabel.ELLIPSE:
			if(offset) path=ShapeUtil.ellipseToPath(vo.properties);
			else this.drawEllipse((vo.properties.cx||0)-vo.properties.rx,(vo.properties.cy||0)-vo.properties.ry,vo.properties.rx*2,vo.properties.ry*2);
			break;
			
			case SVGLabel.PATH:
			if(offset) path=vo.properties.d;
			else this.drawSVGPath(vo.properties.d);
			break;
			
			default:return;
		}
		
		if(!StringUtil.isEmpty(path)){
			let clo=ObjectPool.create(ShapeVO).setup(SVGLabel.PATH,{d:path});
			pts=ShapeUtil.getShapeBounds(clo,true);
			Point.matrix(pts,offset);
			this.drawSVGPath(path,pts);
			ObjectPool.remove(clo);
		}
		
		if(fill && vo.properties.style) this.endFill();
	//	if(!StringUtil.isEmpty(path) && pts) return Rectangle.getPointsBounds(pts);
	}
	
	reset(context=null)
	{
		if(this.canvas && this.canvas.parentNode) {
			this.canvas.parentNode.removeChild(this.canvas);
		}
		
		if(this.rectangle) ObjectPool.remove(this.rectangle);
		this.fill_style=this.rectangle=null;
		this.fill_alpha=1;
		
		if(context){
			this.context=context;
			this.canvas=context.canvas;
			if(this.canvas.width!=Global.width) this.canvas.width=Global.width;
			if(this.canvas.height!=Global.height) this.canvas.height=Global.height; 
		}
		
		this.clear();
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