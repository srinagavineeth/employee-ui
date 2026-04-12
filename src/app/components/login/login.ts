import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrl:'./login.css'
})

export class Login {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService,private roter:Router
  ) {}

  onLogin() {

    const data = {
      email: this.email,
      password: this.password
    };

    this.authService.login(data).subscribe({
      next: (res: any) => {

        const token = res.data;
        localStorage.setItem('token', token);

        alert('Login success');
        console.log('Login success, token stored');
        this.roter.navigate(['/dashboard']);

      },
      error: (err) => {
        console.log('ERROR', err);
        alert('Login failed');
      }
    });
  }
}
