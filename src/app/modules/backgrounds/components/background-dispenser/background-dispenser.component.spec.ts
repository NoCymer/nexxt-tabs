import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundDispenserComponent } from './background-dispenser.component';

describe('BackgroundDispenserComponent', () => {
  let component: BackgroundDispenserComponent;
  let fixture: ComponentFixture<BackgroundDispenserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundDispenserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundDispenserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
