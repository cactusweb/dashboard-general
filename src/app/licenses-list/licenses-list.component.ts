import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Requests } from '@csd-consts/requests.consts';
import { HttpService } from '@csd-services/http/http.service';

@Component({
  selector: 'csd-licenses-list',
  templateUrl: './licenses-list.component.html',
  styleUrls: ['./licenses-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicensesListComponent implements OnInit {
  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.http.request(Requests.GET_LICENSES).subscribe();
  }
}
