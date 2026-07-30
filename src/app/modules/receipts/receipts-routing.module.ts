// ── receipts-routing.module.ts ────────────────────────────────────────────
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptList } from './receipt-list/receipt-list';
 
const routes: Routes = [
  { path: '', component: ReceiptList }
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiptsRoutingModule {}