export default class Cena {
  /*
    Desenha elementos na tela em uma animação.
  */

  constructor(canvas, assets = null, cenaHandler) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.player = null;
    this.sprites = [];
    this.aRemover = [];
    this.t0 = 0;
    this.dt = 0;
    this.idAnim = null;
    this.assets = assets;
    this.mapa = null;
    this.enemyTimer = 0;
    this.enemyInterval = null;
    this.enemyEvent = null;
    this.coinTimer = 0;
    this.coinInterval = null;
    this.coinEvent = null;
    this.input = null;
    this.cenaCall = cenaHandler;
    this.endFlag = 0;
  }

  desenhar() {
    this.ctx.fillStyle = "lightblue";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.mapa != null) {
      if (this.assets.acabou()) {
        this.mapa?.desenhar(this.ctx);
        for (let s = 0; s < this.sprites.length; s++) {
          const sprite = this.sprites[s];
          sprite.desenhar(this.ctx);
          sprite.aplicaRestricoes();
        }
      } else {
        this.pausar();
        this.checkLoading();
      }
    } else {
      if (this.endFlag == 1) {
        this.drawEnd();
      }
      if (this.assets.acabou()) {
        this.ctx.drawImage(this.assets.img("menu"), 0, 0);
      } else {
        this.ctx.drawImage(this.assets.img("loading"), 0, 0);
      }
      this.ctx.fillStyle = "yellow";
      this.ctx.fillText(this.assets?.progresso(), 10, 20);
    }
  }

  addSprite(sprite) {
    sprite.cena = this;
    this.sprites.push(sprite);
  }

  addPlayer(sprite, input) {
    this.input = input;
    this.player = sprite;
    this.addSprite(sprite);
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
    this.timedEnemy();
    this.timedCoin();
    this.playerMovement();
    this.passo(this.dt);
    this.desenhar();
    this.checaColisao();
    this.removerSprites();
    if (this.endFlag == 0) this.iniciar();
    this.t0 = t;
  }

  iniciar() {
    this.endFlag = 0;
    this.idAnim = requestAnimationFrame((t) => {
      this.quadro(t);
    });
  }

  parar() {
    this.endFlag = 1;
    cancelAnimationFrame(this.idAnim);
    this.t0 = null;
    this.dt = 0;
  }

  pausar() {
    if (this.mapa != null && this.t0 != null) {
      this.ctx.drawImage(this.assets.img("pausado"), 0, 0);
      cancelAnimationFrame(this.idAnim);
      this.t0 = null;
      this.dt = 0;
    }
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
    if (!this.aRemover.includes(a) && !this.aRemover.includes(b)) {
      if (!a.isCollectible && !b.isCollectible) {
        if (--a.hp < 0) {
          if (!a.isPlayer) {
            this.cenaCall("end");
          } else {
            this.aRemover.push(a);
          }
        }
        if (--b.hp < 0) {
          if (!b.isPlayer) {
            this.cenaCall("end");
          } else {
            this.aRemover.push(b);
          }
        }
        this.assets.play("boom");
      } else if (a.isPlayer && b.isCollectible) {
        this.aRemover.push(b);
        if(b.assetImg == this.assets.img("moeda")){
        this.assets.play("moeda");
        a.collected++;
        }
        else{
          //cenaCall( prox mapa );
        }
      }
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

  setRandSprite(sprite, VMAX = 300) {
    if (this.mapa.tiles[0] != null && this.sprites.length < 21) {
      //limite de pc+20 sprites na cena
      for (let i = 0; i < this.mapa.LINHAS * this.mapa.COLUNAS; i++) {
        //nao vai garantir achar, mas é um stop com boa probabilidade cumulativa
        const rngx = Math.floor(Math.random() * this.mapa.COLUNAS);
        const rngy = Math.floor(Math.random() * this.mapa.LINHAS);
        if (this.mapa.tiles[rngy][rngx] == 0) {
          sprite.x = rngx * this.mapa.SIZE + this.mapa.SIZE / 2;
          sprite.y = rngy * this.mapa.SIZE + this.mapa.SIZE / 2;
          if (!sprite.isCollectible) {
            sprite.color = "red";
            if (Math.random() < 0.5) {
              sprite.vx = Math.floor(Math.random() * VMAX * 2) - VMAX;
              if (Math.random() < 0.2) {
                sprite.vy = Math.floor(Math.random() * VMAX * 2) - VMAX;
              }
            } else {
              sprite.vy = Math.floor(Math.random() * VMAX * 2) - VMAX;
              if (Math.random() < 0.2) {
                sprite.vy = Math.floor(Math.random() * VMAX * 2) - VMAX;
              }
            }
          }
          this.addSprite(sprite);
          break;
        }
      }
    }
  }

  setTimedEnemy(evento, intervalo) {
    this.enemyEvent = evento;
    this.enemyInterval = intervalo;
  }

  setTimedCoin(evento, intervalo) {
    this.coinEvent = evento;
    this.coinInterval = intervalo;
  }

  timedEnemy() {
    if (this.enemyInterval != null && this.enemyTimer > this.enemyInterval) {
      this.enemyEvent();
      this.enemyTimer = 0;
    } else {
      this.enemyTimer += this.dt;
    }
  }

  timedCoin() {
    if (this.coinInterval != null && this.coinTimer > this.coinInterval) {
      this.coinEvent();
      this.coinTimer = 0;
    } else {
      this.coinTimer += this.dt;
    }
  }

  posicaoCursor(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  }

  checkLoading() {
    this.ctx.drawImage(this.assets.img("loading"), 0, 0);
    console.log("Loading...");
    const tempoInit = new Date().getTime();
    while (true) {
      if (this.assets.acabou()) {
        console.log("Loading acabou!");
        break;
      } else if (new Date().getTime() > tempoInit + 4000) {
        console.log("Loading timeout.");
        break;
      }
    }
  }

  playerMovement() {
    const pcSpeed = 400;
    const input = this.input;
    if (input != null) {
      if (input.isPressed(input.keyset.W) == input.isPressed(input.keyset.S)) {
        this.player.vy = 0;
      } else if (this.input.isPressed(input.keyset.W)) {
        this.player.vy = -pcSpeed;
      } else {
        this.player.vy = pcSpeed;
      }
      if (input.isPressed(input.keyset.A) == input.isPressed(input.keyset.D)) {
        this.player.vx = 0;
      } else if (this.input.isPressed(input.keyset.A)) {
        this.player.vx = -pcSpeed;
      } else {
        this.player.vx = pcSpeed;
      }
    }
  }

  drawEnd() {
    const mony = this.player.collected;
    let endImg = null;
    if (mony < 10) {
      endImg = "endHow";
    } else if (mony < 25) {
      if (Math.random() < 0.5) endImg = "endSuch";
      else endImg = "endMuch";
    } else if (mony < 50) {
      if (Math.random() < 0.5) endImg = "endMany";
      else endImg = "endVery";
    } else {
      endImg = "endWow";
    }
    this.ctx.drawImage(this.assets.img("ending"), 0, 0);
    this.ctx.drawImage(this.assets.img(endImg), 500, 400);
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "yellow";
    this.ctx.fillText(`Moedas coletadas: ${mony}`, 450, 550);
  }
}
