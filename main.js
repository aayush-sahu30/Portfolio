/* =============================================
   AYUSH GUPTA — Portfolio JavaScript
   ============================================= */

// =============================================
// CURSOR
// =============================================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = (mouseX - 6) + 'px';
  cursor.style.top  = (mouseY - 6) + 'px';
});

(function animateFollower() {
  followerX += (mouseX - followerX) * 0.13;
  followerY += (mouseY - followerY) * 0.13;
  follower.style.left = (followerX - 18) + 'px';
  follower.style.top  = (followerY - 18) + 'px';
  requestAnimationFrame(animateFollower);
})();

// =============================================
// SCROLL PROGRESS BAR
// =============================================
window.addEventListener('scroll', () => {
  const progress = document.getElementById('progress');
  const scrolled = window.scrollY / (document.body.scrollHeight - innerHeight) * 100;
  progress.style.width = scrolled + '%';
});

// =============================================
// REVEAL ON SCROLL
// =============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// =============================================
// SKILL BAR ANIMATION
// =============================================
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach((bar) => {
        const targetWidth = bar.getAttribute('data-w');
        setTimeout(() => { bar.style.width = targetWidth + '%'; }, 200);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skills-bars-grid').forEach((grid) => barObserver.observe(grid));

// =============================================
// MOUSE TRACKING (shared across scenes)
// =============================================
let bgMouseX = 0, bgMouseY = 0;
let robotMouseX = 0, robotMouseY = 0;

document.addEventListener('mousemove', (e) => {
  bgMouseX    =  (e.clientX / innerWidth  - 0.5) * 2;
  bgMouseY    = -(e.clientY / innerHeight - 0.5) * 2;
  robotMouseX =  (e.clientX / innerWidth  - 0.5) * 2;
  robotMouseY = -(e.clientY / innerHeight - 0.5) * 2;
});

// =============================================
// BACKGROUND THREE.JS SCENE
// =============================================
(function initBackground() {
  const bgCanvas = document.getElementById('bg-canvas');
  const bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, antialias: true, alpha: true });
  bgRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  bgRenderer.setSize(innerWidth, innerHeight);

  const bgScene  = new THREE.Scene();
  const bgCamera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 200);
  bgCamera.position.set(0, 0, 6);

  bgScene.add(new THREE.AmbientLight(0xffffff, 0.3));

  const light1 = new THREE.PointLight(0x7c3aed, 2, 25);
  light1.position.set(4, 3, 3);
  bgScene.add(light1);

  const light2 = new THREE.PointLight(0x00d4ff, 1.5, 20);
  light2.position.set(-4, -2, 2);
  bgScene.add(light2);

  // Stars
  const starGeo = new THREE.BufferGeometry();
  const STAR_COUNT = 1800;
  const starPositions = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 40;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  bgScene.add(new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.45 })
  ));

  // Grid
  const grid = new THREE.GridHelper(30, 30, 0x1a1a3e, 0x0d0d20);
  grid.position.y = -5;
  grid.material.opacity = 0.35;
  grid.material.transparent = true;
  bgScene.add(grid);

  const bgClock = new THREE.Clock();

  window.addEventListener('resize', () => {
    bgCamera.aspect = innerWidth / innerHeight;
    bgCamera.updateProjectionMatrix();
    bgRenderer.setSize(innerWidth, innerHeight);
  });

  (function bgLoop() {
    requestAnimationFrame(bgLoop);
    const t = bgClock.getElapsedTime();

    grid.rotation.y = t * 0.02;
    light1.position.x = Math.sin(t * 0.5) * 4;
    light1.position.z = Math.cos(t * 0.5) * 3;

    bgCamera.position.x += (bgMouseX * 0.4 - bgCamera.position.x) * 0.04;
    bgCamera.position.y += (bgMouseY * 0.2 - bgCamera.position.y) * 0.04;
    bgCamera.lookAt(bgScene.position);

    bgRenderer.render(bgScene, bgCamera);
  })();
})();

// =============================================
// ROBOT THREE.JS SCENE
// =============================================
(function initRobot() {
  const robotCanvas = document.getElementById('robot-canvas');
  const robotRenderer = new THREE.WebGLRenderer({ canvas: robotCanvas, antialias: true, alpha: true });
  robotRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const robotWrap = document.getElementById('robot-wrap');
  robotRenderer.setSize(robotWrap.clientWidth, robotWrap.clientHeight);

  const robotScene  = new THREE.Scene();
  const robotCamera = new THREE.PerspectiveCamera(55, robotWrap.clientWidth / robotWrap.clientHeight, 0.1, 100);
  robotCamera.position.set(0, 1, 5);
  robotCamera.lookAt(0, 0.5, 0);

  robotScene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const rLight1 = new THREE.PointLight(0x00d4ff, 4, 15);
  rLight1.position.set(2, 4, 3);
  robotScene.add(rLight1);

  const rLight2 = new THREE.PointLight(0x7c3aed, 3, 15);
  rLight2.position.set(-2, 2, 2);
  robotScene.add(rLight2);

  const rLight3 = new THREE.PointLight(0x10b981, 2, 10);
  rLight3.position.set(0, -2, 3);
  robotScene.add(rLight3);

  // Materials
  const matMetal  = new THREE.MeshStandardMaterial({ color: 0x1a2040, metalness: 0.95, roughness: 0.1 });
  const matGlow   = new THREE.MeshStandardMaterial({ color: 0x00d4ff, emissive: 0x00d4ff, emissiveIntensity: 0.8, metalness: 0.5, roughness: 0.2 });
  const matPurple = new THREE.MeshStandardMaterial({ color: 0x7c3aed, emissive: 0x7c3aed, emissiveIntensity: 0.5, metalness: 0.7, roughness: 0.2 });
  const matDark   = new THREE.MeshStandardMaterial({ color: 0x0a0e1a, metalness: 0.9, roughness: 0.15 });
  const matGreen  = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.6 });

  const robot = new THREE.Group();
  robotScene.add(robot);

  // --- HEAD ---
  const head = new THREE.Group();
  head.add(new THREE.Mesh(new THREE.BoxGeometry(1, 0.85, 0.85), matMetal));

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.28, 0.1), matGlow);
  visor.position.set(0, 0.05, 0.43);
  head.add(visor);

  const visorInner = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.05), matDark);
  visorInner.position.set(0, 0.05, 0.47);
  head.add(visorInner);

  const eyeGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const eye1 = new THREE.Mesh(eyeGeo, matGlow);
  eye1.position.set(-0.18, 0.05, 0.47);
  head.add(eye1);

  const eye2 = new THREE.Mesh(eyeGeo, matGlow);
  eye2.position.set(0.18, 0.05, 0.47);
  head.add(eye2);

  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.35, 8), matMetal);
  antenna.position.set(0, 0.6, 0);
  head.add(antenna);

  const antennaTop = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), matGlow);
  antennaTop.position.set(0, 0.8, 0);
  head.add(antennaTop);

  const earGeo = new THREE.BoxGeometry(0.12, 0.4, 0.5);
  const earL = new THREE.Mesh(earGeo, matDark);
  earL.position.set(-0.56, 0, 0);
  head.add(earL);

  const earR = new THREE.Mesh(earGeo, matDark);
  earR.position.set(0.56, 0, 0);
  head.add(earR);

  const earDotL = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), matPurple);
  earDotL.position.set(-0.62, 0.1, 0);
  head.add(earDotL);

  const earDotR = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), matGreen);
  earDotR.position.set(0.62, 0.1, 0);
  head.add(earDotR);

  head.position.y = 2.2;
  robot.add(head);

  // --- NECK ---
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.3, 12), matDark);
  neck.position.y = 1.75;
  robot.add(neck);

  // --- TORSO ---
  const torso = new THREE.Group();
  torso.add(new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.4, 0.8), matMetal));

  const chestPanel = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.1), matDark);
  chestPanel.position.set(0, 0.1, 0.41);
  torso.add(chestPanel);

  const chestStrip = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 0.05), matGlow);
  chestStrip.position.set(0, 0.22, 0.46);
  torso.add(chestStrip);

  const chestCircle = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.06, 16), matPurple);
  chestCircle.rotation.x = Math.PI / 2;
  chestCircle.position.set(0, -0.05, 0.44);
  torso.add(chestCircle);

  const shoulderGeo = new THREE.BoxGeometry(0.35, 0.25, 0.7);
  const shoulderL = new THREE.Mesh(shoulderGeo, matDark);
  shoulderL.position.set(-0.82, 0.55, 0);
  torso.add(shoulderL);

  const shoulderR = new THREE.Mesh(shoulderGeo, matDark);
  shoulderR.position.set(0.82, 0.55, 0);
  torso.add(shoulderR);

  for (let i = 0; i < 3; i++) {
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.1), matGlow);
    vent.position.set(-0.66, -0.1 + i * 0.15, 0.35);
    torso.add(vent);
  }

  torso.position.y = 0.8;
  robot.add(torso);

  // --- ARMS ---
  function makeArm(side) {
    const arm = new THREE.Group();

    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.16, 0.7, 10), matMetal);
    upper.position.y = -0.35;
    arm.add(upper);

    const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), matDark);
    elbow.position.y = -0.75;
    arm.add(elbow);

    const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.65, 10), matMetal);
    lower.position.y = -1.15;
    arm.add(lower);

    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.22), matDark);
    hand.position.y = -1.58;
    arm.add(hand);

    const finger = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.2, 0.07), matMetal);
    finger.position.set(0, -1.78, 0);
    arm.add(finger);

    const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8), matGlow);
    stripe.position.y = -0.55;
    arm.add(stripe);

    arm.position.set(side * 0.88, 1.25, 0);
    return arm;
  }

  const armL = makeArm(-1);
  const armR = makeArm(1);
  robot.add(armL);
  robot.add(armR);

  // --- WAIST ---
  const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.25, 12), matDark);
  waist.position.y = 0.05;
  robot.add(waist);

  // --- LEGS ---
  function makeLeg(side) {
    const leg = new THREE.Group();

    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.2, 0.75, 10), matMetal);
    thigh.position.y = -0.37;
    leg.add(thigh);

    const knee = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), matDark);
    knee.position.y = -0.8;
    leg.add(knee);

    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.7, 10), matMetal);
    shin.position.y = -1.2;
    leg.add(shin);

    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.18, 0.55), matDark);
    foot.position.set(0.05, -1.65, 0.08);
    leg.add(foot);

    const kneeDot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), matGlow);
    kneeDot.position.y = -0.8;
    leg.add(kneeDot);

    leg.position.set(side * 0.35, -0.1, 0);
    return leg;
  }

  robot.add(makeLeg(-1));
  robot.add(makeLeg(1));
  robot.position.set(0, -0.2, 0);

  // Floating particles
  const particleGeo = new THREE.BufferGeometry();
  const PARTICLE_COUNT = 60;
  const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particlePositions[i * 3]     = (Math.random() - 0.5) * 3;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  robotScene.add(new THREE.Points(
    particleGeo,
    new THREE.PointsMaterial({ color: 0x00d4ff, size: 0.05, transparent: true, opacity: 0.7 })
  ));

  // Ground glow
  const glowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4),
    new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.04 })
  );
  glowPlane.rotation.x = -Math.PI / 2;
  glowPlane.position.y = -1.85;
  robotScene.add(glowPlane);

  const robotClock = new THREE.Clock();

  window.addEventListener('resize', () => {
    robotRenderer.setSize(robotWrap.clientWidth, robotWrap.clientHeight);
    robotCamera.aspect = robotWrap.clientWidth / robotWrap.clientHeight;
    robotCamera.updateProjectionMatrix();
  });

  (function robotLoop() {
    requestAnimationFrame(robotLoop);
    const t = robotClock.getElapsedTime();

    // Idle bob
    robot.position.y = Math.sin(t * 1.2) * 0.06 - 0.2;
    // Slow auto-rotate
    robot.rotation.y = Math.sin(t * 0.4) * 0.5;

    // Head mouse tracking
    head.rotation.y += (robotMouseX * 0.55 - head.rotation.y) * 0.07;
    head.rotation.x += (-robotMouseY * 0.25 - head.rotation.x) * 0.07;

    // Eye blink
    const blinkIntensity = (t % 4) > 3.8 ? 0 : 0.8;
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      emissive: 0x00d4ff,
      emissiveIntensity: blinkIntensity
    });
    eye1.material = eye2.material = eyeMat;

    // Chest pulse
    chestStrip.material = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.5 + Math.sin(t * 2) * 0.4
    });

    // Arm swing
    armL.rotation.x = Math.sin(t * 1.2) * 0.18;
    armR.rotation.x = Math.sin(t * 1.2 + Math.PI) * 0.18;

    rLight1.intensity = 3 + Math.sin(t * 1.5) * 1;

    robotRenderer.render(robotScene, robotCamera);
  })();
})();