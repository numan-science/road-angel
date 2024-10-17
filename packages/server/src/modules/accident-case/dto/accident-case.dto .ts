import { text } from "aws-sdk/clients/customerprofiles";
import { time } from "aws-sdk/clients/frauddetector";

export class AccidentCaseDto {
    id: number;;
    dateOfAccident:Date;
    accidentAddress:string;
    country: string;
    city:string;
    otherCarDamage: boolean;
    witness: string;
    injuries:boolean;
    investigationByPolice: boolean;
    policeDepartment: string;


  }
    
  
  
  export class CreateAccidentCaseDto {
    dateOfAccident:Date;
    accidentAddress:string;
    country: string;
    city:string;
    otherCarDamage: boolean;
    witness: string;
    injuries:boolean;
    investigationByPolice: boolean;
    policeDepartment: string;
  }
  
  export class DeleteAccidentCaseDto {
    
    dateOfAccident?:Date;
    submittedBy?: string;
    accidentAddress?:string;
    country?: string;
    city?:string;
    otherCarDamage?: boolean;
    witness?: string;
    injuries?:boolean;
    investigationByPolice?: boolean;
    policeDepartment: string;
  }

  export class UpdateAccidentCaseDto {
    
    dateOfAccident?:Date;
    submittedBy?: string;
    accidentAddress?:string;
    country?: string;
    city?:string;
    otherCarDamage?: boolean;
    witness?: string;
    injuries?:boolean;
    investigationByPolice?: boolean;
    policeDepartment: string;
  }
  