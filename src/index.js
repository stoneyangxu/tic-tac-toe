import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import _ from 'lodash'

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
    }

    render() {

        const SQUARES_PER_LINE = 3

        return _.chunk(this.props.squares, SQUARES_PER_LINE).map((line, lineIndex) => {

            const squares = line.map((square, squareIndex) => {
                return this.renderSquare(SQUARES_PER_LINE * lineIndex + squareIndex)
            })

            return (
                <div key={lineIndex} className="board-row">
                    {squares}
                </div>
            )
        })
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


class Game extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            steps: [],
            stepNumber: 0,
            xIsNext: true,
            selectedMove: -1
        }
    }


    handleClick(i) {

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = [...current.squares]

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O'

        this.setState({
            history: [
                ...history,
                { squares }
            ],
            steps: [
                ...this.state.steps,
                [i % 3 + 1, Math.floor(i / 3) + 1]
            ],
            xIsNext: !this.state.xIsNext,
            stepNumber: this.state.stepNumber + 1,
            winner: calculateWinner(squares)
        })
    }

    jumpTo(stepNumber) {
        this.setState({
            stepNumber,
            xIsNext: (stepNumber % 2 === 0),
            selectedMove: stepNumber
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares)
        let status;
        if (winner) {
            status = `Winner is ${winner}`
        } else {
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
        }

        const moves = this.state.history.map((step, move) => {

            const desc = move ? `Go to move #${move}` : 'Go to game start';

            let position = ''
            if (move > 0) {
                const stepPosition = this.state.steps[move - 1]
                position = `(${stepPosition[0]}, ${stepPosition[1]})`
            }

            const isCurrentSelectedMove = this.state.selectedMove === move

            return (
                <li key={move} className={isCurrentSelectedMove ? 'selected-move' : ''}>
                    <button onClick={() => this.jumpTo(move)}>
                        <span>
                            {desc}{position}
                        </span>
                    </button>
                </li>
            );
        })

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
