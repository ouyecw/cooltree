
SVGUtil={};

SVGUtil.ns    = 'http://www.w3.org/2000/svg';
SVGUtil.xlink = 'http://www.w3.org/1999/xlink';
SVGUtil.xmlns = 'http://www.w3.org/2000/xmlns/';

/**
 * return (base_width,base_height,anim_width,anim_height);
 * @param {Object} xml
 */
SVGUtil.getRect=function(xml)
{
	if(xml==undefined) return null;
	const xml_doc=xml.documentElement ? xml.documentElement : xml;
	
	const w=xml_doc.width;
	const h=xml_doc.height;
	
	const w_bool=(w instanceof SVGAnimatedLength);
	const h_bool=(h instanceof SVGAnimatedLength);
	
	return new Rectangle(w_bool ? w.baseVal.value : 0,h_bool ? h.baseVal.value : 0,w_bool ? w.animVal.value :MathUtil.int(w),h_bool ? h.animVal.value :MathUtil.int(h));
}

SVGUtil.getElement=function(xml)
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

SVGUtil.create = function(type, props)
{
	if(type==undefined) return;
	var dom = document.createElementNS(SVGUtil.ns, type);
	
	if(props==undefined) props={};
	if(type.toLowerCase()=="svg" && !props.hasOwnProperty("xmlns")) props.xmlns=SVGUtil.ns;
	SVGUtil.setAttributes(dom,props);
	
	return dom;
};

SVGUtil.setAttributes=function(dom,props)
{
	if(dom==null || props==null) return;
	
	for(var p in props) 
	{
		var val = props[p];
		if(p == "style")
		{
			for(var s in val) dom.style[s] = val[s];
		}else if(p=="innerHTML" || p=="outerHTML"){
			dom.innerHTML=val;
		}else{
			dom.setAttribute(p, val);
		}
	}
}

SVGUtil.getElementsById=function(node,tagName,id)
{
	let elems=node.getElementsByTagName(tagName);
	if(!elems.length) return null;
	for (let i=0,s,l=elems.length;i<l;i++){
		s=elems[i];
		if(s.id==id) return s;
	}
}

SVGUtil.supported = function() 
{
	return !! document.createElementNS && !! document.createElementNS(SVGUtil.ns,'svg').createSVGRect;
}
