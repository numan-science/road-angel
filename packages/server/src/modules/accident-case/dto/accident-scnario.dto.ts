import { text } from "aws-sdk/clients/customerprofiles";
import { time } from "aws-sdk/clients/frauddetector";

export class AccidentScenarioDto {
    id: number;
    filepath: text;
    accidentCaseId:number;
  }
    
  
  
  export class CreateAccidentScenarioDto {
  
    filepath: text;
  }
  
  export class UpdateAccidentScenarioDto {
    
    filePath?:string;
    
  }
  export class DeleteAccidentScenarioDto {
    
    filePath?:string;
    
  }