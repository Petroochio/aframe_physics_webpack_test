// import * as THREE from 'three';
const THREE = AFRAME.THREE;

// Some local constants, maybe make this params of the component
const PARTICLE_COUNT = 40;
const SPAWN_TIME_MAX = 100;

const vert = `
  uniform float time;
  attribute float startTime;
  attribute vec3 velocity;
  attribute vec3 acceleration;

  void main() {
    float timeScale = (time - startTime) / 1000.0;
    vec3 acc = acceleration * 0.5 * timeScale * timeScale;
    vec3 vel = velocity * (timeScale);
    gl_Position = projectionMatrix 
        * modelViewMatrix
        * vec4(acc + vel + position, 1.0);
    gl_PointSize = 5.0;
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
    time: { type: 'time', is: 'uniform' },
    velocity: { type: 'array', is: 'attribute' },
    acceleration: { type: 'array', is: 'attribute' },
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

    // for which particle to spawn
    this.currentParticle = 0;
    this.spawnTimer = 0;

    console.log(new Array(PARTICLE_COUNT * 3).fill(0.0));

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Array(PARTICLE_COUNT * 3).fill(0.0), 3));
    this.geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(new Array(PARTICLE_COUNT * 3).fill(0), 3));
    this.geometry.setAttribute('acceleration', new THREE.Float32BufferAttribute(new Array(PARTICLE_COUNT * 3).fill(0), 3));

    this.geometry.setAttribute('startTime', new THREE.Float32BufferAttribute(new Array(PARTICLE_COUNT).fill(0), 1));

    // Create mesh.
    this.mesh = new AFRAME.THREE.Points(this.geometry, this.material);
    // console.log(this.mesh)
    // Set mesh on entity.
    el.setObject3D('mesh', this.mesh);
  },

  spawnParticle: function(time) {
    const i = this.currentParticle;

    const velocityAttribute = this.geometry.getAttribute('velocity');
    const accelerationAttribute = this.geometry.getAttribute('acceleration');
    const startTimeAttribute = this.geometry.getAttribute('startTime');

    velocityAttribute.array[i * 3] = 0;
    velocityAttribute.array[i * 3 + 1] = 0;
    velocityAttribute.array[i * 3 + 2] = 0;
    velocityAttribute.needsUpdate = true;

    // Could create a vector and normailze it
    accelerationAttribute.array[i * 3] = random(-1,1);
    accelerationAttribute.array[i * 3 + 1] = random(-1,1);
    accelerationAttribute.array[i * 3 + 2] = 0;
    accelerationAttribute.needsUpdate = true;

    startTimeAttribute.array[i] = time;
    startTimeAttribute.needsUpdate = true;
  },

  tick: function(time, dt) {
    this.spawnTimer += dt;
    if (this.spawnTimer >= SPAWN_TIME_MAX) {
      this.spawnTimer = 0;

      this.spawnParticle(time);

      this.currentParticle += 1;
      
      // Reset particle counter
      if (this.currentParticle >= PARTICLE_COUNT) {
        this.currentParticle = 0;
      }
    }
  }
});