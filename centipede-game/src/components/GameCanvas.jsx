import { useEffect, useRef } from "react";
import { Game } from "../engine/Game";

export function GameCanvas() {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    gameRef.current = new Game(canvas, ctx);
    gameRef.current.start();

    return () => {
      gameRef.current?.stop();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: "1px solid white", background: "black" }}
    />
  );
}
