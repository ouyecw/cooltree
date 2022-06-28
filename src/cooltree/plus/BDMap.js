import EventDispatcher from '../events/EventDispatcher.js'

/**
 * @class
 * @module BDMap
 * @extends EventDispatcher
 */
export default class BDMap extends EventDispatcher
{
	
	constructor()
	{
		super();
		this.id="baidu_map";
		this.path="http://api.map.baidu.com/getscript";
		this.current=this.list=this.div=this.map=this.content=this.options=null;
	}

	/**
	 * 初始化百度地图
	 * @param {String} version
	 * @param {String} key
	 * @param {Boolean} hideLogo
	 * @param {Object}  options
	 */
	init(version,key,hideLogo,options)
	{
		let _this=this;
		this.options=(options==undefined) ? this.getDefaultOptions() : options;
		
		if(!((version=="" || version==null) && (key=="" || key==null))){
			_this.content = document.createElement("script");
			_this.content.onload = function () {
				_this._init_map();
			};
			
			_this.content.onerror = function () {
				trace("[ERROR]Baidu Map loading Error by version "+version+" and key "+key);
			}
			
			_this.content.src = this.path+"?v="+version+"&ak="+key+"&services=&t="+new Date().getTime();
			_this.content.type = "text/javascript";
			document.querySelector('head').appendChild(_this.content);
		}
		else _this._init_map();
	
		if(hideLogo==undefined || !hideLogo) return;
		
		let _style=document.createElement("style");
		_style.type="text/css";
		_style.innerText=".anchorBL{display:none;}";
		document.querySelector('head').appendChild(_style);
	}
	
	_init_map()
	{
		if(this.options==null){
			trace("[ERROR]options can't be null.");
			return;
		}
		
		this.div=this.options.div;
		
		if(this.div==null){
			this.div=document.createElement("div");
			this.div.id=opt.name;
			
			if(this.options.size){
				this.div.style.width = this.options.size.w + "px";
				this.div.style.height= this.options.size.h + "px";
			}
			
			document.body.appendChild(this.div);
		}
		
		let opt={};
		opt.enableHighResolution=this.options.high;
		opt.enableAutoResize=this.options.auto;
		opt.enableMapClick=this.options.click;
		
		if(this.options.zoom){
			opt.minZoom=this.options.zoom.min;
			opt.maxZoom=this.options.zoom.max;
		}
		
		this.map=new BMap.Map(("string" == typeof this.div) ? this.div : this.div.id,opt);
		
		if(this.options.drag) this.map.enableDragging();
		else                  this.map.disableDragging();
		
		if(this.options.pinch) this.map.enablePinchToZoom();
		else                   this.map.disablePinchToZoom();
		
		if(this.options.wheel) this.map.enableScrollWheelZoom();
		else                   this.map.disableScrollWheelZoom();
		
		if(this.options.resize) this.map.enableAutoResize();
		else                    this.map.disableAutoResize();
		
		if(this.options.double) this.map.enableDoubleClickZoom();
		else                    this.map.disableDoubleClickZoom();
		
		if(this.options.keyboard) this.map.enableKeyboard();
		else                      this.map.disableKeyboard();
		
		if(this.options.inertial) this.map.enableInertialDragging();
		else                      this.map.disableInertialDragging();
		
		if(this.options.continuous) this.map.enableContinuousZoom();
		else                        this.map.disableContinuousZoom();
		
		if(this.options.scale_control){
			let scaleControl = new BMap.ScaleControl({anchor:this.options.scale_control.pos,offset:new BMap.Size(this.options.scale_control.offset.x,this.options.scale_control.offset.y)});
		    scaleControl.setUnit(this.options.scale_control.unit);
		    this.map.addControl(scaleControl);
		}
		
		if(this.options.navigation_control){
			let navControl = new BMap.NavigationControl({anchor:this.options.navigation_control.pos,offset:new BMap.Size(this.options.navigation_control.offset.x,this.options.navigation_control.offset.y),type:this.options.navigation_control.type});
		    this.map.addControl(navControl);
		}
		
		if(this.options.minmap_control){
			let overviewControl = new BMap.OverviewMapControl({anchor:this.options.minmap_control.pos,offset:new BMap.Size(this.options.minmap_control.offset.x,this.options.minmap_control.offset.y),isOpen:this.options.minmap_control.open});
		    this.map.addControl(overviewControl);
		}
		
		if(this.options.geolocation_control){
			let icon=(this.options.geolocation_control.icon=="" || this.options.geolocation_control.icon==null) ? null : new BMap.Icon(this.options.geolocation_control.icon,this.options.geolocation_control.size ? new BMap.Size(this.options.geolocation_control.size.w,this.options.geolocation_control.size.h) :null);
			let geolocationControl = new BMap.GeolocationControl({anchor:this.options.minmap_control.pos,offset:new BMap.Size(this.options.geolocation_control.offset.x,this.options.geolocation_control.offset.y),showAddressBar:this.options.geolocation_control.display,enableAutoLocation:this.options.geolocation_control.auto,locationIcon:icon});
		    this.map.addControl(geolocationControl);
		}
		
		if(this.options.complete) this.options.complete.call();
	}
	
	/**
	 * @param {Object} datas
	 * #example
	 * {
	 *   zoom:赋值范围为3-18
	 *   list:[
	 *    {
	 * 	     point:{x:经度,y:纬度},
	 *       label:{name:"显示名称",offset:{x:相对位移,y:相对位移}},
	 *       icon:{src:"图标地址",size:{w:图标宽度,h:图标高度},offset:{x:相对位移,y:相对位移}},
	 *       content:{
	 * 	         title:"标题",
	 *           info:"HTML信息框显示信息",
	 *           width:"宽度"
	 *       }
	 *    }
	 *   ],
	 *   first:0
	 * }
	 */
	resetOverlays(datas)
	{
		if(this.map==null || datas==null || datas.list==undefined || datas.list.length==undefined || datas.list.length<1) return;
		this.map.clearOverlays();
		this.list=[];
		
		let a,i,d,m,n,o,p,w,t,l=datas.list.length;
		
		for(i=0;i<l;i++){
			d=datas.list[i];
			p=new BMap.Point(Number(d.point.x),Number(d.point.y));
			m=new BMap.Marker(p);
			
			if(d.icon){
				n=new BMap.Icon(d.icon.src,d.icon.size ? new BMap.Size(d.icon.size.w,d.icon.size.h) :null,d.icon.offset ? {offset:new BMap.Size(d.icon.offset.x,d.icon.offset.y)} :{});
			    m.setIcon(n);
			}
			
			if(d.label){
				a=new BMap.Label(d.label.name,d.label.offset ? {offset:new BMap.Size(d.label.offset.x,d.label.offset.y)} :{});
			    m.setLabel(a);
			}
			
			if(d.content){
				t={ width: Number(d.content.width),title: d.content.title,enableMessage: false};
				w=new BMap.InfoWindow(d.content.info,t);
				this._add_event(m,w,this,i);
			}
			
			this.map.addOverlay(m);
			o={p:p,m:m,w:w};
			this.list.push(o);
		}
		
		if(datas.first==undefined || datas.first>=l || datas.first<0) return;
		this.map.centerAndZoom(this.list[datas.first].p,datas.zoom);
		this.changeIndex(datas.first);
		this.current=datas.first;
	}
	
	_add_event(m,w,s,i)
	{
		m.addEventListener("click",function(){
	        m.openInfoWindow(w);
	        s.current=i;
	//      s.map.setCenter(s.list[i].p);
	    });
	}
	
	changeIndex(index)
	{
		if(this.list==null || index<0 || index>=this.list.length || this.current==index) return;
		this.map.closeInfoWindow();
		
		this.current=index;
		let o=this.list[index];
		if(o==undefined) return;
		
		o.m.openInfoWindow(o.w);
		this.map.setCenter(o.p);
	}
	
	getDefaultOptions()
	{
		let opt={};
		
		/**
		 * id
		 */
		opt.name=this.id;
		
		/**
		 * 回调函数
		 */
		opt.complete;
		
		/**
		 * 指定创建地图的容器
		 */
		opt.div=null;
		
		/**
		 * 是否启用使用高分辨率地图。在iPhone4及其后续设备上，可以通过开启此选项获取更高分辨率的底图.
		 */
		opt.high=true;
		
		/**
		 * 是否自动适应地图容器变化
		 */
		opt.auto=true;
		
		/**
		 * 是否开启底图可点功能
		 */
		opt.click=true;
		
		opt.size={};
		
		/**
		 * 地图宽度
		 */
		opt.size.w=800;
		
		/**
		 * 地图高度
		 */
		opt.size.h=600;
		
		opt.zoom={};
		
		/**
		 * 地图允许展示的最小级别
		 */
		opt.zoom.min=3;
		
		/**
		 * 地图允许展示的最大级别
		 */
		opt.zoom.max=18;
		
		
		/**
		 * 启用双指操作缩放
		 */
		opt.pinch=true;
		
		/**
		 * 启用地图拖拽
		 */
		opt.drag=true;
		
		/**
		 * 启用滚轮放大缩小
		 */
		opt.wheel=true;
		
		/**
		 * 启用双击放大
		 */
		opt.double=true;
		
		/**
		 * 启用键盘操作
		 */
		opt.keyboard=true;
		
		/**
		 * 启用地图惯性拖拽
		 */
		opt.inertial=true;
		
		/**
		 * 启用连续缩放效果
		 */
		opt.continuous=true;
		
		/**
		 * 启用自动适应容器尺寸变化
		 */
		opt.resize=true;
		
		/**
		 * 地图的平移缩放控件，可以对地图进行上下左右四个方向的平移和缩放操作。
		 */
		opt.navigation_control={};
		opt.navigation_control.offset={x:0,y:0};
		opt.navigation_control.type=BDMap.state.LARGE;
		opt.navigation_control.pos=BDMap.state.TOP_LEFT;
		
		/**
		 * 比例尺控件。
		 */
		opt.scale_control={};
		opt.scale_control.offset={x:0,y:0};
		opt.scale_control.pos=BDMap.state.BOTTOM_LEFT;
		opt.scale_control.unit=BDMap.state.METRIC;
		
		/**
		 * 缩略地图控件
		 */
		opt.minmap_control={};
		opt.minmap_control.offset={x:0,y:0};
		opt.minmap_control.pos=BDMap.state.BOTTOM_RIGHT;
		
		/**
		 * 缩略地图添加到地图后的开合状态
		 */
		opt.minmap_control.open=true;
		
		/**
		 * 负责进行地图定位的控件，使用html5浏览器定位功能
		 */
	//	opt.geolocation_control={};
		/**
		 * 添加控件时是否进行定位
		 */
	//	opt.geolocation_control.auto=true;
		
		/**
		 * 是否显示定位信息面板
		 */
	//	opt.geolocation_control.display=true;
	//	
	//	opt.geolocation_control.offset={x:0,y:0};
	//	opt.geolocation_control.pos=BDMap.state.TOP_RIGHT;
		
		/**
		 * 自定义定位中心点的Icon链接
		 */
	//	opt.geolocation_control.icon="";
		/**
		 * 自定义定位中心点的Icon大小尺寸
		 */
	//	opt.geolocation_control.size={w:0,h:0};
	
		return opt;
	}

}

BDMap.state={
		/**
		 * UI位置
		 */
		TOP_LEFT:0,
		TOP_RIGHT:1,
		BOTTOM_LEFT:2,
		BOTTOM_RIGHT:3,
		
		/**
		 * 地图单位
		 */
		METRIC:"metric",//公制
		IMPERIAL:"us",//英制
		
		/**
		 * 表示平移缩放控件的类型
		 */
		LARGE:0,//标准的平移缩放控件（包括平移、缩放按钮和滑块）。
		SMALL:1,//仅包含平移和缩放按钮。
		PAN:2,//仅包含平移按钮。
		ZOOM:3//仅包含缩放按钮。
	}
