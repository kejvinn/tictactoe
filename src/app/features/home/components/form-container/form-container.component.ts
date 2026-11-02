import { Component, inject } from '@angular/core';
import { SetupNavigationService } from '@features/home/setup-navigation.service';

@Component({
  selector: 'app-form-container',
  styles: `
    .form-container {
      display: flex;
      flex-direction: column;
      gap: var(--space);
      text-align: left;
    }

    button {
      align-self: flex-start;
    }
  `,
  template: `
    <div class="form-container">
      @if (setup.setupStep() === 'pre-game') {
        <button type="button" (click)="setup.goTo('player-setup')">Back</button>
      }
      <ng-content />
    </div>
  `,
})
export class FormContainerComponent {
  readonly setup = inject(SetupNavigationService);
}
