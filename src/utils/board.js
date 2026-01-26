export {
  pos,
  coord,
  inBoard,
  getStone,
  setStone,
  cloneBoard,
  hasLiberty,
  isLegal,
  getLegalMoves,
  captureGroups,
};

const SIZE = 19;

/** get relative stone position */
function pos(x, y) {
  return y * SIZE + x;
}

/** get real stone position */
function coord(index) {
  return { x: index % SIZE, y: Math.floor(index / SIZE) };
}

/** stone position is valid */
function inBoard(x, y) {
  return x >= 0 && x < SIZE && y >= 0 && y < SIZE;
}

/** get stone */
function getStone(board, x, y) {
  return inBoard(x, y) ? board[pos(x, y)] : 0;
}

/** set stone */
function setStone(board, x, y, color) {
  if (inBoard(x, y)) board[pos(x, y)] = color;
}

function cloneBoard(board) {
  return new Int8Array(board);
}

function hasLiberty(board, x, y, color) {
  const visited = new Set();
  const queue = [{ x, y }];
  visited.add(pos(x, y));

  while (queue.length) {
    const { x: cx, y: cy } = queue.shift();
    for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      const nx = cx + dx, ny = cy + dy;
      if (!inBoard(nx, ny)) continue;
      const np = pos(nx, ny);
      if (board[np] === 0) return true;
      if (board[np] === color && !visited.has(np)) {
        visited.add(np);
        queue.push({ x: nx, y: ny });
      }
    }
  }
  return false;
}

function isLegal(board, x, y, color) {
  if (!inBoard(x, y) || board[pos(x, y)] !== 0) return false;

  const temp = cloneBoard(board);
  setStone(temp, x, y, color);

  if (hasLiberty(temp, x, y, color)) return true;

  for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
    const nx = x + dx, ny = y + dy;
    if (inBoard(nx, ny) && temp[pos(nx, ny)] === (3 - color)) {
      if (!hasLiberty(temp, nx, ny, 3 - color)) return true;
    }
  }
  return false;
}

function captureGroups(board, x, y, color) {
  const groups = [];
  for (const [dx, dy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
    const nx = x + dx, ny = y + dy;
    if (inBoard(nx, ny) && board[pos(nx, ny)] === (3 - color)) {
      if (!hasLiberty(board, nx, ny, 3 - color)) {
        const visited = new Set();
        const queue = [{ x: nx, y: ny }];
        while (queue.length) {
          const { x: qx, y: qy } = queue.shift();
          const p = pos(qx, qy);
          if (visited.has(p)) continue;
          visited.add(p);
          board[p] = 0;
          for (const [ddx, ddy] of [[0,1],[0,-1],[1,0],[-1,0]]) {
            const nnx = qx + ddx, nny = qy + ddy;
            if (inBoard(nnx, nny) && board[pos(nnx, nny)] === (3 - color)) {
              queue.push({ x: nnx, y: nny });
            }
          }
        }
      }
    }
  }
}

function getLegalMoves(board, color) {
  const moves = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (isLegal(board, x, y, color)) {
        moves.push({ x, y });
      }
    }
  }
  return moves;
}