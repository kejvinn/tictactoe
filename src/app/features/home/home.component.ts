import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { opposite } from '@core/engine/game-engine';
import { GameCount, Mark } from '@core/models/tournament.model';
import { TournamentStore } from '@core/store/tournament.store';
import { distinctNames, nonBlank } from './setup.validators';
import { LocalFormComponent } from './components/local-form/local-form.component';
import { PreGameFormComponent } from './components/pre-game-form/pre-game-form.component';
import { FormContainerComponent } from './components/form-container/form-container.component';
import { SetupNavigationService } from './setup-navigation.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { LeaderboardComponent } from '@shared/components/leaderboard/leaderboard.component';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LocalFormComponent,
    PreGameFormComponent,
    FormContainerComponent,
    ModalComponent,
    LeaderboardComponent,
  ],
  selector: 'app-home',
  styleUrl: './home.component.scss',
  templateUrl: './home.component.html',
  providers: [SetupNavigationService],
})
export class HomeComponent {
  fb = inject(NonNullableFormBuilder);
  setup = inject(SetupNavigationService);
  private readonly store = inject(TournamentStore);
  private readonly router = inject(Router);

  leaderboardOpen = signal(false);

  setupForm = this.fb.group({
    local: this.fb.group(
      {
        player1Name: ['', [Validators.required, nonBlank, Validators.maxLength(20)]],
        player2Name: ['', [Validators.required, nonBlank, Validators.maxLength(20)]],
      },
      { validators: distinctNames('player1Name', 'player2Name') },
    ),
    preGame: this.fb.group({
      player1Mark: ['X' as Mark],
      player2Mark: ['O' as Mark],
      totalGames: this.fb.control<GameCount | null>(null, Validators.required),
    }),
  });

  constructor() {
    const { player1Mark, player2Mark } = this.setupForm.controls.preGame.controls;
    player1Mark.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((mark) => player2Mark.setValue(opposite(mark), { emitEvent: false }));
    player2Mark.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((mark) => player1Mark.setValue(opposite(mark), { emitEvent: false }));
  }

  onSubmit(): void {
    const { local, preGame } = this.setupForm.getRawValue();

    if (this.setupForm.invalid || preGame.totalGames === null) {
      this.setupForm.markAllAsTouched();
      return;
    }

    this.store.start({
      players: [
        { name: local.player1Name.trim(), mark: preGame.player1Mark },
        { name: local.player2Name.trim(), mark: preGame.player2Mark },
      ],
      totalGames: preGame.totalGames,
    });
    this.router.navigate(['/game']);
  }
}
