import { Component, inject } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { SetupNavigationService } from '../../setup-navigation.service';

type NameControl = 'player1Name' | 'player2Name';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-local-form',
  styleUrl: './local-form.component.scss',
  templateUrl: './local-form.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class LocalFormComponent {
  setup = inject(SetupNavigationService);
  private readonly parentForm = inject(FormGroupDirective);

  get local() {
    return this.parentForm.form.controls['local'];
  }

  nameError(controlName: NameControl): string | null {
    const control = this.local.get(controlName);
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
    if (controlName === 'player2Name' && this.local.hasError('sameNames')) {
      return 'Names must be different';
    }
    return null;
  }
}
