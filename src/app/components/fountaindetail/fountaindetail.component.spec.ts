import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FountaindetailComponent } from './fountaindetail.component';

describe('FountaindetailComponent', () => {
  let component: FountaindetailComponent;
  let fixture: ComponentFixture<FountaindetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FountaindetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FountaindetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
