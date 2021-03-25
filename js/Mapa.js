export default class Mapa {
  constructor(linhas = 8, colunas = 12, tamanho = 32) {
    this.LINHAS = linhas;
    this.COLUNAS = colunas;
    this.SIZE = tamanho;
    this.tiles = [];
    this.tileset = null;
    for (let l = 0; l < this.LINHAS; l++) {
      this.tiles[l] = [];
      for (let c = 0; c < this.COLUNAS; c++) {
        this.tiles[l][c] = 0;
      }
    }
    this.cena = null;
  }

  desenhar(ctx) {
    this.desenhaChao(ctx);
    this.desenhaObj(ctx);
  }

  carregaMapa(modelo) {
    this.LINHAS = modelo.length;
    this.COLUNAS = modelo[0]?.length ?? 0;
    this.tiles = [];
    for (let l = 0; l < this.LINHAS; l++) {
      this.tiles[l] = [];
      for (let c = 0; c < this.COLUNAS; c++) {
        this.tiles[l][c] = modelo[l][c];
      }
    }
  }

  desenhaObj(ctx) {
    for (let l = 0; l < this.LINHAS; l++) {
      for (let c = 0; c < this.COLUNAS; c++) {
        switch (this.tiles[l][c]) {
          case 1:
            ctx.drawImage(
              this.tileset,
              3 * this.SIZE,
              0 * this.SIZE,
              this.SIZE,
              this.SIZE,
              c * this.SIZE,
              l * this.SIZE,
              this.SIZE,
              this.SIZE
            );
            break;
          default:
            break;
        }
      }
    }
  }

  desenhaChao(ctx) {
    for (let l = 1; l < this.LINHAS - 1; l++) {
      for (let c = 1; c < this.COLUNAS - 1; c++) {
        //desenha piso simples
        ctx.drawImage(
          this.tileset,
          1 * this.SIZE,
          1 * this.SIZE,
          this.SIZE,
          this.SIZE,
          c * this.SIZE,
          l * this.SIZE,
          this.SIZE,
          this.SIZE
        );
      }
    }
    for (let i = 1; i < this.LINHAS - 1; i++) {
      //desenha lados esq/dir
      ctx.drawImage(
        this.tileset,
        0 * this.SIZE,
        1 * this.SIZE,
        this.SIZE,
        this.SIZE,
        0 * this.SIZE,
        i * this.SIZE,
        this.SIZE,
        this.SIZE
      );
      ctx.drawImage(
        this.tileset,
        2 * this.SIZE,
        1 * this.SIZE,
        this.SIZE,
        this.SIZE,
        (this.COLUNAS - 1) * this.SIZE,
        i * this.SIZE,
        this.SIZE,
        this.SIZE
      );
    }

    for (let i = 1; i < this.COLUNAS - 1; i++) {
      //desenha lados cima/baixo
      ctx.drawImage(
        this.tileset,
        1 * this.SIZE,
        0 * this.SIZE,
        this.SIZE,
        this.SIZE,
        i * this.SIZE,
        0 * this.SIZE,
        this.SIZE,
        this.SIZE
      );
      ctx.drawImage(
        this.tileset,
        1 * this.SIZE,
        2 * this.SIZE,
        this.SIZE,
        this.SIZE,
        i * this.SIZE,
        (this.LINHAS - 1) * this.SIZE,
        this.SIZE,
        this.SIZE
      );
    }

    //cantoSupEsq
    ctx.drawImage(
      this.tileset,
      0 * this.SIZE,
      0 * this.SIZE,
      this.SIZE,
      this.SIZE,
      0 * this.SIZE,
      0 * this.SIZE,
      this.SIZE,
      this.SIZE
    );
    //cantoSupDir
    ctx.drawImage(
      this.tileset,
      2 * this.SIZE,
      0 * this.SIZE,
      this.SIZE,
      this.SIZE,
      (this.COLUNAS - 1) * this.SIZE,
      0 * this.SIZE,
      this.SIZE,
      this.SIZE
    );
    //cantoInfEsq
    ctx.drawImage(
      this.tileset,
      0 * this.SIZE,
      2 * this.SIZE,
      this.SIZE,
      this.SIZE,
      0 * this.SIZE,
      (this.LINHAS - 1) * this.SIZE,
      this.SIZE,
      this.SIZE
    );
    //cantoInfDir
    ctx.drawImage(
      this.tileset,
      2 * this.SIZE,
      2 * this.SIZE,
      this.SIZE,
      this.SIZE,
      (this.COLUNAS - 1) * this.SIZE,
      (this.LINHAS - 1) * this.SIZE,
      this.SIZE,
      this.SIZE
    );
  }
}
