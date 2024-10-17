import { text } from "aws-sdk/clients/customerprofiles";

export class BusinessCaseDocumentsDto {
    id: number;
    businessCaseId:string;
    status:string;
    fileName:string;

  }
  
  export class CreateBusinessCaseDocumentsDto {
    businessCaseId:string;
    status:string;
    fileName:string;
  }
  
  export class UpdateBusinessCaseDocumentsDto {
  
    status?:string;
    fileName?:string;

  }
  export class DeleteBusinessCaseDocumentsDto {
    status?:string;
    fileName?:string;
  }