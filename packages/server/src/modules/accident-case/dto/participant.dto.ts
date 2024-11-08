import { text } from "aws-sdk/clients/customerprofiles";
import { Boolean } from "aws-sdk/clients/frauddetector";
import { Json } from "sequelize/types/utils";

export class ParticipantDto {
  id: number;
  selectMultipleOptionsToExplainScenario: Json;
  accidentCaseId: number;
  leasingInsuranceCompanyId:number;
  liabilityInsuranceCompanyId: number;
  damageInsuranceCompanyId :number;
  otherLiabilityInsuranceCompanyName:string;
  otherDamageInsuranceCompanyName:string;
  accidentAddress: string;
  vehicleLicensePlate:string;
  vinNumber:string;
  vehicleModel:string;
  yearOfManufacture:string;
  driverAttachments:Json;
  driverAddress: string;
  driverName: string;
  driverSurname: string;
  driverLicenseNumber: string;
  liabilityInsurance: boolean; 
  ownerAddress: string;
  ownerName: string;
  remarks: string;
  thirdPartyAddress: string;
  thirdPartyGreenCard: string;
  thirdPartyPolicyNumber: string;
  vehicleRegistrationNumber: string; 
  ownerTelephone: string;
  companyVatPayer: boolean;
  vatNumber: string;
  partyEmail:string;
  companyName:string;
  companyEmail:string;
  forLeasing:boolean;
  carOwnBy:string;
  isDamageInsurance:boolean;
  initialImpact: text;
  greenCardValidUntil: Date;
  driverGroups: string;
  participantType:string;
  driverIssuedBy: string;
  driverValidFrom: Date;
  driverValidTo: Date;
  visibleDamage: Json; 
  accidentCausedByDriverA: boolean; 
  accidentCausedByDriverB: boolean; 
  accidentCausedByCommonFault: boolean;
  accidentCausedByOtherAddress: boolean;
  accidentCausedByOtherName: boolean;
  ownerPhoneNumber: string;
  label: string;
}

export class UpdateParticipantDto {
  selectMultipleOptionsToExplainScenario?: Json;
  accidentCaseId?: number;
  leasingInsuranceCompanyId?:number;
  liabilityInsuranceCompanyId?:number;
  damageInsuranceCompanyId?:number;
  participantASignature:text;
  participantBSignature:text;
  insuranceCompanyId?:number;
  accidentAddress?: string;
  vehicleLicensePlate?:string;
  participantType?:string;
  vinNumber?:string;
  vehicleModel?:string;
  yearOfManufacture?:string;
  otherLiabilityInsuranceCompanyName?:string;
  // otherAkaInsuranceCompanyName:string;
  otherDamageInsuranceCompanyName?:string;
  driverAttachments?:Json;
  driverAddress?: string;
  driverName?: string;
  driverSurname?: string;
  driverLicenseNumber?: string;
  liabilityInsurance?: boolean; // Previously thirdPartyLiabilityInsurer
  ownerAddress?: string;
  ownerName?: string;
  remarks?: string;
  thirdPartyAddress?: string;
  thirdPartyGreenCard?: string;
  thirdPartyPolicyNumber?: string;
  vehicleRegistrationNumber?: string; 
  signature: text;
  ownerTelephone?: string;
  companyVatPayer?: boolean;
  partyEmail?:string;
  companyEmail?:string;
  forLeasing?:boolean;
  carOwnBy?:string;
  isDamageInsurance?:boolean;
  initialImpact?: text;
  greenCardValidUntil?: Date;
  driverGroups?: string;
  driverIssuedBy?: string;
  driverValidFrom?: Date;
  isItForLeasing?:boolean;
  driverValidTo?: Date;
  visibleDamage?: Json; 
  accidentCausedByDriverA?: boolean; 
  accidentCausedByDriverB?: boolean; 
  accidentCausedByCommonFault?: boolean;
  accidentCausedByOtherAddress?: boolean;
  accidentCausedByOtherName?: boolean;
  length?:number;
  ownerPhoneNumber: string;
  label: string;

}

export class CreateParticipantDto {
  selectMultipleOptionsToExplainScenario: Json;
  accidentCaseId: number;
  damgeInsuranceCompanyId:number;
  leasingInsuranceCompanyId:number;
  liabilityInsuranceCompanyId:number;
  accidentAddress: string;
  vehicleLicensePlate:string;
  participantType:string;
  vinNumber:string;
  vehicleModel:string;
  yearOfManufacture:string;
  otherLiabilityInsuranceCompanyName:string;
  otherDamageInsuranceCompanyName:string;
  driverAttachments:Json;
  driverAddress: string;
  driverName: string;
  driverSurname: string;
  driverLicenseNumber: string;
  liabilityInsurance: boolean; 
  ownerAddress: string;
  ownerName: string;
  remarks: string;
  thirdPartyAddress: string;
  thirdPartyGreenCard: string;
  thirdPartyPolicyNumber: string;
  vehicleRegistrationNumber: string; 
  signature: text;
  ownerTelephone: string;
  companyVatPayer: boolean;
  partyEmail:string;
  companyEmail:string;
  forLeasing:boolean;
  carOwnBy:string;
  isDamageInsurance:boolean;
  initialImpact: text;
  greenCardValidUntil: Date;
  driverGroups: string;
  driverIssuedBy: string;
  driverValidFrom: Date;
  isItForLeasing:boolean;
  driverValidTo: Date;
  visibleDamage: Json; 
  accidentCausedByDriverA: boolean; 
  accidentCausedByDriverB: boolean; 
  accidentCausedByCommonFault: boolean;
  accidentCausedByOtherAddress: boolean;
  accidentCausedByOtherName: boolean;
  length:number;
  ownerPhoneNumber: string;
  label: string;

}