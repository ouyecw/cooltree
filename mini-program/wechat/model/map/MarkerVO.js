
export default class MarkerVO
{
	//点击事件回调会返回此 id
	id=-1;

	//缩放值（0-1）
	scale=1
	
	//聚合簇的 id 自定义点聚合簇效果时使用
	clusterId=0;
	
	//是否参与点聚合
	joinCluster=false;
	
	//纬度
	latitude=0;

	//经度
	longitude=0;

	//标注点名,点击时显示，callout 存在时将被忽略
	title="";

	//显示层级
	zIndex=1;

	//显示的图标,项目目录下的图片路径，支持网络路径、本地路径、代码包路径
	iconPath="";

	//选中状态
	iconPath2="";

	//旋转角度,顺时针旋转的角度，范围 0 ~ 360，默认为 0
	rotate=0;

	//标注的透明度,默认 1，无透明，范围 0 ~ 1
	alpha=1;

	//标注图标宽度,默认为图片实际宽度
	width='';

	//标注图标高度,默认为图片实际高度
	height='';

	//原始宽度
	originalWidth=0;

	//原始高度
	originalHeight=0;

	//经纬度在标注图标的锚点，默认底边中点 ,{x, y}，x 表示横向(0-1)，y 表示竖向(0-1)。{x: .5, y: 1} 表示底边中点
	anchor={x: 0.5, y: 1};

	//标记点上方的气泡窗口,参看CalloutVO
	callout=null;

	//自定义气泡窗口
	customCallout=null;

	//为标记点旁边增加标签,参看LabelVO
	label=null;

	//无障碍访问，（属性）元素的额外描述
	ariaLabel='';

	//碰撞类型
	collision='';

	//需要传递的信息（自定义）
	info=null;

	/**
	 * 碰撞关系
	 * marker 碰撞关系
		在一定范围内绘制多个 Marker 时，常会出现 Marker 压盖的情况，3.4.3 起支持设置碰撞关系。

		碰撞目标
		默认 Marker 不参与碰撞，collision 用于设置是否参与碰撞，支持枚举值 poi、marker，多类型时按 "," 分割。 poi: 和 poi 点碰撞后隐藏 poi marker: 和 marker 碰撞后隐藏自己或被碰的 marker

		发送碰撞时，按 zIndex 区分优先级，优先级低的将会被隐藏。

		例如 collision 设置为 poi,marker，表示与 poi 和 marker 均会参与碰撞。

		整体碰撞或区域碰撞
		Marker 的各个部分，包括 iconPath、callout、label 等，可以作为一个整体参与碰撞，也可独立开来。

		collision-relation 属性支持 alone 和 together 两种值。 together: 作为整体参与碰撞后隐藏，此时忽略各部件 callout 和 label 的 collision 属性。 alone：独立参与碰撞后隐藏，此时各部件 callout 和 label 可单独设置 collision 属性，未填写时则与主 Marker 保持一致。
	*/
	collisionRelation='';

	reset()
	{
		this.id=-1;
		this.joinCluster=false;
		this.anchor={x: 0.5, y: 1};
		this.scale=this.zIndex=this.alpha=1;
		this.info=this.label=this.customCallout=this.callout=null;
		this.originalWidth=this.originalHeight=this.clusterId=this.longitude=this.latitude=this.rotate=0;
		this.width=this.height=this.ariaLabel=this.collisionRelation=this.collision=this.title=this.iconPath=this.iconPath2='';
	}
}
MarkerVO.className="MarkerVO";
module.exports = MarkerVO;