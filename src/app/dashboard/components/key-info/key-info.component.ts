import { Component, Input, OnInit } from '@angular/core';
import { finalize, take } from 'rxjs';
import { License } from 'src/app/license-list/interfaces/license';
import { LicensesService } from 'src/app/license-list/services/licenses.service';
import { ToolsService } from 'src/app/tools/services/tools.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-key-info',
  templateUrl: './key-info.component.html',
  styleUrls: ['./key-info.component.scss']
})
export class KeyInfoComponent implements OnInit {
  @Input() license!: License|null;
  loading: boolean = false;

  constructor(
    private dash: DashboardService,
    public tools: ToolsService
  ) { }

  ngOnInit(): void {
  }

  onReset(){
    this.loading = true;

    this.dash.resetLicense()
      .pipe(
        take(1),
        finalize(() => this.loading = false)
      )
      .subscribe({
        error: () => {}
      })
  }

}
