import { validMoves } from './valid_moves';

export function isKingInCheck({ board, currentPlayer }) {
  const squaresToCheck = [];
  let currentPlayerKingPos = null;

  board.forEach((row, i) => {
    row.forEach((square, j) => {
      squaresToCheck.push([i, j]);
      const piece = board[i][j];
      const isCurrentPlayerKing = piece && piece.name.toLowerCase() == 'k' && piece.color === currentPlayer;
      if (isCurrentPlayerKing) {
        currentPlayerKingPos = [i, j];
      }
    });
  });

  return !!squaresToCheck.find((pieceCoord) => currentPlayerKingInEnemyPieceValidMoves({ pieceCoord, board, currentPlayer, currentPlayerKingPos }));
}

function currentPlayerKingInEnemyPieceValidMoves({ pieceCoord, board, currentPlayer, currentPlayerKingPos }) {
  const [i, j] = pieceCoord;
  const piece = board[i][j];
  const isEnemySquare = piece && piece.color !== currentPlayer;

  if (!isEnemySquare) return false;

  const enemyValidMoves = validMoves({ startingPos: pieceCoord, board });

  const kingPos = enemyValidMoves.find((newPos) => {
    return newPos[0] === currentPlayerKingPos[0] && newPos[1] === currentPlayerKingPos[1];
  });

  return !!kingPos;
}
