// ── receipts.module.ts ────────────────────────────────────────────────────
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReceiptsRoutingModule } from './receipts-routing.module';
import { ReceiptList } from './receipt-list/receipt-list';
 
@NgModule({
  declarations: [ReceiptList],
  imports: [CommonModule, FormsModule, RouterModule, ReceiptsRoutingModule],
})
export class ReceiptsModule {}
 