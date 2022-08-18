
function BitmapFont()
{
	this.name;
	this.info={};
	this.common={};
	this.chars,this.pages,this.images;
	
	BaseObject.call(this);
}

Global.inherit(BitmapFont, BaseObject);

BitmapFont.prototype.dispose=function()
{
	if(this.chars && this.chars.length>0){
		var i,l;
		for(i=0,l=this.chars.length;i<l;i++){
			ObjectPool.remove(this.chars[i]);
		}
	}
	
	delete this.name,this.info,this.common,this.chars,this.pages,this.images;
}
