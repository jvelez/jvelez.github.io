//MAIN GLOBAL VARIABLES
var EXIT = false;
var GameState = 0;
var Level = 1;
var Combo = 0;

//GAME LOOP GLOBAL VARIABLES
var lastFrameTimeMs = 0;
var fps = 60;
var FPS = fps;
var maxFPS = fps;
var delta = 0;
var timestep = 1000 / fps;
var framesThisSecond = 0;
var lastFpsUpdate = 0;

//GRAPHICS GLOBAL VARIABLES
var PI2 = 2*Math.PI;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var SW = canvas.width;
var SH = canvas.height;

//INPUT GLOBAL VARIABLES
var MOBILE = false;
var TXY = [{x:0,y:0},{x:0,y:0}];
var TOUCHING = [ false, false ];
var KEYS = Array(222);
var KName = 
{
	'Enter':13,
	'Esc':21,
	'Space':32,
	'Left':37,
	'Up':38,
	'Right':39,
	'Down':40,
	'B':66,
	'F1':112,
	'F2':113
}

//CHECK FOR MOBILE BROWSER
var mobilecheck = function() 
{
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
MOBILE = mobilecheck();




//SET ALL THE KEYS TO FALSE//
function ResetKeys() { for(var i=0; i<KEYS.length; i++) { KEYS[i]=false; } }

//LISTEN FOR INPUT EVENTS
document.addEventListener("keydown", KeyPressed, false);
document.addEventListener("keyup", KeyReleased, false);
if(MOBILE==true)
{
canvas.addEventListener("touchstart", TouchStartMove);
canvas.addEventListener("touchmove", TouchStartMove);
canvas.addEventListener("touchend", TouchEnded);
//canvas.addEventListener("touchcancel", handleCancel);
}

//HANDLE PRESSED KEYS
function KeyPressed(e) { KEYS[e.keyCode] = true; }

//HANDLE RELEASED KEYS
function KeyReleased(e) { KEYS[e.keyCode] = false; }

//HANDLE TOUCH INPUT
function TouchStartMove(e) 
{
    if(e.touches) 
	{
        TXY[0].x = e.touches[0].pageX - canvas.offsetLeft;
        TYY[0].y = e.touches[0].pageY - canvas.offsetTop;
		TOUCHING[0] = true;
		
		if(e.touches.length>1)
		{
			TXY[1].x = e.touches[1].pageX - canvas.offsetLeft;
			TXY[1].y = e.touches[1].pageY - canvas.offsetTop;
			TOUCHING[1] = true;
		}
        e.preventDefault();
    }
}

function TouchEnded(e) 
{
    if(e.touches) 
	{
        TXY[0].x = e.touches[0].pageX - canvas.offsetLeft;
        TYY[0].y = e.touches[0].pageY - canvas.offsetTop;
		TOUCHING[0] = false;
		
		if(e.touches.length>1)
		{
			TXY[1].x = e.touches[1].pageX - canvas.offsetLeft;
			TXY[1].y = e.touches[1].pageY - canvas.offsetTop;
			TOUCHING[1] = false;
		}
        e.preventDefault();
    }
}


//DRAW A RECTANGLE GIVEN POS X Y , WIDTH AND HEIGHT, COLOR AND FILL FLAG
function Draw_Rect(x,y,w,h,color,fill = true)
{
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	if(fill){ ctx.fill(); }
	else { ctx.stroke(); }
	ctx.closePath();
}

//DRAW A CIRCLE GIVEN POS X Y, RADIUS COLOR AND FILL FLAG
function Draw_Circle(x,y,r,color,fill = true)
{
	if(r<0){r=0;}
	ctx.beginPath();
	ctx.arc(x, y, r, 0, PI2, false);
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	if(fill) { ctx.fill(); }
	else { ctx.stroke(); }
	ctx.closePath();
}

//DRAW A ROTATED SPRITE GIVEN POS X Y ORIGIN X Y AND ANGLE
function Draw_Rotated_Sprite(img,px,py,ox,oy,a)
{
	var angle = a * Math.PI / 180;
	ctx.translate(ox, oy);
	ctx.rotate(angle);
	ctx.translate(-ox, -oy);
	ctx.drawImage(img,px,py);
	ctx.translate(ox, oy);
	ctx.rotate(-angle);
	ctx.translate(-ox, -oy); 
}

//DRAW TEXT GIVEN FONT COLOR POR X Y TEXT AND FILL FLAG
function Draw_Text(font,color,x,y,text,fill=true)
{
	ctx.font = font;//"48px serif";
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	if(fill) { ctx.fillText(text,x,y); }
	else { ctx.strokeText(text,x,y); }
}

//GET THE VALUE BETWEEN TWO NUMBERS GIVEN P IS THE DISTANCE WHERE 0.5 IS HALFWAY
function Interpolate(a,b,p = 0.5,clamp=0)
{
	var result =  a*p + b*(1-p);
	if(clamp==-1){ return Math.floor(result); }
	else if(clamp==0){ return result; }
	else if(clamp==1){ return Math.ceil(result); }
}

//CAP A GIVEN VALUE N BETWEEN TO VALUES MIN AND MAX
function Cap(n,min,max)
{
	if(n<min) return min;
	else if(n>max) return max;
	else return n;
}

//RANDOM INT//
function RandomInt(min,max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//CONVENIENT COLOR CLASS
class Color 
{
	constructor(r,g,b,a = 1)
	{
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}
	
	getString()
	{
		return "rgba("+this.r+","+this.g+","+this.b+","+this.a+")";
	}
	
	copy()
	{
		return new Color(this.r,this.g,this.b,this.a);
	}
	
	static Gradient(color1,color2,ns,cs)
	{
		var p = (cs/ns);
		return new Color
		(
			Interpolate(color1.r,color2.r,p,-1),
			Interpolate(color1.g,color2.g,p,-1),
			Interpolate(color1.b,color2.b,p,-1),
			Interpolate(color1.a,color2.a,p)
		);
	}
	
	static rgb(r,g,b)
	{
		return new Color(r,g,b);
	}
	
	static rgba(r,g,b,a=1)
	{
		return new Color(r,g,b,a);
	}
}

//CONVENIENT RECTANGLE CLASS
class Rectangle
{
	constructor(x,y,w,h)
	{
		this.posX = x;
		this.posY = y;
		this.width = w;
		this.height = h;
		this.top = y;
		this.bottom = y+h;
		this.left = x;
		this.right = x+w;
		this.centerX = x+w/2;
		this.centerY = y+h/2;
		this.wy = w*y;
		this.hx = h*x;
	}
	
	static Collision(A,B)
	{
		return !((A.bottom<B.top)||(B.bottom<A.top) || (A.right<B.left) || (B.right<A.left));
	}
	
	static MinowskiSum(A,B)
	{
		var w = (A.width + B.width)*0.5;
		var h = (A.height + B.height)*0.5;
		var dx = A.centerX - B.centerX;
		var dy = A.centerY - B.centerY;
		
		return new Rectangle(dx,dy,w,h);
	}
}

//GUN RELATED GLOBAL VARIABLES
var MAX_FIRE_POWER  = 6;
var MAX_FIRE_RATE  = 17;
var MAX_BARRELS = 5;
var MAX_MAX_BULLETS = 100;
var MAX_TOTAL_BULLETS = 9999;
var MIN_RELOAD_TIME = 1;

//CONVINIENT GUN CLASS DECLARATION//
class Gun
{
	constructor()
	{
		this.FirePower = 2;
		this.FireRate = 5;
		this.ReloadTime = 75;  //in frames
		this.MaxBullets = 10;
		this.TotalBullets = 100;
		this.Bullets = 10;
		this.Automatic = false; 
		this.DelayTimer = 0;  
		this.Fire = false; 
		this.NoReload = true;
		this.Barrels = 1;
	}

	Shoot() 
	{ 
		if(!this.FireRate)
		{
			return false;
		}
		if(this.NoReload)
		{
			if(this.DelayTimer<=0 && (this.Automatic? true : !this.Fire))
			{
				this.DelayTimer = Math.floor(FPS/this.FireRate);
				this.Fire = true;
				return true;
			}
		}
		else
		{
			if(this.DelayTimer<=0 && this.Bullets>0 && (this.Automatic? true : !this.Fire))
			{
				this.Bullets--;
				this.DelayTimer = FPS/this.FireRate;
				this.Fire = true;
				return true;
			}
		}
		return false;  
	}
        
    CeaseFire() { this.Fire = false; }
        
    IsReady() { return this.DelayTimer == 0; }
        
    Update() { this.DelayTimer--; }
        
	Reload() 
	{ 
		this.Bullets = ((this.TotalBullets<this.MaxBullets)? this.TotalBullets : this.MaxBullets);
		this.TotalBullets -= this.MaxBullets;
		if(this.TotalBullets<0){ this.TotalBullets = 0; }
	}
        
    AddBullets(bn) { this.TotalBullets += bn; }
    UpgradeFireRate() { this.FireRate++; }
    UpgradeFirePower() { this.FirePower++; }
    UpgradeReloadTime() { this.ReloadTime--; if(this.ReloadTime<MIN_RELOAD_TIME){ this.ReloadTime = MIN_RELOAD_TIME;} }
    UpgradeMaxBullets() { this.MaxBullets++; }
    UpgradeAutomatic() { this.Automatic = true; }
	UpgradeBarrels() { this.Barrels++; }
	
	MaxUpgrades()
	{
		this.FireRate = MAX_FIRE_RATE;
		this.FirePower = MAX_FIRE_POWER;
		this.ReloadTime = MIN_RELOAD_TIME;
		this.MaxBullets = MAX_MAX_BULLETS; 
	}
		
	Reset(fp = 2)
	{ 
		this.Automatic = true;
		this.FireRate = 5; 
		this.FirePower = fp;
		this.Barrels = 1;
	}

	Downgrade()
	{
		this.FireRate--;
		this.FirePower--;
		this.Barrels--;
	}

	Regulate()
	{
		this.FireRate = Cap(this.FireRate,5,MAX_FIRE_RATE);
		this.FirePower = Cap(this.FirePower,2,MAX_FIRE_POWER);
		this.Barrels = Cap(this.Barrels,1,MAX_BARRELS);
	}
};

//IMAGE LOADING FUNCTION//
function LoadImage(filename)
{
	var i = new Image();
	i.src = filename;
	return i;
}

//VARIABLE TO STORE THE GAME RESOURCES//
function LoadAudio(filename,max)
{
	var audio_array = [];
	for(var i=0; i<max; i++) { audio_array.push(new Audio(filename)); }
	return audio_array;
}

//RESOURCES STRUCTURE TO MANAGE THE GAME ASSETS
var Resources = 
{
	Images: {},
	Sounds: {},
	
	Load: function(callback)
	{
		//LOAD IMAGES
		this.Images["BACKGROUND"] = LoadImage("assets/visuals/stars.jpg");
		this.Images["EXPLOSION"] = LoadImage("assets/visuals/explosion.png");
		this.Images["COIN"] = LoadImage("assets/visuals/coin.png");
		this.Images["POWERUPS"] = LoadImage("assets/visuals/powerups.png");
		this.Images["CHICKEN"] = LoadImage("assets/visuals/chicken.png");
		this.Images["AK47"] = LoadImage("assets/visuals/ak47.png");
		this.Images["HEALTH"] = LoadImage("assets/visuals/healthbar.png");
		this.Images["ROAST"] = LoadImage("assets/visuals/roast.png");
		this.Images["TIGER"] = LoadImage("assets/visuals/tiger.png");
		this.Images["CROC"] = LoadImage("assets/visuals/crocodile.png");
		this.Images["DOLPHIN"] = LoadImage("assets/visuals/dolphin.png");
		this.Images["GRIFFIN"] = LoadImage("assets/visuals/griffin.png");
		this.Images["BEAVER"] = LoadImage("assets/visuals/beaver.png");
		this.Images["TITLE"] = LoadImage("assets/visuals/titlescreen.png");
		this.Images["PRESS_START"] = LoadImage("assets/visuals/press_start.png");
		this.Images["PAUSE"] = LoadImage("assets/visuals/pause.png");
		this.Images["GAMEOVER"] = LoadImage("assets/visuals/gameover.png");

		//LOAD SOUNDS// audio_array[] // audio_file_index
		this.Sounds["PUNCH"] =     [LoadAudio("assets/audio/punch.wav",20),0];
		this.Sounds["LASERSHOT"] = [LoadAudio("assets/audio/lasershot.wav",30),0];
		this.Sounds["ROOSTER"] =   [LoadAudio("assets/audio/cantagallo.wav",1),0];
		this.Sounds["GUNSHOT"] =   [LoadAudio("assets/audio/gunshot.wav",2),0];
		this.Sounds["RECHARGE"] =  [LoadAudio("assets/audio/recharge.wav",10),0];
		this.Sounds["COIN"] =      [LoadAudio("assets/audio/star.wav",10),0];
		this.Sounds["SWORDS"] =    [LoadAudio("assets/audio/swords.wav",4),0];
		this.Sounds["TITLE_MUSIC"] = [LoadAudio("assets/audio/title_music.wav",1),0];
		this.Sounds["GAMEPLAY_MUSIC"] = [LoadAudio("assets/audio/gameplay_music.wav",1),0];
		
		//START THE GAME WHEN THE FINAL ASSET LOADS
		this.Sounds["GAMEPLAY_MUSIC"][0][0].onload = Start_Game();
	}
}

//LOAD THE GAME RESOURCES
//Resources.Load();

//PLAY A SOUND AT A GIVEN VOLUME DEFAULT IS 1//
function Play_Sound(sound,vol=1,lp=false)
{
	sound[0][sound[1]].volume = vol;
	sound[0][sound[1]].loop = lp;
	sound[0][sound[1]].play();
	sound[1]++;
	if(sound[1]>=sound[0].length){ sound[1]=0; }
}

//STOP A SOUND//
function Stop_Sound(sound)
{
	sound[0][sound[1]].pause();
	sound[0][sound[1]].currentTime = 0;
}

//SET THE VOLUME OF A SOUND//
function Set_Sound_Volume(sound,vol)
{
	sound[0][sound[1]].volume = vol;
}

//GAME STATES
var GAME_STATES = { "TITLE":0,"GAMEPLAY":1,"PAUSE":2,"GAMEOVER":3 };

//OBJECT TYPES
var TYPES = {"BULLET":0,"EXPLOSION":1,"COIN":2,"POWERUPS":3,"ENEMY":4 };

//OBJECT STATES
var STATES = {"NULL":-1,"GOOD":0,"BAD":1};

//GAME OBJECT CLASS DECLARATION//
class GameObject
{
	constructor() 
	{
		this.PositionX = 0;
		this.PositionY = 0;
		this.SpeedX = 0;
		this.SpeedY = 0;
		this.Width = 0;
		this.Height = 0;
		this.ID = -1;
		this.Type = -1;
		this.State = -1;
		this.Solid = false;
		this.Active = false;
	}

	SetPosition(x,y) { this.PositionX = x; this.PositionY = y; }
	SetSpeed(x,y) { this.SpeedX = x; this.SpeedY = y; }

	IntersectsWithRect(x,y,w,h)  
	{ 
		return !((this.PositionY + this.Height) < (y) || (y + h) < (this.PositionY) ||
				(this.PositionX + this.Width) < (x) || (x + w) < (this.PositionX));
	}

	IntersectsWith(go)
	{
		return this.IntersectsWithRect(go.PositionX, go.PositionY, go.Width, go.Height);
	}
	
	//Reset(){}
	//Load(){}
	//HandleCollision(){}
	//HandleInput(){}
	//Update(){}
	//Draw(){}
	//Destroy(){}
}

//BACKGROND CLASS DECLARATION//
class Background extends GameObject
{
	constructor(sx,sy)
	{
		super();
		this.SpeedX = sx;
		this.SpeedY = sy;
		this.Width = 640;
		this.Height = 480;
	}

	// Update the Animation
	Update()
	{
		this.PositionX += this.SpeedX;
		this.PositionY += this.SpeedY;

		var difX = this.Width - SW;
		var difY = this.Height - SH;

		if (this.SpeedX >= 0)//Going to the Right
		{
			if (this.PositionX > SW)
			{
				this.PositionX = -this.Width - difX;
			}
		}
		else //Going to the Left
		{
			if (this.PositionX + this.Width <= 0)
			{
				this.PositionX = SW + difX;
			}
		}
	}

	//Draw the background image
	Draw()
	{
		var px = 0;
		var py = 0;
		for(var i = -2; i<3; i++)
		{
			for(var j = -2; j<3; j++)
			{
				px = this.PositionX + i*this.Width;
				py = this.PositionY + j*this.Height
				ctx.drawImage(Resources.Images["BACKGROUND"],px,py);
			}
		}
	}

	//Destroy(){}
}

//BULLET CLASS DECLARATION//
class Bullet extends GameObject
{
	constructor(x=-10, y=-10, sx=0, sy=0, st=-1, p=1)
	{
		super();
		this.Type = TYPES["BULLET"];
		this.State = st;
		this.Solid = true;
		this.Active = true;
		this.Power = p;
		this.PositionX = x;
		this.PositionY = y;
		this.SpeedX = sx;
		this.SpeedY = sy;
		this.Width = p;
		this.Height = p;
	}
	
	Copy()
	{
		var b = new Bullet(this.PositionX,this.PositionY,this.SpeedX,this.SpeedY,this.State,this.Power);
		return b;
	}
	
	Update()
	{
		this.PositionX += this.SpeedX;
		this.PositionY += this.SpeedY;
		if(this.PositionX>SW || this.PositionX<0 || this.PositionY>SH || this.PositionY<0)
		{
			this.Active = false;
			this.Solid = false;
		}
	}

	HandleCollision()
	{
		this.Active = false;
		this.Solid = false;
	}

	Draw()
	{
		var x = (this.PositionX-this.Width);
		var y = (this.PositionY+this.Height);
			
		for(var i = this.Power*2; i>0; i--)
		{
			if(this.State ==  STATES["GOOD"])
			{
				Draw_Circle(x+i*3,y+RandomInt(1,i)-(i/2),i,Color.rgb(255,RandomInt(1,255),0).getString());
			}
			else //bad
			{
				Draw_Circle(x+((this.Power*2)-(i*3)),y+RandomInt(1,i)-Math.floor((i/2)),i,Color.rgb(0,255,RandomInt(1,255)).getString());
			}
		}
	}
};

//EXPLOSION CLASS DECLARATION//
class Explosion extends GameObject
{
	constructor(x, y, st)
	{
		super();
		
		this.SpeedX = 0;
		this.SpeedY = 0;

		this.Type = TYPES["EXPLOSION"];
		this.Active = true;
		this.Solid = false;
		this.State = st;

		this.Width = 96;
		this.Height = 96;
		this.Rows = 4;
		this.Columns = 5;
		
		this.FrameX = 0;
		this.FrameY = 0;
		this.FrameNumber = 0;
		this.PositionX = x;
		this.PositionY = y - this.Height/2;
		this.StartX = 0;
		this.StartY = 0;
	}
	
	Update()
	{
		this.FrameNumber++;
		if(this.FrameNumber>(this.Rows*this.Columns))
		{
			this.Active = false;
			return;
		}
		this.FrameY = Math.floor(this.FrameNumber/this.Columns);
		this.FrameX = this.FrameNumber - this.Columns*this.FrameY;
		this.StartX = this.FrameX * this.Width;
		this.StartY = this.FrameY * this.Height;
	}

	Draw()
	{
		ctx.drawImage(Resources.Images["EXPLOSION"],this.StartX,this.StartY,this.Width,this.Height,this.PositionX,this.PositionY,this.Width,this.Height);
	}
};

//COINS CLASS DECLARATION//
class Coin extends Explosion
{
	constructor(x, y)
	{
		super();
		this.Type = TYPES["COIN"];
		this.Active = true;
		this.Width = this.Height = 32;
		this.Rows = 1;
		this.Columns = 8;
		this.FrameX = 0;
		this.FrameY = 0;
		this.FrameNumber = 0;
		this.PositionX = x;
		this.PositionY = y - this.Height/2;
		this.SpeedX = -3;
		this.SpeedY = 0;
		this.StartX = 0;
		this.StartY = 0;
	}
	
	Update()
	{
		this.PositionX += this.SpeedX;

		if(this.PositionX+this.Width<0)
		{
			this.Active = false;
			this.Solid = false;
		}
		this.FrameNumber = (this.FrameNumber+1)%(this.Rows*this.Columns);
		this.FrameY = Math.floor(this.FrameNumber/this.Columns);
		this.FrameX = this.FrameNumber - this.Columns*this.FrameY;
		this.StartX = this.FrameX * this.Width;
		this.StartY = this.FrameY * this.Height;
	}
	
	HandleCollision()
	{
		this.Active = false;
		this.Solid = false;
	}
	
	Draw()
	{
		ctx.drawImage(Resources.Images["COIN"],this.StartX,this.StartY,this.Width,this.Height,this.PositionX,this.PositionY,this.Width,this.Height);
	}
};

//POWERUP CLASS DECLARATRION//
class PowerUp extends GameObject
{
	constructor(x=-1,y=-1,s=-1)
	{
		super();
		this.Type = TYPES["POWERUPS"];
		this.Solid = true;
		this.Active = true;
		this.SpeedX = -1;
		this.SpeedY = 0;
		this.Width = 32;
		this.Height = 32;
		this.PositionX = ((x==-1)? (SW+SW/2) : x);
		this.PositionY = ((y==-1)? RandomInt(1,SH-this.Height) : y);
		this.State = ((s==-1)? RandomInt(0,4) : s);
	}

	Update()
	{
		this.PositionX += this.SpeedX;
		if(this.PositionX+this.Width<0)
		{
			this.Active = false;
			this.Solid = false;
		}
	}

	HandleCollision()
	{
		this.Active = false;
		this.Solid = false;
	}

	Draw()
	{
		ctx.drawImage(Resources.Images["POWERUPS"],this.Width*this.State,0,this.Width,this.Height,this.PositionX,this.PositionY,this.Width,this.Height);
	}
};

//ENEMY CLASS DECLARATION//
class Enemy extends GameObject
{
	constructor() 
	{
		super();
		this.State = RandomInt(0,4);
		this.gun = new Gun();
		this.gun.Reset(1);
		this.gun.FireRate = RandomInt(1,Math.floor(Level/6)+4-this.State)
		this.gun.FirePower = RandomInt(2,4);
		this.ImgIndex = "TIGER";
		switch(this.State)
		{
			case 0: 
				this.ImgIndex = "TIGER"; 
				this.Width = 83; 
				this.Height = 31;
				break;
			case 1: 
				this.ImgIndex = "CROC"; 
				this.Width = 83; 
				this.Height = 31; 
				break;
			case 2: 
				this.ImgIndex = "DOLPHIN"; 
				this.Width = 64; 
				this.Height = 21;
				break;
			case 3: 
				this.ImgIndex = "GRIFFIN"; 
				this.Width = 43; 
				this.Height = 21;
				break;
			case 4: 
				this.ImgIndex = "BEAVER";
				this.Width = 83; 
				this.Height = 31;				
				break;
		};
		this.PositionX = SW*1.25;
		this.PositionY = RandomInt(1,(SH-this.Height));
		this.SpeedY = 0;
		this.SpeedX = -RandomInt(this.State+1,3+Math.ceil(Level/20));
		this.Solid = true;
		this.Active = true;
		this.Type = TYPES["ENEMY"];
		this.ID = STATES["BAD"];
	}

	Value() { return (this.State+1)*10; }
        
	Update()
	{
		//update enemy position
		this.PositionX += this.SpeedX;
		//clear combo if enemy escapes
		if(this.PositionX+this.Width<0)
		{
			this.Solid = false;
			this.Active = false;
			Combo = 0;
		}
		//update enemy gun
		this.gun.Update();
	}

	Shoot()
	{
		//if this is a tiger, a croc or a dolphin
		//and the gun shoots, return a bad bullet
		if(this.State<=2 && this.gun.Shoot())
		{
			var x = Math.ceil(this.PositionX + this.Width/4);
			var y = Math.floor(this.PositionY + this.Height/2);
			return (new Bullet(x,y,-10,0,STATES["BAD"],3));
		}
		//otherwise return a null bullet
		else { return  (new Bullet(0,0,0,0,STATES["NULL"],0)); }
	}

	HandleCollision(ObjID)
	{
		this.Solid = false;
		this.Active = false;
		if(ObjID==TYPES["BULLET"]){ Combo++; }
	}

	Draw() 
	{ 
		ctx.drawImage(Resources.Images[this.ImgIndex],this.PositionX,this.PositionY);
	}

};

//PLAYER CLASS DECLARATION//
class Player extends Enemy
{
	constructor() 
	{  
		super();
		this.SpeedX = 0;
		this.SpeedY = 0;
		this.ID = STATES["GOOD"];
		this.Type = TYPES["PLAYER"];
		this.State = STATES["NULL"];
		this.PositionX = SW/2;
		this.PositionY = SH/2;
		this.Width = 32;
		this.Height = 32;
		this.Solid = true;
		this.Active = true;
		this.gun = new Gun();
		this.gun.Reset();
		this.frame = 0;
		this.Shield = false;
		this.MaxHealth = this.Health = this.MaxPower = 100;
		this.Power = 0;
		this.Angle = 0;
		this.Score = 0;
		this.powerTimer = 0;
		this.frameDelay = 0;
	}

	HandleInput()
	{
		if(KEYS[KName["Up"]]) { this.SpeedY = -5; }
		else if(KEYS[KName["Down"]]) { this.SpeedY = 5;}
		
		if(KEYS[KName["Left"]]) { this.SpeedX = -5; }
		else if(KEYS[KName["Right"]]) { this.SpeedX = 5;}
		
		if(TOUCHING[0]) 
		{ 
			this.PositionX = TX0 - this.Width/2; 
			this.PositionY = TX0 - this.Width/2; 
		}
		
		//console.log("player input is handled");
		//if(KEYS[KName["LShift"]]) { this.SpeedX *=2; this.SpeedY *=2; }
	}
 
	Update()
	{
		if(this.Health<1)
		{
			this.PositionY += 3;
			this.Angle += 10;
			if(this.PositionY+this.Height>SH)
			{
				//GAME OVER!!!
				this.Solid = false;
				this.Active = false;
				Play_Sound(Resources.Sounds["ROOSTER"]);
			}
			return;
		}

		this.powerTimer--;

		if(this.powerTimer<1) { this.Power -= 0.3; }
		else { this.Power -= 2; }
		
		if(this.Power<1) { this.Power = 1; }

		if(this.Power>this.MaxPower)
		{
			//gun.Downgrade();
			//gun.Regulate();
			this.powerTimer = 50;
		}
		
		//update player position
		this.PositionX += this.SpeedX;
		this.PositionY += this.SpeedY;

		//keep player inside the map
		if(this.PositionX < 0) { this.PositionX = 0; }
		else if (this.PositionX + this.Width > SW) { this.PositionX = SW - this.Width; }
		if(this.PositionY < 0) { this.PositionY = 0; }
		else if(this.PositionY + this.Height > SH) { this.PositionY = SH - this.Height; }

		this.SpeedX = this.SpeedY = 0;

		//update the gun
		this.gun.Update();
		this.frameDelay++;
		if(this.frameDelay>1){ this.frame = (this.frame+1)%9; this.frameDelay = 0; }
	}

	Shoot()
	{
		if(this.powerTimer<1 && this.gun.Shoot())
		{
			this.Power += this.gun.Barrels*0.7;
			var x = this.PositionX + this.Width;
			var y = this.PositionY + this.Height/2 - this.gun.FirePower/2 -3;
			Play_Sound(Resources.Sounds["LASERSHOT"]); //al_play_sample(LaserShot,1,PositionX/float(SW)-0.5,2.7,ALLEGRO_PLAYMODE_ONCE,NULL);
			return (new Bullet(x,y,15,0,STATES["GOOD"],this.gun.FirePower));
		}
		return  (new Bullet(0,0,0,0,STATES["NULL"],0));
	}

	HandleCollision(Object)
	{
		switch(Object.Type)
		{
			case TYPES["POWERUPS"]: 
				Play_Sound(Resources.Sounds["RECHARGE"]); //al_play_sample(Recharge,1,PositionX/float(SW)-0.5,1.5,ALLEGRO_PLAYMODE_ONCE,0);
				switch(Object.State)
				{
					case 0: this.Shield++; if(this.Shield>3){ this.Shield = 3; } break; //SHIELD+
					case 1: this.gun.UpgradeFirePower(); break; //DAMAGE+
					case 2: this.gun.UpgradeFireRate(); break; //FIRE_RATE+
					case 3: this.Health+=15; if(this.Health>this.MaxHealth){this.Health=this.MaxHealth;} break; //HEALTH+
					case 4: this.gun.UpgradeBarrels(); break; //BARREL+
				}
				this.gun.Regulate();
				break;

			case TYPES["COIN"]: 
				Play_Sound(Resources.Sounds["COIN"]); //al_play_sample(Star,1,PositionX/float(SW)-0.5,1.5,ALLEGRO_PLAYMODE_ONCE,0);
				this.Score += 250;
				break;
			
			case TYPES["ENEMY"]: 
			case TYPES["BULLET"]:
				Play_Sound(Resources.Sounds["PUNCH"]);//al_play_sample(Punch,1,PositionX/float(SW)-0.5,1.5,ALLEGRO_PLAYMODE_ONCE,0);
				if(this.Shield)
				{
					this.Shield--; //Take away one shield
					if(this.Shield<0) { this.Shield = 0; } //shield is broken
				}
				else //player haves no shields, take health
				{
					//substract health and one level of power ups
					this.Health -=10;
					this.gun.Downgrade();
					this.gun.Regulate();

					if(this.Health<1) { this.Health = 0;}
				}
				break;
		}
	}

	Reset()
	{
		this.SpeedX = 0;
		this.SpeedY = 0;
		this.PositionX = SW/2;
		this.PositionY = SH/2;
		this.Solid = true;
		this.Active = true;
		this.gun.Reset();
		this.frame = 0;
		this.Shield = 0;
		this.MaxHealth = this.Health = 100;
		this.Angle = 0;
		this.Score = 0;
	}

	Draw()
	{
		var w = 26;
		var h = 27;

		//Draw dead chicken
		if(this.Health<1)
		{
			Draw_Rotated_Sprite(Resources.Images["ROAST"],this.PositionX,this.PositionY,this.PositionX+75/2,this.PositionY+75/2,this.Angle);
			return;
		}
		
		//Draw triple shield
		if(this.Shield>2)
		{
			Draw_Circle(this.PositionX+this.Width/2,this.PositionY+this.Height/2,35,Color.rgba(0,0,100+RandomInt(1,20),0.3).getString()); //al_draw_filled_circle(PositionX+Width/2,PositionY+Height/2,35,al_map_rgba(0,0,100+rand()%20,5));
			Draw_Circle(this.PositionX+this.Width/2,this.PositionY+this.Height/2,36,Color.rgba(60,120+RandomInt(1,80),255,0.3).getString(),false); //al_draw_circle(PositionX+Width/2,PositionY+Height/2,36,al_map_rgba(60,120+rand()%80,255,128),2);
		}

		//Draw double shield
		if(this.Shield>1)
		{
			Draw_Circle(this.PositionX+this.Width/2,this.PositionY+this.Height/2,30,Color.rgba(0,0,100+RandomInt(1,20),0.3).getString()); 
			Draw_Circle(this.PositionX+this.Width/2,this.PositionY+this.Height/2,31,Color.rgba(60,120+RandomInt(1,80),255,0.3).getString(),false);
		}

		//Draw the chicken
		ctx.drawImage(Resources.Images["CHICKEN"],(8-this.frame)*w,0,w,h,this.PositionX,this.PositionY,w*1.3,h*1.3);
		
		//Draw the weapon
		ctx.drawImage(Resources.Images["AK47"],this.PositionX+6+this.frame%2,this.PositionY+13+this.frame%4);

		//Draw first shield
		if(this.Shield>=1)
		{
			Draw_Circle(this.PositionX+this.Width/2,this.PositionY+this.Height/2,25,Color.rgba(0,0,100+RandomInt(1,20),0.3).getString()); 
			Draw_Circle(this.PositionX+this.Width/2,this.PositionY+this.Height/2,26,Color.rgba(60,120+RandomInt(1,80),255,0.3).getString(),false);
		}
	}

	Draw2()
	{
		ctx.drawImage(Resources.Images["HEALTH"],15,SH-30);
		ctx.drawImage(Resources.Images["HEALTH"],150,SH-30);

		var h = (this.Health/this.MaxHealth)*111;
		var p = (this.Power/this.MaxPower)*111;
		
		Draw_Rect(18,SH-27,h,11,Color.rgb(0,255,0).getString());
		Draw_Rect(153,SH-27,p,11,Color.rgb(255,100,0).getString());

		Draw_Text("16px tahoma","rgb(255,255,255)", 290, SH-16, "SCORE: "+this.Score);
		Draw_Text("16px tahoma","rgb(255,255,255)", 5, 16, "LEVEL: "+Level+"    KILLS: "+Combo);
	}
}

//THIS IS WHERE THE GAME PLAY IS MANAGED//
class GamePlayScreen
{
	//DEFINE GAME VARIABLES
	constructor()
	{
		this.bg = new Background(-1,0);
		this.player = new Player();
		
		this.GoodBullets = [];
		this.BadBullets = [];
		this.Enemies = [];
		this.PowerUps = [];
		this.Coins = [];
		this.Explosions = [];
		this.frames = 0;
		this.end = false;
		this.Transition = 1;
	}
	
	//CONVENIENT GENERIC FUNCTION TO UPDATE OBJECT ARRAYS
	UpdateArray(array)
	{
		for(var i = 0; i<array.length; i++)
		{
			if(array[i].Active) 
			{ 
				array[i].Update(); 
				if(array[i].IntersectsWith(this.player))
				{
					this.player.HandleCollision(array[i]);
					array.HandleCollision();
				}
			}
			else { array.splice(i,1); }
		}
	}
	
	//CONVENIENT GENERIC FUNCTION TO DRAW OBJECT ARRAYS
	DrawArray(array) 
	{
		for(var i = 0; i<array.length; i++) 
		{ 
			array[i].Draw(); 
		} 
	}
	
	//HANDLE GAMEPLAY INPUT
	HandleInput()
	{
		//player shoot
		if(KEYS[KName["Space"]])
		{
			var b = this.player.Shoot();
			if(b.State != "NULL")
			{
				var a = 0;
				for(var i=0; i<this.player.gun.Barrels; i++)
				{
					a = b.Copy();
					a.SpeedY = ((i%2)? -1: 1)*Math.ceil(i/2);
					a.PositionY = b.PositionY-a.SpeedY;
					this.GoodBullets.push(a);
				}
			}
		}
		//pause game
		if(KEYS[KName["Esc"]] || KEYS[KName["B"]])
		{
			ResetKeys();
			Play_Sound(Resources.Sounds["GUNSHOT"]);
			Set_Sound_Volume(Resources.Sounds["GAMEPLAY_MUSIC"],0.3);
			GameState = GAME_STATES["PAUSE"];
		}
		//player moves
		this.player.HandleInput();
	}
	
	//UPDATE GAMEPLAY//
	Update(d)
	{
		if(this.player.Active==false)
		{
			ResetKeys();
			this.Reset();
			GameState = GAME_STATES["GAMEOVER"];
			Stop_Sound(Resources.Sounds["GAMEPLAY_MUSIC"]);
		}
		this.player.Update();
		this.bg.Update();
		
		if(RandomInt(0,(303-(Level*3)))<5)
		{	
			this.Enemies.push(new Enemy());
		}

		this.frames = (this.frames+1)%500;

		if(this.frames == 0)
		{
			Level++;
			if(Level>99) Level = 99;
		}

		//UPDATE GOOD BULLETS
		for(var i = 0; i<this.GoodBullets.length; i++)
		{
			if(this.GoodBullets[i].Active) 
			{ 
				this.GoodBullets[i].Update(); 
			}
			else { this.GoodBullets.splice(i,1); }
		}

		//UPDATE POWER UPS
		for(var i = 0; i<this.PowerUps.length; i++)
		{
			if(this.PowerUps[i].Active)
			{
				this.PowerUps[i].Update();
				if(this.PowerUps[i].IntersectsWith(this.player) && this.player.Health>0)
				{
					this.player.HandleCollision(this.PowerUps[i]);
					this.PowerUps[i].HandleCollision();
				}
			}
			else { this.PowerUps.splice(i,1); }
		}

		//UPDATE CONIS
		for(var i = 0; i<this.Coins.length; i++)
		{
			if(this.Coins[i].Active)
			{
				this.Coins[i].Update();

				if(this.Coins[i].IntersectsWith(this.player) && this.player.Health>0)
				{
					this.player.HandleCollision(this.Coins[i]);
					this.Coins[i].HandleCollision();
				}
			}
			else { this.Coins.splice(i,1); }
		}

		//UPDATE ENEMIES
		for(var i = 0; i<this.Enemies.length; i++)
		{
			if(this.Enemies[i].Active)
			{
				this.Enemies[i].Update();
				var b = this.Enemies[i].Shoot();
				if(b.State!=STATES["NULL"] && b.PositionX<SW)
				{
					Play_Sound(Resources.Sounds["LASERSHOT"],0.3);//al_play_sample(LaserShot,0.3,Enemies[i].GetPositionX()/float(SW)-0.5,3.0,ALLEGRO_PLAYMODE_ONCE,NULL);
					this.BadBullets.push(b);
				}
			}
			else{ this.Enemies.splice(i,1); }
		}

		//UPDATE EXPLOSIONS
		for(var i = 0; i<this.Explosions.length; i++)
		{
			if(this.Explosions[i].Active) { this.Explosions[i].Update(); }
			else { this.Explosions.splice(i,1); }
		}

		//UPDATE BAD BULLETS
		for(var i = 0; i<this.BadBullets.length; i++)
		{
			if(this.BadBullets[i].Active)
			{
				this.BadBullets[i].Update();

				if(this.BadBullets[i].IntersectsWith(this.player))
				{
						this.player.HandleCollision(this.BadBullets[i]);
						this.BadBullets[i].HandleCollision();
						this.Explosions.push(new Explosion(this.player.PositionX,this.player.PositionY,STATES["GOOD"]));
				}
			}
			else { this.BadBullets.splice(i,1); }
		}

		//CHECK FOR COLLISIONS
		for(var j = 0; j<this.Enemies.length; j++)
		{
			if(this.Enemies[j].Active)
			{
				for(var i = 0; i<this.GoodBullets.length; i++)
				{
					//check collision with enemies and bullets
					if(this.GoodBullets[i].Active)
					{
						if(this.Enemies[j].IntersectsWith(this.GoodBullets[i]))
						{
							Play_Sound(Resources.Sounds["PUNCH"]);
							this.player.Score += ((this.Enemies[j].Value())+Combo);
							this.Enemies[j].HandleCollision(TYPES["BULLET"]);
							this.GoodBullets[i].HandleCollision();
							this.Explosions.push(new Explosion(this.Enemies[j].PositionX,this.Enemies[j].PositionY,STATES["BAD"]));
							switch(RandomInt(1,4))
							{
								case 3: this.Coins.push(new Coin(this.Enemies[j].PositionX,this.Enemies[j].PositionY)); break;
								case 4: this.PowerUps.push(new PowerUp(this.Enemies[j].PositionX,this.Enemies[j].PositionY)); break;
							}
						}
					}
				}
				//check collision with player
				if(this.Enemies[j].IntersectsWith(this.player))
				{
					this.Enemies[j].HandleCollision(this.player.Type);
					this.player.HandleCollision(this.Enemies[j]);
					this.Explosions.push(new Explosion(this.Enemies[j].PositionX,this.Enemies[j].PositionY,STATES["BAD"]));
				}
			}
		}	
	}
	
	//DRAW THE GAMEPLAY SCREEN//
	Draw()
	{
		this.bg.Draw();
		for(var i = 0; i<this.Enemies.length; i++) {  this.Enemies[i].Draw(); }
		this.player.Draw();
		for(var i = 0; i<this.PowerUps.length; i++) { this.PowerUps[i].Draw(); }
		for(var i = 0; i<this.Coins.length; i++) { this.Coins[i].Draw(); }
		for(var i = 0; i<this.GoodBullets.length; i++) { this.GoodBullets[i].Draw(); }
		for(var i = 0; i<this.BadBullets.length; i++) { this.BadBullets[i].Draw(); }
		for(var i = 0; i<this.Explosions.length; i++) { this.Explosions[i].Draw(); }
		this.player.Draw2();
	}
	
	//RESET GAMEPLAY SCREEN//
	Reset()
	{
		this.player.Reset();
		this.GoodBullets = [];
		this.BadBullets = [];
		this.Enemies = [];
		this.PowerUps = [];
		this.Coins = [];
		this.Explosions = [];
		this.frames = 0;
		Level = 1;
		Combo = 0;
	}
}

//GAME OVER SCREEN CLASS DECLARATION//
class GameOverScreen
{
	constructor(){}
	Update(){}
	HandleInput()
	{
		if(KEYS[KName["Enter"]] || KEYS[KName["Space"]] || KEYS[KName["Esc"]] || KEYS[KName["B"]])
		{
			GameState = GAME_STATES["TITLE"];
			Play_Sound(Resources.Sounds["TITLE_MUSIC"],1,true); //al_play_sample_instance(MSI2);
			ResetKeys();
		}
	}
	Draw() { ctx.drawImage(Resources.Images["GAMEOVER"],0,0); }
};

//TITLE SCREEN CLASS DECLARATION//
class TitleScreen
{
	constructor()
	{
		this.Transition = 1;
		this.end = false;
	}


	Update()
	{
		if(this.Transition < 255)
		{
			this.Transition += 255/32;
		}
		else if(this.Transition >= 255)
		{
			this.Transition = 0;
		}
	}

	HandleInput()
	{
		if(KEYS[KName["Space"]] || KEYS[KName["Enter"]] || TOUCHING[0] || TOUCHING[1])
		{
			GameState = GAME_STATES["GAMEPLAY"];
			Play_Sound(Resources.Sounds["GUNSHOT"]);
			ResetKeys();
			Stop_Sound(Resources.Sounds["TITLE_MUSIC"]);
			Play_Sound(Resources.Sounds["GAMEPLAY_MUSIC"],1,true);
		}
	}

	Draw()
	{
		ctx.drawImage(Resources.Images["TITLE"],0,0);
		ctx.globalAlpha = (this.Transition/255);
		ctx.drawImage(Resources.Images["PRESS_START"],480,300);
		ctx.globalAlpha = 1;
	}
}

//GAME SCREEN MANAGER CLASS DECLARATION//
var GameScreens = new Array();
class ScreenManager
{
	static AddScreen(newScreen)
	{
		GameScreens.push(newScreen);
	}
	
	static HandleInput()
	{
		GameScreens[GameState].HandleInput();
	}
	
	static Update(d)
	{
		GameScreens[GameState].Update(d);
	}
	
	static Draw()
	{
		ctx.clearRect(0, 0, SW, SH);
		GameScreens[GameState].Draw();
	}
	
	static Reset(screenID)
	{
		GameScreens[screenID].Reset();
	}
}

//PAUSE SCREEN CLASS DELARATION
class PauseScreen
{
	constructor()
	{
		this.menu = 0;
	}
	
	Resume()
	{
		Play_Sound(Resources.Sounds["GUNSHOT"]);
		ResetKeys();
		this.menu = 0;
		GameState = GAME_STATES["GAMEPLAY"];
		Set_Sound_Volume(Resources.Sounds["GAMEPLAY_MUSIC"],1);
	}
	
	Quit()
	{
		Play_Sound(Resources.Sounds["GUNSHOT"]);
		ResetKeys();
		this.menu = 0;
		ScreenManager.Reset(GAME_STATES["GAMEPLAY"]);
		GameState = GAME_STATES["TITLE"];
		Stop_Sound(Resources.Sounds["GAMEPLAY_MUSIC"]);
		Play_Sound(Resources.Sounds["TITLE_MUSIC"],1,true);
	}
	
	Update(){}

	HandleInput()
	{
		if(KEYS[KName["Up"]])
		{
			this.menu--;
			if(this.menu<0) { this.menu = 0;}
			else { Play_Sound(Resources.Sounds["SWORDS"]); }
		}
		else if(KEYS[KName["Down"]])
		{
			this.menu++;
			if(this.menu>1) { this.menu = 1;}
			else { Play_Sound(Resources.Sounds["SWORDS"]); }
		}
		if((KEYS[KName["Space"]]) || (KEYS[KName["Enter"]]))
		{
			if(this.menu==0) { this.Resume(); }
			else { this.Quit(); }
		}
		else if(KEYS[KName["B"]]){ this.Resume(); }
		else if(KEYS[KName["Esc"]]) { this.Quit(); }
	}

	Draw()
	{
		ctx.drawImage(Resources.Images["PAUSE"],0,0);
		Draw_Rect(530,200+64*(this.menu),200,48,Color.rgb(255,50+RandomInt(1,60),0).getString(),false);
		Draw_Rect(532,202+64*(this.menu),196,44,Color.rgb(255,50+RandomInt(1,60),0).getString(),false);
	}
};

//ADD SCREENS TO THE SCREEN MANAGER
ScreenManager.AddScreen(new TitleScreen());
ScreenManager.AddScreen(new GamePlayScreen());
ScreenManager.AddScreen(new PauseScreen());
ScreenManager.AddScreen(new GameOverScreen());

//FUNCTION THAT STARTS THEGAME
function Start_Game()
{
//START PLAYING THE TITLE MUSIC
Play_Sound(Resources.Sounds["TITLE_MUSIC"],1,loop);
// Start things off
requestAnimationFrame(GameLoop);
}

//THIS IS THE GAME LOOP
function GameLoop(timestamp)
{
    // Throttle the frame rate.    
    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) 
	{
        requestAnimationFrame(GameLoop);
        return;
    }
    delta += timestamp - lastFrameTimeMs;
    lastFrameTimeMs = timestamp;

    if (timestamp > lastFpsUpdate + 1000) 
	{
        fps = 0.25 * framesThisSecond + 0.75 * fps;

        lastFpsUpdate = timestamp;
        framesThisSecond = 0;
    }
    framesThisSecond++;

    var numUpdateSteps = 0;
    while (delta >= timestep) 
	{
        ScreenManager.HandleInput();
		ScreenManager.Update(timestep);
        delta -= timestep;
        if (++numUpdateSteps >= 240) 
		{
            delta=0; //panic();
            break;
        }
    }
    ScreenManager.Draw();
    requestAnimationFrame(GameLoop);
}

//LOAD GAME RESOURCES//
//then start the game//
Resources.Load();

