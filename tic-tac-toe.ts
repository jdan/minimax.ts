import { Position, minimaxAB } from "./algorithm";
import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true });

class TicTacToe implements Position {
  private board: number[][];
  public isPlayerOne: boolean;

  constructor(board: number[][], isPlayerOne: boolean) {
    this.board = board;
    this.isPlayerOne = isPlayerOne;
  }

  isTerminal(): boolean {
    return this.winner() != 0 || this.moves().length == 0;
  }

  evaluate(): number {
    if (this.playerOneWins()) {
      return 1;
    } else if (this.playerTwoWins()) {
      return -1;
    } else {
      return 0;
    }
  }

  playerOneWins(): boolean {
    return this.winner() == 1;
  }

  playerTwoWins(): boolean {
    return this.winner() == 2;
  }

  winner(): number {
    // Check rows
    for (let row of this.board) {
      if (row[0] == row[1] && row[1] == row[2]) {
        return row[0];
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (
        this.board[0][i] == this.board[1][i] &&
        this.board[1][i] == this.board[2][i]
      ) {
        return this.board[0][i];
      }
    }

    // Check diagonals
    if (
      this.board[0][0] == this.board[1][1] &&
      this.board[1][1] == this.board[2][2]
    ) {
      return this.board[0][0];
    }
    if (
      this.board[0][2] == this.board[1][1] &&
      this.board[1][1] == this.board[2][0]
    ) {
      return this.board[0][2];
    }

    return 0;
  }

  moves(): TicTacToe[] {
    const moves: TicTacToe[] = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        try {
          let move = this.move(i, j);
          moves.push(move);
        } catch (e) {
          // Do nothing
        }
      }
    }

    return moves;
  }

  move(i: number, j: number): TicTacToe {
    if (this.board[i][j] != 0) {
      throw new Error("Invalid move");
    }

    let newBoard = this.copyBoard();
    newBoard[i][j] = this.nextPlayer();
    return new TicTacToe(newBoard, !this.isPlayerOne);
  }

  private copyBoard(): number[][] {
    let newBoard: number[][] = [];
    for (let i = 0; i < 3; i++) {
      newBoard.push([]);
      for (let j = 0; j < 3; j++) {
        newBoard[i].push(this.board[i][j]);
      }
    }
    return newBoard;
  }

  private nextPlayer(): number {
    let count = 0;
    for (let row of this.board) {
      for (let cell of row) {
        if (cell != 0) {
          count++;
        }
      }
    }
    return count % 2 == 0 ? 1 : 2;
  }

  toString(): string {
    let str = "";
    for (let row of this.board) {
      for (let cell of row) {
        str += cell == 0 ? "." : cell == 1 ? "X" : "O";
      }
      str += "\n";
    }
    return str;
  }
}

let game = new TicTacToe(
  [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  true
);

// I wonder if you need a higher depth than 2
const SEARCH_DEPTH = 2;

while (!game.isTerminal()) {
  console.log(game.toString());

  if (game.isPlayerOne) {
    let i = parseInt(prompt("Enter row: ") ?? 0);
    let j = parseInt(prompt("Enter column: ") ?? 0);
    try {
      game = game.move(i, j);
    } catch (e) {
      console.log("Invalid move");
    }
  } else {
    let score = minimaxAB(game, SEARCH_DEPTH, -Infinity, Infinity, false);
    console.log("Score: " + score);
    // Instead of minimax'ing again... maybe minimax should return the move?
    for (let move of game.moves()) {
      if (
        minimaxAB(move, SEARCH_DEPTH - 1, -Infinity, Infinity, true) == score
      ) {
        game = move;
        break;
      }
    }
  }
}

console.log(game.toString());
