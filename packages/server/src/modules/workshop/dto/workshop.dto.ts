import { Json } from "sequelize/types/utils";

export class WorkshopDto {
  id: number;
  name: string;
  role: string;
  logo: string;
  lattitude: number;
  longitude: number;
  address : string;
  regionId: string;
  workshopAttachments: Json

}

export class CreateWorkshopDto {
  name: string;
  role: string;
  logo: string;
  lattitude: number;
  longitude: number;
  address : string;
  workshopAttachments: Json
}


export class UpdateWorkshopDto {
  name?: string;
  role?: string;
  logo?: string;
  lattitude?: number;
  longitude?: number;
  address? : string;
  workshopAttachments: Json
}

export class DeleteWorkshopDto {
  name?: string;
  role?: string;
  logo?: string;
  lattitude?: number;
  longitude?: number;
  address?: string;
  workshopAttachments: Json
}



