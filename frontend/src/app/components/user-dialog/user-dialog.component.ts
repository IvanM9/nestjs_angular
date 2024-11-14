import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
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
    MatDatepickerModule,
    MatOptionModule,
    MatDialogModule
  ],
  providers: [provideNativeDateAdapter()]
})
export class UserDialogComponent implements OnInit {
  

  readonly dialogRef = inject(MatDialogRef<UserDialogComponent>);

  constructor(private service: UsersService) { }

  ngOnInit() {
  }

  form = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    identification: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', [Validators.required]),
    // roles: new FormGroup({
    //   role: new FormControl('', [Validators.required]),
    // }),
  });

  roles = []


  get f() {
    return this.form.controls;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
    this.service.createUser(this.form.value).subscribe((res: any)=>{
      alert('Usuario creado con éxito');
      this.dialogRef.close();
    }, (err) => {

      alert(err.error.message);
    });
  }
}
