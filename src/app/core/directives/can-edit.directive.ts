// ── core/directives/can-edit.directive.ts ──────────────────────────────────
// Usage: *appCanEdit  →  element tab hi render hoga jab role viewer NA ho
//
// Example:
//   <button *appCanEdit class="btn-primary" (click)="addUser()">+ Add User</button>
//   <button *appCanEdit class="act-btn del" (click)="confirmDelete(item)">🗑</button>

import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appCanEdit]',
  standalone: false,
})
export class CanEditDirective implements OnInit {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.viewContainer.clear();
    if (this.auth.canEdit) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}