import DOMDisplay from './DOMDisplay.js'
import SVGUtil from '../utils/SVGUtil.js' 
import ShapeVO from '../model/ShapeVO.js'

export default class DefsNode extends DOMDisplay
{
	constructor()
	{
		super();
		this._defs=null;
	}

	init()
	{
		if(this.element) return this;
		this.element=SVGUtil.create("svg");
		this._defs=SVGUtil.create("defs");
	    this.element.appendChild(this._defs);
		return this;
	}
	
	get defs()
	{
		return this._defs;
	}
	
	addClipPath(vo)
	{
		let clip=this.getClipPath(vo);
		if(clip) return;
		this._defs.appendChild(SVGUtil.create("clipPath",{id:(vo.id+ShapeVO.CILP),innerHTML:ShapeVO.string(vo)}));
	}
	
	removeClipPath(vo)
	{
		let clip=this.getClipPath(vo);
		if(!clip) return;
		this._defs.removeChild(clip);
	}
	
	getClipPath(vo)
	{
		if(!vo) return null;
		let id=vo.id+ShapeVO.CILP;
		let clip=SVGUtil.getElementsById(this._defs,"clipPath",id);
		return clip;
	}
	
	reset()
	{
		this._defs=null;
		super.reset();
	}
	
	dispose()
	{
		super.dispose();
		delete this._defs;
	}

}

DefsNode.className="DefsNode";