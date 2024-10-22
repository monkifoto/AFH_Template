import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-color-admin',
  templateUrl: './color-admin.component.html',
  styleUrls: ['./color-admin.component.css']
})
export class ColorAdminComponent implements OnInit {
  themeColors$: Observable<any> | undefined;
  themeForm!: FormGroup;
  businessId!: string;

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

  onSubmit() {
    if (this.themeForm.valid) {
      const updatedColors = this.themeForm.value;
      this.themeService.updateColors(this.businessId, updatedColors).then(() => {
        console.log('Colors updated successfully');
      }).catch(error => {
        console.error('Error updating colors:', error);
      });
    }
  }

  resetToDefault() {
    this.themeService.resetToDefaultColors().subscribe(defaultColors => {
      this.themeForm.patchValue(defaultColors);
    });
  }
}
