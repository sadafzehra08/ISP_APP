// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   standalone: false,
//   templateUrl: './login.html',
//   styleUrl: './login.scss',
// })
// export class Login {}


import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

 @Component({
 selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
   styleUrl: './login.scss',
 })
export class Login {
  form: FormGroup;
  loading = false;
  error = '';
  showPass = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
    if (this.auth.isLoggedIn) this.router.navigate(['/dashboard']);
  }

  get f() { return this.form.controls; }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    this.auth.login(this.f['email'].value, this.f['password'].value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => { this.error = 'Invalid email or password'; this.loading = false; }
    });
  }
}


