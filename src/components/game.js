import React from 'react';
import Board from './board.js'
import Moves from './moves.js'

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        move: Array(2).fill(null),
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      selectedStepNumber: null,
      movesAscendingOrder: true,
      winSquares: Array(3).fill(null),
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const newSquares = current.squares.slice();

    if (this.calculateWinner(current.squares)['winner'] || newSquares[i]) return;
    newSquares[i] = this.state.xIsNext ? 'X' : 'O';
    const [row, col] = convertIndexToRowCol(i);

    this.setState({
      history: history.concat([{
        move: [row, col],
        squares: newSquares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      selectedStepNumber: null,
    });
  }

  jumpTo(stepNumber) {
    this.setState({
      stepNumber: stepNumber,
      xIsNext: (stepNumber % 2) === 0,
      selectedStepNumber: stepNumber,
    });
  }

  reverseMoves() {
    this.setState({
      movesAscendingOrder: !this.state.movesAscendingOrder
    })
    console.log(this.state.movesAscendingOrder)
  }

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    let winSquares = [];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];

      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        // 2列以上揃えて勝つ可能性があるので、この時点で return はできない
        winSquares = winSquares.concat(lines[i]);
      }
    }

    if (winSquares.length > 0) {
      return { winner: squares[winSquares[0]], winSquares: winSquares };
    }

    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        return { winner: null, winSquares: [] };
      }
    }

    return { winner: 'Draw', winSquares: [] };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerInfo = this.calculateWinner(current.squares);
    const winner = winnerInfo['winner']
    const winSquares = winnerInfo['winSquares']

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={ current.squares }
            winSquares={ winSquares }
            onClick={ (i) => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <Moves
            history={ this.state.history }
            isAscendingOrder={ this.state.movesAscendingOrder }
            selectedStepNumber={ this.state.selectedStepNumber }
            jumpTo={ (stepNumber) => this.jumpTo(stepNumber) }
          />
          <button onClick={ () => this.reverseMoves() }>Reverse Moves</button>
        </div>
      </div>
    );
  }
}

function convertIndexToRowCol(i) {
  const row = Math.floor(i / 3);
  const col = i - row * 3;
  return [row, col];
}
