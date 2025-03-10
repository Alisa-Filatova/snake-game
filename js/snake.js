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
      col: 0,
      angle: 0
    },
    down: {
      row: 1,
      col: 0,
      angle: 180
    },
    left: {
      row: 0,
      col: -1,
      angle: 270
    },
    right: {
      row: 0,
      col: 1,
      angle: 90
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
    // получить голову
    const head = this.cells[0];
    // отрисовать голову

    const halfSize = this.game.images.head.width / 2;

    // сохранить исходное состояние контекста
    this.game.ctx.save();

    // перемещаем точку в начало отсчета координат головы
    this.game.ctx.translate(head.x, head.y);

    // перемещаем точку начала отсчета координат в центр
    this.game.ctx.translate(halfSize, halfSize);

    const degree = this.direction.angle;

    // вращаям контекст относительно изображения головы змеи
    this.game.ctx.rotate(degree * Math.PI / 180);

    // отрисовываем голову с учетом поворота контекста
    this.game.ctx.drawImage(this.game.images.head, -halfSize, -halfSize);

    //вернуть исходное состояние контекста
    this.game.ctx.restore();
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

    if (!this.moving) {
      this.game.onSnakeStart();
    }

    this.moving = true;
  },
  move() {
    if (!this.moving) {
      return;
    }
    // Получить следующую ячейку
    const cell = this.getNextCell();
    // если такая ячейка есть
    if (!cell || this.hasCell(cell) || this.game.board.isBombCell(cell)) {
      // остановить игру
      this.game.stop();
    } else {
      // добавить новую ячейку в snake.cells
      this.cells.unshift(cell);
      // если новая ячейка не является яблоком
      if (!this.game.board.isFoodCell(cell)) {
         // удалить последнюю ячейку из snake.cells
        this.cells.pop();
      } else {
         // если новая ячейка является яблоком
        this.game.onSnakeEat()
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
