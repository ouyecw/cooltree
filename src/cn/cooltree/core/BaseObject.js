/**
Shine Chen 
s_c@live.com 2015/05/04

===================================================================
BaseObject Class
===================================================================
**/

class BaseObject
{
	constructor()
	{
		
	}

    set data(value)
    {
    	if(value==undefined || value==null) return;
		ObjectUtil.copyAttribute(this,value,true);
    }

	toString()
	{
		return BaseObject.name;
	}
}