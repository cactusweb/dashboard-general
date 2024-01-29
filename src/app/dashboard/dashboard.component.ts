import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { DashboardService } from './services/dashboard.service';
import { Store } from '@ngrx/store';
import { State } from '@csd-store/state';
import { GetLicenses } from '@csd-store/licenses/licenses.actions';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { RouterPaths } from '@csd-consts/router-paths.conts';

@Component({
  selector: 'csd-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  @HostBinding('style.--primary-color')
  primaryColor: null | string = null;

  constructor(
    private dashService: DashboardService,
    private store: Store<State>,
    private router: Router
  ) {}

  @HostListener('document:keydown.escape', ['$event'])
  onEscape() {
    this.router.navigate(['/' + RouterPaths.LICENSES]);
  }

  ngOnInit(): void {
    this.store.dispatch(new GetLicenses());
    this.primaryColorSetter();
  }

  private primaryColorSetter() {
    this.dashService.license$
      .pipe(map((lic) => lic?.owner.primary_color || null))
      .subscribe((res) => (this.primaryColor = res));
  }
}
