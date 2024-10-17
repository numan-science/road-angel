export class InsuranceDocumentsDto {
    id: number;
    fileName: string;
    insuranceCompanyId: string;
  }
  
  export class CreateInsuranceDocumetsDto {
    fileName: string;
    insuranceCompanyId: string;
    lenght: number;
    length: number;
  }
  
  export class UpdateInsuranceDocumentsDto {
    fileName?: string;
    insuranceCompanyId?: string;
  }
  export class DeleteInsuranceDocumentsDto {
    fileName?: string;
    insuranceCompanyId?: string;
  }