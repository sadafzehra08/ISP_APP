import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentList } from './payment-list/payment-list';
// import { Paymentdetail } from './paymentdetail/paymentdetail';
//mport { CountByPipe } from './../../core/pipes/count-by.pipe';

@NgModule({
  declarations: [PaymentList],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PaymentsRoutingModule],
  //  exports: [CountByPipe] 
})
export class PaymentsModule {}
