import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastSessionsComponent } from './last-sessions.component';

describe('LastSessionsComponent', () => {
  let component: LastSessionsComponent;
  let fixture: ComponentFixture<LastSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastSessionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
