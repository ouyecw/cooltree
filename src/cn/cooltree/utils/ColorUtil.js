
class ColorUtil
{
	static getRed(color)
	{
		return (color >> 16) & 0xFF;
	}
	
	static getGreen(color)
	{
		return (color >> 8) & 0xFF;
	}
	
	static getBlue(color)
	{
		return color & 0xFF;
	}
	
	static getAlpha(color)
	{
		return (color >> 24) & 0xFF;
	}
	
	static darkenColor (color, factor)
	{
		const red   = Math.min(255, ColorUtil.getRed(color)*factor);
		const green = Math.min(255, ColorUtil.getGreen(color)*factor);
		const blue  = Math.min(255, ColorUtil.getBlue(color)*factor);
	
		return ColorUtil.toInt(red,green,blue);
	}
	
	static colorToRGBA (color, alpha)
	{
		let c=ColorUtil.toColor(color);
		let g=ColorUtil.getGreen(c);
		let b=ColorUtil.getBlue(c);
		let r=ColorUtil.getRed(c);
		return alpha==undefined ? "rgb("+r+","+g+","+b+")" : "rgba("+r+","+g+","+b+","+MathUtil.clamp(alpha,0,1)+")";
	}
	
	static toInt (red,green,blue)
	{
		return ((red << 16) | (green << 8) | (blue));
	} 
			
	static toInt32 (red,green,blue,alpha)
	{
		return ((alpha << 24) | (red << 16) | (green << 8) | (blue));
	}
	
	static toHex (value)
	{
	    let g=ColorUtil.getGreen(value);
		let b=ColorUtil.getBlue(value);
		let r=ColorUtil.getRed(value);
		
		let hexs = [r.toString(16), g.toString(16), b.toString(16)];
		for (let i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = "0" + hexs[i];
		return "#" + hexs.join("");	
	}
	
	static toColor(color)
	{
		color=String(color);
		if(StringUtil.isEmpty(color)) return;
		color=StringUtil.replaceAll(color,["0x","0X","#"],["","",""]);
		return Number("0x"+color);
	}
	
	static formatColor(color)
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
	static getLinearGradient(context,args,colors)
	{
		const gradient=context.createLinearGradient.apply(context,args);
		let i,color,len=colors.length;
		
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
	static getRadialGradient(context,args,colors)
	{
		const gradient=context.createRadialGradient.apply(context,args);
		let i,color,len=colors.length;
		
		for(i=0;i<len;i++){
			color=colors[i];
			if(color==null || color.length<2) continue;
			gradient.addColorStop(color[0],ColorUtil.formatColor(color[1]));
		}
		
		return gradient;
	}
	
	static getGradientColor(g_color)
	{
		if(g_color==null || Global.context==null) return g_color;
		let str=(g_color.type==0) ? "getLinearGradient" : "getRadialGradient";
		let args=(g_color.type==0) ? [g_color.xStart, g_color.yStart, g_color.xEnd, g_color.yEnd] : [g_color.xStart, g_color.yStart, g_color.radiusStart, g_color.xEnd, g_color.yEnd, g_color.radiusEnd];
	   
	    let colors=[];
	    let i,len=g_color.offsetlist.length;
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
	static interpolateColor(fromColor, toColor, progress)
	{
		if(fromColor==undefined || toColor==undefined || progress==undefined) return 0;
		
		progress=(progress>1) ? 0.01*progress : progress;
		fromColor=ColorUtil.toColor(fromColor);
		toColor=ColorUtil.toColor(toColor);
		
		let q = 1-progress;
		let fromA = (fromColor >> 24) & 0xFF;
		let fromR = (fromColor >> 16) & 0xFF;
		let fromG = (fromColor >>  8) & 0xFF;
		let fromB =  fromColor        & 0xFF;
	
		let toA = (toColor >> 24) & 0xFF;
		let toR = (toColor >> 16) & 0xFF;
		let toG = (toColor >>  8) & 0xFF;
		let toB =  toColor        & 0xFF;
		
		let resultA = fromA*q + toA*progress;
		let resultR = fromR*q + toR*progress;
		let resultG = fromG*q + toG*progress;
		let resultB = fromB*q + toB*progress;
		let resultColor = resultA << 24 | resultR << 16 | resultG << 8 | resultB;
		
		return resultColor;		
	}
}
