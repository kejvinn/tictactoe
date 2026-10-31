import { Component, inject } from '@angular/core';
import { SetupNavigationService } from '../../setup-navigation.service';

@Component({
  selector: 'app-form-container',
  styles: `
    .form-container {
      display: flex;
      flex-direction: column;
    }
  `,
  template: `
    <div class="form-container">
      @if (setup.showBackButton()) {
        <button type="button" (click)="setup.goBack()">Back</button>
      }
      <ng-content />
    </div>
  `,
})
export class FormContainerComponent {
  setup = inject(SetupNavigationService);
}
