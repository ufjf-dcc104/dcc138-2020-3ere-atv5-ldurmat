export default class Cena {
  /*
    Desenha elementos na tela em uma animação.
  */

  constructor(canvas, assets = null) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.sprites = [];
    this.aRemover = [];
    this.t0 = 0;
    this.dt = 0;
    this.idAnim = null;
    this.assets = assets;
    this.mapa = null;
    this.eventTimer = 0;
    this.eventInterval = null;
    this.event = null;
  }

  desenhar() {
    this.ctx.fillStyle = "lightblue";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.assets.acabou()) {
      this.mapa?.desenhar(this.ctx);
      for (let s = 0; s < this.sprites.length; s++) {
        const sprite = this.sprites[s];
        sprite.desenhar(this.ctx);
        sprite.aplicaRestricoes();
      }
    }
    this.ctx.fillStyle = "yellow";
    this.ctx.fillText(this.assets?.progresso(), 10, 20);
  }

  addSprite(sprite) {
    sprite.cena = this;
    this.sprites.push(sprite);
  }

  passo(dt) {
    if (this.assets.acabou()) {
      for (const sprite of this.sprites) {
        sprite.passo(dt);
      }
    }
  }

  quadro(t) {
    this.t0 = this.t0 ?? t;
    this.dt = (t - this.t0) / 1000;
    this.timedEvent();
    this.passo(this.dt);
    this.desenhar();
    this.checaColisao();
    this.removerSprites();
    this.iniciar();
    this.t0 = t;
  }

  iniciar() {
    this.idAnim = requestAnimationFrame((t) => {
      this.quadro(t);
    });
  }

  parar() {
    cancelAnimationFrame(this.idAnim);
    this.t0 = null;
    this.dt = 0;
  }
  checaColisao() {
    for (let a = 0; a < this.sprites.length - 1; a++) {
      const spriteA = this.sprites[a];
      for (let b = a + 1; b < this.sprites.length; b++) {
        const spriteB = this.sprites[b];
        if (spriteA.colidiuCom(spriteB)) {
          this.quandoColidir(spriteA, spriteB);
        }
      }
    }
  }
  quandoColidir(a, b) {
    if (!this.aRemover.includes(a)) {
      this.aRemover.push(a);
    }
    if (!this.aRemover.includes(b)) {
      this.aRemover.push(b);
    }
    if (this.assets.audio("boom")) {
      this.assets.play("boom");
    }
  }
  removerSprites() {
    for (const alvo of this.aRemover) {
      const idx = this.sprites.indexOf(alvo);
      if (idx >= 0) {
        this.sprites.splice(idx, 1);
      }
    }
    this.aRemover = [];
  }

  configuraMapa(mapa) {
    this.mapa = mapa;
    this.mapa.cena = this;
  }

  setRandSprite(sprite, VMAX = 200) {
    if (this.mapa != null && this.sprites.length < 21) {
      //limite de pc+20 sprites na cena
      for (let i = 0; i < this.mapa.LINHAS * this.mapa.COLUNAS; i++) {
        //nao vai garantir achar, mas é um stop com boa probabilidade cumulativa
        const rngx = Math.floor(Math.random() * this.mapa.COLUNAS);
        const rngy = Math.floor(Math.random() * this.mapa.LINHAS);
        if (this.mapa.tiles[rngy][rngx] == 0) {
          sprite.x = rngx * this.mapa.SIZE + this.mapa.SIZE / 2;
          sprite.y = rngy * this.mapa.SIZE + this.mapa.SIZE / 2;
          sprite.vx = 0;
          sprite.vy = 0;
          sprite.color = "red";
          if (Math.random() < 0.5) {
            sprite.vx = Math.floor(Math.random() * VMAX * 2) - VMAX;
          }
          if (Math.random() < 0.5) {
            sprite.vy = Math.floor(Math.random() * VMAX * 2) - VMAX;
          }
          this.addSprite(sprite);
          break;
        }
      }
    }
  }

  setTimedEvent(evento, intervalo) {
    this.event = evento;
    this.eventInterval = intervalo;
  }

  timedEvent() {
    if (this.eventInterval != null && this.eventTimer > this.eventInterval) {
      this.event();
      this.eventTimer = 0;
    } else {
      this.eventTimer += this.dt;
    }
  }
}
