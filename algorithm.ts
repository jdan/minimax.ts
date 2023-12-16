export interface Position {
  isPlayerOne: boolean;
  isTerminal(): boolean;
  moves(): Position[];
  evaluate(): number;
}

/**
 * Standard minimax algorithm, where the current player attempts to maximize
 * against an opponent attempting to minimize.
 *
 * @param position
 * @param depth
 * @param maximizingPlayer
 * @returns An evaluation of the position
 */
export function minimax(
  position: Position,
  depth: number,
  maximizingPlayer: boolean
): number {
  if (depth == 0 || position.isTerminal()) {
    return position.evaluate();
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (let child of position.moves()) {
      let evaluation = minimax(child, depth - 1, false);
      maxEval = Math.max(maxEval, evaluation);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let child of position.moves()) {
      let evaluation = minimax(child, depth - 1, true);
      minEval = Math.min(minEval, evaluation);
    }
    return minEval;
  }
}

/**
 * An implementation of the minimax algorithm with alpha-beta pruning.
 *
 * @param position
 * @param depth
 * @param alpha
 * @param beta
 * @param maximizingPlayer
 * @returns An evaluation of the position
 */
export function minimaxAB(
  position: Position,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean
): number {
  if (depth == 0 || position.isTerminal()) {
    return position.evaluate();
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (let child of position.moves()) {
      let evaluation = minimaxAB(child, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) {
        break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let child of position.moves()) {
      let evaluation = minimaxAB(child, depth - 1, alpha, beta, true);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) {
        break;
      }
    }
    return minEval;
  }
}
