export default class LabelVO
{
    //文本
    content=""

    //文本颜色
    color="#000000"

    //文字大小
    fontSize=12;

    //label的坐标，原点是 marker 对应的经纬度
    anchorX=0;

    //label的坐标，原点是 marker 对应的经纬度
    anchorY=0;

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

    //文本对齐方式。有效值: left, right, center
    textAlign="center";

    //碰撞类型
    collision="";

    reset()
	{
        this.fontSize=12;
        this.bgColor="#ffffff";
        this.textAlign="center";
        this.content=this.collision="";
        this.color=this.borderColor="#000000";
        this.anchorX=this.anchorY=this.borderRadius=this.borderWidth=this.padding=0;
    }
}
LabelVO.className="LabelVO";
module.exports = LabelVO;