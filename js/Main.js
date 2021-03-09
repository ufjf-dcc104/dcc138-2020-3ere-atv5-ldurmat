import Cena from "./Cena.js";
import Sprite from "./Sprite.js";
const canvas = document.querySelector("canvas");
console.log(canvas);
const cena1 = new Cena(canvas);
const pc = new Sprite();
const en1 = new Sprite({ x: 140, w: 30, color: "red" });
cena1.addsprite(pc);
cena1.addsprite(en1);
cena1.passo(0.16)
cena1.desenhar();
