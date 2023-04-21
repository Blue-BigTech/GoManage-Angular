import { Component, OnInit  , ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder , FormControl, FormGroup , Validators} from '@angular/forms';
import { CommanService } from 'app/config/comman.service';
import { ConfigStaffService } from 'app/config/config.staff.service';
import { ClientsService } from 'app/config/config.service.clients';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {

  UPDATE_CLIENT_FORM: FormGroup;
  CLIENT_EMAIL: any ;
  MODEL_OPEN: boolean = false;

  constructor(
    public router: Router,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder , 
    public commonService: CommanService ,
    private clientService: ClientsService,
    private configService: ConfigStaffService,
    private changeDetection: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
  ) { 

    this.CLIENT_EMAIL = this.activateRoute.snapshot.paramMap.get('email');
    this._initiateClientForm();

  }

  async _initiateClientForm() {

    this.UPDATE_CLIENT_FORM = this.fb.group({

      name: ['', Validators.required],
      //lastName: ['', Validators.required],
      //nickname: ['', Validators.required],
      //givenName: ['', Validators.required],
      familyName: ['', Validators.required],
      //phoneLandline: ['', Validators.required],
      gender: ['', Validators.required],
      phoneMobile: ['', [Validators.required, Validators.maxLength(10)]],
      dob: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')]],
      //password: ['123456', Validators.required],
      // email: ['', [Validators.required, Validators.email]],
      // message: ['', [Validators.required, Validators.minLength(15)]],
    });

    await this._getClientDetail()
  }

  ngOnInit(): void {
  }

  async _getClientDetail () {

    await this.spinner.show();
    await (await this.clientService._getSingleClientDetail(this.CLIENT_EMAIL)).subscribe(
      async (response: any) => {

        if (response == null) {

          alert("Response didn't get from server side");
          return
        }

        

        let dob_value = '';
        let address = '';

        if (response.hasOwnProperty('user_metadata')) {

          let [date , month , year] = response.user_metadata.dob.split('/');
          dob_value = `${year}-${month}-${date}`;

          address = JSON.parse(response.user_metadata.addresses[0]).work_address;
        }

        this.changeDetection.detectChanges();
        await this.UPDATE_CLIENT_FORM.patchValue({
          name : response.hasOwnProperty('givenName') ? response.givenName : '',
          familyName: response.hasOwnProperty('familyName') ? response.familyName : '',
          //givenName: response.hasOwnProperty('givenName') ? response.givenName : '',
          //nickname: response.hasOwnProperty('nickname') ? response.nickname : '',
          phoneMobile: response.hasOwnProperty('phoneMobile') ? response.phoneMobile : '',
          dob: dob_value,
          address: address,
          email: response.hasOwnProperty('email') ? response.email : '',
          gender: response.hasOwnProperty('user_metadata') ?  response.user_metadata.gender.charAt(0).toUpperCase() + (response.user_metadata.gender.slice(1).toLowerCase()) : '',
          //dob: response.hasOwnProperty('user_metadata') ?  response.user_metadata.dob : '',
        });

        await this.spinner.hide();
      },
      async (error: any) => {

        alert('something wrong on server side')
        
      }
    );
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
        this.router.navigate(['clients'])
    }, 200);
   }

  async _updateClient (form: any) {

    let [year , month , date] = this.UPDATE_CLIENT_FORM.value.dob.split('-');

    let data = {
                  email: this.UPDATE_CLIENT_FORM.value.email,
                  givenName : this.UPDATE_CLIENT_FORM.value.name,
                  //given_name : this.UPDATE_CLIENT_FORM.value.givenName,
                  family_name : this.UPDATE_CLIENT_FORM.value.familyName,
                  phone_number : this.UPDATE_CLIENT_FORM.value.phoneMobile,
                  user_metadata: {
                      addresses: {
                          work_address: this.UPDATE_CLIENT_FORM.value.address,
                      },
                      gender: this.UPDATE_CLIENT_FORM.value.gender.toUpperCase(),
                      dob: `${date}/${month}/${year}`,
                  }
              };

    await (await this.configService._updateClient(this.CLIENT_EMAIL , data)).subscribe(
      (response: any) => {

        if ( response.family_name != '' ) {

          //alert('Client updated successfully----s');
          this.MODEL_OPEN = true; 
          this.changeDetection.detectChanges();
        } else {
          alert('Something wrong on server side. Please try again later');
        }
      }, 
      (error: any) => {

        if (error.status == 200) {

          alert('Client updated successfully');
          
        } else {

          alert('Something wrong on server side. Please try again later');
        }

      }
    );

  }

  public errorMesages = {

    name: [
      { type: 'required', message: " Name is required" },
      // { type: 'maxlength', message: "Name cant be longer  than 100 characters" },
    ],
    lastName: [
      { type: 'required', message: "Last name is required" },
    ],
    nickname: [
      { type: 'required', message: "Nick name is required" },
    ],
    givenName: [
      { type: 'required', message: "Given name is required" },
    ],
    familyName: [
      { type: 'required', message: "Family name is required" },
    ],
    address: [
      { type: 'required', message: "Address is required" },
    ],
    phoneLandline: [
      { type: 'required', message: "Phone landline is required" },
    ],
    phoneMobile: [
      { type: 'required', message: "Phone mobile is required" },
      { type: 'maxlength', message: "Phone cant be longer  than 10 digit" }
    ],
    dob: [
      { type: 'required', message: "Date of birth is required" },
    ],
    gender: [
      { type: 'required', message: "Gender is required" },
    ],
    email: [
      { type: 'required', message: "Email is required" },
      { type: 'pattern', message: "Please enter a valid email address" },
    ],

  }

  get name() {
    return this.UPDATE_CLIENT_FORM.get('name');
  }

  get lastName() {
    return this.UPDATE_CLIENT_FORM.get('lastName');
  }

  get nickname() {
    return this.UPDATE_CLIENT_FORM.get('nickname');
  }

  get givenName() {
    return this.UPDATE_CLIENT_FORM.get('givenName');
  }

  get familyName() {
    return this.UPDATE_CLIENT_FORM.get('familyName');
  }
  
  get gender() {
    return this.UPDATE_CLIENT_FORM.get('gender');
  }

  get phoneLandline() {
    return this.UPDATE_CLIENT_FORM.get('phoneLandline');
  }

  get phoneMobile() {
    return this.UPDATE_CLIENT_FORM.get('phoneMobile');
  }

  get dob() {
    return this.UPDATE_CLIENT_FORM.get('dob');
  }

  get address() {
    return this.UPDATE_CLIENT_FORM.get('address');
  }
  
  get email() {
    return this.UPDATE_CLIENT_FORM.get('email');
  }

}
