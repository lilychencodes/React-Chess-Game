export function initializeBoard() {
  const board = [];

  const pawnsRowWhite = new Array(8).fill({ name: 'P', color: 'W' });
  const pawnsRowBlack = new Array(8).fill({ name: 'p', color: 'B' });
  const kingRowWhite = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'].map((l) => ({ name: l, color: 'W' }));
  const kingRowBlack = kingRowWhite.map((p) => ({ name: p.name.toLowerCase(), color: 'B' }));
  const emptyRow = new Array(8).fill('');

  [kingRowBlack, pawnsRowBlack, emptyRow, emptyRow, emptyRow, emptyRow, pawnsRowWhite, kingRowWhite].forEach((row) => {
    board.push(row)
  });

  return board;
}

export function copyBoardAndMovePiece({ board, oldPos, newPos }) {
  const newBoard = [];
  board.forEach((row, rowIdx) => {
    newBoard.push([]);
    row.forEach((square, colIdx) => {
      newBoard[rowIdx].push(square)
    });
  });

  const pickedPiece = board[oldPos[0]][oldPos[1]];
  newBoard[newPos[0]][newPos[1]] = pickedPiece;
  newBoard[oldPos[0]][oldPos[1]] = '';

  // If pawn reaches the end, it becomes a Queen
  if (pickedPiece.name === 'P' && newPos[0] === 0) {
    newBoard[newPos[0]][newPos[1]] = { name: 'Q', color: pickedPiece.color };
  } else if (pickedPiece.name === 'p' && newPos[0] === 7) {
    newBoard[newPos[0]][newPos[1]] = { name: 'q', color: pickedPiece.color };
  }

  return newBoard;
}
