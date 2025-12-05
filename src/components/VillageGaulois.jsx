import React, { useEffect, useRef, useState } from 'react';

const VillageGaulois = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!window.THREE) {
      // Charger Three.js dynamiquement
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => initializeScene();
      document.head.appendChild(script);
      return () => document.head.removeChild(script);
    } else {
      initializeScene();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (sceneRef.current && mountRef.current) {
        mountRef.current.removeChild(sceneRef.current.domElement);
      }
    };
  }, []);

  const getModalContent = (id) => {
    const content = {
      "Nuit de l'info": {
        title: "🏛️ Nuit de l'info",
        description: "Pour sensibiliser aux enjeux du numérique responsable, nous avons créé un quiz éducatif et engageant. Les utilisateurs testent leurs connaissances sur l'inclusion numérique, la durabilité et les bonnes pratiques environnementales. Un système de score avec feedback immédiat (bonne/mauvaise réponse) leur permet d'apprendre tout en s'amusant. Les questions sont chargées dynamiquement depuis un fichier JSON.\n\n Technologies : React State Management, JSON Questions Database, Système de scoring en temps réel",
      },
      Projets: {
        title: "📋 Projets",
        description: "Découvrez nos créations à travers la carte interactive et en 3D de notre village gaulois ! Chaque tente représente un projet unique, accessible en cliquant dessus. Plongez dans notre univers créatif et découvrez comment nous transformons les idées en réalité numérique.\n\n Technologies : Three.js pour la 3D, HTML/CSS/JS pour l'interface, Gestion des événements utilisateur",
      },
      Decathlon: {
        title: "🏃 Decathlon", 
        description: "Un quiz interactif de 10 questions permet aux utilisateurs de découvrir leur profil sportif. En fonction des réponses (objectifs, niveau, préférences d'entraînement), un algorithme génère un programme d'exercices sur mesure avec vidéos YouTube intégrées et durées adaptées. Le système analyse les réponses pour proposer 3 exercices personnalisés parmi une base de données de mouvements.\n\n Technologies : React Hooks (useState/useEffect), JSON Data, Algorithme de scoring personnalisé, React Router",
      },
      "Hidden Snake": {
        title: "🐍 Hidden Snake",
        description: " Le joueur doit glisser-déposer les lettres dans le bon ordre pour former le mot \"GAFAM\". Un système d'animation avec retour des lettres en cas d'erreur et confettis en cas de réussite rend le jeu dynamique et challengeant. Ce défi sensibilise aux problématiques des géants de la tech.\n\n Technologies : HTML5 Drag & Drop API, CSS Keyframe Animations, React useEffect pour les timers, Lucide React Icons",
      },
      Retro: {
        title: " 👾 Retro",
        description: "Pour créer une expérience nostalgique et unique, nous avons habillé l'intégralité du site dans un style rétro gaming inspiré des consoles 8-bit. Chaque bouton, container et élément visuel rappelle l'ère des jeux vidéo classiques tout en restant moderne et fonctionnel. L'utilisation de la police \"Press Start 2P\" et des animations CSS renforce cette immersion vintage.\n\n Technologies : NES.css, Press Start 2P Font, CSS Animations",
      },
    };

    return content[id] || {
      title: id,
      description: "Bienvenue dans le village ! Cliquez sur les différentes tentes pour découvrir plus d'informations.",
    };
  };

  const openModal = (id) => {
    const content = getModalContent(id);
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const initializeScene = () => {
    const THREE = window.THREE;
    
    // Scene
    const scene = new THREE.Scene();

    // --- Ciel bleu simple ---
    const skyGeometry = new THREE.SphereGeometry(250, 64, 64);
    const skyCanvas = document.createElement("canvas");
    skyCanvas.width = 1024;
    skyCanvas.height = 1024;
    const ctx = skyCanvas.getContext("2d");

    // Dégradé bleu simple
    const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(1, "#E0F6FF");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 1024);

    const skyTexture = new THREE.CanvasTexture(skyCanvas);
    const skyMaterial = new THREE.MeshBasicMaterial({
      map: skyTexture,
      side: THREE.BackSide,
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);

    scene.background = new THREE.Color(0x87ceeb);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(3, 1.8, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    sceneRef.current = renderer;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // === FONCTIONS DE CREATION DE TEXTURES ===
    function createStoneTexture() {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");

      // Fond beige clair pour la pierre
      ctx.fillStyle = "#D4C4B0";
      ctx.fillRect(0, 0, 256, 256);

      // Ajouter des "pierres" avec des carrés
      ctx.strokeStyle = "#B8A898";
      ctx.lineWidth = 2;
      for (let i = 0; i < 256; i += 32) {
        for (let j = 0; j < 256; j += 32) {
          ctx.strokeRect(i, j, 32, 32);
          // Variation de couleur plus claire
          ctx.fillStyle = `rgba(180, 160, 140, ${Math.random() * 0.3})`;
          ctx.fillRect(i + 2, j + 2, 28, 28);
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      return texture;
    }

    function createStrawTexture() {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");

      // Fond beige paille
      ctx.fillStyle = "#D4A574";
      ctx.fillRect(0, 0, 256, 256);

      // Ajouter des brins de paille (traits)
      ctx.strokeStyle = "rgba(160, 120, 70, 0.6)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const length = Math.random() * 40 + 20;
        const angle = Math.random() * Math.PI;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      return texture;
    }

    function createWoodTexture() {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");

      // Fond bois marron
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(0, 0, 256, 256);

      // Ajouter des anneaux de bois (cercles concentriques)
      ctx.strokeStyle = "rgba(139, 69, 19, 0.4)";
      ctx.lineWidth = 3;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(128, 128, 20 + i * 15, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Ajouter des traits verticaux pour le grain
      ctx.strokeStyle = "rgba(101, 50, 15, 0.3)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 256; i += 8) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + Math.random() * 4, 256);
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      return texture;
    }

    function createGrassTexture() {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");

      // Fond vert herbe
      ctx.fillStyle = "#2d5016";
      ctx.fillRect(0, 0, 512, 512);

      // Ajouter des brins d'herbe
      ctx.strokeStyle = "rgba(61, 94, 31, 0.6)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 500; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const height = Math.random() * 8 + 4;
        const angle = Math.random() * 0.3 - 0.15;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.sin(angle) * height, y - height);
        ctx.stroke();
      }

      // Ajouter plus de variations de vert
      ctx.fillStyle = "rgba(70, 120, 40, 0.3)";
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 15 + 10;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      return texture;
    }

    function createLabel(text) {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(2, 0.5, 1);
      return sprite;
    }

    // Ground
    const grassTexture = createGrassTexture();
    const sol = new THREE.Mesh(
      new THREE.BoxGeometry(30, 0.5, 20),
      new THREE.MeshPhongMaterial({
        map: grassTexture,
        roughness: 0.9,
      })
    );
    sol.position.y = -0.25;
    scene.add(sol);

    // === HERBES ET FLEURS ===
    function createGrassBlock(x, z) {
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.2, 0.3),
        new THREE.MeshPhongMaterial({
          color: new THREE.Color().setHSL(0.25 + Math.random() * 0.05, 0.7, 0.35),
        })
      );
      block.position.set(x, 0.1, z);
      return block;
    }

    for (let i = 0; i < 200; i++) {
      const x = (Math.random() - 0.5) * 28;
      const z = (Math.random() - 0.5) * 18;
      scene.add(createGrassBlock(x, z));
    }

    // === FLEURS VOXEL ===
    function createPixelFlower(x, z, color) {
      const flower = new THREE.Group();

      const stem = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.4, 0.05),
        new THREE.MeshPhongMaterial({ color: 0x2d5016 })
      );
      stem.position.y = 0.2;
      flower.add(stem);

      const bloom = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.15, 0.15),
        new THREE.MeshPhongMaterial({ color: color })
      );
      bloom.position.y = 0.45;
      bloom.rotation.set(Math.PI / 4, Math.PI / 4, 0);
      flower.add(bloom);

      flower.position.set(x, 0, z);
      return flower;
    }

    const flowerColors = [0xff6b9d, 0xff4757, 0xffa502, 0xffd700];
    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * 26;
      const z = (Math.random() - 0.5) * 16;
      const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      scene.add(createPixelFlower(x, z, color));
    }

    // === ARBRES ===
    function createTree(x, z, scale = 1) {
      const tree = new THREE.Group();

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3 * scale, 0.4 * scale, 3 * scale, 16),
        new THREE.MeshPhongMaterial({ color: 0x4a3520 })
      );
      trunk.position.y = 1.5 * scale;
      tree.add(trunk);

      // Feuillage plus rond (plusieurs sphères pour plus de densité)
      const foliageBottom = new THREE.Mesh(
        new THREE.SphereGeometry(1.3 * scale, 16, 16),
        new THREE.MeshPhongMaterial({ color: 0x2d5016 })
      );
      foliageBottom.position.y = 2.6 * scale;
      tree.add(foliageBottom);

      const foliageMiddle = new THREE.Mesh(
        new THREE.SphereGeometry(1.1 * scale, 16, 16),
        new THREE.MeshPhongMaterial({ color: 0x3a7426 })
      );
      foliageMiddle.position.y = 3.5 * scale;
      foliageMiddle.position.x = 0.3 * scale;
      tree.add(foliageMiddle);

      const foliageTop = new THREE.Mesh(
        new THREE.SphereGeometry(0.9 * scale, 16, 16),
        new THREE.MeshPhongMaterial({ color: 0x2d5016 })
      );
      foliageTop.position.y = 4.2 * scale;
      tree.add(foliageTop);

      tree.position.set(x, 0, z);
      return tree;
    }

    const treePositions = [
      [-12, -8], [-8, -8], [-4, -8], [0, -8], [4, -8], [8, -8], [12, -8],
      [-12, 8], [-8, 8], [-4, 8], [0, 8], [4, 8], [8, 8], [12, 8],
      [-13, -6], [-13, -3], [-13, 0], [-13, 3], [-13, 6],
      [13, -6], [13, -3], [13, 0], [13, 3], [13, 6],
    ];

    treePositions.forEach((pos) => {
      scene.add(createTree(pos[0], pos[1], 0.8 + Math.random() * 0.4));
    });

    // === NUAGES ===
    function createCloud(x, y, z) {
      const cloud = new THREE.Group();
      
      const puffPositions = [
        [0, 0, 0, 1],
        [-0.7, 0, 0, 0.8],
        [0.7, 0, 0, 0.8],
        [0, 0.4, 0, 0.6],
      ];

      const cloudMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
      });

      puffPositions.forEach((pos) => {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(pos[3], 16, 16),
          cloudMaterial
        );
        puff.position.set(pos[0], pos[1], pos[2]);
        cloud.add(puff);
      });

      cloud.position.set(x, y, z);
      cloud.userData.cloudSpeed = 0.005 + Math.random() * 0.01;
      return cloud;
    }

    for (let i = 0; i < 10; i++) {
      scene.add(
        createCloud(
          (Math.random() - 0.5) * 50,
          10 + Math.random() * 6,
          (Math.random() - 0.5) * 50
        )
      );
    }

    // === CLASSE TENTE COMPLETE ===
    class Tente {
      hexToRgb(hex) {
        const r = (hex >> 16) & 255;
        const g = (hex >> 8) & 255;
        const b = hex & 255;
        return `rgb(${r},${g},${b})`;
      }

      constructor(color1, color2, x, y, z, id = "") {
        this.color1 = this.hexToRgb(color1);
        this.color2 = this.hexToRgb(color2);
        this.group = new THREE.Group();
        this.group.position.set(x, 0, z);
        this.group.userData.tenteId = id;

        this.build();

        // Ajouter le label - HAUTEUR AUGMENTÉE
        const label = createLabel(id);
        label.position.y = 3.8;
        this.group.add(label);
      }

      createStripeTexture(width, height, stripeWidth, c1, c2) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        for (let i = 0; i < width; i += stripeWidth) {
          ctx.fillStyle = i % (stripeWidth * 2) === 0 ? c1 : c2;
          ctx.fillRect(i, 0, stripeWidth, height);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        return texture;
      }

      createFabricNormalMap(width, height) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const noise = Math.random() * 30;
          data[i] = 128 + noise;
          data[i + 1] = 128 + noise;
          data[i + 2] = 255;
          data[i + 3] = 255;
        }

        ctx.putImageData(imageData, 0, 0);
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        return texture;
      }

      build() {
        const c1 = this.color1;
        const c2 = this.color2;

        const stripeTextureBase = this.createStripeTexture(256, 256, 32, c1, c2);
        const stripeTextureRoof = this.createStripeTexture(256, 256, 24, c1, c2);
        const stripeTextureBanderoles = this.createStripeTexture(256, 256, 16, c1, c2);
        const fabricNormalMap = this.createFabricNormalMap(256, 256);

        // --- Base Cylindrique ---
        const baseRadius = 1;
        const baseRadiusTop = 1.2;
        const baseHeight = 2;
        const baseGeometry = new THREE.CylinderGeometry(baseRadius, baseRadiusTop, baseHeight, 32);
        const baseMaterial = new THREE.MeshStandardMaterial({
          map: stripeTextureBase,
          normalMap: fabricNormalMap,
          normalScale: new THREE.Vector2(2, 2),
          metalness: 0.0,
          roughness: 0.85,
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = baseHeight / 2;
        base.userData.tenteId = this.group.userData.tenteId;
        this.group.add(base);

        // --- Toit Conique ---
        const roofHeight = 1.3;
        const roofGeometry = new THREE.ConeGeometry(baseRadiusTop * 1.1, roofHeight, 32);
        const roofMaterial = new THREE.MeshStandardMaterial({
          map: stripeTextureRoof,
          normalMap: fabricNormalMap,
          normalScale: new THREE.Vector2(2, 2),
          metalness: 0.0,
          roughness: 0.85,
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = baseHeight + roofHeight / 2;
        roof.userData.tenteId = this.group.userData.tenteId;
        this.group.add(roof);

        // --- Pompom Jaune Métallique ---
        const pompomGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const pompomMaterial = new THREE.MeshStandardMaterial({
          color: 0xffd700,
          metalness: 0.9,
          roughness: 0.2,
        });
        const pompom = new THREE.Mesh(pompomGeometry, pompomMaterial);
        pompom.position.y = baseHeight + roofHeight + 0.1;
        pompom.userData.tenteId = this.group.userData.tenteId;
        this.group.add(pompom);

        // --- Banderoles ---
        const banderoles = new THREE.CylinderGeometry(baseRadiusTop * 1.1, baseRadiusTop * 1.1, 0.2, 32, 1, true);
        const banderolesMaterial = new THREE.MeshStandardMaterial({
          map: stripeTextureBanderoles,
          normalMap: fabricNormalMap,
          normalScale: new THREE.Vector2(2, 2),
          metalness: 0.0,
          roughness: 0.85,
          side: THREE.DoubleSide,
        });
        const banderolesMesh = new THREE.Mesh(banderoles, banderolesMaterial);
        banderolesMesh.position.y = baseHeight - 0.1;
        banderolesMesh.userData.tenteId = this.group.userData.tenteId;
        this.group.add(banderolesMesh);
      }

      add(scene) {
        scene.add(this.group);
      }
    }

    // Créer les tentes avec les bonnes couleurs
    new Tente(0xff0000, 0xffffff, 4.75, 0, 5, "Projets").add(scene);
    new Tente(0xffff00, 0x8b4513, 8.5, 0, 3, "Decathlon").add(scene);
    new Tente(0x0000ff, 0xffffff, 9, 0, -2.5, "Hidden Snake").add(scene);
    new Tente(0xffff00, 0xff0000, 6, 0, -6, "Retro").add(scene);

    // === VILLAGE COMPLET ===
    class VillageModel {
      constructor(x = 0, y = 0, z = 0, id = "") {
        this.group = new THREE.Group();
        this.group.position.set(x, y, z);
        this.group.userData.villageId = id;

        this.clickableGroup = new THREE.Group();
        this.group.add(this.clickableGroup);

        const radius = 6;
        const height = 3;
        const thickness = 0.4;
        const segments = 40;
        const openFraction = 0.1;
        const woodTexture = createWoodTexture();
        const fenceMaterial = new THREE.MeshPhongMaterial({
          map: woodTexture,
          roughness: 0.8,
        });
        const startOpen = 0;
        const endOpen = Math.PI * 2 * openFraction;

        // Palissade autour du village
        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          if (angle >= startOpen && angle <= endOpen) continue;

          const xPos = Math.cos(angle) * radius;
          const zPos = Math.sin(angle) * radius;

          const logGeometry = new THREE.CylinderGeometry(thickness, thickness, height, 8);
          const log = new THREE.Mesh(logGeometry, fenceMaterial);
          log.position.set(xPos, height / 2, zPos);
          log.lookAt(0, height / 2, 0);

          this.clickableGroup.add(log);
        }

        // Maisons du village avec textures détaillées
        const positions = [
          { x: 0, z: 0 },
          { x: 3, z: -2 },
          { x: -3, z: -2 },
        ];

        const stoneTexture = createStoneTexture();
        const strawTexture = createStrawTexture();

        positions.forEach((pos) => {
          // Base de la maison
          const houseGeometry = new THREE.CylinderGeometry(1.6, 1.6, 1, 32);
          const houseMaterial = new THREE.MeshPhongMaterial({
            map: stoneTexture,
            roughness: 0.9,
          });
          const house = new THREE.Mesh(houseGeometry, houseMaterial);
          house.position.set(pos.x, 0.5, pos.z);
          this.clickableGroup.add(house);

          // Toit principal
          const roofGeometry = new THREE.ConeGeometry(2, 1.6, 8);
          const roofMaterial = new THREE.MeshPhongMaterial({
            map: strawTexture,
            roughness: 0.85,
          });
          const roof = new THREE.Mesh(roofGeometry, roofMaterial);
          roof.position.set(pos.x, 1.6, pos.z);
          this.clickableGroup.add(roof);

          // Toit inversé (détail architectural)
          const invertedRoofGeometry = new THREE.ConeGeometry(0.8, 1, 8);
          const invertedRoofMaterial = new THREE.MeshPhongMaterial({
            map: strawTexture,
            roughness: 0.85,
          });
          const invertedRoof = new THREE.Mesh(invertedRoofGeometry, invertedRoofMaterial);
          invertedRoof.rotation.x = Math.PI;
          invertedRoof.position.set(pos.x, 2.6, pos.z);
          this.clickableGroup.add(invertedRoof);
        });

        // Label village
        const label = createLabel(id || "Village");
        label.position.y = 5;
        this.group.add(label);
      }

      add(scene) {
        scene.add(this.group);
      }
    }

    // Créer le village
    const village = new VillageModel(-8, 0, 0, "Nuit de l'info");
    village.add(scene);
    village.group.rotation.y = Math.PI / 12;

    // === CONTRÔLES ===
    let isMousePressed = false;
    let yaw = 0, pitch = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Gestion de la souris pour le mouvement de caméra
    renderer.domElement.addEventListener('mousedown', (event) => {
      isMousePressed = true;
    });

    document.addEventListener('mouseup', () => {
      isMousePressed = false;
    });

    renderer.domElement.addEventListener('mousemove', (event) => {
      if (isMousePressed) {
        yaw -= event.movementX * 0.005;
        pitch -= event.movementY * 0.005;
        pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, pitch));
      }
    });

    // Gestion des clics pour l'interaction
    renderer.domElement.addEventListener('click', (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj && !obj.userData.tenteId && !obj.userData.villageId)
          obj = obj.parent;
        if (obj) {
          openModal(obj.userData.tenteId || obj.userData.villageId);
        }
      }
    });

    // === MOUVEMENT ===
    const moveSpeed = 0.08;
    const keysPressed = {};
    const collisionRadius = 0.5;
    const groundSizeX = 15;
    const groundSizeZ = 10;

    function checkCollisions(newPos) {
      if (
        newPos.x < -groundSizeX + 1 ||
        newPos.x > groundSizeX - 1 ||
        newPos.z < -groundSizeZ + 1 ||
        newPos.z > groundSizeZ - 1
      ) {
        return false;
      }

      if (newPos.y < 1.5) newPos.y = 1.5;
      if (newPos.y > 8) newPos.y = 8;

      // Collision avec les tentes
      const tentesPos = [
        { pos: new THREE.Vector3(6, 1, -6), radius: 1.5 },
        { pos: new THREE.Vector3(9, 1, -2.5), radius: 1.5 },
        { pos: new THREE.Vector3(8.5, 1, 3), radius: 1.5 },
        { pos: new THREE.Vector3(4.75, 1, 5), radius: 1.5 },
      ];

      for (let tente of tentesPos) {
        const dist = newPos.distanceTo(tente.pos);
        if (dist < tente.radius + collisionRadius) {
          return false;
        }
      }

      // Collision avec le village
      const villagePos = new THREE.Vector3(-8, 0, 0);
      const villageDist = newPos.distanceTo(villagePos);
      if (villageDist < 7.5 + collisionRadius) {
        return false;
      }

      return true;
    }

    document.addEventListener('keydown', (e) => {
      keysPressed[e.key.toLowerCase()] = true;
    });

    document.addEventListener('keyup', (e) => {
      keysPressed[e.key.toLowerCase()] = false;
    });

    function updateCameraMovement() {
      if (isModalOpen) return;

      const newPos = camera.position.clone();
      const forward = new THREE.Vector3(Math.cos(yaw), 0, Math.sin(yaw));
      const right = new THREE.Vector3(-forward.z, 0, forward.x);

      if (keysPressed['z'] || keysPressed['arrowup'])
        newPos.addScaledVector(forward, moveSpeed);
      if (keysPressed['s'] || keysPressed['arrowdown'])
        newPos.addScaledVector(forward, -moveSpeed);
      if (keysPressed['q'] || keysPressed['arrowleft'])
        newPos.addScaledVector(right, -moveSpeed);
      if (keysPressed['d'] || keysPressed['arrowright'])
        newPos.addScaledVector(right, moveSpeed);

      if (checkCollisions(newPos)) {
        camera.position.copy(newPos);
      }
    }

    // === ANIMATION ===
    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate);

      updateCameraMovement();

      const dx = Math.cos(yaw) * Math.cos(pitch);
      const dy = Math.sin(pitch);
      const dz = Math.sin(yaw) * Math.cos(pitch);
      camera.lookAt(
        camera.position.x + dx,
        camera.position.y + dy,
        camera.position.z + dz
      );

      // Labels face caméra
      scene.traverse((obj) => {
        if (obj instanceof THREE.Sprite) obj.lookAt(camera.position);
      });

      // Animation des nuages
      scene.children.forEach((child) => {
        if (child.userData.cloudSpeed) {
          child.position.x += child.userData.cloudSpeed;
          if (child.position.x > 30) child.position.x = -30;
        }
      });

      renderer.render(scene, camera);
    }
    
    animate();

    // Gestion du resize
    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px' }}>
      {/* Titre */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '24px',
        textShadow: '3px 3px 0px black',
        fontWeight: 'bold',
        background: 'rgba(61, 40, 23, 0.9)',
        padding: '12px 24px',
        border: '4px solid #ffd700',
        zIndex: 10
      }}>
        🏛️ VILLAGE GAULOIS
      </div>

      {/* Boîte de commandes */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '14px',
        textShadow: '2px 2px 0px black',
        lineHeight: '1.8',
        background: 'rgba(61, 40, 23, 0.9)',
        padding: '12px 16px',
        border: '3px solid #ffd700',
        zIndex: 10
      }}>
        <div>▶ ZQSD / Fleches - Deplacement</div>
        <div>▶ Clic + Drag - Regarder</div>
        <div>▶ Clic - Interagir</div>
      </div>

      {/* Conteneur Three.js */}
      <div
        ref={mountRef}
        style={{ 
          width: '100%', 
          height: '100%',
          border: '4px solid #212529',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      />

      {/* Modal */}
      {isModalOpen && modalContent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="nes-container is-rounded with-title" style={{
            maxWidth: '600px',
            maxHeight: '80vh',
            backgroundColor: 'white',
            position: 'relative',
            color: '#212529',
            overflow: 'auto'
          }}>
            <p className="title" style={{ color: '#212529' }}>{modalContent.title}</p>
            <button
              className="nes-btn is-error"
              style={{ position: 'absolute', top: '10px', right: '10px' }}
              onClick={closeModal}
            >
              X
            </button>
            <div style={{ marginTop: '20px' }}>
              <p style={{ 
                lineHeight: '1.6', 
                marginBottom: '15px', 
                color: '#212529',
                whiteSpace: 'pre-line'
              }}>
                {modalContent.description}
              </p>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button className="nes-btn is-primary" onClick={closeModal}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VillageGaulois;