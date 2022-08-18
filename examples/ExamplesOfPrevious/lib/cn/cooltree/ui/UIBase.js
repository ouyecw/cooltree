
function UIBase()
{
	Sprite.call(this);
	this._auto_dispose=true;
	this._register_instance=null;
}

Global.inherit(UIBase, Sprite);

Object.defineProperty(UIBase.prototype,"instance",{
	get: function () {
	    return this._register_instance;
    },

    set: function (value) {
    	let depth=null;
    	
    	if(this._register_instance!=null) {
    		if(this._register_instance.parent){
    			depth=this._register_instance.getIndex();
	    		depth=Math.max(0,depth);
				this._register_instance.removeFromParent(this._auto_dispose);
    		}
    		
			this._register_instance =null;
		}
    	
    	if(value==null) return;
    	
        this._register_instance =value;
        if(depth!=null && !isNaN(""+depth)) this.addChildAt(this._register_instance,depth);
        else this.addChild(this._register_instance);
        
        this._updateSize();
        this.initialize();
        
    },
    enumerable: true,
    configurable: true
});

UIBase.prototype.initialize=function()
{	
}

UIBase.prototype.dispose=function()
{	
	this._register_instance.removeFromParent(true);
	this._register_instance=null;
	UIBase.superClass.dispose.call(this);
	delete this._register_instance,this._auto_dispose;
}

UIBase.prototype.toString = function()
{
	return "UIBase";
}