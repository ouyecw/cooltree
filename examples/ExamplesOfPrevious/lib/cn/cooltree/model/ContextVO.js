
function ContextVO()
{
	this.actions=null;
	this.type_id=0;
	this._init();
}
	
ContextVO.prototype._init=function()
{
	if(this.actions) return;
	this.actions=[];
	let name,item;
	
	for(name in Global.context)
	{
    	item=Global.context[name];
    	if(typeof item!="function")continue;
    	this._create_func(name);
    }
}
	
ContextVO.prototype._create_func=function(name)
{
	const _this=this;
	this[name]=function(){
		_this.actions.push({method:name,data:arguments});
	}
}
	
ContextVO.prototype.getValue=function()
{
	let name,obj={};
	for(name in this)
	{
    	if(typeof this[name]=="function" || name=="actions" || name=="type_id") continue;
    	obj[name]=this[name];
	}
	return obj;
}
	
ContextVO.prototype.reset=function()
{
	let name;
	for(name in this)
	{
    	if(typeof this[name]==="function" || name=="actions" || name=="type_id") continue;
    	delete this[name];
	}
	
	this.type_id=0;
	this.actions=[];
}
