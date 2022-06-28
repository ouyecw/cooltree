import ContextVO from './ContextVO.js'

/**
 * @class
 * @module GraphicsVO
 */
export default class GraphicsVO
{
	constructor()
	{
		this.reset();
	}
	
	reset()
	{
		this.value={
			line_alpha:1,
			line_width:1,
			miter_limit:10,
			line_cap:"butt",
			line_join:"miter",
			fill_style:"#FFFFFF",
			stroke_style:"#000000"
		};
		
		this.strict=false;
		this.type_id=0;
		this.actions=[];
	}
	
	static INIT_CLASS()
	{
		if(GraphicsVO.IS_INIT) return;
		GraphicsVO.IS_INIT=true;

		let name;

		for(name of GraphicsVO.ATTR)
		{
			Object.defineProperty(GraphicsVO.prototype,name,{
				get:ContextVO.get_attr_func(name),
				set:ContextVO.create_func(0,name),
				enumerable:true,configurable:true
			});
		}
		
		for(name of GraphicsVO.LIST)
		{
			GraphicsVO.prototype[name]=ContextVO.create_func(1,name);
		}
		
	}
}

GraphicsVO.LIST=['arc','moveTo','lineTo','beginPath','closePath','bezierCurveTo','curveTo','lineStyle','clear','beginFill','endFill','beginBitmapFill','linearGradientFill','radialGradientFill','drawRect','drawRoundRect','drawPath','drawCircle','drawEllipse','createPolygon','drawSVGPath','drawShape','dispose'];

GraphicsVO.ATTR=['line_cap','line_join','line_alpha','stroke_style','line_width','miter_limit','fill_alpha','fill_style'];

GraphicsVO.IS_INIT=false;
GraphicsVO.className="GraphicsVO";