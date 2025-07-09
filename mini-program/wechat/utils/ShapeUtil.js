import MathUtil from './MathUtil.js'
import Point from '../geom/Point.js'
import ArrayUtil from './ArrayUtil.js'
import ObjectPool from './ObjectPool.js'
import StringUtil from './StringUtil.js'
import Rectangle from '../geom/Rectangle.js'

/**
 * @class
 * @module ShapeUtil
 */
export default class ShapeUtil
{
	static className="ShapeUtil";
	
	/**
	 * 点坐标集合转换成路径节点
	 * @param {Array} points
	 * @return {String}
	 */
	static pointsToPath(points)
	{
		if(!points || points.length<2) return "";
		let p,str="";
		for(let i=0,l=points.length;i<l;i++){
			p=points[i];
			str+=(i==0 ? "M " : (i==1 ? " L " : ", "))+(p instanceof Array ? p[0] : p.x)+" "+(p instanceof Array ? p[1] : p.y);
		}
		
		p=points[0];
		str+=" Z";
		return str;
	}
	
	/**
	 * 矩形或者圆角矩形换成路径
	 * @return {String}
	 */
	static rectToPath(x,y,width,height,rx=0,ry=0)
	{
		rx = rx > width *0.5 ? width *0.5 : rx;
		ry = ry > height *0.5 ? height *0.5 : ry;
		
		let str,w = width-rx*2, 
			h = height-ry*2, 
			C = 0.5522847498307933, 
			cx = C * rx, 
			cy = C * ry;
			
		if(0 == rx || 0 == ry)
	        str='M' + x + ' ' + y +
	            ' L' + (x+width) +' ' + y +
	            ' L' + (x+width) +' ' + (y +height) +
	            ' L' + x +' ' + (y +height) +
	            ' Z';		            
	    else 
	        str='M' + (x + width) + ' ' + (y+ry) +
	        ' C' + (x + width)+ ' ' +(y+ry - cy)+ ' ' +(x+w+rx+ cx)+ ' ' + y+ ' ' +(x+w+rx)+ ' ' +y+
	        ' L' + (x+rx) +' ' + y +
	        ' C' + (x+rx - cx)+ ' ' + y+ ' ' + x+ ' ' + (y+ry - cy)+ ' ' + x+ ' ' + (y+ry)+ 
	        ' L' + x+' ' + (y+h+ry) +
	        ' C' + x+ ' ' + (y+h+ ry + cy)+ ' ' + (x+rx - cx)+ ' ' + (y+height)+ ' ' + (x+rx)+ ' ' + (y+height)+ 
	        ' L' + (x+rx+w) +' ' + (y+height) +
	        ' C' + (x+w+rx + cx)+ ' ' + (y+height)+ ' ' + (x+width)+ ' ' + (y+h+ry + cy)+ ' ' + (x+width)+ ' ' + (y+h+ry) + 
	        ' Z'; 
	     
	    return str;
	}
	
	/**
	 * 椭圆或者正圆换成路径
	 * @return {String}
	 */
	static ellipseToPath(cx,cy,r,rx=0,ry=0)
	{
		let k  = 0.5522848,
	        a  = (r==0 ? rx : r),
	        b  = (r==0 ? ry : r),
	        x  = a*k,
	        y  = b*k;
	        
	    let str =
	        'M' + MathUtil.format(cx-a) + ' ' + cy +
	        ' C' + MathUtil.format(cx-a) + ' ' + MathUtil.format(cy-y) + ' ' +  MathUtil.format(cx-x) + ' ' + MathUtil.format(cy-b) + ' ' + cx + ' ' + MathUtil.format(cy-b) + 
	        ' C' + MathUtil.format(cx+x) + ' ' + MathUtil.format(cy-b) + ' ' +  MathUtil.format(cx+a) + ' ' + MathUtil.format(cy-y) + ' ' + MathUtil.format(cx+a) + ' ' + cy + 
	        ' C' + MathUtil.format(cx+a) + ' ' + MathUtil.format(cy+y) + ' ' +  MathUtil.format(cx+x) + ' ' + MathUtil.format(cy+b) + ' ' + cx + ' ' + MathUtil.format(cy+b) + 
	        ' C' + MathUtil.format(cx-x) + ' ' + MathUtil.format(cy+b) + ' ' +  MathUtil.format(cx-a) + ' ' + MathUtil.format(cy+y) + ' ' + MathUtil.format(cx-a) + ' ' + cy + 
	        ' Z';
	    return str;    
	}
	
	/**
	 * 获取路径数据的矩形边框
	 * @param {String} str
	 * @param {Boolean} only_pts 是否仅仅为了获取点坐标集合
	 * @return {String}
	 */
	static getPathBounds(str,only_pts=false)
	{
		if(StringUtil.isEmpty(str)) return null;

		let points=[],path = str.split(/[a-zA-Z]/);
		for(let i=0,j,p1,p2,s,n,l=path.length;i<l;i++){
			s=path[i];
			if(StringUtil.isEmpty(s)) continue;
			s=ArrayUtil.format(StringUtil.trim(s).split(/,| |-/));
			
			for(j=0,n=s.length;j<n;j+=2){
				p1=s[j];
				p2=s[j+1];
				
				if(!StringUtil.isEmpty(p1) && !StringUtil.isEmpty(p2)) {
					points.push(only_pts ? ObjectPool.create(Point).set(p1,p2) : [p1,p2]);
				}
			}
		}
		
		return only_pts ? points : Rectangle.getPointsBounds(points);
	}	
}

module.exports = ShapeUtil;