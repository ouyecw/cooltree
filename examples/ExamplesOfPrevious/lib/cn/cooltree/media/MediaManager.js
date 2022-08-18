
function MediaManager()
{
	this.cache_list=[];
	this.global_volume=1;
}

MediaManager.prototype.add=function(media)
{
	if(!media || this.cache_list.indexOf(media)>=0) return;
	media.setVolume(this.global_volume);
	this.cache_list.push(media);
}

MediaManager.prototype.remove=function(media)
{
	if(!media || this.cache_list.indexOf(media)<0) return;
	this.cache_list.splice(this.cache_list.indexOf(media),1);
}

MediaManager.prototype.stopOther=function(media)
{
	if(!media || this.cache_list.length<2) return;
	ArrayUtil.each(this.cache_list,function(item){
		if(item!=media && item.playing) item.stop();
	},this);
}

MediaManager.prototype.stopAll=function()
{
	if(this.cache_list.length<1) return;
	ArrayUtil.each(this.cache_list,function(item){
		if(item.playing) item.stop();
	},this);
}

MediaManager.prototype.setVolume=function(volume)
{
	this.global_volume=volume;
	ArrayUtil.each(this.cache_list,function(item){
		item.setVolume(this.global_volume);
	},this);
}

MediaManager.prototype.dispose=function()
{
	this.stopAll();
	this.cache_list=this.global_volume=null;
	delete this.cache_list,this.global_volume;
}
