
import ArrayUtil from '../utils/ArrayUtil.js'

/**
 * @class
 * @module MediaManager
 */
export default class MediaManager
{
	constructor()
	{
		this.cache_list=[];
		this.global_volume=1;
	}
	
	add(media)
	{
		if(!media || this.cache_list.indexOf(media)>=0) return;
		media.setVolume(this.global_volume);
		this.cache_list.push(media);
	}
	
	remove(media)
	{
		if(!media || this.cache_list.indexOf(media)<0) return;
		this.cache_list.splice(this.cache_list.indexOf(media),1);
	}
	
	stopOther(media)
	{
		if(!media || this.cache_list.length<2) return;
		ArrayUtil.each(this.cache_list,function(item){
			if(item!=media && item.playing) item.stop();
		},this);
	}
	
	stopAll()
	{
		if(this.cache_list.length<1) return;
		ArrayUtil.each(this.cache_list,function(item){
			if(item.playing) item.stop();
		},this);
	}
	
	setVolume(volume)
	{
		this.global_volume=volume;
		ArrayUtil.each(this.cache_list,function(item){
			item.setVolume(this.global_volume);
		},this);
	}
	
	dispose()
	{
		this.stopAll();
		this.cache_list=this.global_volume=null;
		delete this.cache_list,this.global_volume;
	}
}

MediaManager.className="MediaManager";