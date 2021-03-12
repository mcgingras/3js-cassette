import './style.css'
import * as THREE from 'three';

window.THREE = THREE;
var loader = new THREE.FileLoader();
loader.load( '/app.json', function ( text ) {
    var player = new APP.Player();
    player.load(JSON.parse( text ));
    player.setSize( window.innerWidth, window.innerHeight );
    player.play();

    document.body.appendChild( player.dom );

    window.addEventListener( 'resize', function () {
        player.setSize( window.innerWidth, window.innerHeight );
    });
});

var APP = {
	Player: function () {
		var renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio ); // TODO: Use player.setPixelRatio()
		renderer.outputEncoding = THREE.sRGBEncoding;

		var loader = new THREE.ObjectLoader();
		var camera, scene;
		var dom = document.createElement( 'div' );
		dom.appendChild( renderer.domElement );

		this.dom = dom;
		this.width = 500;
		this.height = 500;

		this.load = function ( json ) {

			var project = json.project;
			if ( project.shadows !== undefined ) renderer.shadowMap.enabled = project.shadows;
			if ( project.shadowType !== undefined ) renderer.shadowMap.type = project.shadowType;
			if ( project.toneMapping !== undefined ) renderer.toneMapping = project.toneMapping;
			if ( project.toneMappingExposure !== undefined ) renderer.toneMappingExposure = project.toneMappingExposure;
			if ( project.physicallyCorrectLights !== undefined ) renderer.physicallyCorrectLights = project.physicallyCorrectLights;

			this.setScene( loader.parse( json.scene ) );
			this.setCamera( loader.parse( json.camera ) );
		};

		this.setCamera = function ( value ) {
			camera = value;
			camera.aspect = this.width / this.height;
			camera.updateProjectionMatrix();
		};

		this.setScene = function ( value ) {
			scene = value;
		};

		this.setPixelRatio = function ( pixelRatio ) {
			renderer.setPixelRatio( pixelRatio );
		};

		this.setSize = function ( width, height ) {

			this.width = width;
			this.height = height;

			if ( camera ) {
				camera.aspect = this.width / this.height;
				camera.updateProjectionMatrix();
			}
			if ( renderer ) {
				renderer.setSize( width, height );
			}
		};

		var time, prevTime;

        // @jacob - this is where I've been experimenting with
        // different animations
		function animate() {
			time = performance.now();
            let group = scene.children[0];
            group.position.y = Math.sin(time * .002) + 7;
            group.rotation.y = 0;
            group.rotation.z += .01;
			renderer.render( scene, camera);
			prevTime = time;
		}

		this.play = function () {
			prevTime = performance.now();
			renderer.setAnimationLoop( animate );
		};

		this.stop = function () {
			renderer.setAnimationLoop( null );
		};

		this.render = function ( time ) {
			renderer.render( scene, camera );
		};

		this.dispose = function () {
			renderer.dispose();
			camera = undefined;
			scene = undefined;
		};
	}
};