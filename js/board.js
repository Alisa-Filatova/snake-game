game.board = {
  game: game,
  size: 15,
  cells: [],
  create() {
    this.createCells();
  },
  createCells() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        this.cells.push(this.createCell(row, col));
      }
    }
  },
  createCell(row, col) {
    const cellGap = 1;
    const cellSize = this.game.images.cell.width + cellGap;
    const offsetX = (this.game.width - cellSize * this.size) / 2;
    const offsetY = (this.game.height - cellSize * this.size) / 2;
    const cell = {
      row: row,
      col: col,
      x: offsetX + cellSize * col,
      y: offsetY + cellSize * row
    }

    return cell;
  },
  getCell(row, col) {
    return this.cells.find(cell => cell.row === row && cell.col === col);
  },
  getRandomAvailableCell() {
    const cellsList = this.cells.filter(cell => !cell.type && !this.game.snake.hasCell(cell));
    const index = this.game.random(0, cellsList.length - 1);

    return cellsList[index];
  },
  createCellObject(type) {
    // получить текущую ячейку с данным объектом
    let cell = this.cells.find(cell => cell.type === type);

    if (cell) {
      cell.type = false;
    }

    // получить случайную доступную ячейку для нового объекта
    cell = this.getRandomAvailableCell();

    // установить флаг type
    cell.type = type;
  },
  createBomb() {
    this.createCellObject('bomb');
  },
  createFood() {
    this.createCellObject('food');
  },
  isFoodCell(cell) {
    return cell.type === 'food';
  },
  isBombCell(cell) {
    return cell.type === 'bomb';
  },
  render() {
    this.cells.forEach(cell => {
      this.game.ctx.drawImage(this.game.images.cell, cell.x, cell.y);

      if (cell.type) {
        this.game.ctx.drawImage(this.game.images[cell.type], cell.x, cell.y);
      }
    });
  }
};
