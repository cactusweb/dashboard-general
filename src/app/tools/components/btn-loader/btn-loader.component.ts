import { Component, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'btn-loader',
  templateUrl: './btn-loader.component.html',
  styleUrls: ['./btn-loader.component.scss']
})
export class BtnLoaderComponent {
  @Input() text: string = '';
  @Input() loading: boolean = false;

  
  // на изменение параметра включаем или выключаем спиннер
  @Input() set isSpinner( show: boolean ){
    if ( show ) this.spinner.show();
    else this.spinner.hide()

    this.loading = show;
  }

  constructor(
    private spinner: NgxSpinnerService
  ) { }


}
