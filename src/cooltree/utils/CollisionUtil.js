
/**
 * @class
 * @module CollisionUtil
 */
export default class CollisionUtil
{
	/**
	 * 检测显示对象obj是否与点x，y发生了碰撞。
	 * @param {DisplayObject} obj 要检测的显示对象 或者数据。
	 * @param {Number} x 指定碰撞点的x坐标。
	 * @param {Number} y 指定碰撞点的y坐标。
	 * @param {Boolean} usePolyCollision 指定是否采用多边形碰撞。默认为false。
	 * @return {Number} 如果点x，y在对象obj内为1，在外为-1，在边上为0。
	 */
	static hitTestPoint (obj, x, y, usePolyCollision)
	{
		let b = obj.getBounds ? obj.getBounds(obj.stage) : obj, len = b.length;
		let hit = x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height;
		
		if(hit && usePolyCollision && len)
		{
			let cross = 0, onBorder = false, minX, maxX, minY, maxY;		
			for(let i = 0; i < len; i++)
			{
				let p1 = b[i], p2 = b[(i+1)%len];			
				
				if(p1.y == p2.y && y == p1.y)
				{
					p1.x > p2.x ? (minX = p2.x, maxX = p1.x) : (minX = p1.x, maxX = p2.x);
					if(x >= minX && x <= maxX)
					{
						onBorder = true;
						continue;
					}
				}
				
				p1.y > p2.y ? (minY = p2.y, maxY = p1.y) : (minY = p1.y, maxY = p2.y);
				if(y < minY || y > maxY) continue;
				
				let nx = (y - p1.y)*(p2.x - p1.x) / (p2.y - p1.y) + p1.x;
				if(nx > x) cross++;
				else if(nx == x) onBorder = true;			
			}
			
			if(onBorder) return 0;
			else if(cross % 2 == 1) return 1;
			return -1;
		}
		return hit ? 1 : -1;
	};
	
	/**
	 * 检测显示对象obj1和obj2是否发生了碰撞。
	 * @param {DisplayObject} obj1 要检测的显示对象。
	 * @param {DisplayObject} obj2 要检测的显示对象。
	 * @param {Boolean} usePolyCollision 指定是否采用多边形碰撞。默认为false。
	 * @return {Boolean} 发生碰撞为true，否则为false。
	 */
	static hitTestObject (obj1, obj2, usePolyCollision)
	{
		let b1 = obj1.getBounds(obj1.stage), b2 = obj2.getBounds(obj2.stage);
		let hit = b1.x <= b2.x + b2.width && b2.x <= b1.x + b1.width && 
					   b1.y <= b2.y + b2.height && b2.y <= b1.y + b1.height;
		
		if(hit && usePolyCollision)
		{
			hit = CollisionUtil.polygonCollision(b1, b2);
			return hit !== false;
		}
		return hit;
	};
	
	/**
	 * 采用Separating Axis Theorem(SAT)的多边形碰撞检测方法。
	 * @private
	 * @param {Array} poly1 多边形顶点组成的数组。格式如：[{x:0, y:0}, {x:10, y:0}, {x:10, y:10}, {x:0, y:10}]。
	 * @param {Array} poly2 多边形顶点组成的数组。格式与参数poly1相同。
	 * @param {Boolean} 发生碰撞为true，否则为false。 
	 */
	static polygonCollision (poly1, poly2)
	{	
		let result = CollisionUtil._doSATCheck(poly1, poly2, {overlap:-Infinity, normal:{x:0, y:0}});
		if(result) return CollisionUtil._doSATCheck(poly2, poly1, result);
		return false;
	};
	
	static _doSATCheck  (poly1, poly2, result)
	{
		let len1 = poly1.length, len2 = poly2.length, currentPoint, nextPoint, distance, min1, max1, min2, max2, dot, overlap, normal = {x:0, y:0};
		
		for(let i = 0; i < len1; i++)
		{
			currentPoint = poly1[i];
			nextPoint = poly1[(i < len1-1 ? i+1 : 0)];
			
			normal.x = currentPoint.y - nextPoint.y;
			normal.y = nextPoint.x - currentPoint.x;
			
			distance = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
			normal.x /= distance;
			normal.y /= distance;
			
			min1 = max1 = poly1[0].x * normal.x + poly1[0].y * normal.y;		
			for(let j = 1; j < len1; j++)
			{
				dot = poly1[j].x * normal.x + poly1[j].y * normal.y;
				if(dot > max1) max1 = dot;
				else if(dot < min1) min1 = dot;
			}
			
			min2 = max2 = poly2[0].x * normal.x + poly2[0].y * normal.y;		
			for(j = 1; j < len2; j++)
			{
				dot = poly2[j].x * normal.x + poly2[j].y * normal.y;
				if(dot > max2) max2 = dot;
				else if(dot < min2) min2 = dot;
			}
			
			if(min1 < min2)
			{
				overlap = min2 - max1;
				normal.x = -normal.x;
				normal.y = -normal.y;
			}else
			{
				overlap = min1 - max2;
			}
			
			if(overlap >= 0)
			{
				return false;
			}else if(overlap > result.overlap)
			{
				result.overlap = overlap;
				result.normal.x = normal.x;
				result.normal.y = normal.y;
			}
		}
		
		return result;
	}
	
	static isInPolygon(checkPoint, polygonPoints) 
	{
	    let counter = 0,i,xinters,p1, p2;
	    const pointCount = polygonPoints.length;
	    p1 = polygonPoints[0];
	 
	    for (i = 1; i <= pointCount; i++) {
	        p2 = polygonPoints[i % pointCount];
	        if (
	            checkPoint.x > Math.min(p1.x, p2.x) &&
	            checkPoint.x <= Math.max(p1.x, p2.x)
	        ) {
	            if (checkPoint.y <= Math.max(p1.y, p2.y)) {
	                if (p1.x != p2.x) {
	                    xinters = (checkPoint.x - p1.x) *(p2.y - p1.y) / (p2.x - p1.x) + p1.y;
	                    if (p1.y == p2.y || checkPoint.y <= xinters) {
	                        counter++;
	                    }
	                }
	            }
	        }
	        p1 = p2;
	    }
	    
		return (counter % 2 != 0);
	}
}
