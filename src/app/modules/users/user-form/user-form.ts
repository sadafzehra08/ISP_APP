// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-user-form',
//   standalone: false,
//   templateUrl: './user-form.html',
//   styleUrl: './user-form.scss',
// })
// export class UserForm {}
// ══════════════════════════════════════════════════════════════════════════
// user-form.ts
// ══════════════════════════════════════════════════════════════════════════
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { UserCreateDto, UserUpdateDto } from '../../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.html',
  styleUrl:    './user-form.scss',
})
export class UserForm implements OnInit {
  form!:    FormGroup;
  isEdit    = false;
  userId:   number | null = null;
  loading   = false;
  saving    = false;
  showPass  = false;

  // Password change (edit mode)
  showPasswordSection = false;
  passwordForm!: FormGroup;
  savingPassword = false;

  constructor(
    private fb:          FormBuilder,
    private route:       ActivatedRoute,
    private router:      Router,
    private userService: UserService,
    private cdr:         ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.params['id']
      ? +this.route.snapshot.params['id'] : null;
    this.isEdit = !!this.userId;

    this.buildForm();
    this.buildPasswordForm();
    if (this.isEdit) this.loadUser();
  }

  buildForm() {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(4)]],
      email:    ['', [Validators.email]],
      phone:    [''],
      password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(6)]],
      role:     ['user', Validators.required],
      isActive: [true],
    });
    if (this.isEdit) {
      this.form.get('username')?.disable();
      this.form.get('password')?.disable();
    }
  }

  buildPasswordForm() {
    this.passwordForm = this.fb.group({
      newPassword:     ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  loadUser() {
    this.loading = true;
    this.userService.getById(this.userId!).subscribe({
      next: (u) => {
        this.form.patchValue({
          fullName: u.fullName,
          username: u.username,
          email:    u.email    || '',
      
          role:     u.role,
          isActive: u.isActive,
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.router.navigate(['/users']); }
    });
  }

  get f() { return this.form.controls; }
  get pf() { return this.passwordForm.controls; }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const val = this.form.value;

    if (this.isEdit) {
      const dto: UserUpdateDto = {
        fullName: val.fullName,
        email:    val.email    || undefined,
        role:     val.role,
        isActive: val.isActive,
      };
      this.userService.update(this.userId!, dto).subscribe({
        next: (u) => { this.saving = false; this.router.navigate(['/users', u.id]); },
        error: () => { this.saving = false; }
      });
    } else {
      const dto: UserCreateDto = {
        fullName: val.fullName,
        username: val.username,
        email:    val.email    || undefined,
        password: val.password,
        role:     val.role,
      };
      this.userService.create(dto).subscribe({
        next: (u) => { this.saving = false; this.router.navigate(['/users', u.id]); },
        error: (e) => {
          this.saving = false;
          if (e.status === 409) alert('Username already exists');
        }
      });
    }
  }

  savePassword() {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    const { newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) { alert('Passwords do not match'); return; }

    this.savingPassword = true;
    this.userService.changePassword(this.userId!, { newPassword }).subscribe({
      next: () => {
        this.savingPassword      = false;
        this.showPasswordSection = false;
        this.passwordForm.reset();
        alert('Password updated successfully');
      },
      error: () => { this.savingPassword = false; }
    });
  }

  cancel() { this.router.navigate(['/users']); }
  getRoleBadge(role: string): string {
  const map: any = {
    superadmin: 'role-super',
    admin:      'role-admin',
    user:       'role-user',
    viewer:     'role-viewer',
  };
  return map[role] || 'role-user';
}
}
