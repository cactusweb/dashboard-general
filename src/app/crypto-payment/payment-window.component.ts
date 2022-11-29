import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, distinctUntilChanged, take, finalize } from 'rxjs';
import { Requests } from 'src/app/const';
import { Order } from 'src/app/purchase/interfaces/order';
import { HttpService } from 'src/app/tools/services/http.service';
import { ToolsService } from 'src/app/tools/services/tools.service';

@Component({
  selector: 'payment-window',
  templateUrl: './payment-window.component.html',
  styleUrls: ['./payment-window.component.scss']
})
export class PaymentWindowComponent implements OnInit, OnDestroy{
  @Input() order!: Order
  @Output() onClose = new EventEmitter();
  @Output() onSuccess = new EventEmitter();

  form!: FormGroup

  sub!: Subscription

  recevierAddress: string = '';

  loading: boolean = false;

  constructor(
    private http: HttpService,
    private tools: ToolsService
  ) { }

  ngOnInit(): void {
    // this.recevierAddress = this.order.crypto[0].recipient;
    this.generateForm();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  generateForm(){
    this.form = new FormGroup({
      typeId: new FormControl(null, Validators.required),
      tx: new FormControl(null, Validators.required)
    })

    this.sub = this.form.controls['typeId'].valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(res => this.recevierAddress = this.order.crypto.find(m => m.id == res)?.recipient||'')
  }

  onConfirm(){
    this.form.markAllAsTouched();

    if ( this.form.controls['typeId'].invalid )
      this.tools.generateNotification('Choose the payment method')

    if ( this.form.controls['tx'].invalid )
      this.tools.generateNotification('Input the transaction hash')

    if ( this.form.invalid ) return;

    this.loading = true;

    let data = {
      email: '',
      crypto: this.form.value
    }


    this.http.request( Requests['postOrderEmail'], data, this.order.id )
      .pipe(
        take(1),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: () => {},
        error: e => {},
        complete: () => this.onSuccess.emit()
      })
  }


}
