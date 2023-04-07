/**
Shine Chen 
s_c@live.com 2015/05/04

===================================================================
Point Class
===================================================================
**/
import MathUtil from '../utils/MathUtil.js'
import ObjectUtil from '../utils/ObjectUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import StringUtil from '../utils/StringUtil.js'

/**
 * @class
 * @module Point
 */
export default class Point
{
	/**
	 * 新建点实例
	 * @param {Number} x 点x坐标
	 * @param {Number} y 点y坐标
	 * @param {Number} z 点z坐标
	 */
	constructor(x_=0, y_=0,z_=0)
	{
		this.y=this.x=this.z=0;
		this.set(x_,y_,z_);
	}
	
	set data(value)
	{
		if(value==undefined || value==null) return;
		ObjectUtil.copyAttribute(this,value,true);
	}
	
	get data()
	{
		const str=this.toString();
		return JSON.parse(str);
	}
	
	/**
	 * 返回点向量角弧度
	 * @return {Number}
	 */
	get radians()
	{
		return Math.atan2(this.y,this.x);
	}
	
	/**
	 * 点向量按照弧度旋转
	 * @param {Number} radians 旋转弧度
	 */
	rotation(radians)
	{
		if(radians==0) return;
		radians+=this.radians;
		let value=this.length();
		this.x=MathUtil.format(Math.cos(radians)*value);
		this.y=MathUtil.format(Math.sin(radians)*value);
	}
	
	/**
	 * 克隆点
	 * @return {Point}
	 */
	clone() 
	{
		return ObjectPool.create(Point).set(this.x, this.y,this.z);
	}
	
	/**
	 * 点相加
	 * @param {Point} v 
	 */
	add(v) 
	{
		this.x += v.x;
		this.y += v.y;
		this.z += (v.z||0);
	}
	
	/**
	 * 点相减
	 * @param {Point} v 
	 * @return {Point}
	 */
	subtract(v) 
	{
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}
	
	/**
	 * 点相乘
	 * @param {Point} v 
	 */
	multiply(a) 
	{
		this.x *= a;
		this.y *= a;
		this.z *= a;
	}
	
	/**
	 * 增加坐标差值
	 * @param {Number} dx
	 * @param {Number} dy
	 * @param {Number} dz
	 */
	offset(dx,dy,dz) 
	{
		this.x += dx;
		this.y += dy;
		this.z += dz;
	}
	
	/**
	 * 坐标取正数
	 */
	abs() 
	{
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
		this.z = Math.abs(this.z);
	}
	
	/**
	 * 点向量长度
	 * @return {Number}
	 */
	length()
	{
		return MathUtil.format(Math.hypot(this.x,this.y,this.z));
	}
	
	/**
	 * 标准化
	 */
	normalize() 
	{
		let length = this.length();
		if (length < Number.MIN_VALUE) {
			return 0.0;
		}
		let invLength = 1.0 / length;
		this.x *= invLength;
		this.y *= invLength;
	    this.z *= invLength;
	    
		return MathUtil.format(length);
	}
	
	/**
	 * 最小点值
	 * @param {Point} b
	 */
	min(b) 
	{
		this.x = this.x < b.x ? this.x : b.x;
		this.y = this.y < b.y ? this.y : b.y;
		this.z = this.z < b.z ? this.z : b.z;
	}
	
	/**
	 * 最大点值
	 * @param {Point} b
	 */
	max(b) 
	{
		this.x = this.x > b.x ? this.x : b.x;
		this.y = this.y > b.y ? this.y : b.y;
		this.z = this.z > b.z ? this.z : b.z;
	}
	
	/**
	 * 设置点实例
	 * @param {Number} x 点x坐标
	 * @param {Number} y 点y坐标
	 * @param {Number} z 点z坐标
	 */
	set(x,y,z) 
	{
		this.x = MathUtil.format(x || 0);
		this.y = MathUtil.format(y || 0);
		this.z = MathUtil.format(z || 0);
		return this;
	}
	
	/**
	 * 点是否相等
	 * @param {Point} pt
	 * @return {Boolean}
	 */
	equals(pt)
	{
		return (this.x==pt.x && this.y==pt.y && this.z==pt.z);
	}
	
	/**
	 * 字符串
	 */
	toString ()
	{
		return String('{"x":'+this.x+',"y":'+this.y+',"z":'+this.z+'}');
	}
	
	/**
	 * 重置点实例
	 * @param {Number} x 点x坐标
	 * @param {Number} y 点y坐标
	 * @param {Number} z 点z坐标
	 */
	reset(x_=0, y_=0,z_=0) 
	{
		this.set(x_,y_,z_);
	}
	
	//****************************************
	// Static Function
	//****************************************
	
	/**
	 * 返回两点间的距离
	 * @param {Point} pointA 
	 * @param {Point} pointB
	 * @return {Number}
	 */
	static distance(pointA,pointB=new Point())
	{
		return Math.hypot(pointA.x-pointB.x,pointA.y-pointB.y,(pointA.hasOwnProperty("z") && pointB.hasOwnProperty("z") ? pointA.z-pointB.z : 0));
	}
	
	/**
	 * 字符串转点实例
	 * @param {String} str
	 */
	static toPoint(str)
	{	
		if(str && str instanceof Array && str.length){
			return ObjectPool.create(Point).set(str[0],str.length>1 ? str[1] : 0,str.length>2 ? str[2] : 0);
		}
		
		if(StringUtil.isEmpty(str)) return null;
		
		str=str.toLocaleLowerCase();
		if(str.indexOf("x")==-1) {
			str=StringUtil.replaceAll(str,['(',')','{','}'],['','','','']);
			str=str.split(",");
			str='{"x":'+str[0]+',"y":'+str[1]+(str.length>2 ? ',"z":'+str[2] : '')+'}';
		}
		else str=StringUtil.replaceAll(str,['(',')','x','y','z','='],['{','}','"x"','"y"','"z"',':']);
			
		let obj;
		try{
			obj=JSON.parse(str);
		}catch(e){}
		
		return obj ? ObjectPool.create(Point).set(obj.x,obj.y,obj.z) : null;
	}
	
	/**
	 * 返回两点间的中间点
	 * @param {Point} point1
	 * @param {Point} point2
	 * @return {Point}
	 */
	static getMiddlePoint(point1,point2)
	{
		return new Point((point1.x+point2.x)*0.5,(point1.y+point2.y)*0.5,(point1.z+point2.z)*0.5);
	}
	
	/**
	 * 点坐标设置最小和最大值
	 * @param {Point} point
	 * @param {Number} min
	 * @param {Number} max
	 * @return {Point}
	 */
	static clamp(point,min,max)
	{
		if(min>0 && (Math.abs(point.x)<min || Math.abs(point.y)<min)){
			if(Math.abs(point.x)<Math.abs(point.y)){
				point.y=point.y*min/Math.abs(point.x);
				point.x=(point.x>=0 ? 1 :-1)*min;
			}else{
				point.x=point.x*min/Math.abs(point.y);
				point.y=(point.y>=0 ? 1 :-1)*min;
			}
		}
		
		if(max>0 && (Math.abs(point.x)>max || Math.abs(point.y)>max)){
			if(Math.abs(point.x)>Math.abs(point.y)){
				point.y=point.y*max/Math.abs(point.x);
				point.x=(point.x>=0 ? 1 :-1)*max;
			}else{
				point.x=point.x*max/Math.abs(point.y);
				point.y=(point.y>=0 ? 1 :-1)*max;
			}
		}
		
		return point;
	}
	
	/**
	 * point点围绕center点旋转radians弧度
	 * @param {Point} point 当前点
	 * @param {Point} center 中心点
	 * @param {Number} radians 弧度
	 * @param {Boolean} is_subtract (true逆时针 false顺时针)
	 * @param {Boolean} is_new 最后返回一个新生成的点
	 * @return {Point}
	 */
	static rotate(point,center,radians,is_subtract,is_new)
	{
		if(!point || !center || !radians) return point;
		let length=Point.distance(point,center);
		if(length==0) return point;
		
		let old=ObjectPool.create(Point).set(point.x-center.x,point.y-center.y);
		let posX=center.x+length*Math.cos(old.radians+radians*(is_subtract ? -1 : 1));
		let posY=center.y+length*Math.sin(old.radians+radians*(is_subtract ? -1 : 1));
		
		if(!is_new){
			ObjectPool.remove(old);
			
			point.x=posX;
			point.y=posY;
		}
		else old.set(posX,posY);
		
		return is_new ? old : point;
	}
	
	/**
	 * 围绕中心点指定半径旋转生成点
	 * @param {Number} length 半径
	 * @param {Point} center 中心点
	 * @param {Number} radians 弧度数
	 * @param {Boolean} is_subtract (true逆时针 false顺时针)
	 * @return {Point}
	 */
	static rotateLine(length,center,radians,is_subtract)
	{
		return Point.rotate(ObjectPool.create(Point).set(center.x+length,center.y),center,radians,is_subtract);
	}
	
	/**
	 * 缩放点
	 * @param {Array} points 
	 * @param {Number} scaleX
	 * @param {Number} scaleY
	 */
	static scale(points,scaleX,scaleY)
	{
		if(!points || (scaleX==1 && scaleY==1)) return points;
		points=(points instanceof Array ? points : [points]);
		for(let i=0,p,l=points.length;i<l;i++){
			p=points[i];
			if(!p) continue;
			p.x *= scaleX;
			p.y *= scaleY;
		}
	}
	
	/**
	 * 移动点
	 * @param {Array} points
	 * @param {Number} scaleX
	 * @param {Number} scaleY
	 */
	static offset(points,x,y)
	{
		if(!points || (x==0 && y==0)) return points;
		points=(points instanceof Array ? points : [points]);
		for(let i=0,p,l=points.length;i<l;i++){
			p=points[i];
			if(!p) continue;
			p.x +=x;
			p.y +=y;
		}
	}
	
	/**
	 * 点集合根据数据调整坐标
	 * @param {Array} points
	 * @param {Object} data 数据例如{x:0,y:0,scaleX:1,scaleY:1,rotation:0,center:{x:0,y:0}}
	 */
	static matrix(points,data)
	{
		if(!points || !data) return;
		points=(points instanceof Array ? points : [points]);
		Point.scale(points,data.scaleX,data.scaleY);
		
		for(let i=0,p,l=points.length;i<l;i++){
			p=points[i];
			if(!p) continue;
			Point.rotate(p,data.center,MathUtil.getRadiansFromDegrees(data.rotation));
			p.x = MathUtil.format(p.x+data.x);
			p.y = MathUtil.format(p.y+data.y);
		}
	}
	
	/**
	 * a,b点为一直线，c,d点为垂直与ab的直线，d点为交点
	 * @param {Point} a
	 * @param {Point} b
	 * @param {Point} c
	 * @return {Point} 
	 */
	static verticalPoint(a,b,c)
	{
		let a1=b.y-a.y;
		let b1=a.x-b.x;
		let c1=b.x*a.y-a.x*b.y;
		
		if((a1*c.x+b1*c.y)==-c1) return c;
		if(b.y==a.y) return ObjectPool.create(Point).set(c.x,a.y);
		let k=(a.x-b.x)/(b.y-a.y);
		
		let a2=k;
		let b2=-1;
		let c2=(c.y-k*c.x);
		
		let z=a1*b2-a2*b1;
		let x=(b1*c2-b2*c1)/z;
		let y=(a2*c1-a1*c2)/z;
		
		return ObjectPool.create(Point).set(x,y);
	}
	
	/**
	 * on_line=false d点是否在a,b两点区间
	 * on_line=true  d点是否在a,b直线上
	 * @param {Point} a
	 * @param {Point} b
	 * @param {Point} d
	 * @param {Boolean} on_line
	 * @return {Boolean}
	 */
	static interval(a,b,d,on_line)
	{
		if(!on_line){
			return (d.x>=Math.min(a.x,b.x) && d.x<=Math.max(a.x,b.x) && d.y>=Math.min(a.y,b.y) && d.y<=Math.max(a.y,b.y));
		}
		
		let a1=b.y-a.y;
		let b1=a.x-b.x;
		let c1=a.x*b.y-b.x*a.y;
		return (a1*d.x+b1*d.y)==c1;
	}
	
	/**
	 * 交叉点 求直线1与直线2的交叉点
	 * @param line1_p1 直线1的A点
	 * @param line1_p2 直线1的B点
	 * @param line2_p1 直线2的A点
	 * @param line2_p2 直线2的B点
	 * @return {Point}
	 */
	static intersection(line1_p1,line1_p2,line2_p1,line2_p2)
	{
		const a1=line1_p2.y-line1_p1.y;
		const b1=line1_p1.x-line1_p2.x;
		const c1=line1_p2.x*line1_p1.y-line1_p1.x*line1_p2.y;
	
		const a2=line2_p2.y-line2_p1.y;
		const b2=line2_p1.x-line2_p2.x;
		const c2=line2_p2.x*line2_p1.y-line2_p1.x*line2_p2.y;
	
		return {x:(b1*c2-b2*c1)/(a1*b2-a2*b1),y:(a2*c1-a1*c2)/(a1*b2-a2*b1)};
	}
	
	/**
	 * 将连续线扩展offsetx2成图形
	 * @param {Array} dots      连续点
	 * @param {Number} offset   扩大尺寸
	 * @return {Array}
	 */
	static lineExpandArea(dots,offset)
	{
		if(!dots || dots.length<2) return null;
		
		let i,j,dot,next,pos,left,right;
		let return_dots=[];
		
		const len=dots.length;
		const temp=[];
		
		for(i=0;i<len;i++){
		    if(i>=len-1) break;
		
		    dot=dots[i];
		    next=dots[i+1];
		    
		    j=i==0 ? (i+1==len-1 ? 3 : 1) :(i+1==len-1 ? 2 : 0);
		    pos=Point._expand_point(dot,next,j,left,right,offset);
		    
		    temp.push(pos[0]);
		    return_dots.push(pos[1]);
		
		    if(pos.length<3) {
		        left.a=left.b;
		        left.b=pos[0];
		
		        right.a=right.b;
		        right.b=pos[1];
		        continue;
		    }
		    
		    temp.push(pos[2]);
		    return_dots.push(pos[3]);
		
		    left={a:pos[0],b:pos[2]};
		    right={a:pos[1],b:pos[3]};
		}
		
		temp.reverse();
		return_dots=return_dots.concat(temp);
		
		return return_dots;
	}
	
	/**
	 * @param {Point}  start  开始点
	 * @param {Point}  end    结束点
	 * @param {Number} type   1开始点，2结束点,3同时存在，0中间点
	 * @param {Object} left   左侧线
	 * @param {Object} right  右侧线
	 * @param {Number} offset 扩大尺寸
	 * @return {Array}
	 */
	static _expand_point(start,end,type,left,right,offset)
    {
		const radians=Math.atan2(end.y-start.y,end.x-start.x);
		
		if(type==1 || type==3) start=Point.rotateLine(offset,start,radians+Math.PI,false);
		end=Point.rotateLine(offset,end,radians,false);
		
		const return_dots=[];
		const left_start=Point.rotateLine(offset,start,Math.PI*0.5+radians,false);
		const right_start=Point.rotateLine(offset,start,Math.PI*0.5-radians,true);
		
		const left_end=Point.rotateLine(offset,end,radians+Math.PI*0.5,false);
		const right_end=Point.rotateLine(offset,end,Math.PI*0.5-radians,true);
		
		let cross_pos;
		
		if(left) {
		    cross_pos=Point.intersection(left.a,left.b,left_start,left_end);
		    left.b.x=cross_pos.x;
		    left.b.y=cross_pos.y;
		}
		
		if(right) {
		    cross_pos=Point.intersection(right.a,right.b,right_start,right_end);
		    right.b.x=cross_pos.x;
		    right.b.y=cross_pos.y;
		}
		
		if(type==1 || type==3){
		    return_dots.push(left_start);
		    return_dots.push(right_start);
		}
		
		return_dots.push(left_end);
		return_dots.push(right_end);
		return return_dots;
	}
}

Point.className="Point";