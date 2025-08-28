// Init AOS
AOS.init({ once: false, duration: 700, easing: 'ease-out-cubic' });

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// THREE.JS
(function(){
  const canvas = document.getElementById('hero-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const light1 = new THREE.DirectionalLight(0x6cf6ff, 0.6);
  light1.position.set(2, 3, 4);
  scene.add(light1);
  const light2 = new THREE.DirectionalLight(0x7a4eff, 0.25);
  light2.position.set(-2, -1, 2);
  scene.add(light2);
  scene.add(new THREE.AmbientLight(0x6677aa, 0.35));


  // Particles
  const pGeo = new THREE.BufferGeometry();
  const pCount = 400;
  const positions = new Float32Array(pCount * 3);
  const speeds = new Float32Array(pCount);
  for (let i = 0; i < pCount; i++){
  const i3 = i * 3;
  positions[i3]     = (Math.random() - 0.5) * 10;  // X
  positions[i3 + 1] = (Math.random() - 0.5) * 6;   // Y
  positions[i3 + 2] = (Math.random() - 0.5) * 7;   // Z
  speeds[i] = 0.0005 + Math.random() * 0.0012;     // Speed
  }

  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
  const pMat = new THREE.PointsMaterial({ size: 0.025, color: 0x9fdfff, transparent:true, opacity:0.65 });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  // Camera
  camera.position.z = 4.8;

  // Animation loop 
  let t = 0;
  function animate(){
    requestAnimationFrame(animate);
    t += 0.006;

    // Subtle per-particle vertical drift
    const pos = pGeo.attributes.position.array;
    const spd = pGeo.attributes.aSpeed.array;
    for (let i = 0; i < pCount; i++){
      const idx = i * 3 + 1; 
      pos[idx] += Math.sin(t * 0.5 + i) * spd[i]; 
      // wrap around vertically so particles stay in view
      if (pos[idx] > 3.5) pos[idx] = -3.5;
      if (pos[idx] < -3.5) pos[idx] = 3.5;
    }
    pGeo.attributes.position.needsUpdate = true;

    // Slow collective rotation for parallax feel
    points.rotation.y -= 0.0008;
    points.rotation.x += 0.00012;

    renderer.render(scene, camera);
  }
  animate();

  // Responsive
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Parallax effect with mouse (keeps working)
  let targetX = 0, targetY = 0;
  window.addEventListener('mousemove', (e)=>{
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    targetX = x * 0.8; targetY = y * 0.6;
  });
  setInterval(()=>{
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (-targetY - camera.position.y) * 0.04;
    camera.lookAt(0,0,0);
  }, 16);
})();

const toggler = document.querySelector('.navbar-toggler');
const icon = document.querySelector('.navbar-toggler-icon');

toggler.addEventListener('click', () => {
    icon.classList.toggle('open');
});
