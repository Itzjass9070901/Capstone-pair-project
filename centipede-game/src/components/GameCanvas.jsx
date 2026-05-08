import { useEffect, useRef } from "react";
import Game from "../engine/Game";

export default function GameCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    const game = new Game(canvas);

    game.start();

    return () => {
      game.stop();
    };
  }, []);

  return <canvas ref={canvasRef} width={1000} height={700} />;
}
