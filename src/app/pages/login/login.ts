import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';

  login(): void {

    this.authService.login(this.username, this.password)
    .subscribe({
        next: () => this.router.navigate(['/productos']),
        error: error => {
        console.error(error);
        alert('Usuario o contraseña incorrectos');
        }
    });
  }
}