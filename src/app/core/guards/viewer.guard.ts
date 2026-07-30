// ── core/guards/viewer.guard.ts ────────────────────────────────────────────
// Defense in depth: agar viewer directly URL daal ke /clients/new ya
// /clients/5/edit pe jaaye, toh yeh guard wapas bhej dega.
//
// Lagana yahan hai (routing module mein):
//   { path: 'new',      component: ClientForm, canActivate: [ViewerGuard] },
//   { path: ':id/edit', component: ClientForm, canActivate: [ViewerGuard] },
 
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
 
@Injectable({ providedIn: 'root' })
export class ViewerGuard implements CanActivate {
 
  constructor(private auth: AuthService, private router: Router) {}
 
  canActivate(): boolean {
    if (this.auth.isViewer) {
      // Viewer ko list page pe wapas bhej do
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}