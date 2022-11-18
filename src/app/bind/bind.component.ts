import { AfterContentInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { LicensesService } from '../license-list/services/licenses.service';

@Component({
  selector: 'app-bind',
  templateUrl: './bind.component.html',
  styleUrls: ['./bind.component.scss']
})
export class BindComponent implements OnInit, AfterContentInit {
  form!: FormGroup
  loading: boolean = false;

  @ViewChild('input') input!: ElementRef

  @Output() onClose = new EventEmitter();

  constructor(
    private lic: LicensesService,
  ) { }

  ngOnInit(): void {
    this.generateForm()
  }

  ngAfterContentInit(): void {
    setTimeout(() => this.input.nativeElement.focus(), 1);
  }
  
  @HostListener('document:keydown.escape', ['$event'])
  onEscape(e: KeyboardEvent){
    this.onClose.emit();
  }

  generateForm(){
    this.form = new FormGroup({
      key: new FormControl(null, Validators.required)
    })
  }

  onBind(){
    this.form.markAllAsTouched();

    if ( this.form.invalid ) return;

    this.loading = true;
    this.lic.bindLicense( this.form.value )
      .pipe(
        take(1),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {},
        error: (e) => {console.log(e)}
      })
  }

}
