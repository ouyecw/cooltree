import DisplayObjectContainer from '../display/DisplayObjectContainer.js'
import ScrollTouchList from './ScrollTouchList.js'
import StringUtil from '../utils/StringUtil.js'
import MathUtil from '../utils/MathUtil.js'
import TouchItem from './TouchItem.js'
import Global from '../core/Global.js'

/**
 * @class
 * @module GroupList
 * @extends DisplayObjectContainer
 */
export default class GroupList extends DisplayObjectContainer
{
	constructor()
	{
		super();
		this.space=0;
		this.auto_all=true;
		this._index_obj=this._IWidth=this._total=this._selectHandler=this._type=this._data=this._GHeight=this._GWidth=this._GSize=this._lists=null;
	}
	
	setup(type,data,w,h,size,indexArray)
	{
		if(data==null || data.length<1 ) return;	
		if(this._lists==null)  {
			this._selectHandler=Global.delegate(this._select_handler,this);
			this._lists=[];
		}
		
		this._GSize=size;
		this._type=type;
		this._GHeight=h;
		this._data=data;
		this._GWidth=w;
		
		this._total= MathUtil.countTreeMax(data,this._type);
		this._IWidth=Math.ceil((w/this._total)-this.space*(this._total-1));
		this._index_obj=(indexArray && indexArray.length>0) ? indexArray : null;
		
		this.create_list(data,this._index_obj ? this._index_obj[0] : 0);
		if(this._index_obj && this._index_obj.length==1) this._index_obj=null;
	}
	
	getData(prop)
	{
		if(this.numChildren==0) return [];
		let i,c,l=this._children.length;
		let obj=new Array(l);
		
		for (i = 0;i<l;i++) {
			c = this._children[i];
			obj[c.type]=StringUtil.isEmpty(prop) ? c.current : c.data[c.current][prop];
		}
		
		return obj;
	}
	
	getTitle()
	{
		if(this.numChildren==0) return null;
		let i,c,d,str,type=-1,l=this._children.length;
		
		for (i = 0;i<l;i++) {
			c = this._children[i];
			if(c.type<type) continue;
			d=c._datas[c.current];
			if(d==null || StringUtil.isEmpty(d[TouchItem.label]) || d.id==0) continue;
			str=d[TouchItem.label];
		}
		
		return str;
	}
	
	create_list(d,index)
	{
		let list,bool=false; 
		let num=this.numChildren;
		index=(index==null) ? 0 : index;
		
		if(this._lists.length>0){
			list=this._lists.shift();
			list.visible=true;
			bool=(list._list_height!=null);
		}
		else list=new ScrollTouchList();
		this.addChild(list);
	    list.addEventListener(ScrollTouchList.SELECT,this._selectHandler);
	    
	    if(this.auto_all && d.length>0 && (!d[0].hasOwnProperty("id") || d[0].id!=0)){
	    	let obj={id:0};
	    	obj[TouchItem.label]="全部";
	    	d.unshift(obj);
	    }
	    
	    list.type=num;
	    list.data=d;
	     
	    if(bool) list.goto(index,true) ;
	    else list.setup(this._IWidth,this._GHeight,this._GSize,TouchItem,true,"#FFFFFF",index);
	    
	    this.update_size();
	    return list;
	}
	
	updateSize(w)
	{
		if(w==null || w<100 || this._GWidth==w) return;
		this._GWidth=w;
		this._IWidth=Math.ceil((w/this._total)-this.space*(this._total-1));
		this.update_size();
	}
	
	update_size()
	{
		if(this.numChildren==0) return;
		let i,c,l=this._children.length;
		for (i = 0;i<l;i++) {
			c = this._children[i];
			c.listWidth=this._IWidth;
			c.x=c.type*(this._IWidth+this.space);
		}
	}
	
	getList(type)
	{
		let i,c,l=this._children.length;
		for (i = 0;i<l;i++) {
			c = this._children[i];
			if(type==c.type) return c;
		}
		
		return null;
	}
	
	removeList(type,bool)
	{
		let i,c,l=this._children.length;
		for (i = 0;i<l;i++) {
			c = this._children[i];
			if(c && c.type>=type) {
				c.removeEventListener(ScrollTouchList.SELECT);
				c.clear();
				c.data=null;
				c.removeFromParent(false);
				this._lists.push(c);
				
				if(bool){
					c._list_width=c._list_height=null;
				}
				
				l--;
				i--;
			}
		}
		
		this.update_size();
	}
	
	_select_handler(e)
	{
		let num=this.numChildren-1;
		let datas=e.params[this._type];
		let type=e.target.type;
		let list;
		
		if(datas && (datas instanceof Array) && datas.length>0){
			if(num>type) {
				list=this.getList(type+1);
				if(list) {
					if(this.auto_all && datas.length>0 && (!datas[0].hasOwnProperty("id") || datas[0].id!=0)){
				    	let obj={id:0};
				    	obj[TouchItem.label]="全部";
				    	datas.unshift(obj);
				    }
					
					list.data=datas;
			    }
			}else{
				this.create_list(datas,this._index_obj ? this._index_obj[type+1] : 0);
				if(this._index_obj && this._index_obj.length<=type+2) this._index_obj=null;
			}
			
			return;
		}else if(num>type) {
			this.removeList(type+1);
		}
		
		this.dispatchEvent(new Event(GroupList.SELECTED,e.params,type));
	}
}

GroupList.className="GroupList";
GroupList.SELECTED="group_list_selected";