
class BitmapFont extends BaseObject
{
	constructor()
	{
		super();
		this.name;
		this.info={};
		this.common={};
		this.chars,this.pages,this.images;
	}

	dispose()
	{
		if(this.chars && this.chars.length>0){
			let i,l;
			for(i=0,l=this.chars.length;i<l;i++){
				ObjectPool.remove(this.chars[i]);
			}
		}
		
		delete this.name,this.info,this.common,this.chars,this.pages,this.images;
	}
}