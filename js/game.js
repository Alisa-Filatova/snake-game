const game = {
  canvas: null,
  ctx: null,
  board: null,
  snake: null,
  width: 0,
  height: 0,
  score: 0,
  dimesions: {
    max: {
      width: 640,
      height: 360
    },
    min: {
      width: 300,
      height: 300
    }
  },
  images: {
    background: null,
    cell: null,
    body: null,
    food: null,
    head: null,
    bomb: null
  },
  sounds: {
    theme: null,
    bomb: null,
    food: null
  },
  start() {
    this.init();

    this.preload(() => {
      this.run();
    });
  },
  init() {
    this.canvas = document.getElementById('my-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.initDimensions();
    this.setTextFont();
  },
  setTextFont() {
    this.ctx.font = '20px Cactus';
    this.ctx.fillStyle = '#ffffff';
  },
  initDimensions() {
    const data = {
      maxWidth: this.dimesions.max.width,
      maxHeight: this.dimesions.max.height,
      minWidth: this.dimesions.min.width,
      minHeight: this.dimesions.min.height,
      realWidth: window.innerWidth,
      realHeight: window.innerHeight,
    };

    if (data.realWidth / data.realHeight > data.maxWidth / data.maxHeight) {
      this.fitWidth(data);
    } else {
      this.fitHeight(data);
    }

    this.canvas.width = this.width;
    this.canvas.height = this.height;
  },
  fitWidth(data) {
    this.height = Math.round(this.width * data.realHeight / data.realWidth);
    this.height = Math.min(this.height, data.maxHeight);
    this.height = Math.max(this.height, data.minHeight);
    this.width = Math.round(data.realWidth * this.height / data.realHeight);
    this.canvas.style.width = '100%';
  },
  fitHeight(data) {
    this.width = Math.round(data.realWidth * data.maxHeight / data.realHeight);
    this.width = Math.min(this.width, data.maxWidth);
    this.width = Math.max(this.width, data.minWidth);
    this.height = Math.round(this.width * data.realHeight / data.realWidth);
    this.canvas.style.height = '100%';
  },
  preload(onLoadCallback) {
    let loaded = 0;
    const required = Object.keys(this.images).length + Object.keys(this.sounds).length;

    const onAssetLoad = () => {
      loaded += 1;

      if (loaded >= required) {
        onLoadCallback();
      }
    }

    this.preloadImages(onAssetLoad);
    this.preloadSounds(onAssetLoad);
  },
  preloadImages(onAssetLoad) {
    Object.keys(this.images).forEach((key) => {
      const image = new Image();
      image.src = `img/${key}.png`;
      image.addEventListener('load', onAssetLoad);
      this.images[key] = image;
    });
  },
  preloadSounds(onAssetLoad) {
    Object.keys(this.sounds).forEach((key) => {
      const sound = new Audio(`sounds/${key}.mp3`);
      sound.addEventListener('canplaythrough', onAssetLoad);
      this.sounds[key] = sound;
    });
  },
  create() {
    // создание игровых объектов
    this.board = new Board(this);
    this.board.create(this.width, this.height, this.images);
    this.snake = new Snake(
      this.board,
      this.onSnakeStart.bind(this),
      this.onSnakeEat.bind(this),
    );
    this.snake.create();
    this.board.createFood();
    this.board.createBomb();

    // установка игровых событий
    window.addEventListener('keydown', (event) => {
        this.snake.start(event.key);
    });
  },
  render() {
    // отрисовка игровых объектов
    window.requestAnimationFrame(() => {
      // перед тем как отрисовать новый кадр необходимо очистить предыдущий
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.drawImage(this.images.background, (this.width - this.images.background.width) / 2, (this.height - this.images.background.height) / 2);
      this.board.render(this.ctx, this.images);
      this.snake.render(this.ctx, this.images);
      this.ctx.fillText(`Score: ${this.score}`, 30, 30);
    });
  },
  update() {
    // двигаем змею и отрисовываем новый кадр
    if (!this.snake.move()) {
      this.stop();
    }

    this.render();
  },
  run() {
    this.create();

    // каждые 150ms обновляем кадр
    this.gameInterval = setInterval(() => {
      this.update();
    }, 150);

    // каждые 3s обновляем кадр
    this.bombInterval = setInterval(() => {
      if (this.snake.moving) {
        this.board.createBomb();
      }
    }, 3000);
  },
  stop() {
    this.sounds.bomb.play();
    clearInterval(this.gameInterval);
    clearInterval(this.bombInterval);
    alert('Game Over!');
    window.location.reload();
  },
  onSnakeStart() {
    this.sounds.theme.loop = true;
    this.sounds.theme.play();
  },
  onSnakeEat() {
    this.score += 1;
    this.sounds.food.play();
    this.board.createFood();
  }
};

window.addEventListener('load', () => {
  game.start();
});
