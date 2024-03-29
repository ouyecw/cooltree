import ObjectPool from '../utils/ObjectPool.js'
import ObjectUtil from '../utils/ObjectUtil.js'
import UniqueUtil from '../utils/UniqueUtil.js'
import StringUtil from '../utils/StringUtil.js'
import ShapeUtil from '../utils/ShapeUtil.js'
import Rectangle from '../geom/Rectangle.js'

/**
 * @class
 * @module ShapeVO
 */
export default class ShapeVO
{
	/**
	 * 图形数据实例
	 * @param {String} type
	 * @param {Object} properties
	 */
	constructor(type=null,properties=null)
	{
		this.id=UniqueUtil.getName("shape_vo");
		this.type=this.rect=this.properties=null;
		if(type && properties) this.setup(type,properties);
	}
	
	/**
	 * 设置
	 * @param {String} type 图形节点标签名参看SVGLabel
	 * @param {Object} properties 图形节点属性项
	 * @return {ShapeVO}
	 */
	setup(type,properties)
	{
		this.type=type.toLowerCase();
		this.properties=properties;
		this.rect=ObjectPool.create(Rectangle);
		this.rect.data=ShapeUtil.getShapeBounds(this);
		return this;
	}
	
	/**
	 * 重置
	 * @param {String} type 图形节点标签名参看SVGLabel
	 * @param {Object} properties 图形节点属性项
	 */
	reset(type=null,properties=null)
	{
		this.id=UniqueUtil.getName("shape_vo");
		if(this.rect && this.rect instanceof Rectangle) ObjectPool.remove(this.rect);
		this.rect=this.type=this.properties=null;
		if(type && properties) this.setup(type,properties);
	}
	
	/**
	 * 克隆
	 */
	clone()
	{
		let clone=ObjectPool.create(ShapeVO);
		clone.type=this.type;
		if(this.rect) clone.rect=this.rect.clone();
		clone.properties=ObjectUtil.copyAttribute({},this.properties,false);
		return clone;
	}
	
	/**
	 * 销毁
	 */
	dispose()
	{
		if(this.rect) ObjectPool.remove(this.rect);
		delete this.id,this.rect,this.type,this.properties;
	}
	
	toString ()
	{
		return '{"id":"'+this.id+'","type":"'+this.type+'","rect":'+(this.rect ? this.rect.toString() :'')+'","properties":'+JSON.stringify(this.properties)+'}';
	}
	
	/**
	 * 节点转换成vo
	 * @param {Object|String} node_string 
	 * @param {Object} pos 位移坐标点 
	 * @param {Rectangle} rect 性状的矩形大小
	 * @return {ShapeVO}
	 */
	static create(node_string,pos=null,rect=null)
	{
		let vo,node;
		pos=(pos ? (pos==true ? {x:0,y:0} : pos) : null);
		
		if(typeof node_string =="string"){
			if(StringUtil.isEmpty(node_string)) return null;

			vo=ObjectPool.create(ShapeVO);
			node=StringUtil.html2object(node_string);
			if(!node) return null;
			
			if(node.children) delete node.children;
			if(node.transform) delete node.transform;
		}
		else if(typeof node_string =="object"){
			vo=ObjectPool.create(ShapeVO);
			node=node_string;
		}
		else return null;
		
		vo.type=node.tagName;
		delete node.tagName;
		vo.properties=node;
		
		vo.rect=ObjectPool.create(Rectangle);
		vo.rect.data=rect ? rect : ShapeUtil.getShapeBounds(vo);
		
		return pos ? ShapeUtil.replace(vo,pos) : vo;
	}
	
	/**
	 * vo转换成节点字符串
	 * @param {ShapeVO} vo
	 * @return {String}
	 */
	static string(vo)
	{
		if(!vo) return "";
		let str='<'+vo.type+' ';
		for(let i in vo.properties){
			str+=(i+'="'+(i=="style" ? StringUtil.buildParams(vo.properties[i],true) : vo.properties[i])+'" ');
		}
		str+="/>";
		return str;
	}
}

ShapeVO.CILP="_clip";
ShapeVO.className="ShapeVO";