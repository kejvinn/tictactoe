import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TournamentStore } from '../../core/store/tournament.store';

export const tournamentGuard: CanActivateFn = () =>
  inject(TournamentStore).players() ? true : inject(Router).createUrlTree(['/']);
