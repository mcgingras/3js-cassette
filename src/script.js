import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

window.THREE = THREE;

/**
 * Debug
 */

const gui = new dat.GUI()
const parameters = {
    color: 0xffffff
}

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
		var camera, scene, controls;
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
      controls = new OrbitControls(camera, dom);
      controls.enableDamping = true;

      scene.children[0].rotation.y = 0;

      /**
       * Debug controls
       */
      gui.add(scene.children[0].position, 'x')
      .min(-10)
      .max(10)
      .name("Tape X");

      gui.add(scene.children[0].position, 'y')
      .min(4)
      .max(20) // lol
      .name("Tape Y");

      gui.addColor(parameters, 'color')
      .onChange(() => {
          scene.children[0].children[0].children[4].material.color.set(parameters.color);
      })
      .name("T/B Sticker");

      gui.addColor(parameters, 'color')
      .onChange(() => {
          scene.children[0].children[0].children[0].material.color.set(parameters.color);
          scene.children[0].children[0].children[1].material.color.set(parameters.color);
          scene.children[0].children[0].children[2].material.color.set(parameters.color);
          scene.children[0].children[0].children[3].material.color.set(parameters.color);
      })
      .name("Screws");

      gui.addColor(parameters, 'color')
      .onChange(() => {
          scene.children[0].children[0].children[5].material.color.set(parameters.color);
      })
      .name("Mid Sticker");

      gui.addColor(parameters, 'color')
      .onChange(() => {
          scene.children[0].children[0].children[6].material.color.set(parameters.color);
      })
      .name("Bottom Bracket");

      gui.addColor(parameters, 'color')
      .onChange(() => {
          scene.children[0].children[0].children[8].material.color.set(parameters.color);
      })
      .name("Pane Front");

      gui.addColor(parameters, 'color')
      .onChange(() => {
          scene.children[0].children[0].children[7].material.color.set(parameters.color);
      })
      .name("Pane Front Mid");

      gui.addColor(parameters, 'color')
      .onChange(() => {
          scene.children[0].children[0].children[9].material.color.set(parameters.color);
          scene.children[0].children[0].children[10].material.color.set(parameters.color);
          scene.children[0].children[0].children[11].material.color.set(parameters.color);
          scene.children[0].children[0].children[12].material.color.set(parameters.color);
      })
      .name("Tape");

      gui.addColor(parameters, 'color')
      .onChange(() => {
          scene.children[0].children[0].children[13].material.color.set(parameters.color);
      })
      .name("Pane Center");

      gui.addColor(parameters, 'color')
      .onChange(() => {
          scene.children[0].children[0].children[14].material.color.set(parameters.color);
      })
      .name("Pane Back");

      gui.addColor(parameters, 'color')
      .onChange(() => {
          scene.children[0].children[0].children[15].material.color.set(parameters.color);
      })
      .name("Pane Back Mid");

      gui.addColor(parameters, 'color')
      .onChange(() => {
          scene.children[0].children[0].children[16].material.color.set(parameters.color);
      })
      .name("Bottom Bracket Back");
		};

		this.setCamera = function ( value ) {
			camera = value;
			camera.aspect = this.width / this.height;
			camera.updateProjectionMatrix();
		};

		this.setScene = function ( value ) {
      console.log(value);
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
      controls.update();
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