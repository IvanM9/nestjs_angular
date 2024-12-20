import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MaterialModule } from 'src/app/material.module';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { UpdateUserDialogComponent } from '../update-user-dialog/update-user-dialog.component';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users-last-sessions',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, MaterialModule, FormsModule, MatDialogModule],
  templateUrl: './users-last-sessions.component.html',
  styleUrl: './users-last-sessions.component.scss'
})
export class UsersLastSessionsComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  constructor(private service: UsersService) { }
  async ngOnInit(): Promise<void> {
    await this.getUsers();
  }

  searchValue: string = '';
  displayedColumns: string[] = ['position', 'firstName', 'lastName', 'logged', 'status', 'numAttempts', 'actions'];
  dataSource = [];
  totalPages = 0;
  currentPage = 1;
  pageSize = 5;

  addData() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(async result => {
      await this.getUsers()
    });
  }

  async getUsers() {
    this.service.getUsers(this.searchValue, this.currentPage, this.pageSize).subscribe((res: any) => {
      let index = 1;
      this.dataSource = res.data.users.map((user: any) => ({
        position: index++,
        logged: user.logged ? 'Sí' : 'No',
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status ? 'Activo' : 'Inactivo',
        id: user.id,
        numAttempts: user.numAttempts
      }))

      this.totalPages = res.data.total;
    })

  }

  deleteData(element: any) {
    this.service.updateStatus(element.id, false).subscribe(async () => {
      await this.getUsers()
    }, (error) => {
      alert('Error al eliminar el usuario');
    })
  }

  editData(element: any) {
    const dialog = this.dialog.open(UpdateUserDialogComponent, {
      data: { userId: element.id },
      width: '600px',
    });

    dialog.afterClosed().subscribe(async result => {
      await this.getUsers()
    });
  }

  importFile(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const allowedExtensions = ['csv', 'xlsx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      alert('Por favor, seleccione un archivo CSV o XLSX.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.service.importExcel(formData).subscribe(async () => {
      await this.getUsers();
      alert('Archivo importado exitosamente');
    }, (error) => {
      alert('Error al importar el archivo');
    })
  }

  triggerFileInputClick(): void {
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}
