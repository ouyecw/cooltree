
function GraphicsVO()
{
	ContextVO.call(this);
	this.type_id=1;
}

Global.inherit(GraphicsVO,ContextVO);
	
GraphicsVO.prototype._init=function()
{
	if(this.actions) return;
	GraphicsVO.superClass._init.call(this);
	
	const labels=Object.getOwnPropertyNames(Graphics.prototype);
	let label,_this=this;
	
	for (label of labels)
	{
		if(this[label]) continue;
		this._create_func(label);
	}
}
	
GraphicsVO.prototype.reset=function()
{
	GraphicsVO.superClass.reset.call(this);
	this.type_id=1;
}