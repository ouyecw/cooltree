import DisplayObjectContainer from '../display/DisplayObjectContainer.js'

export default class ContentItem extends DisplayObjectContainer
{
	constructor()
	{
		super();
	}

	reset()
	{
		this.data=null;
		super.reset();
	}

	setup(data)
	{
		if(!data) return;
		this.data=data;
	}
}

ContentItem.className="ContentItem";