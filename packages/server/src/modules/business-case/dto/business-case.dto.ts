import { text } from "aws-sdk/clients/customerprofiles";
import { Json } from "sequelize/types/utils";

export class BusinessCaseDto {
    id: number;
    insuranceCompanyId: string;
    regionId: string;
    businessCaseId:string;
    workshopId:string;
    towServiceId:string;
    accidentCaseId:string;
    insuranceCaseId:string;
    participantA:string;
    customerParticipant: string;
    damageParticipant: string;
    culpritParticipant: string;
    participantAsignature:text;
    participantBsignature:text;
    participantB:string;
    towServiceInvoiceAttachment: Json;
    workshopInvoiceAttachment: Json;
    
  }
  
  export class CreateBusinessCaseDto {
    insuranceCompanyId: string;
    regionId: string;
    insuranceCaseId:string;
    businessCaseId:string
    workshopId:string;
    towServiceId:string;
    accidentCaseId:string;
    participantA:string;
    participantB:string
    customerParticipant: string;
    damageParticipant: string;
    culpritParticipant: string;
    participantAsignature:text;
    participantBsignature:text;
    casenumber: string;
    towServiceInvoiceAttachment: Json;
    workshopInvoiceAttachment: Json;
  }
  
  export class UpdateBusinessCaseDto {
    participantA?:string;
    insuranceCaseId?: string;
    regionId?: string;
    workshopId?: string;
    towServiceId?: string;
    participantB?:string;
    insuranceCompany?:string;
    accidentCaseId?:string;
    updatedBy?: any;
    participantAsignature:text;
    participantBsignature:text;
    actions?: any;
    BusinessCaseActivity?: any;
    towServiceInvoiceAttachment: Json;
    workshopInvoiceAttachment: Json;

  }
  export class DeleteBusinessCaseDto {
    participantA?:string;
    participantB?:string
    customerParticipant: string;
    damageParticipant: string;
    culpritParticipant: string;
  }