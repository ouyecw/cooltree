/***
 * =========================================================
 * TweenLite 
 * =========================================================
 */

TweenLite={}

/**
 * course name
 */
TweenLite.NONE="none";
TweenLite.LINEAR="linear";
TweenLite.QUAD="quad";
TweenLite.CUBIC="cubic";
TweenLite.QUART="quart";
TweenLite.QUINT="quint";
TweenLite.SINE="sine";
TweenLite.CIRC="circ";
TweenLite.EXPO="expo";
TweenLite.ELASTIC="elastic";
TweenLite.BACK="back";
TweenLite.BOUNCE="bounce";
TweenLite.STRONG="strong";

/**
 * mode
 */
TweenLite.IN="in";
TweenLite.OUT="out";
TweenLite.IN_OUT="inout";
TweenLite.OUT_IN="outin";

TweenLite._timer;
TweenLite._tweens = [];
TweenLite._inited = false;
TweenLite._locked = false;
TweenLite._transitionList = {};	

TweenLite.init=function()
{
	TweenLite._inited = true;
	
	TweenLite.register("easenone",			Easing.easeNone);
	TweenLite.register("linear",			Easing.easeNone);		
	
	TweenLite.register("easeinquad",		Easing.easeInQuad);	
	TweenLite.register("easeoutquad",		Easing.easeOutQuad);	
	TweenLite.register("easeinoutquad",		Easing.easeInOutQuad);	
	TweenLite.register("easeoutinquad",		Easing.easeOutInQuad);
	
	TweenLite.register("easeincubic",		Easing.easeInCubic);
	TweenLite.register("easeoutcubic",		Easing.easeOutCubic);
	TweenLite.register("easeinoutcubic",	Easing.easeInOutCubic);
	TweenLite.register("easeoutincubic",	Easing.easeOutInCubic);
	
	TweenLite.register("easeinquart",		Easing.easeInQuart);
	TweenLite.register("easeoutquart",		Easing.easeOutQuart);
	TweenLite.register("easeinoutquart",	Easing.easeInOutQuart);
	TweenLite.register("easeoutinquart",	Easing.easeOutInQuart);
	
	TweenLite.register("easeinquint",		Easing.easeInQuint);
	TweenLite.register("easeoutquint",		Easing.easeOutQuint);
	TweenLite.register("easeinoutquint",	Easing.easeInOutQuint);
	TweenLite.register("easeoutinquint",	Easing.easeOutInQuint);
	
	TweenLite.register("easeinsine",		Easing.easeInSine);
	TweenLite.register("easeoutsine",		Easing.easeOutSine);
	TweenLite.register("easeinoutsine",		Easing.easeInOutSine);
	TweenLite.register("easeoutinsine",		Easing.easeOutInSine);
	
	TweenLite.register("easeincirc",		Easing.easeInCirc);
	TweenLite.register("easeoutcirc",		Easing.easeOutCirc);
	TweenLite.register("easeinoutcirc",		Easing.easeInOutCirc);
	TweenLite.register("easeoutincirc",		Easing.easeOutInCirc);
	
	TweenLite.register("easeinexpo",		Easing.easeInExpo);		
	TweenLite.register("easeoutexpo", 		Easing.easeOutExpo);		
	TweenLite.register("easeinoutexpo", 	Easing.easeInOutExpo);		
	TweenLite.register("easeoutinexpo", 	Easing.easeOutInExpo);
	
	TweenLite.register("easeinelastic", 	Easing.easeInElastic);		
	TweenLite.register("easeoutelastic", 	Easing.easeOutElastic);	
	TweenLite.register("easeinoutelastic", 	Easing.easeInOutElastic);	
	TweenLite.register("easeoutinelastic", 	Easing.easeOutInElastic);
	
	TweenLite.register("easeinback", 		Easing.easeInBack);		
	TweenLite.register("easeoutback", 		Easing.easeOutBack);		
	TweenLite.register("easeinoutback", 	Easing.easeInOutBack);		
	TweenLite.register("easeoutinback", 	Easing.easeOutInBack);
	
	TweenLite.register("easeinbounce", 		Easing.easeInBounce);		
	TweenLite.register("easeoutbounce", 	Easing.easeOutBounce);		
	TweenLite.register("easeinoutbounce", 	Easing.easeInOutBounce);	
	TweenLite.register("easeoutinbounce", 	Easing.easeOutInBounce);
	
	TweenLite.register("easeinstrong", 		Easing.easeInStrong);		
	TweenLite.register("easeoutstrong", 	Easing.easeOutStrong);		
	TweenLite.register("easeinoutstrong", 	Easing.easeInOutStrong);	
}

TweenLite.register=function(p_name, p_function)
{
	TweenLite._transitionList[p_name] = p_function;
}

TweenLite.count=function(name,mode,start_value,target_value,min,max,param)
{
	if (!TweenLite._inited) TweenLite.init();
	const p_name=TweenLite.getEaseName(name,mode);
	return TweenLite._tween(p_name,min, target_value, target_value-start_value, max, param);
}

TweenLite.getEaseName=function(name,mode)
{
	return (name==TweenLite.LINEAR) ? TweenLite.LINEAR : ("ease"+(name==TweenLite.NONE ? TweenLite.NONE : (mode+name)));
}

TweenLite._tween=function(ease,start_value,target_value,min,max,param)
{
	if (!TweenLite._inited) TweenLite.init();
	if(!TweenLite._transitionList.hasOwnProperty(ease)) return target_value;
	return TweenLite._transitionList[ease](min, start_value, target_value, max, param);
}

/**
 * default params : "delay","ease","easeParams","onStart","onStartParams","onUpdate","onUpdateParams","onComplete","onCompleteParams"
 * @param {Object} target
 * @param {Number} duration
 * @param {Object} vars
 */
TweenLite.to = function (target, duration, vars) 
{
	if(target==undefined || duration<=0 || vars==undefined) return;
	
	if(TweenLite._tweens.length==0){
		if(!TweenLite._locked && Stage.current){
			Stage.current.addEventListener(StageEvent.ENTER_FRAME,TweenLite._enterFrame);
		}else{
			if(TweenLite._timer==null) TweenLite._timer=new Timer();
			TweenLite._timer.addEventListener(Timer.TIME,TweenLite._enterFrame);
			TweenLite._timer.start();
		}
	}
	
	const data={target : target, duration : duration, vars : vars};
	data.max=Math.ceil(duration*1000/Timer.fps);
	data.min=0;
	
	if(data.vars.hasOwnProperty("delay") && data.vars["delay"]){
		data.delay=Math.ceil(Number(data.vars["delay"])*1000/Timer.fps);
		delete data.vars["delay"];
	}else {
		data.delay=0;
	}
	
	if(data.vars.hasOwnProperty("ease") && data.vars["ease"]){
		data.ease=data.vars["ease"];
		delete data.vars["ease"];
	}else{
		data.ease="easeoutquad";
	}
	
	if(data.vars.hasOwnProperty("easeParams") && data.vars["easeParams"]){
		data.easeParams=data.vars["easeParams"];
		delete data.vars["easeParams"];
	}
	
	if(data.vars.hasOwnProperty("onStart") && data.vars["onStart"]){
		data.onStart=data.vars["onStart"];
		delete data.vars["onStart"];
	}
	
	if(data.vars.hasOwnProperty("onStartParams") && data.vars["onStartParams"]){
		data.onStartParams=data.vars["onStartParams"];
		delete data.vars["onStartParams"];
	}
	
	if(data.vars.hasOwnProperty("onUpdate") && data.vars["onUpdate"]){
		data.onUpdate=data.vars["onUpdate"];
		delete data.vars["onUpdate"];
	}
	
	if(data.vars.hasOwnProperty("onUpdateParams") && data.vars["onUpdateParams"]){
		data.onUpdateParams=data.vars["onUpdateParams"];
		delete data.vars["onUpdateParams"];
	}
	
	if(data.vars.hasOwnProperty("onComplete") && data.vars["onComplete"]){
		data.onComplete=data.vars["onComplete"];
		delete data.vars["onComplete"];
	}
	
	if(data.vars.hasOwnProperty("onCompleteParams") && data.vars["onCompleteParams"]){
		data.onCompleteParams=data.vars["onCompleteParams"];
		delete data.vars["onCompleteParams"];
	}
	
	var k;
	for (k in data.vars) {
		if(data.first==undefined) data.first={};
		data.first[k]=(target[k]==undefined) ? 0 : target[k];
		data.vars[k]-=data.first[k];
	}
	
	TweenLite._tweens.push(data);
}

TweenLite.pause = function () 
{
	if(TweenLite._timer && TweenLite._timer.isStart()) {
		TweenLite._timer.stop();
		TweenLite._timer.removeEventListener(Timer.TIME,TweenLite._enterFrame);
	}
	else if(Stage.current){
		Stage.current.removeEventListener(StageEvent.ENTER_FRAME,TweenLite._enterFrame);
	}
}

TweenLite.resume = function () 
{
	if(TweenLite._timer && TweenLite._tweens.length>0  && !TweenLite._timer.isStart()) {
		TweenLite._timer.addEventListener(Timer.TIME,TweenLite._enterFrame);
		TweenLite._timer.start();
	}
	else if(Stage.current){
		Stage.current.addEventListener(StageEvent.ENTER_FRAME,TweenLite._enterFrame);
	}
}

TweenLite.remove = function (target) 
{
	if(target==undefined || TweenLite._tweens.length==0) return;
	
	var i,tween;
	var len=TweenLite._tweens.length;
	
	for (i=0;i<len;i++) {
		tween=TweenLite._tweens[i];
	    
	    if(tween.target==target){
	    	TweenLite._tweens.splice(i,1);
	    	len--;
	    	i--;
	    }
	}
	
	if(TweenLite._tweens.length==0) TweenLite.pause();
}

TweenLite._enterFrame=function(e)
{
	if(TweenLite._tweens.length==0) return;
	TweenLite._default_params
	
	var i,tween;
	const len=TweenLite._tweens.length;
	
	for (i=0;i<len;i++) {
		tween=TweenLite._tweens[i];
		TweenLite._setAttribute(tween);
	}
}

TweenLite._setAttribute=function(tween)
{
	if(tween==undefined) return;
	
	var k,twname;
	const target=tween["target"]; 
	
	if(tween.delay<=1 && tween.min==0 && tween.hasOwnProperty("onStart") && tween["onStart"]){
//		try{
			tween["onStart"].apply(null,tween.hasOwnProperty("onStartParams") ? tween["onStartParams"] : null);
//		}
//		catch(err){
//			twname=twname || target.name+"("+ClassUtil.getQualifiedClassName(target)+")";
//			trace("[ERROR] TweenLite._setAttribute:onStart "+twname+"{"+err+"}");
//		}
		
		delete tween["onStartParams"];
		delete tween["onStart"];
	}
	
	if(tween.delay>0) {
		tween.delay--;
		return;
	}
	else tween.min++;
	
	for (k in tween.vars) {
		target[k] = (tween.min>=tween.max) ? (tween.vars[k]+tween.first[k]) : TweenLite._tween(tween.ease,tween.first[k],tween.vars[k],tween.min,tween.max,tween.easeParams);
	}
	
	if(tween.min>=tween.max){
		const index=TweenLite._tweens.indexOf(tween);
		
		TweenLite._tweens.splice(index,1);
		if(TweenLite._tweens.length==0) TweenLite.pause();
		
		if(tween.hasOwnProperty("onComplete") && tween["onComplete"]){
//			try{
				tween["onComplete"].apply(null,tween.hasOwnProperty("onCompleteParams") ? tween["onCompleteParams"] : null);
//			}
//			catch(err){
//				twname=twname || target.name+"("+ClassUtil.getQualifiedClassName(target)+")";
//				trace("[ERROR] TweenLite._setAttribute:onComplete "+twname+"{"+err+"}");
//			}
		}
		return;
	}
	
	if(tween.hasOwnProperty("onUpdate") && tween["onUpdate"]){
//	    try{
			tween["onUpdate"].apply(null,tween.hasOwnProperty("onUpdateParams") ? tween["onUpdateParams"] : null);
//		}
//		catch(err){
//			twname=twname || target.name+"("+ClassUtil.getQualifiedClassName(target)+")";
//			trace("[ERROR] TweenLite._setAttribute:onUpdate "+twname+"{"+err+"}");
//		}
	}
}
