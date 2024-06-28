import { Component, OnInit } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EasyReminderNamespace } from '../resources/easy-reminder.model';
import { MatRadioModule } from '@angular/material/radio';
import { Subject, takeUntil } from 'rxjs';
import { RecipientFieldComponent } from '../resources/recipient-field/recipient-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-create-reminder-modal',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    MatFormFieldModule,
    RecipientFieldComponent,
  ],
  templateUrl: './create-reminder-modal.component.html',
  styleUrl: './create-reminder-modal.component.scss',
})
export class CreateReminderModalComponent implements OnInit {
  public mediumForm!: FormGroup;
  public mediumType = EasyReminderNamespace.MediumType.EMAIL;

  private unSubscribe = new Subject<boolean>();

  constructor() {}

  ngOnInit(): void {
    this.mediumForm = new FormGroup({
      mediumType: new FormControl(EasyReminderNamespace.MediumType.EMAIL),
      recipients: new FormControl('', Validators.required),
    });
    this.mediumForm
      .get('mediumType')
      ?.valueChanges.pipe(takeUntil(this.unSubscribe))
      .subscribe((value) => {
        this.mediumType = value as EasyReminderNamespace.MediumType;
        this.recipientHandler([]);
      });
  }

  recipientHandler(list: string[]): void {
    this.mediumForm.get('recipients')?.setValue(list);
    this.mediumForm.get('recipients')?.updateValueAndValidity();
  }

  createReminder(): void {
    console.log(this.mediumForm.value);
  }
}
