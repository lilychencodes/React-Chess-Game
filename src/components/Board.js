import React from 'react';

import { initializeBoard, copyBoardAndMovePiece } from '../utilities/board';
import { validMoves } from '../utilities/valid_moves';
import { isKingInCheck } from '../utilities/check';

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
      winner: null,
      currentPlayerInCheck: false,
      capturedPieces: [],
    };
  }

  handleSquareClick(position) {
    const { currentlyClickedPiecePosition, board, currentPlayer, winner, capturedPieces } = this.state;

    if (winner) return;

    const [i, j] = position;
    const piece = board[i][j];
    const positionContainsPiece = !!piece;

    // if it's not your turn and you pick up your color, do nothing
    // if picking up a piece and king in check, must pick up king, or move another piece so king no longer in check
    // if it's picking up a piece, set currentlyClickedPiecePosition to position (for highlight)
    const isPickingUpPiece = !currentlyClickedPiecePosition && positionContainsPiece;

    if (isPickingUpPiece && piece.color === currentPlayer) {
      const validNewPositions = validMoves({ startingPos: [i, j], board, currentPlayer });

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

    const canMove = !!this.state.validNewPositions.find((pos) => pos[0] == i && pos[1] === j);

    if (!canMove) return;

    if (piece) {
      // add to list of captured pieces
      const newCapturedPieces = [
        ...capturedPieces,
        piece,
      ];

      this.setState({ capturedPieces: newCapturedPieces });

      // if king got killed, game over
      if (piece.name.toLowerCase() === 'k') {
        console.log('Checkmate, setting winner because captured opponent king');
        this.setState({
          winner: currentPlayer,
        });
      }
    }

    const newCurrentPlayer = currentPlayer === 'W' ? 'B' : 'W';

    const newBoard = copyBoardAndMovePiece({ board, oldPos: currentlyClickedPiecePosition, newPos: position });

    const newPlayerInCheck = isKingInCheck({ board: newBoard, currentPlayer: newCurrentPlayer });
    this.setState({
      currentPlayer: newCurrentPlayer,
      board: newBoard,
      currentlyClickedPiecePosition: null,
      validNewPositions: [],
      currentPlayerInCheck: newPlayerInCheck,
    });

    // Check for check mate
    if (newPlayerInCheck) {
      const noValidMovesLeft = false;
      if (noValidMovesLeft) {
        console.log(`Checkmate, ${currentPlayer} won because ${newCurrentPlayer} does not have valid moves`);
        return this.setState({
          winner: currentPlayer === 'W' ? 'B' : 'W',
        });
      }
    }
  }

  render() {
    const { board, currentlyClickedPiecePosition, validNewPositions, winner, currentPlayerInCheck, currentPlayer, capturedPieces } = this.state;

    return (
      <div>
        <div className="board">
          {board.map((row, i) => {
            return (
              row.map((square, j) => {
                const image = pieceToPic[square.name];
                const isClicked = currentlyClickedPiecePosition && (currentlyClickedPiecePosition[0] === i && currentlyClickedPiecePosition[1] === j);
                const isValidNewPosition = !!validNewPositions.find((pos) => (pos[0] === i && pos[1] === j));
                const kingInCheckPiece = square.name && square.name.toLowerCase() === 'k' && currentPlayerInCheck && square.color === currentPlayer;
                const isLightSquare = (i % 2 === 0 && j % 2 === 0) || (i % 2 !== 0 && j % 2 !== 0);
                return (
                  <div
                    className={`board-square ${isLightSquare ? 'board-square-light' : 'board-square-dark'} ${kingInCheckPiece && 'board-square-check'} ${isClicked && 'board-square-highlight'} ${isValidNewPosition && 'board-square-new-potential-position'}`}
                    onClick={() => this.handleSquareClick([i, j])}
                    key={`${i}-${j}`}>
                    {image ? <img src={image} className="square-piece" /> : null}
                  </div>
                )
              })
            )
          })}
        </div>
        <div className="captured-pieces">
          {capturedPieces.map((piece, idx) => {
            const image = pieceToPic[piece.name];
            return (
              <img key={idx} src={image} className="square-piece" />
            )
          })}
        </div>
        {winner && <div className="winner">Game over: {winner} won!</div>}
      </div>
    )
  }
}
