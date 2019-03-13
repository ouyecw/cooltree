/**
 * 计算贝塞尔曲线的工具类。
 */

Bezier=function()
{
	this._controlPoints=[new Point(),new Point(),new Point()];
	this._calFun=this.getPoint2;
}

Bezier.prototype._switchPoint=function(x,y)
{
	var tPoint=this._controlPoints.shift();
	tPoint.setTo(x,y);
	this._controlPoints.push(tPoint);
}

/**
*计算二次贝塞尔点。
*@param t
*@param rst
*
*/
Bezier.prototype.getPoint2=function(t,rst)
{
	var p1=this._controlPoints[0];
	var p2=this._controlPoints[1];
	var p3=this._controlPoints[2];
	var lineX=Math.pow((1-t),2)*p1.x+2 *t *(1-t)*p2.x+Math.pow(t,2)*p3.x;
	var lineY=Math.pow((1-t),2)*p1.y+2 *t *(1-t)*p2.y+Math.pow(t,2)*p3.y;
	rst.push(lineX,lineY);
}

/**
*计算三次贝塞尔点
*@param t
*@param rst
*
*/
Bezier.prototype.getPoint3=function(t,rst)
{
	var p1=this._controlPoints[0];
	var p2=this._controlPoints[1];
	var p3=this._controlPoints[2];
	var p4=this._controlPoints[3];
	var lineX=Math.pow((1-t),3)*p1.x+3 *p2.x *t *(1-t)*(1-t)+3 *p3.x *t *t *(1-t)+p4.x *Math.pow(t,3);
	var lineY=Math.pow((1-t),3)*p1.y+3 *p2.y *t *(1-t)*(1-t)+3 *p3.y *t *t *(1-t)+p4.y *Math.pow(t,3);
	rst.push(lineX,lineY);
}

/**
*计算贝塞尔点序列
*@param count
*@param rst
*
*/
Bezier.prototype.insertPoints=function(count,rst)
{
	var i=NaN;
	count=count > 0 ? count :5;
	var dLen=NaN;
	dLen=1 / count;
	for (i=0;i <=1;i+=dLen){
		this._calFun(i,rst);
	}
}

/**
*获取贝塞尔曲线上的点。
*@param pList 控制点[x0,y0,x1,y1...]
*@param inSertCount 每次曲线的插值数量
*@return
*
*/
Bezier.prototype.getBezierPoints=function(pList,inSertCount,count)
{
	(inSertCount===void 0)&& (inSertCount=5);
	(count===void 0)&& (count=2);
	var i=0,len=0;
	len=pList.length;
	if (len < (count+1)*2)return [];
	var rst;
	rst=[];
	switch (count){
		case 2:
			this._calFun=this.getPoint2;
			break ;
		case 3:
			this._calFun=this.getPoint3;
			break ;
		default :
			return [];
		}
	while (this._controlPoints.length <=count){
		this._controlPoints.push(new Point());
	}
	for (i=0;i < count *2;i+=2){
		this._switchPoint(pList[i],pList[i+1]);
	}
	for (i=count *2;i < len;i+=2){
		this._switchPoint(pList[i],pList[i+1]);
		if ((i / 2)% count==0)
			this.insertPoints(inSertCount,rst);
	}
	return rst;
}

Bezier._static_instance=null;

Bezier.instance=function()
{
	Bezier._static_instance=Bezier._static_instance || new Bezier();
	return Bezier._static_instance;
}