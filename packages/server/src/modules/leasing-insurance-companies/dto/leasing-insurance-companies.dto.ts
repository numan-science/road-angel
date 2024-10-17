export class LeasingInsuranceCompanyDto {
    id: number;
    name: string;
    logo: string;
  }
  
  export class CreateLeasingInsuranceCompanyDto {
    name: string;
    logo: string;
  }
  
  export class UpdateLeasingInsuranceCompanyDto {
    name?: string;
    logo?: string;
  }
  export class DeleteLeasingInsuranceCompanyDto {
    name?: string;
    logo?: string;
  }