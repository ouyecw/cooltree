DisplayUtil={};

/**
 * 将数据对象复制到目标对象
 * @param {Object} obj     数据对象
 * @param {Object} target  目标对象
 * @param {Object} data    相对数据
 * @param {Object} bool    true相反
 */
DisplayUtil.copyTransform = function(obj,target,data,bool)
{
	if(obj==undefined || target==undefined || target.parent==undefined) return;
	let r=(data && data.hasOwnProperty("rotation") ? data.rotation : 0);
	let sx=(data && data.hasOwnProperty("scaleX") ? data.scaleX : 1);
	let sy=(data && data.hasOwnProperty("scaleY") ? data.scaleY : 1);
	
	target.rotation=obj.rotation+(bool ? r : -r);
	target.scaleX=obj.scaleX*(bool ? sx : 1/sx);
	target.scaleY=obj.scaleY*(bool ? sy : 1/sy);
	
	target.moveTo(target.parent.globalToLocal(obj.localToGlobal(0,0)));
}
/**
 * @param {Object} gt get target
 * @param {Object} ct container target
 */
DisplayUtil.equalOrContain = function (gt,ct)
{
	if(gt==null || ct==null) return false;
	if(!(ct instanceof DisplayObjectContainer)) return (gt==ct);
	for(let obj=gt; obj!=null; obj=obj.parent)
	{
		if(obj==ct) return true;
	}
    return false;
}


DisplayUtil.autoSizeFromText = function(tf,minSize)
{
	if(tf==null || StringUtil.isEmpty(tf.text)) return;
	var sh,th,bool,type=ClassUtil.getQualifiedClassName(tf);
	if(!(type=="InputText" || (type=="TextField" && tf.lineWidth>0))) return;
	
	minSize=minSize || 8;
	bool=(type=="InputText");
	 
	tf.render();
	th=tf.height;
	sh=(bool ? tf.element : tf).scrollHeight;
	if(sh<=th) return;
	
	while(tf.size>minSize && sh>th){
    	tf.size=tf.size-1;
    	
    	tf.render();
    	sh=(bool ? tf.element : tf).scrollHeight;
    }
}
