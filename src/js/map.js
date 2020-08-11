export function generateMap(width, height, tsize = 4) {
  const tiles = [];
  const cols = width;
  const rows = height;
  let check = false;
  for (let i = 0; i < cols; i++) {
    check = !check;
    for (let j = 0; j < rows; j++) {
      tiles.push(+check);
      check = !check;
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

export function setCamera(map, startPos, width, height) {
  if (!map) {
    console.error("Map is null");
    return;
  }

  const camera = {
    cameraPos: startPos,
    viewWidth: Math.ceil(width / map.tsize),
    viewHeight: Math.ceil(height / map.tsize),
  };

  return { ...map, ...camera };
}
