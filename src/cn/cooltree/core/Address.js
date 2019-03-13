/**
===================================================================
Address Class
===================================================================
**/
class Address extends EventDispatcher
{
	constructor()
	{
		super();
		this.name="address_handler";
		this._target=this._onHashChange=this._value=null;
	}
	
	get target()
	{
		return this._target;
	}
	
	set target(value)
	{
		if(value && value==this._target) return;
	    	
    	if(this._onHashChange==undefined){
    		this._onHashChange=Global.delegate(this._hashChangeHandler,this);
    	}
    	
    	if(this._target){
    		this._target.removeEventListener("hashchange",this._onHashChange);
    	}
    	
		this._target=value;
		if(value==undefined) return;
		this._target.addEventListener("hashchange",this._onHashChange);
	}
	
	_hashChangeHandler()
	{
		let str=Global.root.location.hash.replace("#","");
		if(str==this._value) return;
		
		this._value=str;
		this.dispatchEvent(Factory.c("ev",[Address.CHANGE,this._value]));
	}
	
	dispose()
	{
		super.dispose();
		this.target=null;
		this._onHashChange=this._value=null;
		delete this._target,this._onHashChange,this._value,this.name;
	}
	
	static getInstance()
	{
		if(Address._instance) return Address._instance;
		Address._instance=new Address();
		Address._instance.target=Global.root;
		return Address._instance;
	}
}

Address.CHANGE="addressValueChange";
Address._instance=null;
