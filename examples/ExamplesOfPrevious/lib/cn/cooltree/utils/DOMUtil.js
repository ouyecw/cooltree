
DOMUtil={};

/**
 * 根据id获得DOM对象。
 * @param {String} id DOM对象的id。
 * @return {HTMLElement} DOM对象。
 */
DOMUtil.getDOM = function(id)
{
	return document.getElementById(id);
};

/**
 * 创建一个指定类型type和属性props的DOM对象。
 * @param {String} type 指定DOM的类型。比如canvas，div等。
 * @param {Object} props 指定生成的DOM的属性对象。
 * @return {HTMLElement} 新生成的DOM对象。
 */
DOMUtil.createDOM = function(type, props)
{
	const dom = document.createElement(type);
	if(props==undefined) return dom;
	return DOMUtil.setAttributes(dom,props);
};

DOMUtil.setAttributes=function(dom,props)
{
	if(dom==null || props==null) return;
	
	for(var p in props) 
	{
		var val = props[p];
		if(p == "style")
		{
			if(!dom.style) dom.style={};
			for(var s in val) dom.style[s] = val[s];
		}else if(val)
		{
			dom[p] = val;
		}
	}
	return dom;
}

/**
 * 创建一个可渲染的DOM，可指定tagName，如canvas或div。
 * @param {Object} disObj 一个DisplayObject或类似的对象。
 * @param {Object} imageObj 指定渲染的image及相关设置，如绘制区域rect。
 * @return {HTMLElement} 新创建的DOM对象。
 */
DOMUtil.createDOMDrawable = function(disObj, imageObj)
{
	var tag = disObj.tagName || "div";
	var img = imageObj.image;
	var w = disObj.width || (img && img.width);
	var h =  disObj.height || (img && img.height);

	var elem = DOMUtil.createDOM(tag);
	if(disObj.id) elem.id = disObj.id;
	elem.style.position = "absolute";
	elem.style.left = (disObj.left || 0) + "px";
	elem.style.top = (disObj.top || 0) + "px";
	elem.style.width = w + "px";
	elem.style.height = h + "px";

	if(tag == "canvas")
	{
		elem.width = w;
		elem.height = h;
		if(img)
		{
			var ctx = elem.getContext("2d");
			var rect = imageObj.rect || [0, 0, w, h];		
			ctx.drawImage(img, rect[0], rect[1], rect[2], rect[3], 
						 (disObj.x || 0), (disObj.y || 0), 
						 (disObj.width || rect[2]), 
						 (disObj.height || rect[3]));
		}
	}else
	{
		elem.style.opacity = disObj.alpha != undefined ? disObj.alpha : 1;
		elem.style.overflow = "hidden";
		if(img && img.src)
		{
			elem.style.backgroundImage = "url(" + img.src + ")";
			var bgX = disObj.rectX || 0, bgY = disObj.rectY || 0;
			elem.style.backgroundPosition = (-bgX) + "px " + (-bgY) + "px";
		}
	}
	return elem;
};

/**
 * 获取某个DOM元素在页面中的位置偏移量。格式为:{left: leftValue, top: topValue}。
 * @param {HTMLElement} elem DOM元素。
 * @return {Object} 指定DOM元素在页面中的位置偏移。格式为:{left: leftValue, top: topValue}。
 */
DOMUtil.getElementOffset = function(elem)
{
	var left = elem.offsetLeft, top = elem.offsetTop;
	while((elem = elem.offsetParent) && elem != document)
	{
		left += elem.offsetLeft;
		top += elem.offsetTop;
	}
	return {left:left, top:top};
};

DOMUtil.contains=function(container,target)
{
	if(!container || !target) return false;
	if(container===target) return true;
	
	if(!("compareDocumentPosition" in document || "contains" in document)) return DOMUtil._contains_manual(container,target);
	
	var adown = container.nodeType === 9 ? container.documentElement : container, 
	    bup   = target && target.parentNode;
	    
	return  container === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					container.compareDocumentPosition && container.compareDocumentPosition( bup ) & 16
			));
}

DOMUtil._contains_manual=function(a,b)
{
	if ( !b ) return false;
	while ( (b = b.parentNode) ) {
		if ( b === a ) {
			return true;
		}
	}
	return false;
}

DOMUtil.each=function(str,func)
{
	if(StringUtil.isEmpty(str) || !func || typeof func!="function") return;
	var node=document.createElement("div");
    node.innerHTML=str;
    DOMUtil._each_do(node,func);
    return node.innerHTML;
}

DOMUtil._each_do=function(node,func)
{
	var child,count= node.childElementCount;
	 for(var i=0;i<count;i++){ 
        if(node==undefined || node.children[i]==undefined){ 
            continue; 
        } 
        
        child=node.children[i];
        
        if(child.childElementCount>0){
            DOMUtil._each_do(child,func);
        }
        
        if(func) func(child);
    } 
}

DOMUtil.dispatchEvent=function(eventClass,eventType,node)
{
	let evObj = document.createEvent(eventClass);
    evObj.initEvent( eventType, true, false);
    (node || document).dispatchEvent(evObj);
}