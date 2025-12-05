import React, { useState, useEffect, useCallback, useRef } from "react";

// ========================================
// 🎮 CONFIGURATION DU JEU
// ========================================
const GRID_SIZE = 15;
const CELL_SIZE = 40;
const INITIAL_SPEED = 200;
const NUM_APPLES = 3;

// ========================================
// 🏢 LOGOS GAFAM
// ========================================
const GAFAM_LOGOS = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/240px-Google_%22G%22_logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/240px-Apple_logo_black.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Facebook_New_Logo_%282015%29.svg/240px-Facebook_New_Logo_%282015%29.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/240px-Microsoft_logo.svg.png",
];

// ========================================
// 🎪 TYPES DE POWER-UPS ASTÉRIX
// ========================================
const POWERUP_TYPES = {
  BOAR: "boar", // 🐗 Sanglier : +5 longueur
  MENHIR_1: "menhir_1", // 🗿 Menhir 1x1 : inverse les touches 5s
  MENHIR_4: "menhir_4", // 🗿 Menhir 2x2 : inverse les touches 5s
  MENHIR_9: "menhir_9", // 🗿 Menhir 3x3 : inverse les touches 5s
  MENHIR_16: "menhir_16", // 🗿 Menhir 4x4 : inverse les touches 5s
  POTION: "potion", // 🧪 Potion magique : invincibilité + vitesse x1.25 pendant 5s
};

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

// ========================================
// 🐍 COMPOSANT PRINCIPAL
// ========================================
const SnakeGame = () => {
  const centerPos = Math.floor(GRID_SIZE / 2);
  const [snake, setSnake] = useState([{ x: centerPos, y: centerPos }]);
  const [foods, setFoods] = useState([]);
  const [powerups, setPowerups] = useState([]); // Power-ups Astérix
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [nextDirection, setNextDirection] = useState(DIRECTIONS.RIGHT);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // États des effets Astérix
  const [isInvincible, setIsInvincible] = useState(false);
  const [isConfused, setIsConfused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const gameLoopRef = useRef(null);
  const invincibleTimerRef = useRef(null);
  const confusedTimerRef = useRef(null);

  // ========================================
  // 🍎 GÉNÉRATION D'UNE NOURRITURE GAFAM
  // ========================================
  const generateSingleFood = useCallback(
    (currentSnake, existingFoods = [], existingPowerups = []) => {
      let newFood;
      let attempts = 0;

      do {
        newFood = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
          logo: GAFAM_LOGOS[Math.floor(Math.random() * GAFAM_LOGOS.length)],
        };
        attempts++;
      } while (
        attempts < 200 &&
        (currentSnake.some(
          (segment) => segment.x === newFood.x && segment.y === newFood.y
        ) ||
          existingFoods.some(
            (food) => food.x === newFood.x && food.y === newFood.y
          ) ||
          existingPowerups.some((p) => p.x === newFood.x && p.y === newFood.y))
      );

      return newFood;
    },
    []
  );

  // ========================================
  // 🎪 GÉNÉRATION D'UN POWER-UP ASTÉRIX
  // ========================================
  const generatePowerup = useCallback(
    (currentSnake, existingFoods = [], existingPowerups = []) => {
      let newPowerup;
      let attempts = 0;

      // ✅ SÉLECTION ALÉATOIRE AVEC PONDÉRATION
      const rand = Math.random();
      let randomType;

      if (rand < 0.25) {
        randomType = POWERUP_TYPES.BOAR; // 25%
      } else if (rand < 0.4) {
        randomType = POWERUP_TYPES.MENHIR_1; // 15%
      } else if (rand < 0.55) {
        randomType = POWERUP_TYPES.MENHIR_4; // 15%
      } else if (rand < 0.7) {
        randomType = POWERUP_TYPES.MENHIR_9; // 15%
      } else if (rand < 0.85) {
        randomType = POWERUP_TYPES.MENHIR_16; // 15%
      } else {
        randomType = POWERUP_TYPES.POTION; // 15%
      }

      console.log("🎲 Type de power-up sélectionné:", randomType); // Debug

      // Déterminer la taille du menhir
      let size = 1;
      if (randomType === POWERUP_TYPES.MENHIR_4) size = 2;
      else if (randomType === POWERUP_TYPES.MENHIR_9) size = 3;
      else if (randomType === POWERUP_TYPES.MENHIR_16) size = 4;

      do {
        // S'assurer que le menhir reste entièrement sur la map
        const maxX = GRID_SIZE - size;
        const maxY = GRID_SIZE - size;

        newPowerup = {
          x: Math.floor(Math.random() * (maxX + 1)),
          y: Math.floor(Math.random() * (maxY + 1)),
          type: randomType,
          size: size, // Taille du menhir (1, 2, 3 ou 4)
        };

        attempts++;

        // Vérifier qu'aucune case du menhir ne chevauche serpent/nourriture/autres powerups
        let isValid = true;

        for (let dx = 0; dx < size; dx++) {
          for (let dy = 0; dy < size; dy++) {
            const checkX = newPowerup.x + dx;
            const checkY = newPowerup.y + dy;

            if (
              currentSnake.some(
                (segment) => segment.x === checkX && segment.y === checkY
              ) ||
              existingFoods.some(
                (food) => food.x === checkX && food.y === checkY
              ) ||
              existingPowerups.some((p) => {
                // Vérifier collision avec tous les autres powerups
                const pSize = p.size || 1;
                for (let pdx = 0; pdx < pSize; pdx++) {
                  for (let pdy = 0; pdy < pSize; pdy++) {
                    if (p.x + pdx === checkX && p.y + pdy === checkY) {
                      return true;
                    }
                  }
                }
                return false;
              })
            ) {
              isValid = false;
              break;
            }
          }
          if (!isValid) break;
        }

        if (isValid) break;
      } while (attempts < 200);

      return newPowerup;
    },
    []
  );

  // ========================================
  // 🎯 GÉNÉRATION DE TOUTES LES NOURRITURES
  // ========================================
  const generateAllFoods = useCallback(
    (currentSnake) => {
      const newFoods = [];
      for (let i = 0; i < NUM_APPLES; i++) {
        newFoods.push(generateSingleFood(currentSnake, newFoods, []));
      }
      return newFoods;
    },
    [generateSingleFood]
  );

  // ========================================
  // 🎪 SPAWN GARANTI DE POWER-UPS TOUTES LES 5 SECONDES
  // ========================================
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    console.log("🎪 Timer de power-ups activé"); // Debug

    const spawnInterval = setInterval(() => {
      console.log("🎲 Tentative de spawn de power-up..."); // Debug

      setPowerups((prev) => {
        console.log("📊 Power-ups actuels:", prev.length); // Debug

        // ✅ PAS DE LIMITE ! Spawn toujours
        const newPowerup = generatePowerup(snake, foods, prev);
        console.log(
          "✅ Nouveau power-up créé:",
          newPowerup.type,
          "à",
          newPowerup.x,
          newPowerup.y
        ); // Debug
        return [...prev, newPowerup];
      });
    }, 5000); // Toutes les 5 secondes exactement

    return () => {
      console.log("🛑 Timer de power-ups arrêté"); // Debug
      clearInterval(spawnInterval);
    };
  }, [gameStarted, gameOver, isPaused]);

  // ========================================
  // 🎯 INITIALISATION DES NOURRITURES
  // ========================================
  useEffect(() => {
    if (foods.length === 0) {
      setFoods(generateAllFoods(snake));
    }
  }, []);

  // ========================================
  // 🎪 SPAWN INITIAL D'UN POWER-UP AU DÉMARRAGE
  // ========================================
  useEffect(() => {
    if (gameStarted && powerups.length === 0) {
      // Spawn immédiat du premier power-up quand le jeu démarre
      const firstPowerup = generatePowerup(snake, foods, []);
      setPowerups([firstPowerup]);
    }
  }, [gameStarted]);

  // ========================================
  // 🎯 VÉRIFICATION DES COLLISIONS
  // ========================================
  const checkCollision = useCallback(
    (head, snakeBody) => {
      // Murs
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        return true;
      }
      // Corps (sauf si invincible)
      if (!isInvincible) {
        return snakeBody.some(
          (segment) => segment.x === head.x && segment.y === head.y
        );
      }
      return false;
    },
    [isInvincible]
  );

  // ========================================
  // 🧪 ACTIVATION DE LA POTION MAGIQUE
  // ========================================
  const activatePotion = useCallback(() => {
    setIsInvincible(true);
    setSpeedMultiplier(1.25);

    if (invincibleTimerRef.current) {
      clearTimeout(invincibleTimerRef.current);
    }

    invincibleTimerRef.current = setTimeout(() => {
      setIsInvincible(false);
      setSpeedMultiplier(1);
    }, 5000);
  }, []);

  // ========================================
  // 🗿 ACTIVATION DU MENHIR (CONFUSION)
  // ========================================
  const activateMenhir = useCallback(() => {
    setIsConfused(true);

    if (confusedTimerRef.current) {
      clearTimeout(confusedTimerRef.current);
    }

    confusedTimerRef.current = setTimeout(() => {
      setIsConfused(false);
    }, 5000);
  }, []);

  // ========================================
  // 🎮 LOGIQUE PRINCIPALE DU JEU
  // ========================================
  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const newHead = {
        x: prevSnake[0].x + nextDirection.x,
        y: prevSnake[0].y + nextDirection.y,
      };

      if (checkCollision(newHead, prevSnake.slice(1))) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // ========================================
      // 🍎 VÉRIFIER SI NOURRITURE GAFAM MANGÉE
      // ========================================
      const eatenFoodIndex = foods.findIndex(
        (food) => food.x === newHead.x && food.y === newHead.y
      );

      if (eatenFoodIndex !== -1) {
        setScore((prev) => prev + 10);
        setFoods((prevFoods) => {
          const newFoods = [...prevFoods];
          newFoods[eatenFoodIndex] = generateSingleFood(
            newSnake,
            newFoods,
            powerups
          );
          return newFoods;
        });
      } else {
        newSnake.pop();
      }

      // ========================================
      // 🎪 VÉRIFIER SI POWER-UP RAMASSÉ
      // ========================================
      let hitPowerupIndex = -1;

      // Vérifier collision avec tous les power-ups (en tenant compte de leur taille)
      for (let i = 0; i < powerups.length; i++) {
        const p = powerups[i];
        const pSize = p.size || 1;

        // Vérifier si la tête du serpent touche n'importe quelle case du powerup
        for (let dx = 0; dx < pSize; dx++) {
          for (let dy = 0; dy < pSize; dy++) {
            if (newHead.x === p.x + dx && newHead.y === p.y + dy) {
              hitPowerupIndex = i;
              break;
            }
          }
          if (hitPowerupIndex !== -1) break;
        }
        if (hitPowerupIndex !== -1) break;
      }

      if (hitPowerupIndex !== -1) {
        const powerup = powerups[hitPowerupIndex];

        // Vérifier si c'est un menhir
        const isMenhir =
          powerup.type === POWERUP_TYPES.MENHIR_1 ||
          powerup.type === POWERUP_TYPES.MENHIR_4 ||
          powerup.type === POWERUP_TYPES.MENHIR_9 ||
          powerup.type === POWERUP_TYPES.MENHIR_16;

        if (isMenhir) {
          // 🗿 Menhir : confusion (inverse les touches)
          if (isInvincible) {
            // ✅ Avec potion : détruire UNIQUEMENT CE menhir sans effet
            setScore((prev) => prev + 20);
          } else {
            // Sans potion : activer confusion
            activateMenhir();
          }
          // Retirer UNIQUEMENT le menhir touché (index spécifique)
          setPowerups((prev) =>
            prev.filter((_, idx) => idx !== hitPowerupIndex)
          );
        } else {
          // Autres power-ups
          switch (powerup.type) {
            case POWERUP_TYPES.BOAR:
              // 🐗 Sanglier : ajoute 5 segments
              setScore((prev) => prev + 50);
              for (let i = 0; i < 5; i++) {
                newSnake.push(newSnake[newSnake.length - 1]);
              }
              setPowerups((prev) =>
                prev.filter((_, idx) => idx !== hitPowerupIndex)
              );
              break;

            case POWERUP_TYPES.POTION:
              // 🧪 Potion : invincibilité + vitesse
              activatePotion();
              setScore((prev) => prev + 30);
              setPowerups((prev) =>
                prev.filter((_, idx) => idx !== hitPowerupIndex)
              );
              break;
          }
        }
      }

      return newSnake;
    });

    setDirection(nextDirection);
  }, [
    nextDirection,
    direction,
    foods,
    powerups,
    gameOver,
    isPaused,
    checkCollision,
    generateSingleFood,
    isInvincible,
    activateMenhir,
    activatePotion,
  ]);

  // ========================================
  // ⌨️ GESTION DES TOUCHES (AVEC CONFUSION)
  // ========================================
  const handleKeyPress = useCallback(
    (e) => {
      if (gameOver) return;

      if (!gameStarted) {
        setGameStarted(true);
        return;
      }

      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
        return;
      }

      let keyDirection = null;
      switch (e.key) {
        case "ArrowUp":
        case "z":
        case "Z":
          keyDirection = DIRECTIONS.UP;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          keyDirection = DIRECTIONS.DOWN;
          break;
        case "ArrowLeft":
        case "q":
        case "Q":
          keyDirection = DIRECTIONS.LEFT;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          keyDirection = DIRECTIONS.RIGHT;
          break;
        default:
          return;
      }

      // 🗿 SI CONFUS : INVERSER LES DIRECTIONS
      if (isConfused && keyDirection) {
        if (keyDirection === DIRECTIONS.UP) keyDirection = DIRECTIONS.DOWN;
        else if (keyDirection === DIRECTIONS.DOWN) keyDirection = DIRECTIONS.UP;
        else if (keyDirection === DIRECTIONS.LEFT)
          keyDirection = DIRECTIONS.RIGHT;
        else if (keyDirection === DIRECTIONS.RIGHT)
          keyDirection = DIRECTIONS.LEFT;
      }

      // Vérifier que ce n'est pas un demi-tour
      if (keyDirection) {
        const isOpposite =
          (keyDirection.x === -direction.x && keyDirection.x !== 0) ||
          (keyDirection.y === -direction.y && keyDirection.y !== 0);

        if (!isOpposite) {
          e.preventDefault();
          setNextDirection(keyDirection);
        }
      }
    },
    [direction, gameOver, gameStarted, isConfused]
  );

  // ========================================
  // 🔄 BOUCLE DE JEU
  // ========================================
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      return;
    }

    const baseSpeed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 5);
    const speed = baseSpeed / speedMultiplier;

    gameLoopRef.current = setInterval(moveSnake, speed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, isPaused, moveSnake, score, speedMultiplier]);

  // ========================================
  // ⌨️ ÉCOUTEUR D'ÉVÉNEMENTS CLAVIER
  // ========================================
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // ========================================
  // 🧹 NETTOYAGE DES TIMERS
  // ========================================
  useEffect(() => {
    return () => {
      if (invincibleTimerRef.current) clearTimeout(invincibleTimerRef.current);
      if (confusedTimerRef.current) clearTimeout(confusedTimerRef.current);
    };
  }, []);

  // ========================================
  // 🔄 REDÉMARRAGE DU JEU
  // ========================================
  const resetGame = () => {
    const centerPos = Math.floor(GRID_SIZE / 2);
    const initialSnake = [{ x: centerPos, y: centerPos }];
    setSnake(initialSnake);
    setFoods(generateAllFoods(initialSnake));
    setPowerups([]);
    setDirection(DIRECTIONS.RIGHT);
    setNextDirection(DIRECTIONS.RIGHT);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setIsPaused(false);
    setIsInvincible(false);
    setIsConfused(false);
    setSpeedMultiplier(1);

    if (invincibleTimerRef.current) clearTimeout(invincibleTimerRef.current);
    if (confusedTimerRef.current) clearTimeout(confusedTimerRef.current);
  };

  // ========================================
  // 🎨 RENDU DU COMPOSANT
  // ========================================
  return (
    <div style={styles.container}>
      <div style={styles.gameWrapper}>
        {/* 📖 LÉGENDE DES POWER-UPS */}
        <div
          className="nes-container is-rounded"
          style={{ padding: "15px", marginBottom: "15px" }}
        >
          <h3
            style={{
              margin: "0 0 10px 0",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            ⚔️ Power-ups Astérix & Obélix
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              gap: "10px",
              fontSize: "11px",
            }}
          >
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: "24px", marginBottom: "5px" }}>🍖</div>
              <strong>Sanglier</strong>
              <div
                style={{ fontSize: "10px", marginTop: "3px", color: "#666" }}
              >
                +5 segments
                <br />
                +50 points
              </div>
            </div>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: "24px", marginBottom: "5px" }}>🗿</div>
              <strong>Menhir</strong>
              <div
                style={{ fontSize: "10px", marginTop: "3px", color: "#666" }}
              >
                Inverse touches 5s
                <br />
                Tailles: 1x1, 2x2, 3x3, 4x4
              </div>
            </div>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ fontSize: "24px", marginBottom: "5px" }}>🧪</div>
              <strong>Potion</strong>
              <div
                style={{ fontSize: "10px", marginTop: "3px", color: "#666" }}
              >
                Invincibilité
                <br />+ vitesse 5s
              </div>
            </div>
          </div>
        </div>

        {/* Score avec effets actifs */}
        <div style={styles.scoreContainer}>
          <div
            className="nes-container is-dark"
            style={{ padding: "10px", textAlign: "center" }}
          >
            <p style={{ margin: 0, fontSize: "14px" }}>SCORE</p>
            <p
              style={{
                margin: "5px 0 0 0",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#92cc41",
              }}
            >
              {score}
            </p>
            <p style={{ margin: "5px 0 0 0", fontSize: "11px", opacity: 0.7 }}>
              🏢 × {NUM_APPLES} GAFAM
            </p>
            {/* Indicateurs d'effets actifs */}
            {isInvincible && (
              <p
                style={{
                  margin: "5px 0 0 0",
                  fontSize: "11px",
                  color: "#FFD700",
                }}
              >
                🧪 POTION MAGIQUE !
              </p>
            )}
            {isConfused && (
              <p
                style={{
                  margin: "5px 0 0 0",
                  fontSize: "11px",
                  color: "#FF6B6B",
                }}
              >
                🗿 CONFUS !
              </p>
            )}
          </div>
        </div>

        {/* Grille de jeu */}
        <div style={styles.gameBoard}>
          {/* Messages overlay */}
          {!gameStarted && !gameOver && (
            <div style={styles.overlay}>
              <div
                className="nes-container is-rounded is-dark"
                style={styles.message}
              >
                <p style={{ margin: "0 0 10px 0" }}>🎮 Par Toutatis !</p>
                <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
                  ⬆️⬇️⬅️➡️ ou ZQSD
                </p>
                <p
                  style={{
                    margin: "10px 0 5px 0",
                    fontSize: "10px",
                    opacity: 0.8,
                  }}
                >
                  🐗 Sanglier: +5 longueur
                </p>
                <p
                  style={{
                    margin: "0 0 5px 0",
                    fontSize: "10px",
                    opacity: 0.8,
                  }}
                >
                  🗿 Menhir: Confusion 5s
                </p>
                <p
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "10px",
                    opacity: 0.8,
                  }}
                >
                  🧪 Potion: Invincibilité 5s
                </p>
                <p style={{ margin: 0, fontSize: "11px", opacity: 0.7 }}>
                  Appuie sur n'importe quelle touche
                </p>
              </div>
            </div>
          )}

          {gameOver && (
            <div style={styles.overlay}>
              <div
                className="nes-container is-rounded is-dark"
                style={styles.message}
              >
                <p style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
                  💀 PAR BÉLÉNOS !
                </p>
                <p
                  style={{
                    margin: "0 0 15px 0",
                    color: "#92cc41",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {score}
                </p>
                <button
                  className="nes-btn is-success"
                  onClick={resetGame}
                  style={{ fontSize: "12px" }}
                >
                  🔄 Rejouer
                </button>
              </div>
            </div>
          )}

          {isPaused && !gameOver && (
            <div style={styles.overlay}>
              <div
                className="nes-container is-rounded is-dark"
                style={styles.message}
              >
                <p style={{ margin: 0 }}>⏸️ PAUSE</p>
                <p
                  style={{
                    margin: "10px 0 0 0",
                    fontSize: "11px",
                    opacity: 0.7,
                  }}
                >
                  ESPACE pour continuer
                </p>
              </div>
            </div>
          )}

          {/* SVG Grid */}
          <svg
            width={GRID_SIZE * CELL_SIZE}
            height={GRID_SIZE * CELL_SIZE}
            style={{
              ...styles.grid,
              filter: isConfused ? "hue-rotate(180deg) saturate(1.5)" : "none",
              transition: "filter 0.3s",
            }}
          >
            {/* Fond damier thème gaulois */}
            {Array.from({ length: GRID_SIZE }).map((_, row) =>
              Array.from({ length: GRID_SIZE }).map((_, col) => (
                <rect
                  key={`${row}-${col}`}
                  x={col * CELL_SIZE}
                  y={row * CELL_SIZE}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
                  fill={(row + col) % 2 === 0 ? "#6B8E23" : "#556B2F"}
                />
              ))
            )}

            {/* Motifs gaulois (herbes) */}
            {Array.from({ length: Math.floor(GRID_SIZE / 3) }).map((_, i) => {
              const x = (i * 3 + 1) * CELL_SIZE + CELL_SIZE / 2;
              const y = ((i * 2) % GRID_SIZE) * CELL_SIZE + CELL_SIZE / 2;
              return (
                <g key={`grass-${i}`}>
                  <line
                    x1={x}
                    y1={y}
                    x2={x - 3}
                    y2={y - 5}
                    stroke="#4CAF50"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                  <line
                    x1={x}
                    y1={y}
                    x2={x}
                    y2={y - 6}
                    stroke="#4CAF50"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                  <line
                    x1={x}
                    y1={y}
                    x2={x + 3}
                    y2={y - 5}
                    stroke="#4CAF50"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                </g>
              );
            })}

            {/* Logos GAFAM */}
            {foods.map((food, index) => (
              <g key={`food-${index}`}>
                <rect
                  x={food.x * CELL_SIZE + 2}
                  y={food.y * CELL_SIZE + 2}
                  width={CELL_SIZE - 4}
                  height={CELL_SIZE - 4}
                  fill="white"
                  rx="4"
                  stroke="#333"
                  strokeWidth="1"
                />
                <image
                  href={food.logo}
                  x={food.x * CELL_SIZE + 4}
                  y={food.y * CELL_SIZE + 4}
                  width={CELL_SIZE - 8}
                  height={CELL_SIZE - 8}
                  preserveAspectRatio="xMidYMid meet"
                />
              </g>
            ))}

            {/* Power-ups Astérix avec vraies images */}
            {powerups.map((powerup, index) => {
              const size = powerup.size || 1;
              const isMenhir =
                powerup.type === POWERUP_TYPES.MENHIR_1 ||
                powerup.type === POWERUP_TYPES.MENHIR_4 ||
                powerup.type === POWERUP_TYPES.MENHIR_9 ||
                powerup.type === POWERUP_TYPES.MENHIR_16;

              return (
                <g key={`powerup-${index}`}>
                  {powerup.type === POWERUP_TYPES.BOAR && (
                    <>
                      {/* 🐗 Sanglier d'Astérix */}
                      <rect
                        x={powerup.x * CELL_SIZE + 2}
                        y={powerup.y * CELL_SIZE + 2}
                        width={CELL_SIZE - 4}
                        height={CELL_SIZE - 4}
                        fill="#8B4513"
                        rx="4"
                        stroke="#5D2E0F"
                        strokeWidth="2"
                      />
                      {/* Emoji sanglier rôti */}
                      <text
                        x={powerup.x * CELL_SIZE + CELL_SIZE / 2}
                        y={powerup.y * CELL_SIZE + CELL_SIZE / 2 + 8}
                        textAnchor="middle"
                        fontSize="22"
                        fill="#FFF"
                      >
                        🍖
                      </text>
                    </>
                  )}
                  {isMenhir && (
                    <>
                      {/* 🗿 Menhir style Obélix - Forme allongée avec pointe */}
                      <g>
                        {/* Corps du menhir (trapèze allongé) */}
                        <defs>
                          <linearGradient
                            id={`menhirGrad${index}`}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop
                              offset="0%"
                              style={{ stopColor: "#5D6D7E", stopOpacity: 1 }}
                            />
                            <stop
                              offset="50%"
                              style={{ stopColor: "#95A5A6", stopOpacity: 1 }}
                            />
                            <stop
                              offset="100%"
                              style={{ stopColor: "#5D6D7E", stopOpacity: 1 }}
                            />
                          </linearGradient>
                        </defs>

                        {/* Forme du menhir avec perspective */}
                        <path
                          d={`
                            M ${
                              powerup.x * CELL_SIZE + size * CELL_SIZE * 0.3
                            } ${powerup.y * CELL_SIZE + size * CELL_SIZE * 0.95}
                            L ${
                              powerup.x * CELL_SIZE + size * CELL_SIZE * 0.2
                            } ${powerup.y * CELL_SIZE + size * CELL_SIZE * 0.6}
                            L ${
                              powerup.x * CELL_SIZE + size * CELL_SIZE * 0.35
                            } ${powerup.y * CELL_SIZE + size * CELL_SIZE * 0.2}
                            L ${
                              powerup.x * CELL_SIZE + size * CELL_SIZE * 0.5
                            } ${powerup.y * CELL_SIZE + size * CELL_SIZE * 0.05}
                            L ${
                              powerup.x * CELL_SIZE + size * CELL_SIZE * 0.65
                            } ${powerup.y * CELL_SIZE + size * CELL_SIZE * 0.2}
                            L ${
                              powerup.x * CELL_SIZE + size * CELL_SIZE * 0.8
                            } ${powerup.y * CELL_SIZE + size * CELL_SIZE * 0.6}
                            L ${
                              powerup.x * CELL_SIZE + size * CELL_SIZE * 0.7
                            } ${powerup.y * CELL_SIZE + size * CELL_SIZE * 0.95}
                            Z
                          `}
                          fill={`url(#menhirGrad${index})`}
                          stroke="#34495E"
                          strokeWidth="2"
                        />

                        {/* Fissures et détails */}
                        <line
                          x1={powerup.x * CELL_SIZE + size * CELL_SIZE * 0.4}
                          y1={powerup.y * CELL_SIZE + size * CELL_SIZE * 0.3}
                          x2={powerup.x * CELL_SIZE + size * CELL_SIZE * 0.35}
                          y2={powerup.y * CELL_SIZE + size * CELL_SIZE * 0.5}
                          stroke="#2C3E50"
                          strokeWidth="1.5"
                          opacity="0.6"
                        />
                        <line
                          x1={powerup.x * CELL_SIZE + size * CELL_SIZE * 0.6}
                          y1={powerup.y * CELL_SIZE + size * CELL_SIZE * 0.4}
                          x2={powerup.x * CELL_SIZE + size * CELL_SIZE * 0.65}
                          y2={powerup.y * CELL_SIZE + size * CELL_SIZE * 0.7}
                          stroke="#2C3E50"
                          strokeWidth="1.5"
                          opacity="0.6"
                        />

                        {/* Ombrage pour relief */}
                        <ellipse
                          cx={powerup.x * CELL_SIZE + size * CELL_SIZE * 0.5}
                          cy={powerup.y * CELL_SIZE + size * CELL_SIZE * 0.98}
                          rx={size * CELL_SIZE * 0.25}
                          ry={size * CELL_SIZE * 0.05}
                          fill="#000"
                          opacity="0.3"
                        />

                        {/* Taille indicateur */}
                        {size > 1 && (
                          <text
                            x={powerup.x * CELL_SIZE + size * CELL_SIZE * 0.5}
                            y={powerup.y * CELL_SIZE + size * CELL_SIZE * 0.5}
                            textAnchor="middle"
                            fontSize={size * 10}
                            fill="#FFF"
                            fontWeight="bold"
                            stroke="#000"
                            strokeWidth="1"
                          >
                            {size}x{size}
                          </text>
                        )}
                      </g>
                    </>
                  )}
                  {powerup.type === POWERUP_TYPES.POTION && (
                    <>
                      {/* 🧪 Potion magique */}
                      <rect
                        x={powerup.x * CELL_SIZE + 2}
                        y={powerup.y * CELL_SIZE + 2}
                        width={CELL_SIZE - 4}
                        height={CELL_SIZE - 4}
                        fill="#9B59B6"
                        rx="4"
                        stroke="#8E44AD"
                        strokeWidth="2"
                      />
                      {/* Fiole avec liquide doré */}
                      <ellipse
                        cx={powerup.x * CELL_SIZE + CELL_SIZE / 2}
                        cy={powerup.y * CELL_SIZE + CELL_SIZE / 2 + 3}
                        rx="8"
                        ry="10"
                        fill="#FFD700"
                      />
                      <rect
                        x={powerup.x * CELL_SIZE + CELL_SIZE / 2 - 3}
                        y={powerup.y * CELL_SIZE + 6}
                        width="6"
                        height="6"
                        fill="#8E44AD"
                        rx="1"
                      />
                      {/* Bouchon */}
                      <rect
                        x={powerup.x * CELL_SIZE + CELL_SIZE / 2 - 2}
                        y={powerup.y * CELL_SIZE + 4}
                        width="4"
                        height="3"
                        fill="#654321"
                      />
                      {/* Étoiles magiques */}
                      <text
                        x={powerup.x * CELL_SIZE + 5}
                        y={powerup.y * CELL_SIZE + 8}
                        fontSize="8"
                      >
                        ✨
                      </text>
                      <text
                        x={powerup.x * CELL_SIZE + CELL_SIZE - 10}
                        y={powerup.y * CELL_SIZE + CELL_SIZE - 5}
                        fontSize="8"
                      >
                        ✨
                      </text>
                    </>
                  )}
                </g>
              );
            })}

            {/* Serpent gaulois avec motifs tribaux */}
            {snake.map((segment, index) => (
              <g key={index}>
                <rect
                  x={segment.x * CELL_SIZE + 3}
                  y={segment.y * CELL_SIZE + 3}
                  width={CELL_SIZE - 6}
                  height={CELL_SIZE - 6}
                  fill={
                    isInvincible
                      ? "#FFD700"
                      : index === 0
                      ? "#D2691E"
                      : "#8B4513"
                  }
                  stroke={isInvincible ? "#FFA500" : "#654321"}
                  strokeWidth="2"
                  rx="3"
                />
                {/* Motif tribal gaulois sur le corps */}
                {index > 0 && index % 3 === 0 && (
                  <circle
                    cx={segment.x * CELL_SIZE + CELL_SIZE / 2}
                    cy={segment.y * CELL_SIZE + CELL_SIZE / 2}
                    r="3"
                    fill="#F4A460"
                    opacity="0.6"
                  />
                )}
                {/* Casque gaulois sur la tête */}
                {index === 0 && (
                  <>
                    {/* Casque ailé */}
                    <ellipse
                      cx={segment.x * CELL_SIZE + CELL_SIZE / 2}
                      cy={segment.y * CELL_SIZE + 8}
                      rx="8"
                      ry="6"
                      fill="#FFD700"
                      stroke="#DAA520"
                      strokeWidth="1"
                    />
                    {/* Ailes du casque */}
                    <path
                      d={`M ${segment.x * CELL_SIZE + 6} ${
                        segment.y * CELL_SIZE + 8
                      } 
                          Q ${segment.x * CELL_SIZE + 2} ${
                        segment.y * CELL_SIZE + 6
                      } 
                          ${segment.x * CELL_SIZE + 4} ${
                        segment.y * CELL_SIZE + 10
                      }`}
                      fill="#FFD700"
                      stroke="#DAA520"
                      strokeWidth="1"
                    />
                    <path
                      d={`M ${segment.x * CELL_SIZE + CELL_SIZE - 6} ${
                        segment.y * CELL_SIZE + 8
                      } 
                          Q ${segment.x * CELL_SIZE + CELL_SIZE - 2} ${
                        segment.y * CELL_SIZE + 6
                      } 
                          ${segment.x * CELL_SIZE + CELL_SIZE - 4} ${
                        segment.y * CELL_SIZE + 10
                      }`}
                      fill="#FFD700"
                      stroke="#DAA520"
                      strokeWidth="1"
                    />
                    {/* Yeux */}
                    <rect
                      x={segment.x * CELL_SIZE + 8}
                      y={segment.y * CELL_SIZE + 12}
                      width={4}
                      height={4}
                      fill={isConfused ? "#FF0000" : "#000"}
                      rx="1"
                    />
                    <rect
                      x={segment.x * CELL_SIZE + 18}
                      y={segment.y * CELL_SIZE + 12}
                      width={4}
                      height={4}
                      fill={isConfused ? "#FF0000" : "#000"}
                      rx="1"
                    />
                    {/* Moustache gauloise */}
                    <path
                      d={`M ${segment.x * CELL_SIZE + 8} ${
                        segment.y * CELL_SIZE + 20
                      }
                          Q ${segment.x * CELL_SIZE + 5} ${
                        segment.y * CELL_SIZE + 18
                      }
                          ${segment.x * CELL_SIZE + 6} ${
                        segment.y * CELL_SIZE + 22
                      }`}
                      stroke="#654321"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d={`M ${segment.x * CELL_SIZE + CELL_SIZE - 8} ${
                        segment.y * CELL_SIZE + 20
                      }
                          Q ${segment.x * CELL_SIZE + CELL_SIZE - 5} ${
                        segment.y * CELL_SIZE + 18
                      }
                          ${segment.x * CELL_SIZE + CELL_SIZE - 6} ${
                        segment.y * CELL_SIZE + 22
                      }`}
                      stroke="#654321"
                      strokeWidth="2"
                      fill="none"
                    />
                    {/* Étoiles de confusion */}
                    {isConfused && (
                      <>
                        <text
                          x={segment.x * CELL_SIZE + 2}
                          y={segment.y * CELL_SIZE + 2}
                          fontSize="10"
                        >
                          ⭐
                        </text>
                        <text
                          x={segment.x * CELL_SIZE + CELL_SIZE - 8}
                          y={segment.y * CELL_SIZE + 2}
                          fontSize="10"
                        >
                          ⭐
                        </text>
                      </>
                    )}
                  </>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Instructions */}
        <div style={styles.instructions}>
          <div
            className="nes-container is-rounded"
            style={{ padding: "8px", fontSize: "11px", textAlign: "center" }}
          >
            <span>⬆️⬇️⬅️➡️ ZQSD = Diriger</span>
            <span style={{ margin: "0 10px" }}>•</span>
            <span>ESPACE = Pause</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// 🎨 STYLES
// ========================================
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  gameWrapper: {
    display: "inline-block",
  },
  scoreContainer: {
    marginBottom: "15px",
  },
  gameBoard: {
    position: "relative",
    borderRadius: "4px",
    overflow: "hidden",
    boxShadow: "0 4px 0 #000, 0 8px 0 #333",
    border: "4px solid #000",
  },
  grid: {
    display: "block",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(15, 56, 15, 0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  message: {
    padding: "20px",
    textAlign: "center",
    color: "#9bbc0f",
  },
  instructions: {
    marginTop: "15px",
  },
};

export default SnakeGame;
