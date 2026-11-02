import { Component, inject } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { SetupNavigationService } from '@features/home/setup-navigation.service';

type NameControl = 'player1Name' | 'player2Name';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-player-setup-form',
  styleUrl: './player-setup-form.component.scss',
  templateUrl: './player-setup-form.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class PlayerSetupFormComponent {
  readonly setup = inject(SetupNavigationService);
  private readonly parentForm = inject(FormGroupDirective);

  get playerSetup() {
    return this.parentForm.form.controls['playerSetup'];
  }

  nameError(controlName: NameControl): string | null {
    if (controlName === 'player2Name' && this.playerSetup.touched && this.playerSetup.hasError('sameNames')) {
      return 'Names must be different';
    }

    const control = this.playerSetup.get(controlName);
    if (!control?.touched) {
      return null;
    }
    if (control.hasError('required')) {
      return 'Name is required';
    }
    if (control.hasError('nonBlank')) {
      return 'Name cannot be only spaces';
    }
    if (control.hasError('maxlength')) {
      return 'Name can be at most 20 characters';
    }
    return null;
  }
}
