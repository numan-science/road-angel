import { PartialType } from '@nestjs/mapped-types';
import { CreateInsuranceCompanyUserDto } from './create-insurance-company-user.dto';

export class UpdateInsuranceCompanyUserDto extends PartialType(CreateInsuranceCompanyUserDto) {}

