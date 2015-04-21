var Game = {
	firstRun:true,
	paused:true,
	mouse: [0,0],
	start: function(){
		this.paused = false;
	},
	stop: function(){
		this.paused = true;
	},
	togglePause: function(){
		(this.paused) ? this.start() : this.stop();
	},
	snake: {
		first: [100,100],
		prev: [0,0],
		last: [0,0],
		dir: 'right',
		mover: function(){
			
		},
		turn: function(key){
			this.dir = key;
		},
		draw: function(game){
			x=this.first[0]-5;
			y=this.first[1]-5;
			
			game.layer.beginPath();
			game.layer.rect(x-4,y,10,4);
			game.layer.fillStyle('black');
			game.layer.fill();
			
			game.layer.beginPath();
			game.layer.rect(x+2,y,2,2);
			game.layer.rect(x+2,y+2,2,2);
			game.layer.fillStyle('transparent');
			game.layer.fill();
			
		}
	},
	fruit: {
		pos: [0,0],
		nueva: function(game){
			this.pos[0] = Math.floor(Math.random()*game.layer.canvas.width);
			this.pos[1] = Math.floor(Math.random()*game.layer.canvas.height);
			this.pos[0] = this.pos[0] - this.pos[0] % 10;
			this.pos[1] = this.pos[1] - this.pos[1] % 10;
			this.pos[0] = this.pos[0] + 5;
			this.pos[1] = this.pos[1] + 5;
			console.log(this.pos);
		},
		draw: function(game){
			x=this.pos[0]-2;
			y=this.pos[1]-2;
			game.layer.beginPath();
			game.layer.rect(x+2,y,2,2);
			game.layer.rect(x+4,y+2,2,2);
			game.layer.rect(x,y+2,2,2);
			game.layer.rect(x+2,y+4,2,2);
			game.layer.fillStyle('black');
			game.layer.fill();
		}
	},
	setup: function() {
		this.layer = cq().framework(this, this);    
		this.layer.appendTo("body");
	},
	onstep: function(delta) {
		
	},
	onrender: function() {
		this.layer.clear();
		//this.snake.draw(this);
		//this.fruit.nueva(this);
		this.fruit.draw(this);
		this.layer.fillText('x:'+this.mouse[0]+' y:'+this.mouse[1],10,50);
	},
	onmousemove: function(x,y){
		this.mouse = [x,y];
	},
	ontouchmove: function(x,y){	},
	onkeydown: function(key){
		if( key=='up' || key=='down' || key=='left' || key=='right' ){
			this.snake.turn(key);
		};
		if( key=='space' ){
			this.togglePause();
		}
	}
};

window.addEventListener("load", function() {
	Game.setup();
});