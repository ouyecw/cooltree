
import DisplayObject from '../display/DisplayObject.js'
import Graphics from '../display/Graphics.js'

/**
 * @class
 * @module DrawUtil
 */
export default class DrawUtil
{
	static rect(rect,target,color,alpha)
	{
		if(!target || (!(target instanceof DisplayObject) && !(target instanceof Graphics))) return;
		
		let temp;
		if(target instanceof DisplayObject) {
			temp=target;
			target=target.graphics;
		}
	
		color  = color || "#000000";
		alpha  = alpha || 1;
		
		target.clear();
		target.lineStyle(1,color,alpha);
		target.beginFill(color,alpha);
		target.drawRect(rect.hasOwnProperty("x") ? rect.x : 0,rect.hasOwnProperty("y") ? rect.y : 0,rect.width,rect.height);
		target.endFill();
		
		return temp || target;
	}
	
	static roundRect(rect,radius,target,color,alpha)
	{
		if(!target || (!(target instanceof DisplayObject) && !(target instanceof Graphics))) return;
		
		let temp;
		if(target instanceof DisplayObject) {
			temp=target;
			target=target.graphics;
		}
	
		color  = color || "#000000";
		alpha  = alpha || 1;
		
		target.clear();
		target.lineStyle(1,color,alpha);
		target.beginFill(color,alpha);
		target.drawRoundRect(rect.hasOwnProperty("x") ? rect.x : 0,rect.hasOwnProperty("y") ? rect.y : 0,rect.width,rect.height,radius);
		target.endFill();
		
		return temp || target;
	}
	
	static circle(point,radius,target,color,alpha)
	{
		if(!target || (!(target instanceof DisplayObject) && !(target instanceof Graphics))) return;
		
		let temp;
		if(target instanceof DisplayObject) {
			temp=target;
			target=target.graphics;
		}
	
		color  = color || "#000000";
		alpha  = alpha || 1;
		
		target.clear();
		target.lineStyle(1,color,alpha);
		target.beginFill(color,alpha);
		target.drawCircle(point.hasOwnProperty("x") ? point.x : 0,point.hasOwnProperty("y") ? point.y : 0,radius);
		target.endFill();
		
		return temp || target;
	}
}

module.exports = DrawUtil;
