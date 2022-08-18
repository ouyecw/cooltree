/**
 * 凸包算法
 */

GrahamScan={};

GrahamScan._mPointList=null;
GrahamScan._tempPointList=[];
GrahamScan._temPList=[];
GrahamScan._temArr=[];

GrahamScan.multiply=function(p1,p2,p0)
{
	return ((p1.x-p0.x)*(p2.y-p0.y)-(p2.x-p0.x)*(p1.y-p0.y));
}

GrahamScan.dis=function(p1,p2)
{
	return (p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y);
}

GrahamScan._getPoints=function(count,tempUse,rst)
{
	(tempUse===void 0)&& (tempUse=false);
	if (!GrahamScan._mPointList)GrahamScan._mPointList=[];
	while (GrahamScan._mPointList.length < count)GrahamScan._mPointList.push(new Point());
	if (!rst)rst=[];
	rst.length=0;
	if (tempUse){
		GrahamScan.getFrom(rst,GrahamScan._mPointList,count);
		}else {
		GrahamScan.getFromR(rst,GrahamScan._mPointList,count);
	}
	return rst;
}

GrahamScan.getFrom=function(rst,src,count)
{
	var i=0;
	for (i=0;i < count;i++){
		rst.push(src[i]);
	}
	return rst;
}

GrahamScan.getFromR=function(rst,src,count)
{
	var i=0;
	for (i=0;i < count;i++){
		rst.push(src.pop());
	}
	return rst;
}

GrahamScan.pListToPointList=function(pList,tempUse)
{
	(tempUse===void 0)&& (tempUse=false);
	var i=0,len=pList.length / 2,rst=GrahamScan._getPoints(len,tempUse,GrahamScan._tempPointList);
	for (i=0;i < len;i++){
		rst[i].setTo(pList[i+i],pList[i+i+1]);
	}
	return rst;
}

GrahamScan.pointListToPlist=function(pointList)
{
	var i=0,len=pointList.length,rst=GrahamScan._temPList,tPoint;
	rst.length=0;
	for (i=0;i < len;i++){
		tPoint=pointList[i];
		rst.push(tPoint.x,tPoint.y);
	}
	return rst;
}

GrahamScan.scanPList=function(pList)
{
	return ArrayUtil.copyArray(pList,GrahamScan.pointListToPlist(GrahamScan.scan(GrahamScan.pListToPointList(pList,true))));
}

GrahamScan.scan=function(PointSet)
{
	var i=0,j=0,k=0,top=2,tmp,n=PointSet.length,ch;
	var _tmpDic={};
	var key;
	ch=GrahamScan._temArr;
	ch.length=0;
	n=PointSet.length;
	for (i=n-1;i >=0;i--){
		tmp=PointSet[i];
		key=tmp.x+"_"+tmp.y;
		if (!_tmpDic.hasOwnProperty(key)){
			_tmpDic[key]=true;
			ch.push(tmp);
		}
	}
	n=ch.length;
	ArrayUtil.copyArray(PointSet,ch);
	for (i=1;i < n;i++)
	if ((PointSet[i].y < PointSet[k].y)|| ((PointSet[i].y==PointSet[k].y)&& (PointSet[i].x < PointSet[k].x)))
		k=i;
	tmp=PointSet[0];
	PointSet[0]=PointSet[k];
	PointSet[k]=tmp;
	for (i=1;i < n-1;i++){
		k=i;
		for (j=i+1;j < n;j++)
		if ((GrahamScan.multiply(PointSet[j],PointSet[k],PointSet[0])> 0)|| ((GrahamScan.multiply(PointSet[j],PointSet[k],PointSet[0])==0)&& (GrahamScan.dis(PointSet[0],PointSet[j])< GrahamScan.dis(PointSet[0],PointSet[k]))))
			k=j;
		tmp=PointSet[i];
		PointSet[i]=PointSet[k];
		PointSet[k]=tmp;
	}
	ch=GrahamScan._temArr;
	ch.length=0;
	if (PointSet.length < 3){
		return ArrayUtil.copyArray(ch,PointSet);
	}
	ch.push(PointSet[0],PointSet[1],PointSet[2]);
	for (i=3;i < n;i++){
		while (ch.length >=2 && GrahamScan.multiply(PointSet[i],ch[ch.length-1],ch[ch.length-2])>=0)ch.pop();
		PointSet[i] && ch.push(PointSet[i]);
	}
	return ch;
}
