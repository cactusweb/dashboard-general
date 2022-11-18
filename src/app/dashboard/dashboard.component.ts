import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, Observable, take, tap } from 'rxjs';
import { License } from '../license-list/interfaces/license';
import { ToolsService } from '../tools/services/tools.service';
import { ActionComponent } from './components/action/action.component';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardService],
  host: {
    '[style.--primary-color]': 'primaryColor || ""',
  }
})
export class DashboardComponent implements OnInit, OnDestroy {
  license!: Observable<License>
  loading: boolean = false;
  primaryColor: string|undefined

  @ViewChild(ActionComponent) action!: ActionComponent
  
  constructor(
    private dash: DashboardService,
    private router: Router
  ) { 
    this.dash.setOwnerName();
  }

  
  @HostListener('document:keydown.escape', ['$event'])
  onEscape(e: KeyboardEvent){
    if ( this.action.showUnbindApprovement ) return
    this.router.navigate(['/licenses'])
  }

  ngOnInit(): void {
    this.license = this.dash.getLicense()
    
    this.dash.getLicense()
      .pipe(
        take(1),
        map(d => d.owner.primary_color),
        filter(d => !!d),
      )
      .subscribe(res => {
        this.primaryColor = res
        // document.body.setAttribute('style', `--bg-color: ${res}40`)
      })
  }

  ngOnDestroy(): void {
    this.dash.resetData();
    // document.body.removeAttribute('style')

  }

}
