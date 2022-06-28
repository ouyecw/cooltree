import MathUtil from '../utils/MathUtil.js'

/**
 * @class
 * @module Vector
 */
export default class Vector
{
	constructor(_x=0, _y=0)
	{
		this.x=_x;
		this.y=_y;
	}
	
	/**
	 * 赋值
	 */
	set(_x=0, _y=0)
	{
		this.x=_x;
		this.y=_y;
	}
	
	/**
	 * 向量相加
	 * @param {Object} v
	 */
	add(v)
	{
		this.x += v.x;
		this.y += v.y;
		
		return this;
	}
	
	/**
	 * 向量相减
	 * @param {Object} v
	 */
	sub(v)
	{
		this.x -= v.x;
		this.y -= v.y;
		
		return this;
	}
	
	/**
	 * 向量缩放（相乘）
	 * @param {Object} s
	 */
	mul(s)
	{
		this.x *= s;
		this.y *= s;
		
		return this;
	}
	
	/**
	 * 向量缩放（相除）
	 * @param {Object} s
	 */
	div(s)
	{
		!s && console.log("Division by zero!");
		
		this.x /= s;
		this.y /= s;
		
		return this;
	}
	
	/**
	 * 向量长度
	 */
	mag()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	
	/**
	 * 向量标准化(即长度为1的向量)
	 */
	normalize()
	{
		const mag = this.mag();
		mag && this.div(mag);
		return this;
	}
	
	/**
	 * 向量角度
	 */
	angle()
	{
		return Math.atan2(this.y, this.x);
	}
	
	/**
	 * 设置向量长度
	 * @param {Object} m
	 */
	setMag(m)
	{
		const angle = this.angle();
		this.x = m * Math.cos(angle);
		this.y = m * Math.sin(angle);
		return this;
	}
	
	/**
	 * 设置向量角度
	 * @param {Object} a
	 */
	setAngle(a)
	{
		var mag = this.mag();
		this.x = mag * Math.cos(a);
		this.y = mag * Math.sin(a);
		return this;
	}
	
	/**
	 * 向量旋转一个角度
	 * @param {Object} a
	 */
	rotate(a)
	{
		this.setAngle(this.angle() + a);
		return this;
	}
	
	/**
	 * 限制向量长度
	 * @param {Object} l
	 */
	limit(max,min=0)
	{
		const mag = this.mag();
		this.setMag(MathUtil.clamp(mag,min,max));
		return this;
	}
	
	/**
	 * 两个向量夹角
	 * @param {Object} v
	 */
	angleBetween(v)
	{
		return this.angle() - v.angle();
	}
	
	/**
	 * 向量相乘
	 * @param {Object} v
	 */
	dot(v)
	{
		return this.x * v.x + this.y * v.y;
	}
	
	/**
	 * 向另一个向量移动
	 * @param {Object} v
	 * @param {Object} amt 移动百分比
	 */
	lerp(v, amt)
	{
		this.x += (v.x - this.x) * amt;
		this.y += (v.y - this.y) * amt;
		return this;
	}
	
	/**
	 * 两个向量之间的距离
	 * @param {Object} v
	 */
	dist(v)
	{
		const dx = this.x - v.x;
		const dy = this.y - v.y;
		return Math.sqrt(dx * dx + dy * dy);
	}
	
	/**
	 * 生成随机角度的向量
	 */
	random()
	{
		this.set(1,1);
		this.setAngle(Math.random() * Math.PI * 2);
		return this;
	}
	
	clone()
	{
		return new Vector(this.x, this.y);
	}
}