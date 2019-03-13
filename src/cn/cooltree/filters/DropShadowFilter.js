
class DropShadowFilter
{
	constructor (distance=0, angle=0, blur=0, color="#000000", alpha=1, radius=0)
	{
		this.shadowColor =ColorUtil.formatColor(color);
		this.distance = distance;
		this.shadowBlur = blur;
		this.radius = radius;
		this.angle = angle;
		this.alpha = alpha;
		this.setShadowOffset();
	}
	
	setDistance(distance) 
	{
		this.distance = distance;
		this.setShadowOffset();
	}
	
	setShadowOffset()
	{
		const r=MathUtil.getRadiansFromDegrees(this.angle);
		this.shadowOffsetX = MathUtil.format(this.distance * Math.cos(r));
		this.shadowOffsetY = MathUtil.format(this.distance * Math.sin(r));
	}
	
	show(context)
	{
		let text_type;
		
		if(context==undefined || this.alpha==0 || (this.distance==0 && this.shadowBlur==0)) {
			if(context && !(context instanceof CanvasRenderingContext2D)) {
				text_type=ClassUtil.getQualifiedClassName(context);
				context.style[(text_type=="HTMLSpanElement" || text_type=="HTMLParagraphElement" || text_type=="HTMLInputElement" || text_type=="HTMLTextAreaElement") ? 'textShadow' : Global.cssPrefix+'BoxShadow']="";
			}
			return;
		}
		
		let color=(this.alpha<1) ? ColorUtil.colorToRGBA(this.shadowColor,this.alpha) : this.shadowColor;
		text_type=ClassUtil.getQualifiedClassName(context);
		
		if(context instanceof CanvasRenderingContext2D){
			if(this.distance==0 && this.shadowBlur==0) return;
			context.shadowOffsetX = this.shadowOffsetX;
			context.shadowOffsetY = this.shadowOffsetY;
			context.shadowBlur    = this.shadowBlur;
			context.shadowColor   = color;
		}
		else{
			let text_bool=(text_type=="HTMLSpanElement" || text_type=="HTMLParagraphElement" || text_type=="HTMLInputElement" || text_type=="HTMLTextAreaElement");
			
			if(text_type=="SVGSVGElement"){
				let text=context.getElementsByTagName("text");
				if(text && text.length>0) text_bool=true;
			}
			
			let shadow_property=(text_bool ? 'textShadow' : Global.cssPrefix+'BoxShadow');
			if(!text_bool) context.style[Global.cssPrefix+"BorderRadius"]=this.radius+ 'px';
			context.style[shadow_property]=this.shadowOffsetX + 'px ' + this.shadowOffsetY + 'px ' + this.shadowBlur + 'px '+color;
		}
	}
	
	clone()
	{
		return new DropShadowFilter (this.distance, this.angle,this.shadowBlur,this.shadowColor,this.alpha,this.radius);
	}
	
	toString()
	{
		return '{"shadowColor":"'+this.shadowColor+'","distance":'+this.distance+',"shadowBlur":'+this.shadowBlur+',"radius":'+this.radius+',"angle":'+this.angle+',"alpha":'+this.alpha+'}';
	}
}
