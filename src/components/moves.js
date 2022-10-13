import React from 'react';

export default function Moves(props) {
  const history = props.isAscendingOrder ? props.history : props.history.slice().reverse();
  const moves = history.map((step, index) => {
    const stepNumber = props.isAscendingOrder ? index : history.length - 1 - index;
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
