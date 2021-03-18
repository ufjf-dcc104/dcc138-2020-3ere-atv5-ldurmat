import AssetManager from "./AssetManager.js";
import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Mixer from "./Mixer.js";
import Sprite from "./Sprite.js";
import modeloMapa1 from "../maps/mapa1.js";

const mixer = new Mixer(10);
const assets = new AssetManager(mixer);

assets.carregaImagem("tileset1", "assets/tileset1.png");
assets.carregaImagem("garota", "assets/garota.png");
assets.carregaImagem("esqueleto", "assets/skelly.png");
assets.carregaImagem("orc", "assets/orc.png");
assets.carregaAudio("moeda", "assets/coin.wav");
assets.carregaAudio("boom", "assets/boom.wav");

const canvas = document.querySelector("canvas");

const cena1 = new Cena(canvas, assets);
const mapa1 = new Mapa(modeloMapa1.length, modeloMapa1[0].length, 32);
canvas.width = modeloMapa1[0].length * 32;
canvas.height = modeloMapa1.length * 32;

mapa1.carregaMapa(modeloMapa1);
mapa1.tileset = assets.img("tileset1");
cena1.configuraMapa(mapa1);

const pc = new Sprite({ x: 2 * mapa1.SIZE, y: 10 * mapa1.SIZE });
cena1.addSprite(pc);
cena1.setRandSprite(new Sprite());
cena1.setRandSprite(new Sprite(), 400);
cena1.setRandSprite(new Sprite(), 600);
cena1.setTimedEvent(function () {
  return cena1.setRandSprite(new Sprite());
}, 4);

cena1.iniciar();
document.addEventListener("keydown", (e) => {
  const PCSPEED = 200;
  switch (e.key) {
    case "W":
    case "w":
      pc.vy = -PCSPEED;
      break;
    case "A":
    case "a":
      pc.vx = -PCSPEED;
      break;
    case "S":
    case "s":
      pc.vy = PCSPEED;
      break;
    case "D":
    case "d":
      pc.vx = PCSPEED;
      break;
    case "I":
    case "i":
      cena1.iniciar();
      break;
    case "P":
    case "p":
      cena1.parar();
      break;
    case "C":
    case "c":
      assets.play("moeda");
      break;
    case "B":
    case "b":
      assets.play("boom");
      break;
  }
});
document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
    case "W":
    case "s":
    case "S":
      pc.vy = 0;
      break;
    case "a":
    case "A":
    case "d":
    case "D":
      pc.vx = 0;
      break;
  }
});
