class StorageObject
{
	constructor(target=null)
	{
		this.target=null;
		if(target) this.init(target);
	}
	
	init(target)
	{
		if(!target) return;
		this.target=target;
	}
	
	setItem(label,value)
	{
		if(!this.target || StringUtil.isEmpty(label)) return false;
		if(typeof value=="object") value=JSON.stringify(value);
		this.target[label]=value;
	}
	
	getItem(label)
	{
		if(!this.target || StringUtil.isEmpty(label)) return false;
		return this.target[label];
	}
	
	clearItem(label)
	{
		if(!this.target) return false;
		delete this.target[label];
	}
	
	clear()
	{
		if(!this.target) return false;
		for(let label in this.target) 
			delete this.target[label];
	}
}
