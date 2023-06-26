import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output, TemplateRef, forwardRef } from '@angular/core';
import { MarkTextPipe } from '../pipes/mark-text/mark-text.pipe';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Subscription, map, startWith, tap } from 'rxjs';
import { KeyObject, Nullable } from '../util/type-util';



@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, MarkTextPipe, ReactiveFormsModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() =>DropdownComponent), multi: true}
  ]
})
export class DropdownComponent<T> implements OnDestroy, ControlValueAccessor {

  @Input() optionTemplateRef?: TemplateRef<any>;
  @Input() placeholder = 'Select...';
  @Input() emptyMessage = 'No selection available';
  @Input() keyId?: keyof T;
  @Input() keyLabel?: keyof T;
  @Input() set options(value: T[]) {
    if (!value) {
      this._options = [];
      return;
    }
    this._options = value;
  };

  @Output() selectedOption = new EventEmitter();
  getSelection() {
    return this._selectedOption;
  }

  open = false;
  searchText = '';

  filter: FormControl;
  filterSubscription = new Subscription();
  filteredOptions: T[] = [];
  filteredOptions$ = new BehaviorSubject<T[]>([]);

  private _options: T[] = [];
  private _selectedOption: Nullable<T> = null;
  disabled = false;

  onChange(value: any) {};
  onTouch (value: any) {};

  i = 0;

  constructor() {
    this.filter = new FormControl('');
    this.filterSubscription = this.filter.valueChanges.pipe(
      startWith(''),
      map(filter => {
        if (!filter) return this._options;
        return this._options.filter(option => {
          const toCheck = !!this.keyLabel ? option[this.keyLabel] : option;
          const find = `${toCheck}`?.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
          return find;
        })
      }),
      tap(filtered => this.filteredOptions$.next(filtered))
    ).subscribe();
  }



  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
  }


  private getValue(option: Nullable<T>, keyType: 'id' | 'label') {
    const key = keyType === 'id' ? this.keyId : this.keyLabel;
    return !!key ? option?.[key] : option;
  }


  protected selectOption(option: Nullable<T>) {
    if (this.disabled) return;
    this.setOptionValue(option);
    this.open = false;
  }


  private setOptionValue(option: Nullable<T>) {
    // set text of filter input
    const labelTextValue = option === null ? '' : `${this.getValue(option, 'label')}`;
    this.filter.setValue(labelTextValue);
    // set value of control
    this._selectedOption = option;
    const selection = this.getValue(this._selectedOption, 'id');
    this.onChange(selection);
    this.onTouch(selection);
    // emit selected option
    this.selectedOption.emit(this._selectedOption);
  }

  onOpen(text: string) {

    this.open = true;
    this.filter.setValue(text)
  }


  onBlur() {
    const currentFilterText = this._selectedOption === null ? '' : `${this.getValue(this._selectedOption, 'label')}`;
    if (this.filter.value !== currentFilterText) {
      this.onChange(null);
      this.onTouch(null);
    }
    this.open = false;
  }


  writeValue(value: Nullable<T | KeyObject<T>>): void {
    value = value === undefined ? null : value;
    if (!value) {
      const selection = (!!this.keyId
        ? this._options.find(item => value === item[this.keyId!])
        : this._options.find(item => value === item))
        || null;
      this.setOptionValue(selection);
    }
    this.setOptionValue(null);
  }


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }


  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }


  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}


