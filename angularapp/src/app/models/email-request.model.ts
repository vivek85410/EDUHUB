export interface EmailRequest {
    email: string;
  }
  
  export interface VerifyOtpRequest {
    email: string;
    code: string;
  }
  
  export interface ResetPasswordRequest {
    email: string;
    code: string;
    newPassword: string;
  }