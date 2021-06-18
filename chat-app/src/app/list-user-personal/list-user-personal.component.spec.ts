import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUserPersonalComponent } from './list-user-personal.component';

describe('ListUserPersonalComponent', () => {
  let component: ListUserPersonalComponent;
  let fixture: ComponentFixture<ListUserPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListUserPersonalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUserPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
