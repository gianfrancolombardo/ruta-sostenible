import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectVehicleComponent } from './select-vehicle.component';

describe('SelectVehicleComponent', () => {
  let component: SelectVehicleComponent;
  let fixture: ComponentFixture<SelectVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
