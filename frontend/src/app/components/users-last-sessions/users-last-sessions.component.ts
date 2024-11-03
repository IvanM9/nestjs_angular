import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MaterialModule } from 'src/app/material.module';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-users-last-sessions',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, MaterialModule, FormsModule, MatDialogModule],
  templateUrl: './users-last-sessions.component.html',
  styleUrl: './users-last-sessions.component.scss'
})
export class UsersLastSessionsComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  
  deleteData(_t92: any) {
    throw new Error('Method not implemented.');
  }
  editData(_t92: any) {
    throw new Error('Method not implemented.');
  }
  constructor(private api: HttpClient) { }
  async ngOnInit(): Promise<void> {
    await this.getUsers();
  }

  searchValue: string = '';
  addData() {
    const dialogRef = this.dialog.open(UserDialogComponent,{
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(async result => {
      console.log('The dialog was closed');
      await this.getUsers()
    });
  }

  displayedColumns: string[] = ['position', 'firstName', 'lastName', 'logged', 'status', 'actions'];
  dataSource = [];

  async getUsers() {
    this.api.get('http://localhost:3000/users/all', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).subscribe((res: any) => {
      this.dataSource = res.data.map((session: any) => ({
        logged: session.logged,
        firstName: session.firstName,
        lastName: session.lastName,
        status: session.status ? 'Activo' : 'Inactivo',
      }))
    });
  }
}
