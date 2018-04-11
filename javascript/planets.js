window.onload = function() {
	// you know , For Circles
	function de2ra(degree)   { return degree*(Math.PI/180); }

	//AppUtil.showPadDetails();

	// containers for objects
	// 
	var planet = [];
	var ring = [];
	var sol = [];
	var suns = [];
	var lookAt;
	var daylightIndicator;
	var daylight;
	var iMod = 0;
	var shape_line =[];


	// dumb generic var for a view form outside orbits
	var seeAll = false;

	start();
    function start(){
    	createPresentation();
    };

	function createPresentation(){

	    // MAIN

		// standard global variables
		var container, scene, camera, renderer, controls, stats;
		var keyboard = new THREEx.KeyboardState();
		var clock = new THREE.Clock();


		init();
		animate();


		// FUNCTIONS 		
		function init() 
		{
			// SCENE
			scene = new THREE.Scene({ background: null });
			//scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0025 );
			// CAMERA
			var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
			var VIEW_ANGLE = 40, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
			camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);


			scene.add(camera);
			
			camera.position.set(0,0,14000);
			lookAt = scene.position;
			camera.lookAt(lookAt);	

			if ( Detector.webgl )
				renderer = new THREE.WebGLRenderer( {antialias:true,  alpha: true } );
			else
				renderer = new THREE.CanvasRenderer(); 
  			renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
			renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
			renderer.autoClear = false;
            renderer.setClearColor(0x000000, 0.0);

			container = document.createElement( 'div' );
			renderer.domElement.id = 'renderer';

			document.body.appendChild( container );

			container.appendChild( renderer.domElement );
			// EVENTS
			THREEx.WindowResize(renderer, camera);
			THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
			// CONTROLS
			controls = new THREE.TrackballControls( camera );
			// STATS
			stats = new Stats();
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.bottom = '0px';
			stats.domElement.style.zIndex = 100;
			container.appendChild( stats.domElement );
			
			//
			// LIGHT
			//
			var light = new THREE.PointLight(0xffffff);
			light.position.set(0,250,0);
			scene.add(light);

			var light2 = new THREE.PointLight(0xffffff);
			light2.position.set(0,0,9000);
			scene.add(light2);

			var light3 = new THREE.PointLight(0xffffff);
			light2.position.set(0,0,16000);
			scene.add(light2);


			function drawCircle(x,y,z,radius,index,color){

				circPoints = [];
				function setCirclePointCoordinates(radius){
					for(var iDeg= 1; iDeg <=360 ; iDeg++){
						var xN = radius * Math.cos(2 * Math.PI * iDeg / 360).toFixed(6);
						var yN = radius * Math.sin(2 * Math.PI * iDeg / 360).toFixed(6); 
						circPoints.push(new THREE.Vector2 (xN+x,yN+y));
					}
				}
				setCirclePointCoordinates(radius);

				
				var circShape = new THREE.Shape( circPoints );
				var extrudeSettings = { amount: 20 }; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5;
				addSolidLineShape( circShape, extrudeSettings, color, x, y, z, 0, 0, 0, 1, index );
				

			}

			function invertDisplay(n){
				switch(n){
					case 0:
						return '';
						break;
					case 1:
						return 110;
						break;
					case 2:
						return 100;
						break;
					case 3:
						return 90;
						break;
					case 4:
						return 80;
						break;
					case 5:
						return 70;
						break;
					case 6:
						return 60;
						break;
					case 7:
						return 50;
						break;
					case 8:
						return 40;
						break;
					case 9:
						return 30;
						break;
					case 10:
						return 20;
						break;
					case 11:
						return 10;
						break;

				}
			}

			function addSolidLineShape( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s,index ){
				

				var points = shape.createPointsGeometry();
				

				shape_line[index] = new THREE.Line( points, new THREE.LineBasicMaterial( { color: color, linewidth: 2 } ) );
				shape_line[index].position.set( x, y, z );
				shape_line[index].rotation.set( rx, ry, rz );
				shape_line[index].scale.set( s, s, s );
				scene.add( shape_line[index] );
			}

			

			function addExtruded3DShape( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s,index ){

					var points = shape.createPointsGeometry();
					var spacedPoints = shape.createSpacedPointsGeometry( 100 );
					
					var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

					mesh[index] = THREE.SceneUtils.createMultiMaterialObject( geometry, [ new THREE.MeshLambertMaterial( { color: color } ), new THREE.MeshBasicMaterial( { color: 0xFF6EC7, wireframe: true, transparent: true } ) ] );
					mesh[index].position.set( x, y, z);
					mesh[index].rotation.set( rx, ry, rz );
					mesh[index].scale.set( s, s, s );
					parent.add( mesh[index] );

			}

			function addPlanet(xDistance, y, z, radius, segWidth, segHeight, color1, color2, index , motionAngle, sunIndex, sun){
				var img = index % 2 == 1 ? "images/stone1.jpeg":"images/blue.jpeg";
				switch(index){
					case 1:
					case 3:
					case 8:
					case 9:
						img = "images/moon.jpeg";
						break;
					case 2: 
						img = "images/stone1.jpeg";
						break;
					case 4:
					default:
						img = "images/blue.jpeg"

				}

				// var surface = new THREE.MeshBasicMaterial({
				//     map: THREE.ImageUtils.loadTexture(img)
				// });

				var sphereGeometry = new THREE.SphereGeometry(radius, segWidth, segHeight);
				//var sphereTexture = new THREE.ImageUtils.loadTexture( img );
				var sphereTexture = new THREE.TextureLoader().load( img);

				var sphereMaterial = new THREE.MeshBasicMaterial( { map: sphereTexture } );

				
				// var ringGeometry = new THREE.CircleGeometry(radius+200);
				// var ringMaterial = new THREE.MeshBasicMaterial( { color: 0xFF6103, wireframe: true, transparent: false } ); 
				// ring[index] = new THREE.Mesh(ringGeometry, ringMaterial);
				// scene.add( ring[index] );
				

				planet[index] = new THREE.Mesh(sphereGeometry.clone() , sphereMaterial);
				planet[index].radius = radius;

				sun == 0 ? pPos = sol[sunIndex].radius: pPos = planet[sun].radius
				planet[index].position.set( pPos + xDistance ,y,z);
				planet[index].motionAngle = motionAngle;
				planet[index].xDistance=xDistance;
				scene.add( planet[index] );
			}


			function addSun(x, y, z, radius, segWidth, segHeight, index ){

				var img = "images/fire.gif";

				var sphereGeometry = new THREE.SphereGeometry(radius, segWidth, segHeight);
				var sphereTexture = new THREE.TextureLoader().load( img);
				var sphereMaterial = new THREE.MeshBasicMaterial( { map: sphereTexture } );
				sol[index] = new THREE.Mesh(sphereGeometry.clone() , sphereMaterial);

				sol[index].position.set(x, y, z);
				sol[index].radius = radius;
				scene.add( sol[index] );
			}


			// SKYBOX/FOG
			var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
			var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
			var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
		    skyBox.flipSided = true; // render faces from inside of the cube, instead of from outside (default).
			// scene.add(skyBox);
			//scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
			
			////////////
			// CUSTOM //
			////////////

			function makeStars(){

				var starsGeometry = new THREE.Geometry();

				for ( var i = 0; i < 10000; i ++ ) {

					var star = new THREE.Vector3();
					star.x = Math.random() * 22000 -7000;
					star.y = Math.random() * 22000 -7000;
					star.z = Math.random() * 22000 -7000;
					starsGeometry.vertices.push( star );

				}

				var starsMaterial = new THREE.PointsMaterial( { size: 10, color: 'yellow' } );

				var starField = new THREE.Points( starsGeometry, starsMaterial );

				scene.add( starField );
			}
			makeStars();


			//sun addSun(x, y, z, radius, segWidth, segHeight, index )
			addSun(0,0,9000,400,32,16,1);
			//planets
			addPlanet(200, sol[1].position.y, sol[1].position.z, 20, 32, 16, 0xFF0033, 0x000000, 1 ,0.0049	,1,1);
			addPlanet(800, sol[1].position.y, sol[1].position.z, 30, 32, 16, 0x00DD99, 0x000000, 2 ,0.0047	,1,0);
			addPlanet(1400, sol[1].position.y, sol[1].position.z, 35, 32, 16, 0x00ff00, 0x000000, 3 ,0.0027	,1,0);
			addPlanet(2600,sol[1].position.y, sol[1].position.z, 200, 32, 16, 0xFF00ff, 0x000000, 4 ,0.00201	,1,0);	
// //tilt		
			planet[1].rotation.x = 0.311;
			planet[2].rotation.x = 0.47;
			planet[3].rotation.x = 0.6;

// 			//moons
 			addPlanet(321,planet[4].position.y, planet[4].position.z, 33, 32, 16, 0xFFFFCC, 0xFFDDAA, 8 ,0.00201	,1,4);
 			addPlanet(600,planet[4].position.y, planet[4].position.z, 66, 32, 17, 0xFFCC99, 0xFFAA88, 9 ,0.00201	,1,4);

			planet[8].rotation.x = 6.68;
			planet[9].rotation.x= 3.13; 	

	
 			// lookat
 			addPlanet(5000,planet[4].position.y, planet[4].position.z, 1, 4, 2, 0xffffff, 0x000000, 11 ,0.00201	,1,4);

 			daylightIndicator = Math.sqrt(Math.pow(2600,2) + Math.pow(5000,2) );

			var radInner = 150;
			var radMiddle = 155;
			var radOuter = 160;
		}

		var x_motion_positive = true;
		var drawAmmo = false;
		var releaseAmmo = false;
		var follow = false;
		var theta_xz =0;
		var theta_yz =0;
		var cameraMotionAngle=0;
		var biggest = 0;
		var smallest = 10000;
		var camX, camY, camZ, lookX,lookY,lookZ;
		var seeAll = false;

		function animate() 
		{

			iMod++;
			

			// rotations
			sol[1].rotation.y -= 0.006;
			//sol[2].rotation.y -= 0.01;

			planet[1].rotation.y -= 0.008;
			planet[2].rotation.y -= 0.009;
			planet[3].rotation.y -= 0.011;
			planet[4].rotation.y -= 0.003715;
			// // planet[5].rotation.y -= 0.011;
			// // planet[6].rotation.y -= 0.014;
			// // planet[7].rotation.y -= 0.018;

			planet[8].rotation.y -= 0.0027;

			planet[9].rotation.y -= 0.0036;

			//planet[10].rotation.y -=0.0012;

			/*
			* Orbits
			*/ 
			planet[1].motionAngle += 0.0032;
			planet[1].position.set(   (sol[1].radius + planet[1].xDistance ) * Math.cos(planet[1].motionAngle) + sol[1].position.x , sol[1].position.y ,(sol[1].radius+planet[1].xDistance)* Math.sin(planet[1].motionAngle) + sol[1].position.z)


			planet[2].motionAngle += 0.0047; 
			planet[2].position.set(  (sol[1].radius + planet[2].xDistance )* Math.cos(planet[2].motionAngle) + sol[1].position.x , sol[1].position.y ,(sol[1].radius+planet[2].xDistance)* Math.sin(planet[2].motionAngle) + sol[1].position.z)
			

			planet[3].motionAngle += 0.0027; 
			planet[3].position.set(   (sol[1].radius + planet[3].xDistance )* Math.cos(planet[3].motionAngle) + sol[1].position.x , sol[1].position.y ,(sol[1].radius+planet[3].xDistance)* Math.sin(planet[3].motionAngle) + sol[1].position.z)
			
			planet[4].motionAngle += 0.0011;
			planet[4].position.set(   (sol[1].radius + planet[4].xDistance )* Math.cos(planet[4].motionAngle) + sol[1].position.x , sol[1].position.y ,(sol[1].radius+planet[4].xDistance)* Math.sin(planet[4].motionAngle) + sol[1].position.z)
			

			// the moon s

			planet[9].motionAngle += 0.0011/12;
			planet[9].position.set(   (planet[4].radius+planet[9].xDistance)* Math.cos(planet[9].motionAngle) + planet[4].position.x , planet[4].position.y ,(planet[4].radius+planet[9].xDistance)* Math.sin(planet[9].motionAngle) + planet[4].position.z)

			planet[8].motionAngle += 0.0011/10;
			planet[8].position.set(   (planet[4].radius+planet[8].xDistance)* Math.cos(planet[8].motionAngle) + planet[4].position.x , planet[4].position.y ,(planet[4].radius+planet[8].xDistance)* Math.sin(planet[8].motionAngle) + planet[4].position.z)

// lookat
			planet[11].motionAngle += 0.003715;
			planet[11].position.set(   (planet[4].radius+planet[11].xDistance)* Math.cos(planet[11].motionAngle) + planet[4].position.x , planet[4].position.y ,(planet[4].radius+planet[11].xDistance)* Math.sin(planet[11].motionAngle) + planet[4].position.z)



			var distancetosun = Math.sqrt( Math.pow(sol[1].position.z - planet[11].position.z, 2 ) + Math.pow(sol[1].position.x - planet[11].position.x,2  ));
		
            if( seeAll == false ){
    			if ( distancetosun > 7190 && distancetosun  < 7200 ){
			        	document.getElementById('bg0').style.opacity = "0";
			        	document.getElementById('bg1').style.opacity = "1";
			        	document.getElementById('bg2').style.opacity = "0";
			        }
			    if ( distancetosun > 3190 && distancetosun < 3200 ){
			        	document.getElementById('bg0').style.opacity = "0";
			        	document.getElementById('bg1').style.opacity = "0";
			        	document.getElementById('bg2').style.opacity = "1";
			        }
			}  
			if ( seeAll == true ){
			        	document.getElementById('bg0').style.opacity = "1";
			        	document.getElementById('bg1').style.opacity = "0";
			        	document.getElementById('bg2').style.opacity = "0";
			}
		

			camX = planet[4].radius * Math.cos(planet[4].motionAngle) + planet[4].position.x;
			camY = planet[4].position.y;
			camZ = planet[4].radius * Math.sin(planet[4].motionAngle) + planet[4].position.z;


			if(seeAll === false){
				camera.position.set((planet[4].radius+1)* Math.cos(planet[11].motionAngle) + planet[4].position.x , planet[4].position.y ,(planet[4].radius+1)* Math.sin(planet[11].motionAngle) + planet[4].position.z);
				camera.lookAt(planet[11].position);
			}
			else{
				camera.position.set(0,1500,16000);
				camera.lookAt(scene.position);
			}


		    requestAnimationFrame( animate );
			render();		
			update();
		}


		function update()
		{
			if ( keyboard.pressed("z") ) 
			seeAll = true;

			if ( keyboard.pressed("x") ) 
			seeAll = false;

			controls.update();
			stats.update();
		}

		function render() 
		{
			renderer.render( scene, camera );
		}
	}

}
