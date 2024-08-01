import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  OnInit,
} from '@angular/core';
import { HttpService } from '@csd-services/http/http.service';
import { GET_ABOUT } from './consts/about.requests';
import { AboutService } from './services/about.service';
import { map, shareReplay } from 'rxjs';
import { AboutDTO } from './models/about.models';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'csd-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AboutService],
})
export class AboutComponent implements OnInit {
  @HostBinding('style.--primary-color')
  primaryColor: null | string = null;

  readonly about = toSignal(this.aboutService.about$);

  readonly owner$ = this.aboutService.owner$;

  constructor(private aboutService: AboutService) {}

  ngOnInit(): void {
    this.getPrimaryColor();
  }

  private getPrimaryColor() {
    this.aboutService.owner$
      .pipe(map((owner) => owner.primary_color))
      .subscribe((res) => (this.primaryColor = res));
  }
}
