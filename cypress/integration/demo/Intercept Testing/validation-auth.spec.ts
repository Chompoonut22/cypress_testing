import { FormValidation } from 'models/shared-form-validationAuth'

describe('Shows Validation Errors Signup and Signin Correctly',()=>{
  FormValidation('/auth/sign-up');
  FormValidation('/auth/sign-in');
});





