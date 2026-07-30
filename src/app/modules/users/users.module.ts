// ══════════════════════════════════════════════════════════════════════════
// users.module.ts
// ══════════════════════════════════════════════════════════════════════════
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users-routing.module';
import { UserList } from './user-list/user-list';
import { UserForm } from './user-form/user-form';

@NgModule({
  declarations: [UserList, UserForm],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, UsersRoutingModule],
})
export class UsersModule {}
