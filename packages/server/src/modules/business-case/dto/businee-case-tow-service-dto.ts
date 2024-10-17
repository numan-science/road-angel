import { text } from "aws-sdk/clients/customerprofiles";

export class BusinessCaseTowServiceDto {
    id: number;
    businessCaseId:string;
    towServiceId:string;

  }
  
  export class CreateBusinessCaseTowServiceDto {
    businessCaseId:string;
    towServiceId:string;
    
  }
  
