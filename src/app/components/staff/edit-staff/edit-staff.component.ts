import { Component, OnInit, OnDestroy ,ViewChild,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder , FormControl, FormGroup , Validators} from '@angular/forms';
import { CommanService } from 'app/config/comman.service';
import { ConfigStaffService } from 'app/config/config.staff.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-staff',
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.css']
})
export class EditStaffComponent implements OnInit {

  UPDATE_STAFF_FORM: FormGroup;
  IMAGE : string = '';
  STAFF_ID: any ;
  SPINNER_TEXT: string = 'Loading...';
  MODEL_OPEN: boolean = false;
  SHOW_EDIT_HTML: boolean = true;
  ROLE_TYPES: any = [];
  STAFF_DETAILS: any = [];

  constructor(
    public router: Router,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder , 
    public commonService: CommanService ,
    private configService: ConfigStaffService,
    private spinner: NgxSpinnerService,
    private staffService: ConfigStaffService,
    private changeDetection: ChangeDetectorRef,
    
  ) {

    
    this.STAFF_ID = this.activateRoute.snapshot.paramMap.get('id');
    
    this._initiateStaffForm();
    this._getStaffROleType();
   }

   async _initiateStaffForm() {

    this.UPDATE_STAFF_FORM = this.fb.group({

      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      number: ['', [Validators.required , Validators.maxLength(10)]],
      dateOfBirth: ['', Validators.required],
      gender: [, Validators.required],
      address: ['', Validators.required],
      emergencyContactName: ['', Validators.required],
      emergencyContactNumber: ['', [Validators.required , Validators.maxLength(10)]],
      //performedServices: ['', Validators.required],
      role: ['' , Validators.required],
      // monthlySales: ['' ],
      // commission: [''],
      // reviews: [''],
      // performance: [''],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')]],
      password: [''],
      employeeBio: ['', Validators.required],
      employeeImg: [''],
   });

    await this._getStaffList();
  }

  ngOnInit(): void {

    
  }

  async _getStaffROleType () {

    await (await this.configService._getStaffRoleType()).subscribe(
        async (respopnse: any) => {
            
            this.ROLE_TYPES = respopnse;
            await this.changeDetection.detectChanges();
        },
        async (error: any) => {


        }
    );
  }

  async ngOnDestroy() {

    this.SHOW_EDIT_HTML = false;
    await this.changeDetection.detectChanges();
  }
  async _closeModel () {

    
    this.MODEL_OPEN = false;
    await this.changeDetection.detectChanges();
    setTimeout(() => {
        this.router.navigate(['staff'])
    }, 200);
   }

  async _getStaffList () {

    this.SPINNER_TEXT = 'Loading...';
    await this.spinner.show();
    await this.changeDetection.detectChanges();
    
    await this.staffService.getStaff().subscribe(
        async (respopnse: any) => {

            respopnse = respopnse.filter( data => data.employee_id == this.STAFF_ID);
            this.STAFF_DETAILS = respopnse;
            
            await this.changeDetection.detectChanges();
            this.UPDATE_STAFF_FORM.patchValue({
              id: this.STAFF_ID,
              firstName: respopnse[0].firstName,
              lastName: respopnse[0].lastName,
              number: respopnse[0].number,
              dateOfBirth: respopnse[0].dateOfBirth,
              gender: respopnse[0].gender ? respopnse[0].gender : this.commonService.GENDER_LIST[0].value,
              address: respopnse[0].address,
              emergencyContactName: respopnse[0].emergencyContactName,
              emergencyContactNumber: respopnse[0].emergencyContactNumber,
              role: respopnse[0].role,
              // monthlySales: respopnse[0].monthlySales,
              // commission: respopnse[0].commission,
              // reviews: respopnse[0].reviews,
              // performance: respopnse[0].performance,
              email: respopnse[0].email,
              employeeBio: respopnse[0].employeeBio,
            });

            await this.spinner.hide();
            await this.changeDetection.detectChanges();
            this._updateFormValue();

        },
        async (error: any) => {
          await this.spinner.hide();
        }
    );
}

  async _updateFormValue() {

    await this.changeDetection.detectChanges();
  }

  async _updateStaff(form: any) {

    this.SPINNER_TEXT = 'Updating...';
    
    let data = {
      employee_id: parseInt(this.STAFF_ID),
      firstName: this.UPDATE_STAFF_FORM.value.firstName,
      lastName: this.UPDATE_STAFF_FORM.value.lastName,
      number: this.UPDATE_STAFF_FORM.value.number,
      dateOfBirth: this.UPDATE_STAFF_FORM.value.dateOfBirth,
      gender: this.UPDATE_STAFF_FORM.value.gender,
      address: this.UPDATE_STAFF_FORM.value.address,
      emergencyContactName: this.UPDATE_STAFF_FORM.value.emergencyContactName,
      emergencyContactNumber: this.UPDATE_STAFF_FORM.value.emergencyContactNumber,
      performedServices: [
              1,
              2,
              3
      ],
      role: this.UPDATE_STAFF_FORM.value.role,
      // monthlySales: "",
      // commission: "",
      // reviews: "",
      // performance: "",
      email: this.UPDATE_STAFF_FORM.value.email,
      employeeBio: this.UPDATE_STAFF_FORM.value.employeeBio,
    }

    if (this.IMAGE != '') {
      data['employeeImg'] = this.IMAGE; 
    } else {

      data['employeeImg'] = this.STAFF_DETAILS[0]['employeeImg']; 
    }
    
    await this.spinner.show();
    await (await this.configService._updateStaff(data)).subscribe(
      async (response: any) => {

      },
      async (error: any) => {

        if (error.status == 200) {

          this.spinner.hide();
          this.MODEL_OPEN = true; 
          this.changeDetection.detectChanges();
        } else {

          alert('servr error occuring')
        }
        
      }
    );
  }

  async _selectFile (event:any) {

    if (event.target.files && event.target.files[0]) {

      //await this.addStaffForm.patchValue({ employeeImg : event.target.files[0]})
      
      var reader = new FileReader();
  
                reader.onload = (event:any) => {

                  const image = new Image();
                  image.src = event.target.result;

                  image.onload = rs => {
                    
                    const img_height = rs.currentTarget['height'];
                    const img_width = rs.currentTarget['width'];

                  };

                 this.IMAGE =  event.target.result;
                  
                }

                reader.readAsDataURL(event.target.files[0]);

    } else {
      this.IMAGE = '';
      //await this.addStaffForm.patchValue({ employeeImg : ''})
    }
  }

  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  public errorMesages = {

    firstName: [
      { type: 'required', message: " First name is required" },
      // { type: 'maxlength', message: "Name cant be longer  than 100 characters" },
    ],
    lastName: [
      { type: 'required', message: "Last namme is required" },
    ],
    number: [
      { type: 'required', message: "Phone number is required" },
      { type: 'maxlength', message: "Phone number can't be longer  than 10" }
    ],
    dateOfBirth: [
      { type: 'required', message: "Date of birth is required" },
    ],
    gender: [
      { type: 'required', message: "Gender is required" },
    ],
    address: [
      { type: 'required', message: "Address is required" },
    ],
    emergencyContactName: [
      { type: 'required', message: "Emergency contact name is required" },
    ],
    emergencyContactNumber: [
      { type: 'required', message: "Emergency contact number is required" },
      { type: 'pattern', message: "Please enter a valid number" },
      { type: 'maxlength', message: "Phone number can't be longer  than 10" }
    ],
    performedServices: [
      { type: 'required', message: "Services is required" },
    ],
    role: [
      { type: 'required', message: "Role is required" },
    ],
    monthlySales: [
      { type: 'required', message: "Monthly sales is required" },
    ],
    commission: [
      { type: 'required', message: "Commission is required" },
    ],
    reviews: [
      { type: 'required', message: "Reviews is required" },
    ],
    performance: [
      { type: 'required', message: "Performance is required" },
    ],
    email: [
      { type: 'required', message: "Email is required" },
      { type: 'pattern', message: "Please enter a valid email address" },
    ],
    password: [
      { type: 'required', message: "Password is required" },
    ],
    employeeBio: [
      { type: 'required', message: "Employee bio is required" },
    ],
    employeeImg: [
      { type: 'required', message: "Image is required" },
    ],

  }

  get firstName() {
    return this.UPDATE_STAFF_FORM.get('firstName');
  }

  get lastName() {
    return this.UPDATE_STAFF_FORM.get('lastName');
  }

  get number() {
    return this.UPDATE_STAFF_FORM.get('number');
  }

  get gender() {
    return this.UPDATE_STAFF_FORM.get('gender');
  }

  get dateOfBirth() {
    return this.UPDATE_STAFF_FORM.get('dateOfBirth');
  }

  get address() {
    return this.UPDATE_STAFF_FORM.get('address');
  }

  get emergencyContactName() {
    return this.UPDATE_STAFF_FORM.get('emergencyContactName');
  }

  get emergencyContactNumber() {
    return this.UPDATE_STAFF_FORM.get('emergencyContactNumber');
  }

  get performedServices() {
    return this.UPDATE_STAFF_FORM.get('performedServices');
  }
  
  get role() {
    return this.UPDATE_STAFF_FORM.get('role');
  }

  get monthlySales() {
    return this.UPDATE_STAFF_FORM.get('monthlySales');
  }

  get commission() {
    return this.UPDATE_STAFF_FORM.get('commission');
  }

  get reviews() {
    return this.UPDATE_STAFF_FORM.get('reviews');
  }
  
  get performance() {
    return this.UPDATE_STAFF_FORM.get('performance');
  }

  get email() {
    return this.UPDATE_STAFF_FORM.get('email');
  }

  get password() {
    return this.UPDATE_STAFF_FORM.get('password');
  }
  
  get employeeBio() {
    return this.UPDATE_STAFF_FORM.get('employeeBio');
  }

  get employeeImg() {
    return this.UPDATE_STAFF_FORM.get('employeeImg');
  }

}
