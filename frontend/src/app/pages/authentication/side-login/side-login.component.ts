import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  constructor(private router: Router, private http: HttpClient
  ) { }

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    // console.log(this.form.value);
    this.http.post('http://localhost:3000/auth/login', {}, {
      headers: {
      'user': this.form.value.uname!,
      'password': this.form.value.password!
      }
    }).subscribe((res:any) => {
      localStorage.setItem('token', res.data.token);
      alert('Inicio de sesión exitoso');
      this.router.navigate(['/dashboard']);
    }, (err) => {
      alert(err.error.message);
    });
  }
}
