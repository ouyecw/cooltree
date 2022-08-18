/**
Shine Chen 
s_c@live.com 2015/05/04

===================================================================
Point Class
===================================================================
**/

function Point(x_, y_,z_)
{
	this.set(x_,y_,z_);
}

Object.defineProperty(Point.prototype,"data",{
	get: function (){
		const str=this.toString();
		return JSON.parse(str);
	},
    set: function (value) {
        if(value==undefined || value==null) return;
		ObjectUtil.copyAttribute(this,value,true);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Point.prototype,"radians",{
	get: function ()
	{
		return Math.atan2(this.y,this.x);
	},
	enumerable: true,
    configurable: true
});
	
Point.prototype.rotation=function(radians)
{
	if(radians==0) return;
	radians+=this.radians;
	var value=this.length();
	this.x=MathUtil.format(Math.cos(radians)*value);
	this.y=MathUtil.format(Math.sin(radians)*value);
}

Point.prototype.clone= function() 
{
	return ObjectPool.create(Point).set(this.x, this.y,this.z);
}

Point.prototype.add= function(v) 
{
	this.x += v.x;
	this.y += v.y;
	this.z += (v.z||0);
}

Point.prototype.subtract= function(v) 
{
	this.x -= v.x;
	this.y -= v.y;
	this.z -= v.z;
	return this;
}

Point.prototype.multiply= function(a) 
{
	this.x *= a;
	this.y *= a;
	this.z *= a;
}

Point.prototype.offset= function(dx,dy,dz) 
{
	this.x += dx;
	this.y += dy;
	this.z += dz;
}

Point.prototype.abs= function() 
{
	this.x = Math.abs(this.x);
	this.y = Math.abs(this.y);
	this.z = Math.abs(this.z);
}

Point.prototype.length=function()
{
	return MathUtil.format(Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z));
}

Point.prototype.normalize= function() 
{
	var length = this.length();
	if (length < Number.MIN_VALUE) {
		return 0.0;
	}
	var invLength = 1.0 / length;
	this.x *= invLength;
	this.y *= invLength;
    this.z *= invLength;
    
	return MathUtil.format(length);
}

Point.prototype.min= function(b) 
{
	this.x = this.x < b.x ? this.x : b.x;
	this.y = this.y < b.y ? this.y : b.y;
	this.z = this.z < b.z ? this.z : b.z;
}

Point.prototype.max= function(b) 
{
	this.x = this.x > b.x ? this.x : b.x;
	this.y = this.y > b.y ? this.y : b.y;
	this.z = this.z > b.z ? this.z : b.z;
}

Point.prototype.set= function(x,y,z) 
{
	this.x = MathUtil.format(x || 0);
	this.y = MathUtil.format(y || 0);
	this.z = MathUtil.format(z || 0);
	return this;
}

Point.prototype.equals=function(pt)
{
	return (this.x==pt.x && this.y==pt.y && this.z==pt.z);
}

Point.prototype.toString=function ()
{
	return String('{"x":'+this.x+',"y":'+this.y+',"z":'+this.z+'}');
}

Point.prototype.reset= function() 
{
	this.x = this.y = this.z = 0;
}

//****************************************
// Static Function
//****************************************

Point.distance=function(pointA,pointB)
{
	pointB=pointB||new Point();
	return MathUtil.format(Math.sqrt((pointA.x-pointB.x)*(pointA.x-pointB.x)+(pointA.y-pointB.y)*(pointA.y-pointB.y)+(pointA.hasOwnProperty("z") && pointB.hasOwnProperty("z") ? (pointA.z-pointB.z)*(pointA.z-pointB.z) : 0)));
};

Point.toPoint=function(str)
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
		
	var obj;
	try{
		obj=JSON.parse(str);
	}catch(e){}
	
	return obj ? ObjectPool.create(Point).set(obj.x,obj.y,obj.z) : null;
};

Point.getMiddlePoint=function(point1,point2)
{
	return new Point((point1.x+point2.x)*0.5,(point1.y+point2.y)*0.5,(point1.z+point2.z)*0.5);
};

Point.clamp=function(point,min,max)
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
 */
Point.rotate=function(point,center,radians,is_subtract,is_new)
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
 */
Point.rotateLine=function(length,center,radians,is_subtract)
{
	return Point.rotate(ObjectPool.create(Point).set(center.x+length,center.y),center,radians,is_subtract);
}

/**
 * 缩放点
 * @param {Object} points
 * @param {Number} scaleX
 * @param {Number} scaleY
 */
Point.scale=function(points,scaleX,scaleY)
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
 * @param {Object} points
 * @param {Number} scaleX
 * @param {Number} scaleY
 */
Point.offset=function(points,x,y)
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

Point.matrix=function(points,data)
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
 */
Point.verticalPoint=function(a,b,c)
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
 */
Point.interval=function(a,b,d,on_line)
{
	if(!on_line){
		return (d.x>=Math.min(a.x,b.x) && d.x<=Math.max(a.x,b.x) && d.y>=Math.min(a.y,b.y) && d.y<=Math.max(a.y,b.y));
	}
	
	let a1=b.y-a.y;
	let b1=a.x-b.x;
	let c1=a.x*b.y-b.x*a.y;
	return (a1*d.x+b1*d.y)==c1;
}
