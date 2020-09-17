
export default class LayoutUtil
{
	/**
	 * item UI数组排列平铺
	 * 
	 * @param {Array} array
	 * 全部UI数组列表
	 * 
	 * @param {Number} num
	 * UI 列表排列个数
	 * 
	 * @param {Boolean} isX
	 * UI 列表扩展方向 是X方向
	 * 
	 * @param {Rectangle} rect
	 * list标准化矩形
	 * x,y 起始点坐标
	 * width，height 格式化每item尺寸
	 * 
	 * @param {Point} space
	 * Xspace X方向间隙 
	 * Yspace Y方向间隙
	 * 例如new Point(Xspace,Yspace);
	 * 
	 * @param {Point} focus
	 * item焦点描述
	 * x 坐标 0~1
	 * y 坐标 0~1
	 * 例如中心点  new Point(0.5,0.5);
	 * 
	 * @param {Boolean} isForward
	 * UI 列表 是否正向扩展
	 */
	static tile(array,num,isX,rect,space,focus,isForward)
	{
		if(array==undefined || array.length<1 || num==undefined || num<1)return;
		if(isX==true) LayoutUtil._row(array,num,rect,space,focus,isForward);
		else  LayoutUtil._tier(array,num,rect,space,focus,isForward);
	}
	
	/**
	 * line X orientation
	 */
	static _row(array,tier,rect,space,focus,isForward)
	{
		focus=(focus==undefined) ? {x:0,y:0} : focus;
		let i,item,_width,_height,length=array.length;
		
		let _x=(rect && rect.x || 0);
		let _y=(rect && rect.y || 0);
	
		let Xspace=(space && space.x || 0);
		let Yspace=(space && space.y || 0);
		
		let reverseHeight=(isForward==undefined || !isForward) ? 0 : LayoutUtil._countSize(array,rect,(tier-1),Yspace);
		
		for(i=0;i<length;i++)
		{
			item=array[i];
			
		    _width=(rect==undefined || rect.width==0) ? (item ? item.getWidth() : 0) : rect.width;
		    _height=(rect==undefined || rect.height==0) ? (item ? item.getHeight() : 0) : rect.height;
			
			if(_width==0 && _height==0) continue;
			
			if(!(item==null || !(("x" in item) && ("y" in item)))){
				item.x=Math.round(_x+_width*focus.x); 
				item.y=Math.round(reverseHeight==0 ? _y : (_y+reverseHeight));
			}
			
		    _y+=(reverseHeight==0) ? Math.round(_height+Yspace) : Math.round((_height+Yspace)*-1);
			
		    if((i+1)%tier==0){
				_y=(rect==undefined ? 0 : rect.y);
				_x+=Math.round(_width+Xspace);
			}
		    
		}
	}
	
	/**
	 * line Y orientation
	 */
	static _tier(array,row,rect,space,focus,isForward)
	{
		focus=(focus==undefined) ? {x:0,y:0} : focus;
		let i,item,_width,_height,length=array.length;
		
		let _x=(rect && rect.x || 0);
		let _y=(rect && rect.y || 0);
	
		let Xspace=(space && space.x || 0);
		let Yspace=(space && space.y || 0);
		
		let reverseWidth=(isForward==undefined || !isForward) ? 0 : LayoutUtil._countSize(array,rect,(row-1),Xspace,true);
		    
		for(i=0;i<length;i++)
		{
			item=array[i];
	
		    _width=(rect==undefined || rect.width==0) ? (item ? item.getWidth(): 0) : rect.width;
		    _height=(rect==undefined || rect.height==0) ? (item ? item.getHeight(): 0) : rect.height;
			
			if(_width==0 && _height==0) continue;
			
			if(!(item==null || !(("x" in item) && ("y" in item)))){
				item.x=Math.round(reverseWidth==0 ? _x : (_x+reverseWidth)); 
				item.y=Math.round(_y+_height*focus.y);
			}
		    
		    _x+=(reverseWidth==0) ? Math.round(_width+Xspace) : Math.round((_width+Xspace)*-1);
			
		    if((i+1)%row==0){
		    	_x=(rect==undefined ? 0 : rect.x);
		    	_y+=Math.round(_height+Yspace);
		    }
		    
		}
	}
	
	static _countSize(array,rect,n,space,isWidth)
	{
		if(n<1) return 0;
				
		if(isWidth && rect && rect.width!=0) return Math.round(Math.abs(rect.width*n+(n-1)*space));
		if(!isWidth && rect && rect.height!=0) return Math.round(Math.abs(rect.height*n+(n-1)*space));
		
		let i,size=0;
		for(i=0;i<n;i++)
		{
			size+=isWidth ? Math.round(array[i].width) : Math.round(array[i].height);
			size+=space;
		}
		
		return size;
	}
}
