
class GColor
{
	constructor(type,xStart, yStart, xEnd, yEnd, offsetlist, colorList, radiusStart, radiusEnd)
	{
		this.setup(type,xStart, yStart, xEnd, yEnd, offsetlist, colorList, radiusStart, radiusEnd);
	}
	
	/**
	 * 
	 * @param {Number} type 0 Linear Gradient Fill 1 radial Gradient Fill
	 * @param {Number} xStart 渐变的起始点的x坐标。
	 * @param {Number} yStart 渐变的起始点的y坐标。
	 * @param {Number} xEnd   渐变的结束点的x坐标。
	 * @param {Number} yEnd   渐变的结束点的y坐标。
	 * @param {Array} offsetlist  渐变范围数组 offset >=0 And <=1 表示渐变的开始点和结束点之间的范围百分比。
	 * @param {Object} colorList  渐变颜色数组  color 颜色字符串。
	 * @param {Object} radiusStart 渐变开始圆的直径。
	 * @param {Object} radiusEnd   渐变结束圆的直径。
	 */
	setup(type,xStart, yStart, xEnd, yEnd, offsetlist, colorList, radiusStart, radiusEnd)
	{
		this.type=type;
		this.xStart=xStart;
		this.yStart=yStart;
		this.xEnd=xEnd;
		this.yEnd=yEnd;
		this.offsetlist=offsetlist;
		this.colorList=colorList;
		this.radiusStart=radiusStart;
		this.radiusEnd=radiusEnd;
	}
	
	dispose()
	{
		delete this.type,this.xStart,this.yStart,this.xEnd,this.yEnd,this.offsetlist,this.colorList,this.radiusStart,this.radiusEnd;
	}
}
