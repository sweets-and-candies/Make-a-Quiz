import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownComponent } from './dropdown.component';



describe('DropDownComponent', () => {
  let component: DropdownComponent<any>;
  let fixture: ComponentFixture<DropdownComponent<any>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownComponent]
    });
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
