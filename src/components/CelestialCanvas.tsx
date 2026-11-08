import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SIGN_MAP } from '../data/zodiacMeta';
import { ZodiacSignId } from '../types/zodiac';

export interface CelestialCanvasProps {
  activeSign?: ZodiacSignId;
  vibeScore?: number;
  mode?: 'background' | 'medallion';
  className?: string;
}

export const CelestialCanvas: React.FC<CelestialCanvasProps> = ({
  activeSign = 'leo',
  vibeScore = 8,
  mode = 'background',
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const accentColorRef = useRef<string>(SIGN_MAP[activeSign]?.accentHex || '#DFC082');
  const secondaryColorRef = useRef<string>(SIGN_MAP[activeSign]?.secondaryHex || '#72DDF7');
  const speedMultiplierRef = useRef<number>(0.6 + (vibeScore / 10) * 0.8);

  useEffect(() => {
    const meta = SIGN_MAP[activeSign] || SIGN_MAP.leo;
    accentColorRef.current = meta.accentHex;
    secondaryColorRef.current = meta.secondaryHex;
    speedMultiplierRef.current = 0.55 + (vibeScore / 10) * 0.85;
  }, [activeSign, vibeScore]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || (mode === 'medallion' ? 320 : window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      mode === 'medallion' ? 42 : 55,
      width / Math.max(1, height),
      0.1,
      1000
    );
    camera.position.z = mode === 'medallion' ? 7.2 : 11.5;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const astrolabeGroup = new THREE.Group();
    scene.add(astrolabeGroup);

    const primaryColor = new THREE.Color(accentColorRef.current);
    const secondaryColor = new THREE.Color(secondaryColorRef.current);

    // Outer Ecliptic Ring
    const outerRingGeo = new THREE.TorusGeometry(2.85, 0.012, 16, 120);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: mode === 'medallion' ? 0.55 : 0.24,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    astrolabeGroup.add(outerRing);

    // Tilted Celestial Equator Ring
    const midRingGeo = new THREE.TorusGeometry(2.25, 0.01, 16, 100);
    const midRingMat = new THREE.MeshBasicMaterial({
      color: secondaryColor,
      transparent: true,
      opacity: mode === 'medallion' ? 0.42 : 0.18,
    });
    const midRing = new THREE.Mesh(midRingGeo, midRingMat);
    midRing.rotation.x = Math.PI / 3.2;
    midRing.rotation.y = Math.PI / 6;
    astrolabeGroup.add(midRing);

    // Inner Meridian Ring
    const innerRingGeo = new THREE.TorusGeometry(1.62, 0.009, 16, 90);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0xdfc082,
      transparent: true,
      opacity: mode === 'medallion' ? 0.48 : 0.2,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.y = Math.PI / 2.4;
    innerRing.rotation.z = Math.PI / 5;
    astrolabeGroup.add(innerRing);

    // Sacred Core Wireframe Polyhedron
    const coreGeo = new THREE.IcosahedronGeometry(mode === 'medallion' ? 0.85 : 0.95, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      wireframe: true,
      transparent: true,
      opacity: mode === 'medallion' ? 0.38 : 0.14,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    astrolabeGroup.add(coreMesh);

    // 12 Zodiac Cusps / Orbital Nodes along the Outer Ecliptic Ring
    const nodesGroup = new THREE.Group();
    const nodeGeo = new THREE.SphereGeometry(0.055, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0xfaf7f0,
      transparent: true,
      opacity: mode === 'medallion' ? 0.85 : 0.45,
    });

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(Math.cos(angle) * 2.85, Math.sin(angle) * 2.85, 0);
      nodesGroup.add(node);
    }
    astrolabeGroup.add(nodesGroup);

    // Starfield Particles
    const starCount = mode === 'medallion' ? 360 : 1200;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const spread = mode === 'medallion' ? 9 : 24;
      starPositions[i] = (Math.random() - 0.5) * spread;
      starPositions[i + 1] = (Math.random() - 0.5) * spread;
      starPositions[i + 2] = (Math.random() - 0.5) * (spread * 0.7);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xf4efe4,
      size: mode === 'medallion' ? 0.035 : 0.04,
      transparent: true,
      opacity: mode === 'medallion' ? 0.65 : 0.42,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    let pointerX = 0;
    let pointerY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerX = nx * 0.35;
      pointerY = ny * 0.25;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || (mode === 'medallion' ? 320 : window.innerHeight);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    let frameId = 0;
    const targetPrimary = new THREE.Color();
    const targetSecondary = new THREE.Color();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const speed = 0.0022 * speedMultiplierRef.current;

      targetPrimary.set(accentColorRef.current);
      targetSecondary.set(secondaryColorRef.current);
      outerRingMat.color.lerp(targetPrimary, 0.04);
      coreMat.color.lerp(targetPrimary, 0.04);
      midRingMat.color.lerp(targetSecondary, 0.04);

      outerRing.rotation.z += speed * 0.9;
      outerRing.rotation.x = Math.sin(Date.now() * 0.0004) * 0.35;
      midRing.rotation.y += speed * 1.3;
      midRing.rotation.x += speed * 0.6;
      innerRing.rotation.z -= speed * 1.5;
      coreMesh.rotation.y -= speed * 1.1;
      coreMesh.rotation.x += speed * 0.7;
      nodesGroup.rotation.z = outerRing.rotation.z;
      nodesGroup.rotation.x = outerRing.rotation.x;

      stars.rotation.y += speed * 0.18;

      astrolabeGroup.rotation.y += (pointerX - astrolabeGroup.rotation.y) * 0.04;
      astrolabeGroup.rotation.x += (pointerY - astrolabeGroup.rotation.x) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      outerRingGeo.dispose();
      outerRingMat.dispose();
      midRingGeo.dispose();
      midRingMat.dispose();
      innerRingGeo.dispose();
      innerRingMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
    };
  }, [mode]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={
        mode === 'background'
          ? `pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`
          : `relative overflow-hidden ${className}`
      }
    />
  );
};
