/**
===================================================================
DisplayObjectContainer Class
===================================================================
**/

import Global from '../core/Global.js'
import DOMDisplay from './DOMDisplay.js'
import DisplayBase from './DisplayBase.js'
import Rectangle from '../geom/Rectangle.js'
import DisplayObject from './DisplayObject.js'
import UniqueUtil from '../utils/UniqueUtil.js'
import CanvasUtil from '../utils/CanvasUtil.js'
import ObjectPool from '../utils/ObjectPool.js'
import StringUtil from '../utils/StringUtil.js'
import CollisionUtil from '../utils/CollisionUtil.js'

/**
 * @class
 * @module DisplayObjectContainer
 * @extends DisplayBase
 */
export default class DisplayObjectContainer extends DisplayBase
{
	constructor()
	{
		super();
		this.name=UniqueUtil.getName("display_object_container");
		this.use_canvas=Global.useCanvas;
		this.mouseChildren=true;
		this.autoSize = false;
		this._parentNode=null;
		this._children=[];
	}
	
	get stage()
	{
		return this._stage;
	}
	
	set stage(value) 
	{
        if(this._stage==value) return;
		this._stage=value;
		
		if(this._children==undefined || this._children.length<1) return;
		let i,c,l;
		for (i = 0,l=this._children.length;i<l;i++) {
			c = this._children[i];
			c.stage=value;
		}
    }
	
	get alpha()
	{
		return this._alpha;
	}
	
	set alpha(value) 
	{
        if(this._alpha==value) return;
		this._alpha=value;
		this.__checkDisplayUpdate();
		this._update_parent_alpha();
    }
	
	get visible()
	{
		return this._visible;
	}
	
	set visible(value) 
	{
        if(this._visible==value) return;
		this._visible=value;
		this.__checkDisplayUpdate();
		
		if(this._children.length<1) return;
		this._update_child_visible();
    }
	
	get updateMatrix()
	{
		return this._updateMatrix;
	}
	
	set updateMatrix(value) 
	{
		if(value)this.__checkDisplayUpdate();
        if(this._updateMatrix==value) return;
		this._updateMatrix=value;
		
		if(value && this._bounds) this._bounds.width=this._bounds.heigth=0;
		
		if(!value || this._children.length<1) return;
		let i,c,l;
		for (i = 0,l=this._children.length;i<l;i++) {
			c = this._children[i];
			c.updateMatrix=true;
		}
    }
	
	get parentNode()
	{
		return this._parentNode;
	}
	
	set parentNode(value) 
	{
        if(this._parentNode==value) return;
		this._parentNode=value;
		
		if(this._children.length<1) return;
		let i,c,l;
		for (i = 0,l=this._children.length;i<l;i++) {
			c = this._children[i];
			if(!(c instanceof DisplayObject)) c.parentNode=value;
		}
    }
	
	get numChildren()
	{
		return this._children.length;
	}
	
	_update_parent_alpha()
	{
		if(this._children.length<1) return;
		let i,c,l;
		for (i = 0,l=this._children.length;i<l;i++) {
			c = this._children[i];
			c._parent_alpha=this._alpha*this._parent_alpha;
			if(c instanceof DisplayObjectContainer) c._update_parent_alpha();
		}
	}
	
	_update_child_visible()
	{
		let i,c,l;
		for (i = 0,l=this._children.length;i<l;i++) {
			c = this._children[i];
			
			if(c instanceof DisplayObjectContainer)
				c._update_child_visible();
			else if(c instanceof DOMDisplay) 
				c._update_visible();
		}
	}
	
	/**
	 * 添加显示子对象
	 * @param {DisplayBase} displayObject
	 */
	addChild(displayObject)
	{
		if(displayObject==undefined || !displayObject instanceof DisplayBase) return ;
		return this.addChildAt(displayObject,this._children.length);
	}
	
	/**
	 * 添加显示子对象 到对应图层
	 * @param {DisplayBase} displayObject
	 * @param {Number} index
	 */
	addChildAt(displayObject,index)
	{
		if(displayObject==undefined || !displayObject instanceof DisplayBase) return ;
		
		displayObject.parent && displayObject.parent.removeChild(displayObject);
		this._children.splice(index, 0, displayObject);
		
		if(displayObject instanceof DisplayObject) DisplayObjectContainer._num_canvas_target++;
		else displayObject.parentNode=this._parentNode;
		
		displayObject.stage=this.stage;
		displayObject.parent=this;
		
		displayObject.updateMatrix=true;
		displayObject._parent_alpha=this._alpha*this._parent_alpha;
		
		if(this.autoSize) {
			this._updateSize();
		}else{
			this.width=Math.max(this.width,displayObject.getWidth());
			this.height=Math.max(this.height,displayObject.getHeight());
		}
		
		return displayObject;
	}
	
	_updateSize()
	{
		if(this._children==undefined || this._children.length==0) return;
		let i,c,l, bounds,rect=ObjectPool.create(Rectangle);
		
		for (i = 0,l=this._children.length;i<l;i++) {
			c = this._children[i];
			bounds= c.getBounds(this);
			rect=rect.union(bounds);
		}
		
		this._minX=Math.floor(rect.x);
		this._minY=Math.floor(rect.y);
		
		this.width=Math.ceil(rect.width);
		this.height=Math.ceil(rect.height);
		ObjectPool.remove(rect);
	}
	
	/**
	 * 移除子对象
	 * @param {DisplayBase} displayObject
	 */
	removeChild(displayObject)
	{
		return this.removeChildAt(this._children.indexOf(displayObject));
	}
	
	/**
	 * 移除对应图层子对象
	 * @param {Number} index
	 */
	removeChildAt(index)
	{
		if (index < 0 || index > (this._children.length - 1)) return null;
		let displayObject=this._children[index];
		displayObject.stage=displayObject.parent=null;
		this._children.splice(index,1);
		displayObject._parent_alpha=1;
		
		if(this._children.length==0) this.width=this.height=0;
		else if(this.autoSize)  this._updateSize();
		
		if(displayObject instanceof DisplayObject) DisplayObjectContainer._num_canvas_target--;
		else displayObject.parentNode=null;
		
		return displayObject;
	}
	
	/**
	 * 根据对象名称,获取对应子对象
	 * @param {String} name
	 * @returns {DisplayBase} displayObject
	 */
	getChildByName(name)
	{
		if(StringUtil.isEmpty(name)) return;
		
		let i;
		let len=this._children.length;
		
		for (i=0; i < len; i++) 
		{
			if (this._children[i].name == name) return this._children[i];
		}
		return null;
	}
	
	/**
	 * 根据图层数,获取对应子对象
	 * @param {Number} index
	 * @returns {DisplayBase} displayObject
	 */
	getChildAt(index)
	{
		if (index < 0 || index > (this._children.length - 1)) return null;
		return this._children[index];
	}
	
	/**
	 * 清除全部子对象
	 * @param {Boolean} bool 清除时是否销毁子对象
	 */
	removeAllChildren(bool)
	{
		if(this._children==undefined || this._children.length<1) return;
		
		let i,c,l;
		for (i = 0,l=this._children.length;i<l;i++) {
			c = this._children[i];
			c.stage=c.parent=null;
			c._parent_alpha=1;
			
			if(c instanceof DisplayObject) DisplayObjectContainer._num_canvas_target--;
			else c.parentNode=null;
			
			if(bool && !Global.gc(c)){
				try{
					c.dispose();
				}
				catch(e){}
			}
			
		}
		
		this._children=[];
		this.width=this.height=0;
	}
	
	/**
	 * 是否包含该显示对象
	 * @param {DisplayBase} displayObject
	 */
	contains(displayObject)
	{
		return this._children.indexOf(displayObject)!=-1;
	}
	
	render(target)
	{
		if(this._children==undefined || this._children.length==0) return;
		if(this.updateMatrix) this.getMatrix(target,true);
		
		let i,child;
		
		for (i=0; i < this._children.length; i++) {
			child=this._children[i];
			if(!this.visible && (child instanceof DisplayObject)) continue;
			child.render(...arguments);
		}
		
		this.updateMatrix=false;
	}
	
	/**
	 * 调换两个图层的位置
	 * @param {Number} index1
	 * @param {Number} index2
	 */
	swapChildrenAt(index1, index2)
	{
		const len=this._children.length;
		if(len==0 || index1>=len || index1<0) return;
		
		index2=index2<0 ? 0 :(index2>=len ? len-1 : index2);
	    const temp=this._children[index1];
	    this._children[index1]=this._children[index2];
	    this._children[index2]=temp;
	}
	
	/**
	 * 移动子对象到对应图层
	 * @param {DisplayBase} displayObject
	 * @param {Number} index
	 */
	setChildIndex(child, index)
	{
		const pos=this._children.indexOf(child);
		if(child==null || pos<0 || pos==index) return;
		this._children.splice(pos,1);
		this._children.splice(index, 0, child);
	}
	
	/**
	 * 点碰撞子对象 
	 * all true-返回所以碰撞列表  false-返回最上层碰撞对象
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Boolean} usePixelTrace
	 * @param {Boolean} all
	 */
	getObjectUnderPoint (x, y, usePixelTrace,all) 
	{
		let g;
		if (all) g = [];
		
		for (let i = this._children.length - 1; i >= 0; i--) {
			let h = this._children[i];
			if (h == null || !h.visible) continue;
			
			if ((h instanceof DisplayObjectContainer) && h.mouseChildren && h.numChildren > 0) {
				let j = h.getObjectUnderPoint(x, y, usePixelTrace, all);
				if (j){
					if (!all) return j;
					if(j.length > 0) g = g.concat(j);
				}else if (h.mouseEnabled && h.hitTestPoint(x, y, usePixelTrace)){
					if (!all) return h;
					g.push(h);
				}
			} else if (h.mouseEnabled && h.hitTestPoint(x,y, usePixelTrace)){
				if (!all) return h;
				g.push(h);
			}
		}
		
		return all ? g : null;
	}
	
	/**
	 * 本容器是否与对应坐标有碰触
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Boolean} usePixelTrace
	 * @returns {Boolean}
	 */
	hitTestPoint (x,y, usePixelTrace) 
	{
		if(this._children.length<=0) return false;
		
		if(!this.mouseChildren && this.autoSize){
			return CollisionUtil.hitTestPoint(this,x,y, this.usePolyCollision)>0 ;
		}
		
		for (let i = this._children.length - 1; i >= 0; i--) {
			let h = this._children[i];
			if(this.usePolyCollision && !h.usePolyCollision) h.usePolyCollision=true;
			if(h.hitTestPoint(x,y, usePixelTrace)) return true;
		}
		
		return false;
	}
	
	/**
	 * 本容器是否与对应另一个显示对象有碰触
	 * @param {DisplayBase} obj
	 * @param {Boolean} usePixelTrace
	 * @returns {Boolean}
	 */
	hitTestObject (obj, usePixelTrace) 
	{
		let i,h,j,g;
		
		for (i = this._children.length - 1; i >= 0; i--) {
			h = this._children[i];
			if(!(obj instanceof DisplayObjectContainer)) {
				if(h.hitTestObject(obj,usePixelTrace)) return true;
				continue;
			}
			
			for (j = obj._children.length - 1; j >= 0; j--) {
			    g = obj._children[i];
			    if(h.hitTestObject(g,usePixelTrace)) return true;
			}
		}
		
		return false;
	}
	
	catchAsImage ()
	{
		if(this._children.length<=1) return;
		
		this._updateSize();
		const image=CanvasUtil.containerToImage(this);
		this.removeAllChildren(true);
		
		const display_obj=new (this.use_canvas ? DisplayObject : DOMDisplay)();
		display_obj.setInstance(image);
		this.addChild(display_obj);
	}
	
	reset()
	{
		this.parentNode=null;
		this.removeAllChildren(true);
		
		this.name=null;
		this.autoSize = false;
		this.mouseChildren=true;
		this.use_canvas=Global.useCanvas;
		
		super.reset();
	}
	
	/**
	 * 销毁
	 */
	dispose()
	{
		super.dispose();
		delete this.use_canvas,this._parentNode,this.autoSize,this._children,this.mouseChildren;
	}
	
	toString()
	{
		return DisplayObjectContainer.name;
	}

}

DisplayObjectContainer.className="DisplayObjectContainer";
DisplayObjectContainer._num_canvas_target=0;