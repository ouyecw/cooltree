/**
Shine Chen 
s_c@live.com 2015/05/04

===================================================================
Rectangle Class
===================================================================
**/
import Point from './Point.js'
import MathUtil from '../utils/MathUtil.js'
import ObjectUtil from '../utils/ObjectUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import StringUtil from '../utils/StringUtil.js'

export default class Rectangle
{
	constructor(x_=0, y_=0,width_=0,height_=0) 
	{
		this.x=this.y=this.width=this.height=0;
		this.set(x_, y_,width_,height_);
	}
	
	get data()
	{
		const str=this.toString();
		return JSON.parse(str);
	}
	
	set data(value)
	{
		if(value==undefined || value==null) return;
		this.set(value.x,value.y,value.width,value.height);
	}
	
	/**
	矩形的左上角点
	return Point
	*/
	get topLeft()
	{
		return new Point(this.x,this.y);
	}
	
	/**
	矩形的右下角点
	return Point
	*/
	get bottomRight()
	{
		return new Point(this.x+this.width,this.y+this.height);
	}
	
	/**
	 * 矩形右边界
	 */
	get right()
	{
		return this.x+this.width;
	}
	
	/**
	 * 矩形底部
	 */
	get bottom()
	{
		return this.y+this.height;
	}

	set(x,y,width,height)
	{
		this.x = MathUtil.format(x||0);
		this.y = MathUtil.format(y||0);
		
		this.width  = Math.abs(MathUtil.format(width || 0));
		this.height = Math.abs(MathUtil.format(height|| 0));
		return this;
	}
	
	move(offset,y)
	{
		this.x=MathUtil.format(y==undefined ? offset.x : offset+this.x);
		this.y=MathUtil.format(y==undefined ? offset.y : y+this.y);
		return this;
	}
		
	add(rect)
	{
		this.x=MathUtil.format(rect.x+this.x);
		this.y=MathUtil.format(rect.y+this.y);
		this.width=MathUtil.format(rect.width+this.width);
		this.height=MathUtil.format(rect.height+this.height);
	}
	
	multiply(ratioX,ratioY)
	{
		ratioX=Math.abs(ratioX);
		ratioY=Math.abs(ratioY || ratioX);
		this.x=MathUtil.format(this.x*ratioX);
		this.y=MathUtil.format(this.y*ratioY);
		this.width=MathUtil.format(this.width*ratioX);
		this.height=MathUtil.format(this.height*ratioY);
	}
	
	/**
	矩形是否包括坐标点或者矩形
	return boolean
	*/
	contains(p,y)
	{
		if(p==null) return false;
		
		if(p instanceof Point)
		return this.x<=p.x && this.y<=p.y && p.x<=this.right && p.y<=this.bottom;
		
		else if(p instanceof Rectangle)
		return this.x<=p.x && this.y<=p.y && p.right<=this.right && p.bottom<=this.bottom;
		
		else if(y!=undefined)
		return this.x<=p && this.y<=y && p<=this.right && y<=this.bottom;
		
		return false;
	}
	
	/**
	两个矩形是否相交
	return boolean
	*/
	intersects(r)
	{
		return this.x<=r.x+r.width && this.y<=r.y+r.height && r.x<=this.x+this.width && r.y<=this.y+this.height;
	}
	
	/**
	返回两个矩形相交的交集矩形
	return Rectangle
	*/
	intersection (r)
	{
		if(!this.intersects(r)) return new Rectangle();
		
		let max_x=Math.max(this.x,r.x);
		let max_y=Math.max(this.y,r.y);
		
		let min_w=Math.min(this.x+this.width,r.x+r.width)-max_x;
		let min_h=Math.min(this.y+this.height,r.y+r.height)-max_y;
		
		return new Rectangle(max_x,max_y,min_w,min_h);
	}
	
	/**
	返回四个点坐标的数组
	@param {Boolean} reflectionX true镜像相反
	@param {Boolean} reflectionY true镜像相反
	return Array
	*/
	getPoints(reflectionX,reflectionY)
	{
		let offsetX=(reflectionX ? -1 : 1),offsetY=(reflectionY ? -1 : 1);
		return [new Point(this.x,this.y),new Point(this.x+this.width*offsetX,this.y),new Point(this.x+this.width*offsetX,this.y+this.height*offsetY),new Point(this.x,this.y+this.height*offsetY)];
	}
	
	/**
	 * 返回四个点坐标的数组 
	 * return Array
	 * @param {Number} radians
	 * @param {Object} point
	 * @param {Object} offset
	 * @param {Boolean} reflection
	 */
	rotation(radians,point,offset,reflectionX,reflectionY)
	{
		point=(point ? point : new Point());
		let array=this.getPoints(reflectionX,reflectionY);
		let sin,cos,i,r,l;
		
	    for(i=0;i<array.length;i++){
	    	array[i].subtract(point);
	    	l=array[i].length();
	    	r=array[i].radians;
	    	
	    	sin=Math.sin(r+radians);
	    	cos=Math.cos(r+radians);
	    	
	    	array[i].x=point.x+l*cos+(offset ? offset.x : 0);
	    	array[i].y=point.y+l*sin+(offset ? offset.y : 0);
	    }
		
		return array;
	}
	
	/**
	返回两个矩形两个矩形组合在一起的最大矩形
	return Rectangle
	*/
	union(r,n=true)
	{
		const min_x=Math.min(this.x,r.x);
		const min_y=Math.min(this.y,r.y);
		
		const max_w=Math.max(this.x+this.width,r.x+r.width)-min_x;
		const max_h=Math.max(this.y+this.height,r.y+r.height)-min_y;
		
		if(n) return new Rectangle(min_x,min_y,max_w,max_h);
		
		this.x=min_x;
		this.y=min_y;
		this.width=max_w;
		this.height=max_h;
		return this;
	}
	
	clone()
	{
		return new Rectangle(this.x,this.y,this.width,this.height);
	}
	
	reset(x_=0, y_=0,width_=0,height_=0)
	{
		this.set(x_, y_,width_,height_);
	}
	
	toArray(b)
	{
		return [this.x,this.y,b ? this.right : this.width,b ? this.bottom :this.height];
	}
	
	toString()
	{
		return '{"x":'+this.x+',"y":'+this.y+',"width":'+this.width+',"height":'+this.height+'}';
	}
	
	//****************************************
	// Static Function
	//****************************************
	
	/**
	 * 字符串转换为矩形
	 * @param {String} str 
	 */
	static toRectangle(str)
	{
		if(StringUtil.isEmpty(str)) return null;
		
		str=str.toLowerCase();
		if(!StringUtil.exist(str,"x","y","w","h",":","=")){
		
		str=StringUtil.replaceAll(str,['(',')','{','}'],["","","",""]);
		let array=str.split(",");
		
		return (array.length<4) ? null :new Rectangle(Number(array[0]),Number(array[1]),Number(array[2]),Number(array[3]));
	}
	
	str=StringUtil.replaceAll(str,['(',')'],['{','}']);
	str=(str.indexOf('height')==-1) ? StringUtil.replace(str,'h','height') : str;
	str=(str.indexOf('width')==-1) ? StringUtil.replace(str,'w','width') : str;
	str=(!StringUtil.exist(str,'"',"'",":")) ? StringUtil.replaceAll(str,['=','x','y','width','height'],[':','"x"','"y"','"width"','"height"']) : str;
		
		let obj;
		try{
			obj=JSON.parse(str);
		}catch(e){}
		
		return obj ? ObjectUtil.copyAttribute(new Rectangle(),obj,true) : null;
	};
	
	/**
	 * 获得矩形内部点 (按照百分比)
	 * @param {Rectangle} rect
	 * @param {Number} percentX
	 * @param {Number} percentY
	 */
	static getRectanglePoint(rect,percentX,percentY)
	{
		percentX=percentX||0.5;
		percentY=percentY||0.5;
		return rect ? new Point(MathUtil.format(rect.x+rect.width*percentX),MathUtil.format(rect.y+rect.height*percentY)) :null;
	};
	
	/**
	 * 设置矩形中心点 (可以设置百分比)
	 * @param {Rectangle} rect
	 * @param {Point} center
	 * @param {Number} percentX
	 * @param {Number} percentY
	 */
	static setRectangleCenter(rect,center,percentX,percentY)
	{
		if(rect==null || center==null) return;
		
		percentX=percentX||0.5;
		percentY=percentY||0.5;
		
		rect.x=MathUtil.format(center.x-rect.width*percentX);
		rect.y=MathUtil.format(center.y-rect.height*percentY);
	};
	
	/**
	 * 获得一个矩形内部点坐标
	 * @param {Rectangle} rect
	 * @param {Point} point
	 */
	static innerPoint(rect,point)
	{
		if(rect==null || point==null) return;
		
		point.x=MathUtil.clamp(point.x,rect.x,rect.right);
		point.y=MathUtil.clamp(point.y,rect.y,rect.bottom);
		
		return point;
	}
	
	/**
	 * 根据2-4个点确定一个矩形
	 * @param {Point} posA
	 * @param {Point} posB
	 * @param {Point} posC
	 * @param {Point} posD
	 */
	static createRectangle(posA,posB,posC,posD)
	{
		posC=posC||posA;
		posD=posD||posB;
		
		const minX = Math.min(posA.x,posB.x,posC.x,posD.x);
		const maxX = Math.max(posA.x,posB.x,posC.x,posD.x);
		
		const minY = Math.min(posA.y,posB.y,posC.y,posD.y);
		const maxY = Math.max(posA.y,posB.y,posC.y,posD.y);
		
		return {x:minX,y:minY,width:maxX-minX,height:maxY-minY};
	}
	
	/**
	 * 旋转一个矩形获得最大边框
	 * @param {Rectangle} rect
	 * @param {Number} radians
	 * @param {Point} point
	 * @param {Point} offset
	 */
	static rectangleByRadians(rect,radians,point,offset,reflectionX,reflectionY)
	{
	    let points=rect.rotation(radians,point,offset,reflectionX,reflectionY);
	    ObjectUtil.copyAttribute(points,Rectangle.createRectangle(points[0],points[1],points[2],points[3]));
		return points;
	}
	
	static getPointsBounds(points)
	{
		if(!points || !points.length) return null;
		let [minX,minY,maxX,maxY]=[0,0,0,0];
		let isArray=(points[0] instanceof Array);
		
		for(let i=0,p,l=points.length;i<l;i++){
			p=points[i];
			if(StringUtil.isEmpty(p) || (isArray ? !p.length : !p.hasOwnProperty("x"))) continue;
			
			if(i==0){
				minX=maxX=(minX,isArray ? parseFloat(p[0]) : p.x);
				minY=maxY=(maxY,isArray ? parseFloat(p[1]) : p.y);
				continue;
			}
			
			minX=Math.min(minX,isArray ? parseFloat(p[0]) : p.x);
			minY=Math.min(minY,isArray ? parseFloat(p[1]) : p.y);
			maxX=Math.max(maxX,isArray ? parseFloat(p[0]) : p.x);
			maxY=Math.max(maxY,isArray ? parseFloat(p[1]) : p.y);
		}
		
		return {x:minX,y:minY,width:maxX-minX,height:maxY-minY};
	}
	
	static isContainedIn(rectA, rectB) 
	{
		return rectA.contains(rectB);
	}

}

Rectangle.className="Rectangle";