import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatDialogModule
  ],
})
export class ResetPasswordDialogComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<ResetPasswordDialogComponent>);

  constructor(private api: HttpClient) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    if (this.form.value.password !== this.form.value.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.api.patch('http://localhost:3000/users/change-password', {
      username: this.form.value.username,
      newPassword: this.form.value.password
    }, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).subscribe((res: any) => {
      alert('Contraseña actualizada');
      this.dialogRef.close();
    }, (err) => {
      alert('Error al actualizar la contraseña');
    });
    
  }

}
