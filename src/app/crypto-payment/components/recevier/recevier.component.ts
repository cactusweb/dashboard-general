import { Component, Input, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/tools/services/tools.service';

@Component({
  selector: 'app-recevier',
  templateUrl: './recevier.component.html',
  styleUrls: ['./recevier.component.scss']
})
export class RecevierComponent implements OnInit {
  @Input() address!: string

  constructor(
    public tools: ToolsService
  ) { }

  ngOnInit(): void {
  }

}
