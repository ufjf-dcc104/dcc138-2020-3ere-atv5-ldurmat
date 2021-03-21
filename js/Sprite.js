export default class Sprite {
  /*
    Modela algo que se move na tela.
  */
  constructor({
    x = 100,
    y = 100,
    vx = 0,
    vy = 0,
    w = 24,
    h = 24,
    color = "white",
    assetImg = new Image(),
  } = {}) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.w = w;
    this.h = h;
    this.color = color;
    this.cena = null;
    this.mx = 0;
    this.my = 0;
    this.isCollectible = false;
    this.isPlayer = false;
    this.collected = 0;
    this.assetImg = assetImg;
    this.SIZE = 64;
    this.tipo = null;
    this.pose = 0;
    this.quadro = 0;
    this.POSES = [
      { qmax: 8, pv: 12 },
      { qmax: 8, pv: 12 },
      { qmax: 8, pv: 12 },
      { qmax: 8, pv: 12 },
    ];
  }

  desenhar(ctx) {
    ctx.drawImage(
      this.assetImg,
      Math.floor(this.quadro) * this.SIZE,
      this.pose * this.SIZE,
      this.SIZE,
      this.SIZE,
      this.x - this.SIZE / 2,
      this.y - (3 * this.SIZE) / 4,
      this.SIZE,
      this.SIZE
    );
  }
  // desenharDefault(ctx) {
  //   ctx.fillStyle = this.color;
  //   ctx.fillRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
  //   ctx.strokeStyle = "blue";
  //   ctx.strokeRect(
  //     this.mx * this.cena.mapa.SIZE,
  //     this.my * this.cena.mapa.SIZE,
  //     this.cena.mapa.SIZE,
  //     this.cena.mapa.SIZE
  //   );
  // }

  passo(dt) {
    this.x = this.x + this.vx * dt;
    this.y = this.y + this.vy * dt;
    this.mx = Math.floor(this.x / this.cena.mapa.SIZE);
    this.my = Math.floor(this.y / this.cena.mapa.SIZE);

    if (this.vy < 0) {
      this.pose = 0;
      this.quadro =
        this.quadro >= this.POSES[this.pose].qmax
          ? 0
          : this.quadro + this.POSES[this.pose].pv * dt;
    } else if (this.vy > 0) {
      this.pose = 2;
      this.quadro =
        this.quadro >= this.POSES[this.pose].qmax
          ? 0
          : this.quadro + this.POSES[this.pose].pv * dt;
    }
    if (this.vx < 0) {
      this.pose = 1;
      this.quadro =
        this.quadro >= this.POSES[this.pose].qmax
          ? 0
          : this.quadro + this.POSES[this.pose].pv * dt;
    } else if (this.vx > 0) {
      this.pose = 3;
      this.quadro =
        this.quadro >= this.POSES[this.pose].qmax
          ? 0
          : this.quadro + this.POSES[this.pose].pv * dt;
    }
  }

  colidiuCom(outro) {
    return !(
      this.x - this.w / 2 > outro.x + outro.w / 2 ||
      this.x + this.w / 2 < outro.x - outro.w / 2 ||
      this.y - this.h / 2 > outro.y + outro.h / 2 ||
      this.y + this.h / 2 < outro.y - outro.h / 2
    );
  }

  aplicaRestricoes() {
    this.aplicaRestricoesDireita(this.mx + 1, this.my - 1);
    this.aplicaRestricoesDireita(this.mx + 1, this.my);
    this.aplicaRestricoesDireita(this.mx + 1, this.my + 1);
    this.aplicaRestricoesEsquerda(this.mx - 1, this.my - 1);
    this.aplicaRestricoesEsquerda(this.mx - 1, this.my);
    this.aplicaRestricoesEsquerda(this.mx - 1, this.my + 1);
    this.aplicaRestricoesBaixo(this.mx - 1, this.my + 1);
    this.aplicaRestricoesBaixo(this.mx, this.my + 1);
    this.aplicaRestricoesBaixo(this.mx + 1, this.my + 1);
    this.aplicaRestricoesCima(this.mx - 1, this.my - 1);
    this.aplicaRestricoesCima(this.mx, this.my - 1);
    this.aplicaRestricoesCima(this.mx + 1, this.my - 1);
  }
  aplicaRestricoesDireita(pmx, pmy) {
    const SIZE = this.cena.mapa.SIZE;
    if (this.vx > 0) {
      if (this.cena.mapa.tiles[pmy][pmx] != 0) {
        const tile = {
          x: pmx * SIZE + SIZE / 2,
          y: pmy * SIZE + SIZE / 2,
          w: SIZE,
          h: SIZE,
        };
        this.cena.ctx.strokeStyle = "white";
        this.cena.ctx.strokeRect(
          tile.x - SIZE / 2,
          tile.y - SIZE / 2,
          SIZE,
          SIZE
        );
        if (this.colidiuCom(tile)) {
          this.bounce();
          this.x = tile.x - tile.w / 2 - this.w / 2 - 1;
          this.pose = 3;
        }
      }
    }
  }
  aplicaRestricoesEsquerda(pmx, pmy) {
    const SIZE = this.cena.mapa.SIZE;
    if (this.vx < 0) {
      if (this.cena.mapa.tiles[pmy][pmx] != 0) {
        const tile = {
          x: pmx * SIZE + SIZE / 2,
          y: pmy * SIZE + SIZE / 2,
          w: SIZE,
          h: SIZE,
        };
        this.cena.ctx.strokeStyle = "white";
        this.cena.ctx.strokeRect(
          tile.x - SIZE / 2,
          tile.y - SIZE / 2,
          SIZE,
          SIZE
        );
        if (this.colidiuCom(tile)) {
          this.bounce();
          this.x = tile.x + tile.w / 2 + this.w / 2 + 1;
          this.pose = 1;
        }
      }
    }
  }
  aplicaRestricoesBaixo(pmx, pmy) {
    const SIZE = this.cena.mapa.SIZE;
    if (this.vy > 0) {
      if (this.cena.mapa.tiles[pmy][pmx] != 0) {
        const tile = {
          x: pmx * SIZE + SIZE / 2,
          y: pmy * SIZE + SIZE / 2,
          w: SIZE,
          h: SIZE,
        };
        this.cena.ctx.strokeStyle = "white";
        this.cena.ctx.strokeRect(
          tile.x + SIZE / 2,
          tile.y + SIZE / 2,
          SIZE,
          SIZE
        );
        if (this.colidiuCom(tile)) {
          this.bounce();
          this.y = tile.y - tile.h / 2 - this.h / 2 - 1;
          this.pose = 2;
        }
      }
    }
  }
  aplicaRestricoesCima(pmx, pmy) {
    const SIZE = this.cena.mapa.SIZE;
    if (this.vy < 0) {
      if (this.cena.mapa.tiles[pmy][pmx] != 0) {
        const tile = {
          x: pmx * SIZE + SIZE / 2,
          y: pmy * SIZE + SIZE / 2,
          w: SIZE,
          h: SIZE,
        };
        this.cena.ctx.strokeStyle = "white";
        this.cena.ctx.strokeRect(
          tile.x - SIZE / 2,
          tile.y - SIZE / 2,
          SIZE,
          SIZE
        );
        if (this.colidiuCom(tile)) {
          this.bounce();
          this.y = tile.y + tile.h / 2 + this.h / 2 + 1;
          this.pose = 0;
        }
      }
    }
  }

  bounce() {
    if (this.color == "red") {
      this.vx = -1 * this.vx;
      this.vy = -1 * this.vy;
    }
  }
}
