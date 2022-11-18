import { Component, Input, OnInit } from '@angular/core';
import { LicenseReferral } from 'src/app/license-list/interfaces/license-referral';
import { ToolsService } from 'src/app/tools/services/tools.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit {
  @Input() referral!: LicenseReferral; 
  viewGifts: boolean = false;

  constructor(
    public tools: ToolsService
  ) { }

  ngOnInit(): void {
  }

}
