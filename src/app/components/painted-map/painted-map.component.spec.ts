import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintedMapComponent } from './painted-map.component';

describe('PaintedMapComponent', () => {
  let component: PaintedMapComponent;
  let fixture: ComponentFixture<PaintedMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintedMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaintedMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
