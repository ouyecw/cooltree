
class UIBase extends Sprite
{
	constructor()
	{
		super();
		this._auto_dispose=true;
		this._register_instance=null;
	}
	
	get instance()
	{
		return this._register_instance;
	}
	
	set instance(value) 
	{
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
        
    }
	
	initialize(){}

	dispose()
	{	
		this._register_instance.removeFromParent(true);
		this._register_instance=null;
		super.dispose();
		
		delete this._register_instance,this._auto_dispose;
	}
	
	toString()
	{
		return UIBase.name;
	}
}