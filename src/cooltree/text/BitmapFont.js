import ObjectUtil from '../utils/ObjectUtil.js'
import ObjectPool from '../utils/ObjectPool.js'

/**
 * @class
 * @module BitmapFont
 */
export default class BitmapFont
{
	constructor()
	{
		this.name;
		this.info={};
		this.common={};
		this.chars,this.pages,this.images;
	}
	
	set data(value)
	{
		if(value==undefined || value==null) return;
		ObjectUtil.copyAttribute(this,value,true);
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

BitmapFont.className="BitmapFont";