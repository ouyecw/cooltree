
MovieManager={}

MovieManager._dic={}
MovieManager._cache={}

/**
 * 添加动画资源列表
 * @param {Array} sources
 */
MovieManager.addSources=function(sources)
{
	if(sources==null || sources.length<1) return;
	var i,len,source;
	const asset=[];
	
	for(i=0,len=sources.length;i<len;i++){
		source=sources[i];
		
		if(source.width==0){
			asset.push(source);
			continue;
		}
		
		if(!MovieManager._dic.hasOwnProperty(source.animation)){
			MovieManager._dic[source.animation]=StringUtil.isEmpty(source.label) ? [] : {};
		    MovieManager._cache[source.animation]=[];
		}
		
		if(!StringUtil.isEmpty(source.label) && !(MovieManager._dic[source.animation]).hasOwnProperty(source.label)){
			(MovieManager._dic[source.animation])[source.label]=[];
			MovieManager._cache[source.animation].push(source.label);
		}
		
		(!StringUtil.isEmpty(source.label) ? (MovieManager._dic[source.animation])[source.label] : MovieManager._dic[source.animation]).push(source);
	}
	
	if(asset.length>0) AssetManager.addSources(asset);
}

/**
 * 创建动画实例
 * @param {String} label     动画标签
 * @param {String} animation 动画归属的动作组 默认""
 * @param {Boolean} dom      true是DOM false是CANVAS
 * @param {Number} length    动画长度 帧
 * @param {Number} begin     动画起始帧
 */
MovieManager.getInstance=function(label,animation,dom,length,begin)
{
	var mc=Factory.c("mc",null,dom);
	var frames=MovieManager.getData(label,animation);
	
	if(length!=undefined || begin!=undefined){
		length=(length==null) ? frames.length : Math.min(frames.length,Math.abs(length));
		begin=(begin==null) ? 0 : MathUtil.clamp(begin,0,length);
		frames=frames.slice(begin,length);
	}
	
	mc.setFrames(frames);
	return mc;
}

MovieManager.getData=function(label,animation)
{
	animation=animation || "";
	
	if(!StringUtil.isEmpty(label) && !StringUtil.isEmpty(animation) && MovieManager._dic.hasOwnProperty(animation)) 
		return (MovieManager._dic[animation])[label];
	
	animation=StringUtil.isEmpty(animation) ? "" : animation;
	
	var temp=MovieManager._dic[animation];
	if(temp==null || temp instanceof Array) return temp;
	
	label=StringUtil.isEmpty(label) ? ObjectUtil.getLabels(temp)[0] : label;
	const datas=MovieManager._dic[animation][label];
	if(datas==undefined || datas==null) return null;
	
	return datas;
}

MovieManager.removeData=function(label,animation)
{
	animation=animation || "";
	if(!StringUtil.isEmpty(label) && !StringUtil.isEmpty(animation)) {
		delete (MovieManager._dic[animation])[label];
		return;
	} 
	
	animation=StringUtil.isEmpty(animation) ? ObjectUtil.getLabels(MovieManager._cache)[0] : animation;
	
	const temp=MovieManager._dic[animation];
	if(temp==undefined) return;
	
	if(StringUtil.isEmpty(label)) {
		delete MovieManager._dic[animation];
		delete MovieManager._cache[animation];
		return;
    }
	
	delete (MovieManager._dic[animation])[label];
}

MovieManager.clear=function()
{
	MovieManager._dic={};
    MovieManager._cache={};
}
