import AssetManager from "./AssetManager.js";
import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Mixer from "./Mixer.js";
import Sprite from "./Sprite.js";
import modeloMapa1 from "../maps/mapa1.js";

const mixer = new Mixer(10);
const assets = new AssetManager(mixer);
const canvas = document.querySelector("canvas");
canvas.width = 32 * 32;
canvas.height = 20 * 32;

assets.carregaImagem("loading", "assets/loading.png");
assets.carregaImagem("menu", "assets/menu.png");
assets.carregaImagem("tileset1", "assets/tileset1.png");
assets.carregaImagem("pausado", "assets/paused.png");
assets.carregaImagem("garota", "assets/garota.png");
assets.carregaImagem("esqueleto", "assets/skelly.png");
assets.carregaImagem("orc", "assets/orc.png");
assets.carregaAudio("moeda", "assets/coin.wav");
assets.carregaAudio("boom", "assets/boom.wav");

const menu = new Cena(canvas, assets);
let cenaAtual = menu;
menu.iniciar();

const cena1 = new Cena(canvas, assets);
const mapa1 = new Mapa(modeloMapa1.length, modeloMapa1[0].length, 32);
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

canvas.addEventListener("mousedown", play);

function play(e) {
  const pos = cenaAtual.posicaoCursor(e);
  if (
    cenaAtual == menu &&
    pos.x > 100 &&
    pos.x < 400 &&
    pos.y > 400 &&
    pos.y < 500
  ) {
    cenaAtual.parar();
    canvas.removeEventListener("mousedown", play);
    cenaAtual = cena1;
    cenaAtual.iniciar();
  }
}

window.onblur = () => cenaAtual.pausar();

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
    case "P":
    case "p":
      if (cenaAtual.t0 != null) {
        cenaAtual.pausar();
      } else if (cenaAtual != menu) {
        cenaAtual.iniciar();
      }
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
