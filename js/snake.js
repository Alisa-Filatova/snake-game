class Snake {
  cells = [];
  moving = false;
  direction = false;
  directions = {
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
  }

  constructor(board, onStart, onEat) {
    this.board = board;
    this.onStart = onStart;
    this.onEat = onEat;
  }

  create() {
    const startCells = [
      {row: 7, col: 7},
      {row: 8, col: 7}
    ];

    this.direction = this.directions.up;

    for (const startCell of startCells) {
      this.cells.push(
        this.board.getCell(startCell.row, startCell.col)
      );
    }
  }

  renderHead(ctx, images) {
    // получить голову
    const head = this.cells[0];
    // отрисовать голову

    const halfSize = images.head.width / 2;

    // сохранить исходное состояние контекста
    ctx.save();

    // перемещаем точку в начало отсчета координат головы
    ctx.translate(head.x, head.y);

    // перемещаем точку начала отсчета координат в центр
    ctx.translate(halfSize, halfSize);

    const degree = this.direction.angle;

    // вращаям контекст относительно изображения головы змеи
    ctx.rotate(degree * Math.PI / 180);

    // отрисовываем голову с учетом поворота контекста
    ctx.drawImage(images.head, -halfSize, -halfSize);

    //вернуть исходное состояние контекста
    ctx.restore();
  }

  renderBody(ctx, images) {
    for (let i = 1; i < this.cells.length; i++) {
      ctx.drawImage(images.body, this.cells[i].x, this.cells[i].y);
    }
  }

  render(ctx, images) {
    this.renderHead(ctx, images);
    this.renderBody(ctx, images);
  }

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
      this.onStart();
    }

    this.moving = true;
  }

  move() {
    if (!this.moving) {
      return true;
    }

    // Получить следующую ячейку
    const cell = this.getNextCell();

    // если такая ячейка есть
    if (!cell || this.hasCell(cell) || this.board.isBombCell(cell)) {
      // остановить игру
      return false;
    }

    // добавить новую ячейку в snake.cells
    this.cells.unshift(cell);

    // если новая ячейка не является яблоком
    if (!this.board.isFoodCell(cell)) {
       // удалить последнюю ячейку из snake.cells
      this.cells.pop();
    } else {
      // если новая ячейка является яблоком
      this.onEat();
    }

    return true;
  }

  hasCell(cell) {
    return this.cells.find(item => item === cell);
  }

  getNextCell() {
    const head = this.cells[0];
    const row = head.row + this.direction.row;
    const col = head.col + this.direction.col;

    return this.board.getCell(row, col);
  }
};
