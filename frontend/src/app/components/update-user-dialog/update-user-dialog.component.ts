import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-update-user-dialog',
  templateUrl: './update-user-dialog.component.html',
  styleUrls: ['./update-user-dialog.component.css'],
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
export class UpdateUserDialogComponent implements OnInit {
  constructor(private api: HttpClient, private service: UsersService) { }

  readonly dialogRef = inject(MatDialogRef<UpdateUserDialogComponent>);
  readonly data = inject<{ userId: number }>(MAT_DIALOG_DATA);
  
  ngOnInit() {
    this.service.getUserById(this.data.userId).subscribe((res:any)=>{
      this.form.patchValue(res.data);
    })
  }


  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    identification: new FormControl('', [Validators.required]),
    birthDate: new FormControl('', [Validators.required]),
    // roles: new FormGroup({
    //   role: new FormControl('', [Validators.required]),
    // }),
  });

  get f() {
    return this.form.controls;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submit() {
    this.service.updateUser(this.data.userId, this.form.value).subscribe(()=>{

      this.dialogRef.close();
    }, (err) => {
      alert(err.error.message);
    })
  }
}
