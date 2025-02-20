import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FountainStreetViewComponent } from './fountain-street-view.component';

describe('FountainStreetViewComponent', () => {
  let component: FountainStreetViewComponent;
  let fixture: ComponentFixture<FountainStreetViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FountainStreetViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FountainStreetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
