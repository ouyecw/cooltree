export default class CalloutVO
{
    //文本
    content=""

    //文本颜色
    color="#000000"

    //文字大小
    fontSize=12;

    //边框圆角
    borderRadius=0;

    //边框宽度
    borderWidth=0;

    //边框颜色
    borderColor="#000000";

    //背景颜色
    bgColor="#ffffff";

    //文本边缘留白
    padding=0;

    //BYCLICK':点击显示; 'ALWAYS':常显
    display="ALWAYS";

    //文本对齐方式。有效值: left, right, center
    textAlign="center";

    //横向偏移量，向右为正数
    anchorX=0;

    //纵向偏移量，向下为正数
    anchorY=0;

    //碰撞类型
    collision="";

    reset()
	{
        this.fontSize=12;
        this.display="ALWAYS";
        this.bgColor="#ffffff";
        this.textAlign="center";
        this.content=this.collision="";
        this.color=this.borderColor="#000000";
        this.anchorX=this.anchorY=this.borderRadius=this.borderWidth=this.padding=0;
    }
}
CalloutVO.className="CalloutVO";
module.exports = CalloutVO;