// ── shared/shared.module.ts ────────────────────────────────────────────────
// Yeh module banao agar already nahi hai. Phir jis bhi feature module
// (clients.module.ts, packages.module.ts, invoices.module.ts, etc.) mein
// *appCanEdit use karna ho, wahan SharedModule import kar do.
 
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanEditDirective } from '../core/directives/can-edit.directive';
 
@NgModule({
  declarations: [CanEditDirective],
  imports: [CommonModule],
  exports: [CanEditDirective],   // ← yahi exported hota hai dusre modules ke liye
})
export class SharedModule {}



