function DefsNode()
{
	this._defs=null;
	DOMDisplay.call(this);
}

Global.inherit(DefsNode,DOMDisplay);
DefsNode.prototype.__class__="DefsNode";

DefsNode.prototype.init=function()
{
	if(this._element) return this;
	this.element=SVGUtil.create("svg");
	this._defs=SVGUtil.create("defs");
    this._element.appendChild(this._defs);
	return this;
}

Object.defineProperty(DefsNode.prototype,"defs",{
	get: function(){
		return this._defs;
	},
    enumerable: true,
    configurable: true
});

DefsNode.prototype.addClipPath=function(vo)
{
	let clip=this.getClipPath(vo);
	if(clip) return;
	this._defs.appendChild(SVGUtil.create("clipPath",{id:(vo.id+ShapeVO.CILP),innerHTML:ShapeVO.string(vo)}));
}

DefsNode.prototype.removeClipPath=function(vo)
{
	let clip=this.getClipPath(vo);
	if(!clip) return;
	this._defs.removeChild(clip);
}

DefsNode.prototype.getClipPath=function(vo)
{
	if(!vo) return null;
	let id=vo.id+ShapeVO.CILP;
	let clip=SVGUtil.getElementsById(this._defs,"clipPath",id);
	return clip;
}

//DefsNode.prototype.addPattern=function()
//{
//	
//}
//
//DefsNode.prototype.removePattern=function()
//{
//	
//}

DefsNode.prototype.reset=function()
{
	this._defs.innerHTML="";
}

DefsNode.prototype.dispose=function()
{
	DefsNode.superClass.dispose.call(this);
	delete this._defs;
}