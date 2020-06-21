import * as THREE from 'three';

const vert = `
  uniform float time;
  attribute vec3 velocity;
  attribute vec3 acceleration;
  void main() {
    float timeScale = time / 1000.0;
    vec3 acc = acceleration * 0.5 * timeScale * timeScale;
    vec3 vel = velocity * (timeScale);
    gl_Position = projectionMatrix 
        * modelViewMatrix
        * vec4(acc + vel + position, 1.0);
    gl_PointSize = 10.0;
  }`;

const frag = `
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(0,1.0,0,1.0);
  }`;

function random(a, b) {
  const dif = b - a;
  return (a + (Math.random() * dif));
}

AFRAME.registerShader('particles', {
  schema: {
    time: {type: 'time', is: 'uniform'},
    velocity: {type: 'array', is: 'attribute'},
    acceleration: {type: 'array', is: 'attribute'},
  },

  vertexShader: vert,
  fragmentShader: frag,
});

AFRAME.registerComponent('space-particles', {
  schema: {
  },

  /**
   * Initial creation and setting of the mesh.
   */
  init: function () {
    console.log('space');
    var data = this.data;
    var el = this.el;

    const initialPositions = [];
    const velocities = [];
    const accelerations = [];
    this.geometry = new THREE.BufferGeometry();
    for (let i = 0; i < 100; i++) {
        initialPositions.push(random(-0.5, 0.5))
        initialPositions.push(random(-1, -1))
        initialPositions.push(random(-2, 2))
        velocities.push(random(-0.5,0.5))
        velocities.push(10.0)
        velocities.push(random(-1,1))
        accelerations.push(0);
        accelerations.push(-9.8)
        accelerations.push(0);
    }

    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(initialPositions,3));
    this.geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities,3));
    this.geometry.setAttribute('acceleration', new THREE.Float32BufferAttribute(accelerations,3));

    // Create mesh.
    this.mesh = new AFRAME.THREE.Points(this.geometry, this.material);
    // console.log(this.mesh)
    // Set mesh on entity.
    el.setObject3D('mesh', this.mesh);
  }
});