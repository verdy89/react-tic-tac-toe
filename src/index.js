import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={ props.onClick }>
      { props.value }
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={ this.props.squares[i] }
        onClick={ () => this.props.onClick(i) }
      />
    )
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

function Moves(props) {
  const moves = props.history.map((step, stepNumber) => {
    const [row, col] = step.move;
    const player = stepNumber % 2 === 0 ? 'O' : 'X';
    const description = stepNumber
      ? 'Go to move #' + stepNumber + ' : ' + player + '(' + row + ', ' + col + ')'
      : 'Go to game start';

    return (
      <li key={ stepNumber }>
        <button
          onClick={ () => props.jumpTo(stepNumber) }
          className={ props.selectedStepNumber === stepNumber ? 'selected' : '' }
        >{ description }</button>
      </li>
    );
  });

  return (
    <ol>{ moves }</ol>
  )
}

class Game extends React.Component {
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
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const newSquares = current.squares.slice();

    if (calculateWinner(current) || newSquares[i]) return;
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

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

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
            onClick={ (i) => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <Moves
            history={ this.state.history }
            selectedStepNumber={ this.state.selectedStepNumber }
            jumpTo={ (stepNumber) => this.jumpTo(stepNumber) }
          />
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
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

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

function convertIndexToRowCol(i) {
  const row = Math.floor(i / 3);
  const col = i - row * 3;
  return [row, col];
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
