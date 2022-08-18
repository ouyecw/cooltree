MathUtil={}

/**
 * 获取树形数据数组的最大分支数
 * @param {Array} array  树形数据数组
 * @param {String} attribute 子节点数据对象属性 为null表示整个都是子节点数据
 */
MathUtil.countTreeMax=function(array,attribute,num)
{
	var i,c,l=array.length;
	var length=(l>0) ? 1 : 0;
	var num=(num==null) ? length : num;
	
	for (i = 0;i<l;i++) {
		c=(attribute==null) ? array[i] : array[i][attribute];
		
		if(c && (c instanceof Array) && c.length>0){
			length=Math.max(length,num+MathUtil.countTreeMax(c,attribute,num));
		}
	}
	
	return length;
}

MathUtil.sort=function(arr,func)
{
	if(arr==null || arr.length<2 ) return;
	
	var flag,value1,value2;
    for(var i=0;i<arr.length-1;i++){
        flag =false;
        for(var j=0;j<arr.length-1;j++){
        	value1 =arr[j];
        	value2 =arr[j+1];
        	
        	if(func? func(value1,value2) : value2<value1){
                temp = arr[j+1];
                arr[j+1] = arr[j];
                arr[j] = temp;
                flag = true;
            }
        }
        
        if(!flag){
            return arr;
        } 
    }
    
    return arr;
}

/**
 * 字符串数字化
 */
MathUtil.int=function(string,save)
{
	var num=parseFloat(string);
	return isNaN(num) ? 0 : (save ? num : Math.round(num));
}

MathUtil.format=function(number,digit)
{
	if(typeof(number)=="string") 
		number=MathUtil.int(number,true);
	
	digit=digit|| 3;
	return Number(Number(number).toFixed(digit));
}

MathUtil.randomInt=function(max)
{
	max=max || 100;
	return MathUtil.int(max*Math.random());
}

MathUtil.clamp=function(number,min,max)
{
	if (number < min)
		return min;
	if (number > Math.max(max,min))
		return max;
	return number;
}

/**
 * 弧度转角度
 * @param {Number} radians
 */
MathUtil.getDegreesFromRadians=function(radians)
{
	return radians * 180 / Math.PI;
}

/**
 * 角度转弧度
 * @param {Number} degrees
 */
MathUtil.getRadiansFromDegrees=function(degrees)
{
	return degrees % 360 / 180 * Math.PI ;
}

MathUtil.getAngle=function(x1,y1,x2,y2)
{
	var radians=Math.atan2((y2 - y1), (x2 - x1));
	return radians<0 ? (radians+2*Math.PI) : radians;
}

MathUtil.normalizeRadian = function (value) 
{
    value = (value + Math.PI) % (Math.PI * 2.0);
    value += value > 0 ? -Math.PI : Math.PI;
    return value;
};

MathUtil.isEquivalent=function(a,b)
{
	var epsilon=0.0001;
	return (a - epsilon < b) && (a + epsilon > b);
}

/**
 * 根据框架尺寸获得缩放比例
 * @param {Number} img_width
 * @param {Number} img_height
 * @param {Number} frame_width
 * @param {Number} frame_height
 * @param {Boolean} fit
 */
MathUtil.getSizeScale=function(img_width,img_height,frame_width,frame_height,fit)
{
	fit=(fit==undefined) ? true : fit;
	var scale1=img_width/img_height;
	var scale2=frame_width/frame_height;
	
	if(fit ? scale1>scale2 : scale1<scale2) return MathUtil.format(frame_width/img_width,3);
	return MathUtil.format(frame_height/img_height,3);
}

MathUtil.isNumber = function (value) {
    return typeof (value) === "number" && !isNaN(value);
};

/**
 * 得到对应角度值的sin近似值
 * @param value {number} 角度值
 * @returns {number} sin值
 */
MathUtil.sin = function (value) {
    var valueFloor = Math.floor(value);
    var valueCeil = valueFloor + 1;
    var resultFloor = MathUtil.sinInt(valueFloor);
    var resultCeil = MathUtil.sinInt(valueCeil);
    return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
};

MathUtil.sinInt = function (value) {
    value = value % 360;
    if (value < 0) {
        value += 360;
    }
    if (value < 90) {
        return MathUtil._sin_map[value];
    }
    if (value < 180) {
        return MathUtil._cos_map[value - 90];
    }
    if (value < 270) {
        return -MathUtil._sin_map[value - 180];
    }
    return -MathUtil._cos_map[value - 270];
};
/**
 * 得到对应角度值的cos近似值
 * @param value {number} 角度值
 * @returns {number} cos值
 */
MathUtil.cos = function (value) {
    var valueFloor = Math.floor(value);
    var valueCeil = valueFloor + 1;
    var resultFloor = MathUtil.cosInt(valueFloor);
    var resultCeil = MathUtil.cosInt(valueCeil);
    return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
};

MathUtil.cosInt = function (value) {
    value = value % 360;
    if (value < 0) {
        value += 360;
    }
    if (value < 90) {
        return MathUtil._cos_map[value];
    }
    if (value < 180) {
        return -MathUtil._sin_map[value - 90];
    }
    if (value < 270) {
        return -MathUtil._cos_map[value - 180];
    }
    return MathUtil._sin_map[value - 270];
};

MathUtil._sin_map={};
MathUtil._cos_map={};

for (var NumberUtils_i = 0; NumberUtils_i <= 90; NumberUtils_i++) {
    MathUtil._sin_map[NumberUtils_i] = Math.sin(MathUtil.getRadiansFromDegrees(NumberUtils_i));
    MathUtil._cos_map[NumberUtils_i] = Math.cos(MathUtil.getRadiansFromDegrees(NumberUtils_i));
}
