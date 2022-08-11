
function CommandList ()
{
	this._list=[];
	this._max=20;
}

CommandList.prototype.push=function(command)
{
	if(this._list==undefined) return;
	
	if(this._list.length>=this._max){
		var c=this._list.shift();
		if(c.active==Command.DELETE) c.target.dispose();
		ObjectPool.remove(c);
	}
	
	this._list.push(command);
}

CommandList.prototype.getPrec=function()
{
	if(this._list==undefined || this._list.length==0) return null;
	return this._list.pop();
}


