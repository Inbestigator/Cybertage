let mouseX;
let mouseY;
let dotX;
let dotY;

document.addEventListener("DOMContentLoaded", function () {
  const gameArea = document.getElementById("gameArea");
  const background = document.getElementById("layer2");
  const backgroundctx = background.getContext("2d");
  const player1 = document.getElementById("layer1");
  const player1ctx = player1.getContext("2d");
  const player2 = document.getElementById("layer0");
  const player2ctx = player2.getContext("2d");
  const client = document.getElementById("client");
  const enemyClient = document.getElementById("enemyClient");

  const socket = io("/");

  function sendCoords() {
    setTimeout(function () {
      try {
        socket.emit("packet", { dotX, dotY, client: client.value });
        sendCoords();
      } catch (error) {
        sendCoords();
      }
    }, 0);
  }
  sendCoords();
  socket.on("packet", (data) => {
    drawDot(data.dotX, data.dotY);
    enemyClient.value = data.client;
  });
  let maze;
  socket.on("maze", (socketMaze) => {
    maze = socketMaze;
    drawMaze(); // Call drawMaze() here, after maze is defined
  });

  function drawMaze() {
    if (!maze) return; // Check if maze is defined
    const cellSize = Math.min(
      background.width / maze[0].length,
      background.height / maze.length
    );

    backgroundctx.clearRect(0, 0, background.width, background.height);

    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 1) {
          backgroundctx.fillStyle = "black";
          backgroundctx.fillRect(
            x * cellSize,
            y * cellSize,
            cellSize,
            cellSize
          );
        }
      });
    });
  }

  function drawDot(x, y) {
    player2ctx.clearRect(0, 0, player2.width, player2.height);
    player2ctx.beginPath();
    player2ctx.arc(x, y, 7.5, 0, 2 * Math.PI);
    player2ctx.fillStyle = "green";
    player2ctx.fill();
    player2ctx.stroke();
  }

  function resizebackground() {
    const columnWidth = document.getElementById("middle-column").clientWidth;
    const height = (columnWidth * 9) / 16;
    gameArea.style.width = columnWidth + "px";
    gameArea.style.height = height + "px";
    const canvases = [background, player1, player2];
    canvases.forEach((canvas) => {
      canvas.width = columnWidth;
      canvas.height = height;
    });
    drawMaze();
  }

  window.addEventListener("resize", resizebackground);

  resizebackground();

  function startExecution() {
    setTimeout(function () {
      try {
        eval(client.value);
        startExecution();
      } catch (error) {
        startExecution();
      }
    }, 0);
  }

  startExecution();

  dotX = background.width / 2;
  dotY = background.height / 2;
  mouseX = background.width / 2;
  mouseY = background.height / 2;

  background.addEventListener("mousemove", function (event) {
    if (!event.clientX || !event.clientY) return;
    mouseX =
      (event.clientX - background.getBoundingClientRect().left) *
      (background.width / background.offsetWidth);
    mouseY =
      (event.clientY - background.getBoundingClientRect().top) *
      (background.height / background.offsetHeight);
  });
});
