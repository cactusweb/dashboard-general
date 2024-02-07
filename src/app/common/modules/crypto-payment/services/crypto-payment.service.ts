import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class CsdCryptoPaymentService {
  constructor(private matDialog: MatDialog) {}
}
