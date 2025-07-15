import {AssetManager,Factory,ContentItem} from 'cooltree'

export default class EItem extends ContentItem
{
	setup(data)
	{
		super.setup(data)
		if(!this.instance && data.img){
			this.instance=Factory.c("do");
			const img=AssetManager.getSource(data.img);
			this.instance.setInstance(img);
			this.addChild(this.instance);
		}
	}
	
	reset()
	{
		this.instance.removeFromParent(true);
		this.instance=null;
		super.reset();
	}
};