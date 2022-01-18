import React from 'react';

import initializeBoard from '../utilities/initialize_board';
import { isValidMove, validMoves } from '../utilities/valid_moves';

import KingB from '../pieces/king_b.png';
import QueenB from '../pieces/queen_b.png';
import RookB from '../pieces/rook_b.png';
import KnightB from '../pieces/knight_b.png';
import BishopB from '../pieces/bishop_b.png';
import PawnB from '../pieces/pawn_b.png';
import KingW from '../pieces/king_w.png';
import QueenW from '../pieces/queen_w.png';
import RookW from '../pieces/rook_w.png';
import KnightW from '../pieces/knight_w.png';
import BishopW from '../pieces/bishop_w.png';
import PawnW from '../pieces/pawn_w.png';

import './Board.scss';

const pieceToPic = {
  'p': PawnB,
  'P': PawnW,
  'k': KingB,
  'K': KingW,
  'q': QueenB,
  'Q': QueenW,
  'n': KnightB,
  'N': KnightW,
  'r': RookB,
  'R': RookW,
  'b': BishopB,
  'B': BishopW,
}

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    const initialBoard = initializeBoard();

    this.state = {
      board: initialBoard,
      currentlyClickedPiecePosition: null,
      currentPlayer: 'W',
      validNewPositions: [],
    };
  }

  handleSquareClick(position) {
    const { currentlyClickedPiecePosition, board, currentPlayer } = this.state;
    const [i, j] = position;
    const piece = board[i][j];
    const positionContainsPiece = !!piece;

    // if it's not your turn and you pick up your color, do nothing
    // if it's picking up a piece, set currentlyClickedPiecePosition to position (for highlight)
    const isPickingUpPiece = !currentlyClickedPiecePosition && positionContainsPiece;
    if (isPickingUpPiece && piece.color === currentPlayer) {
      const validNewPositions = validMoves({ startingPos: [i, j], board });
      return this.setState({
        currentlyClickedPiecePosition: [i, j],
        validNewPositions,
      });
    }

    // if clicked square is same as currentlyClickedPiecePosition, remove highlight
    if (currentlyClickedPiecePosition && i === currentlyClickedPiecePosition[0] && j === currentlyClickedPiecePosition[1]) {
      return this.setState({
        currentlyClickedPiecePosition: null,
        validNewPositions: [],
      });
    }

    // if it's dropping off a piece, check if move is valid. Yes -> drop piece, switch turn. No -> do nothing
    const isDroppingOffPiece = currentlyClickedPiecePosition && (i !== currentlyClickedPiecePosition[0] || j !== currentlyClickedPiecePosition[1]);

    if (!isDroppingOffPiece) return;

    const canMove = isValidMove({
      newPos: position,
      startingPos: currentlyClickedPiecePosition,
      currentPlayer,
      board,
    });

    if (!canMove) return;

    const newBoard = [];
    board.forEach((row, rowIdx) => {
      newBoard.push([]);
      row.forEach((square, colIdx) => {
        newBoard[rowIdx].push(square)
      });
    });

    const pickedPiece = board[currentlyClickedPiecePosition[0]][currentlyClickedPiecePosition[1]];
    newBoard[i][j] = pickedPiece;
    newBoard[currentlyClickedPiecePosition[0]][currentlyClickedPiecePosition[1]] = '';

    this.setState({
      currentPlayer: currentPlayer === 'W' ? 'B' : 'W',
      board: newBoard,
      currentlyClickedPiecePosition: null,
      validNewPositions: []
    });
  }

  render() {
    const { board, currentlyClickedPiecePosition, validNewPositions } = this.state;

    return (
      <div className="board">
        {board.map((row, i) => {
          return (
            row.map((square, j) => {
              const img = pieceToPic[square.piece];
              const isClicked = currentlyClickedPiecePosition && (currentlyClickedPiecePosition[0] === i && currentlyClickedPiecePosition[1] === j);
              const isValidNewPosition = !!validNewPositions.find((pos) => (pos[0] === i && pos[1] === j));
              return (
                <div
                  className={`board-square ${isClicked && 'board-square-highlight'} ${isValidNewPosition && 'board-square-new-potential-position'}`}
                  onClick={() => this.handleSquareClick([i, j])}
                  key={`${i}-${j}`}>
                  {img ? <img src={img} className="square-piece" /> : null}
                </div>
              )
            })
          )
        })}
      </div>
    )
  }
}
