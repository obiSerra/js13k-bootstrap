export function generateMap(width, height, tsize = 4) {
  const tiles = [];
  const cols = width;
  const rows = height;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c === 0 || r === 0 || r === rows - 1 || c === cols - 1) {
        tiles.push(1);
      } else {
        tiles.push(0);
      }
    }
  }
  const map = {
    cols,
    rows,
    tsize,
    tiles,
    getTile: (col, row) => map.tiles[row * map.cols + col],
    renderTile: () => null,
  };

  return map;
}

export function setCamera(map, width, height) {
  if (!map) {
    console.error("Map is null");
    return;
  }

  const camera = {
    cameraPos: {
      x: map.cols / 2,
      y: map.rows / 2,
    },
    viewWidth: Math.ceil(width / map.tsize),
    viewHeight: Math.ceil(height / map.tsize),
  };

  return { ...map, ...camera };
}
