
function Command ()
{
	this.dispose();
}

Command.prototype.dispose=function()
{
	this.child=-1;
	this.series=this.active=this.target=this.old=this.data=this.type=null;
}

Command.ATTRIBUTE=5;
Command.EFFECT=6;
Command.CHANGE=4;
Command.CREATE=1;
Command.DELETE=8;
Command.DEPTH=7;
Command.SCALE=2;
Command.MOVE=3;

Command.create=function(active,target,old,data,type,child,series)
{
	var c = ObjectPool.create(Command);
	c.child=(child==null ? -1 : (isNaN(child) ? -1 : Number(child)));
	c.series=(series ? true :  false);
	c.active=active;
	c.target=target;
	c.data=data;
	c.type=type;
	c.old=old;
	return c;
}

Command.run=function(c)
{
	if(c==undefined) return;
	var t;
	
	switch(c.active){
		case Command.MOVE:
		try{
			t=Main.studio.container.container.getChildByName(c.target);
		}catch(err){ trace("[ERROR]Command.run()",c.active,err.message); }
		
		if(t && c.old) t.moveTo(c.old.x,c.old.y);
		break;
		
		case Command.SCALE:
		try{
			t=Main.studio.container.container.getChildByName(c.target);
		}catch(err){ trace("[ERROR]Command.run()",c.active,err.message); }
		
		if(t && c.old) {
			t.scale=Number(c.old.s);
			t.rotation=Number(c.old.r);
			t.moveTo(c.old.x,c.old.y);
		}
		
		break;
		
		case Command.CREATE:
		try{
			t=Main.studio.container.container.getChildByName(c.target);
		}catch(err){ trace("[ERROR]Command.run()",c.active,err.message); }
		
		if(t) t.removeFromParent(true);
		break;
		
		case Command.CHANGE:
		if(c.target=="bg"){
			try{
				Main.studio.container.setBG(c.old);
			}catch(err){ trace("[ERROR]Command.run()",c.active,err.message); }
		}
		break;
		
		case Command.ATTRIBUTE:
		try{
			t=Main.studio.container.container.getChildByName(c.target);
			if(t && c.child>=0) t=t.getChildAt(c.child);
		}catch(err){ trace("[ERROR]Command.run()",c.active,err.message); }
		
		if(t && c.type && c.old) t[c.type]=c.old;
		break;
		
		case Command.DELETE:
		try{
			if(c.target) Main.studio.container.container.addChildAt(c.target,c.old);
		}catch(err){ trace("[ERROR]Command.run()",c.active,err.message); }
		break;
		
		case Command.DEPTH:
		try{
			t=Main.studio.container.container.getChildByName(c.target);
		}catch(err){ trace("[ERROR]Command.run()",c.active,err.message); }
		
		if(t && c.old) Main.studio.container.container.setChildIndex(t,c.old);
		break;
	}
	
	var is_series=c.series;
	ObjectPool.remove(c);
	
	if(is_series) Command.run(Main.studio.commands.getPrec());
	Stage.current.__checkDisplayUpdate();
}

