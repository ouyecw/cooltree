/**
===================================================================
Matrix Class
===================================================================
**/

class Matrix
{
	constructor(a=1, b=0, c=0, d=1, tx=0, ty=0)
	{
		this.a = this.d = 1;
		this.b = this.c = this.tx = this.ty = 0;
		this.setup(a, b, c, d, tx, ty);
	}
	
	get data()
	{
		return JSON.parse(this.toString());
	}
	
	set data(value)
	{
		if(value==undefined || value==null) return;
		ObjectUtil.copyAttribute(this,value,true);
	}
	
	setup(a, b, c, d, tx, ty)
	{
		this.a=a != undefined ? a : 1;
		this.b=b != undefined ? b : 0;
		this.c=c != undefined ? c : 0;
		this.d=d != undefined ? d : 1;
		this.tx=tx != undefined ? tx : 0;
		this.ty=ty != undefined ? ty : 0;
		return this;
	}
	
	concatTransform(posX, posY,scaleX,scaleY,rotation,regX,regY,skewX,skewY)
	{
		let cos = 1, sin = 0;
		if(rotation%360 != 0)
		{
			cos = MathUtil.cos(rotation);
			sin = MathUtil.sin(rotation);
		}
		
		if(regX != 0) this.tx -= regX;
		if(regY != 0) this.ty -= regY;
	
	    if (skewX || skewY) {
	        this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
	        this.prepend(MathUtil.cos(skewY), MathUtil.sin(skewY), -MathUtil.sin(skewX), MathUtil.cos(skewX), posX, posY);
	    }
	    else this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, posX, posY);
	}
	
	prepend(a, b, c, d, tx, ty) 
	{
	    let tx1 = this.tx;
	    if (a != 1 || b != 0 || c != 0 || d != 1) {
	        let a1 = this.a;
	        let c1 = this.c;
	        this.a = a1 * a + this.b * c;
	        this.b = a1 * b + this.b * d;
	        this.c = c1 * a + this.d * c;
	        this.d = c1 * b + this.d * d;
	    }
	    this.tx = tx1 * a + this.ty * c + tx;
	    this.ty = tx1 * b + this.ty * d + ty;
	    return this;
	}
	
	append(a, b, c, d, tx, ty) 
	{
	    let a1 = this.a;
	    let b1 = this.b;
	    let c1 = this.c;
	    let d1 = this.d;
	    if (a != 1 || b != 0 || c != 0 || d != 1) {
	        this.a = a * a1 + b * c1;
	        this.b = a * b1 + b * d1;
	        this.c = c * a1 + d * c1;
	        this.d = c * b1 + d * d1;
	    }
	    this.tx = tx * a1 + ty * c1 + this.tx;
	    this.ty = tx * b1 + ty * d1 + this.ty;
	    return this;
	}
	
	concat(m)
	{
		let ma = m.a;
	    let mb = m.b;
	    let mc = m.c;
	    let md = m.d;
	    let tx1 = this.tx;
	    let ty1 = this.ty;
	
	    if (ma != 1 || mb != 0 || mc != 0 || md != 1) {
	        let a1 = this.a;
	        let b1 = this.b;
	        let c1 = this.c;
	        let d1 = this.d;
	
	        this.a = a1 * ma + b1 * mc;
	        this.b = a1 * mb + b1 * md;
	        this.c = c1 * ma + d1 * mc;
	        this.d = c1 * mb + d1 * md;
	    }
	    this.tx = tx1 * ma + ty1 * mc + m.tx;
	    this.ty = tx1 * mb + ty1 * md + m.ty;
		return this;
	}
	
	rotate(angle)
	{
		let cos = Math.cos(angle);
		let sin = Math.sin(angle);
		
		let a = this.a;
		let c = this.c;
		let tx = this.tx;
		
		this.a = a * cos - this.b * sin;
		this.b = a * sin + this.b * cos;
		this.c = c * cos - this.d * sin;
		this.d = c * sin + this.d * cos;
		this.tx = tx * cos - this.ty * sin;
		this.ty = tx * sin + this.ty * cos;
		return this;
	}
	
	scale(sx, sy)
	{
		this.a *= sx;
		this.d *= sy;
		this.tx *= sx;
		this.ty *= sy;
		return this;
	}
	
	translate(dx, dy)
	{
		this.tx += dx;
		this.ty += dy;
		return this;
	}
	
	invert()
	{
		let a = this.a;
		let b = this.b;
		let c = this.c;
		let d = this.d;
		let tx = this.tx;
		let i = a * d - b * c;
		
		this.a = d / i;
		this.b = -b / i;
		this.c = -c / i;
		this.d = a / i;
		this.tx = (c * this.ty - d * tx) / i;
		this.ty = -(a * this.ty - b * tx) / i;
		return this;
	}
	
	transformPoint(point, round, returnNew)
	{
		let x = point.x * this.a + point.y * this.c + this.tx;
		let y =	point.x * this.b + point.y * this.d + this.ty;
		if(round)
		{
			x = x + 0.5 >> 0;
			y = y + 0.5 >> 0;
		}
		if(returnNew) return new Point(x,y);
		point.x = x;
		point.y = y;
		return point;
	}
	
	/**
	 * @param {DisplayBase} target
	 */
	applyDisplay(target)
	{
		if(target==undefined) target={};
		
	    let mSkewX = Math.atan(-this.c / this.d);
	    let mSkewY = Math.atan( this.b / this.a);
	    
	    target.x=this.tx;
		target.y=this.ty;
	
		target.scaleX=(mSkewY > -Matrix.PI_Q && mSkewY < Matrix.PI_Q) ?  this.a / Math.cos(mSkewY) :  this.b / Math.sin(mSkewY);
		target.scaleY=(mSkewX > -Matrix.PI_Q && mSkewX < Matrix.PI_Q) ?  this.d / Math.cos(mSkewX) : -this.c / Math.sin(mSkewX);
		target.rotation=MathUtil.isEquivalent(mSkewX, mSkewY) ? MathUtil.getDegreesFromRadians(mSkewX) : 0;
		return target;
	}
	
	clone()
	{
		return ObjectPool.create(Matrix).setup(this.a, this.b, this.c, this.d, this.tx, this.ty);
	}
	
	toString()
	{
		return '{"a":' + this.a + ',"b":' + this.b + ',"c":' + this.c + ',"d":' + this.d + ',"tx":' + this.tx + ',"ty":' + this.ty + "}";
	}
	
	toCSS()
	{
		return "matrix("+this.a+","+this.b+","+this.c+","+this.d+","+this.tx+","+this.ty+")";
	}
	
	reset(a=1, b=0, c=0, d=1, tx=0, ty=0)
	{
		return this.setup(a, b, c, d, tx, ty);
	}
	
	dispose()
	{
		delete this.a, this.b, this.c, this.d, this.tx, this.ty;
	}

	
}

Matrix.PI_Q = Math.PI / 4.0;