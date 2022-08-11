
function VideoItem()
{
	EditItem.call(this);
	this.type=-1;
}

Global.inherit(VideoItem,EditItem);

VideoItem.prototype.change=function()
{
	if(this.instance==null) return;
	this.instance.change();
	this.__checkDisplayUpdate();
}

VideoItem.prototype.clone=function()
{
	var copy=ObjectPool.create(VideoItem);
	
	var asset=MovieManager.getData("play_btn");
	var player=new VideoPlayer();
	var btn=new Button();
	btn.setup(asset[0],asset[1]);
	player.play_btn=btn;
	
	player.file=this.instance.file;
	player.src=URL.createObjectURL(this.instance.file);
	copy.setInstance(player);
	
	copy.type=this.type;
	copy.path=this.path;
	copy.param=this.param;
	copy.binding=this.binding;
	player.setSize(this.instance.width,this.instance.height);
	
	if(copy.instance.instance && this.instance.instance.filters.length>0){
		for(var i=0;i<this.instance.instance.filters.length;i++){
			var filter=this.instance.instance.filters[i];
			copy.instance.instance.filters.push(filter.clone());
		}
	}
	
	return copy;
}