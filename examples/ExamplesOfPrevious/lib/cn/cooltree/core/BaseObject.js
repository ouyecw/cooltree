/**
Shine Chen 
s_c@live.com 2015/05/04

===================================================================
BaseObject Class
===================================================================
**/

function BaseObject()
{
}

Object.defineProperty(BaseObject.prototype,"data",{
    set: function (value) {
        if(value==undefined || value==null) return;
		ObjectUtil.copyAttribute(this,value,true);
    },
    enumerable: true,
    configurable: true
});

BaseObject.prototype.toString=function()
{
	return 'BaseObject';
}