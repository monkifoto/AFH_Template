import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, take } from 'rxjs';

declare var $: any;
@Component({
  selector: 'app-color-admin',
  templateUrl: './color-admin.component.html',
  styleUrls: ['./color-admin.component.css']
})
export class ColorAdminComponent implements OnInit {
  themeColors$: Observable<any> | undefined;
  themeForm!: FormGroup;
  businessId!: string;

  defaultColors: any = {
    primaryColor: '#fffaf2', // default primary color
    secondaryColor: '#f8f3f0', // default secondary color
    accentColor: '#F0C987', // default accent color
    backgroundColor: '#F5F3E7', // default background color
    darkBackgroundColor: '#4C6A56', // default dark background color
    textColor: '#2F2F2F', // default text color
    navBackgroundColor: '#F5F3E7', // default nav background color
    navTextColor: '#33372C', // default nav text color
    navActiveBackground: '#33372C', // default nav active background color
    navActiveText: '#ffffff', // default nav active text color
    buttonColor: '#D9A064', // default button color
    buttonHoverColor: '#c9605b' // default button hover color
  };

  constructor(
    private themeService: ThemeService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.businessId = params.get('id')!;
      if (this.businessId) {
        // Fetch the theme colors from the service
        this.themeColors$ = this.themeService.getThemeColors(this.businessId);

        // Initialize the form with controls
        this.themeForm = this.fb.group({
          backgroundColor: ['', [Validators.required, this.hexValidator]],
          darkBackgroundColor: ['', [Validators.required, this.hexValidator]],
          primaryColor: ['', [Validators.required, this.hexValidator]],
          secondaryColor: ['', [Validators.required, this.hexValidator]],
          accentColor: ['', [Validators.required, this.hexValidator]],
          buttonColor: ['', [Validators.required, this.hexValidator]],
          buttonHoverColor: ['', [Validators.required, this.hexValidator]],
          textColor: ['', [Validators.required, this.hexValidator]],
          navBackgroundColor: ['', [Validators.required, this.hexValidator]],
          navTextColor: ['', [Validators.required, this.hexValidator]],
          navActiveBackground: ['', [Validators.required, this.hexValidator]],
          navActiveText: ['', [Validators.required, this.hexValidator]]
        });

        // Populate the form when the themeColors$ observable emits the data
        this.themeColors$.pipe(take(1)).subscribe(themeColors => {
          this.themeForm.patchValue(themeColors);
        });
      }
    });
  }

  // Helper method to validate the hex color format
  hexValidator(control: any) {
    const hexColorPattern = /^#([0-9A-F]{3}){1,2}$/i;
    if (!hexColorPattern.test(control.value)) {
      return { invalidHex: true };
    }
    return null;
  }

  openSaveConfirmation() {
    $('#saveConfirmationModal').modal('show');
  }

  confirmSave() {
    this.onSubmit();  // Call the save functionality
    $('#saveConfirmationModal').modal('hide');  // Close the modal
  }

  onSubmit() {
    if (this.themeForm.valid) {
      const updatedColors = this.themeForm.value;
      this.themeService.updateColors(this.businessId, updatedColors).then(() => {
        console.log('Colors updated successfully');
        $('#saveConfirmationModal').modal('hide');
      }).catch(error => {
        console.error('Error updating colors:', error);
      });
    }
  }

  resetToDefault() {
    this.themeService.resetToDefaultColors().pipe(take(1)).subscribe(defaultColors => {
      if (!defaultColors) {
        defaultColors = this.themeService.defaultTheme; // Fallback to the hardcoded defaultTheme in case the Firestore document is missing
      }

      // Reset the form with the default colors
      this.themeForm.patchValue(defaultColors);

      // Save the default colors to Firestore
      this.themeService.updateColors(this.businessId, defaultColors).then(() => {
        console.log('Colors reset to default and saved successfully');
      }).catch(error => {
        console.error('Error resetting colors to default:', error);
      });
    });
  }

  updateHexInput(event: Event, controlName: string) {
    const color = (event.target as HTMLInputElement).value;
    this.themeForm.patchValue({
      [controlName]: color
    });
  }

  updateColorInput(event: Event, controlName: string) {
    const hex = (event.target as HTMLInputElement).value;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      this.themeForm.patchValue({
        [controlName]: hex
      });
    }
  }

}
