import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const nonBlank: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (typeof value === 'string' && value.trim() === '') {
    return { nonBlank: true };
  }
  return null;
};

export const distinctNames =
  (first: string, second: string): ValidatorFn =>
  (group: AbstractControl): ValidationErrors | null => {
    const firstName = group.get(first)?.value?.trim().toLowerCase();
    const secondName = group.get(second)?.value?.trim().toLowerCase();
    return firstName && firstName === secondName ? { sameNames: true } : null;
  };
