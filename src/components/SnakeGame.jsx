import React, { useState, useEffect, useCallback, useRef } from "react";

// ========================================
// 🎮 CONFIGURATION DU JEU
// ========================================
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

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
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [nextDirection, setNextDirection] = useState(DIRECTIONS.RIGHT);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const gameLoopRef = useRef(null);

  // ========================================
  // 🍎 GÉNÉRATION ALÉATOIRE DE LA NOURRITURE
  // ========================================
  const generateFood = useCallback((currentSnake) => {
    let newFood;
    let attempts = 0;

    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      attempts++;
    } while (
      currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      ) &&
      attempts < 100
    );

    return newFood;
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

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => prev + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });

    setDirection(nextDirection);
  }, [nextDirection, food, gameOver, isPaused, checkCollision, generateFood]);

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
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
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

            {/* Pomme (style pixel art) */}
            <g>
              <rect
                x={food.x * CELL_SIZE + 6}
                y={food.y * CELL_SIZE + 4}
                width={CELL_SIZE - 12}
                height={CELL_SIZE - 8}
                fill="#ff0000"
              />
              <rect
                x={food.x * CELL_SIZE + 4}
                y={food.y * CELL_SIZE + 6}
                width={CELL_SIZE - 8}
                height={CELL_SIZE - 12}
                fill="#ff0000"
              />
              <rect
                x={food.x * CELL_SIZE + 12}
                y={food.y * CELL_SIZE + 2}
                width={4}
                height={4}
                fill="#00ff00"
              />
            </g>

            {/* Serpent (style pixel art rétro) */}
            {snake.map((segment, index) => (
              <g key={index}>
                <rect
                  x={segment.x * CELL_SIZE + 2}
                  y={segment.y * CELL_SIZE + 2}
                  width={CELL_SIZE - 4}
                  height={CELL_SIZE - 4}
                  fill={index === 0 ? "#9bbc0f" : "#8bac0f"}
                  stroke="#0f380f"
                  strokeWidth="1"
                />
                {/* Effet pixel sur la tête */}
                {index === 0 && (
                  <>
                    <rect
                      x={segment.x * CELL_SIZE + 5}
                      y={segment.y * CELL_SIZE + 5}
                      width={3}
                      height={3}
                      fill="#0f380f"
                    />
                    <rect
                      x={segment.x * CELL_SIZE + 12}
                      y={segment.y * CELL_SIZE + 5}
                      width={3}
                      height={3}
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
