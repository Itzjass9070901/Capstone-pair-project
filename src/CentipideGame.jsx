export default function CentipedeGame() {
  return (
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center p-6">
      <CentipedeCanvas />
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";

function CentipedeCanvas() {
  const canvasRef = useRef(null);
  const animationRef = useRef();

  const WIDTH = 700;
  const HEIGHT = 800;
  const PLAYER_SPEED = 6;
  const BULLET_SPEED = 10;
  const CELL_SIZE = 20;

  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const keys = {};

    const player = {
      x: WIDTH / 2 - 15,
      y: HEIGHT - 80,
      width: 30,
      height: 30,
    };

    const bullets = [];

    const mushrooms = [];
    for (let i = 0; i < 45; i++) {
      mushrooms.push({
        x: Math.floor(Math.random() * (WIDTH / CELL_SIZE)) * CELL_SIZE,
        y: Math.floor(Math.random() * ((HEIGHT - 250) / CELL_SIZE)) * CELL_SIZE,
        hp: 4,
      });
    }

    const centipede = [];
    for (let i = 0; i < 10 + level * 2; i++) {
      centipede.push({
        x: i * CELL_SIZE,
        y: 0,
        dir: 1,
      });
    }

    let flea = null;
    let spider = {
      x: WIDTH,
      y: HEIGHT - 200,
      vx: -4,
      vy: 2,
    };

    function spawnFlea() {
      flea = {
        x: Math.random() * (WIDTH - 20),
        y: -20,
        speed: 4,
      };
    }

    function shoot() {
      bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 12,
      });
    }

    function rectsCollide(a, b) {
      return (
        a.x < b.x + (b.width || CELL_SIZE) &&
        a.x + (a.width || CELL_SIZE) > b.x &&
        a.y < b.y + (b.height || CELL_SIZE) &&
        a.y + (a.height || CELL_SIZE) > b.y
      );
    }

    function update() {
      if (gameOver) return;

      if (keys["ArrowLeft"]) {
        player.x -= PLAYER_SPEED;
      }
      if (keys["ArrowRight"]) {
        player.x += PLAYER_SPEED;
      }
      if (keys["ArrowUp"]) {
        player.y -= PLAYER_SPEED;
      }
      if (keys["ArrowDown"]) {
        player.y += PLAYER_SPEED;
      }

      player.x = Math.max(0, Math.min(WIDTH - player.width, player.x));
      player.y = Math.max(
        HEIGHT - 220,
        Math.min(HEIGHT - player.height, player.y),
      );

      bullets.forEach((bullet, index) => {
        bullet.y -= BULLET_SPEED;

        if (bullet.y < 0) {
          bullets.splice(index, 1);
        }
      });

      centipede.forEach((segment) => {
        segment.x += segment.dir * 2;

        let collision = false;

        mushrooms.forEach((mushroom) => {
          if (rectsCollide(segment, mushroom)) {
            collision = true;
          }
        });

        if (segment.x <= 0 || segment.x >= WIDTH - CELL_SIZE || collision) {
          segment.dir *= -1;
          segment.y += CELL_SIZE;
        }
      });

      bullets.forEach((bullet, bulletIndex) => {
        let bulletRemoved = false;

        mushrooms.forEach((mushroom, mushroomIndex) => {
          if (!bulletRemoved && rectsCollide(bullet, mushroom)) {
            mushroom.hp -= 1;
            bulletRemoved = true;
            bullets.splice(bulletIndex, 1);

            if (mushroom.hp <= 0) {
              mushrooms.splice(mushroomIndex, 1);
              setScore((s) => s + 5);
            }
          }
        });

        centipede.forEach((segment, segmentIndex) => {
          if (!bulletRemoved && rectsCollide(bullet, segment)) {
            bulletRemoved = true;
            bullets.splice(bulletIndex, 1);

            mushrooms.push({
              x: segment.x,
              y: segment.y,
              hp: 4,
            });

            centipede.splice(segmentIndex, 1);
            setScore((s) => s + 25);
          }
        });

        if (!bulletRemoved && flea && rectsCollide(bullet, flea)) {
          flea = null;
          bulletRemoved = true;
          bullets.splice(bulletIndex, 1);
          setScore((s) => s + 50);
        }

        if (!bulletRemoved && rectsCollide(bullet, spider)) {
          spider.x = WIDTH;
          spider.y = HEIGHT - 200;
          bulletRemoved = true;
          bullets.splice(bulletIndex, 1);
          setScore((s) => s + 75);
        }
      });

      if (Math.random() < 0.002 && !flea) {
        spawnFlea();
      }

      if (flea) {
        flea.y += flea.speed;

        if (Math.random() < 0.05) {
          mushrooms.push({
            x: flea.x,
            y: flea.y,
            hp: 4,
          });
        }

        if (flea.y > HEIGHT) {
          flea = null;
        }
      }

      spider.x += spider.vx;
      spider.y += spider.vy;

      if (spider.x < 0 || spider.x > WIDTH - 40) {
        spider.vx *= -1;
      }

      if (spider.y < HEIGHT - 260 || spider.y > HEIGHT - 80) {
        spider.vy *= -1;
      }

      centipede.forEach((segment) => {
        if (rectsCollide(player, segment)) {
          setGameOver(true);
        }
      });

      mushrooms.forEach((mushroom) => {
        if (rectsCollide(player, mushroom)) {
          setGameOver(true);
        }
      });

      if (flea && rectsCollide(player, flea)) {
        setGameOver(true);
      }

      if (rectsCollide(player, spider)) {
        setGameOver(true);
      }

      if (centipede.length === 0) {
        setLevel((l) => l + 1);

        for (let i = 0; i < 10 + (level + 1) * 2; i++) {
          centipede.push({
            x: i * CELL_SIZE,
            y: 0,
            dir: Math.random() > 0.5 ? 1 : -1,
          });
        }
      }
    }

    function draw() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.strokeStyle = "#0f0";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, HEIGHT - 220, WIDTH, 220);

      ctx.fillStyle = "cyan";
      ctx.beginPath();
      ctx.moveTo(player.x + player.width / 2, player.y);
      ctx.lineTo(player.x, player.y + player.height);
      ctx.lineTo(player.x + player.width, player.y + player.height);
      ctx.closePath();
      ctx.fill();

      bullets.forEach((bullet) => {
        ctx.fillStyle = "yellow";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });

      mushrooms.forEach((mushroom) => {
        ctx.fillStyle =
          mushroom.hp === 4
            ? "#ff00ff"
            : mushroom.hp === 3
              ? "#dd00dd"
              : mushroom.hp === 2
                ? "#aa00aa"
                : "#660066";

        ctx.beginPath();
        ctx.arc(
          mushroom.x + CELL_SIZE / 2,
          mushroom.y + CELL_SIZE / 2,
          8,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      });

      centipede.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "red" : "lime";
        ctx.beginPath();
        ctx.arc(
          segment.x + CELL_SIZE / 2,
          segment.y + CELL_SIZE / 2,
          9,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      });

      if (flea) {
        ctx.fillStyle = "orange";
        ctx.fillRect(flea.x, flea.y, 20, 20);
      }

      ctx.fillStyle = "white";
      ctx.fillRect(spider.x, spider.y, 40, 20);

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(spider.x + 12, spider.y + 10, 3, 0, Math.PI * 2);
      ctx.arc(spider.x + 28, spider.y + 10, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#00ff88";
      ctx.font = "24px monospace";
      ctx.fillText(`SCORE: ${score}`, 20, 40);
      ctx.fillText(`LEVEL: ${level}`, 20, 75);

      if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.fillStyle = "red";
        ctx.font = "64px monospace";
        ctx.fillText("GAME OVER", WIDTH / 2 - 190, HEIGHT / 2);

        ctx.fillStyle = "white";
        ctx.font = "24px monospace";
        ctx.fillText("Refresh to play again", WIDTH / 2 - 140, HEIGHT / 2 + 50);
      }
    }

    function gameLoop() {
      update();
      draw();
      animationRef.current = requestAnimationFrame(gameLoop);
    }

    const handleKeyDown = (e) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }

      keys[e.key] = true;

      if (e.key === " ") {
        shoot();
      }
    };

    const handleKeyUp = (e) => {
      keys[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp);

    gameLoop();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameOver, level]);

  return (
    <div className="flex flex-col items-center gap-4">

      <canvas
        ref={canvasRef}
        width={700}
        height={800}
        className="border-4 border-green-500 rounded-2xl shadow-2xl bg-black"
      />
    </div>
  );
}
