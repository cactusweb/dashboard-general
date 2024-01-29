import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
} from '@angular/core';
import { PurchaseService } from './services/purсhase.service';
import { map } from 'rxjs';
import { PurchaseSteps } from './models/purchase.models';

@Component({
  selector: 'csd-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
  providers: [PurchaseService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseComponent implements OnInit {
  @HostBinding('style.--primary-color')
  primaryColor: null | string = null;

  readonly step$ = this.prchService.step$;

  readonly PurchaseSteps = PurchaseSteps;

  constructor(private prchService: PurchaseService) {}

  ngOnInit(): void {
    this.getPrimaryColor();
  }

  private getPrimaryColor() {
    this.prchService.owner$
      .pipe(map((owner) => owner.primary_color))
      .subscribe((res) => (this.primaryColor = res));
  }
}
