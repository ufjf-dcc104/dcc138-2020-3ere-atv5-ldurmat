import AssetManager from "./AssetManager.js";
import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Mixer from "./Mixer.js";
import Sprite from "./Sprite.js";
import modeloMapa1 from "../maps/mapa1.js";
import InputHandler from "./InputHandler.js";

const mixer = new Mixer(10);
const assets = new AssetManager(mixer);
const input = new InputHandler();
const canvas = document.querySelector("canvas");
canvas.width = 32 * 32;
canvas.height = 20 * 32;

assets.carregaImagem("loading", "assets/loading.png");
assets.carregaImagem("menu", "assets/menu.png");
assets.carregaImagem("ending", "assets/gameEnd.png");
assets.carregaImagem("endHow", "assets/endHow.png");
assets.carregaImagem("endSuch", "assets/endSuch.png");
assets.carregaImagem("endVery", "assets/endVery.png");
assets.carregaImagem("endMany", "assets/endMany.png");
assets.carregaImagem("endMuch", "assets/endMuch.png");
assets.carregaImagem("endWow", "assets/endWow.png");
assets.carregaImagem("tileset1", "assets/tileset1.png");
assets.carregaImagem("pausado", "assets/paused.png");
assets.carregaImagem("golden", "assets/golden.png");
assets.carregaImagem("esqueleto", "assets/skelly.png");
assets.carregaImagem("moeda", "assets/dogesheet.png");
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

const pc = new Sprite({
  x: 1 * mapa1.SIZE + mapa1.SIZE / 2,
  y: 10 * mapa1.SIZE + mapa1.SIZE / 2,
  assetImg: assets.img("golden"),
  isPlayer: true,
});
cena1.addPlayer(pc, input);
const posesMoeda = [
  { qmax: 5, pv: 12 },
  { qmax: 5, pv: 12 },
  { qmax: 5, pv: 12 },
  { qmax: 5, pv: 12 },
  { qmax: 5, pv: 12 },
  { qmax: 5, pv: 12 },
  { qmax: 5, pv: 12 },
  { qmax: 5, pv: 12 },
];
cena1.addSprite(
  new Sprite({
    isCollectible: true,
    assetImg: assets.img("moeda"),
    POSES: posesMoeda,
  })
);
cena1.setTimedEvent(function () {
  return cena1.setRandSprite(new Sprite({ assetImg: assets.img("esqueleto") }));
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

input.startKeyMonitoring();

document.addEventListener("keydown", (e) => {
  switch (e.key) {
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
