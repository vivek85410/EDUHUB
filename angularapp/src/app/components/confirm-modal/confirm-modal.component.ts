import { Component } from '@angular/core';
import { ConfirmRequest, ConfirmService } from '../../services/confirm.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent {
  request$ = this.confirmService.request$;

  constructor(private confirmService: ConfirmService) {}

  respond(result: boolean): void {
    this.confirmService.respond(result);
  }
}
