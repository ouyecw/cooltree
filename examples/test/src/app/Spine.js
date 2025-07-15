import {CollisionUtil,DisplayBase,MathUtil,Event,Global} from 'cooltree'

export default class Spine extends DisplayBase
{
    constructor()
    {
        super();
        
		//当前动画索引
        this.index=-1;

		//当前动画名称
        this.current=null;
  
		//全部动画名称
        this.actions=[];

		//当前播放进度（秒）
		this.currentTime=0;

		//三角形渲染模式/图片渲染模式
		this.triangleRendering=true;

		//是否开启debug模式
		this.debugRendering=false;

		//动画状态数据，用于动画播放
		this.state=null;

		//动画骨骼数据
		this.skeleton=null;

		//Setup an animation state with a default mix of 0.2 seconds.
		this.defaultMix=0.2;

        this.lastFrameTime=0;
        this.rect=this.skelBounds=null;

        this.vertices=spine.Utils.newFloatArray(8 * 1024);
        this.tempColor = new spine.Color();

        this._percent=0;
        this._paused=true;
        this._once=true;

        // for(let i in spine) console.log(">>",i);
    }

	//当前动画的长度（秒）
    get duration()
    {
		if(!this.state) return 0;
		
		let time=0;
		try{
			time=this.state.getCurrent(0).animation.duration;
		}
		catch(err){
			console.log("[ERROR]",err);
		}
		
        return time;
    }

	//当前动画骨骼所有皮肤
	get skins()
	{
		return this.skeleton ? this.skeleton.data.skins : null;
	}

		/**
	 * 动画区域
	 */
	get bounds()
	{
		if(this.skelBounds && this.skeleton) this.skelBounds.update(this.skeleton);
		return this.skelBounds;
	}

	get percent()
	{
		return this._percent;
	}

	/**
	 * 播放百分比(0~1)
	 */
	set percent(value)
	{
		value=MathUtil.clamp(value,0,1);
		if(this._percent==value || !this.state || !this.skeleton) return;
		this._percent=value;

		const time = this.duration * this._percent;
		this.state.update(time-this.currentTime);
		this.state.apply(this.skeleton);
		this.skeleton.updateWorldTransform(spine.Physics.update);
		this.currentTime=time;
	}

	get pause()
	{
		return this._paused;
	}

	//是否暂停播放
	set pause(bool)
	{
		if(bool==this._paused) return;
		this._paused=bool;

		if(bool) return;
		this.lastFrameTime = Date.now() / 1000;
	}

	/**
	 * 重置
	 * @param {Number} type 0骨骼和槽位重置，1骨骼重置，2槽位重置
	 */
	setupPose(type=0)
	{
		if(this.skeleton) this.skeleton[type==0 ? "setToSetupPose" :(type>1 ? "setSlotsToSetupPose" : "setBonesToSetupPose")]();
	}

	/**
	 * 设置新皮肤
	 * @param {spine.Skin} skin 新皮肤
	 * @param {Number} type 0骨骼和槽位重置，1骨骼重置，2槽位重置
	 * @returns 
	 */
	setSkin(skin,type=0)
	{
		if(!skin || (!(skin instanceof spine.Skin) && typeof skin!="string")) return;

		if(typeof skin=="string") this.skeleton.setSkinByName(skin);
		else this.skeleton.setSkin(skin);

		this.setupPose(type);
		this.skeleton.updateWorldTransform(spine.Physics.update);

		let offset = new spine.Vector2(), size = new spine.Vector2();
		this.skeleton.getBounds(offset, size);
		
		this.origin.x=this.rect.x=offset.x;
		this.origin.y=this.rect.y=offset.y;

		if(size.x) this.width=this.rect.width=size.x;
		if(size.y) this.height=this.rect.height=size.y;
	}

	/**
	 * 设置动画数据
	 * @param {ArrayBuffer} data skel/json文件
	 * @param {String} atlas 
	 * @param {Image} pngs 
	 * @param {Boolean} isSkel data是否是skel文件
	 * @returns 
	 */
    setInstance(data,atlas,pngs,isSkel=false)
    {
        if(!data || !atlas) return;

        if(isSkel && !(data instanceof ArrayBuffer)){
            const typedArray = new Uint8Array(data);
            data = typedArray.slice().buffer;
        }

        atlas=new spine.TextureAtlas(atlas);

        let page,i,texture;
        for (i=0;i<atlas.pages.length;i++){
            if(i>=pngs.length){
                console.log("[Spine] pngs is lose.");
                continue;
            }

            page=atlas.pages[i];
            texture=new CanvasTexture(pngs[i]);
            page.setTexture(texture);
        }
        
        const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
		const skeletonBinary = (data instanceof ArrayBuffer ? new spine.SkeletonBinary(atlasLoader) : new spine.SkeletonJson(atlasLoader));
		const skeletonData = skeletonBinary.readSkeletonData(data);

		this.skelBounds = new spine.SkeletonBounds();
        this.skeleton = new spine.Skeleton(skeletonData);
		
        const animationStateData = new spine.AnimationStateData(this.skeleton.data);
		animationStateData.defaultMix = this.defaultMix;
		this.state = new spine.AnimationState(animationStateData);

		this.setupPose();
		this.skeleton.updateWorldTransform(spine.Physics.update);
		this.rect = this.skeleton.getBoundsRect();

		this.skeleton.scaleY=-1;
		this.skeleton.y=this.rect.y+this.rect.height;

        this.origin.x=this.rect.x;
        this.origin.y=this.rect.y;
        this.setSize(this.rect.width || this.width,this.rect.height || this.height);

        for(let animation of skeletonData.animations)
            this.actions.push(animation.name);

        this.current=this.actions[0];
        this.state.addListener({
			end:Global.delegate(this.handler,this,Spine.OVER),
			start:Global.delegate(this.handler,this,Spine.START),
            complete:Global.delegate(this.handler,this,Spine.COMPLETE),
			interrupt:Global.delegate(this.handler,this,Spine.INTERERRUPT)
        });
    }

    handler(e,type)
    {
		if(type==Spine.START && e && e.animation && this.current!=e.animation.name) {
			const bounds=this.bounds;
			if(bounds){
				this.origin.x=bounds.minX;
				this.origin.y=bounds.minY;
				this.setSize(bounds.getWidth() || this.width,bounds.getHeight() || this.height);
			}

			this.current=e.animation.name;
			this.index=this.actions.indexOf(this.current);
		}

        this.emit(new Event(type,e && e.animation ? e.animation.name : ""));
    }

	/**
	 * 停止播放
	 */
    stop()
    {
        this.pause=true;
    }

	/**
	 * 清除所有动画
	 */
	clear()
	{
		if(this.state) this.state.clearTrack();
	}

	/**
	 * 播放动画
	 * @param {String | Number} num 动画片段名称或位置索引
	 * @param {Boolean} loop        是否循环播放
	 * @param {Number} start_frame  播放开始时间（秒）
	 * @returns 
	 */
    play(num=0,loop=true,start_frame=0)
    {
        if(!this.skeleton || !this.state) return;
        if(isNaN(Number(num))) num=this.actions.indexOf(num);

        this.pause=false;
        if(num<0 || num>=this.actions.length || this.index==num) return;

		this.index=num;
		this.current=this.actions[num];
        this.skeleton.setToSetupPose();
        this.state.setAnimation(start_frame, this.current, loop);
    }

	/**
	 * 系列动作播放
	 * @param {Array} list 播放列表,示例如下：
	 * [{name:"run",loop:false,start:0},{name:3,loop:true,start:0},{time:0.5,delay:0.1}]
	 */
	playList(list)
	{
		if(!list || list.length<1 || !this.skeleton || !this.state) return;
		let data,i,l=list.length,func,bool;

		//把骨骼和槽位重置
		this.skeleton.setToSetupPose();
		this.pause=false;

		for(i=0;i<l;i++){
			data=list[i];
			if(!data) continue;

			bool=(data.name ===undefined || data.name ===null || data.name ==="");
			func=(i==0) ? (bool ? "setEmptyAnimation" :"setAnimation") : (bool ? "addEmptyAnimation" :"addAnimation");
			
			if(bool) {
				if(!data.time) continue;
				if(i>0 && data.delay>0) this.state[func](0,data.time,data.delay);
				else this.state[func](0,data.time);
			}
			else 
				this.state[func](data.start || 0,isNaN(Number(data.name)) ? data.name : this.actions[Number(data.name)],data.loop || false);
		}
	}

	/**
	 * 碰撞点测试 (注意是全局坐标)
	 * @param {Number} x
	 * @param {Number} y
	 */
	hitTestPoint (x,y) 
	{
		return CollisionUtil.hitTestPoint(this,x,y, this.usePolyCollision)>0 ;
	}

	/**
	 * 碰撞测试
	 * @param {displayObject} obj
	 */
	hitTestObject (obj) 
	{
		if(obj==null || !(obj instanceof DisplayBase) ) return false;
		if(obj==this) return true;
		
		return CollisionUtil.hitTestObject(this,obj,this.usePolyCollision);
	}

	//渲染
    render(target=null,initial=false,upper=null)
    {   
        if (!this.visible || this.alpha <= 0 || (!target && !this.stage))  return;
        if (target==undefined) this.stage.context.save();
		if(!initial) this._transform(upper,target);

        if(this.skeleton && this.state){
            if(!this._paused || this._once){
                const now = Date.now() / 1000;
                const delta = now - this.lastFrameTime;
                this.lastFrameTime = now;

                const animation_duration=this.duration;
                this.currentTime += delta;

                while (animation_duration>0 && this.currentTime >= animation_duration)
                    this.currentTime -= animation_duration;

                this.percent=this.currentTime / animation_duration;
                this.emit(new Event(Spine.CHANGE,this.percent,this.currentTime));

                this.state.update(delta);
                this.state.apply(this.skeleton);
                this.skeleton.updateWorldTransform(spine.Physics.update);

                if(!this._paused) this.__checkDisplayUpdate();
                if(this._once) this._once=false;
            }
            
            const ctx=(target!=undefined ? target.context : this.stage.context);
            if (this.triangleRendering) this.drawTriangles(this.skeleton,ctx);
            else this.drawImages(this.skeleton,ctx);
        }

        if (target==undefined) this.stage.context.restore();
    }

    drawImages (skeleton,ctx) 
    {
		let color = this.tempColor;
		let skeletonColor = skeleton.color;
		let drawOrder = skeleton.drawOrder;

		if (this.debugRendering) ctx.strokeStyle = "green";

		for (let i = 0, n = drawOrder.length; i < n; i++) {
			let slot = drawOrder[i];
			let bone = slot.bone;
			if (!bone.active) continue;

			let attachment = slot.getAttachment();
			if (!(attachment instanceof spine.RegionAttachment)) continue;
			attachment.computeWorldVertices(slot, worldVertices, 0, 2);
			let region = attachment.region;

			let image = (region.texture).getImage();

			let slotColor = slot.color;
			let regionColor = attachment.color;
			color.set(skeletonColor.r * slotColor.r * regionColor.r,
				skeletonColor.g * slotColor.g * regionColor.g,
				skeletonColor.b * slotColor.b * regionColor.b,
				skeletonColor.a * slotColor.a * regionColor.a);

			ctx.save();
			ctx.transform(bone.a, bone.c, bone.b, bone.d, bone.worldX, bone.worldY);
			ctx.translate(attachment.offset[0], attachment.offset[1]);
			ctx.rotate(attachment.rotation * Math.PI / 180);

			let atlasScale = attachment.width / region.originalWidth;
			ctx.scale(atlasScale * attachment.scaleX, atlasScale * attachment.scaleY);

			let w = region.width, h = region.height;
			ctx.translate(w / 2, h / 2);
			if (attachment.region && attachment.region.degrees == 90) {
				let t = w;
				w = h;
				h = t;
				ctx.rotate(-Math.PI / 2);
			}
			ctx.scale(1, -1);
			ctx.translate(-w / 2, -h / 2);

			ctx.globalAlpha = color.a;
			ctx.drawImage(image, image.width * region.u, image.height * region.v, w, h, 0, 0, w, h);
			if (this.debugRendering) ctx.strokeRect(0, 0, w, h);
			ctx.restore();
		}
	}

    drawTriangles (skeleton,ctx) 
    {
		let color = this.tempColor;
		let skeletonColor = skeleton.color;
		let drawOrder = skeleton.drawOrder;

		let blendMode= null;
		let vertices= this.vertices;
		let triangles= null;

		for (let i = 0, n = drawOrder.length; i < n; i++) {
			let slot = drawOrder[i];
			let attachment = slot.getAttachment();

			let texture;
			let region;
			if (attachment instanceof spine.RegionAttachment) {
				let regionAttachment = attachment;
				vertices = this.computeRegionVertices(slot, regionAttachment, false);
				triangles = Spine.QUAD_TRIANGLES;
				texture = regionAttachment.region ? (regionAttachment.region.texture).getImage() : null;
			} else if (attachment instanceof spine.MeshAttachment) {
				let mesh = attachment;
				vertices = this.computeMeshVertices(slot, mesh, false);
				triangles = mesh.triangles;
				texture = mesh.region ? (mesh.region.texture).getImage() : null;
			} else
				continue;

			if (texture) {
				if (slot.data.blendMode != blendMode) blendMode = slot.data.blendMode;

				let slotColor = slot.color;
				let attachmentColor = attachment.color;
				color.set(skeletonColor.r * slotColor.r * attachmentColor.r,
					skeletonColor.g * slotColor.g * attachmentColor.g,
					skeletonColor.b * slotColor.b * attachmentColor.b,
					skeletonColor.a * slotColor.a * attachmentColor.a);

				ctx.globalAlpha = color.a;

				for (var j = 0; j < triangles.length; j += 3) {
					let t1 = triangles[j] * 8, t2 = triangles[j + 1] * 8, t3 = triangles[j + 2] * 8;

					let x0 = vertices[t1], y0 = vertices[t1 + 1], u0 = vertices[t1 + 6], v0 = vertices[t1 + 7];
					let x1 = vertices[t2], y1 = vertices[t2 + 1], u1 = vertices[t2 + 6], v1 = vertices[t2 + 7];
					let x2 = vertices[t3], y2 = vertices[t3 + 1], u2 = vertices[t3 + 6], v2 = vertices[t3 + 7];

					this.drawTriangle(ctx,texture, x0, y0, u0, v0, x1, y1, u1, v1, x2, y2, u2, v2);

					if (this.debugRendering) {
						ctx.strokeStyle = "green";
						ctx.beginPath();
						ctx.moveTo(x0, y0);
						ctx.lineTo(x1, y1);
						ctx.lineTo(x2, y2);
						ctx.lineTo(x0, y0);
						ctx.stroke();
					}
				}
			}
		}

		ctx.globalAlpha = 1;
	}

	drawTriangle (ctx,img, x0, y0, u0, v0,
		x1, y1, u1, v1,
		x2, y2, u2, v2) 
    {

		const width = img.width - 1;
		const height = img.height - 1;
		u0 *= width;
		v0 *= height;
		u1 *= width;
		v1 *= height;
		u2 *= width;
		v2 *= height;

		ctx.beginPath();
		ctx.moveTo(x0, y0);
		ctx.lineTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.closePath();

		x1 -= x0;
		y1 -= y0;
		x2 -= x0;
		y2 -= y0;

		u1 -= u0;
		v1 -= v0;
		u2 -= u0;
		v2 -= v0;

		let det = u1 * v2 - u2 * v1;
		if (det == 0) return;
		det = 1 / det;

		// linear transformation
		const a = (v2 * x1 - v1 * x2) * det;
		const b = (v2 * y1 - v1 * y2) * det;
		const c = (u1 * x2 - u2 * x1) * det;
		const d = (u1 * y2 - u2 * y1) * det;

		// translation
		const e = x0 - a * u0 - c * v0;
		const f = y0 - b * u0 - d * v0;

		ctx.save();
		ctx.transform(a, b, c, d, e, f);
		ctx.clip();
		ctx.drawImage(img, 0, 0);
		ctx.restore();
	}

	computeRegionVertices (slot, region, pma) 
    {
		let skeletonColor = slot.bone.skeleton.color;
		let slotColor = slot.color;
		let regionColor = region.color;
		let alpha = skeletonColor.a * slotColor.a * regionColor.a;
		let multiplier = pma ? alpha : 1;
		let color = this.tempColor;
		color.set(skeletonColor.r * slotColor.r * regionColor.r * multiplier,
			skeletonColor.g * slotColor.g * regionColor.g * multiplier,
			skeletonColor.b * slotColor.b * regionColor.b * multiplier,
			alpha);

		region.computeWorldVertices(slot, this.vertices, 0, Spine.VERTEX_SIZE);

		let vertices = this.vertices;
		let uvs = region.uvs;

		vertices[spine.RegionAttachment.C1R] = color.r;
		vertices[spine.RegionAttachment.C1G] = color.g;
		vertices[spine.RegionAttachment.C1B] = color.b;
		vertices[spine.RegionAttachment.C1A] = color.a;
		vertices[spine.RegionAttachment.U1] = uvs[0];
		vertices[spine.RegionAttachment.V1] = uvs[1];

		vertices[spine.RegionAttachment.C2R] = color.r;
		vertices[spine.RegionAttachment.C2G] = color.g;
		vertices[spine.RegionAttachment.C2B] = color.b;
		vertices[spine.RegionAttachment.C2A] = color.a;
		vertices[spine.RegionAttachment.U2] = uvs[2];
		vertices[spine.RegionAttachment.V2] = uvs[3];

		vertices[spine.RegionAttachment.C3R] = color.r;
		vertices[spine.RegionAttachment.C3G] = color.g;
		vertices[spine.RegionAttachment.C3B] = color.b;
		vertices[spine.RegionAttachment.C3A] = color.a;
		vertices[spine.RegionAttachment.U3] = uvs[4];
		vertices[spine.RegionAttachment.V3] = uvs[5];

		vertices[spine.RegionAttachment.C4R] = color.r;
		vertices[spine.RegionAttachment.C4G] = color.g;
		vertices[spine.RegionAttachment.C4B] = color.b;
		vertices[spine.RegionAttachment.C4A] = color.a;
		vertices[spine.RegionAttachment.U4] = uvs[6];
		vertices[spine.RegionAttachment.V4] = uvs[7];

		return vertices;
	}

	computeMeshVertices (slot, mesh, pma) 
    {
		let skeletonColor = slot.bone.skeleton.color;
		let slotColor = slot.color;
		let regionColor = mesh.color;
		let alpha = skeletonColor.a * slotColor.a * regionColor.a;
		let multiplier = pma ? alpha : 1;
		let color = this.tempColor;
		color.set(skeletonColor.r * slotColor.r * regionColor.r * multiplier,
			skeletonColor.g * slotColor.g * regionColor.g * multiplier,
			skeletonColor.b * slotColor.b * regionColor.b * multiplier,
			alpha);

		let vertexCount = mesh.worldVerticesLength / 2;
		let vertices = this.vertices;
		if (vertices.length < mesh.worldVerticesLength) this.vertices = vertices = spine.Utils.newFloatArray(mesh.worldVerticesLength);
		mesh.computeWorldVertices(slot, 0, mesh.worldVerticesLength, vertices, 0, Spine.VERTEX_SIZE);

		let uvs = mesh.uvs;
		for (let i = 0, u = 0, v = 2; i < vertexCount; i++) {
			vertices[v++] = color.r;
			vertices[v++] = color.g;
			vertices[v++] = color.b;
			vertices[v++] = color.a;
			vertices[v++] = uvs[u++];
			vertices[v++] = uvs[u++];
			v += 2;
		}

		return vertices;
	}

    _transform (target,obj)
	{
		let _temp_context=(obj==undefined ? this.stage.context : obj.context);
		let mtx=this.getMatrix(target,true);
	    _temp_context.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
		_temp_context.globalAlpha*=this.alpha*this._parent_alpha;
	}

    dispose()
    {
        if(this.state){
            this.state.clearListeners();
            this.state.clearTracks();
			this.state.data=null;
        }

		if(this.skeleton){
			this.skeleton.bones=this.skeleton.data=this.skeleton.drawOrder=this.skeleton.ikConstraints=this.skeleton.slots=this.skeleton.transformConstraints=null;
		}

        this.vertices=this.rect=this.skeleton=this.state=null;
        super.dispose();
    }
}

/**
 * 事件
 */
//当前动画播放进度百分比改变时触发
Spine.CHANGE="playChange";

//动画开始时触发
Spine.START="playStart";

//当不再应用某个动画时触发
Spine.OVER="playOver";

//当动画完成循环时触发
Spine.COMPLETE="playComplete";

//当清除了某条动画轨道或设置了某个新动画时触发
Spine.INTERERRUPT="interrupt";

 /**
 * 参数
 */
Spine.QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0];
Spine.VERTEX_SIZE = 2 + 2 + 4;
Spine.className="Spine";

class CanvasTexture extends spine.Texture 
{
    constructor(image) {
        super(image);
    }
    setFilters(minFilter, magFilter) { }
    setWraps(uWrap, vWrap) { }
    dispose() { }
}