
FontManager={}
FontManager._cache={};

/**
 * 添加位图字体资源
 * @param {BitmapFont} font
 */
FontManager.add=function(font)
{
	if(font==undefined || font==null) return;
	
	FontManager.remove(font.name);
	FontManager._cache[font.name]=font;
}

/**
 * 删除位图字体资源
 * @param {String} name
 */
FontManager.remove=function(name)
{
	if(!FontManager._cache.hasOwnProperty(name)) return;
	FontManager._cache[name].dispose();
	delete FontManager._cache[name];
}

/**
 * 是否含有对应名称的位图字体资源
 * @param {String} name
 */
FontManager.has=function(name)
{
	return (!StringUtil.isEmpty(name) && FontManager._cache[name]!=undefined);
}

/**
 * 获取位图字体资源
 * @param {String} name
 * @param {Number} charCode
 */
FontManager.get=function(name,charCode)
{
	if(StringUtil.isEmpty(name)){
		for(name in FontManager._cache) break;
	}
	
	if(StringUtil.isEmpty(name)) return null;
	if(charCode==undefined || charCode<0) return FontManager._cache[name];
	
	return FontManager._cache[name].chars[charCode];
}

/**
 * 清除所有位图字体资源
 */
FontManager.clear=function()
{
	var i;
	
	for(i in FontManager._cache){
		FontManager._cache[i].dispose();
		delete FontManager._cache[i];
	}
}
