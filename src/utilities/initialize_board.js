export default function initializeBoard() {
  const board = [];

  const pawnsRowWhite = new Array(8).fill({ piece: 'P', color: 'W' });
  const pawnsRowBlack = new Array(8).fill({ piece: 'p', color: 'B' });
  const kingRowWhite = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'].map((l) => ({ piece: l, color: 'W' }));
  const kingRowBlack = kingRowWhite.map((p) => ({ piece: p.piece.toLowerCase(), color: 'B' }));
  const emptyRow = new Array(8).fill('');

  [kingRowBlack, pawnsRowBlack, emptyRow, emptyRow, emptyRow, emptyRow, pawnsRowWhite, kingRowWhite].forEach((row) => {
    board.push(row)
  });

  return board;
}
