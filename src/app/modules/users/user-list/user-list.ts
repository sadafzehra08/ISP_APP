import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppUser, UserFilter } from '../../../models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {

  users:       AppUser[] = [];
  loading      = false;
  totalRecords = 0;
  totalPages   = 0;

  filter: UserFilter = { search: '', role: '', page: 1, pageSize: 10 };

  // Delete modal
  showDeleteModal  = false;
  userToDelete:    AppUser | null = null;
  deletingUser     = false;

  constructor(
    private router:      Router,
    private userService: UserService,
    private cdr:         ChangeDetectorRef
  ) {}

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.loading = true;
    this.userService.getAll(this.filter).subscribe({
      next: (res) => {
        this.users       = res.data;
        this.totalRecords = res.totalCount;
        this.totalPages  = res.totalPages;
        this.loading     = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange()  { this.filter.page = 1; this.loadUsers(); }
  onFilterChange()  { this.filter.page = 1; this.loadUsers(); }

  clearFilters() {
    this.filter = { search: '', role: '', page: 1, pageSize: 10 };
    this.loadUsers();
  }

  get hasFilters() { return !!(this.filter.search || this.filter.role); }
  get pages()      { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }

  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages) { this.filter.page = p; this.loadUsers(); }
  }

  addUser()         { this.router.navigate(['/users/new']); }
  viewUser(id: number) { this.router.navigate(['/users', id]); }
  editUser(id: number, e: Event) { e.stopPropagation(); this.router.navigate(['/users', id, 'edit']); }

  toggleStatus(user: AppUser, e: Event) {
    e.stopPropagation();
    this.userService.toggleStatus(user.id).subscribe({
      next: () => { user.isActive = !user.isActive; this.cdr.detectChanges(); },
      error: (err) => console.error(err)
    });
  }

  confirmDelete(user: AppUser, e: Event) {
    e.stopPropagation();
    this.userToDelete   = user;
    this.showDeleteModal = true;
  }

  deleteConfirmed() {
    if (!this.userToDelete) return;
    this.deletingUser = true;
    this.userService.delete(this.userToDelete.id).subscribe({
      next: () => {
        this.deletingUser    = false;
        this.showDeleteModal = false;
        this.userToDelete    = null;
        this.loadUsers();
      },
      error: (e) => {
        console.error(e);
        this.deletingUser = false;
      }
    });
  }

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