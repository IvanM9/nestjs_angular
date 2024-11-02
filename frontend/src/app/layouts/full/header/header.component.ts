import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, TablerIconsModule, MaterialModule],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  closeSession() {
    this.http.post('http://localhost:3000/auth/logout',null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).subscribe((res) => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = 'http://localhost:4200/authentication/login';
    }, (err) => {
      window.location.href = 'http://localhost:4200/authentication/login';
    });
  }
}