
IsoAngle={};

IsoAngle.T=1;
IsoAngle.TL=2;
IsoAngle.L=3;
IsoAngle.BL=4;
IsoAngle.B=5;
IsoAngle.BR=6;
IsoAngle.R=7;
IsoAngle.TR=8;

/**
 * @param {Number} id
 */
IsoAngle.getOrientationLabel=function(id)
{
	switch(id){
		case 1:
			return "T";
		case 2:
			return "TL";
		case 3:
			return "L";
		case 4:
			return "BL";
		case 5:
			return "B";
		case 6:
			return "BR";
		case 7:
			return "R";
		case 8:
			return "TR";
	}
	return "";
}

/**
 * @param {String} str
 */
IsoAngle.getOrientationIndex=function(str)
{
	switch(str){
		case "T":
			return 1;
		case "TL":
			return 2;
		case "L":
			return 3;
		case "BL":
			return 4;
		case "B":
			return 5;
		case "BR":
			return 6;
		case "R":
			return 7;
		case "TR":
			return 8;
	}
	return 0;
}

/**
 * 8方向
 * @param {Number} angle
 */
IsoAngle.allroundState=function(angle)
{
	if(angle>=248 && angle<292)       return 1;
	else if(angle>=198 && angle<248)  return 2;
	else if(angle>=158 && angle<198)  return 3;
	else if(angle>=113 && angle<158)  return 4;
	else if(angle>=68  && angle<113)  return 5;
	else if(angle>=23  && angle<68 )  return 6;
	else if(angle<23   || angle>=337) return 7; 
	else if(angle>=292 && angle<337)  return 8;
	return 0;
}

/**
 * 4方向
 * @param {Number} angle
 */
IsoAngle.quarterState=function(angle)
{
	if(angle>=180 && angle<270)       return 2;
	else if(angle>=90 && angle<180)   return 4;
	else if(angle>=0  && angle<90 )   return 6;
	else if(angle>=270 && angle<360)  return 8;
	return 0;
}
