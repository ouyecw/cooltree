import ColorUtil from '../utils/ColorUtil.js'
import MathUtil from '../utils/MathUtil.js'

/**
 * @class
 * @module DropShadowFilter
 */
export default class DropShadowFilter
{
	constructor (distance=0, angle=0, blur=0, color="#000000", alpha=1, radius=0)
	{
		this.shadowColor =ColorUtil.formatColor(color);
		this.distance = distance;
		this.shadowBlur = blur;
		this.radius = radius;
		this.angle = angle;
		this.alpha = alpha;
		this.setShadowOffset();
	}
	
	setDistance(distance) 
	{
		this.distance = distance;
		this.setShadowOffset();
	}
	
	setShadowOffset()
	{
		const r=MathUtil.getRadiansFromDegrees(this.angle);
		this.shadowOffsetX = MathUtil.format(this.distance * Math.cos(r));
		this.shadowOffsetY = MathUtil.format(this.distance * Math.sin(r));
	}
	
	show(context)
	{
		if(context==undefined || this.alpha==0 || (this.distance==0 && this.shadowBlur==0)) return;
		let color=(this.alpha<1) ? ColorUtil.colorToRGBA(this.shadowColor,this.alpha) : this.shadowColor;
		context.shadowOffsetX = this.shadowOffsetX;
		context.shadowOffsetY = this.shadowOffsetY;
		context.shadowBlur    = this.shadowBlur;
		context.shadowColor   = color;
	}
	
	clone()
	{
		return new DropShadowFilter (this.distance, this.angle,this.shadowBlur,this.shadowColor,this.alpha,this.radius);
	}
	
	toString()
	{
		return '{"shadowColor":"'+this.shadowColor+'","distance":'+this.distance+',"shadowBlur":'+this.shadowBlur+',"radius":'+this.radius+',"angle":'+this.angle+',"alpha":'+this.alpha+'}';
	}
}

DropShadowFilter.className="DropShadowFilter";
module.exports = DropShadowFilter;