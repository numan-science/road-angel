CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE "login_tokens" (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "fkUserId" uuid NOT NULL,
  "token" text NOT NULL,
  "expiredAt" timestamptz,
  "ip" varchar(50),
  "userAgent" jsonb,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz
);
CREATE TABLE "forgot_passwords" (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "fkUserId" uuid NOT NULL,
  "token" varchar(255) NOT NULL,
  "expiredAt" timestamptz NOT NULL,
  "servedAt" timestamptz,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz
);
CREATE TABLE "users" (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "fkRoleId" uuid NOT NULL,
  "fkRegionId" uuid,
  "username" varchar(20),
  "password" varchar(100) NOT NULL,
  "confirmPassword" varchar(100),
  "email" varchar(50) NOT NULL UNIQUE,
  "phone" varchar(20),
  "profilePic" text,
  "isActive" BOOLEAN NOT NULL DEFAULT '1',
  "salt" varchar(255),
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz,
  "fkCreatedBy" uuid,
  "fkUpdatedBy" uuid,
  "deletedAt" timestamptz,
  "passwordResetAt" timestamptz
);
CREATE TABLE "super_user" (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "fkUserId" uuid NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT '1',
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz
);

DROP TABLE IF EXISTS "roles";
CREATE TABLE "roles" (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "name" varchar(50) NOT NULL,
  "description" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT '1',
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz,
  "fkCreatedBy" uuid,
  "fkUpdatedBy" uuid,
  "deletedAt" timestamptz
);
CREATE TABLE "permissions" (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "name" varchar NOT NULL,
  "permission" varchar NOT NULL,
  "moduleName" varchar,
  "parent" varchar NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT '1',
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz,
  "deletedAt" timestamptz
);
CREATE TABLE "role_permissions" (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "fkRoleId" uuid NOT NULL,
  "fkPermissionId" uuid NOT NULL,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz,
  "fkCreatedBy" uuid,
  "fkUpdatedBy" uuid,
  "deletedAt" timestamptz
);
CREATE TABLE "user_permissions" (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "fkUserId" uuid NOT NULL,
  "fkPermissionId" uuid NOT NULL,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz,
  "fkCreatedBy" uuid,
  "fkUpdatedBy" uuid,
  "deletedAt" timestamptz
);
CREATE TABLE "insurance_companies" (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "fkRoleId" uuid NOT NULL,
  "logo" VARCHAR(255),
  "rating" FLOAT,
  "fkCreatedBy" uuid,
  "fkUpdatedBy" uuid,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz,
  "deletedAt" timestamptz
);
CREATE TABLE "insurance_companies_users" (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "fkUserId" uuid NOT NULL,
  "fkinsurance_companyId" uuid NOT NULL,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz,
  "fkCreatedBy" uuid,
  "fkUpdatedBy" uuid,
  "deletedAt" timestamptz
);
CREATE TABLE "company_roles" (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "fkRoleId" uuid NOT NULL,
  "fkinsurance_companyId" uuid NOT NULL,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz,
  "fkCreatedBy" uuid,
  "fkUpdatedBy" uuid,
  "deletedAt" timestamptz
);
CREATE TABLE "tow_service" (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "logo" VARCHAR(255),
  "fkCreatedBy" uuid,
  "fkUpdatedBy" uuid,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz,
  "deletedAt" timestamptz
);

DROP TABLE IF EXISTS "region";
CREATE TABLE "region" (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "fkCreatedBy" uuid,
  "fkUpdatedBy" uuid,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz,
  "deletedAt" timestamptz
);

CREATE TABLE "leasing_insurance_company" (
   "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "logo" VARCHAR(255),
  "rating" FLOAT,
  "fkCreatedBy" uuid,
  "fkUpdatedBy" uuid,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz,
  "deletedAt" timestamptz
);

CREATE TABLE "liability_insurance_company" (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "logo" VARCHAR(255),
  "rating" FLOAT,
  "fkCreatedBy" uuid,
  "fkUpdatedBy" uuid,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz,
  "deletedAt" timestamptz
);
CREATE TABLE "damage_insurance_company" (
"id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "logo" VARCHAR(255),
  "rating" FLOAT,
  "fkCreatedBy" uuid,
  "fkUpdatedBy" uuid,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz,
  "deletedAt" timestamptz
);

CREATE TABLE "workshop" (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "logo" VARCHAR(255),
  "rating" FLOAT,
  "lattitude" FLOAT,
  "longitude" FLOAT,
  "address" VARCHAR(255),
  "fkCreatedBy" uuid,
  "fkUpdatedBy" uuid,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz,
  "deletedAt" timestamptz
);
CREATE TABLE "insurance_documents" (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "fkinsurance_companyId" uuid NOT NULL,
  "fileName" VARCHAR(255) NOT NULL,
  "fkCreatedBy" uuid,
  "fkUpdatedBy" uuid,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz,
  "deletedAt" timestamptz
);
CREATE TABLE "accident_scenario" (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "fkAccidentCaseId" uuid NOT NULL,
  "filePath" TEXT NOT NULL,
  "fkCreatedBy" uuid,
  "fkUpdatedBy" uuid,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz,
  "deletedAt" timestamptz
);
CREATE TABLE "accident_case" (
  "id" UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "dateOfAccident" TIMESTAMPTZ NOT NULL,
  "accidentAddress" VARCHAR(255) NOT NULL,
  "country" VARCHAR(255) NOT NULL,
  "city" VARCHAR(255) NOT NULL,
  "injuries" BOOLEAN NOT NULL DEFAULT '0',
  "otherCarDamage" BOOLEAN NOT NULL DEFAULT '0',
  "investigationByPolice" BOOLEAN NOT NULL DEFAULT '0',
  "witness" VARCHAR NOT NULL,
  "fkCreatedBy" uuid,
  "fkUpdatedBy" uuid,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz,
  "deletedAt" timestamptz
);
CREATE TABLE "settings" (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "websitename" VARCHAR(255) NOT NULL,
  "logo" VARCHAR(255),
  "email" VARCHAR(255),
  "contact" VARCHAR(255),
  "fkUserId" uuid UNiQUE NOT NULL,
  "fkCreatedBy" uuid,
  "fkUpdatedBy" uuid,
  "createdAt" timestamptz NOT NULL,
  "updatedAt" timestamptz,
  "deletedAt" timestamptz
);

CREATE TABLE "participant" (
  "id" UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "fkAccidentCaseId" uuid NOT NULL,
  "fkLeasingInsuranceCompanyId" uuid,
  "fkLiabilityInsuranceCompanyId" uuid,
  "fkDamageInsuranceCompanyId" uuid,
  "driverAddress" VARCHAR(255) NOT NULL,
  "driverName" VARCHAR(255) NOT NULL,
  "vinNumber" VARCHAR(255) NOT NULL,
  "vehicleLicensePlate" VARCHAR(255) NOT NULL,
  "partyEmail" VARCHAR(255) NOT NULL,
  "carOwnBy" VARCHAR(255),
  "ownerBirthNumber" VARCHAR(255),
  "companyRegistrationNumber" VARCHAR(255),
  "companyName" VARCHAR(255),
  "companyEmail" VARCHAR(255),
  "companyVatPayer" BOOLEAN DEFAULT false,
  "vatNumber" VARCHAR(255),
  "forLeasing" BOOLEAN NOT NULL DEFAULT false,
  "isDamageInsurance" BOOLEAN NOT NULL DEFAULT false,
  "vehicleModel" VARCHAR(255) NOT NULL,
  "yearOfManufacture" VARCHAR(255) NOT NULL,
  "driverSurname" VARCHAR(255) NOT NULL,
  "driverAttachments" jsonb NOT NULL,
  "driverLicenseNumber" VARCHAR(255) NOT NULL,
  "liabilityInsurance" BOOLEAN NOT NULL DEFAULT false,
  "ownerAddress" VARCHAR(255),
  "ownerName" VARCHAR(255),
  "remarks" VARCHAR(255) NOT NULL,
  "thirdPartyAddress" VARCHAR(255) NOT NULL,
  "thirdPartyGreenCard" VARCHAR(255) NOT NULL,
  "thirdPartyPolicyNumber" VARCHAR(255) NOT NULL,
  "vehicleRegistrationNumber" VARCHAR(255) NOT NULL,
  "signature" TEXT NOT NULL,
  "ownerTelephone" VARCHAR(255) NOT NULL,
  "ownerVatPayer" BOOLEAN NOT NULL DEFAULT false,
  "vehicleTypeMark" VARCHAR(255) NOT NULL,
  "initialImpact" TEXT NOT NULL,
  "greenCardValidUntil" TIMESTAMPTZ NOT NULL,
  "driverGroups" VARCHAR(255) NOT NULL,
  "driverIssuedBy" VARCHAR(255) NOT NULL,
  "driverValidFrom" TIMESTAMPTZ NOT NULL,
  "driverValidTo" TIMESTAMPTZ NOT NULL,
  "visibleDamage" jsonb NOT NULL,
  "accidentCausedByDriverA" BOOLEAN NOT NULL DEFAULT false,
  "accidentCausedByDriverB" BOOLEAN NOT NULL DEFAULT false,
  "accidentCausedByCommonFault" BOOLEAN NOT NULL DEFAULT false,
  "accidentCausedByOtherAddress" VARCHAR(255) NOT NULL,
  "accidentCausedByOtherName" VARCHAR(255) NOT NULL,
  "selectMultipleOptionsToExplainScenario" jsonb NOT NULL,
  "participantType"  VARCHAR(255),
  "fkCreatedBy" uuid,
  "fkUpdatedBy" UUID,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ,
  "deletedAt" TIMESTAMPTZ
);

ALTER TABLE "users"
ADD CONSTRAINT "users_fk0" FOREIGN KEY ("fkRoleId") REFERENCES "roles" ("id");

ALTER TABLE "users"
ADD CONSTRAINT "users_fk1" FOREIGN KEY ("fkRegionId") REFERENCES "region" ("id");
ALTER TABLE "users"
ADD CONSTRAINT "users_fk2" FOREIGN KEY ("fkCreatedBy") REFERENCES "users" ("id");
ALTER TABLE "users"
ADD CONSTRAINT "users_fk3" FOREIGN KEY ("fkUpdatedBy") REFERENCES "users" ("id");
ALTER TABLE "forgot_passwords"
ADD CONSTRAINT "forgot_passwords_fk0" FOREIGN KEY ("fkUserId") REFERENCES "users" ("id");
ALTER TABLE "super_user"
ADD FOREIGN KEY ("fkUserId") REFERENCES "users" ("id");
ALTER TABLE "roles"
ADD CONSTRAINT "roles_fk0" FOREIGN KEY ("fkCreatedBy") REFERENCES "users" ("id");
ALTER TABLE "roles"
ADD CONSTRAINT "roles_fk1" FOREIGN KEY ("fkUpdatedBy") REFERENCES "users" ("id");
ALTER TABLE "role_permissions"
ADD CONSTRAINT "role_permissions_fk0" FOREIGN KEY ("fkRoleId") REFERENCES "roles" ("id");
ALTER TABLE "role_permissions"
ADD CONSTRAINT "role_permissions_fk1" FOREIGN KEY ("fkPermissionId") REFERENCES "permissions" ("id");
ALTER TABLE "role_permissions"
ADD CONSTRAINT "role_permissions_fk2" FOREIGN KEY ("fkCreatedBy") REFERENCES "users" ("id");
ALTER TABLE "role_permissions"
ADD CONSTRAINT "user_permissions_fk3" FOREIGN KEY ("fkUpdatedBy") REFERENCES "users" ("id");
ALTER TABLE "user_permissions"
ADD CONSTRAINT "user_permissions_fk0" FOREIGN KEY ("fkUserId") REFERENCES "users" ("id");
ALTER TABLE "user_permissions"
ADD CONSTRAINT "user_permissions_fk1" FOREIGN KEY ("fkPermissionId") REFERENCES "permissions" ("id");
ALTER TABLE "user_permissions"
ADD CONSTRAINT "user_permissions_fk2" FOREIGN KEY ("fkCreatedBy") REFERENCES "users" ("id");
ALTER TABLE "user_permissions"
ADD CONSTRAINT "user_permissions_fk3" FOREIGN KEY ("fkUpdatedBy") REFERENCES "users" ("id");
ALTER TABLE "insurance_companies"
ADD CONSTRAINT "insurance_companies_fk0" FOREIGN KEY ("fkRoleId") REFERENCES "roles" ("id");
ALTER TABLE "insurance_companies"
ADD CONSTRAINT "insurance_companies_fk1" FOREIGN KEY ("fkCreatedBy") REFERENCES "users" ("id");
ALTER TABLE "insurance_companies"
ADD CONSTRAINT "insurance_companies_fk2" FOREIGN KEY ("fkUpdatedBy") REFERENCES "users" ("id");
ALTER TABLE "insurance_companies_users"
ADD CONSTRAINT "insurance_companies_users_fk0" FOREIGN KEY ("fkUserId") REFERENCES "users" ("id");
ALTER TABLE "insurance_companies_users"
ADD CONSTRAINT "insurance_companies_users_fk1" FOREIGN KEY ("fkinsurance_companyId") REFERENCES "insurance_companies" ("id");
ALTER TABLE "insurance_companies_users"
ADD CONSTRAINT "insurance_companies_users_fk2" FOREIGN KEY ("fkCreatedBy") REFERENCES "users" ("id");
ALTER TABLE "insurance_companies_users"
ADD CONSTRAINT "insurance_companies_users_fk3" FOREIGN KEY ("fkUpdatedBy") REFERENCES "users" ("id");
ALTER TABLE "region"
ADD CONSTRAINT "region_fk0" FOREIGN KEY ("fkCreatedBy") REFERENCES "users" ("id");
ALTER TABLE "region"
ADD CONSTRAINT "region_fk1" FOREIGN KEY ("fkUpdatedBy") REFERENCES "users" ("id");
ALTER TABLE "workshop"
ADD CONSTRAINT "workshop_fk0" FOREIGN KEY ("fkCreatedBy") REFERENCES "users" ("id");
ALTER TABLE "workshop"
ADD CONSTRAINT "workshop_fk1" FOREIGN KEY ("fkUpdatedBy") REFERENCES "users" ("id");
ALTER TABLE "insurance_documents"
ADD CONSTRAINT "insurance_documents_fk0" FOREIGN KEY ("fkinsurance_companyId") REFERENCES "insurance_companies" ("id");
ALTER TABLE "insurance_documents"
ADD CONSTRAINT "insurance_documents_fk1" FOREIGN KEY ("fkCreatedBy") REFERENCES "users" ("id");
ALTER TABLE "insurance_documents"
ADD CONSTRAINT "insurance_documents_fk2" FOREIGN KEY ("fkUpdatedBy") REFERENCES "users" ("id");
ALTER TABLE "settings"
ADD CONSTRAINT "settings_fk0" FOREIGN KEY ("fkUserId") REFERENCES "users" ("id");
ALTER TABLE "accident_scenario"
ADD CONSTRAINT "accident_scenario__fk0" FOREIGN KEY ("fkAccidentCaseId") REFERENCES "accident_case" ("id");
ALTER TABLE "accident_scenario"
ADD CONSTRAINT "accident_scenario_fk1" FOREIGN KEY ("fkCreatedBy") REFERENCES "users" ("id");
ALTER TABLE "accident_scenario"
ADD CONSTRAINT "accident_scenario_fk2" FOREIGN KEY ("fkUpdatedBy") REFERENCES "users" ("id");
ALTER TABLE "participant"
ADD CONSTRAINT "participant_fk1" FOREIGN KEY ("fkAccidentCaseId") REFERENCES "accident_case" ("id");
ALTER TABLE "participant"
ADD CONSTRAINT "participant_fk2" FOREIGN KEY ("fkLiabilityInsuranceCompanyId") REFERENCES "liability_insurance_company" ("id");
ALTER TABLE "participant"
ADD CONSTRAINT "participant_fk3" FOREIGN KEY ("fkLeasingInsuranceCompanyId") REFERENCES "leasing_insurance_company" ("id");
ALTER TABLE "participant"
ADD CONSTRAINT "participant_fk4" FOREIGN KEY ("fkDamageInsuranceCompanyId") REFERENCES "damage_insurance_company" ("id");
ALTER TABLE "participant"
ADD CONSTRAINT "participant_fk5" FOREIGN KEY ("fkCreatedBy") REFERENCES "users" ("id");
ALTER TABLE "participant"
ADD CONSTRAINT "participant_fk6" FOREIGN KEY ("fkUpdatedBy") REFERENCES "users" ("id");
ALTER TABLE "accident_case"
ADD CONSTRAINT "accident_case_fk0" FOREIGN KEY ("fkCreatedBy") REFERENCES "users" ("id");
ALTER TABLE "accident_case"
ADD CONSTRAINT "accident_case_fk1" FOREIGN KEY ("fkUpdatedBy") REFERENCES "users" ("id");
ALTER TABLE "leasing_insurance_company"

ADD CONSTRAINT "leasing_insurance_company_fk0" FOREIGN KEY ("fkCreatedBy") REFERENCES "users" ("id");
ALTER TABLE "leasing_insurance_company"
ADD CONSTRAINT "leasing_insurance_company_fk1" FOREIGN KEY ("fkUpdatedBy") REFERENCES "users" ("id");
ALTER TABLE "liability_insurance_company"

ADD CONSTRAINT "liability_insurance_company_fk0" FOREIGN KEY ("fkCreatedBy") REFERENCES "users" ("id");
ALTER TABLE "liability_insurance_company"
ADD CONSTRAINT "liability_insurance_company_fk1" FOREIGN KEY ("fkUpdatedBy") REFERENCES "users" ("id");


ALTER TABLE "damage_insurance_company"
ADD CONSTRAINT "damage_insurance_company_fk0" FOREIGN KEY ("fkCreatedBy") REFERENCES "users" ("id");

ALTER TABLE "damage_insurance_company"
ADD CONSTRAINT "damage_insurance_company_fk1" FOREIGN KEY ("fkUpdatedBy") REFERENCES "users" ("id");

