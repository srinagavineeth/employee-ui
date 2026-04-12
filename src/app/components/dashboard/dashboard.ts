import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  employees: any[] = [];

  page: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  loading: boolean = false;
  isEditMode: boolean = false;
  editEmployeeId: number | null = null;
  message: string = '';
  messageTimeout: any;
  searchText: string = '';
  selectedDepartment: string = '';
  minSalary: number | null = null;
  maxSalary: number | null = null;
  departments: string[] = [];

  newEmployee = {
    name: '',
    email: '',
    department: '',
    salary:0
  };

  constructor(private authService: AuthService, private router: Router,private cdr: ChangeDetectorRef,private toastr: ToastrService) {}

  ngOnInit() {
    console.log('Dashboard ngOnInit fired!');
    console.log('Token:', localStorage.getItem('token'));
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.authService.getEmployees(this.page, this.pageSize).subscribe({
      next: (res: any) => {       
        this.employees = res.data;
        this.totalCount = res.totalCount;
        this.departments = [...new Set(res.data.map((e: any) => e.department))] as string[];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('ERROR', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  resetForm() {
  this.newEmployee = { name: '', email: '', department: '', salary: 0 };
  this.isEditMode = false;
  this.editEmployeeId = null;
}
  addEmployee() {
    if (!this.newEmployee.name || !this.newEmployee.email || !this.newEmployee.department || this.newEmployee.salary ===null || this.newEmployee.salary === undefined) {
      this.toastr.warning('Name and Email required');
      return;
    }
    this.authService.addEmployee(this.newEmployee).subscribe({
      next: (res) => {
        this.newEmployee = { name: '', email: '', department: '', salary: 0 };
        this.toastr.success('Employee added successfully');
        this.loadEmployees();
      },
      error: (err) => {
        this.toastr.error('Failed to add employee');
      }
    });
  }
  deleteEmployee(id: number) {

  const confirmDelete = confirm('Are you sure you want to delete?');

  if (!confirmDelete) return;

  console.log('Deleting employee ID:', id);

  this.authService.deleteEmployee(id).subscribe({
      next: (res) => {
        this.toastr.success('Employee deleted');
        this.loadEmployees();

      },
      error: (err) => {
        this.toastr.error('Failed to delete employee');
      }
    });
  }

  edit(emp: any) {
  this.isEditMode = true;
  this.editEmployeeId = emp.employeeId;

  this.newEmployee = {
    name: emp.name,
    email: emp.email,
    department: emp.department,
    salary: emp.salary
  };
}

submitEmployee() {
  if (this.isEditMode) {
    this.authService.updateEmployee(this.editEmployeeId!, this.newEmployee).subscribe({
      next: () => {
        this.resetForm();
        this.toastr.success('Employee updated');
        this.loadEmployees();
      },
        error: () => {
          this.toastr.error('Update failed');
        }
    });
  } else {
    this.addEmployee();
  }
}
get filteredEmployees() {
  return this.employees.filter(emp => {

    // 🔍 search
    const matchesSearch =
      emp.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      emp.email.toLowerCase().includes(this.searchText.toLowerCase());

    // 🏢 department
    const matchesDept =
      !this.selectedDepartment || emp.department === this.selectedDepartment;

    // 💰 salary
    const matchesMin =
      this.minSalary === null || emp.salary >= this.minSalary;

    const matchesMax =
      this.maxSalary === null || emp.salary <= this.maxSalary;

    return matchesSearch && matchesDept && matchesMin && matchesMax;
  });
}
clearFilters() {
  this.searchText = '';
  this.selectedDepartment = '';

  this.page = 1; // reset pagination

  this.loadEmployees(); // reload original data
}

  next() {
    const totalPages = Math.ceil(this.totalCount / this.pageSize);

    if (this.page < totalPages) {
      this.page++;
      this.loadEmployees();
    }
  }

  prev() {
    if (this.page > 1) {
      this.page--;
      this.loadEmployees();
    }
  }

  logout() {
    localStorage.removeItem('token');
    alert('Logged out successfully');
    this.router.navigate(['/']);
  }
}
