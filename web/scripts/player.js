client.value = `function updateDotPosition(targetX, targetY) {
  const ease = 0.01;

  const dx = targetX - dotX;
  const dy = targetY - dotY;
  const nextX = dotX + dx * ease;
  const nextY = dotY + dy * ease;
  if (backgroundctx.getImageData(nextX, nextY, 1, 1).data[3] != 0) {
    return;
  }

  dotX += dx * ease;
  dotY += dy * ease;
}

function drawDot(x, y) {
  player1ctx.clearRect(0, 0, player1.width, player1.height);
  player1ctx.beginPath();
  player1ctx.arc(x, y, 7.5, 0, 2 * Math.PI);
  player1ctx.fillStyle = "red";
  player1ctx.fill();
  player1ctx.stroke();
}

updateDotPosition(mouseX, mouseY);
drawDot(dotX, dotY);
// Edit me to change your client!
`;
