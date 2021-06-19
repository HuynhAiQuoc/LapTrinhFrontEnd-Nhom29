import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MessengerAreaComponent} from './messenger-area.component';

describe('MessengerAreaComponent', () => {
  let component: MessengerAreaComponent;
  let fixture: ComponentFixture<MessengerAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessengerAreaComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessengerAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
