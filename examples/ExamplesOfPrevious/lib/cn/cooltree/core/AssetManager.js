AssetManager={};

AssetManager._cache={};

AssetManager.addFiles=function(files)
{
	if(files==null) return;
	var i,f,x,s,j,b;
	
	for(i in files){
		f=files[i];
		j=i.split("@")[0];
		if(f==undefined) continue;
		
		if(f instanceof Image){
			if(files.hasOwnProperty(j+"@xml") || files.hasOwnProperty(j+"@json")){
				
				b=files.hasOwnProperty(j+"@xml");
				x=files[j+(b ? "@xml" : "@json")];
				
				if(x==undefined) {
					AssetManager._cache[i]=f;
					continue;
				}
				
				s=AssetUtil.parseSheet(f,x,b);
				if(s==undefined || s.length<=0) {
					AssetManager._cache[i]=f;
					continue;
				}
				
				if(b){
					if(AssetManager._cache.hasOwnProperty(j+"@xml")){
						delete AssetManager._cache[j+"@xml"];
					}
				}
				else{
					if(AssetManager._cache.hasOwnProperty(j+"@json")){
						delete AssetManager._cache[j+"@json"];
					}
				}
				
				if(s[0].width>0) MovieManager.addSources(s);
				else             AssetManager.addSources(s);
			}
			else AssetManager._cache[i]=f;
		}
		else if(String(i.split("@")[1]).toLowerCase()=="fnt"){
			s=AssetUtil.parseFont(f);
			if(s==undefined)continue;
			FontManager.add(s);
		}
		else if(f instanceof URLLoader){
			AssetManager._cache[i]=f.content;
		}
		else AssetManager._cache[i]=f;
	}
}

AssetManager.addSources=function(sources)
{
	if(sources==null || sources.length<1) return;
	var i,len,source;
	const movie=[];
	
	for(i=0,len=sources.length;i<len;i++){
		source=sources[i];
		if(source==undefined || !(source instanceof Source)) continue;
		
		if(source.width>0) {
			movie.push(source);
			continue;
		}
		
		AssetManager._cache[source.name]=source;
	}
	
	if(movie.length>0) MovieManager.addSources(movie);
}

/**
 * 
 * @param {String} label
 * @param {Boolean} clone
 */
AssetManager.getSource=function(label,clone)
{
	let source;
	
	if(!AssetManager._cache.hasOwnProperty(label)) {
		source=MovieManager.getData(label);
    	source=(source && source.length==1) ? source[0] : source;
		return source;
	}
	
    source=AssetManager._cache[label];
    
    if((clone || !Global.useCanvas) && source){
    	if(source instanceof Image) source=AssetManager.__clone_image(source);
    	else if(source instanceof Source){
    		source=source.clone();
    		source.image=AssetManager.__clone_image(source.image);
    	}
    }
    
	return source;
}

AssetManager.__clone_image=function(img)
{
	var temp=ObjectPool.create(Image);
	temp.src=img.src;
	temp.width=img.width;
	temp.height=img.height;
	return temp;
}

AssetManager.removeSource=function(label)
{
	if(!AssetManager._cache.hasOwnProperty(label)) return;
	if(typeof AssetManager._cache[label].dispose=="function") AssetManager._cache[label].dispose();
	delete AssetManager._cache[label];
}

AssetManager.clear=function()
{
	AssetManager._cache={};
}
