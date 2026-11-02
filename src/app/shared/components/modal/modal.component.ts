import { Component, effect, ElementRef, input, model, viewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  styleUrl: './modal.component.scss',
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  readonly open = model(false);
  readonly heading = input.required<string>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.open() && !dialog.open) {
        dialog.showModal();
      }
      if (!this.open() && dialog.open) {
        dialog.close();
      }
    });
  }
}
