import TweenLite from '../transitions/TweenLite.js'
import DisplayBase from '../display/DisplayBase.js'
import ObjectPool from '../utils/ObjectPool.js'
import Factory from '../core/Factory.js'
import Effect from '../model/Effect.js'
import Global from '../core/Global.js'
import Button from './Button.js'

export default class TouchItem extends Button
{
	constructor()
	{
		super();
		this.index=this._line=this._data=null;
		this.is_selected=false;
	}
	
    setup(data,w,h)
	{
		this.instance=Factory.c("bs",["#FFFFFF",w,h]);
		// this.instance.instance.y=2;
		
		// this._line=Factory.c("bs",["#cdcdcd",w,2]);
		// this.instance.addChild(this._line);
		
		this.alpha=1;
		this._data=data;
		this.enable=true;
		this.setup(Factory.c("ef",[Effect.COLOR,"#FFFFFF",0.15]),Factory.c("ef",[Effect.COLOR,"#abdafd",0.2]),null,Factory.c("ef",[Effect.COLOR,"#26a2ff",0.2]));
		this.setLabel(this._data[TouchItem.label],"Microsoft YaHei","#555555",14,false,"#990000");
		this.tf.autoSize=this.tf.hide_over=false;
		if(!Global.useCanvas) this._center(); 
		
		this.tf.y=18;
		this.tf.width=w;
		this.setSize(w,h);
	}

    set selected(value) 
	{
        if(this.is_selected==value) return;
		this.is_selected=value;
		this.enable=!value;
		if(this.tf) this.tf.color=value ? "#FFFFFF" : "#000000";
    }
	
	get selected()
	{
		return this.is_selected;
	}
	
	set itemWidth(value)
	{
        if(this.instance.width==value) return;
		this.instance.width=value;
		// this._line.width=value;
		this._center(); 
    }
	
	get itemWidth()
	{
		return this.instance.width;
	}

    set itemHeight(value) 
	{
        if(this.instance.height==value) return;
		this.instance.height=value;
		this._center(); 
    }
	
	get itemHeight()
	{
		return this.instance.height;
	}

    set data(value) 
	{
        if(this._data==value) return;
		this._data=value;
		
		if(this._data && this.tf){
			this.tf.text=this._data[TouchItem.label];
			if(!Global.useCanvas) this._center(); 
		}
    }
	
	get data()
	{
		return this._data;
	}

	update(percent)
	{
		this.alpha=Math.max(MathUtil.format(percent*TouchItem.OFFSET),0.1);
	}

	_center()
	{
		if(this.tf==null) return;
		var tw=this.tf.text ? this.tf.text.length*14 : 0;
		var th=20;
		this.tf.moveTo((this.instance.width-tw)*0.5,(this.instance.height+2-th)*0.5);
	}

	reset()
	{
		if(this.instance) TweenLite.remove(this.instance);
		if(this.tf) this.tf.removeFromParent(true);
		this._enable=null;
		this._data=null;
		this.tf=null;
		
		if(this._line) this._line.removeFromParent(true);
		this._line=null;
		
		if(this.frames){
			var i,j,obj;
			for(i in this.frames){
				obj=this.frames[i];
				if(obj) {
					if(obj instanceof DisplayBase) obj.removeFromParent(true);
					else if(obj instanceof Effect) ObjectPool.remove(obj);
					else if(obj instanceof Array){
						for(j=0;j<obj.length;j++) ObjectPool.remove(obj[j]);
					}
				}
				delete this.frames[i];
			}
		}
		
		this.alpha=1;
		this.index=-1;
		this.frames={};
		this.instance=null;
		this.is_selected=null;
		this.removeAllChildren(true);
		Button.superClass.reset.call(this);
	}
	
	dispose()
	{
		super.dispose();
		delete this.index,this._line,this._data,this.is_selected;
	}

}

TouchItem.OFFSET=2;
TouchItem.label="title";
TouchItem.className="TouchItem";