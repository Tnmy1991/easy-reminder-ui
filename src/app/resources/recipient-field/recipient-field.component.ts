import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import {
  Validators,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EasyReminderNamespace } from '../easy-reminder.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-recipient-field',
  standalone: true,
  imports: [
    FormsModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './recipient-field.component.html',
  styleUrl: './recipient-field.component.scss',
})
export class RecipientFieldComponent {
  @Input()
  get mediumType(): EasyReminderNamespace.MediumType {
    return this._mediumType;
  }
  set mediumType(value: EasyReminderNamespace.MediumType) {
    this._mediumType = value;
    this.recipientList = [];
  }

  @Output() recipients: EventEmitter<string[]> = new EventEmitter();

  private _editIndex = 0;
  private _editFlag = false;
  private _mediumType!: EasyReminderNamespace.MediumType;

  public recipientList: Array<EasyReminderNamespace.RecipientList> = [];
  public emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  public phoneFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]{10}$'),
  ]);
  public smsMedium = EasyReminderNamespace.MediumType.SMS;
  public emailMedium = EasyReminderNamespace.MediumType.EMAIL;
  public errorMatcher = new MyErrorStateMatcher();

  addRecipient(): void {
    switch (this._mediumType) {
      case EasyReminderNamespace.MediumType.SMS:
        if (this.phoneFormControl.valid && this.phoneFormControl.dirty) {
          if (this._editFlag) {
            this.recipientList[this._editIndex] = {
              ...this.recipientList[this._editIndex],
              recipient: this.phoneFormControl.value as string,
              editMode: false,
            };
            this._editFlag = false;
          } else {
            this.recipientList.push({
              type: EasyReminderNamespace.MediumType.SMS,
              recipient: this.phoneFormControl.value as string,
              checked: true,
              id: Date.now(),
              editMode: false,
            });
          }

          this.phoneFormControl.setValue('');
          this.phoneFormControl.setErrors(null);
          this.phoneFormControl.markAsTouched();
          this.phoneFormControl.markAsPristine();
          // emit recipeint list
          this.triggerDataEmitter();
        }
        break;

      case EasyReminderNamespace.MediumType.EMAIL:
      default:
        if (this.emailFormControl.valid && this.emailFormControl.dirty) {
          if (this._editFlag) {
            this.recipientList[this._editIndex] = {
              ...this.recipientList[this._editIndex],
              recipient: this.emailFormControl.value as string,
              editMode: false,
            };
            this._editFlag = false;
          } else {
            this.recipientList.push({
              type: EasyReminderNamespace.MediumType.EMAIL,
              recipient: this.emailFormControl.value as string,
              checked: true,
              id: Date.now(),
              editMode: false,
            });
          }

          this.emailFormControl.setValue('');
          this.emailFormControl.setErrors(null);
          this.emailFormControl.markAsTouched();
          this.emailFormControl.markAsPristine();
          // emit recipeint list
          this.triggerDataEmitter();
        }
        break;
    }
  }

  toggleRecipient(index: number): void {
    const temp = [...this.recipientList];
    temp[index] = {
      ...temp[index],
      checked: !temp[index].checked,
    };
    this.recipientList = [...temp];

    // emit recipeint list
    this.triggerDataEmitter();
  }

  editRecipient(index: number): void {
    this._editFlag = true;
    this._editIndex = index;
    const temp = [...this.recipientList];
    const recipient = this.recipientList[index].recipient;

    temp[index] = {
      ...temp[index],
      editMode: !temp[index].editMode,
    };
    this.recipientList = [...temp];

    switch (this._mediumType) {
      case EasyReminderNamespace.MediumType.SMS:
        this.phoneFormControl.setValue(recipient);
        this.phoneFormControl.updateValueAndValidity();
        break;

      case EasyReminderNamespace.MediumType.EMAIL:
      default:
        this.emailFormControl.setValue(recipient);
        this.emailFormControl.updateValueAndValidity();
        break;
    }
  }

  deleteRecipient(index: number): void {
    const temp = [...this.recipientList];
    temp.splice(index, 1);
    this.recipientList = [...temp];

    // emit recipeint list
    this.triggerDataEmitter();
  }

  triggerDataEmitter(): void {
    const recipients = this.recipientList.map(
      (recipient) => recipient.recipient
    );
    this.recipients.emit(recipients);
  }
}
