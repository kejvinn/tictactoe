import { Service, signal } from '@angular/core';

export type FormStep = 'player-setup' | 'pre-game';

@Service()
export class SetupNavigationService {
  readonly setupStep = signal<FormStep>('player-setup');

  goTo(step: FormStep): void {
    this.setupStep.set(step);
  }
}
