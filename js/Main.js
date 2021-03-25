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

let cenaAtual = null;
let cenas = {};

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
assets.carregaImagem("portal", "assets/bluePortal.png");
assets.carregaImagem("play", "assets/play.png");
assets.carregaAudio("moeda", "assets/coin.wav");
assets.carregaAudio("boom", "assets/boom.wav");

let pc;
const modeloPc = {
  x: 32 + 32 / 2,
  y: 10 * 32 + 32 / 2,
  assetImg: assets.img("golden"),
  isPlayer: true,
};

const modeloPortal = {
  x: 30 * 32,
  y: 10 * 32 + 32 / 2,
  isCollectible: true,
  assetImg: assets.img("portal"),
  POSES: [{ qmax: 0, pv: 1 }],
};
const modeloMoeda = {
  isCollectible: true,
  assetImg: assets.img("moeda"),
  POSES: [
    { qmax: 5, pv: 12 },
    { qmax: 5, pv: 12 },
    { qmax: 5, pv: 12 },
    { qmax: 5, pv: 12 },
    { qmax: 5, pv: 12 },
    { qmax: 5, pv: 12 },
    { qmax: 5, pv: 12 },
    { qmax: 5, pv: 12 },
  ],
};

//cena1
const cena1 = new Cena(canvas, assets, cenaHandler);
const mapa1 = new Mapa(modeloMapa1.length, modeloMapa1[0].length, 32);
mapa1.carregaMapa(modeloMapa1);
mapa1.tileset = assets.img("tileset1");
cena1.configuraMapa(mapa1);

cenas = {
  menu: new Cena(canvas, assets, cenaHandler),
  monkeyForest: cena1,
};

cenaHandler("menu");

function cenaHandler(cenaCall) {
  switch (cenaCall) {
    case "menu":
      cenaAtual?.parar();
      cenaAtual = cenas["menu"];
      pc = new Sprite(modeloPc);
      cenaAtual.iniciar();
      canvas.addEventListener("mousedown", function menuListener(e) {
        const pos = cenaAtual.posicaoCursor(e);
        if (pos.x > 100 && pos.x < 400 && pos.y > 400 && pos.y < 500) {
          this.removeEventListener("mousedown", menuListener);
          cenaHandler("monkeyForest");
        }
      });
      break;

    case "end":
      cenaAtual?.parar();
      cenaAtual.drawEnd();
      canvas.addEventListener("mousedown", function menuListener(e) {
        const pos = cenaAtual.posicaoCursor(e);
        if (pos.x > 100 && pos.x < 400 && pos.y > 400 && pos.y < 500) {
          this.removeEventListener("mousedown", menuListener);
          cenaHandler("menu");
        }
      });
      break;

    case "monkeyForest":
      cenaAtual?.parar();
      cenaAtual = cenas["monkeyForest"];
      preparaCenaAtual();
      cenaAtual.iniciar();
      break;
  }
}

input.startKeyMonitoring();
window.onblur = () => cenaAtual.pausar();
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "P":
    case "p":
      if (cenaAtual.t0 != null) {
        cenaAtual.pausar();
      } else if (cenaAtual != cenas["menu"]) {
        cenaAtual.iniciar();
      }
      break;
  }
});

function preparaCenaAtual() {
  cenaAtual.sprites = [];
  cenaAtual.aRemover = [];
  cenaAtual.addPlayer(pc, input);
  cenaAtual.addSprite(new Sprite(modeloPortal));
  cenaAtual.player = pc;
  cenaAtual.t0 = 0;
  cenaAtual.dt = 0;
  cenaAtual.idAnim = null;
  cenaAtual.enemyTimer = 0;
  cenaAtual.enemyInterval = null;
  cenaAtual.enemyEvent = null;
  cenaAtual.coinTimer = 0;
  cenaAtual.coinInterval = null;
  cenaAtual.coinEvent = null;
  cenaAtual.setTimedEnemy(function () {
    return cenaAtual.setRandSprite(
      new Sprite({ assetImg: assets.img("esqueleto") })
    );
  }, 4);
  cenaAtual.setTimedCoin(function () {
    return cenaAtual.setRandSprite(new Sprite(modeloMoeda));
  }, 6);
}
