
ShapeUtil={};

/**
 * 点坐标集合转换成路径节点
 * @param {Array} points
 * @param {Boolean} is_close
 * @param {Boolean} is_node
 */
ShapeUtil.pointsToPath=function(points,is_close,is_node)
{
	if(!points || points.length<2) return "";
	let str="";
	for(let i=0,p,l=points.length;i<l;i++){
		p=points[i];
		str+=(i==0 ? "M " : (i==1 ? " L " : ", "))+(p instanceof Array ? p[0] : p.x)+" "+(p instanceof Array ? p[1] : p.y);
	}
	
	p=points[0];
	str+=(is_close ? " Z" : '');
	
	return is_node ? '<path d="'+str+'" />' : str;
}

/**
 * 矩形或者圆角矩形换成路径
 * @param {Object} properties
 * @param {Boolean} is_node
 */
ShapeUtil.rectToPath=function(properties,is_node)
{
	let x = Number(properties.x || 0),
		y = Number(properties.y || 0),
		width = Number(properties.width),
		height = Number(properties.height),
 		rx = Number(properties.rx || 0),
	    ry = Number(properties.ry || rx || 0);

	rx = rx > width *0.5 ? width *0.5 : rx;
	ry = ry > height *0.5 ? height *0.5 : ry;
	
	let str,w = width-rx*2, 
		h = height-ry*2, 
		C = 0.5522847498307933, 
		cx = C * rx, 
		cy = C * ry;
		
	if(0 == rx || 0 == ry)
        str='M' + x + ' ' + y +
            ' L' + (x+width) +' ' + y +
            ' L' + (x+width) +' ' + (y +height) +
            ' L' + x +' ' + (y +height) +
            ' Z';		            
    else 
        str='M' + (x + width) + ' ' + (y+ry) +
        ' C' + (x + width)+ ' ' +(y+ry - cy)+ ' ' +(x+w+rx+ cx)+ ' ' + y+ ' ' +(x+w+rx)+ ' ' +y+
        ' L' + (x+rx) +' ' + y +
        ' C' + (x+rx - cx)+ ' ' + y+ ' ' + x+ ' ' + (y+ry - cy)+ ' ' + x+ ' ' + (y+ry)+ 
        ' L' + x+' ' + (y+h+ry) +
        ' C' + x+ ' ' + (y+h+ ry + cy)+ ' ' + (x+rx - cx)+ ' ' + (y+height)+ ' ' + (x+rx)+ ' ' + (y+height)+ 
        ' L' + (x+rx+w) +' ' + (y+height) +
        ' C' + (x+w+rx + cx)+ ' ' + (y+height)+ ' ' + (x+width)+ ' ' + (y+h+ry + cy)+ ' ' + (x+width)+ ' ' + (y+h+ry) + 
        ' Z'; 
     
    return is_node ? '<path d="'+str+'" />' : str;
}

/**
 * 椭圆或者正圆换成路径
 * @param {Object} properties
 * @param {Boolean} is_node
 */
ShapeUtil.ellipseToPath=function(properties,is_node)
{
	let cx = Number(properties.cx || 0),
        cy = Number(properties.cy || 0),
        r  = Number(properties.r  || 0),
        rx = Number(properties.rx || 0),
        ry = Number(properties.ry || 0);
        
     	k  = 0.5522848,
        a  = (r==0 ? rx : r),
        b  = (r==0 ? ry : r),
        x  = a*k,
        y  = b*k;
        
    let str =
        'M' + MathUtil.format(cx-a) + ' ' + cy +
        ' C' + MathUtil.format(cx-a) + ' ' + MathUtil.format(cy-y) + ' ' +  MathUtil.format(cx-x) + ' ' + MathUtil.format(cy-b) + ' ' + cx + ' ' + MathUtil.format(cy-b) + 
        ' C' + MathUtil.format(cx+x) + ' ' + MathUtil.format(cy-b) + ' ' +  MathUtil.format(cx+a) + ' ' + MathUtil.format(cy-y) + ' ' + MathUtil.format(cx+a) + ' ' + cy + 
        ' C' + MathUtil.format(cx+a) + ' ' + MathUtil.format(cy+y) + ' ' +  MathUtil.format(cx+x) + ' ' + MathUtil.format(cy+b) + ' ' + cx + ' ' + MathUtil.format(cy+b) + 
        ' C' + MathUtil.format(cx-x) + ' ' + MathUtil.format(cy+b) + ' ' +  MathUtil.format(cx-a) + ' ' + MathUtil.format(cy+y) + ' ' + MathUtil.format(cx-a) + ' ' + cy + 
        ' Z';
    return is_node ? '<path d="'+str+'" />' : str;    
}

/**
 * 获取图形数据的矩形边框
 * @param {ShapeVO} vo
 * @param {Boolean} only_pts 是否仅仅为了获取点坐标集合
 */
ShapeUtil.getShapeBounds=function(vo,only_pts)
{
	if(!vo) return null;
	let points=[];
	
	switch(vo.type)
	{
		case SVGLabel.LINE:
			points.push([vo.properties.x1, vo.properties.y1]);
			points.push([vo.properties.x2, vo.properties.y2]);
		break;
		
		case SVGLabel.POLYLINE:
		case SVGLabel.POLYGON:
		    points=ArrayUtil.each(vo.properties.points.split(/ /),function(d,i,a){a[i]=d.split(/,/);});
		break;
		
		case SVGLabel.RECT:
			points.push([(vo.properties.x || 0), (vo.properties.y || 0)]);
			points.push([(vo.properties.x || 0) + vo.properties.width, (vo.properties.y || 0)+vo.properties.height]);
		break;
		
		case SVGLabel.CIRCLE:
			points.push([(vo.properties.cx || 0)-vo.properties.r, (vo.properties.cy || 0)-vo.properties.r]);
			points.push([(vo.properties.cx || 0)+vo.properties.r, (vo.properties.cy || 0)+vo.properties.r]);
		break;
		
		case SVGLabel.ELLIPSE:
		    points.push([(vo.properties.cx || 0)-vo.properties.rx, (vo.properties.cy || 0)-vo.properties.ry]);
			points.push([(vo.properties.cx || 0)+vo.properties.rx, (vo.properties.cy || 0)+vo.properties.ry]);
		break;
		
		case SVGLabel.PATH:
		    let path = vo.properties.d.split(/[a-zA-Z]/);
		    for(let i=0,j,p1,p2,s,n,l=path.length;i<l;i++){
		    	s=path[i];
		    	if(StringUtil.isEmpty(s)) continue;
		    	s=ArrayUtil.format(StringUtil.trim(s).split(/,| |-/));
		    	
		    	for(j=0,n=s.length;j<n;j+=2){
		    		p1=s[j];
		    		p2=s[j+1];
		    		
		    		if(!StringUtil.isEmpty(p1) && !StringUtil.isEmpty(p2)) {
		    			points.push(only_pts ? ObjectPool.create(Point).set(p1,p2) : [p1,p2]);
		    		}
		    	}
		    }
		break;
		
	}
	
	return only_pts ? points : Rectangle.getPointsBounds(points);
}

/**
 * 改变图形坐标
 * @param {ShapeVO} vo
 * @param {Object} pos
 */
ShapeUtil.replace=function(vo,pos)
{
	if(!vo || !pos || !vo.rect || (pos.x==vo.rect.x && pos.y==vo.rect.y && (!pos.s || pos.s==1))) return vo;
	
	if(vo.type==SVGLabel.PATH && (/A|V|S|T|H/).test(vo.properties.d.toUpperCase())){
		trace("[ERROR] ShapeUtil.replace path won't support some attributes.");	
		return vo;
	}
	
	let scale=(!pos.s ? 1 : pos.s);
	vo.rect.multiply(scale);
	
	let points,offset={x:(pos.x-vo.rect.x),y:(pos.y-vo.rect.y)};
	vo.rect.x=pos.x;
	vo.rect.y=pos.y;
	
	switch(vo.type)
	{
		case SVGLabel.LINE:
			vo.properties.x1=MathUtil.format(parseFloat(vo.properties.x1)*scale+offset.x);
			vo.properties.y1=MathUtil.format(parseFloat(vo.properties.y1)*scale+offset.y);
			vo.properties.x2=MathUtil.format(parseFloat(vo.properties.x2)*scale+offset.x);
			vo.properties.y2=MathUtil.format(parseFloat(vo.properties.y2)*scale+offset.y);
		break;
		
		case SVGLabel.POLYLINE:
		case SVGLabel.POLYGON:
		    points=ArrayUtil.each(ArrayUtil.format(vo.properties.points.split(/ /)),function(d,i,a){
		    	let point=d.split(/,/);
		    	a[i]=MathUtil.format(parseFloat(point[0])*scale+offset.x)+","+MathUtil.format(parseFloat(point[1])*scale+offset.y);
		    });
		    vo.properties.points=points.join(" ");
		break;
		
		case SVGLabel.RECT:
			vo.properties.x=MathUtil.format(parseFloat(vo.properties.x || 0)*scale+offset.x);
			vo.properties.y=MathUtil.format(parseFloat(vo.properties.y || 0)*scale+offset.y);
			vo.properties.height=vo.properties.height*scale;
			vo.properties.width=vo.properties.width*scale;
			
			if(vo.properties.hasOwnProperty("rx") && vo.properties.rx) vo.properties.rx=vo.properties.rx*scale;
			if(vo.properties.hasOwnProperty("ry") && vo.properties.ry) vo.properties.ry=vo.properties.ry*scale;
		break;
		
		case SVGLabel.CIRCLE:
		case SVGLabel.ELLIPSE:
			vo.properties.cx=MathUtil.format(parseFloat(vo.properties.cx || 0)*scale+offset.x);
			vo.properties.cy=MathUtil.format(parseFloat(vo.properties.cy || 0)*scale+offset.y);
			
			if(vo.properties.hasOwnProperty("r") && vo.properties.r) vo.properties.r=vo.properties.r*scale;
			if(vo.properties.hasOwnProperty("rx") && vo.properties.rx) vo.properties.rx=vo.properties.rx*scale;
			if(vo.properties.hasOwnProperty("ry") && vo.properties.ry) vo.properties.ry=vo.properties.ry*scale;
		break;
		
		case SVGLabel.PATH:
			points=ShapeUtil.getShapeBounds(vo,true);
			points=ArrayUtil.each(points,function(p){
				p.x=MathUtil.format(p.x*scale+offset.x);
				p.y=MathUtil.format(p.y*scale+offset.y);
			});
			let str='',data = ArrayUtil.format(vo.properties.d.split(/,| |-|(?=[a-zA-Z])/));
			for(let p,i=0,j=0,l=data.length;i<l;i++){
				p=data[i];
				
				if((/[a-zA-Z]/).test(p)){
					str+=p[0]+" ";
					
					if(p.length==1) {
						data.splice(i,1);
						p=data[i];
						l--;
					}
				}
				
				if(j>=points.length) continue; 
				
				p=points[j];
				str+=p[i%2==0 ? "x" : "y"]+" ";
				if(i%2==1) j++;
			}
			vo.properties.d=str;
		break;
	}
	
	return vo;
}

/**
 * 获取矩形或者圆角矩形的ShapeVO
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @param {Number} rx
 * @param {Number} ry
 */
ShapeUtil.getRect=function(x,y,w,h,rx,ry)
{
	rx=rx || 0;
	ry=ry || rx || 0;
	
	return ObjectPool.create(ShapeVO).setup(SVGLabel.RECT,{x:x,y:y,width:w,height:h,rx:rx,ry:ry});
}

/**
 * 获取圆形或者椭圆形的ShapeVO
 * @param {Number} x
 * @param {Number} y
 * @param {Number} rx
 * @param {Number} ry
 */
ShapeUtil.getCircle=function(x,y,rx,ry)
{
	ry=ry || rx;
	return ObjectPool.create(ShapeVO).setup(ry==rx ? SVGLabel.CIRCLE : SVGLabel.ELLIPSE,(ry==rx ? {cx:x,cy:y,r:rx} : {cx:x,cy:y,rx:rx,ry:ry}));
}

/**
 * 获取多边形的ShapeVO
 * @param {Array} points 
 * 例如[[11,22],[90,120],[180,3]] 或者[{x:11,y:22},{x:90,y:120},{x:180,y:3}]
 */
ShapeUtil.getPolygon=function(points)
{
	if(!points || !(points instanceof Array) ||points.length<3) return;
	let str='';
	ArrayUtil.each(points,function(p,i){
		let bool=(p instanceof Array);
		str+=(bool ? p.join(",") : p.x+","+p.y)+(i<(points.length-1) ? " " : "");
	});
	return ObjectPool.create(ShapeVO).setup(SVGLabel.POLYGON,{points:str});
}

/**
 * 获取折线的ShapeVO
 * @param {Array} points 
 * 例如[[11,22],[90,120],[180,3]] 或者[{x:11,y:22},{x:90,y:120},{x:180,y:3}]
 */
ShapeUtil.getLine=function(points)
{
	if(!points || !(points instanceof Array) ||points.length<2) return;
	let str='';
	ArrayUtil.each(points,function(p,i){
		let bool=(p instanceof Array);
		str+=(bool ? p.join(",") : p.x+","+p.y)+(i<(points.length-1) ? " " : "");
	});
	return ObjectPool.create(ShapeVO).setup(SVGLabel.POLYLINE,{points:str});
}
