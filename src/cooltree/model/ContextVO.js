
export default class ContextVO
{
	constructor()
	{
		this.actions=[];
		this.type_id=0;
		this.value=null;
	}
	
	getValue()
	{
		if(this.value) return this.value;
		this.value={};
		let name;
		
		for(name in this)
		{
	    	if(ContextVO.LIST.indexOf(name)>=0 || typeof this[name]==="function" || name=="actions" || name=="type_id" || name=="value") continue;
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
		    	if(ContextVO.LIST.indexOf(name)>=0 || typeof this[name]==="function" || name=="actions" || name=="type_id" || name=="value") continue;
		    	delete this[name];
			}
		}
		
		this.type_id=0;
		this.actions=[];
		this.value=null;
	}
	
	static INIT_CLASS()
	{
		if(ContextVO.IS_INIT) return;
		ContextVO.IS_INIT=true;
		
		let name;
		for(name of ContextVO.LIST)
		{
			ContextVO.prototype[name]=ContextVO.create_func(name);
		}
	}
	
	static create_func(name)
	{
		return function(){
    		this.actions.push({method:name,data:arguments});
    	}
	}
}

ContextVO.LIST=['save','restore','scale','rotate','translate','transform','setTransform','getTransform','resetTransform','createLinearGradient','createRadialGradient','createPattern','clearRect','fillRect','strokeRect','beginPath','fill','stroke','drawFocusIfNeeded','clip','isPointInPath','isPointInStroke','fillText','strokeText','measureText','drawImage','getImageData','putImageData','createImageData','setLineDash','getLineDash','closePath','moveTo','lineTo','quadraticCurveTo','bezierCurveTo','arcTo','rect','arc','ellipse','drawSvg'];
ContextVO.IS_INIT=false;
ContextVO.className="ContextVO";