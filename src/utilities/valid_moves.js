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

export function validMoves({ startingPos, board }) {
  const [i, j] = startingPos;
  const piece = board[i][j];

  const pieceName = piece.piece;

  switch (pieceName.toLowerCase()) {
    case 'p':
      return calculatePawnPositions({ startingPos, board, pieceName });
    case 'n':
      return calculateKnightPositions({ startingPos, board });
    case 'k':
      return calculateKingPositions({ startingPos, board });
    case 'r':
      return calculateRookPositions({ startingPos, board });
    case 'b':
      return calculateBishopPositions({ startingPos, board });
    case 'q':
      return calculateQueenPositions({ startingPos, board });
    default:
      return [];
  }
}

export function isValidMove({ newPos, startingPos, currentPlayer, board }) {
  // if moving to square containing a piece of same color as currentPlayer return false
  const newPosPiece = board[newPos[0]][newPos[1]];
  if (newPosPiece.color === currentPlayer) return false;

  const validPositions = validMoves({ startingPos, board });
  return !!validPositions.find((pos) => pos[0] == newPos[0] && pos[1] === newPos[1]);
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
  const directions = [[-2, -1], [-2, 1], [2, -1], [2, 1]];

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
