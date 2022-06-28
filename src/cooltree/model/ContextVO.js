
/**
 * @class
 * @module ContextVO
 */
export default class ContextVO
{
	constructor()
	{
		this.reset();
	}
	
	reset()
	{
		this.value={
			direction: "ltr",
			fillStyle: "#000000",
			filter: "none",
			font: "10px sans-serif",
			globalAlpha: 1,
			globalCompositeOperation: "source-over",
			imageSmoothingEnabled: true,
			imageSmoothingQuality: "low",
			lineCap: "butt",
			lineDashOffset: 0,
			lineJoin: "miter",
			lineWidth: 1,
			miterLimit: 10,
			shadowBlur: 0,
			shadowColor: "rgba(0, 0, 0, 0)",
			shadowOffsetX: 0,
			shadowOffsetY: 0,
			strokeStyle: "#000000",
			textAlign: "start",
			textBaseline: "alphabetic"
		};
		
		this.strict=false;
		this.type_id=0;
		this.actions=[];
	}
	
	static INIT_CLASS()
	{
		if(ContextVO.IS_INIT) return;
		ContextVO.IS_INIT=true;
		
		let name;
		for(name of ContextVO.LIST)
		{
			ContextVO.prototype[name]=ContextVO.create_func(1,name);
		}
		
		for(name of ContextVO.ATTR)
		{
			Object.defineProperty(ContextVO.prototype,name,{
				get:ContextVO.get_attr_func(name),
				set:ContextVO.create_func(0,name),
				enumerable:true,configurable:true
			});
		}
	}
	
	/**
	 * @param {Object} type 0 attribute 1 function 
	 * @param {Object} name
	 */
	static create_func(type,name)
	{
		return function(){
			if(type===0) {
				this.value[name]=arguments[0];
				if(!this.strict) return;
			}
			
    		this.actions.push({type:type,method:name,data:arguments});
    	}
	}
	
	static get_attr_func(name)
	{
		return function (){
			return this.value[name];
		}
	}
}

ContextVO.LIST=['save','restore','scale','rotate','translate','transform','setTransform','getTransform','resetTransform','createLinearGradient','createRadialGradient','createPattern','clearRect','fillRect','strokeRect','beginPath','fill','stroke','drawFocusIfNeeded','clip','isPointInPath','isPointInStroke','fillText','strokeText','measureText','drawImage','getImageData','putImageData','createImageData','setLineDash','getLineDash','closePath','moveTo','lineTo','quadraticCurveTo','bezierCurveTo','arcTo','rect','arc','ellipse','drawSvg'];

ContextVO.ATTR=['fillStyle','strokeStyle','shadowColor','shadowBlur','shadowOffsetX','shadowOffsetY','lineCap','lineJoin','lineDashOffset','lineWidth','miterLimit','font','textAlign','textBaseline','globalAlpha','globalCompositeOperation','filter','direction','imageSmoothingEnabled','imageSmoothingQuality'];

ContextVO.IS_INIT=false;
ContextVO.className="ContextVO";