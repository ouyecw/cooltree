ColorUtil={}

ColorUtil.getRed=function(color)
{
	return (color >> 16) & 0xFF;
}

ColorUtil.getGreen=function(color)
{
	return (color >> 8) & 0xFF;
}

ColorUtil.getBlue=function(color)
{
	return color & 0xFF;
}

ColorUtil.getAlpha=function(color)
{
	return (color >> 24) & 0xFF;
}

ColorUtil.darkenColor=function (color, factor)
{
	const red   = Math.min(255, ColorUtil.getRed(color)*factor);
	const green = Math.min(255, ColorUtil.getGreen(color)*factor);
	const blue  = Math.min(255, ColorUtil.getBlue(color)*factor);

	return ColorUtil.toInt(red,green,blue);
}

ColorUtil.colorToRGBA=function (color, alpha)
{
	var c=ColorUtil.toColor(color);
	var g=ColorUtil.getGreen(c);
	var b=ColorUtil.getBlue(c);
	var r=ColorUtil.getRed(c);
	return alpha==undefined ? "rgb("+r+","+g+","+b+")" : "rgba("+r+","+g+","+b+","+MathUtil.clamp(alpha,0,1)+")";
}

ColorUtil.toInt=function (red,green,blue)
{
	return ((red << 16) | (green << 8) | (blue));
} 
		
ColorUtil.toInt32=function (red,green,blue,alpha)
{
	return ((alpha << 24) | (red << 16) | (green << 8) | (blue));
}

ColorUtil.toHex=function (value)
{
    let g=ColorUtil.getGreen(value);
	let b=ColorUtil.getBlue(value);
	let r=ColorUtil.getRed(value);
	
	let hexs = [r.toString(16), g.toString(16), b.toString(16)];
	for (let i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = "0" + hexs[i];
	return "#" + hexs.join("");	
}

ColorUtil.toColor=function(color)
{
	color=String(color);
	if(StringUtil.isEmpty(color)) return;
	color=StringUtil.replaceAll(color,["0x","0X","#"],["","",""]);
	return Number("0x"+color);
}

ColorUtil.formatColor=function(color)
{
	if(isNaN(Number(color))) return color;
	return ColorUtil.toHex(Number(color));
}

/**
 * 创建线性渐变
 * 
 * args=[x0,y0,x1,y1]
 * x0	渐变开始点的 x 坐标
 * y0	渐变开始点的 y 坐标
 * x1	渐变结束点的 x 坐标
 * y1	渐变结束点的 y 坐标
 * 
 * colors=[[percent,color],[0.9,"#FFFFFF"]];
 * percent 0~1
 * color   0xFFFFFF #FFFFFF
 * 
 * @param {CanvasRenderingContext2D} context
 * @param {Array} args
 * @param {Array} colors
 */
ColorUtil.getLinearGradient=function(context,args,colors)
{
	const gradient=context.createLinearGradient.apply(context,args);
	var i,color,len=colors.length;
	
	for(i=0;i<len;i++){
		color=colors[i];
		if(color==null || color.length<2) continue;
		gradient.addColorStop(color[0],ColorUtil.formatColor(color[1]));
	}
	
	return gradient;
}

/**
 * 创建圆形放射渐变
 * 
 * args=[x0,y0,r0,x1,y1,r1]
 * x0	渐变的开始圆的 x 坐标
 * y0	渐变的开始圆的 y 坐标
 * r0	开始圆的半径
 * x1	渐变的结束圆的 x 坐标
 * y1	渐变的结束圆的 y 坐标
 * r1	结束圆的半径
 * 
 * colors=[[percent,color],[0.9,"#FFFFFF"]];
 * percent 0~1
 * color   0xFFFFFF #FFFFFF
 * 
 * @param {Object} context
 * @param {Object} args
 * @param {Object} colors
 */
ColorUtil.getRadialGradient=function(context,args,colors)
{
	const gradient=context.createRadialGradient.apply(context,args);
	var i,color,len=colors.length;
	
	for(i=0;i<len;i++){
		color=colors[i];
		if(color==null || color.length<2) continue;
		gradient.addColorStop(color[0],ColorUtil.formatColor(color[1]));
	}
	
	return gradient;
}

ColorUtil.getGradientColor=function(g_color)
{
	if(g_color==null || Global.context==null) return g_color;
	var str=(g_color.type==0) ? "getLinearGradient" : "getRadialGradient";
	var args=(g_color.type==0) ? [g_color.xStart, g_color.yStart, g_color.xEnd, g_color.yEnd] : [g_color.xStart, g_color.yStart, g_color.radiusStart, g_color.xEnd, g_color.yEnd, g_color.radiusEnd];
   
    var colors=[];
    var i,len=g_color.offsetlist.length;
    for(i=0;i<len;i++){
    	colors.push([g_color.offsetlist[i],g_color.colorList[i]]);
    }
    
    return ColorUtil[str](Global.context,args,colors);
}

/**
 * @param {Number} fromColor
 * @param {Number} toColor
 * @param {Number} progress 0~1
 */
ColorUtil.interpolateColor=function(fromColor, toColor, progress)
{
	if(fromColor==undefined || toColor==undefined || progress==undefined) return 0;
	
	progress=(progress>1) ? 0.01*progress : progress;
	fromColor=ColorUtil.toColor(fromColor);
	toColor=ColorUtil.toColor(toColor);
	
	var q = 1-progress;
	var fromA = (fromColor >> 24) & 0xFF;
	var fromR = (fromColor >> 16) & 0xFF;
	var fromG = (fromColor >>  8) & 0xFF;
	var fromB =  fromColor        & 0xFF;

	var toA = (toColor >> 24) & 0xFF;
	var toR = (toColor >> 16) & 0xFF;
	var toG = (toColor >>  8) & 0xFF;
	var toB =  toColor        & 0xFF;
	
	var resultA = fromA*q + toA*progress;
	var resultR = fromR*q + toR*progress;
	var resultG = fromG*q + toG*progress;
	var resultB = fromB*q + toB*progress;
	var resultColor = resultA << 24 | resultR << 16 | resultG << 8 | resultB;
	
	return resultColor;		
}
