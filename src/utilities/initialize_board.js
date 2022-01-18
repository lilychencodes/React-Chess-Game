export default function initializeBoard() {
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
