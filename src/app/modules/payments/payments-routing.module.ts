import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentList } from './payment-list/payment-list';

const routes: Routes = [
  { path: '', component: PaymentList},
  // { path: 'new', component: PaymentForm },
  // { path: ':id/edit', component: PaymentForm },
  // { path: ':id', component: Paymentdetail },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule {}