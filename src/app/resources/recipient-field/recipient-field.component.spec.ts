import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipientFieldComponent } from './recipient-field.component';

describe('RecipientFieldComponent', () => {
  let component: RecipientFieldComponent;
  let fixture: ComponentFixture<RecipientFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipientFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipientFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
