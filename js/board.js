class Board {
  size = 15;
  cells = [];

  // TODO
  constructor(game) {
    this.game = game;
  }

  create(fieldWidth, fieldHeight, images) {
    this.createCells(fieldWidth, fieldHeight, images);
  }

  createCells(fieldWidth, fieldHeight, images) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.cells.push(this.createCell(row, col, fieldWidth, fieldHeight, images));
      }
    }
  }

  createCell(row, col, fieldWidth, fieldHeight, images) {
    const cellGap = 1;
    const cellSize = images.cell.width + cellGap;
    const offsetX = (fieldWidth - cellSize * this.size) / 2;
    const offsetY = (fieldHeight - cellSize * this.size) / 2;

    const cell = {
      row: row,
      col: col,
      x: offsetX + cellSize * col,
      y: offsetY + cellSize * row
    }

    return cell;
  }

  getRandomAvailableCell() {
    const cellsList = this.cells.filter(cell => (
      !cell.type && !this.game.snake.hasCell(cell)
    ));

    const index = random(0, cellsList.length - 1);

    return cellsList[index];
  }

  createCellObject(type) {
    // получить текущую ячейку с данным объектом
    let cell = this.cells.find(cell => cell.type === type);

    if (cell) {
      cell.type = false;
    }

    // получить случайную доступную ячейку для нового объекта
    cell = this.getRandomAvailableCell();

    // установить флаг type нового объекта
    cell.type = type;
  }

  createFood() {
    this.createCellObject('food');
  }

  createBomb() {
    this.createCellObject('bomb');
  }

  isFoodCell(cell) {
    return cell.type === 'food';
  }

  isBombCell(cell) {
    return cell.type === 'bomb';
  }

  getCell(row, col) {
    return this.cells.find(cell => cell.row === row && cell.col === col);
  }

  render(ctx, images) {
    this.cells.forEach(cell => {
      ctx.drawImage(images.cell, cell.x, cell.y);

      if (cell.type) {
        ctx.drawImage(images[cell.type], cell.x, cell.y);
      }
    });
  }
};
