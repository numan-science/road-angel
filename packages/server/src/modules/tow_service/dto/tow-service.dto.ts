export class TowSericeDto {
    id: number;
    name: string;
    logo: string;
    address:string;
    phone:string;
    email:string;

  }
  
  export class CreateTowServiceDto {
    name: string;
    logo: string;
    address:string;
    phone:string;
    email:string;
    regionId: string;

  }
  
  export class UpdateTowServiceDto {
    name?: string;
     logo?: string;
    address?:string;
    phone?:string;
    email?:string;

  }
  export class DeleteTowServiceDto {
    name?: string;
    logo?: string;
   address?:string;
   phone?:string;
   email?:string;
  }