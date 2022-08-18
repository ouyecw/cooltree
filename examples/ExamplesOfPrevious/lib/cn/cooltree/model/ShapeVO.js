
function ShapeVO(type,properties)
{
	this.id="shapevo_"+(ShapeVO.NUM++);
	this.type=this.rect=this.properties=null;
	if(type && properties) this.setup(type,properties);
}

ShapeVO.CILP="_clip";
ShapeVO.NUM=0;

/**
 * 设置
 * @param {String} type 图形节点标签名参看SVGLabel
 * @param {Object} properties
 */
ShapeVO.prototype.setup=function(type,properties)
{
	this.type=type.toLowerCase();
	this.properties=properties;
	this.rect=ObjectPool.create(Rectangle);
	this.rect.data=ShapeUtil.getShapeBounds(this);
	return this;
}

ShapeVO.prototype.reset=function()
{
	this.id="shapevo_"+(ShapeVO.NUM++);
	if(this.rect && this.rect instanceof Rectangle) ObjectPool.remove(this.rect);
	this.rect=this.type=this.properties=null;
}

ShapeVO.prototype.clone=function()
{
	var clone=ObjectPool.create(ShapeVO);
	clone.type=this.type;
	if(this.rect) clone.rect=this.rect.clone();
	clone.properties=ObjectUtil.copyAttribute({},this.properties,false);
	return clone;
}

ShapeVO.prototype.dispose=function()
{
	if(this.rect) ObjectPool.remove(this.rect);
	delete this.id,this.rect,this.type,this.properties;
}

ShapeVO.prototype.toString = function()
{
	return '{"id":"'+this.id+'","type":"'+this.type+'","rect":'+(this.rect ? this.rect.toString() :'')+'","properties":'+JSON.stringify(this.properties)+'}';
}

/**
 * 节点转换成vo
 * @param {String} node_string
 * @param {Object} pos 坐标点
 */
ShapeVO.create=function(node_string,pos)
{
	if(StringUtil.isEmpty(node_string)) return null;
	pos=(pos ? (pos==true ? {x:0,y:0} : pos) : null);
	
	var vo=ObjectPool.create(ShapeVO);
	var node=StringUtil.html2object(node_string);
	if(!node) return null;
	
	if(node.children) delete node.children;
	if(node.transform) delete node.transform;
	
	vo.type=node.tagName;
	delete node.tagName;
	vo.properties=node;
	
	vo.rect=ObjectPool.create(Rectangle);
	vo.rect.data=ShapeUtil.getShapeBounds(vo);
	
	return pos ? ShapeUtil.replace(vo,pos) : vo;
}

/**
 * vo转换成节点字符串
 * @param {ShapeVO} vo
 */
ShapeVO.string=function(vo)
{
	if(!vo) return "";
	var str='<'+vo.type+' ';
	for(var i in vo.properties){
		str+=(i+'="'+(i=="style" ? StringUtil.buildParams(vo.properties[i],true) : vo.properties[i])+'" ');
	}
	str+="/>";
	return str;
}