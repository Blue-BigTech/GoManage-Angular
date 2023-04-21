import { Component, OnInit , ViewChild,ChangeDetectorRef} from '@angular/core';
import { FormBuilder , FormControl, FormGroup , Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { CommanService } from 'app/config/comman.service';
import { ClientsService } from 'app/config/config.service.clients';
import { ConfigStaffService } from 'app/config/config.staff.service';


@Component({
  selector: 'app-add-clients',
  templateUrl: './add-clients.component.html',
  styleUrls: ['./add-clients.component.css']
})
export class AddClientsComponent implements OnInit {

  ADD_CLIET_FORM: FormGroup;
  MODEL_OPEN: boolean = false;

  constructor(
    private fb: FormBuilder , 
    public commonService: CommanService ,
    private configService: ConfigStaffService,
    private clientservice: ClientsService,
    private route: Router,
    private changeDetection: ChangeDetectorRef,
    ) {

    this._initiateClientForm();
   }

  ngOnInit(): void {
  }

  open (){
    
    this.MODEL_OPEN = true;
  }

  async _initiateClientForm() {

    this.ADD_CLIET_FORM = this.fb.group({

      name: ['', Validators.required],
      lastName: ['', Validators.required],
      //nickname: ['', Validators.required],
      //givenName: ['', Validators.required],
      familyName: ['', Validators.required],
      //phoneLandline: ['', Validators.required],
      phoneMobile: ['', Validators.required],
      dob: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')]],
      //password: ['123456', Validators.required],
      // email: ['', [Validators.required, Validators.email]],
      // message: ['', [Validators.required, Validators.minLength(15)]],
    });
  }

  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  _closeModel () {

    
    this.MODEL_OPEN = false;
    setTimeout(() => {
        this.route.navigate(['clients'])
    }, 200);
   }

  async _addClient(form: any) {

    if (!form.valid) return;

    let [year , month , date] = this.ADD_CLIET_FORM.value.dob.split('-');

    let data = {
      //name: this.ADD_CLIET_FORM.value.name,
      lastName: this.ADD_CLIET_FORM.value.lastName,
      //nickname: this.ADD_CLIET_FORM.value.nickname,
      givenName: this.ADD_CLIET_FORM.value.name,
      familyName: this.ADD_CLIET_FORM.value.familyName,
      //phoneLandline: this.ADD_CLIET_FORM.value.phoneLandline,
      phoneMobile: this.ADD_CLIET_FORM.value.phoneMobile,
      email: this.ADD_CLIET_FORM.value.email,
      user_metadata: {
          dob: `${date}/${month}/${year}`,
          addresses: [this.ADD_CLIET_FORM.value.address]
      }
    }

    await (await this.configService._addClient(data)).subscribe(
      async (response: any) => {

        
        this.ADD_CLIET_FORM.reset();
        this.MODEL_OPEN = true;
      },
      async (error: any) => {

        if (error.status == 200) {

         if (error.error.text.indexOf('Successfully') == -1){

          alert(error.error.text);
         } else {
           
            this.MODEL_OPEN = true; 
            this.changeDetection.detectChanges();
         
          this.ADD_CLIET_FORM.reset();
         }
          
          
        } else {

          alert('Staff not added. Server error occuered Please try again later')
        }
        
      }
    );
  }


  public errorMesages = {

    name: [
      { type: 'required', message: " Name is required" },
    ],
    lastName: [
      { type: 'required', message: "Last namme is required" },
    ],
    
    familyName: [
      { type: 'required', message: "Family name is required" },
    ],
    address: [
      { type: 'required', message: "Address is required" },
    ],
    
    phoneMobile: [
      { type: 'required', message: "Phone mobile is required" }
    ],
    dob: [
      { type: 'required', message: "Date of birth is required" },
    ],
    email: [
      { type: 'required', message: "Email is required" },
      { type: 'pattern', message: "Please enter a valid email address" },
    ],

  }

  get name() {
    return this.ADD_CLIET_FORM.get('name');
  }

  get lastName() {
    return this.ADD_CLIET_FORM.get('lastName');
  }

  get familyName() {
    return this.ADD_CLIET_FORM.get('familyName');
  }

  get phoneMobile() {
    return this.ADD_CLIET_FORM.get('phoneMobile');
  }

  get dob() {
    return this.ADD_CLIET_FORM.get('dob');
  }

  get address() {
    return this.ADD_CLIET_FORM.get('address');
  }
  
  get email() {
    return this.ADD_CLIET_FORM.get('email');
  }


}
