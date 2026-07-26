import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';

interface FloatingShape {
  mesh: THREE.Mesh;
  speed: number;
  offset: number;
}

@Component({
  selector: 'app-hero-scene',
  templateUrl: './hero-scene.component.html',
  styleUrls: ['./hero-scene.component.css']
})
export class HeroSceneComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasHost', { static: true }) canvasHost!: ElementRef<HTMLDivElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private shapes: FloatingShape[] = [];
  private particles!: THREE.Points;
  private frameId = 0;
  private mouseX = 0;
  private mouseY = 0;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.initScene();
    this.animate();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frameId);
    this.resizeObserver?.disconnect();
    this.shapes.forEach(s => {
      s.mesh.geometry.dispose();
      (s.mesh.material as THREE.Material).dispose();
    });
    this.particles?.geometry.dispose();
    (this.particles?.material as THREE.Material)?.dispose();
    this.renderer?.dispose();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = (event.clientY / window.innerHeight) * 2 - 1;
  }

  private initScene(): void {
    const host = this.canvasHost.nativeElement;
    const width = host.clientWidth;
    const height = host.clientHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 9);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(this.renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    const keyLight = new THREE.PointLight(0x60a5fa, 2.2, 30);
    keyLight.position.set(4, 4, 6);
    this.scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x2dd4bf, 1.8, 30);
    rimLight.position.set(-5, -3, 4);
    this.scene.add(rimLight);

    const geometries = [
      new THREE.IcosahedronGeometry(1.3, 0),
      new THREE.TorusGeometry(1, 0.35, 16, 60),
      new THREE.OctahedronGeometry(1.1, 0),
      new THREE.IcosahedronGeometry(0.7, 1)
    ];
    const colors = [0x2563eb, 0x14b8a6, 0x60a5fa, 0x2dd4bf];
    const positions: [number, number, number][] = [
      [-1.8, 1.2, 0],
      [1.6, -0.8, -1],
      [0.2, 1.8, -1.5],
      [-1.2, -1.6, 0.5]
    ];

    geometries.forEach((geometry, i) => {
      const material = new THREE.MeshStandardMaterial({
        color: colors[i],
        metalness: 0.25,
        roughness: 0.35,
        emissive: colors[i],
        emissiveIntensity: 0.15
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...positions[i]);
      this.scene.add(mesh);
      this.shapes.push({ mesh, speed: 0.2 + i * 0.08, offset: i });
    });

    this.particles = this.createParticleField();
    this.scene.add(this.particles);

    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(host);
  }

  private createParticleField(): THREE.Points {
    const count = 220;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.045,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    });

    return new THREE.Points(geometry, material);
  }

  private onResize(): void {
    const host = this.canvasHost.nativeElement;
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (width === 0 || height === 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate = (): void => {
    this.frameId = requestAnimationFrame(this.animate);

    const t = performance.now() * 0.0006;
    this.shapes.forEach(s => {
      s.mesh.rotation.x = t * s.speed + s.offset;
      s.mesh.rotation.y = t * s.speed * 1.3 + s.offset;
      s.mesh.position.y += Math.sin(t + s.offset) * 0.0015;
    });

    if (this.particles) {
      this.particles.rotation.y = t * 0.05;
      this.particles.rotation.x = t * 0.02;
    }

    this.camera.position.x += (this.mouseX * 1.2 - this.camera.position.x) * 0.02;
    this.camera.position.y += (-this.mouseY * 1.2 - this.camera.position.y) * 0.02;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  };
}
