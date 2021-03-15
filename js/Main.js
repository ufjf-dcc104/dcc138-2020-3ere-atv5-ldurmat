import AssetManager from "./AssetManager.js";
import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Mixer from "./Mixer.js";
import Sprite from "./Sprite.js";
import modeloMapa1 from "../maps/mapa1.js";

const mixer = new Mixer(10);
const assets = new AssetManager(mixer);
assets.carregaImagem("garota", "assets/garota.png");
assets.carregaImagem("esqueleto", "assets/skelly.png");
assets.carregaImagem("orc", "assets/orc.png");
assets.carregaAudio("moeda", "assets/coin.wav");
assets.carregaAudio("boom", "assets/boom.wav");

const canvas = document.querySelector("canvas");

const cena1 = new Cena(canvas, assets);
const mapa1 = new Mapa(modeloMapa1.length, modeloMapa1[0].length, 32);
canvas.width = modeloMapa1[0].length*32;
canvas.height = modeloMapa1.length*32;
mapa1.carregaMapa(modeloMapa1);
cena1.configuraMapa(mapa1);

const pc = new Sprite({ x: 50, y: 200, vx: 10 });
cena1.addSprite(pc);
cena1.spawnaRandInimigo(new Sprite);

cena1.iniciar();
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "s":
      cena1.iniciar();
      break;
    case "p":
      cena1.parar();
      break;
    case "c":
      assets.play("moeda");
      break;
    case "b":
      assets.play("boom");
      break;
  }
});
