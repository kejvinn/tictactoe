import { Component, input, output } from '@angular/core';
import { Board } from '@core/models/tournament.model';

const X_ART = ['#.....#', '.#...#.', '..#.#..', '...#...', '..#.#..', '.#...#.', '#.....#'];
const O_ART = ['..###..', '.#...#.', '#.....#', '#.....#', '#.....#', '.#...#.', '..###..'];

@Component({
  selector: 'app-board',
  template: `
    <div class="board" [class.has-winner]="winningLine()">
      @for (mark of board(); track $index) {
        <button
          type="button"
          class="cell"
          [class.winning]="winningLine()?.includes($index)"
          [disabled]="locked() || mark"
          (click)="cellSelected.emit($index)"
        >
          @if (mark === 'X') {
            <svg class="mark x" viewBox="0 0 7 7" shape-rendering="crispEdges">
              <path [attr.d]="xPath" />
            </svg>
          } @else if (mark === 'O') {
            <svg class="mark o" viewBox="0 0 7 7" shape-rendering="crispEdges">
              <path [attr.d]="oPath" />
            </svg>
          }
        </button>
      }
    </div>
  `,
  styles: `
    .board {
      display: grid;
      grid-template-columns: repeat(3, min(26vw, 7rem));
      gap: 0.5rem;
      animation: fadeIn 0.3s steps(4);
    }

    .cell {
      aspect-ratio: 1;
      display: grid;
      place-items: center;
      padding: 0;
      border: 3px solid var(--color-border);
      background: var(--color-surface);
      box-shadow: inset 0 0 8px var(--color-accent);
      transition: box-shadow 0.15s steps(3);
    }

    .cell:enabled {
      cursor: pointer;
    }

    .cell:enabled:hover {
      box-shadow:
        inset 0 0 8px var(--color-accent),
        0 0 14px var(--color-accent);
    }

    .has-winner .cell:not(.winning) {
      opacity: 0.35;
    }

    .mark {
      width: 60%;
      height: 60%;
      animation: pop 0.25s steps(4);
    }

    .x {
      fill: var(--color-x);
      filter: drop-shadow(0 0 4px var(--color-x)) drop-shadow(0 0 10px var(--color-x));
    }

    .o {
      fill: var(--color-o);
      filter: drop-shadow(0 0 4px var(--color-o)) drop-shadow(0 0 10px var(--color-o));
    }

    .winning .mark {
      animation:
        pop 0.25s steps(4),
        pulse 0.5s steps(2) 0.25s infinite alternate;
    }
  `,
})
export class BoardComponent {
  readonly board = input.required<Board>();
  readonly winningLine = input<readonly number[] | null>(null);
  readonly locked = input(false);
  readonly cellSelected = output<number>();

  readonly xPath = pixelPath(X_ART);
  readonly oPath = pixelPath(O_ART);
}

function pixelPath(art: string[]): string {
  return art
    .flatMap((row, y) => [...row].map((pixel, x) => (pixel === '#' ? `M${x} ${y}h1v1h-1z` : '')))
    .join('');
}
