const express = require("express");

const app = express();
const http = require("http").Server(app);

app.use(express.static(__dirname + "/web/"));

const io = require("socket.io")(http);

const maze = generateMaze(80, 45);

io.on("connection", async (socket) => {
  socket.on("packet", (data) => {
    socket.broadcast.emit("packet", data);
    return;
  });
  socket.emit("maze", maze);
});

function generateMaze(width, height) {
  const maze = Array.from({ length: height }, () => Array(width).fill(1));

  function carveMaze(x, y) {
    maze[y][x] = 0;

    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    directions.sort(() => Math.random() - 0.5);

    for (let [dx, dy] of directions) {
      const nx = x + dx * 2;
      const ny = y + dy * 2;

      if (
        nx >= 0 &&
        nx < width &&
        ny >= 0 &&
        ny < height &&
        maze[ny][nx] === 1
      ) {
        maze[y + dy][x + dx] = 0;
        carveMaze(nx, ny);
      }
    }
  }

  carveMaze(Math.floor(width / 2), Math.floor(height / 2));

  return maze;
}

// Frontend endpoints

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/web/html/index.html");
});

app.use((req, res) => {
  if (!req.url.includes("api")) {
    res.redirect("/");
  } else {
    res.status(404).send("Endpoint not found");
  }
});

http.listen(3000, () => {
  console.log("Server running");
});
