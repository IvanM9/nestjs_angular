import { Component, inject, OnInit } from '@angular/core';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ResetPasswordDialogComponent } from 'src/app/components/reset-password-dialog/reset-password-dialog.component';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('token') && localStorage.getItem('role')) {
      this.router.navigate(['/dashboard']);
    }
  }

  readonly dialog = inject(MatDialog);

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
      const data: {token: string, role: string[]} = res.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', JSON.stringify(data.role));
      alert('Inicio de sesión exitoso');
      this.router.navigate(['/dashboard']);
    }, (err) => {
      alert(err.error.message);
    });
  }

  resetDialog() {
    const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
