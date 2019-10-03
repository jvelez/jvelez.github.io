//Author: Jonathan Velez

//MAIN GLOBAL VARIABLES
var EXIT = false;
var GameState = 0;
var Level = 1;
var Combo = 0;
var Kills = 0;
var MAX_SCORE = 9999999999;

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
var PI2 = 2 * Math.PI;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var SW = canvas.width;
var SH = canvas.height;

//INPUT GLOBAL VARIABLES
var KEYS = Array(222);
var KName = {
	'Enter': 13,
	'Esc': 21,
	'Space': 32,
	'Left': 37,
	'Up': 38,
	'Right': 39,
	'Down': 40,
	'B': 66,
	'F1': 112,
	'F2': 113
}

//SET ALL THE KEYS TO FALSE//
function ResetKeys() { for (var i = 0; i < KEYS.length; i++) { KEYS[i] = false; } }

//LISTEN FOR INPUT EVENTS
document.addEventListener("keydown", KeyPressed, false);
document.addEventListener("keyup", KeyReleased, false);

//HANDLE PRESSED KEYS
function KeyPressed(e) { KEYS[e.keyCode] = true; }

//HANDLE RELEASED KEYS
function KeyReleased(e) { KEYS[e.keyCode] = false; }

//DRAW A RECTANGLE GIVEN POS X Y , WIDTH AND HEIGHT, COLOR AND FILL FLAG
function Draw_Rect(x, y, w, h, color, fill = true) {
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	if (fill) { ctx.fill(); }
	else { ctx.stroke(); }
	ctx.closePath();
}

//DRAW A CIRCLE GIVEN POS X Y, RADIUS COLOR AND FILL FLAG
function Draw_Circle(x, y, r, color, fill = true) {
	if (r < 0) { r = 0; }
	ctx.beginPath();
	ctx.arc(x, y, r, 0, PI2, false);
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	if (fill) { ctx.fill(); }
	else { ctx.stroke(); }
	ctx.closePath();
}

//DRAW A ROTATED SPRITE GIVEN POS X Y ORIGIN X Y AND ANGLE
function Draw_Rotated_Sprite(img, px, py, ox, oy, a) {
	var angle = a * Math.PI / 180;
	ctx.translate(ox, oy);
	ctx.rotate(angle);
	ctx.translate(-ox, -oy);
	ctx.drawImage(img, px, py);
	ctx.translate(ox, oy);
	ctx.rotate(-angle);
	ctx.translate(-ox, -oy);
}

//DRAW TEXT GIVEN FONT COLOR POR X Y TEXT AND FILL FLAG
function Draw_Text(font, color, x, y, text, fill = true) {
	ctx.font = font;//"48px serif";
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	if (fill) { ctx.fillText(text, x, y); }
	else { ctx.strokeText(text, x, y); }
}

//CAP A GIVEN VALUE N BETWEEN TO VALUES MIN AND MAX
function Cap(n, min, max) {
	if (n < min) return min;
	else if (n > max) return max;
	else return n;
}

//RANDOM INT//
function RandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//CONVENIENT COLOR CLASS
class Color {
	constructor(r, g, b, a = 1) {
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	getString() {
		return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
	}

	copy() {
		return new Color(this.r, this.g, this.b, this.a);
	}

	static Gradient(color1, color2, ns, cs) {
		var p = (cs / ns);
		return new Color(
			Interpolate(color1.r, color2.r, p, -1),
			Interpolate(color1.g, color2.g, p, -1),
			Interpolate(color1.b, color2.b, p, -1),
			Interpolate(color1.a, color2.a, p)
		);
	}

	static rgb(r, g, b) {
		return new Color(r, g, b);
	}

	static rgba(r, g, b, a = 1) {
		return new Color(r, g, b, a);
	}
}

//GUN RELATED GLOBAL VARIABLES
var MAX_FIRE_POWER = 6;
var MAX_FIRE_RATE = 17;
var MAX_BARRELS = 5;
var MAX_MAX_BULLETS = 100;
var MAX_TOTAL_BULLETS = 9999;
var MIN_RELOAD_TIME = 1;

//CONVINIENT GUN CLASS DECLARATION//
class Gun {
	constructor() {
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

	Shoot() {
		if (!this.FireRate) {
			return false;
		}
		if (this.NoReload) {
			if (this.DelayTimer <= 0 && (this.Automatic ? true : !this.Fire)) {
				this.DelayTimer = Math.floor(FPS / this.FireRate);
				this.Fire = true;
				return true;
			}
		}
		else {
			if (this.DelayTimer <= 0 && this.Bullets > 0 && (this.Automatic ? true : !this.Fire)) {
				this.Bullets--;
				this.DelayTimer = FPS / this.FireRate;
				this.Fire = true;
				return true;
			}
		}
		return false;
	}

	CeaseFire() { this.Fire = false; }

	IsReady() { return this.DelayTimer == 0; }

	Update() { this.DelayTimer--; }

	Reload() {
		this.Bullets = ((this.TotalBullets < this.MaxBullets) ? this.TotalBullets : this.MaxBullets);
		this.TotalBullets -= this.MaxBullets;
		if (this.TotalBullets < 0) { this.TotalBullets = 0; }
	}

	AddBullets(bn) { this.TotalBullets += bn; }
	UpgradeFireRate() { this.FireRate++; }
	UpgradeFirePower() { this.FirePower++; }
	UpgradeReloadTime() { this.ReloadTime--; if (this.ReloadTime < MIN_RELOAD_TIME) { this.ReloadTime = MIN_RELOAD_TIME; } }
	UpgradeMaxBullets() { this.MaxBullets++; }
	UpgradeAutomatic() { this.Automatic = true; }
	UpgradeBarrels() { this.Barrels++; }

	MaxUpgrades() {
		this.FireRate = MAX_FIRE_RATE;
		this.FirePower = MAX_FIRE_POWER;
		this.ReloadTime = MIN_RELOAD_TIME;
		this.MaxBullets = MAX_MAX_BULLETS;
	}

	Reset(fp = 2) {
		this.Automatic = true;
		this.FireRate = 5;
		this.FirePower = fp;
		this.Barrels = 1;
	}

	Downgrade() {
		this.FireRate--;
		this.FirePower--;
		this.Barrels--;
	}

	Regulate() {
		this.FireRate = Cap(this.FireRate, 5, MAX_FIRE_RATE);
		this.FirePower = Cap(this.FirePower, 2, MAX_FIRE_POWER);
		this.Barrels = Cap(this.Barrels, 1, MAX_BARRELS);
	}
};

//IMAGE LOADING FUNCTION//
function LoadImage(filename) {
	var i = new Image();
	i.src = filename;
	return i;
}

//VARIABLE TO STORE THE GAME RESOURCES//
function LoadAudio(filename, max) {
	var audio_array = [];
	for (var i = 0; i < max; i++) { audio_array.push(new Audio(filename)); }
	return audio_array;
}

//RESOURCES STRUCTURE TO MANAGE THE GAME ASSETS
var Resources =
{
	Images: {},
	Sounds: {},

	Load: function () {
		//LOAD IMAGES
		this.Images["BACKGROUND"] = LoadImage("assets/backgrounds.jpg");
		this.Images["EXPLOSION"] = LoadImage("assets/explosion.png");
		this.Images["COIN"] = LoadImage("assets/coin.png");
		this.Images["POWERUPS"] = LoadImage("assets/powerups.png");
		this.Images["CHICKEN"] = LoadImage("assets/chicken.png");
		this.Images["AK47"] = LoadImage("assets/ak47.png");
		this.Images["ROAST"] = LoadImage("assets/roast.png");
		this.Images["TIGER"] = LoadImage("assets/tiger.png");
		this.Images["CROC"] = LoadImage("assets/crocodile.png");
		this.Images["DOLPHIN"] = LoadImage("assets/dolphin.png");
		this.Images["GRIFFIN"] = LoadImage("assets/griffin.png");
		this.Images["BEAVER"] = LoadImage("assets/beaver.png");
		this.Images["PRESS_START"] = LoadImage("assets/press_start.png");

		//LOAD SOUNDS// audio_array[] // audio_file_index
		//load multiples of each sound for sound pooling
		this.Sounds["TITLE_MUSIC"] = [LoadAudio("assets/title_music.wav", 1), 0];
		this.Sounds["GAMEPLAY_MUSIC"] = [LoadAudio("assets/gameplay_music.wav", 1), 0];
		this.Sounds["PUNCH"] = [LoadAudio("assets/punch.wav", 20), 0];
		this.Sounds["LASERSHOT"] = [LoadAudio("assets/lasershot.wav", 30), 0];
		this.Sounds["GUNSHOT"] = [LoadAudio("assets/gunshot.wav", 2), 0];
		this.Sounds["RECHARGE"] = [LoadAudio("assets/recharge.wav", 10), 0];
		this.Sounds["COIN"] = [LoadAudio("assets/star.wav", 10), 0];
		this.Sounds["SWORDS"] = [LoadAudio("assets/swords.wav", 4), 0];
		this.Sounds["ROOSTER"] = [LoadAudio("assets/cantagallo.wav", 1), 0];
	}
};

//PLAY A SOUND AT A GIVEN VOLUME DEFAULT IS 1//
function Play_Sound(sound, vol = 1, lp = false) {
	sound[0][sound[1]].volume = vol;
	sound[0][sound[1]].loop = lp;
	sound[0][sound[1]].play();
	sound[1]++;
	if (sound[1] >= sound[0].length) { sound[1] = 0; }
}

//STOP A SOUND//
function Stop_Sound(sound) {
	sound[0][sound[1]].pause();
	sound[0][sound[1]].currentTime = 0;
}

//SET THE VOLUME OF A SOUND//
function Set_Sound_Volume(sound, vol) {
	sound[0][sound[1]].volume = vol;
}

//GAME STATES
var GAME_STATES = { "TITLE": 0, "GAMEPLAY": 1, "PAUSE": 2, "GAMEOVER": 3 };

//OBJECT TYPES
var TYPES = { "BULLET": 0, "EXPLOSION": 1, "COIN": 2, "POWERUPS": 3, "ENEMY": 4 };

//OBJECT STATES
var STATES = { "NULL": -1, "GOOD": 0, "BAD": 1 };

//GAME OBJECT CLASS DECLARATION//
class GameObject {
	constructor() {
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

	SetPosition(x, y) { this.PositionX = x; this.PositionY = y; }
	SetSpeed(x, y) { this.SpeedX = x; this.SpeedY = y; }

	IntersectsWithRect(x, y, w, h) {
		return !((this.PositionY + this.Height) < (y) || (y + h) < (this.PositionY) ||
			(this.PositionX + this.Width) < (x) || (x + w) < (this.PositionX));
	}

	IntersectsWith(go) {
		return this.IntersectsWithRect(go.PositionX, go.PositionY, go.Width, go.Height);
	}
}

//STAR CLASS DECLARATION
class Star {
	//define the star atributes depending on the layer given
	constructor(L) {
		this.positionX = RandomInt(0, SW);
		this.positionY = RandomInt(0, SH);
		this.ogx = SW + this.PositionX + (SW);
		this.SpeedX = -RandomInt(Math.pow(2, L), Math.pow(2, L + 1)) * 0.05;
		this.size = RandomInt(0.2 * L, 0.2 * (L + 1));
		var r = RandomInt(32 * L, 64 * L);
		this.color = Color.rgb(r * (8 - L), r, r).getString();
	}

	Update() {
		this.positionX += this.SpeedX;
		if (this.positionX < 0) { this.positionX = SW * 1.5; }//+this.ogx; }
	}

	Draw() {
		Draw_Circle(this.positionX, this.positionY, this.size, this.color, true);
	}
}

//STARFIELD CLASS DECLARATION//
class StarField {
	constructor(layers) {
		this.Stars = [];
		this.maxstars = Math.ceil(SH / (layers * 0.5));
		for (var i = 0; i < layers; i++) {
			for (var j = 0; j < (this.maxstars / (i + 1)); j++) {
				this.Stars.push(new Star(i));
			}
		}
	}

	Update() {
		for (var i = 0; i < this.Stars.length; i++) { this.Stars[i].Update(); }
	}

	Draw() {
		for (var i = 0; i < this.Stars.length; i++) {
			this.Stars[i].Draw();
		}
	}
}

//BULLET CLASS DECLARATION//
class Bullet extends GameObject {
	constructor(x = -1000, y = -1000, sx = 0, sy = 0, st = STATES["NULL"], p = 0) {
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

	Copy() {
		var b = new Bullet(this.PositionX, this.PositionY, this.SpeedX, this.SpeedY, this.State, this.Power);
		return b;
	}

	Update() {
		this.PositionX += this.SpeedX;
		this.PositionY += this.SpeedY;
		if (this.PositionX > SW || this.PositionX + this.Width < 0 || this.PositionY > SH || this.PositionY + this.Height < 0 || this.States == STATES["NULL"]) {
			this.Active = false;
			this.Solid = false;
		}
	}

	HandleCollision() {
		this.Active = false;
		this.Solid = false;
	}

	Draw() {
		var x = (this.PositionX - this.Width);
		var y = (this.PositionY + this.Height);
		for (var i = this.Power * 2; i > 0; i--) {
			if (this.State == STATES["GOOD"]) {
				Draw_Circle(x + i * 3, y + RandomInt(1, i) - (i / 2), i, Color.rgb(255, RandomInt(1, 255), 0).getString());
			}
			else //bad
			{
				Draw_Circle(x + ((this.Power * 2) - (i * 3)), y + RandomInt(1, i) - Math.floor((i / 2)), i, Color.rgb(0, 255, RandomInt(1, 255)).getString());
			}
		}
	}
};

//EXPLOSION CLASS DECLARATION//
class Explosion extends GameObject {
	constructor(x, y, st) {
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
		this.PositionY = y - this.Height / 2;
		this.StartX = 0;
		this.StartY = 0;
	}

	Update() {
		this.FrameNumber++;
		if (this.FrameNumber > (this.Rows * this.Columns)) {
			this.Active = false;
			return;
		}
		this.FrameY = Math.floor(this.FrameNumber / this.Columns);
		this.FrameX = this.FrameNumber - this.Columns * this.FrameY;
		this.StartX = this.FrameX * this.Width;
		this.StartY = this.FrameY * this.Height;
	}

	Draw() {
		ctx.drawImage(Resources.Images["EXPLOSION"], this.StartX, this.StartY, this.Width, this.Height, this.PositionX, this.PositionY, this.Width, this.Height);
	}
};

//COINS CLASS DECLARATION//
class Coin extends Explosion {
	constructor(x, y) {
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
		this.PositionY = y - this.Height / 2;
		this.SpeedX = -3;
		this.SpeedY = 0;
		this.StartX = 0;
		this.StartY = 0;
	}

	Update() {
		this.PositionX += this.SpeedX;

		if (this.PositionX + this.Width < 0) {
			this.Active = false;
			this.Solid = false;
		}
		this.FrameNumber = (this.FrameNumber + 1) % (this.Rows * this.Columns);
		this.FrameY = Math.floor(this.FrameNumber / this.Columns);
		this.FrameX = this.FrameNumber - this.Columns * this.FrameY;
		this.StartX = this.FrameX * this.Width;
		this.StartY = this.FrameY * this.Height;
	}

	HandleCollision() {
		this.Active = false;
		this.Solid = false;
	}

	Draw() {
		ctx.drawImage(Resources.Images["COIN"], this.StartX, this.StartY, this.Width, this.Height, this.PositionX, this.PositionY, this.Width, this.Height);
	}
};

//POWERUP CLASS DECLARATRION//
class PowerUp extends GameObject {
	constructor(x = -1, y = -1, s = -1) {
		super();
		this.Type = TYPES["POWERUPS"];
		this.Solid = true;
		this.Active = true;
		this.SpeedX = -1;
		this.SpeedY = 0;
		this.Width = 32;
		this.Height = 32;
		this.PositionX = ((x == -1) ? (SW + SW / 2) : x);
		this.PositionY = ((y == -1) ? RandomInt(1, SH - this.Height) : y);
		this.State = ((s == -1) ? RandomInt(0, 4) : s);
	}

	Update() {
		this.PositionX += this.SpeedX;
		if (this.PositionX + this.Width < 0) {
			this.Active = false;
			this.Solid = false;
		}
	}

	HandleCollision() {
		this.Active = false;
		this.Solid = false;
	}

	Draw() {
		ctx.drawImage(Resources.Images["POWERUPS"], this.Width * this.State, 0, this.Width, this.Height, this.PositionX, this.PositionY, this.Width, this.Height);
	}
};

//ENEMY CLASS DECLARATION//
class Enemy extends GameObject {
	constructor() {
		super();
		this.State = RandomInt(0, 4);
		this.gun = new Gun();
		this.gun.Reset(1);
		this.gun.FireRate = RandomInt(1, Math.floor(Level / 6));
		this.gun.FirePower = RandomInt(2, 4);
		this.ImgIndex = "TIGER";
		switch (this.State) {
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
		this.PositionX = SW * 1.25;
		this.PositionY = RandomInt(1, (SH - this.Height));
		this.SpeedY = 0;
		this.SpeedX = -RandomInt(this.State + 2, 3 + Math.ceil(Level / 20));
		this.Solid = true;
		this.Active = true;
		this.Type = TYPES["ENEMY"];
		this.ID = STATES["BAD"];
	}

	Value() { return (this.State + 1) * 10; }

	Update() {
		//update enemy position
		this.PositionX += this.SpeedX;
		//clear combo if enemy escapes
		if (this.PositionX + this.Width < 0) {
			this.Solid = false;
			this.Active = false;
			Combo = 0;
		}
		//update enemy gun
		this.gun.Update();
	}

	Shoot() {
		//if this is a tiger, a croc or a dolphin
		//and the gun shoots, return a bad bullet
		if (this.State <= 2 && this.gun.Shoot()) {
			var x = Math.ceil(this.PositionX + this.Width / 4);
			var y = Math.floor(this.PositionY + this.Height / 2);
			return (new Bullet(x, y, -10, 0, STATES["BAD"], 3));
		}
		//otherwise return a null bullet
		else { return (new Bullet()); }
	}

	HandleCollision(Object) {
		this.Solid = false;
		this.Active = false;
		if (Object.Type == TYPES["BULLET"] && Object.State == STATES["GOOD"]) {
			Combo++;
			Kills++;
		}
	}

	Draw() {
		ctx.drawImage(Resources.Images[this.ImgIndex], this.PositionX, this.PositionY);
	}

};

//PLAYER CLASS DECLARATION//
class Player extends Enemy {
	constructor() {
		super();
		this.SpeedX = 0;
		this.SpeedY = 0;
		this.ID = STATES["GOOD"];
		this.Type = TYPES["PLAYER"];
		this.State = STATES["NULL"];
		this.PositionX = SW / 2;
		this.PositionY = SH / 2;
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

	HandleInput() {
		if (KEYS[KName["Up"]]) { this.SpeedY = -5; }
		else if (KEYS[KName["Down"]]) { this.SpeedY = 5; }

		if (KEYS[KName["Left"]]) { this.SpeedX = -5; }
		else if (KEYS[KName["Right"]]) { this.SpeedX = 5; }

		//if(KEYS[KName["LShift"]]) { this.SpeedX *=2; this.SpeedY *=2; }
	}

	Update() {
		if (this.Health < 1) {
			this.PositionY += 3;
			this.Angle += 10;
			if (this.PositionY + this.Height > SH) {
				//GAME OVER!!!
				this.Solid = false;
				this.Active = false;
				Play_Sound(Resources.Sounds["ROOSTER"]);
			}
			return;
		}

		this.powerTimer--;

		if (this.powerTimer < 1) { this.Power -= 0.3; }
		else { this.Power -= 2; }

		if (this.Power < 1) { this.Power = 1; }

		if (this.Power > this.MaxPower) {
			this.powerTimer = 50;
		}

		//update player position
		this.PositionX += this.SpeedX;
		this.PositionY += this.SpeedY;

		//keep player inside the map
		if (this.PositionX < 0) { this.PositionX = 0; }
		else if (this.PositionX + this.Width > SW) { this.PositionX = SW - this.Width; }
		if (this.PositionY < 0) { this.PositionY = 0; }
		else if (this.PositionY + this.Height > SH) { this.PositionY = SH - this.Height; }

		this.SpeedX = this.SpeedY = 0;

		//update the gun
		this.gun.Update();

		this.frameDelay++;
		if (this.frameDelay > 1) { this.frame = (this.frame + 1) % 9; this.frameDelay = 0; }
	}

	Shoot() {
		if (this.powerTimer < 1 && this.gun.Shoot()) {
			this.Power += this.gun.Barrels * 0.7;
			var x = this.PositionX + this.Width;
			var y = this.PositionY + this.Height / 2 - this.gun.FirePower / 2 - 3;
			Play_Sound(Resources.Sounds["LASERSHOT"]);
			return (new Bullet(x, y, 15, 0, STATES["GOOD"], this.gun.FirePower));
		}
		return (new Bullet());
	}

	ModifyScore(val) {
		this.Score += val;
		if (this.Score > MAX_SCORE) { this.Score = MAX_SCORE; }
	}

	HandleCollision(Object) {
		switch (Object.Type) {
			case TYPES["POWERUPS"]:
				Play_Sound(Resources.Sounds["RECHARGE"]);
				switch (Object.State) {
					case 0: this.Shield++; if (this.Shield > 4) { this.Shield = 4; } break; //SHIELD+
					case 1: this.gun.UpgradeFirePower(); break; //DAMAGE+
					case 2: this.gun.UpgradeFireRate(); break; //FIRE_RATE+
					case 3: this.Health += 15; if (this.Health > this.MaxHealth) { this.Health = this.MaxHealth; } break; //HEALTH+
					case 4: this.gun.UpgradeBarrels(); break; //BARREL+
				}
				this.gun.Regulate();
				break;

			case TYPES["COIN"]:
				Play_Sound(Resources.Sounds["COIN"]);
				this.ModifyScore(250);
				break;

			case TYPES["ENEMY"]:
			case TYPES["BULLET"]:
				Play_Sound(Resources.Sounds["PUNCH"]);
				if (this.Shield) {
					this.Shield--; //Take away one shield
					if (this.Shield < 0) { this.Shield = 0; } //shield is broken
				}
				else //player haves no shields, take health
				{
					//substract health and one level of power ups
					this.Health -= 10;
					this.gun.Downgrade();
					this.gun.Regulate();
					if (this.Health < 1) { this.Health = 0; }
				}
		}
	}

	Reset() {
		this.SpeedX = 0;
		this.SpeedY = 0;
		this.PositionX = SW / 2;
		this.PositionY = SH / 2;
		this.Solid = true;
		this.Active = true;
		this.gun.Reset();
		this.frame = 0;
		this.Shield = 0;
		this.MaxHealth = this.Health = 100;
		this.Angle = 0;
		this.Score = 0;
	}

	Draw() {
		var w = 26;
		var h = 27;

		//Draw dead chicken
		if (this.Health < 1) {
			Draw_Rotated_Sprite(Resources.Images["ROAST"], this.PositionX, this.PositionY, this.PositionX + 75 / 2, this.PositionY + 75 / 2, this.Angle);
			return;
		}
		//Draw shield
		for (var i = this.Shield; i > 0; i--) {
			Draw_Circle(this.PositionX + this.Width / 2, this.PositionY + this.Height / 2, (20 + (i * 5)), Color.rgba(0, 0, 100 + RandomInt(1, 20), 0.3).getString());
			Draw_Circle(this.PositionX + this.Width / 2, this.PositionY + this.Height / 2, (20 + (i * 5)) + 1, Color.rgba(60, 120 + RandomInt(1, 80), 255, 0.3).getString(), false);
		}
		//Draw chicken
		ctx.drawImage(Resources.Images["CHICKEN"], (8 - this.frame) * w, 0, w, h, this.PositionX, this.PositionY, w * 1.3, h * 1.3);
		//Draw weapon
		ctx.drawImage(Resources.Images["AK47"], this.PositionX + 6 + this.frame % 2, this.PositionY + 13 + this.frame % 4);
	}

	Draw2() {
		var h = (this.Health / this.MaxHealth) * 111;
		var p = (this.Power / this.MaxPower) * 111;

		//black border
		Draw_Rect(15, SH - 30, 117, 17, "#111111");
		Draw_Rect(150, SH - 30, 117, 17, "#111111");

		//white border
		Draw_Rect(16, SH - 29, 115, 15, "#ffffff");
		Draw_Rect(151, SH - 29, 115, 15, "#ffffff");

		//red interior
		Draw_Rect(18, SH - 27, 111, 11, Color.rgb(255, 0, 0).getString());
		Draw_Rect(153, SH - 27, 111, 11, Color.rgb(255, 0, 0).getString());

		//health bar, power bar
		Draw_Rect(18, SH - 27, h, 11, Color.rgb(0, 255, 0).getString());
		Draw_Rect(153, SH - 27, p, 11, Color.rgb(255, 100, 0).getString());

		Draw_Text("16px tahoma", "#ffffff", 290, SH - 16, "SCORE: " + this.Score);
		Draw_Text("16px tahoma", "#ffffff", 5, 16, "LEVEL: " + Level + "    KILLS: " + Kills + "    COMBO: " + Combo);
	}
}

//THIS IS WHERE THE GAME PLAY IS MANAGED//
class GamePlayScreen {
	//DEFINE GAME VARIABLES
	constructor() {
		this.bg = new StarField(8);
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
	UpdateArray(array, col = false) {
		for (var i = 0; i < array.length; i++) {
			if (array[i].Active) {
				array[i].Update();

				//if array item is of enemy type then shoot
				if (array[i].Type == TYPES["ENEMY"]) {
					var b = this.Enemies[i].Shoot();
					if (b.State != STATES["NULL"] && b.PositionX < SW) {
						Play_Sound(Resources.Sounds["LASERSHOT"], 0.3);
						this.BadBullets.push(b);
					}
				}

				//check and handle collisions if necesary
				if (col == true && array[i].IntersectsWith(this.player)) {
					this.player.HandleCollision(array[i]);
					console.log(array[i].Type + "  " + array[i].Sate);
					array[i].HandleCollision();
					//add explotion if array item is a bad bullet
					if (array[i].Type == TYPES["BULLET"] && array[i].State == STATES["BAD"]) {
						this.Explosions.push(new Explosion(this.player.PositionX, this.player.PositionY, STATES["GOOD"]));
					}
				}
			}
			else { array.splice(i, 1); }
		}
	}

	//CONVENIENT GENERIC FUNCTION TO DRAW OBJECT ARRAYS
	DrawArray(array) {
		for (var i = 0; i < array.length; i++) {
			array[i].Draw();
		}
	}

	//HANDLE GAMEPLAY INPUT
	HandleInput() {
		//player shoot
		if (KEYS[KName["Space"]]) {
			var b = this.player.Shoot();
			if (b.State != "NULL") {
				var a = 0;
				for (var i = 0; i < this.player.gun.Barrels; i++) {
					a = b.Copy();
					a.SpeedY = ((i % 2) ? -1 : 1) * Math.ceil(i / 2);
					a.PositionY = b.PositionY - a.SpeedY;
					this.GoodBullets.push(a);
				}
			}
		}
		//pause game
		if (KEYS[KName["Esc"]] || KEYS[KName["B"]]) {
			ResetKeys();
			Play_Sound(Resources.Sounds["GUNSHOT"]);
			Set_Sound_Volume(Resources.Sounds["GAMEPLAY_MUSIC"], 0.3);
			GameState = GAME_STATES["PAUSE"];
		}
		//player moves
		this.player.HandleInput();
	}

	//UPDATE GAMEPLAY//
	Update(d) {
		if (this.player.Active == false) {
			ResetKeys();
			this.Reset();
			GameState = GAME_STATES["GAMEOVER"];
			Stop_Sound(Resources.Sounds["GAMEPLAY_MUSIC"]);
		}
		this.player.Update();
		this.bg.Update();

		//generate new enemies
		if (RandomInt(0, (303 - (Level * 3))) < 5) {
			this.Enemies.push(new Enemy());
		}

		//count frames to determine level
		this.frames = (this.frames + 1) % 500;
		if (this.frames == 0) {
			Level++;
			if (Level > 99) Level = 99;
		}

		//UPDATE GAME OBJECTS
		this.UpdateArray(this.GoodBullets);
		this.UpdateArray(this.PowerUps, true);
		this.UpdateArray(this.Coins, true);
		this.UpdateArray(this.Enemies);
		this.UpdateArray(this.Explosions);
		this.UpdateArray(this.BadBullets, true);

		//CHECK FOR COLLISIONS
		for (var j = 0; j < this.Enemies.length; j++) {
			if (this.Enemies[j].Active) {
				for (var i = 0; i < this.GoodBullets.length; i++) {
					//check collision with enemies and bullets
					if (this.GoodBullets[i].Active) {
						if (this.Enemies[j].IntersectsWith(this.GoodBullets[i])) {
							Play_Sound(Resources.Sounds["PUNCH"]);
							this.player.ModifyScore((this.Enemies[j].Value()) + (Combo * 10));
							this.Enemies[j].HandleCollision(this.GoodBullets[i]);
							this.GoodBullets[i].HandleCollision();
							this.Explosions.push(new Explosion(this.Enemies[j].PositionX, this.Enemies[j].PositionY, STATES["BAD"]));
							switch (RandomInt(1, 4)) {
								case 3: this.Coins.push(new Coin(this.Enemies[j].PositionX, this.Enemies[j].PositionY)); break;
								case 4: this.PowerUps.push(new PowerUp(this.Enemies[j].PositionX, this.Enemies[j].PositionY)); break;
							}
						}
					}
				}
				//check collision with player
				if (this.Enemies[j].IntersectsWith(this.player)) {
					this.Enemies[j].HandleCollision(this.player);
					this.player.HandleCollision(this.Enemies[j]);
					this.Explosions.push(new Explosion(this.Enemies[j].PositionX, this.Enemies[j].PositionY, STATES["BAD"]));
				}
			}
		}
	}

	//DRAW THE GAMEPLAY SCREEN//
	Draw() {
		this.bg.Draw();
		this.DrawArray(this.Enemies);
		this.player.Draw();
		this.DrawArray(this.PowerUps);
		this.DrawArray(this.Coins);
		this.DrawArray(this.GoodBullets);
		this.DrawArray(this.BadBullets);
		this.DrawArray(this.Explosions);
		this.player.Draw2();
	}

	//RESET GAMEPLAY SCREEN//
	Reset() {
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
		Kills = 0;
	}
}

//GAME OVER SCREEN CLASS DECLARATION//
class GameOverScreen {
	constructor() { }
	Update() { }
	HandleInput() {
		if (KEYS[KName["Enter"]] || KEYS[KName["Space"]] || KEYS[KName["Esc"]] || KEYS[KName["B"]]) {
			GameState = GAME_STATES["TITLE"];
			Play_Sound(Resources.Sounds["TITLE_MUSIC"], 1, true);
			ResetKeys();
		}
	}
	Draw() { ctx.drawImage(Resources.Images["BACKGROUND"], 0, 800, 800, 400, 0, 0, 800, 400); }
};

//TITLE SCREEN CLASS DECLARATION//
class TitleScreen {
	constructor() {
		this.Transition = 1;
		this.end = false;
	}

	Update() {
		if (this.Transition < 255) {
			this.Transition += 255 / 32;
		}
		else if (this.Transition >= 255) {
			this.Transition = 0;
		}
	}

	HandleInput() {
		if (KEYS[KName["Space"]] || KEYS[KName["Enter"]]) {
			GameState = GAME_STATES["GAMEPLAY"];
			Play_Sound(Resources.Sounds["GUNSHOT"]);
			ResetKeys();
			Stop_Sound(Resources.Sounds["TITLE_MUSIC"]);
			Play_Sound(Resources.Sounds["GAMEPLAY_MUSIC"], 1, true);
		}
	}

	Draw() {
		ctx.drawImage(Resources.Images["BACKGROUND"], 0, 0, 800, 400, 0, 0, 800, 400);
		ctx.globalAlpha = (this.Transition / 255);
		ctx.drawImage(Resources.Images["PRESS_START"], 480, 300);
		ctx.globalAlpha = 1;
	}
}

//GAME SCREEN MANAGER DECLARATION//
var ScreenManager = {
	GameScreens: new Array(),
	AddScreen: function (newScreen) { 
		this.GameScreens.push(newScreen); 
	},
	HandleInput: function () { 
		this.GameScreens[GameState].HandleInput(); 
	},
	Update: function (d) { 
		this.GameScreens[GameState].Update(); 
	},
	Draw: function () { 
		ctx.clearRect(0, 0, SW, SH); this.GameScreens[GameState].Draw();
	},
	Reset: function (screenID) { 
		this.GameScreens[screenID].Reset(); 
	}
};

//PAUSE SCREEN CLASS DELARATION
class PauseScreen {
	constructor() {
		this.menu = 0;
	}

	Resume() {
		Play_Sound(Resources.Sounds["GUNSHOT"]);
		ResetKeys();
		this.menu = 0;
		GameState = GAME_STATES["GAMEPLAY"];
		Set_Sound_Volume(Resources.Sounds["GAMEPLAY_MUSIC"], 1);
	}

	Quit() {
		Play_Sound(Resources.Sounds["GUNSHOT"]);
		ResetKeys();
		this.menu = 0;
		ScreenManager.Reset(GAME_STATES["GAMEPLAY"]);
		GameState = GAME_STATES["TITLE"];
		Stop_Sound(Resources.Sounds["GAMEPLAY_MUSIC"]);
		Play_Sound(Resources.Sounds["TITLE_MUSIC"], 1, true);
	}

	Update() { }

	HandleInput() {
		if (KEYS[KName["Up"]]) {
			this.menu--;
			if (this.menu < 0) { this.menu = 0; }
			else { Play_Sound(Resources.Sounds["SWORDS"]); }
		}
		else if (KEYS[KName["Down"]]) {
			this.menu++;
			if (this.menu > 1) { this.menu = 1; }
			else { Play_Sound(Resources.Sounds["SWORDS"]); }
		}
		if ((KEYS[KName["Space"]]) || (KEYS[KName["Enter"]])) {
			if (this.menu == 0) { this.Resume(); }
			else { this.Quit(); }
		}
		else if (KEYS[KName["B"]]) { this.Resume(); }
		else if (KEYS[KName["Esc"]]) { this.Quit(); }
	}

	Draw() {
		ctx.drawImage(Resources.Images["BACKGROUND"], 0, 400, 800, 400, 0, 0, 800, 400);
		Draw_Rect(530, 200 + 64 * (this.menu), 200, 48, Color.rgb(255, 50 + RandomInt(1, 60), 0).getString(), false);
		Draw_Rect(532, 202 + 64 * (this.menu), 196, 44, Color.rgb(255, 50 + RandomInt(1, 60), 0).getString(), false);
	}
};

//ADD SCREENS TO THE SCREEN MANAGER
ScreenManager.AddScreen(new TitleScreen());
ScreenManager.AddScreen(new GamePlayScreen());
ScreenManager.AddScreen(new PauseScreen());
ScreenManager.AddScreen(new GameOverScreen());

//FUNCTION THAT STARTS THE GAME
function Start_Game() {
	document.getElementById("start-button").outerHTML = ""; //REMOVE BUTTON
	Play_Sound(Resources.Sounds["TITLE_MUSIC"], 1, true); //START PLAYING THE TITLE MUSIC
	requestAnimationFrame(GameLoop); //START THE GAME
}

//THIS IS THE GAME LOOP
function GameLoop(timestamp) {
	//Throttle the frame rate.   
	if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
		requestAnimationFrame(GameLoop);
		return;
	}
	delta += timestamp - lastFrameTimeMs;
	lastFrameTimeMs = timestamp;

	if (timestamp > lastFpsUpdate + 1000) {
		fps = 0.25 * framesThisSecond + 0.75 * fps;

		lastFpsUpdate = timestamp;
		framesThisSecond = 0;
	}
	framesThisSecond++;

	var numUpdateSteps = 0;
	while (delta >= timestep) {
		ScreenManager.HandleInput();
		ScreenManager.Update(timestep);
		delta -= timestep;
		if (++numUpdateSteps >= 240) {
			delta = 0;
			break;
		}
	}
	ScreenManager.Draw();
	requestAnimationFrame(GameLoop);
}

//LOAD GAME RESOURCES FIRST, THEN START THE GAME//
Resources.Load();
