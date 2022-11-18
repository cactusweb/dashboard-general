import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LicenseOwner } from 'src/app/license-list/interfaces/license-owner';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent implements OnInit {
  owner!: Observable<LicenseOwner>

  constructor(
    private dash: DashboardService
  ) { }

  ngOnInit(): void {
    this.getOwner();
  }

  getOwner(){
    this.owner = this.dash.getLicense()
      .pipe(
        map(d => d.owner)
      )
  }

}
