import { Component, inject } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { GameCount, Mark } from '../../../../core/models/tournament.model';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-pre-game-form',
  styleUrl: './pre-game-form.component.scss',
  templateUrl: './pre-game-form.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class PreGameFormComponent {
  private readonly parentForm = inject(FormGroupDirective);

  readonly marks: readonly Mark[] = ['X', 'O'];
  readonly gameCounts: readonly GameCount[] = [1, 3, 5];

  totalGamesError(): string | null {
    const control = this.parentForm.form.get('preGame.totalGames');
    return control?.touched && control.invalid ? 'Choose how many games to play' : null;
  }
}
