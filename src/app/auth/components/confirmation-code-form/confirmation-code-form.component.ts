import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-confirmation-code-form',
  templateUrl: './confirmation-code-form.component.html',
  styleUrls: ['./confirmation-code-form.component.css']
})
export class ConfirmationCodeFormComponent implements OnInit {
  @Input() errorMessage: string | null;
  @Output() submitted = new EventEmitter<number>();

  form: FormGroup = new FormGroup({
    Confirmation: new FormControl(''),
    Password: new FormControl('')
  });

  constructor() { }

  ngOnInit() {
  }

  submit() {
    if (this.form.valid) {
      this.submitted.emit(this.form.value);
    }
  }
}
