import React, { useState, useEffect, useCallback, useRef } from "react";

// ========================================
// 🎮 CONFIGURATION DU JEU
// ========================================
const GRID_SIZE = 15;
const CELL_SIZE = 30; // Taille des cellules
const INITIAL_SPEED = 200; // Vitesse initiale
const NUM_APPLES = 10; // NOMBRE DE POMMES SUR LE TERRAIN

// ========================================
// 🏢 LOGOS GAFAM (URLs des logos)
// ========================================
const GAFAM_LOGOS = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/240px-Google_%22G%22_logo.svg.png", // Google
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/240px-Apple_logo_black.svg.png", // Apple
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Facebook_New_Logo_%282015%29.svg/240px-Facebook_New_Logo_%282015%29.svg.png", // Facebook
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png", // Amazon
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/240px-Microsoft_logo.svg.png", // Microsoft
];

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
  // Position initiale au centre de la grille (peu importe GRID_SIZE)
  const centerPos = Math.floor(GRID_SIZE / 2);
  const [snake, setSnake] = useState([{ x: centerPos, y: centerPos }]);
  const [foods, setFoods] = useState([]); // Tableau de pommes
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [nextDirection, setNextDirection] = useState(DIRECTIONS.RIGHT);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const gameLoopRef = useRef(null);

  // ========================================
  // 🍎 GÉNÉRATION D'UNE POMME (avec logo GAFAM aléatoire)
  // ========================================
  const generateSingleFood = useCallback((currentSnake, existingFoods = []) => {
    let newFood;
    let attempts = 0;

    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
        logo: GAFAM_LOGOS[Math.floor(Math.random() * GAFAM_LOGOS.length)], // Logo GAFAM aléatoire
      };
      attempts++;
    } while (
      attempts < 200 &&
      (currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      ) ||
        existingFoods.some(
          (food) => food.x === newFood.x && food.y === newFood.y
        ))
    );

    return newFood;
  }, []);

  // ========================================
  // 🍎 GÉNÉRATION DE TOUTES LES POMMES
  // ========================================
  const generateAllFoods = useCallback(
    (currentSnake) => {
      const newFoods = [];
      for (let i = 0; i < NUM_APPLES; i++) {
        newFoods.push(generateSingleFood(currentSnake, newFoods));
      }
      return newFoods;
    },
    [generateSingleFood]
  );

  // ========================================
  // 🎯 INITIALISATION DES POMMES AU DÉMARRAGE
  // ========================================
  useEffect(() => {
    if (foods.length === 0) {
      setFoods(generateAllFoods(snake));
    }
  }, []);

  // ========================================
  // 🎯 VÉRIFICATION DES COLLISIONS
  // ========================================
  const checkCollision = useCallback((head, snakeBody) => {
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }
    return snakeBody.some(
      (segment) => segment.x === head.x && segment.y === head.y
    );
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

      // Vérifier si une pomme est mangée
      const eatenFoodIndex = foods.findIndex(
        (food) => food.x === newHead.x && food.y === newHead.y
      );

      if (eatenFoodIndex !== -1) {
        // Pomme mangée !
        setScore((prev) => prev + 10);

        // Remplacer la pomme mangée par une nouvelle
        setFoods((prevFoods) => {
          const newFoods = [...prevFoods];
          newFoods[eatenFoodIndex] = generateSingleFood(newSnake, newFoods);
          return newFoods;
        });

        // Le serpent grandit (on ne retire pas la queue)
      } else {
        // Le serpent avance (on retire la queue)
        newSnake.pop();
      }

      return newSnake;
    });

    setDirection(nextDirection);
  }, [
    nextDirection,
    foods,
    gameOver,
    isPaused,
    checkCollision,
    generateSingleFood,
  ]);

  // ========================================
  // ⌨️ GESTION DES TOUCHES DU CLAVIER
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

      let newDirection = null;

      switch (e.key) {
        case "ArrowUp":
        case "z":
        case "Z":
          if (direction.y === 0) newDirection = DIRECTIONS.UP;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (direction.y === 0) newDirection = DIRECTIONS.DOWN;
          break;
        case "ArrowLeft":
        case "q":
        case "Q":
          if (direction.x === 0) newDirection = DIRECTIONS.LEFT;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (direction.x === 0) newDirection = DIRECTIONS.RIGHT;
          break;
        default:
          return;
      }

      if (newDirection) {
        e.preventDefault();
        setNextDirection(newDirection);
      }
    },
    [direction, gameOver, gameStarted]
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

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 5);
    gameLoopRef.current = setInterval(moveSnake, speed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, isPaused, moveSnake, score]);

  // ========================================
  // ⌨️ ÉCOUTEUR D'ÉVÉNEMENTS CLAVIER
  // ========================================
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // ========================================
  // 🔄 REDÉMARRAGE DU JEU
  // ========================================
  const resetGame = () => {
    const centerPos = Math.floor(GRID_SIZE / 2);
    const initialSnake = [{ x: centerPos, y: centerPos }];
    setSnake(initialSnake);
    setFoods(generateAllFoods(initialSnake));
    setDirection(DIRECTIONS.RIGHT);
    setNextDirection(DIRECTIONS.RIGHT);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setIsPaused(false);
  };

  // ========================================
  // 🎨 RENDU DU COMPOSANT
  // ========================================
  return (
    <div style={styles.container}>
      <div style={styles.gameWrapper}>
        {/* Score avec style NES */}
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
                <p style={{ margin: "0 0 10px 0" }}>🎮 Prêt à jouer ?</p>
                <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
                  ⬆️⬇️⬅️➡️ ou ZQSD
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
                  💀 GAME OVER
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
            style={styles.grid}
          >
            {/* Fond damier */}
            {Array.from({ length: GRID_SIZE }).map((_, row) =>
              Array.from({ length: GRID_SIZE }).map((_, col) => (
                <rect
                  key={`${row}-${col}`}
                  x={col * CELL_SIZE}
                  y={row * CELL_SIZE}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
                  fill={(row + col) % 2 === 0 ? "#0f380f" : "#306230"}
                />
              ))
            )}

            {/* Tous les logos GAFAM */}
            {foods.map((food, index) => (
              <g key={`food-${index}`}>
                {/* Fond blanc arrondi pour meilleure visibilité */}
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
                {/* Logo GAFAM */}
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

            {/* Serpent (style pixel art rétro) */}
            {snake.map((segment, index) => (
              <g key={index}>
                <rect
                  x={segment.x * CELL_SIZE + 3}
                  y={segment.y * CELL_SIZE + 3}
                  width={CELL_SIZE - 6}
                  height={CELL_SIZE - 6}
                  fill={index === 0 ? "#9bbc0f" : "#8bac0f"}
                  stroke="#0f380f"
                  strokeWidth="2"
                />
                {/* Effet pixel sur la tête */}
                {index === 0 && (
                  <>
                    <rect
                      x={segment.x * CELL_SIZE + 8}
                      y={segment.y * CELL_SIZE + 8}
                      width={4}
                      height={4}
                      fill="#0f380f"
                    />
                    <rect
                      x={segment.x * CELL_SIZE + 18}
                      y={segment.y * CELL_SIZE + 8}
                      width={4}
                      height={4}
                      fill="#0f380f"
                    />
                  </>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Instructions avec style NES */}
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
// 🎨 STYLES (THEME GAME BOY VERT)
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
