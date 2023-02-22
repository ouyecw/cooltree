import DOMUtil from './DOMUtil.js'
import MathUtil from './MathUtil.js'
import ObjectPool from './ObjectPool.js'
import Rectangle from '../geom/Rectangle.js'
import DOMDisplay from '../display/DOMDisplay.js'

/**
 * @class
 * @module SVGUtil
 */
export default class SVGUtil
{
	/**
	 * return (base_width,base_height,anim_width,anim_height);
	 * @param {Object} xml
	 */
	static getRect(xml)
	{
		if(xml==undefined) return null;
		
		if(typeof xml=="string"){
			const node=DOMUtil.createDOM("div");
			try{
				node.innerHTML=xml;
				xml=node.children[0];
			}
			catch(err){
				return null;
			}
		}
		
		const xml_doc=xml.documentElement ? xml.documentElement : xml;
		if(xml_doc.viewBox && typeof xml_doc.viewBox=="string"){
			return Rectangle.toRectangle(xml_doc.viewBox);
		}
		
		const w=xml_doc.width;
		const h=xml_doc.height;
		
		const w_bool=(w instanceof SVGAnimatedLength);
		const h_bool=(h instanceof SVGAnimatedLength);
		
		return new Rectangle(w_bool ? xml_doc.x.animVal.value : MathUtil.int(xml_doc.x || 0),h_bool ? xml_doc.y.animVal.value : MathUtil.int(xml_doc.y || 0),w_bool ? w.animVal.value :MathUtil.int(w),h_bool ? h.animVal.value :MathUtil.int(h));
	}
	
	static getElement(xml)
	{
		if(xml==undefined) return null;
		
		const map=ObjectPool.create(DOMDisplay);
		const rect=SVGUtil.getRect(xml);
	   	const svg=DOMUtil.createDOM("div",{style:{width:rect.width+"px",height:rect.height+"px"}});
	   	
	   	try{
	   		svg.innerHTML=new XMLSerializer().serializeToString(xml);
	   	}
	   	catch(err){
	   		svg.innerHTML=xml;
	   	}
	   	
	   	map.element=svg;
	   	return map;
	}
	
	static create (type, props)
	{
		if(type==undefined) return;
		let dom = document.createElementNS(SVGUtil.ns, type);
		
		if(props==undefined) props={};
		if(type.toLowerCase()=="svg" && !props.hasOwnProperty("xmlns")) props.xmlns=SVGUtil.ns;
		SVGUtil.setAttributes(dom,props);
		
		return dom;
	};
	
	static setAttributes(dom,props)
	{
		if(dom==null || props==null) return;
		
		for(let p in props) 
		{
			let val = props[p];
			if(val==null) continue;
			
			if(p == "style")
			{
				for(let s in val) dom.style[s] = val[s];
			}else if(p=="innerHTML" || p=="outerHTML"){
				dom.innerHTML=val;
			}else{
				dom.setAttribute(p, val);
			}
		}
	}
	
	static getElementsById(node,tagName,id)
	{
		let elems=node.getElementsByTagName(tagName);
		if(!elems.length) return null;
		for (let i=0,s,l=elems.length;i<l;i++){
			s=elems[i];
			if(s.id==id) return s;
		}
	}
	
	static get supported()
	{
		return (document.createElementNS!=undefined && document.createElementNS(SVGUtil.ns,'svg').createSVGRect!=undefined);
	}
}

SVGUtil.ns    = 'http://www.w3.org/2000/svg';
SVGUtil.xlink = 'http://www.w3.org/1999/xlink';
SVGUtil.xmlns = 'http://www.w3.org/2000/xmlns/';
