import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { take, tap } from 'rxjs';
import { HttpService } from 'src/app/tools/services/http.service';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'status-check',
  templateUrl: './status-check.component.html',
  styleUrls: ['./status-check.component.scss'],
})
export class StatusCheckComponent implements OnInit {
  checkCount: number = 0;
  loading: boolean = true;

  constructor(
    private drop: PurchaseService,
    private http: HttpService
  ) { }

  ngOnInit(): void {
    setTimeout(() => this.getLicense(), 200);
  }

  getLicense(){
    if ( this.checkCount == 6 ){
      this.loading = false;
      return this.drop.$purchaseState.next('status-failed');
    }

    this.checkCount++;
    this.drop.getLicense()
      .pipe(take(1))
      .subscribe({
        error: () => setTimeout(() => this.getLicense(), 800)
      })
  }

}
