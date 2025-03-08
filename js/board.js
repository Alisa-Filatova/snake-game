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
        let cell = this.createCell(row, col);
        this.cells.push(cell);
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
    const cellsList = this.cells.filter(cell => !this.game.snake.hasCell(cell));
    const index = this.game.random(0, cellsList.length - 1);

    return cellsList[index];
  },
  createFood() {
    // получить текущее яблоко и обнулить флаг
    let cell = this.cells.find(cell => cell.hasFood);

    if (cell) {
      cell.hasFood = false;
    }

    // получить случайную доступную ячейку для яблока
    cell = this.getRandomAvailableCell();
    cell.hasFood = true;
  },
  isFoodCell(cell) {
    return cell.hasFood;
  },
  render() {
    this.cells.forEach(cell => {
      this.game.ctx.drawImage(this.game.images.cell, cell.x, cell.y);

      if (cell.hasFood) {
        this.game.ctx.drawImage(this.game.images.food, cell.x, cell.y);
      }
    })
  }
};
