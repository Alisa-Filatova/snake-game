const KEYS = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight'
}

game.snake = {
  game: game,
  cells: [],
  moving: false,
  direction: false,
  directions: {
    up: {
      row: -1,
      col: 0
    },
    down: {
      row: 1,
      col: 0
    },
    left: {
      row: 0,
      col: -1,
    },
    right: {
      row: 0,
      col: 1
    }
  },
  create() {
    const startCells = [
      {row: 7, col: 7},
      {row: 8, col: 7}
    ];

    this.direction = this.directions.up;

    for (let startCell of startCells) {
      this.cells.push(this.game.board.getCell(startCell.row, startCell.col));
    }
  },
  renderHead() {
    const head = this.cells[0];
    this.game.ctx.drawImage(this.game.images.head, head.x, head.y);
  },
  renderBody() {
    for (let i = 1; i < this.cells.length; i++) {
      this.game.ctx.drawImage(this.game.images.body, this.cells[i].x, this.cells[i].y);
    }
  },
  render() {
    this.renderHead();
    this.renderBody();
  },
  start(key) {
    switch (key) {
      case KEYS.up:
        this.direction = this.directions.up;
        break;
      case KEYS.left:
        this.direction = this.directions.left;
        break;
      case KEYS.down:
        this.direction = this.directions.down;
        break;
      case KEYS.right:
        this.direction = this.directions.right;
        break;
    }

    this.moving = true;
  },
  move() {
    if (!this.moving) {
      return;
    }
    // Получить следующую ячейку
    const cell = this.getNextCell();
    // если такая есть
    if (cell) {
      // добавить новую ячейку в snake.cells
      this.cells.unshift(cell);

      if (!this.game.board.isFoodCell(cell)) {
         // удалить последнюю ячейку из snake.cells
        this.cells.pop();
      } else {
        this.game.board.createFood();
      }
    }
  },
  hasCell(cell) {
    return this.cells.find(item => item === cell);
  },
  getNextCell() {
    const head = this.cells[0];
    const row = head.row + this.direction.row;
    const col = head.col + this.direction.col;

    return this.game.board.getCell(row, col);
  }
};
