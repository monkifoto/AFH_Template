import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Business, ListItem } from 'src/app/model/business-questions.model';
import { Section } from 'src/app/model/section.model';
import { ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { BusinessService } from 'src/app/services/business.service';

@Component({
  selector: 'app-about-us-page',
  templateUrl: './about-us-page.component.html',
  styleUrls: ['./about-us-page.component.css'],
})
export class AboutUsPageComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() business!: Business | undefined;
  @Input() businessId!: string;

  @Output() sectionNameGenerated = new EventEmitter<string>();

  // newUniqueServiceForm!: FormGroup;
  // newWhyChooseForm!: FormGroup;
  newSectionForm!: FormGroup;
  collapsedSections: boolean[] = [];

  sectionForm!: FormGroup;
  showSectionForm = false;

  showUniqueServiceForm = false;
  showWhyChooseForm = false;

  predefinedImages = [
    { url: 'assets/sharedAssets/image_fx_(1).jpg' },
    { url: 'assets/sharedAssets/image_fx_(2).jpg' },
    { url: 'assets/sharedAssets/image_fx_(3).jpg' },
    { url: 'assets/sharedAssets/image_fx_(4).jpg' },
    { url: 'assets/sharedAssets/image_fx_(5).jpg' },
    { url: 'assets/sharedAssets/istockphoto-478915838-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-480743801-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-502998071-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-613308420-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-653191338-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-655931804-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-804432288-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-912405752-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-918529390-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-941789670-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1022730404-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1066099806-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1097353864-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1162510523-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1170514008-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1207318385-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1307432717-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1315315044-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1319783351-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1324090651-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1335866199-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1344063915-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1432890664-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1453597643-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1551967154-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-2012854188-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-2032240867-2048x2048.jpg' },
    { url: 'assets/sharedAssets/5388429572_df9a403081_k.jpg' },
    { url: 'assets/sharedAssets/9676303919_32372bf834_o.jpg' },
  ];

  sectionTypes = [
    'Story',
    'Vision',
    'Motivation',
    'Mission',
    'Welcome',
    'Gallery',
    'Other',
  ];
  pages = [
    'Home',
    'AboutUs',
    'Services',
    'Gallery',
    'Testimonials',
    'ResidentIntake',
    'ContactUs',
  ];
  locations = ['CenterTop', 'Left', 'Right', 'CenterBottom'];

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      sections: this.fb.array([]),
    });
    this.loadSections();
    this.collapsedSections = new Array(this.sections.length).fill(true);

    // Initialize the forms here
    this.newSectionForm = this.fb.group({
      name: [this.pages[0]],
      location: [this.locations[0]],
      sectionCounter: [''],
      type: [''],
      title: [''],
      subtitle: [''],
      imageUrl: [''],
      content: [''],
    });

    // this.newUniqueServiceForm = this.fb.group({
    //   name: [''],
    //   description: [''],
    // });

    // this.newWhyChooseForm = this.fb.group({
    //   name: [''],
    //   description: [''],
    // });


  }

  toggleSection(index: number) {
    this.collapsedSections[index] = !this.collapsedSections[index];
  }

  toggleSectionForm(): void {
    this.showSectionForm = !this.showSectionForm;
  }

  onImageSelection(url: string) {
    this.sectionForm.patchValue({ imageUrl: url });
  }

  pupulateSection(sections: Section[]): void {
    this.sections.clear();
    (sections ?? []).forEach((s) => {
      const sectionForm = this.fb.group({
        id: [s.sectionId || ''], // Store the Firestore document ID
        sectionName: [s.sectionName],
        sectionType: [s.sectionType],
        sectionTitle: [s.sectionTitle],
        sectionSubTitle: [s.sectionSubTitle],
        sectionContent: [s.sectionContent],
        sectionImageUrl: [s.sectionImageUrl],
        sectionStyle: [s.sectionStyle],
      });
      this.sections.push(sectionForm);
    });
  }

  get sections(): FormArray {
    return this.form.get('sections') as FormArray;
  }

  sectionCounters: { [key: string]: number } = {}; // Track counters globally
  addSection(): void {
    const newSection = this.fb.group({
      id: [''], // Empty initially, will be updated after Firestore save
      page: [''],
      location: [''],
      sectionName: [''],
      sectionType: [''],
      sectionTitle: [''],
      sectionSubTitle: [''],
      sectionImageUrl: [''],
      sectionContent: [''],
      sectionStyle: [''],
    });

    this.sections.push(newSection);
    this.collapsedSections.push(true);

    this.businessService
      .createSection(this.businessId, newSection.value)
      .then((docRef) => {
        console.log('Firestore ID generated:', docRef.id); // Log Firestore generated ID
        newSection.patchValue({ id: docRef.id }); // Update form with Firestore ID (sectionId)
        console.log('Updated section form:', newSection.value); // Check updated form
      })
      .catch((error) => console.error('Error adding section:', error));
  }

  updateSection(index: number): void {
    const sectionFormGroup = this.sections.at(index) as FormGroup;
    const updatedSection = sectionFormGroup.value;
    const sectionId = sectionFormGroup.get('id')?.value?.trim(); // Fetch sectionId (Firestore document ID)

    console.log('🔍 Attempting to update section:', updatedSection); // Log section data before updating

    if (!sectionId || sectionId === '') {
      console.error('❌ Cannot update section without an ID');
      return;
    }

    // Fetch page and location values to generate the sectionName
    const page = sectionFormGroup.get('page')?.value;
    const location = sectionFormGroup.get('location')?.value;

    // Generate the sectionName dynamically if both page and location are selected
    if (page && location) {
     // const counter = this.getNextCounter(page, location);
      const sectionName = `${page}${location}`;

      // Update sectionName in the form
      sectionFormGroup.patchValue({ sectionName });

      console.log(
        '✅ Updating section with ID:',
        sectionId,
        'and new sectionName:',
        sectionName
      ); // Log the section name
    }

    // Ensure sectionName is included in the updatedSection
    updatedSection.sectionName = sectionFormGroup.get('sectionName')?.value;

    // Update section in Firestore with the updated section data (including sectionName)
    this.businessService
      .updateSection(this.businessId, sectionId, updatedSection)
      .then(() => console.log('✔️ Section updated successfully'))
      .catch((error) => console.error('❌ Error updating section:', error));
  }

  removeSection(index: number): void {
    const sectionId = this.sections.at(index).get('id')?.value;

    if (sectionId) {
      this.businessService
        .deleteSection(this.businessId, sectionId)
        .then(() => {
          this.sections.removeAt(index);
          this.collapsedSections.splice(index, 1);
          console.log('Section deleted successfully');
        })
        .catch((error) => console.error('Error deleting section:', error));
    } else {
      console.warn('No section ID found. Removing from UI only.');
      this.sections.removeAt(index);
      this.collapsedSections.splice(index, 1);
    }
  }

  private loadSections(): void {
    this.businessService.getSections(this.businessId).subscribe((sections) => {
      this.sections.clear(); // Clear existing sections
      sections.forEach((s) => {
        console.log('✅ Loading section into form:', s); // Check the section data with sectionId
        const sectionForm = this.fb.group({
          id: [s.sectionId || ''], // Use sectionId from Firestore document ID
          page: [s.page],
          location: [s.location],
          sectionName: [s.sectionName],
          sectionType: [s.sectionType],
          sectionTitle: [s.sectionTitle],
          sectionSubTitle: [s.sectionSubTitle],
          sectionImageUrl: [s.sectionImageUrl],
          sectionContent: [s.sectionContent],
          sectionStyle: [s.sectionStyle],
        });
        this.sections.push(sectionForm); // Add section form to the form array
      });

      this.collapsedSections = new Array(sections.length).fill(true);
    });
  }

  updateSectionName(index: number): void {
    const section = this.sections.at(index);
    const page = section.get('page')?.value;
    const location = section.get('location')?.value;

    if (page && location) {
      // Get the next counter value based on existing sections
      const counter = this.getNextCounter(page, location);
      section.patchValue({ counter });

      // Set the sectionName dynamically as PageLocationCounter
      const sectionName = `${page}${location}${counter}`;
      section.patchValue({ sectionName });

      console.log('Generated sectionName:', sectionName);
    }
  }

  getGeneratedSectionNames(index: number): string {
    const section = this.sections.at(index);
    const page = section.get('page')?.value;
    const location = section.get('location')?.value;
    const counter = section.get('counter')?.value;
    console.log('Generated name:', { page, location, counter }); // Add logging
    const sectionName = `${page}${location}Section${counter || ''}`;
    this.sectionNameGenerated.emit(sectionName); // Emit the section name
    return sectionName;
    // return page && location ? `${page}${location}Section${counter || ''}` : '';
  }

  getNextCounter(page: string, location: string): number {
    console.log('getNextCounter' + page + '  ' + location);
    const existingSections = this.sections.controls.filter((sec) => {
      const secPage = sec.get('page')?.value;
      const secLocation = sec.get('location')?.value;
      const secSectionName = sec.get('sectionName')?.value;

      // Check if section has the same page and location, and matches sectionName format
      return (
        secPage === page &&
        secLocation === location &&
        secSectionName.startsWith(`${page}${location}`)
      );
    });

    // The counter is one more than the existing sections with the same page and location
    return existingSections.length;
  }

  getGeneratedSectionName(
    page: string,
    location: string,
    counter: number
  ): string {
    const sectionName = `${page}${location}Section${counter || ''}`;
    this.sectionNameGenerated.emit(sectionName); // Emit the section name
    return sectionName;
  }
/*-----------------Unique Features --------------------*/
  // populateUniqueService(uniqueService: ListItem[]): void {
  //   this.uniqueServices.clear();
  //   (uniqueService ?? []).forEach((us) => {
  //     const uniqueServiceForm = this.fb.group({
  //       name: [us.name],
  //       description: [us.description],
  //     });
  //     this.uniqueServices.push(uniqueServiceForm);
  //   });
  // }

  // populateWhyChoose(whyChoose: ListItem[]): void {
  //   this.whyChoose.clear();
  //   (whyChoose ?? []).forEach((why) => {
  //     const whyChooseForm = this.fb.group({
  //       name: [why.name],
  //       description: [why.description],
  //     });
  //     this.whyChoose.push(whyChooseForm);
  //   });
  // }

  // addUniqueService(): void {
  //   const newService = this.fb.group(this.newUniqueServiceForm.value);
  //   this.uniqueServices.push(newService);
  //   this.newUniqueServiceForm.reset();
  //   this.showUniqueServiceForm = false;
  // }

  // addWhyChoose(): void {
  //   const newReason = this.fb.group(this.newWhyChooseForm.value);
  //   this.whyChoose.push(newReason);
  //   this.newWhyChooseForm.reset();
  //   this.showWhyChooseForm = false;
  // }

  // removeUniqueService(index: number): void {
  //   this.uniqueServices.removeAt(index);
  // }

  // removeWhyChoose(index: number): void {
  //   this.whyChoose.removeAt(index);
  // }

  // get uniqueServices(): FormArray {
  //   return this.form.get('uniqueService') as FormArray;
  // }

  // get whyChoose(): FormArray {
  //   return this.form.get('whyChoose') as FormArray;
  // }

  // toggleUniqueServiceForm(): void {
  //   this.showUniqueServiceForm = !this.showUniqueServiceForm;
  // }

  // toggleWhyChooseForm(): void {
  //   this.showWhyChooseForm = !this.showWhyChooseForm;
  // }
}
