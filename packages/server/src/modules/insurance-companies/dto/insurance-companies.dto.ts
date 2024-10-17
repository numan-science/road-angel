export class InsuranceCompanyDto {
    id: number;
    name: string;
    logo: string;
  }
  
  export class CreateInsuranceCompanyDto {
    name: string;
    logo: string;
  }
  
  export class UpdateInsuranceCompanyDto {
    name?: string;
    logo?: string;
  }
  export class DeleteInsuranceCompanyDto {
    name?: string;
    logo?: string;
  }