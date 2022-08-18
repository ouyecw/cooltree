
DoubleClick={};
DoubleClick._time=0;
DoubleClick._interval=300;

DoubleClick.check=function()
{
	var now=(new Date()).getTime();
	var delay=now-DoubleClick._time;
	DoubleClick._time=now;
	
	if(delay<DoubleClick._interval){
		DoubleClick._time=0;
		return true;
	}
	
	return false;
}
