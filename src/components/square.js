import React from 'react';

export default function Square(props) {
  return (
    <button
      className={"square" + (props.isWinSquare ? ' win-square' : '')}
      onClick={ props.onClick }
    >
      { props.value }
    </button>
  );
}
