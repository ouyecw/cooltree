
class GraphicsVO
{
	constructor()
	{
		this.actions=[];
		this.type_id=1;
		this.value=null;
	}
	
	getValue()
	{
		if(this.value) return this.value;
		this.value={};
		let name;
		
		for(name in this)
		{
	    	if(GraphicsVO.LIST.indexOf(name)>=0 || typeof this[name]==="function" || name=="actions" || name=="type_id" || name=="value") continue;
	    	this.value[name]=this[name];
	    	delete this[name];
		}
		return this.value;
	}
	
	reset()
	{
		if(!this.value){
			let name;
			for(name in this)
			{
		    	if(GraphicsVO.LIST.indexOf(name)>=0 || typeof this[name]==="function" || name=="actions" || name=="type_id" || name=="value") continue;
		    	delete this[name];
			}
		}
		
		this.type_id=1;
		this.actions=[];
		this.value=null;
	}
	
	static INIT_CLASS()
	{
		if(GraphicsVO.IS_INIT) return;
		GraphicsVO.IS_INIT=true;

		let name;
		for(name of GraphicsVO.LIST)
		{
			GraphicsVO.prototype[name]=ContextVO.create_func(name);
		}
	}
}

GraphicsVO.LIST=["beginPath","closePath","stroke","fill","moveTo","lineTo","arcTo","arc","rect","clip","curveTo","createPattern","bezierCurveTo","createLinearGradient","createRadialGradient",'lineStyle','clear','beginFill','endFill','beginBitmapFill','linearGradientFill','radialGradientFill','drawRect','drawRoundRect','drawPath','drawCircle','drawEllipse','createPolygon','drawSVGPath','drawShape','dispose'];
GraphicsVO.IS_INIT=false;