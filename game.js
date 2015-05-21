function Iniciar(obj,max){
	this.Lienzo = obj ;
	this.pause 	= true ; //comienza pausado
	this.level 	= 10	; //largo
	this.veloc 	= 100 ; //largo
	this.direc 	= 6 ; //direccion down
	this.point 	= 0 ; //puntaje
	this.size 	= 16 ; //tamaño del bit
	this.width 	= this.size*32 ; //lienzo ancho
	this.height = this.size*20 ; //lienzo alto
	this.anim   = 0	; 
	this.fruit 	= {
		size : 16 , //tamaño
		type : ['simple'] ,
		valor: [   10   ]
	} ,
	this.recursive = true ; //posicion inicial (en px)
	this.top = this.size*5 ; //posicion inicial (en px)
	this.left = this.size*5 ; //posicion inicial (en px)
	this.max = max ;
	this.clas = Array() ;
	this.clas[8] = 'up' ;
	this.clas[2] = 'do' ;
	this.clas[4] = 'le' ;
	this.clas[6] = 'ri' ;
	this.Obstacles = [
		[
			[5,0],
			[5,1],
			[5,2],
			[5,3],
			[5,4],
			[5,5],
			[5,6],
			[5,7],
			[5,8],
			[5,9],
			[4,9],
			[3,9],
			[2,9],
			[1,9],
			[0,9]
		]
	]
	this.iniciarLienzo();
}

Iniciar.prototype = {
	Frutas : [] ,
	Snake : [] ,
	Obstac : [] ,
	Movs : {
		pos : Array( 8 , 2 , 4 , 6 ) ,
		opp : Array( 2 , 8 , 6 , 4 ) ,
		key : Array( 38, 40, 37, 39, 13) 
	} ,
	numbers : ['zero','one','two','three','four','five','six','seven','eight','nine'] ,
	interval : null ,
	timeout : null ,
	borrarFruta : function ( n ) {
		$("#fruit_"+n).remove() ;
		return (this.Frutas.splice(n ,1))[0] ;
	} ,
	hayFruta : function ( top , left ) {
		hayFruta = false ;
		$.each( this.Frutas , function ( fruta , pos ) {
			if ( pos['top'] == top && pos['left'] == left ) {
				hayFruta = fruta.toString() ;
				return false
			}
		})
		return hayFruta ;
	} ,
	haySnake : function ( top , left ) {
		haySnake = false ;
		$.each( this.Snake , function ( snake , pos ) {
			if ( pos['top'] == top && pos['left'] == left ) {
				haySnake = true ;
				return false
			}
		})
		return haySnake ;
	} ,
	hayObstac : function ( top , left ) {
		hayObstac = false ;
		$.each( this.Obstac , function ( obstac , pos ) {
			if ( pos['top'] == top && pos['left'] == left ) {
				hayObstac = true ;
				return false
			}
		})
		return hayObstac ;
	} ,
	crearObstac : function ( x , y ) {
		numObstac = this.Obstac.length ;		
		this.Obstac[ numObstac ] = [] ;
		this.Obstac[ numObstac ]['top'] = x ;
		this.Obstac[ numObstac ]['left'] = y ;
		this.Lienzo.append('<div class="obs" id="obs_'+ numObstac +'" style="top:'+this.Obstac[numObstac]['top']+'px;left:'+this.Obstac[numObstac]['left']+'px"></div>');
		return numObstac ;
	} ,
	crearObstacs : function ( level ) {
		for( i = 0 ; i < this.Obstacles[level].length ; i++ ){
			this.crearObstac((this.Obstacles[level][i][0]*this.size),(this.Obstacles[level][i][1]*this.size))
		}
	} ,
	crearFruta : function ( from ) {
		numFruta = this.Frutas.length ;
		posH = this.posR( this.height , this.fruit.size ) ;
		posW = this.posR( this.width , this.fruit.size ) ;
		type = Math.floor(Math.random()*this.fruit.type.length);
		if ( !this.hayFruta( posH , posW ) && !this.haySnake( posH , posW ) && !this.hayObstac( posH , posW ) ) {
			this.Frutas[ numFruta ] = [] ;
			this.Frutas[ numFruta ]['top'] = posH ;
			this.Frutas[ numFruta ]['left'] = posW ;
			this.Frutas[ numFruta ]['type'] = this.fruit.type[type] ;
			this.Frutas[ numFruta ]['points'] = this.fruit.valor[type] ;
			
			if(typeof from === 'undefined'){
				from = new Array();
				from['top'] = posH ;
				from['left'] = posW ;
				from['type'] = this.fruit.type[type] ;
				from['points'] = this.fruit.valor[type] ;
			}
			this.Lienzo.append('<div class="eat '+from['type']+'" id="fruit_'+ numFruta +'" style="top:'+from['top']+'px;left:'+from['left']+'px;"></div>');
			$("#fruit_"+numFruta).animate({top:posH+'px',left:posW+'px'},this.anim);
			
			return numFruta ;
		}else{
			this.crearFruta( from );
		}
	} ,
	iniciarLienzo : function () {
		var self = this ;
		this.Lienzo.css('width',this.width+'px');
		this.Lienzo.css('height',this.height+'px');
		this.Lienzo.before('<div class="point"><div class="number zero"></div><div class="number zero"></div><div class="number zero"></div><div class="number zero"></div><div class="line"></div></div>');
		$(".point").css('width',(this.width+(this.size/2)-1)+'px');
		this.Lienzo.after('<div id="stats" style="width:'+(this.width+(this.size/2)-1)+'px"></div>');
		$('#stats').append(
			'<div class="left"><div class="max">'+this.max+'</div><a id="play" href="#">'+(this.pause?'Play':'Pause')+'</a><a id="recur" href="#">'+(this.recursive?'Bordes On':'Bordes Off')+'</a></div>'+
			'<div class="both"></div>'
		);
		this.Lienzo.wrap('<div id="container" />')
		$("#container").css('width',(this.width-1)+'px');
		this.sound.init();
		this.crearFruta();
		//this.crearObstacs(0);
		this.setRecursive(this.recursive);
		
		$("#play").click(function(){
			event.preventDefault();
			self.pausar(this);
		})
		
		$("#recur").click(function(){
			event.preventDefault();
			self.setRecursive(!self.recursive);
		})
		
		$("body").keydown(function(event) {
			self.controles(event);
               event.preventDefault();
		});		
	} ,
	pausar : function (e) {
		this.pause ? this.start() : this.pausa() ;
		$(e).html( ( this.pause ? 'Play' : 'Pause' ) ) ;	
	} ,
	pausa : function () {
		this.pause = true ;
		this.stopit();
	} ,
	start : function () {
		this.pause = false ;
		this.init();
	} ,
	posR :  function ( m , s ) {
		return (Math.floor(((Math.random()*(m-1*s))+s)/s)*s) ;
	} ,
	sound : {
		element : null ,
		init : function () {
			$("body").prepend('<audio><source src="sounds/m (3).mp3" type=\'audio/mpeg; codecs="mp3"\'><!--<source src="sounds/eat.ogg" type=\'audio/ogg; codecs="vorbis"\'>--></audio>');
			this.element = ($('audio'))[0] ;
		} ,
		play : function ( at ) {
			Game.sound.element.src = "sounds/eat.mp3" ;
			Game.sound.element.src = "sounds/m (3).mp3" ;
			//this.element.play(0) ;
		}
	} ,
	cambiarSentido : function (event) {
		e = 1;
		for( i = 0 ; i < this.Movs.key.length && e ; i++ ){
			if ( event.which == this.Movs.key[ i ] ){
				if( this.direc != this.Movs.opp[ i ] ) {
					if( this.Movs.pos[ i ] == 6 ) {
						clas = this.clas[this.direc] + 'ri';
					}else if( this.Movs.pos[ i ] == 4 ) {
						clas = this.clas[this.direc] + 'le';
					}else if( this.Movs.pos[ i ] == 8 ) {
						clas = this.clas[this.direc] + 'up';
					}else if( this.Movs.pos[ i ] == 2 ) {
						clas = this.clas[this.direc] + 'do';
					}
					if( $(".bit:last").hasClass('e') ) {
						$(".bit:last").attr('class', 'bit '+clas+' e');
					}else{
						$(".bit:last").attr('class', 'bit '+clas);
					}
					this.direc = this.Movs.pos[ i ] ;
					event.preventDefault();
					this.avanzar(this.veloc*0.2); 
					e = 0;
				}
			}
		}
	} ,
	controles : function ( event ) {
		if( event.which == 32 ){
			event.preventDefault();
			this.pausar($("#play"));
		}else if ( event.which == 13 ) {
			if ( !this.pause ) {
				this.avanzar(this.veloc*0.2,true);
				this.avanzar(this.veloc*0.2,false);
			}; 
		}else{
			if ( !this.pause ) this.cambiarSentido(event) ;
		}
	} ,
	counter: function () {
		$($(".point div")[3]).attr('class', 'number '+this.numbers[ Math.floor( (this.point / 1 ) % 10 ) ] ) ;
		$($(".point div")[2]).attr('class', 'number '+this.numbers[ Math.floor( (this.point / 10 ) % 10 ) ] ) ;
		$($(".point div")[1]).attr('class', 'number '+this.numbers[ Math.floor( (this.point / 100 ) % 10 ) ] ) ;
		$($(".point div")[0]).attr('class', 'number '+this.numbers[ Math.floor( (this.point / 1000 ) % 10 ) ] ) ;
	} ,
	velocity: function () {
		if (this.point < 100) {
			this.veloc = 100 ;
		}else if (this.point < 500) {
			this.veloc = 80 ;
		}else if (this.point < 1000) {
			this.veloc = 60 ;
		}else if (this.point < 2000) {
			this.veloc = 40 ;
		}else if (this.point < 4000) {
			this.veloc = 30 ;
		}else{
			this.veloc = 20 ;
		}
	} ,
	subirNivel : function (f){
		this.stopit();
		this.level ++ ;
		this.init();
		this.point = this.point + f;
		this.max = (this.point > this.max) ? this.point : this.max ;
		$(".max").html(this.max);
		this.counter();
		this.velocity();
	} ,
	Next: function(){
		nex = { left : 0 , top : 0 };
		switch(this.direc){
			case 6:
				nex.left = this.left + this.size ;
				nex.top = this.top ;
				break;
			case 4:
				nex.left = this.left - this.size ;
				nex.top = this.top ;
				break;
			case 2:
				nex.top = this.top + this.size ;
				nex.left = this.left ;
				break;
			case 8:
				nex.top = this.top - this.size ;
				nex.left = this.left ;
				break;
		}
		return nex ;
	} ,
	avanzar : function (delay,ss) {
		
		ss = (typeof ss === 'undefined') ? false : true ;
		
		this.stopit();
		del = ( (typeof delay === 'undefined') ? 0 : delay ) ;
		del = ( (typeof delay === 'undefined') ? 0 : delay ) ;
		this.init(del);
		
		if( this.top == 0 & this.direc == 8 ){
			if( this.recursive ) {
				this.top = this.height ;
			}else{
				this.lose();
			}
		}
		
		if( this.left == 0 & this.direc == 4 ){
			if( this.recursive ) {
				this.left = this.width ;
			}else{
				this.lose();
			}
		}
		
		switch(this.direc){
			case 6:
				this.left = this.left + this.size ;
				break;
			case 4:
				this.left = this.left - this.size ;
				break;
			case 2:
				this.top = this.top + this.size ;
				break;
			case 8:
				this.top = this.top - this.size ;
				break;
		}
		
		if( this.top == this.height & this.direc == 2 ){
			if( this.recursive ) {
				this.top = 0 ;
			}else{
				this.lose();
			}
		}
		
		if( this.left == this.width & this.direc == 6 ){
			if( this.recursive ) {
				this.left = 0 ;
			}else{
				this.lose();
			}
		}
		
		clas="";
		
		
		if( n = this.hayFruta(this.top,this.left) ) {
			this.subirNivel( this.Frutas[n]['points'] );
			this.sound.play();
			this.crearFruta(this.borrarFruta(n));
			clas = 'e' ;
		}
		
		if( this.haySnake(this.top,this.left) || this.hayObstac(this.top,this.left) ) {
			this.lose();
		}
		
		numSnake = this.Snake.length ;
		
		this.Snake[ numSnake ] = [] ;
		this.Snake[ numSnake ]['top'] = this.top ;
		this.Snake[ numSnake ]['left'] = this.left ;
		
		while ( this.level < this.Snake.length ) {
			this.Snake.shift();
			$("div .bit:first").remove();
			$("div .bit:first").addClass('butt');
		}
					
		$("div .bit:last").removeClass('head');
		this.Lienzo.append('<div class="bit '+this.clas[this.direc]+' '+clas+'" style="top:'+this.top+'px;left:'+this.left+'px"></div>') ;			
		$("div .bit:last").addClass('head');
		
		
		if( this.hayFruta( this.Next().top , this.Next().left ) ){
			$("div .bit:last").addClass('open');
		}else{
			$("div .bit:last").removeClass('open');
		}
		
		if( ss ) {
			$("div .bit:last").addClass('open');
			$("div .bit:last").addClass('ss');
			
		}else if ( $("div .open.ss").lenght == 1 ) {
			$("div .bit:last").addClass('ss');
			$("div .bit:last").prev().prev().removeClass('ss');
		
		}else{
			$("div .bit:last").prev().prev().removeClass('ss');
			$("div .bit:last").prev().prev().removeClass('open');
		}
	} ,
	init : function (delay) {
		del = ( (typeof delay === 'undefined') ? this.veloc : delay ) ;
		clearTimeout( this.timeout ) ;
		clearInterval( this.interval );
		this.timeout = setTimeout( function (_this) { 
			_this.interval = setInterval( function (__this) {
				__this.avanzar() ;
			} , _this.veloc , _this )
		} , del , this ) ;
	} ,
	stopit : function () {
		clearTimeout( this.timeout ) ;
		clearInterval( this.interval );
	} ,
	lose : function(){
		$.ajax({
			url: "index.html?points=" + this.point
		})
		this.point = 0 ;
		this.level = 4 ;
		this.counter();
		this.velocity();
	} ,
	setRecursive : function (v){
		this.recursive = v ;
		if(v){
			//this.Lienzo.css('box-shadow','0 0 10px white inset');
			$("#recur").html('Bordes On');
		}else{
			//this.Lienzo.css('box-shadow','');
			$("#recur").html('Bordes Off');
		}
	}
}
