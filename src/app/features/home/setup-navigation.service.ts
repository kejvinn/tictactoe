import { computed, Service, signal } from '@angular/core';

export type FormStep = 'local' | 'pre-game';

@Service()
export class SetupNavigationService {
  setupStep = signal<FormStep>('local');
  showBackButton = computed(() => this.setupStep() === 'pre-game');

  goTo(step: FormStep): void {
    this.setupStep.set(step);
  }

  goBack(): void {
    this.setupStep.set('local');
  }
}
