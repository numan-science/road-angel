import {
  Avatar,
  Button,
  Card,
  FormContainer,
  Input,
  Notification,
  Select,
  DatePicker,
  toast,
  Upload,
  FormItem,
  Tabs,
  Radio,
} from "@/components/ui";
import React, { useState, useEffect, Suspense } from "react";
import { AdaptableCard, Container } from "@/components/shared";
import _ from "lodash";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RiSave2Line } from "react-icons/ri";
import { saveParticipantForm } from "@/services/submit-case";
import { saveAccidentCase } from "@/services/submit-case";
import { DoubleSidedImage } from "@/components/shared";
import { uploadFile } from "@/services/uploads";
import { S3_URL } from "@/constants/api.constant";
import DrawInitialDamage from "./DrawInitialDamage";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlineTrash,
} from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import { getAllParticipants, updateParticipant } from "@/services/submit-case";
import { getInsuranceCompany } from "@/services/insurance-company";
import { getLeasingCompany } from "@/services/leasingCompanies";
import dayjs from "dayjs";

const attachCount = {
  drivingLicense: 2,
  nationalIdCard: 2,
  vehicleDocument: 2,
  passport: 1,
  policyWhiteCard: 1,
};

const hourOptions = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: i < 10 ? `0${i}` : `${i}`,
}));

const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
  value: i,
  label: i < 10 ? `0${i}` : `${i}`,
}));

const ParticipantsForm = (props) => {
  const { t } = useTranslation();
  const [showOthersInputThirdParty, setShowOthersInputThirdParty] =
    useState(false);
  const [showOthersInputDamage, setShowOthersInputDamage] = useState(false);
  const [isPartyEmailFilled, setIsPartyEmailFilled] = useState(false);
  const [isOwnerPhoneNumberFilled, setIsOwnerPhoneNumberFilled] =
    useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedOptionsVisible, setSelectedOptionsVisible] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState([]);
  const [activeVehicleButtonCard, setActiveVehicleButtonCard] = useState(null);
  const [activeButtonCard, setActiveButtonCard] = useState(null);
  const [activeButtonLicense, setActiveButtonLicense] = useState(null);
  const [initialDamageUrl, setInitialDamageUrl] = useState(null);
  const { TabNav, TabList } = Tabs;
  const [idCardAttachments, setIdCardAttachments] = useState([]);
  const [drivingLicenseAttachments, setDrivingLicenseAttachments] = useState(
    []
  );
  const [passportAttachments, setPassportAttachments] = useState([]);
  const [policyWhiteCardAttachments, setPolicyWhiteCardAttachments] = useState(
    []
  );
  const [vehicleCardAttachments, setVehicleCardAttachments] = useState([]);
  const param = useParams();

  const participantIds = param?.participantId;

  useEffect(() => {
    setIdCardAttachments(
      attachments.filter(
        (attachment) => attachment.fileType === "nationalIdCard"
      )
    );
    setDrivingLicenseAttachments(
      attachments.filter(
        (attachment) => attachment.fileType === "drivingLicense"
      )
    );
    setPassportAttachments(
      attachments.filter((attachment) => attachment.fileType === "passport")
    );
    setPolicyWhiteCardAttachments(
      attachments.filter(
        (attachment) => attachment.fileType === "policyWhiteCard"
      )
    );
    setVehicleCardAttachments(
      attachments.filter(
        (attachment) => attachment.fileType === "vehicleDocument"
      )
    );
  }, [attachments]);

  const deleteFromIdCardAttachments = (index) => {
    setIdCardAttachments((prevAttachments) => {
      const updatedAttachments = [...prevAttachments];
      updatedAttachments.splice(index, 1);
      return updatedAttachments;
    });
  };

  const deleteFromDrivingLicenseAttachments = (index) => {
    setDrivingLicenseAttachments((prevAttachments) => {
      const updatedAttachments = [...prevAttachments];
      updatedAttachments.splice(index, 1);
      return updatedAttachments;
    });
  };

  const deleteFromPassportAttachments = (index) => {
    setPassportAttachments((prevAttachments) => {
      const updatedAttachments = [...prevAttachments];
      updatedAttachments.splice(index, 1);
      return updatedAttachments;
    });
  };

  const deleteFromPolicyWhiteCardAttachments = (index) => {
    setPolicyWhiteCardAttachments((prevAttachments) => {
      const updatedAttachments = [...prevAttachments];
      updatedAttachments.splice(index, 1);
      return updatedAttachments;
    });
  };

  const deleteFromVehicleCardAttachments = (index) => {
    setVehicleCardAttachments((prevAttachments) => {
      const updatedAttachments = [...prevAttachments];
      updatedAttachments.splice(index, 1);
      return updatedAttachments;
    });
  };

  const documetType = [
    { label: t("label.National Id Card"), value: "nationalIdCard" },
    { label: t("label.Driving License"), value: "drivingLicense" },
    { label: t("label.Vehicle Documents"), value: "vehicleDocument" },
    { label: t("label.Policy White Card"), value: "policyWhiteCard" },
    { label: t("label.Passport"), value: "passport" },
  ];
  const cardButtonType = {
    front: { label: t("button.Id Card Front Side") },
    back: { label: t("button.Id Card Back Side") },
  };
  const vehicleButtonType = {
    front: { label: t("button.Vehicle Document Front Side") },
    back: { label: t("button.Vehicle Document Back Side") },
  };
  const licenseButtonType = {
    front: { label: t("button.Driving License Front Side") },
    back: { label: t("button.Driving License Back Side") },
  };
  const countries = [
    { label: "Afghanistan", value: "AF" },
    { label: "land Islands", value: "AX" },
    { label: "Albania", value: "AL" },
    { label: "Algeria", value: "DZ" },
    { label: "American Samoa", value: "AS" },
    { label: "AndorrA", value: "AD" },
    { label: "Angola", value: "AO" },
    { label: "Anguilla", value: "AI" },
    { label: "Antarctica", value: "AQ" },
    { label: "Antigua and Barbuda", value: "AG" },
    { label: "Argentina", value: "AR" },
    { label: "Armenia", value: "AM" },
    { label: "Aruba", value: "AW" },
    { label: "Australia", value: "AU" },
    { label: "Austria", value: "AT" },
    { label: "Azerbaijan", value: "AZ" },
    { label: "Bahamas", value: "BS" },
    { label: "Bahrain", value: "BH" },
    { label: "Bangladesh", value: "BD" },
    { label: "Barbados", value: "BB" },
    { label: "Belarus", value: "BY" },
    { label: "Belgium", value: "BE" },
    { label: "Belize", value: "BZ" },
    { label: "Benin", value: "BJ" },
    { label: "Bermuda", value: "BM" },
    { label: "Bhutan", value: "BT" },
    { label: "Bolivia", value: "BO" },
    { label: "Bosnia and Herzegovina", value: "BA" },
    { label: "Botswana", value: "BW" },
    { label: "Bouvet Island", value: "BV" },
    { label: "Brazil", value: "BR" },
    { label: "British Indian Ocean Territory", value: "IO" },
    { label: "Brunei Darussalam", value: "BN" },
    { label: "Bulgaria", value: "BG" },
    { label: "Burkina Faso", value: "BF" },
    { label: "Burundi", value: "BI" },
    { label: "Cambodia", value: "KH" },
    { label: "Cameroon", value: "CM" },
    { label: "Canada", value: "CA" },
    { label: "Cape Verde", value: "CV" },
    { label: "Cayman Islands", value: "KY" },
    { label: "Central African Republic", value: "CF" },
    { label: "Chad", value: "TD" },
    { label: "Chile", value: "CL" },
    { label: "China", value: "CN" },
    { label: "Christmas Island", value: "CX" },
    { label: "Cocos (Keeling) Islands", value: "CC" },
    { label: "Colombia", value: "CO" },
    { label: "Comoros", value: "KM" },
    { label: "Congo", value: "CG" },
    { label: "Congo, The Democratic Republic of the", value: "CD" },
    { label: "Cook Islands", value: "CK" },
    { label: "Costa Rica", value: "CR" },
    { label: "Cote DIvoire", value: "CI" },
    { label: "Croatia", value: "HR" },
    { label: "Cuba", value: "CU" },
    { label: "Cyprus", value: "CY" },
    { label: "Czech Republic", value: "CZ" },
    { label: "Denmark", value: "DK" },
    { label: "Djibouti", value: "DJ" },
    { label: "Dominica", value: "DM" },
    { label: "Dominican Republic", value: "DO" },
    { label: "Ecuador", value: "EC" },
    { label: "Egypt", value: "EG" },
    { label: "El Salvador", value: "SV" },
    { label: "Equatorial Guinea", value: "GQ" },
    { label: "Eritrea", value: "ER" },
    { label: "Estonia", value: "EE" },
    { label: "Ethiopia", value: "ET" },
    { label: "Falkland Islands (Malvinas)", value: "FK" },
    { label: "Faroe Islands", value: "FO" },
    { label: "Fiji", value: "FJ" },
    { label: "Finland", value: "FI" },
    { label: "France", value: "FR" },
    { label: "French Guiana", value: "GF" },
    { label: "French Polynesia", value: "PF" },
    { label: "French Southern Territories", value: "TF" },
    { label: "Gabon", value: "GA" },
    { label: "Gambia", value: "GM" },
    { label: "Georgia", value: "GE" },
    { label: "Germany", value: "DE" },
    { label: "Ghana", value: "GH" },
    { label: "Gibraltar", value: "GI" },
    { label: "Greece", value: "GR" },
    { label: "Greenland", value: "GL" },
    { label: "Grenada", value: "GD" },
    { label: "Guadeloupe", value: "GP" },
    { label: "Guam", value: "GU" },
    { label: "Guatemala", value: "GT" },
    { label: "Guernsey", value: "GG" },
    { label: "Guinea", value: "GN" },
    { label: "Guinea-Bissau", value: "GW" },
    { label: "Guyana", value: "GY" },
    { label: "Haiti", value: "HT" },
    { label: "Heard Island and Mcdonald Islands", value: "HM" },
    { label: "Holy See (Vatican City State)", value: "VA" },
    { label: "Honduras", value: "HN" },
    { label: "Hong Kong", value: "HK" },
    { label: "Hungary", value: "HU" },
    { label: "Iceland", value: "IS" },
    { label: "India", value: "IN" },
    { label: "Indonesia", value: "ID" },
    { label: "Iran, Islamic Republic Of", value: "IR" },
    { label: "Iraq", value: "IQ" },
    { label: "Ireland", value: "IE" },
    { label: "Isle of Man", value: "IM" },
    { label: "Israel", value: "IL" },
    { label: "Italy", value: "IT" },
    { label: "Jamaica", value: "JM" },
    { label: "Japan", value: "JP" },
    { label: "Jersey", value: "JE" },
    { label: "Jordan", value: "JO" },
    { label: "Kazakhstan", value: "KZ" },
    { label: "Kenya", value: "KE" },
    { label: "Kiribati", value: "KI" },
    { label: "Korea, Democratic PeopleS Republic of", value: "KP" },
    { label: "Korea, Republic of", value: "KR" },
    { label: "Kuwait", value: "KW" },
    { label: "Kyrgyzstan", value: "KG" },
    { label: "Lao PeopleS Democratic Republic", value: "LA" },
    { label: "Latvia", value: "LV" },
    { label: "Lebanon", value: "LB" },
    { label: "Lesotho", value: "LS" },
    { label: "Liberia", value: "LR" },
    { label: "Libyan Arab Jamahiriya", value: "LY" },
    { label: "Liechtenstein", value: "LI" },
    { label: "Lithuania", value: "LT" },
    { label: "Luxembourg", value: "LU" },
    { label: "Macao", value: "MO" },
    { label: "Macedonia, The Former Yugoslav Republic of", value: "MK" },
    { label: "Madagascar", value: "MG" },
    { label: "Malawi", value: "MW" },
    { label: "Malaysia", value: "MY" },
    { label: "Maldives", value: "MV" },
    { label: "Mali", value: "ML" },
    { label: "Malta", value: "MT" },
    { label: "Marshall Islands", value: "MH" },
    { label: "Martinique", value: "MQ" },
    { label: "Mauritania", value: "MR" },
    { label: "Mauritius", value: "MU" },
    { label: "Mayotte", value: "YT" },
    { label: "Mexico", value: "MX" },
    { label: "Micronesia, Federated States of", value: "FM" },
    { label: "Moldova, Republic of", value: "MD" },
    { label: "Monaco", value: "MC" },
    { label: "Mongolia", value: "MN" },
    { label: "Montenegro", value: "ME" },
    { label: "Montserrat", value: "MS" },
    { label: "Morocco", value: "MA" },
    { label: "Mozambique", value: "MZ" },
    { label: "Myanmar", value: "MM" },
    { label: "Namibia", value: "NA" },
    { label: "Nauru", value: "NR" },
    { label: "Nepal", value: "NP" },
    { label: "Netherlands", value: "NL" },
    { label: "Netherlands Antilles", value: "AN" },
    { label: "New Caledonia", value: "NC" },
    { label: "New Zealand", value: "NZ" },
    { label: "Nicaragua", value: "NI" },
    { label: "Niger", value: "NE" },
    { label: "Nigeria", value: "NG" },
    { label: "Niue", value: "NU" },
    { label: "Norfolk Island", value: "NF" },
    { label: "Northern Mariana Islands", value: "MP" },
    { label: "Norway", value: "NO" },
    { label: "Oman", value: "OM" },
    { label: "Pakistan", value: "PK" },
    { label: "Palau", value: "PW" },
    { label: "Palestinian Territory, Occupied", value: "PS" },
    { label: "Panama", value: "PA" },
    { label: "Papua New Guinea", value: "PG" },
    { label: "Paraguay", value: "PY" },
    { label: "Peru", value: "PE" },
    { label: "Philippines", value: "PH" },
    { label: "Pitcairn", value: "PN" },
    { label: "Poland", value: "PL" },
    { label: "Portugal", value: "PT" },
    { label: "Puerto Rico", value: "PR" },
    { label: "Qatar", value: "QA" },
    { label: "Reunion", value: "RE" },
    { label: "Romania", value: "RO" },
    { label: "Russian Federation", value: "RU" },
    { label: "RWANDA", value: "RW" },
    { label: "Saint Helena", value: "SH" },
    { label: "Saint Kitts and Nevis", value: "KN" },
    { label: "Saint Lucia", value: "LC" },
    { label: "Saint Pierre and Miquelon", value: "PM" },
    { label: "Saint Vincent and the Grenadines", value: "VC" },
    { label: "Samoa", value: "WS" },
    { label: "San Marino", value: "SM" },
    { label: "Sao Tome and Principe", value: "ST" },
    { label: "Saudi Arabia", value: "SA" },
    { label: "Senegal", value: "SN" },
    { label: "Serbia", value: "RS" },
    { label: "Seychelles", value: "SC" },
    { label: "Sierra Leone", value: "SL" },
    { label: "Singapore", value: "SG" },
    { label: "Slovakia", value: "SK" },
    { label: "Slovenia", value: "SI" },
    { label: "Solomon Islands", value: "SB" },
    { label: "Somalia", value: "SO" },
    { label: "South Africa", value: "ZA" },
    { label: "South Georgia and the South Sandwich Islands", value: "GS" },
    { label: "Spain", value: "ES" },
    { label: "Sri Lanka", value: "LK" },
    { label: "Sudan", value: "SD" },
    { label: "Suriname", value: "SR" },
    { label: "Svalbard and Jan Mayen", value: "SJ" },
    { label: "Swaziland", value: "SZ" },
    { label: "Sweden", value: "SE" },
    { label: "Switzerland", value: "CH" },
    { label: "Syrian Arab Republic", value: "SY" },
    { label: "Taiwan, Province of China", value: "TW" },
    { label: "Tajikistan", value: "TJ" },
    { label: "Tanzania, United Republic of", value: "TZ" },
    { label: "Thailand", value: "TH" },
    { label: "Timor-Leste", value: "TL" },
    { label: "Togo", value: "TG" },
    { label: "Tokelau", value: "TK" },
    { label: "Tonga", value: "TO" },
    { label: "Trinidad and Tobago", value: "TT" },
    { label: "Tunisia", value: "TN" },
    { label: "Turkey", value: "TR" },
    { label: "Turkmenistan", value: "TM" },
    { label: "Turks and Caicos Islands", value: "TC" },
    { label: "Tuvalu", value: "TV" },
    { label: "Uganda", value: "UG" },
    { label: "Ukraine", value: "UA" },
    { label: "United Arab Emirates", value: "AE" },
    { label: "United Kingdom", value: "GB" },
    { label: "United States", value: "US" },
    { label: "United States Minor Outlying Islands", value: "UM" },
    { label: "Uruguay", value: "UY" },
    { label: "Uzbekistan", value: "UZ" },
    { label: "Vanuatu", value: "VU" },
    { label: "Venezuela", value: "VE" },
    { label: "Viet Nam", value: "VN" },
    { label: "Virgin Islands, British", value: "VG" },
    { label: "Virgin Islands, U.S.", value: "VI" },
    { label: "Wallis and Futuna", value: "WF" },
    { label: "Western Sahara", value: "EH" },
    { label: "Yemen", value: "YE" },
    { label: "Zambia", value: "ZM" },
    { label: "Zimbabwe", value: "ZW" },
  ];
  const visibleDamages = [
    {
      label: t("label.rear part"),
      value: t("label.rear part"),
    },
    {
      label: t("label.Front part of the vehicle"),
      value: "Front part of the vehicle",
    },

    {
      label: t("label.Right side"),
      value: "Right side",
    },
    {
      label: t("label.Left side"),
      value: "Left side",
    },
  ];

  const multipleOptions = [
    {
      label: t("label.The car was parked"),
      value: "The car was parked",
    },
    {
      label: t("label.Starting to ride"),
      value: "Starting to ride",
    },
    {
      label: t("label.Stopping"),
      value: "Stopping",
    },
    {
      label: t("label.Entering the road"),
      value: "Entering the road",
    },
    {
      label: t("label.Leaving the road"),
      value: "Leaving the road",
    },
    {
      label: t("label.Entering the roundabout"),
      value: "Entering the roundabout",
    },
    {
      label: t("label.Circulating in a roundabout"),
      value: "Circulating in a roundabout",
    },
    {
      label: t("label.Striking in the rear of another vehicle"),
      value: "Striking in the rear of another vehicle",
    },
    {
      label: t("label.Going in the same direction but different lane"),
      value: "Going in the same direction but different lane",
    },
    {
      label: t("label.Changing Lanes"),
      value: "Changing Lanes",
    },
    {
      label: t("label.Overtaking"),
      value: "Overtaking",
    },
    {
      label: t("label.Turning to right"),
      value: "Turning to right",
    },
    {
      label: t("label.Turning to left"),
      value: "Turning to left",
    },
    {
      label: t("label.Reversing"),
      value: "Reversing",
    },
    {
      label: t("label.Encroaching in opposite traffic lane"),
      value: "Encroaching in opposite traffic lane",
    },
    {
      label: t("label.Coming from right"),
      value: "Coming from right",
    },
    {
      label: t("label.Not observing a right way sign"),
      value: "Not observing a right way sign",
    },
  ];
  const {
    data = {},
    setAccidentForm,
    handleSave,
    accidentCaseId,
    setAccidentCaseId,
    setParticipantId,
    disableCard,
    accidentEditId,
  } = props;
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    watch,
  } = useForm({
    defaultValues: {
      // dateOfAccident: new Date('Fri Jul 14 2023 00:00:00 GMT+0500'),
      accidentAddress: "Tench Bhata Rwp",
      country: "Pakistan",
      city: "Islamabad",
      injuries: "yes",
      otherCarDamage: "yes",
      witness: "",
      investigationByPolice: "",
      ownerName: "Jozef",
      ownerAddress: "Slovakia",
      ownerTelephone: "051598891",
      ownerVatPayer: "no",
      vehicleTypeMark: "Red",
      vehicleRegistrationNumber: "4567291",
      liabilityInsurance: "Yes",
      thirdPartyAddress: "G-10",
      thirdPartyPolicyNumber: "5221148",
      thirdPartyGreenCard: "3740150694833",
      greenCardValidUntil: new Date("Thu Jul 06 2023 00:00:00 GMT+0500"),
      driverName: "Khizer",
      driverSurname: "Javed",
      driverAddress: "G11 Islamabad",
      driverLicenseNumber: "3283323",
      driverGroups: "My group is B+",
      driverIssuedBy: "Traffic Police",
      driverValidFrom: new Date("Wed Jul 12 2023 00:00:00 GMT+0500"),
      driverValidTo: new Date("Fri Jul 07 2023 00:00:00 GMT+0500"),
      initialImpact: "Frontal Damaged",
      remarks: "7 out of 10",
      accidentCausedByDriverA: "yes",
      accidentCausedByDriverB: "no",
      accidentCausedByOtherAddress: "",
      accidentCausedByOtherName: "",
      accidentCausedByCommonFault: "no",
      selectMultipleOptionsToExplainScenario: [],
      signature: "",
    },
  });
  const watcher = useWatch({ control });
  const investigationByPoliceValue = watch("investigationByPolice");
  const carOwnByValue = watch("carOwnBy");
  const forLeasingValue = watch("forLeasing");
  const VatPayerValue = watch("companyVatPayer");
  const liabilityInsuranceValue = watch("liabilityInsurance");
  const accidentCausedByDriverBValue = watch("accidentCausedByDriverB");
  const isDamageInsuranceValue = watch("isDamageInsurance");
  const [loading, setLoading] = useState(false);
  const [isParticipantFormEdit, setIsParticipantFormEdit] = useState(false);
  const [insuranceCompanyList, setInsuranceCompanyList] = useState([]);
  const [selectedHour, setSelectedHour] = useState(t("label.Hrs"));
  const [selectedMinute, setSelectedMinute] = useState(t("label.Mins"));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };
  const [leasingInsuranceCompanyList, setleasingInsuranceCompanyList] =
    useState([]);
  const [participantEdit, setParticipantEdit] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getInsuranceCompanyData();
    getLeasingInsuranceCompanyData();
  }, []);

  const getInsuranceCompanyData = async () => {
    try {
      const response = await getInsuranceCompany();
      const data = _.map(response.data.rows, (row) => ({
        value: row.id,
        label: row.name,
      }));
      setInsuranceCompanyList(data);
    } catch (error) {}
  };
  const getLeasingInsuranceCompanyData = async () => {
    try {
      const response = await getLeasingCompany();
      const data = _.map(response.data.rows, (row) => ({
        value: row.id,
        label: row.name,
      }));
      setleasingInsuranceCompanyList(data);
    } catch (error) {}
  };

  useEffect(() => {
    if (participantIds) {
      const data = _.find(participantEdit, (row) => row.id === participantIds);
      if (data?.id) {
        // const documentSelected = data.driverAttachments?.map((doc)=> doc?.fileType)
        // const docData = documetType.filter((row) => documentSelected.includes(row.value));

        const documentSelected = _.find(
          data.driverAttachments,
          (row) => row?.fileType
        );
        const docData = documentSelected?.fileType;
        const form = {
          id: data.id,
          accidentAddress: data.AccidentCase.accidentAddress,
          city: data.AccidentCase.city,
          country: data.AccidentCase.country,
          dateOfAccident: data.AccidentCase.dateOfAccident,
          injuries: data.AccidentCase.injuries,
          investigationByPolice: data.AccidentCase.investigationByPolice,
          otherCarDamage: data.AccidentCase.otherCarDamage,
          policeDepartment: data.AccidentCase.policeDepartment,
          witness: data.AccidentCase.witness,

          carOwnBy: data.carOwnBy,
          ownerName: data.ownerName,
          ownerAddress: data.ownerAddress,
          ownerBirthNumber: data.ownerBirthNumber,
          forLeasing: data.forLeasing,
          liabilityInsurance: data.liabilityInsurance,
          isDamageInsurance: data.isDamageInsurance,
          partyEmail: data.partyEmail,
          ownerPhoneNumber: data.ownerPhoneNumber,
          thirdPartyGreenCard: data.thirdPartyGreenCard,
          thirdPartyPolicyNumber: data.thirdPartyPolicyNumber,

          companyName: data.companyName,
          companyRegistrationNumber: data.companyRegistrationNumber,
          companyEmail: data.companyEmail,
          companyVatPayer: data.companyVatPayer,
          vatNumber: data.vatNumber,

          vehicleLicensePlate: data.vehicleLicensePlate,
          vehicleModel: data.vehicleModel,
          vehicleRegistrationNumber: data.vehicleRegistrationNumber,
          vinNumber: data.vinNumber,
          yearOfManufacture: data.yearOfManufacture,
          driverName: data.driverName,
          driverSurname: data.driverSurname,
          driverLicenseNumber: data.driverLicenseNumber,
          driverGroups: data.driverGroups,
          driverAddress: data.driverAddress,
          driverIssuedBy: data.driverIssuedBy,
          driverValidFrom: data.driverValidFrom,
          driverValidTo: data.driverValidTo,

          remarks: data.remarks,

          accidentCausedByDriverA: data.accidentCausedByDriverA,
          accidentCausedByDriverB: data.accidentCausedByDriverB,
          accidentCausedByCommonFault: data.accidentCausedByCommonFault,
          accidentCausedByOtherName: data.accidentCausedByOtherName,
          accidentCausedByOtherAddress: data.accidentCausedByOtherAddress,
          yearOfManufacture: {
            value: data?.yearOfManufacture,
            label: data?.yearOfManufacture,
          },

          otherDamageInsuranceCompanyName: data.otherDamageInsuranceCompanyName,
          otherLiabilityInsuranceCompanyName:
            data.otherLiabilityInsuranceCompanyName,

          initialImpact: data.initialImpact,

          leasingInsuranceCompanyId: {
            value: data.leasingInsuranceCompanyId,
            label: data.LeasingInsuranceCompany?.name,
          },
          damageInsuranceCompanyId: {
            value: data.DamageInsuranceCompany?.id,
            label: data.DamageInsuranceCompany?.name,
          },
          liabilityInsuranceCompanyId: {
            value: data.LiabilityInsuranceCompany?.id,
            label: data.LiabilityInsuranceCompany?.name,
          },
          driverAttachments: data.driverAttachments,
        };

        setSelectedDocumentType(docData);
        setValue("leasingInsuranceCompanyId", form.leasingInsuranceCompanyId);
        setSelectedOptionsVisible(data.visibleDamage);
        setValue(
          "liabilityInsuranceCompanyId",
          form.liabilityInsuranceCompanyId
        );
        setValue("damageInsuranceCompanyId", form.damageInsuranceCompanyId);

        setValue("accidentAddress", form.accidentAddress);
        setValue("city", form.city);
        setValue("country", form.country);
        const dateOfAccidentObj = new Date(form.dateOfAccident);
        setValue("dateOfAccident", dateOfAccidentObj);
        setValue("injuries", form.injuries ? "yes" : "no");
        setValue(
          "investigationByPolice",
          form.investigationByPolice ? "yes" : "no"
        );
        setValue("otherCarDamage", form.otherCarDamage ? "yes" : "no");
        setValue("policeDepartment", form.policeDepartment);
        setValue("witness", form.witness);

        setValue("carOwnBy", form.carOwnBy);
        setValue("ownerName", form.ownerName);
        setValue("ownerAddress", form.ownerAddress);
        setValue("ownerBirthNumber", form.ownerBirthNumber);
        setValue("forLeasing", form.forLeasing ? "yes" : "no");
        setValue("liabilityInsurance", form.liabilityInsurance ? "yes" : "no");
        setValue("isDamageInsurance", form.isDamageInsurance ? "yes" : "no");
        setValue("partyEmail", form.partyEmail || "");
        setValue("ownerPhoneNumber", form.ownerPhoneNumber || "");
        setValue("thirdPartyGreenCard", form.thirdPartyGreenCard);
        setValue("thirdPartyPolicyNumber", form.thirdPartyPolicyNumber);
        setValue("companyName", form.companyName);
        setValue("companyEmail", form.companyEmail);
        setValue("companyRegistrationNumber", form.companyRegistrationNumber);
        setValue("companyVatPayer", form.companyVatPayer ? "yes" : "no");
        setValue("vatNumber", form.vatNumber);

        setValue("vehicleLicensePlate", form.vehicleLicensePlate);
        setValue("vehicleModel", form.vehicleModel);
        setValue("vehicleRegistrationNumber", form.vehicleRegistrationNumber);
        setValue("vinNumber", form.vinNumber);
        setValue("yearOfManufacture", form.yearOfManufacture);

        setSelectedOptions(data.selectMultipleOptionsToExplainScenario);

        setValue("driverName", form.driverName);
        setValue("driverSurname", form.driverSurname);
        setValue("driverLicenseNumber", form.driverLicenseNumber);
        setValue("driverGroups", form.driverGroups);
        setValue("driverAddress", form.driverAddress);
        setValue("driverIssuedBy", form.driverIssuedBy);
        const driverValidFromObj = new Date(form.driverValidFrom);
        setValue("driverValidFrom", driverValidFromObj);
        const driverValidToObj = new Date(form.driverValidTo);
        setValue("driverValidTo", driverValidToObj);

        setValue("remarks", form.remarks);

        setValue(
          "accidentCausedByDriverA",
          form.accidentCausedByDriverA ? "yes" : "no"
        );
        setValue(
          "accidentCausedByDriverB",
          form.accidentCausedByDriverB ? "yes" : "no"
        );
        setValue(
          "accidentCausedByCommonFault",
          form.accidentCausedByCommonFault ? "yes" : "no"
        );
        setValue("accidentCausedByOtherName", form.accidentCausedByOtherName);
        setValue(
          "accidentCausedByOtherAddress",
          form.accidentCausedByOtherAddress
        );
        setValue(
          "otherDamageInsuranceCompanyName",
          form.otherDamageInsuranceCompanyName
        );
        setValue(
          "otherLiabilityInsuranceCompanyName",
          form.otherLiabilityInsuranceCompanyName
        );
        setInitialDamageUrl(form.initialImpact);

        setAttachments(form.driverAttachments);
        setIsPartyEmailFilled(form.partyEmail);
        setIsOwnerPhoneNumberFilled(form.ownerPhoneNumber);
      }
    }
  }, [participantEdit]);

  if (participantIds) {
    useEffect(() => {
      getParticipantData();
    }, []);

    const getParticipantData = async (options = {}) => {
      setLoading(true);
      try {
        options.accidentCaseId = accidentEditId;
        const response = await getAllParticipants(options);
        setParticipantEdit(response.data?.rows);
      } catch (error) {
        toast.push(
          <Notification className="mb-4" type="danger">
            Failed
          </Notification>
        );
      }
      setLoading(false);
    };
  }

  const onSubmit = async (values) => {
    try {
      values.yearOfManufacture = values.yearOfManufacture.value;

      const newDateObject = dayjs(values.dateOfAccident)
        .set("hour", selectedHour)
        .set("minute", selectedMinute)
        .toDate();
      values.dateOfAccident = newDateObject;
      if (
        values.leasingInsuranceCompanyId &&
        values.leasingInsuranceCompanyId.value
      ) {
        values.leasingInsuranceCompanyId =
          values.leasingInsuranceCompanyId.value;
      } else {
        delete values.leasingInsuranceCompanyId;
      }
      if (values.isDamageInsurance === "yes") {
        values.damageInsuranceCompanyId = values.damageInsuranceCompanyId.value;
        if (values.damageInsuranceCompanyId === "others") {
          delete values.damageInsuranceCompanyId;
        }
      } else {
        delete values.damageInsuranceCompanyId;
      }

      if (values.liabilityInsurance === "yes") {
        values.liabilityInsuranceCompanyId =
          values.liabilityInsuranceCompanyId.value;
        if (values.liabilityInsuranceCompanyId === "others") {
          delete values.liabilityInsuranceCompanyId;
        }
      } else {
        delete values.liabilityInsuranceCompanyId;
      }
      if (!accidentCaseId && !participantIds) {
        const responseId = await saveAccidentCase(values, data?.id);
        setAccidentCaseId(responseId?.data?.id);
        setAccidentForm(responseId?.data);
        values.accidentCaseId = responseId?.data?.id;
      } else {
        values.accidentCaseId = accidentCaseId;
      }
      values.driverAttachments = attachments;
      values.initialImpact = initialDamageUrl;
      const type = _.first(attachments)?.fileType;
      console.log("type", type);
      if (attachments.length !== attachCount[type]) {
        console.log("attachments.length", attachments.length);

        toast.push(
          <Notification className="mb-4" type="danger">
            Both Front and Back Attachments Required !
          </Notification>
        );
        const scrollToField = () => {
          const FormItemElement = document.getElementById("attachmentFormItem");
          if (FormItemElement) {
            FormItemElement.scrollIntoView({ behavior: "smooth" });
          }
        };

        setTimeout(scrollToField, 0);

        return;
      } else if (!initialDamageUrl) {
        toast.push(
          <Notification className="mb-4" type="danger">
            Create Initial Impact
          </Notification>
        );
        const scrollToField = () => {
          const FormItemElement = document.getElementById("initialDamageUrl");
          if (FormItemElement) {
            FormItemElement.scrollIntoView({ behavior: "smooth" });
          }
        };

        setTimeout(scrollToField, 0);
        return;
      }
      if (participantIds) {
        values.accidentCaseId = accidentEditId;
      }
      const save = participantIds ? updateParticipant : saveParticipantForm;
      const response = await save(values, participantIds);
      setParticipantId(response?.data?.id);
      setLoading(false);
      if (participantIds && accidentEditId) {
        navigate(`/cases-list/accident-case-preview/${accidentEditId}`);
      }
      if (response) {
        toast.push(
          <Notification className="mb-4" type="success">
            {response.data.message}
          </Notification>
        );
      }

      handleSave();
      toast.push(
        <Notification className="mb-4" type="success">
          Successful save.
        </Notification>
      );
    } catch (error) {
      setLoading(false);

      let errorMessage = "An error occurred while processing your request.";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.push(
        <Notification className="mb-4" type="danger">
          {errorMessage}
        </Notification>
      );
    }
  };

  const handleFileUpload = async (files) => {
    const updatedAttachments = [...attachments];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const url = await uploadFile(file);
        if (selectedDocumentType === "passport") {
          // Add a new attachment for passport
          updatedAttachments.push({
            name: file.name,
            url,
            fileType: selectedDocumentType,
            imageType: "passport images",
          });
        } else if (selectedDocumentType === "policyWhiteCard") {
          // Add a new attachment for passport
          updatedAttachments.push({
            name: file.name,
            url,
            fileType: selectedDocumentType,
            imageType: "white card",
          });
        } else {
          const attachmentIndex = updatedAttachments.findIndex(
            (attachment) =>
              attachment.fileType === selectedDocumentType &&
              attachment.imageType ===
                (selectedDocumentType === "nationalIdCard"
                  ? activeButtonCard
                  : selectedDocumentType === "drivingLicense"
                  ? activeButtonLicense
                  : selectedDocumentType === "vehicleDocument"
                  ? activeVehicleButtonCard
                  : "passport images")
          );
          if (attachmentIndex !== -1) {
            // Replace the existing attachment for other document types
            updatedAttachments[attachmentIndex] = {
              name: file.name,
              url,
              fileType: selectedDocumentType,
              imageType:
                selectedDocumentType === "nationalIdCard"
                  ? activeButtonCard
                  : selectedDocumentType === "drivingLicense"
                  ? activeButtonLicense
                  : selectedDocumentType === "vehicleDocument"
                  ? activeVehicleButtonCard
                  : selectedDocumentType === "policyWhiteCard"
                  ? "policyWhiteCard"
                  : "passport images",
            };
          } else {
            // Add a new attachment for other document types if not found
            updatedAttachments.push({
              name: file.name,
              url,
              fileType: selectedDocumentType,
              imageType:
                selectedDocumentType === "nationalIdCard"
                  ? activeButtonCard
                  : selectedDocumentType === "drivingLicense"
                  ? activeButtonLicense
                  : selectedDocumentType === "vehicleDocument"
                  ? activeVehicleButtonCard
                  : selectedDocumentType === "policyWhiteCard"
                  ? "policyWhiteCard"
                  : "passport images",
            });
          }
        }
        toast.push(
          <Notification className="mb-4" type="success">
            Upload Successfully
          </Notification>
        );
      } catch (error) {
        toast.push(
          <Notification className="mb-4" type="danger">
            Upload Failed
          </Notification>
        );
      }
    }
    setAttachments(updatedAttachments);
    setFiles([]);
  };

  // const handleSignatureSave = (signatureData) => {
  //   setValue('signature', signatureData)
  // }
  const onCardTabChange = (val) => {
    setActiveButtonCard(val);
  };
  const onLicenseTabChange = (val) => {
    setActiveButtonLicense(val);
  };
  const onVehicleCardTabChange = (val) => {
    setActiveVehicleButtonCard(val);
  };
  useEffect(() => {
    if (Object.keys(cardButtonType)) {
      setActiveVehicleButtonCard("front");
    } else {
      setActiveVehicleButtonCard("back");
    }
  }, []);
  useEffect(() => {
    if (Object.keys(cardButtonType)) {
      setActiveButtonCard("front");
    } else {
      setActiveButtonCard("back");
    }
  }, []);
  useEffect(() => {
    if (Object.keys(licenseButtonType)) {
      setActiveButtonLicense("front");
    } else {
      setActiveButtonLicense("back");
    }
  }, []);

  // const optionsWithOthersAka = [
  //   ...insuranceCompanyList,
  //   { label: 'Others', value: '111' },
  // ];
  const optionsWithOthersDamage = [
    ...insuranceCompanyList,
    { label: "Others", value: "others" },
  ];
  const optionsWithOthersThirdParty = [
    ...insuranceCompanyList,
    { label: "Others", value: "others" },
  ];

  const currentYear = dayjs().year();

  const yearOptions = [];
  for (let year = 2000; year <= currentYear; year++) {
    yearOptions.push({ label: year.toString(), value: year.toString() });
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer className="p-8">
          <div>
            {isParticipantFormEdit ? (
              watcher.participant?.id && (
                <div className="text-left grid sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-2 gap-x-4"></div>
              )
            ) : (
              <>
                {!participantIds && disableCard && (
                  <Card
                    className="dark:bg-gray-700 bg-white mb-8"
                    header={
                      <h5>
                        {t(
                          "heading.Agreed Statement Of Facts on Vehicle Accident"
                        )}
                      </h5>
                    }
                  >
                    <div className="text-left grid sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-3 gap-x-2">
                      {" "}
                      <FormItem
                        label={t("label.Date & Time of Accident")}
                        asterisk
                        border={false}
                        invalid={errors?.dateOfAccident}
                        errorMessage="Date & Time of Accident required!"
                      >
                        <div className="grid sm:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 gap-x-1">
                          <div>
                            <Controller
                              control={control}
                              rules={{ required: true }}
                              name="dateOfAccident"
                              render={({ field }) => (
                                <DatePicker
                                  {...field}
                                  onChange={(date) => field.onChange(date)}
                                  inputFormat={t("date.date-format")}
                                  placeholder={t(
                                    "label.Select Date of Accident"
                                  )}
                                  inputSuffix={null}
                                  inputPrefix={
                                    <HiOutlineCalendar className="text-lg" />
                                  }
                                />
                              )}
                            />
                          </div>

                          <div
                            className={`time-select-wrapper  ${
                              isDropdownOpen ? "dropdown-open" : ""
                            }`}
                          >
                            <Controller
                              name="dateOfAccident"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <div className="input-with-icon">
                                  <Input
                                    {...field}
                                    type="text"
                                    placeholder="Selected Time"
                                    value={`${selectedHour}:${selectedMinute}`}
                                    readOnly
                                    onClick={toggleDropdown}
                                    prefix={
                                      <HiOutlineClock
                                        className="text-xl"
                                        onClick={toggleDropdown}
                                      />
                                    }
                                  />
                                </div>
                              )}
                            />
                            {isDropdownOpen ? (
                              <div className="time-dropdown grid sm:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 gap-x-2">
                                <div className="time-select-section">
                                  <Controller
                                    name="hour"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <Select
                                        {...field}
                                        options={hourOptions.map((option) => ({
                                          value: option.value,
                                          label: option.label,
                                        }))}
                                        value={{
                                          label: selectedHour,
                                          value: selectedHour,
                                        }}
                                        onChange={(selectedOption) =>
                                          setSelectedHour(selectedOption.value)
                                        }
                                        placeholder="Hrs"
                                        menuIsOpen={isDropdownOpen}
                                        onBlur={closeDropdown}
                                      />
                                    )}
                                  />
                                </div>
                                <div className="time-select-section">
                                  <Controller
                                    name="minute"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <Select
                                        {...field}
                                        options={minuteOptions.map(
                                          (option) => ({
                                            value: option.value,
                                            label: option.label,
                                          })
                                        )}
                                        value={{
                                          label: selectedMinute,
                                          value: selectedMinute,
                                        }}
                                        onChange={(selectedOption) =>
                                          setSelectedMinute(
                                            selectedOption.value
                                          )
                                        }
                                        placeholder="Mins"
                                        menuIsOpen={isDropdownOpen}
                                        onBlur={closeDropdown}
                                      />
                                    )}
                                  />
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </FormItem>
                      <FormItem
                        label={t("label.Accident Address")}
                        asterisk
                        invalid={errors?.accidentAddress}
                        errorMessage="Participant Address is required!"
                      >
                        <Controller
                          control={control}
                          name="accidentAddress"
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder={t("label.Enter Accident Address")}
                              autocomplete="off"
                              {...field}
                            />
                          )}
                        />
                      </FormItem>
                      <FormItem
                        label={t("label.Country")}
                        asterisk
                        invalid={errors?.country}
                        errorMessage="Country is required!"
                      >
                        <Controller
                          control={control}
                          name="country"
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={countries}
                              placeholder={t("label.Select Country")}
                              value={countries.find(
                                (option) => option.value === field.value
                              )}
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption.value);
                                field.onBlur();
                              }}
                            />
                          )}
                        />
                      </FormItem>
                      <FormItem
                        label={t("label.City")}
                        asterisk
                        invalid={errors?.city}
                        errorMessage="City is required!"
                      >
                        <Controller
                          control={control}
                          name="city"
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder={t("label.Enter City")}
                              autocomplete="off"
                              {...field}
                            />
                          )}
                        />
                      </FormItem>
                      <FormItem
                        label={t("label.Injuries")}
                        asterisk
                        invalid={errors?.injuries}
                        errorMessage="Injury Option is required!"
                      >
                        <Controller
                          control={control}
                          name="injuries"
                          rules={{ required: true }}
                          render={({ field }) => (
                            <div className="flex items-center gap-4">
                              <div className="flex items-center">
                                <Radio
                                  id="injuriesYesRadio"
                                  value="yes"
                                  checked={field.value === "yes"}
                                  onChange={() => field.onChange("yes")}
                                />
                                <label
                                  htmlFor="injuriesYesRadio"
                                  className="ml-2"
                                >
                                  {t("label.Yes")}
                                </label>
                              </div>
                              <div className="flex items-center">
                                <Radio
                                  id="injuriesNoRadio"
                                  value="no"
                                  checked={field.value === "no"}
                                  onChange={() => field.onChange("no")}
                                />
                                <label
                                  htmlFor="injuriesNoRadio"
                                  className="ml-2"
                                >
                                  {t("label.No")}
                                </label>
                              </div>
                            </div>
                          )}
                        />
                      </FormItem>
                      <FormItem
                        label={t("label.Other than car damage A & B")}
                        asterisk
                        invalid={errors?.otherCarDamage}
                        errorMessage="Option is required!"
                      >
                        <Controller
                          control={control}
                          name="otherCarDamage"
                          rules={{ required: true }}
                          render={({ field }) => (
                            <div className="flex items-center gap-4">
                              <div className="flex items-center">
                                <Radio
                                  id="otherCarDamageYesRadio"
                                  value="yes"
                                  checked={field.value === "yes"}
                                  onChange={() => field.onChange("yes")}
                                />
                                <label
                                  htmlFor="otherCarDamageYesRadio"
                                  className="ml-2"
                                >
                                  {t("label.Yes")}
                                </label>
                              </div>
                              <div className="flex items-center">
                                <Radio
                                  id="otherCarDamageNoRadio"
                                  value="no"
                                  checked={field.value === "no"}
                                  onChange={() => field.onChange("no")}
                                />
                                <label
                                  htmlFor="otherCarDamageNoRadio"
                                  className="ml-2"
                                >
                                  {t("label.No")}
                                </label>
                              </div>
                            </div>
                          )}
                        />
                      </FormItem>
                      <FormItem
                        label={t("label.Investigation By Police")}
                        asterisk
                        invalid={errors?.investigationByPolice}
                        errorMessage="Option is required!"
                      >
                        <Controller
                          control={control}
                          name="investigationByPolice"
                          rules={{ required: true }}
                          render={({ field }) => (
                            <div className="flex items-center gap-4">
                              <div className="flex items-center">
                                <Radio
                                  id="investigationByPoliceYesRadio"
                                  value="yes"
                                  checked={field.value === "yes"}
                                  onChange={() => field.onChange("yes")}
                                />
                                <label
                                  htmlFor="investigationByPoliceYesRadio"
                                  className="ml-2"
                                >
                                  {t("label.Yes")}
                                </label>
                              </div>
                              <div className="flex items-center">
                                <Radio
                                  id="investigationByPoliceNoRadio"
                                  value="no"
                                  checked={field.value === "no"}
                                  onChange={() => field.onChange("no")}
                                />
                                <label
                                  htmlFor="investigationByPoliceNoRadio"
                                  className="ml-2"
                                >
                                  {t("label.No")}
                                </label>
                              </div>
                            </div>
                          )}
                        />
                      </FormItem>
                      {investigationByPoliceValue === "yes" && (
                        <FormItem
                          label={t("label.Police Department")}
                          asterisk
                          invalid={errors?.policeDepartment}
                          errorMessage="Police Department is required!"
                        >
                          <Controller
                            control={control}
                            name="policeDepartment"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder={t("label.Enter Police Department")}
                                autoComplete="off"
                                {...field}
                              />
                            )}
                          />
                        </FormItem>
                      )}
                      <FormItem label={t("label.Witness")}>
                        <Controller
                          control={control}
                          name="witness"
                          render={({ field }) => (
                            <Input
                              type="text"
                              placeholder={t("label.Enter Witness")}
                              autoComplete="off"
                              value={field.value?.witness || field.value} // Access the correct property based on its type
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          )}
                        />
                      </FormItem>
                    </div>
                  </Card>
                )}
                {
                  <>
                    {" "}
                    <Card
                      className="dark:bg-gray-700 bg-white mb-8"
                      header={<h5>{t("heading.Owner Details")}</h5>}
                    >
                      <div className="text-left grid sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-3 gap-x-4">
                        <FormItem
                          label={t("label.If The Car Is Own By")}
                          asterisk
                          invalid={errors?.carOwnBy}
                          errorMessage="Option is required!"
                        >
                          <Controller
                            control={control}
                            name="carOwnBy"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                  <Radio
                                    id="individualOwn"
                                    value="individual"
                                    checked={field.value === "individual"}
                                    onChange={() =>
                                      field.onChange("individual")
                                    }
                                  />
                                  <label
                                    htmlFor="individualOwn"
                                    className="ml-2"
                                  >
                                    {t("label.Individual")}
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <Radio
                                    id="companyOwn"
                                    value="company"
                                    checked={field.value === "company"}
                                    onChange={() => field.onChange("company")}
                                  />
                                  <label htmlFor="companyOwn" className="ml-2">
                                    {t("label.Company")}
                                  </label>
                                </div>
                              </div>
                            )}
                          />
                        </FormItem>
                        {carOwnByValue === "individual" && (
                          <>
                            <FormItem
                              label={t("label.Full Name")}
                              asterisk
                              invalid={errors?.ownerName}
                              errorMessage="Owner name is required!"
                            >
                              <Controller
                                control={control}
                                name="ownerName"
                                rules={{ required: true }}
                                render={({ field }) => (
                                  <Input
                                    type="text"
                                    placeholder={t("label.Enter Owner Name")}
                                    autoComplete="off"
                                    {...field}
                                  />
                                )}
                              />
                            </FormItem>
                            <FormItem
                              label={t("label.Address")}
                              asterisk
                              invalid={errors?.ownerAddress}
                              errorMessage="Owner address is required!"
                            >
                              <Controller
                                control={control}
                                name="ownerAddress"
                                rules={{ required: true }}
                                render={({ field }) => (
                                  <Input
                                    type="text"
                                    placeholder={t("label.Enter Owner Address")}
                                    autoComplete="off"
                                    {...field}
                                  />
                                )}
                              />
                            </FormItem>
                            <FormItem
                              label={t("label.Birth Number")}
                              asterisk
                              invalid={errors?.ownerBirthNumber}
                              errorMessage="Birth number is required!"
                            >
                              <Controller
                                control={control}
                                name="ownerBirthNumber"
                                rules={{ required: true }}
                                render={({ field }) => (
                                  <Input
                                    type="text"
                                    placeholder={t("label.Enter Birth number")}
                                    autoComplete="off"
                                    {...field}
                                  />
                                )}
                              />
                            </FormItem>
                          </>
                        )}
                        {carOwnByValue === "company" && (
                          <>
                            <FormItem
                              label={t("label.Company Name")}
                              asterisk
                              invalid={errors?.companyName}
                              errorMessage="Company Name is required!"
                            >
                              <Controller
                                control={control}
                                name="companyName"
                                rules={{ required: true }}
                                render={({ field }) => (
                                  <Input
                                    type="text"
                                    placeholder={t("label.Enter Company Name")}
                                    autoComplete="off"
                                    {...field}
                                  />
                                )}
                              />
                            </FormItem>
                            <FormItem
                              label={t("label.Registration Number")}
                              asterisk
                              invalid={errors?.companyRegistrationNumber}
                              errorMessage="Company Registration Number is required!"
                            >
                              <Controller
                                control={control}
                                name="companyRegistrationNumber"
                                rules={{ required: true }}
                                render={({ field }) => (
                                  <Input
                                    type="text"
                                    placeholder={t(
                                      "label.Enter Company Registration Number"
                                    )}
                                    autoComplete="off"
                                    {...field}
                                  />
                                )}
                              />
                            </FormItem>
                            <FormItem
                              label={t("label.Email")}
                              asterisk
                              invalid={errors?.companyEmail}
                              errorMessage="Company Email is required!"
                            >
                              <Controller
                                control={control}
                                name="companyEmail"
                                rules={{ required: true }}
                                render={({ field }) => (
                                  <Input
                                    type="email"
                                    placeholder={t("label.Enter Company Email")}
                                    autoComplete="off"
                                    {...field}
                                  />
                                )}
                              />
                            </FormItem>
                            <FormItem
                              label={t("label.Payer of VAT")}
                              asterisk
                              invalid={errors?.companyVatPayer}
                              errorMessage="Option is required!"
                            >
                              <Controller
                                control={control}
                                name="companyVatPayer"
                                rules={{ required: true }}
                                render={({ field }) => (
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center">
                                      <Radio
                                        id="vatPayerYesRadio"
                                        value="yes"
                                        checked={field.value === "yes"}
                                        onChange={() => field.onChange("yes")}
                                      />
                                      <label
                                        htmlFor="vatPayerYesRadio"
                                        className="ml-2"
                                      >
                                        {t("label.Yes")}
                                      </label>
                                    </div>
                                    <div className="flex items-center">
                                      <Radio
                                        id="vatPayerNoRadio"
                                        value="no"
                                        checked={field.value === "no"}
                                        onChange={() => field.onChange("no")}
                                      />
                                      <label
                                        htmlFor="vatPayerNoRadio"
                                        className="ml-2"
                                      >
                                        {t("label.No")}
                                      </label>
                                    </div>
                                  </div>
                                )}
                              />
                            </FormItem>
                            {VatPayerValue === "yes" && (
                              <FormItem
                                label={t("label.Enter VAT Number")}
                                asterisk
                                invalid={errors?.vatNumber}
                                errorMessage="vatNumber is required!"
                              >
                                <Controller
                                  control={control}
                                  rules={{ required: true }}
                                  name="vatNumber"
                                  render={({ field }) => (
                                    <Input
                                      isClearable
                                      {...field}
                                      placeholder={t("label.Enter VAT Number")}
                                    />
                                  )}
                                />
                              </FormItem>
                            )}
                          </>
                        )}
                        <FormItem
                          label={t("label.Is It For Leasing")}
                          asterisk
                          invalid={errors?.forLeasing}
                          errorMessage="Leasing is required!"
                        >
                          <Controller
                            control={control}
                            name="forLeasing"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                  <Radio
                                    id="yes"
                                    value="yes"
                                    checked={field.value === "yes"}
                                    onChange={() => field.onChange("yes")}
                                  />
                                  <label htmlFor="yes" className="ml-2">
                                    {t("label.Yes")}
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <Radio
                                    id="no"
                                    value="no"
                                    checked={field.value === "no"}
                                    onChange={() => field.onChange("no")}
                                  />
                                  <label htmlFor="no" className="ml-2">
                                    {t("label.No")}
                                  </label>
                                </div>
                              </div>
                            )}
                          />
                        </FormItem>
                        {forLeasingValue === "yes" && (
                          <FormItem
                            label={t("label.In Which Leasing Company")}
                            asterisk
                            invalid={errors?.leasingInsuranceCompanyId}
                            errorMessage="which Leasing is required!"
                          >
                            <Controller
                              control={control}
                              rules={{ required: true }}
                              name="leasingInsuranceCompanyId"
                              render={({ field }) => (
                                <Select
                                  isClearable
                                  {...field}
                                  placeholder={t("label.Select Which Leasing")}
                                  options={leasingInsuranceCompanyList}
                                />
                              )}
                            />
                          </FormItem>
                        )}{" "}
                        <FormItem
                          label={t("label.Third-Party Insurance")}
                          asterisk
                          invalid={errors?.liabilityInsurance}
                          errorMessage="Third-Party Liability Insurance is required!"
                        >
                          <Controller
                            control={control}
                            name="liabilityInsurance"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                  <Radio
                                    id="liabilityInsuranceYesRadio"
                                    value="yes"
                                    checked={field.value === "yes"}
                                    onChange={() => field.onChange("yes")}
                                  />
                                  <label
                                    htmlFor="liabilityInsuranceYesRadio"
                                    className="ml-2"
                                  >
                                    {t("label.Yes")}
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <Radio
                                    id="liabilityInsuranceNoRadio"
                                    value="no"
                                    checked={field.value === "no"}
                                    onChange={() => field.onChange("no")}
                                  />
                                  <label
                                    htmlFor="liabilityInsuranceNoRadio"
                                    className="ml-2"
                                  >
                                    {t("label.No")}
                                  </label>
                                </div>
                              </div>
                            )}
                          />
                        </FormItem>
                        {liabilityInsuranceValue === "yes" && (
                          <>
                            {" "}
                            <FormItem
                              label={t("label.Third Party Insured Company")}
                              asterisk
                              invalid={errors?.liabilityInsuranceCompanyId}
                              errorMessage="Third Party Insured Company is required!"
                            >
                              <Controller
                                control={control}
                                rules={{ required: true }}
                                name="liabilityInsuranceCompanyId"
                                render={({ field }) => (
                                  <Select
                                    isClearable
                                    {...field}
                                    placeholder={t(
                                      "label.Enter Third Party Insured Company"
                                    )}
                                    options={optionsWithOthersThirdParty}
                                    onChange={(selectedOption) => {
                                      field.onChange(selectedOption);
                                      if (selectedOption?.value === "others") {
                                        setShowOthersInputThirdParty(true);
                                      } else {
                                        setShowOthersInputThirdParty(false);
                                      }
                                    }}
                                  />
                                )}
                              />
                            </FormItem>
                            {showOthersInputThirdParty && (
                              <FormItem
                                label={t(
                                  "label.Other Third Party Insured Company"
                                )}
                                asterisk
                                invalid={
                                  errors?.otherLiabilityInsuranceCompanyName
                                }
                                errorMessage="Other Third Party Insured Company is required!"
                              >
                                <Controller
                                  control={control}
                                  name="otherLiabilityInsuranceCompanyName"
                                  rules={{ required: true }}
                                  render={({ field }) => (
                                    <Input
                                      type="text"
                                      placeholder={t(
                                        "label.Type Other Third Party Insured Company"
                                      )}
                                      autoComplete="off"
                                      {...field}
                                    />
                                  )}
                                />
                              </FormItem>
                            )}
                          </>
                        )}
                        <FormItem
                          label={t("label.Is It Damage Insured")}
                          asterisk
                          invalid={errors?.isDamageInsurance}
                          errorMessage="Is It Damage Insured is required!"
                        >
                          <Controller
                            control={control}
                            name="isDamageInsurance"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                  <Radio
                                    id="isDamageInsurance"
                                    value="yes"
                                    checked={field.value === "yes"}
                                    onChange={() => field.onChange("yes")}
                                  />
                                  <label
                                    htmlFor="isDamageInsurance"
                                    className="ml-2"
                                  >
                                    {t("label.Yes")}
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <Radio
                                    id="isDamageInsurance"
                                    value="no"
                                    checked={field.value === "no"}
                                    onChange={() => field.onChange("no")}
                                  />
                                  <label
                                    htmlFor="isDamageInsurance"
                                    className="ml-2"
                                  >
                                    {t("label.No")}
                                  </label>
                                </div>
                              </div>
                            )}
                          />
                        </FormItem>
                        {isDamageInsuranceValue === "yes" && (
                          <>
                            {" "}
                            <FormItem
                              label={t("label.In Which Insured Company")}
                              asterisk
                              invalid={errors?.damageInsuranceCompanyId}
                              errorMessage="Damage Insured Company is required!"
                            >
                              <Controller
                                control={control}
                                rules={{ required: true }}
                                name="damageInsuranceCompanyId"
                                render={({ field }) => (
                                  <Select
                                    isClearable
                                    {...field}
                                    placeholder={t(
                                      "label.Enter Damage Insured Company"
                                    )}
                                    options={optionsWithOthersDamage}
                                    onChange={(selectedOption) => {
                                      field.onChange(selectedOption);
                                      if (selectedOption?.value === "others") {
                                        setShowOthersInputDamage(true);
                                      } else {
                                        setShowOthersInputDamage(false);
                                      }
                                    }}
                                  />
                                )}
                              />
                            </FormItem>
                            {showOthersInputDamage && (
                              <FormItem
                                label={t("label.Other Damage Insured Company")}
                                asterisk
                                invalid={
                                  errors?.otherDamageInsuranceCompanyName
                                }
                                errorMessage="Other Damage Insurance Company is required!"
                              >
                                <Controller
                                  control={control}
                                  name="otherDamageInsuranceCompanyName"
                                  rules={{ required: true }}
                                  render={({ field }) => (
                                    <Input
                                      type="text"
                                      placeholder={t(
                                        "label.Type Other Damage Insured Company"
                                      )}
                                      autoComplete="off"
                                      {...field}
                                    />
                                  )}
                                />
                              </FormItem>
                            )}
                          </>
                        )}
                        <FormItem
                          label={t("label.Email Address Of Party")}
                          asterisk={!isOwnerPhoneNumberFilled}
                          invalid={errors?.partyEmail}
                          errorMessage="Participant Email is required!"
                        >
                          <Controller
                            control={control}
                            name="partyEmail"
                            rules={{ required: !isOwnerPhoneNumberFilled }}
                            render={({ field }) => (
                              <Input
                                type="email"
                                placeholder={t("label.Enter Participant Email")}
                                autoComplete="off"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setIsPartyEmailFilled(
                                    e.target.value.trim() !== ""
                                  );
                                }}
                              />
                            )}
                          />
                        </FormItem>
                        <FormItem
                          label={t("label.Phone Number")}
                          asterisk={!isPartyEmailFilled}
                          invalid={errors?.ownerPhoneNumber}
                          errorMessage="Phone Number is required!"
                        >
                          <Controller
                            control={control}
                            name="ownerPhoneNumber"
                            rules={{ required: !isPartyEmailFilled }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder={t(
                                  "label.Phone Number is required"
                                )}
                                maxLength={11}
                                autoComplete="off"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setIsOwnerPhoneNumberFilled(
                                    e.target.value.trim() !== ""
                                  );
                                }}
                              />
                            )}
                          />
                        </FormItem>
                        <FormItem
                          label={t("label.Party Policy Number")}
                          asterisk
                          invalid={errors.thirdPartyPolicyNumber}
                          errorMessage="Policy number is required!"
                        >
                          <Controller
                            control={control}
                            name="thirdPartyPolicyNumber"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder={t("label.Enter Policy Number")}
                                autoComplete="off"
                                {...field}
                              />
                            )}
                          />
                        </FormItem>
                        <FormItem
                          label={t(
                            "label.Party Green Card Number (for foreigners only)"
                          )}
                          asterisk
                          invalid={errors?.thirdPartyGreenCard}
                          errorMessage="Green Card information is required!"
                        >
                          <Controller
                            control={control}
                            name="thirdPartyGreenCard"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder={t(
                                  "label.Enter Green Card Information"
                                )}
                                autoComplete="off"
                                {...field}
                              />
                            )}
                          />
                        </FormItem>
                      </div>
                    </Card>
                    <Card
                      className="dark:bg-gray-700 bg-white mb-8"
                      header={<h5>{t("heading.Vehicle Details")}</h5>}
                    >
                      <div className="text-left grid sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-3 gap-x-4">
                        <FormItem
                          label={t("label.Vehicle License Plate")}
                          asterisk
                          invalid={errors?.vehicleLicensePlate}
                          errorMessage="Vehicle License Plate is required!"
                        >
                          <Controller
                            control={control}
                            name="vehicleLicensePlate"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder={t(
                                  "label.Enter Vehicle License Plate"
                                )}
                                autoComplete="off"
                                {...field}
                              />
                            )}
                          />
                        </FormItem>
                        <FormItem
                          label={t("label.Vehicle Manufacturer/Model")}
                          asterisk
                          invalid={errors?.vehicleModel}
                          errorMessage="Vehicle Manufacturer/Model is required!"
                        >
                          <Controller
                            control={control}
                            name="vehicleModel"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder={t(
                                  "label.Enter Vehicle Manufacturer/Model"
                                )}
                                autoComplete="off"
                                {...field}
                              />
                            )}
                          />
                        </FormItem>
                        <FormItem
                          label={t("label.VIN Number")}
                          asterisk
                          invalid={errors?.vinNumber}
                          errorMessage="VIN Number required!"
                        >
                          <Controller
                            control={control}
                            name="vinNumber"
                            rules={{
                              required: "VIN Number is required!",
                            }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder={t("label.Enter VIN Number")}
                                autoComplete="off"
                                {...field}
                                maxLength={17}
                              />
                            )}
                          />
                        </FormItem>
                        <FormItem
                          label={t("label.Year Of Manufacture")}
                          asterisk
                          invalid={errors?.yearOfManufacture}
                          errorMessage="Year Of Manufacture Date is required!"
                        >
                          <Controller
                            control={control}
                            name="yearOfManufacture"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={yearOptions}
                                placeholder={t(
                                  "label.Select Year Of Manufacture Date"
                                )}
                              />
                            )}
                          />
                        </FormItem>
                        <FormItem
                          label={t("label.Visible Damage")}
                          invalid={errors?.visibleDamage}
                          errorMessage="Please Select Atleast One Option"
                          required
                        >
                          <Controller
                            control={control}
                            name="visibleDamage"
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={visibleDamages}
                                placeholder={t("label.Visible Damage")}
                                isMulti
                                onChange={(selected) => {
                                  const selectedValues = selected.map(
                                    (option) => option.value
                                  );
                                  setSelectedOptionsVisible(selectedValues);
                                  field.onChange(selectedValues);
                                }}
                                value={visibleDamages.filter((option) =>
                                  selectedOptionsVisible.includes(option.value)
                                )}
                              />
                            )}
                          />
                        </FormItem>
                      </div>
                      <Card
                        id="attachmentFormItem"
                        className="dark:bg-gray-700 bg-white mb-8 mt-8"
                      >
                        <FormItem
                          label={t("label.Attachments Type")}
                          asterisk
                          // invalid={errors?.documents}
                          // errorMessage={errors?.documents && errors.documents.message}
                          // required={!selectedDocumentType}
                        >
                          <Select
                            options={documetType}
                            placeholder={t("label.Select Attachment Type")}
                            value={documetType.find(
                              (option) => option.value === selectedDocumentType
                            )}
                            onChange={(selectedOption) =>
                              setSelectedDocumentType(selectedOption.value)
                            }
                          />
                        </FormItem>
                        {selectedDocumentType === "nationalIdCard" && (
                          <FormItem
                            label={t("label.Driver National Id Card")}
                            asterisk
                            errorMessage="Driver National Id Card is required!"
                          >
                            <>
                              <Container className="p-4">
                                <AdaptableCard>
                                  <Tabs
                                    value={activeButtonCard}
                                    onChange={(val) => onCardTabChange(val)}
                                  >
                                    <TabList>
                                      {Object.keys(cardButtonType).map(
                                        (key) => (
                                          <TabNav key={key} value={key}>
                                            {cardButtonType[key].label}
                                          </TabNav>
                                        )
                                      )}
                                    </TabList>
                                  </Tabs>
                                  <div className="p-4">
                                    <Suspense fallback={<></>}>
                                      {activeButtonCard === "front" && (
                                        <Upload
                                          className="min-h-fit mt-8"
                                          onChange={handleFileUpload}
                                          showList={true}
                                          fileList={files}
                                          draggable
                                        >
                                          <div className="max-w-full flex flex-col px-4 py-2 justify-center items-center">
                                            <DoubleSidedImage
                                              src="/img/others/upload.png"
                                              darkModeSrc="/img/others/upload-dark.png"
                                            />
                                            <p className="font-semibold text-center text-gray-800 dark:text-white">
                                              {t(
                                                "label.Upload National Id card front"
                                              )}
                                            </p>
                                          </div>
                                        </Upload>
                                      )}
                                      {activeButtonCard === "back" && (
                                        <Upload
                                          className="min-h-fit mt-8"
                                          onChange={handleFileUpload}
                                          showList={true}
                                          fileList={files}
                                          draggable
                                        >
                                          <div className="max-w-full flex flex-col px-4 py-2 justify-center items-center">
                                            <DoubleSidedImage
                                              src="/img/others/upload.png"
                                              darkModeSrc="/img/others/upload-dark.png"
                                            />
                                            <p className="font-semibold text-center text-gray-800 dark:text-white">
                                              {t(
                                                "label.Upload National Id card back"
                                              )}
                                            </p>
                                          </div>
                                        </Upload>
                                      )}
                                    </Suspense>
                                  </div>
                                </AdaptableCard>
                              </Container>
                            </>
                          </FormItem>
                        )}
                        {selectedDocumentType === "drivingLicense" && (
                          <FormItem
                            label={t("label.Driver License")}
                            asterisk
                            errorMessage=" drivingLicense is required!"
                          >
                            <>
                              <Container className="p-4">
                                <AdaptableCard>
                                  <Tabs
                                    value={activeButtonLicense}
                                    onChange={(val) => onLicenseTabChange(val)}
                                  >
                                    <TabList>
                                      {Object.keys(licenseButtonType).map(
                                        (key) => (
                                          <TabNav key={key} value={key}>
                                            {licenseButtonType[key].label}
                                          </TabNav>
                                        )
                                      )}
                                    </TabList>
                                  </Tabs>
                                  <div className="p-4">
                                    <Suspense fallback={<></>}>
                                      {activeButtonLicense === "front" && (
                                        <Upload
                                          className="min-h-fit mt-8"
                                          onChange={handleFileUpload}
                                          showList={true}
                                          fileList={files}
                                          draggable
                                        >
                                          <div className="max-w-full flex flex-col px-4 py-2 justify-center items-center">
                                            <DoubleSidedImage
                                              src="/img/others/upload.png"
                                              darkModeSrc="/img/others/upload-dark.png"
                                            />
                                            <p className="font-semibold text-center text-gray-800 dark:text-white">
                                              {t(
                                                "label.Upload Driving License front"
                                              )}
                                            </p>
                                          </div>
                                        </Upload>
                                      )}

                                      {activeButtonLicense === "back" && (
                                        <Upload
                                          className="min-h-fit mt-8"
                                          onChange={handleFileUpload}
                                          showList={true}
                                          fileList={files}
                                          draggable
                                        >
                                          <div className="max-w-full flex flex-col px-4 py-2 justify-center items-center">
                                            <DoubleSidedImage
                                              src="/img/others/upload.png"
                                              darkModeSrc="/img/others/upload-dark.png"
                                            />
                                            <p className="font-semibold text-center text-gray-800 dark:text-white">
                                              {t(
                                                "label.Upload Driving License back"
                                              )}
                                            </p>
                                          </div>
                                        </Upload>
                                      )}
                                    </Suspense>
                                  </div>
                                </AdaptableCard>
                              </Container>
                            </>
                          </FormItem>
                        )}
                        {selectedDocumentType === "passport" && (
                          <FormItem
                            label={t("label.Driver Passport")}
                            asterisk
                            errorMessage="Driving passport is required!"
                          >
                            <Upload
                              className="min-h-fit mt-8"
                              multiple={true}
                              onChange={handleFileUpload}
                              showList={true}
                              fileList={files}
                              draggable
                            >
                              <div className="max-w-full flex flex-col px-4 py-2 justify-center items-center">
                                <DoubleSidedImage
                                  src="/img/others/upload.png"
                                  darkModeSrc="/img/others/upload-dark.png"
                                />
                                <p className="font-semibold text-center text-gray-800 dark:text-white">
                                  {t("label.Upload passport")}
                                </p>
                              </div>
                            </Upload>
                          </FormItem>
                        )}
                        {selectedDocumentType === "policyWhiteCard" && (
                          <FormItem
                            label={t("label.Driver Policy White Card")}
                            asterisk
                            required
                            errorMessage="Driver Policy White Card is required!"
                          >
                            <Upload
                              className="min-h-fit mt-8"
                              multiple={true}
                              onChange={handleFileUpload}
                              showList={true}
                              fileList={files}
                              draggable
                            >
                              <div className="max-w-full flex flex-col px-4 py-2 justify-center items-center">
                                <DoubleSidedImage
                                  src="/img/others/upload.png"
                                  darkModeSrc="/img/others/upload-dark.png"
                                />
                                <p className="font-semibold text-center text-gray-800 dark:text-white">
                                  {t("label.Upload Driver Policy White Card")}
                                </p>
                              </div>
                            </Upload>
                          </FormItem>
                        )}
                        {selectedDocumentType === "vehicleDocument" && (
                          <FormItem
                            label={t("label.Vehicle Document")}
                            asterisk
                            errorMessage="Vehicle Document is required!"
                          >
                            <>
                              <Container className="p-4">
                                <AdaptableCard>
                                  <Tabs
                                    value={activeVehicleButtonCard}
                                    onChange={(val) =>
                                      onVehicleCardTabChange(val)
                                    }
                                  >
                                    <TabList>
                                      {Object.keys(vehicleButtonType).map(
                                        (key) => (
                                          <TabNav key={key} value={key}>
                                            {vehicleButtonType[key].label}
                                          </TabNav>
                                        )
                                      )}
                                    </TabList>
                                  </Tabs>
                                  <div className="p-4">
                                    <Suspense fallback={<></>}>
                                      {activeVehicleButtonCard === "front" && (
                                        <Upload
                                          className="min-h-fit mt-8"
                                          onChange={handleFileUpload}
                                          showList={true}
                                          fileList={files}
                                          draggable
                                        >
                                          <div className="max-w-full flex flex-col px-4 py-2 justify-center items-center">
                                            <DoubleSidedImage
                                              src="/img/others/upload.png"
                                              darkModeSrc="/img/others/upload-dark.png"
                                            />
                                            <p className="font-semibold text-center text-gray-800 dark:text-white">
                                              {t(
                                                "label.Upload Vehicle Document front"
                                              )}
                                            </p>
                                          </div>
                                        </Upload>
                                      )}
                                      {activeVehicleButtonCard === "back" && (
                                        <Upload
                                          className="min-h-fit mt-8"
                                          onChange={handleFileUpload}
                                          showList={true}
                                          fileList={files}
                                          draggable
                                        >
                                          <div className="max-w-full flex flex-col px-4 py-2 justify-center items-center">
                                            <DoubleSidedImage
                                              src="/img/others/upload.png"
                                              darkModeSrc="/img/others/upload-dark.png"
                                            />
                                            <p className="font-semibold text-center text-gray-800 dark:text-white">
                                              {t(
                                                "label.Upload Vehicle Document Back"
                                              )}
                                            </p>
                                          </div>
                                        </Upload>
                                      )}
                                    </Suspense>
                                  </div>
                                </AdaptableCard>
                              </Container>
                            </>
                          </FormItem>
                        )}
                        <div className="text-left grid sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-3 gap-x-4">
                          <div>
                            {idCardAttachments?.map((attachment, index) => (
                              <div
                                key={index}
                                className="p-4 rounded-md relative group flex flex-col "
                              >
                                {" "}
                                <p className="text-md mb-2">
                                  <b>{attachment.imageType} Id Card</b>
                                </p>
                                <div className="flex w-full gap-2  items-center p-2">
                                  <>
                                    <img
                                      src={`${S3_URL}/${attachment.url.data.name}`}
                                      alt="Unknown Document"
                                      className="h-10"
                                    />
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      onClick={() =>
                                        window.open(
                                          `${S3_URL}/${attachment.url.data.name}`,
                                          "_blank"
                                        )
                                      }
                                    >
                                      <HiOutlineEye
                                        size={20}
                                        className="cursor-pointer p-2 hover:text-green-500"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      onClick={() =>
                                        deleteFromIdCardAttachments(index)
                                      }
                                    >
                                      <HiOutlineTrash
                                        size={20}
                                        className="cursor-pointer p-2 hover:text-red-500"
                                      />
                                    </svg>
                                  </>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div>
                            {drivingLicenseAttachments?.map(
                              (attachment, index) => (
                                <div
                                  key={index}
                                  className=" p-4 rounded-md relative group flex flex-col"
                                >
                                  <p className="text-md mb-2">
                                    <b>
                                      {attachment.imageType} Driving License
                                    </b>
                                  </p>
                                  <div className="flex w-full gap-2  items-center p-2">
                                    <>
                                      <img
                                        src={`${S3_URL}/${attachment.url.data.name}`}
                                        alt="Unknown Document"
                                        className="h-10"
                                      />
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        onClick={() =>
                                          window.open(
                                            `${S3_URL}/${attachment.url.data.name}`,
                                            "_blank"
                                          )
                                        }
                                      >
                                        <HiOutlineEye
                                          size={20}
                                          className="cursor-pointer p-2 hover:text-green-500"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        onClick={() =>
                                          deleteFromDrivingLicenseAttachments(
                                            index
                                          )
                                        }
                                      >
                                        <HiOutlineTrash
                                          size={20}
                                          className="cursor-pointer p-2 hover:text-red-500"
                                        />
                                      </svg>
                                    </>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                          <div>
                            {vehicleCardAttachments?.map(
                              (attachment, index) => (
                                <div
                                  key={index}
                                  className=" p-4 rounded-md relative group flex flex-col"
                                >
                                  <p className="text-md mb-2">
                                    <b>
                                      {attachment.imageType} Vehicle Document
                                    </b>
                                  </p>
                                  <div className="flex w-full gap-2  items-center p-2">
                                    <>
                                      <img
                                        src={`${S3_URL}/${attachment.url.data.name}`}
                                        alt="Unknown Document"
                                        className="h-10"
                                      />
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        onClick={() =>
                                          window.open(
                                            `${S3_URL}/${attachment.url.data.name}`,
                                            "_blank"
                                          )
                                        }
                                      >
                                        <HiOutlineEye
                                          size={20}
                                          className="cursor-pointer p-2 hover:text-green-500"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        onClick={() =>
                                          deleteFromVehicleCardAttachments(
                                            index
                                          )
                                        }
                                      >
                                        <HiOutlineTrash
                                          size={20}
                                          className="cursor-pointer p-2 hover:text-red-500"
                                        />
                                      </svg>
                                    </>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                          <div>
                            {policyWhiteCardAttachments?.map(
                              (attachment, index) => (
                                <div
                                  key={index}
                                  className=" p-4 rounded-md relative group flex flex-col"
                                >
                                  <p className="text-md mb-2">
                                    <b>{attachment.imageType}</b>
                                  </p>
                                  <div className="flex w-full gap-2  items-center p-2">
                                    <>
                                      <img
                                        src={`${S3_URL}/${attachment.url.data.name}`}
                                        alt="Unknown Document"
                                        className="h-10"
                                      />
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        onClick={() =>
                                          window.open(
                                            `${S3_URL}/${attachment.url.data.name}`,
                                            "_blank"
                                          )
                                        }
                                      >
                                        <HiOutlineEye
                                          size={20}
                                          className="cursor-pointer p-2 hover:text-green-500"
                                        />
                                      </svg>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        onClick={() =>
                                          deleteFromPolicyWhiteCardAttachments(
                                            index
                                          )
                                        }
                                      >
                                        <HiOutlineTrash
                                          size={20}
                                          className="cursor-pointer p-2 hover:text-red-500"
                                        />
                                      </svg>
                                    </>
                                  </div>
                                </div>
                              )
                            )}
                          </div>

                          <div>
                            {passportAttachments?.map((attachment, index) => (
                              <div
                                key={index}
                                className=" p-4 rounded-md relative group flex flex-col"
                              >
                                <p className="text-md mb-2">
                                  <b>{attachment.imageType}</b>
                                </p>
                                <div className="flex w-full gap-2  items-center p-2">
                                  <>
                                    <img
                                      src={`${S3_URL}/${attachment.url.data.name}`}
                                      alt="Unknown Document"
                                      className="h-10"
                                    />
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      onClick={() =>
                                        window.open(
                                          `${S3_URL}/${attachment.url.data.name}`,
                                          "_blank"
                                        )
                                      }
                                    >
                                      <HiOutlineEye
                                        size={20}
                                        className="cursor-pointer p-2 hover:text-green-500"
                                      />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      onClick={() =>
                                        deleteFromPassportAttachments(index)
                                      }
                                    >
                                      <HiOutlineTrash
                                        size={20}
                                        className="cursor-pointer p-2 hover:text-red-500"
                                      />
                                    </svg>
                                  </>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>{" "}
                    </Card>
                    <Card
                      className="dark:bg-gray-700 bg-white mb-8"
                      header={<h5>{t("heading.Driver Details")}</h5>}
                    >
                      <div className="text-left grid sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-3 gap-x-4">
                        <FormItem
                          label={t("label.Driver Name")}
                          asterisk
                          invalid={errors?.driverName}
                          errorMessage="Driver name is required!"
                        >
                          <Controller
                            control={control}
                            name="driverName"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder={t("label.Enter Driver Name")}
                                autoComplete="off"
                                {...field}
                              />
                            )}
                          />
                        </FormItem>
                        <FormItem
                          label={t("label.Driver Surname")}
                          asterisk
                          invalid={errors?.driverSurname}
                          errorMessage="Driver surname is required!"
                        >
                          <Controller
                            control={control}
                            name="driverSurname"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder={t("label.Enter Driver Surname")}
                                autoComplete="off"
                                {...field}
                              />
                            )}
                          />
                        </FormItem>
                        <FormItem
                          label={t("label.Driver Address")}
                          asterisk
                          invalid={errors.driverAddress}
                          errorMessage="Driver address is required!"
                        >
                          <Controller
                            control={control}
                            name="driverAddress"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder={t("label.Enter Driver Address")}
                                autoComplete="off"
                                {...field}
                              />
                            )}
                          />
                        </FormItem>
                        <FormItem
                          label={t("label.Driving License Number")}
                          asterisk
                          invalid={errors?.driverLicenseNumber}
                          errorMessage="Driving license number is required!"
                        >
                          <Controller
                            control={control}
                            name="driverLicenseNumber"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder={t(
                                  "label.Enter Driving License Number"
                                )}
                                autoComplete="off"
                                {...field}
                              />
                            )}
                          />
                        </FormItem>
                        <FormItem
                          label={t("label.Groups")}
                          asterisk
                          invalid={errors?.driverGroups}
                          errorMessage="Groups information is required!"
                        >
                          <Controller
                            control={control}
                            name="driverGroups"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder={t("label.Enter groups")}
                                autoComplete="off"
                                value={field.value?.groups || field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            )}
                          />
                        </FormItem>
                        <FormItem
                          label={t("label.Issued By")}
                          asterisk
                          invalid={errors?.driverIssuedBy}
                          errorMessage="Issuing authority is required!"
                        >
                          <Controller
                            control={control}
                            name="driverIssuedBy"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Input
                                type="text"
                                placeholder={t("label.Enter Issuing Authority")}
                                autoComplete="off"
                                {...field}
                              />
                            )}
                          />
                        </FormItem>
                        <FormItem
                          label={t("label.Valid From")}
                          asterisk
                          invalid={errors?.driverValidFrom}
                          errorMessage="Valid From date is required!"
                        >
                          <Controller
                            control={control}
                            name="driverValidFrom"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <DatePicker
                                {...field}
                                selected={field.value}
                                onChange={(date) => field.onChange(date)}
                                inputPrefix={
                                  <HiOutlineCalendar className="text-lg" />
                                }
                                inputSuffix={null}
                                inputFormat={t("date.date-format")}
                                placeholder={t("label.Select Valid From Date")}
                              />
                            )}
                          />
                        </FormItem>

                        <FormItem
                          label={t("label.Valid To")}
                          asterisk
                          invalid={errors?.driverValidTo}
                          errorMessage="Valid To date is required!"
                        >
                          <Controller
                            control={control}
                            name="driverValidTo"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <DatePicker
                                {...field}
                                selected={field.value}
                                onChange={(date) => field.onChange(date)}
                                inputPrefix={
                                  <HiOutlineCalendar className="text-lg" />
                                }
                                inputSuffix={null}
                                inputFormat={t("date.date-format")}
                                placeholder={t("label.Select Valid To Date")}
                              />
                            )}
                          />
                        </FormItem>
                      </div>
                    </Card>
                    <Card
                      className="dark:bg-gray-700 bg-white mb-8"
                      header={<h5>{t("heading.Remarks")}</h5>}
                    >
                      <FormItem
                        label={t("label.Remarks")}
                        invalid={errors?.remarks}
                        errorMessage="Please enter remarks!"
                      >
                        <Controller
                          control={control}
                          name="remarks"
                          render={({ field }) => (
                            <Input
                              {...field}
                              textArea
                              placeholder={t("label.Enter Remarks")}
                              autoComplete="off"
                            />
                          )}
                        />
                      </FormItem>{" "}
                    </Card>
                    <Card
                      id="accidentCausedBy"
                      className="dark:bg-gray-700 bg-white mb-8"
                      header={<h5>{t("heading.Accident Caused By")}</h5>}
                    >
                      <div className="text-left grid sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-3 gap-x-4">
                        <FormItem
                          label={t("label.Accident Caused By Me")}
                          asterisk
                          invalid={errors?.accidentCausedByDriverA}
                          errorMessage="Option is required!"
                        >
                          <Controller
                            control={control}
                            name="accidentCausedByDriverA"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                  <Radio
                                    id="driverAYesRadio"
                                    value="yes"
                                    checked={field.value === "yes"}
                                    onChange={() => field.onChange("yes")}
                                  />
                                  <label
                                    htmlFor="driverAYesRadio"
                                    className="ml-2"
                                  >
                                    {t("label.Yes")}
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <Radio
                                    id="driverANoRadio"
                                    value="no"
                                    checked={field.value === "no"}
                                    onChange={() => field.onChange("no")}
                                  />
                                  <label
                                    htmlFor="driverANoRadio"
                                    className="ml-2"
                                  >
                                    {t("label.No")}
                                  </label>
                                </div>
                              </div>
                            )}
                          />
                        </FormItem>
                        <FormItem
                          label={t("label.Accident Caused By Other")}
                          asterisk
                          invalid={errors?.accidentCausedByDriverB}
                          errorMessage="Option is required!"
                        >
                          <Controller
                            control={control}
                            name="accidentCausedByDriverB"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                  <Radio
                                    id="driverBYesRadio"
                                    value="yes"
                                    checked={field.value === "yes"}
                                    onChange={() => field.onChange("yes")}
                                  />
                                  <label
                                    htmlFor="driverBYesRadio"
                                    className="ml-2"
                                  >
                                    {t("label.Yes")}
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <Radio
                                    id="driverBNoRadio"
                                    value="no"
                                    checked={field.value === "no"}
                                    onChange={() => field.onChange("no")}
                                  />
                                  <label
                                    htmlFor="driverBNoRadio"
                                    className="ml-2"
                                  >
                                    {t("label.No")}
                                  </label>
                                </div>
                              </div>
                            )}
                          />
                        </FormItem>
                        <FormItem
                          label={t("label.Accident Caused By Common Fault")}
                          asterisk
                          invalid={errors?.accidentCausedByCommonFault}
                          errorMessage="Option is required!"
                        >
                          <Controller
                            control={control}
                            name="accidentCausedByCommonFault"
                            rules={{ required: true }}
                            render={({ field }) => (
                              <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                  <Radio
                                    id="driverCYesRadio"
                                    value="yes"
                                    checked={field.value === "yes"}
                                    onChange={() => field.onChange("yes")}
                                  />
                                  <label
                                    htmlFor="driverCYesRadio"
                                    className="ml-2"
                                  >
                                    {t("label.Yes")}
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <Radio
                                    id="driverCNoRadio"
                                    value="no"
                                    checked={field.value === "no"}
                                    onChange={() => field.onChange("no")}
                                  />
                                  <label
                                    htmlFor="driverCNoRadio"
                                    className="ml-2"
                                  >
                                    {t("label.No")}
                                  </label>
                                </div>
                              </div>
                            )}
                          />
                        </FormItem>
                        {accidentCausedByDriverBValue === "yes" && (
                          <>
                            <FormItem
                              label={t("label.Accident Caused By Other Name")}
                              invalid={errors?.accidentCausedByOtherName}
                              errorMessage="Please enter the other name!"
                            >
                              <Controller
                                control={control}
                                name="accidentCausedByOtherName"
                                rules={{ required: true }}
                                render={({ field }) => (
                                  <Input
                                    type="text"
                                    placeholder={t("label.Enter Other Name")}
                                    {...field}
                                  />
                                )}
                              />
                            </FormItem>
                            <FormItem
                              label={t(
                                "label.Accident Caused By Other Address"
                              )}
                              invalid={errors.accidentCausedByOtherAddress}
                              errorMessage="Please enter the other address!"
                            >
                              <Controller
                                control={control}
                                name="accidentCausedByOtherAddress"
                                rules={{ required: true }}
                                render={({ field }) => (
                                  <Input
                                    type="text"
                                    placeholder={t("label.Enter Other Address")}
                                    {...field}
                                  />
                                )}
                              />
                            </FormItem>{" "}
                          </>
                        )}
                      </div>
                    </Card>
                    <Card
                      className="dark:bg-gray-700 bg-white mb-8"
                      header={
                        <h5>
                          {t(
                            "heading.Put a cross in each of the relevant spaces to help explain the plan"
                          )}
                        </h5>
                      }
                    >
                      <FormItem
                        label={t(
                          "label.Select Multiple Options To Explain The Scenario"
                        )}
                        invalid={errors?.selectMultipleOptionsToExplainScenario}
                        errorMessage="Please Select Atleast One Option"
                        required
                      >
                        <Controller
                          control={control}
                          name="selectMultipleOptionsToExplainScenario"
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={multipleOptions}
                              placeholder={t("label.Select Multiple Options")}
                              isMulti
                              onChange={(selected) => {
                                const selectedValues = selected.map(
                                  (option) => option.value
                                );
                                setSelectedOptions(selectedValues);
                                field.onChange(selectedValues);
                              }}
                              value={multipleOptions.filter((option) =>
                                selectedOptions.includes(option.value)
                              )}
                            />
                          )}
                        />
                      </FormItem>
                    </Card>
                    <div id="initialDamageUrl" className="flex gap-2">
                      <DrawInitialDamage
                        setInitialDamageUrl={setInitialDamageUrl}
                      />
                      {participantIds && (
                        <Card>
                          <h5>Previous Initial Impact</h5>
                          <img
                            src={initialDamageUrl}
                            alt="image"
                            className="border-2 bg-gray-100 mt-4"
                          />
                        </Card>
                      )}
                    </div>
                  </>
                }

                {/* <SignatureField onSignatureSave={handleSignatureSave} /> */}
              </>
            )}
            {/* </Card> */}
          </div>
        </FormContainer>
        <div className="flex items-center justify-end dark:bg-gray-700 bg-white p-4 rounded-bl-lg rounded-br-lg">
          <div className="flex items-center justify-end dark:bg-gray-700 bg-white p-4 rounded-bl-lg rounded-br-lg">
            <Button
              icon={<RiSave2Line />}
              type="submit"
              variant="solid"
              size="sm"
              className="w-50"
              loading={loading}
            >
              {participantIds ? t("button.Update") : t("button.Save")}
            </Button>
          </div>
          {/* )} */}
        </div>
      </form>
    </>
  );
};
export default ParticipantsForm;
