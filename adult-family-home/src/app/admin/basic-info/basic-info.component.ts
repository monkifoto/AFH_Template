import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent  implements OnChanges, OnInit{
  @Input()
  form!: FormGroup;


  ngOnInit() {
    //console.log('Form value on init:', this.form?.value);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['form']) {
     // console.log('Form changed:', this.form?.value);
    }
  }
}
