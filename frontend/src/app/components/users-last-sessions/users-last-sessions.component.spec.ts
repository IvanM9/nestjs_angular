import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersLastSessionsComponent } from './users-last-sessions.component';

describe('UsersLastSessionsComponent', () => {
  let component: UsersLastSessionsComponent;
  let fixture: ComponentFixture<UsersLastSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersLastSessionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersLastSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
