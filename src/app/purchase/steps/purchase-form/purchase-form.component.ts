import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PurchaseService } from '@csd-purchase/services/purсhase.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'csd-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseFormComponent {
  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  readonly loading$ = new BehaviorSubject(false);

  constructor(private prchService: PurchaseService) {}

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }
    this.loading$.next(true);
  }
}
