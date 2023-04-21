import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { FormBuilder , FormControl, FormGroup , Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { CommanService } from 'app/config/comman.service';
import { ConfigStaffService } from 'app/config/config.staff.service';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css']
})
export class AddStaffComponent implements OnInit {

  addStaffForm: FormGroup;
  IMAGE : string = '';
  SUCCESS_MESSAGE: boolean = false;
  ERROR_MESSAGE: boolean = false; 
  MODEL_OPEN: boolean = false;
  ROLE_TYPES: any = [];


  constructor(
    private fb: FormBuilder , 
    public commonService: CommanService ,
    private configService: ConfigStaffService,
    private changeDetection: ChangeDetectorRef,
    private route: Router,
    ) {

    this._initiateStaffForm();
    this._getStaffROleType();
   }

  async _initiateStaffForm() {

    this.addStaffForm = this.fb.group({

      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      number: ['', [Validators.required , Validators.maxLength(10)]],
      dateOfBirth: ['', Validators.required],
      gender: [this.commonService.GENDER_LIST[0].value, Validators.required],
      address: ['', Validators.required],
      emergencyContactName: ['', Validators.required],
      emergencyContactNumber: ['', [Validators.required , Validators.maxLength(10)]],
      //performedServices: ['', Validators.required],
      role: [ , Validators.required],
      // monthlySales: ['' ],
      // commission: [''],
      // reviews: [''],
      // performance: [''],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')]],
      password: ['', Validators.required],
      employeeBio: ['', Validators.required],
      employeeImg: ['', Validators.required],

      // email: ['', [Validators.required, Validators.email]],
      // message: ['', [Validators.required, Validators.minLength(15)]],
    });

    
  }

  ngOnInit(): void {


  }

  async _getStaffROleType () {

    await (await this.configService._getStaffRoleType()).subscribe(
        (respopnse: any) => {
            
          
            this.ROLE_TYPES = respopnse;
          
            this.addStaffForm.patchValue({
              role: this.ROLE_TYPES.length > 0 ? this.ROLE_TYPES[0].role_id : 0
            })
        },
        async (error: any) => {


        }
    );
  }

  _closeModel () {

    
    this.MODEL_OPEN = false;
    setTimeout(() => {
        this.route.navigate(['staff'])
    }, 200);
   }

  async _addStaff(form: any) {


    let data = {
      firstName: this.addStaffForm.value.firstName,
      lastName: this.addStaffForm.value.lastName,
      number: this.addStaffForm.value.number,
      dateOfBirth: this.addStaffForm.value.dateOfBirth,
      gender: this.addStaffForm.value.gender,
      address: this.addStaffForm.value.address,
      emergencyContactName: this.addStaffForm.value.emergencyContactName,
      emergencyContactNumber: this.addStaffForm.value.emergencyContactNumber.toString(),
      performedServices: [
              1,
              2,
              3
      ],
      role: this.addStaffForm.value.role,
      // monthlySales: "",
      // commission: "",
      // reviews: "",
      // performance: "",
      email: this.addStaffForm.value.email,
      employeeBio: this.addStaffForm.value.employeeBio,
      employeeImg: this.IMAGE,
    }
    
    await (await this.configService._addStaff(data)).subscribe(
      async (response: any) => {

      },
      async (error: any) => {

        if (error.status == this.commonService.SUCCESS_CODE) {

          this.SUCCESS_MESSAGE = true;

          //this.addStaffForm.reset();

        this.MODEL_OPEN = true 
        this.changeDetection.detectChanges();
          
        } else {
          this.ERROR_MESSAGE = false;
          alert('Staff not added. Server error occuered Please try again later')
         
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
      { type: 'required', message: "Last name is required" },
    ],
    number: [
      { type: 'required', message: "Phone number is required" },
      { type: 'maxlength', message: "Phone number can't be longer  than 10 " }
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
      { type: 'maxlength', message: "Phone number can't be longer  than 10 " }
    ],
    performedServices: [
      { type: 'required', message: "Services is required" },
    ],
    role: [
      { type: 'required', message: "Role is required" },
    ],
    // monthlySales: [
    //   { type: 'required', message: "Monthly sales is required" },
    // ],
    // commission: [
    //   { type: 'required', message: "Commission is required" },
    // ],
    // reviews: [
    //   { type: 'required', message: "Reviews is required" },
    // ],
    // performance: [
    //   { type: 'required', message: "Performance is required" },
    // ],
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
    return this.addStaffForm.get('firstName');
  }

  get lastName() {
    return this.addStaffForm.get('lastName');
  }

  get number() {
    return this.addStaffForm.get('number');
  }

  get gender() {
    return this.addStaffForm.get('gender');
  }

  get dateOfBirth() {
    return this.addStaffForm.get('dateOfBirth');
  }

  get address() {
    return this.addStaffForm.get('address');
  }

  get emergencyContactName() {
    return this.addStaffForm.get('emergencyContactName');
  }

  get emergencyContactNumber() {
    return this.addStaffForm.get('emergencyContactNumber');
  }

  get performedServices() {
    return this.addStaffForm.get('performedServices');
  }
  
  get role() {
    return this.addStaffForm.get('role');
  }

  // get monthlySales() {
  //   return this.addStaffForm.get('monthlySales');
  // }

  // get commission() {
  //   return this.addStaffForm.get('commission');
  // }

  // get reviews() {
  //   return this.addStaffForm.get('reviews');
  // }
  
  // get performance() {
  //   return this.addStaffForm.get('performance');
  // }

  get email() {
    return this.addStaffForm.get('email');
  }

  get password() {
    return this.addStaffForm.get('password');
  }
  
  get employeeBio() {
    return this.addStaffForm.get('employeeBio');
  }

  get employeeImg() {
    return this.addStaffForm.get('employeeImg');
  }

}
