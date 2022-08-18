
function DropShadowFilter (distance, angle, blur, color, alpha, radius)
{
	this.shadowColor = (color!=undefined) ? ColorUtil.formatColor(color) : "#000000";
	this.distance = (distance!=undefined) ? distance : 0;
	this.shadowBlur = (blur!=undefined) ? blur : 0;
	this.radius = (radius!=undefined) ? radius : 0;
	this.angle = (angle!=undefined) ? angle : 0;
	this.alpha = (alpha!=undefined) ? alpha : 1;
	this.setShadowOffset();
}

DropShadowFilter.prototype.setDistance = function (distance) 
{
	this.distance = distance;
	this.setShadowOffset();
}

DropShadowFilter.prototype.setShadowOffset=function()
{
	const r=MathUtil.getRadiansFromDegrees(this.angle);
	this.shadowOffsetX = MathUtil.format(this.distance * Math.cos(r));
	this.shadowOffsetY = MathUtil.format(this.distance * Math.sin(r));
}

DropShadowFilter.prototype.show=function(context)
{
	var text_type;
	
	if(context==undefined || this.alpha==0 || (this.distance==0 && this.shadowBlur==0)) {
		if(context && !(context instanceof CanvasRenderingContext2D)) {
			text_type=ClassUtil.getQualifiedClassName(context);
			context.style[(text_type=="HTMLSpanElement" || text_type=="HTMLParagraphElement" || text_type=="HTMLInputElement" || text_type=="HTMLTextAreaElement") ? 'textShadow' : Global.cssPrefix+'BoxShadow']="";
		}
		return;
	}
	
	var color=(this.alpha<1) ? ColorUtil.colorToRGBA(this.shadowColor,this.alpha) : this.shadowColor;
	text_type=ClassUtil.getQualifiedClassName(context);
	
	if(context instanceof CanvasRenderingContext2D){
		if(this.distance==0 && this.shadowBlur==0) return;
		context.shadowOffsetX = this.shadowOffsetX;
		context.shadowOffsetY = this.shadowOffsetY;
		context.shadowBlur    = this.shadowBlur;
		context.shadowColor   = color;
	}
	else{
		var text_bool=(text_type=="HTMLSpanElement" || text_type=="HTMLParagraphElement" || text_type=="HTMLInputElement" || text_type=="HTMLTextAreaElement");
		
		if(text_type=="SVGSVGElement"){
			var text=context.getElementsByTagName("text");
			if(text && text.length>0) text_bool=true;
		}
		
		var shadow_property=(text_bool ? 'textShadow' : Global.cssPrefix+'BoxShadow');
		if(!text_bool) context.style[Global.cssPrefix+"BorderRadius"]=this.radius+ 'px';
		context.style[shadow_property]=this.shadowOffsetX + 'px ' + this.shadowOffsetY + 'px ' + this.shadowBlur + 'px '+color;
	}
}

DropShadowFilter.prototype.clone=function()
{
	return new DropShadowFilter (this.distance, this.angle,this.shadowBlur,this.shadowColor,this.alpha,this.radius);
}

DropShadowFilter.prototype.toString=function()
{
	return '{"shadowColor":"'+this.shadowColor+'","distance":'+this.distance+',"shadowBlur":'+this.shadowBlur+',"radius":'+this.radius+',"angle":'+this.angle+',"alpha":'+this.alpha+'}';
}
