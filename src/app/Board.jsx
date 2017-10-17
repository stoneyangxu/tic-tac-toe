import React from 'react';
import _ from 'lodash';

import Square from './Square';

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const SQUARES_PER_LINE = 3;

    return _.chunk(this.props.squares, SQUARES_PER_LINE).map((line, lineIndex) => {
      const squares = line.map((square, squareIndex) => this.renderSquare((SQUARES_PER_LINE * lineIndex) + squareIndex));

      return (
        <div key={lineIndex} className="board-row">
          {squares}
        </div>
      );
    });
  }
}

export default Board;
