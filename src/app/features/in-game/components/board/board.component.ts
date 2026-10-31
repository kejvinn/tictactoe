import { Component, input, output } from '@angular/core';
import { Board } from '../../../../core/models/tournament.model';

@Component({
  selector: 'app-board',
  template: `
    <div class="board">
      @for (mark of board(); track $index) {
        <button
          type="button"
          class="cell"
          [class.winning]="winningLine()?.includes($index)"
          [disabled]="locked() || mark"
          (click)="cellSelected.emit($index)"
        >
          {{ mark }}
        </button>
      }
    </div>
  `,
  styles: `
    .board {
      display: grid;
      grid-template-columns: repeat(3, 5rem);
      gap: 0.25rem;
    }

    .cell {
      aspect-ratio: 1;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      background: var(--color-surface);
      color: var(--color-text);
      font-size: 2.5rem;
    }

    .winning {
      outline: 4px solid var(--color-accent);
      text-decoration: underline;
    }
  `,
})
export class BoardComponent {
  board = input.required<Board>();
  winningLine = input<readonly number[] | null>(null);
  locked = input(false);
  cellSelected = output<number>();
}
