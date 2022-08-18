
Iso={}

Iso._Y_CORRECT=Math.cos(-Math.PI / 6) * Math.SQRT2;

Iso.screenToSpace = function (point)
{
	return new Point(point.y + point.x * 0.5, 0, point.y - point.x * 0.5);
}
		
Iso.spaceToScreen = function(point3D)
{
	return new Point(point3D.x - point3D.z, point3D.y * Iso._Y_CORRECT + (point3D.x + point3D.z) * 0.5);
}

Iso.getMatrix = function(orientation)
{
	if(StringUtil.isEmpty(orientation)) return;
	
	var m = new Matrix();
	
	switch (orientation.toLowerCase())
	{
		case "xz":
		{
			var m2 = new Matrix();
			m2.scale(1, 0.5);
			
			m.rotate(Math.PI / 4);
			m.scale(Math.SQRT2, Math.SQRT2);
			m.concat(m2);
			
			break;
		}
			
		case "yz":
		{
			m.b = Math.PI / 180 * 30;
			break;
		}
			
		case "xy":
		{
			m.b = Math.PI / 180 * -30;
			break;
		}
	}
	
	return m;
}
