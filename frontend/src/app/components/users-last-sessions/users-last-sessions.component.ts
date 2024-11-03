import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MaterialModule } from 'src/app/material.module';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { UpdateUserDialogComponent } from '../update-user-dialog/update-user-dialog.component';

@Component({
  selector: 'app-users-last-sessions',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, MaterialModule, FormsModule, MatDialogModule],
  templateUrl: './users-last-sessions.component.html',
  styleUrl: './users-last-sessions.component.scss'
})
export class UsersLastSessionsComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  
  constructor(private api: HttpClient) { }
  async ngOnInit(): Promise<void> {
    await this.getUsers();
  }

  searchValue: string = '';
  displayedColumns: string[] = ['position', 'firstName', 'lastName', 'logged', 'status', 'actions'];
  dataSource = [];
  totalPages = 0;
  currentPage = 1;
  pageSize = 5;

  addData() {
    const dialogRef = this.dialog.open(UserDialogComponent,{
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(async result => {
      console.log('The dialog was closed');
      await this.getUsers()
    });
  }

  async getUsers() {
    this.api.get('http://localhost:3000/users/all', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      params: { search: this.searchValue, page: this.currentPage.toString(), items: this.pageSize.toString() }
    }).subscribe((res: any) => {
      let index= 1;
      this.dataSource = res.data.users.map((user: any) => ({
        position: index++,
        logged: user.logged,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status ? 'Activo' : 'Inactivo',
        id: user.id
      }))

      this.totalPages = res.data.total;
    });
  }

  deleteData(_t92: any) {
    throw new Error('Method not implemented.');
  }

  editData(element: any) {
    const dialog = this.dialog.open(UpdateUserDialogComponent, {
      data: {userId: element.id},
      width: '600px',
    });

    dialog.afterClosed().subscribe(async result => {
      console.log('The dialog was closed');
      await this.getUsers()
    });
  }
}
