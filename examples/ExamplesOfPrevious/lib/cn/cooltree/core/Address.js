/**
===================================================================
Address Class
===================================================================
**/

function Address()
{
	EventDispatcher.call(this);
	this.name="address_handler";
	this._target=this._onHashChange,this._value=null;
}

Global.inherit(Address,EventDispatcher);

Object.defineProperty(Address.prototype,"target",{
	get: function (){
		return this._target;
	},
    set: function (value) {
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
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Address.prototype,"value",{
	get: function (){
		if(this._value==undefined) this._value=window.location.hash.replace("#","");
		return this._value;
	},
    set: function (value) {
    	if(value==undefined || value==this._value) return;
    	this._value=value;
    	window.location.hash=value;
    },
    enumerable: true,
    configurable: true
});	

Address.prototype._hashChangeHandler=function()
{
	var str=window.location.hash.replace("#","");
	if(str==this._value) return;
	
	this._value=str;
	this.dispatchEvent(new Event(Address.CHANGE,this._value));
}

Address.prototype.dispose=function()
{
	this.target=null;
	this._onHashChange=this._value=null;
	Address.superClass.dispose.call(this);
	delete this._target,this._onHashChange,this._value,this.name;
}

Address.CHANGE="addressValueChange";

Address._instance;
Address.getInstance=function()
{
	if(Address._instance) return Address._instance;
	Address._instance=new Address();
	Address._instance.target=window;
	return Address._instance;
}
