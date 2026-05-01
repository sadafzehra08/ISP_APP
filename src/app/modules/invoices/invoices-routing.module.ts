import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceList } from './invoice-list/invoice-list';
import { InvoiceDetail } from './invoice-detail/invoice-detail';
import { InvoiveForm } from './invoive-form/invoive-form';

const routes: Routes = [
  { path: '', component: InvoiceList },
  { path: 'new', component: InvoiveForm },
  { path: ':id/edit', component: InvoiveForm },
  { path: ':id', component: InvoiceDetail },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule {}