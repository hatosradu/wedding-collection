import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private router: Router = inject(Router);
  public email: FormControl<string | null> = new FormControl(null);

  constructor() {
    const currentUser : string | null = sessionStorage.getItem('user');
    if (currentUser != null) {
      this.router.navigate(['/', 'upload']);
    }
  }

  continue() {
    const user = this.email.getRawValue()?.toString();
    if (user) {
      sessionStorage.setItem('user', user);
      this.router.navigate(['/', 'upload']);
    }
  }
}
