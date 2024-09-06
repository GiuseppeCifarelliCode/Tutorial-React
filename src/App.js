import {useState} from 'react';

function Square({value, onSquareClick, isWinningSquare}) {
  return (
  <button className={`square ${isWinningSquare ? 'winning-square' : ''}`} onClick={onSquareClick}>
    {value}
  </button>
  );
}

function Board({xIsNext, squares, onPlay}) {

  function renderBoard() {
    const board = [];

    for(let row = 0; row < 3; row++) {
      const rowSquares = [];

      for(let col = 0; col < 3; col++) {
        const index = row * 3 + col;
        rowSquares.push(
          <Square key={index} value={squares[index]} isWinningSquare = {winningLine.includes(index)} onSquareClick={() => handleClick(index)} />
        );
      }
      board.push(
        <div key={row} className='board-row'>{rowSquares}</div>
      );
    }
    return board;
  }

  function handleClick(i) {
    if(calculateWinner(squares) || squares[i]) {
      return;
    }
    
    const nextSquares = squares.slice();
    if(xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null
  const winningLine = winnerInfo ? winnerInfo.winningLine : []
  let status;
  if(winner) {
    status = "Winner: " + winner;
  } else if(squares.every(Boolean)) {
      status = "It's a draw!";
      } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
        }

  return <>
  <div className='status'>{status}</div>
  {renderBoard()}
  </>
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAscending, setIsAscending] = useState(true)

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleOrder(){
    setIsAscending(!isAscending);
  }

  const moves = history.map((squares, move) => {
    let description;
    if(move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    if(currentMove === move) {
      return (
      <li key={move}>
        <p>You are at move #{move}</p>
      </li>)
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      )
    }
  })

  const sortedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className='game-info'>
        <button onClick={toggleOrder}>
          {isAscending ? 'Sort Descending' : 'Sort Ascending'}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
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
    [2, 4, 6]
  ];
  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner:squares[a], winningLine: [a, b, c] };
    }
  }
  return null;
}
