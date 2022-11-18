import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { License } from './interfaces/license';
import { LicensesService } from './services/licenses.service';

@Component({
  selector: 'app-license-list',
  templateUrl: './license-list.component.html',
  styleUrls: ['./license-list.component.scss']
})
export class LicenseListComponent implements OnInit {
  licenses!: Observable<License[]>

  constructor(
    private lic: LicensesService
  ) { }

  ngOnInit(): void {
    this.licenses = this.lic.getLicenses(true)
  }

  trackLicense(index: any, item: License){
    return item.id
  }

}
