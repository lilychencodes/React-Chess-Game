import { copyBoardAndMovePiece } from './board';
import { isKingInCheck } from './check';

function withinBound(coord) {
  return coord[0] >= 0 && coord[0] <= 7 && coord[1] >= 0 && coord[1] <= 7;
}

function isSquareEmpty(coord, board) {
  const [i, j] = coord;
  return !board[i][j];
}

function squareContainsEnemy({ pos, board, startingPosPiece }) {
  const [i, j] = pos;
  const newPosPiece = board[i][j];
  const containsEnemy = newPosPiece && newPosPiece.color !== startingPosPiece.color;
  return containsEnemy;
}

export function validMoves({ startingPos, board, currentPlayer }) {
  const [i, j] = startingPos;
  const piece = board[i][j];

  const pieceName = piece.name;

  let potentialPositions = [];

  switch (pieceName.toLowerCase()) {
    case 'p':
      potentialPositions = calculatePawnPositions({ startingPos, board, pieceName });
      break;
    case 'n':
      potentialPositions = calculateKnightPositions({ startingPos, board });
      break;
    case 'k':
      potentialPositions = calculateKingPositions({ startingPos, board });
      break;
    case 'r':
      potentialPositions = calculateRookPositions({ startingPos, board });
      break;
    case 'b':
      potentialPositions = calculateBishopPositions({ startingPos, board });
      break;
    case 'q':
      potentialPositions = calculateQueenPositions({ startingPos, board });
      break;
    default:
      return [];
  }

  // avoids infinite loop because isKingInCheck calls currentPlayerKingInEnemyPieceValidMoves, which calls this function
  if (!currentPlayer) {
    return potentialPositions;
  }

  const validPositions = [];

  potentialPositions.forEach((newPos) => {
    // TODO: valid move cannot put king in check (for opponent to kill king)
    // regardless of if king currently in check, move to new pos, check to see if king in check when piece in new pos
    const newBoard = copyBoardAndMovePiece({ board, oldPos: startingPos, newPos });
    const willCurrentPlayerKingBeInCheckAfterMove = isKingInCheck({ board: newBoard, currentPlayer });
    if (!willCurrentPlayerKingBeInCheckAfterMove) {
      validPositions.push(newPos);
    }
  });

  return validPositions;
}

function calculatePawnPositions({ startingPos, board, pieceName }) {
  const [i, j] = startingPos;
  const piece = board[i][j];
  const validPositions = [];

  const isWhitePawn = pieceName === 'P';
  const frontCoord = isWhitePawn ? [i - 1, j] : [i + 1, j];
  const frontTwo = isWhitePawn ? [i - 2, j] : [i + 2, j];
  const frontRight = isWhitePawn ? [i - 1, j - 1] : [i + 1, j - 1];
  const frontLeft = isWhitePawn ? [i - 1, j + 1] : [i + 1, j + 1];

  if (withinBound(frontCoord) && isSquareEmpty(frontCoord, board)) {
    validPositions.push(frontCoord);
  }

  [frontRight, frontLeft].forEach((pos) => {
    if (withinBound(pos) && squareContainsEnemy({ pos, board, startingPosPiece: piece })) {
      validPositions.push(pos);
    }
  });

  const pawnHasntMoved = (isWhitePawn && i === 6) || (!isWhitePawn && i === 1);

  // if pawn hasn't moved, can move two to the front
  if (pawnHasntMoved && isSquareEmpty(frontTwo, board)) {
    validPositions.push(frontTwo);
  }

  return validPositions;
}

function calculateKnightPositions({ startingPos, board }) {
  const directions = [[-2, -1], [-2, 1], [2, -1], [2, 1], [1, 2], [1, -2], [-1, 2], [-1, -2]];

  return calculatePositionsWithDirections({ startingPos, board, directions });
}

function calculateKingPositions({ startingPos, board }) {
  const directions = [[1, 1], [1, 0], [1, -1], [0, -1], [0, 1], [-1, -1], [-1, 0], [-1, 1]];

  return calculatePositionsWithDirections({ startingPos, board, directions });
}

function calculateBishopPositions({ startingPos, board }) {
  const directions = [[1, 1], [1, -1], [-1, -1], [-1, 1]];

  return calculateSlidingPositionsWithDirections({ startingPos, board, directions });
}

function calculateRookPositions({ startingPos, board }) {
  const directions = [[1, 0], [0, -1], [0, 1], [-1, 0]];

  return calculateSlidingPositionsWithDirections({ startingPos, board, directions });
}

function calculateQueenPositions({ startingPos, board }) {
  const directions = [[1, 1], [1, 0], [1, -1], [0, -1], [0, 1], [-1, -1], [-1, 0], [-1, 1]];

  return calculateSlidingPositionsWithDirections({ startingPos, board, directions });
}

function calculatePositionsWithDirections({ startingPos, board, directions }) {
  const [i, j] = startingPos;
  const piece = board[i][j];
  const validPositions = [];

  directions.forEach((dir) => {
    const newPos = [i + dir[0], j + dir[1]];
    if (withinBound(newPos) && (isSquareEmpty(newPos, board) || squareContainsEnemy({ pos: newPos, board, startingPosPiece: piece }))) {
      validPositions.push(newPos);
    }
  });

  return validPositions;
}

function calculateSlidingPositionsWithDirections({ startingPos, board, directions }) {
  const [i, j] = startingPos;
  const piece = board[i][j];
  const validPositions = [];

  directions.forEach((dir) => {
    let newPos = [i + dir[0], j + dir[1]];

    while (withinBound(newPos) && isSquareEmpty(newPos, board)) {
      validPositions.push(newPos);
      newPos = [newPos[0] + dir[0], newPos[1] + dir[1]];
    }

    if (withinBound(newPos) && squareContainsEnemy({ pos: newPos, board, startingPosPiece: piece })) {
      validPositions.push(newPos);
    }
  });

  return validPositions;
}
