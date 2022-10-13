import React from 'react';
import Square from './square.js'

export default class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={ 'square' + i }
        value={ this.props.squares[i] }
        isWinSquare={ this.props.winSquares.includes(i) }
        onClick={ () => this.props.onClick(i) }
      />
    )
  }

  render() {
    let rows = [];
    for (let rowNum = 0; rowNum < 3; rowNum++) {
      let row = []
      for (let colNum = 0; colNum < 3; colNum++) {
        row.push(this.renderSquare(rowNum * 3 + colNum));
      }
      rows.push(<div key={ 'row' + rowNum } className="board-row">{ row }</div>)
    }

    return <div>{ rows }</div>;
  }
}
