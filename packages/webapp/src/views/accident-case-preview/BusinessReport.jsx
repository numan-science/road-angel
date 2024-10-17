import React, { useState, useEffect, Suspense, useMemo } from 'react'
import {
  Tabs,
  Card,
  Button,
  Avatar,
  toast,
  Spinner,
  Timeline,
  Upload,
  Notification,
} from '@/components/ui'
import {
  AdaptableCard,
  Container,
  DataTable,
  AuthorityCheck,
  ConfirmDialog,
} from '@/components/shared'
import { PDFDocument } from 'pdf-lib'
import { useTranslation } from 'react-i18next'
import { Document, Page, pdfjs } from 'react-pdf'
import { useNavigate, useParams } from 'react-router-dom'
import ReportDialog from './dialog/ReportDialog'
import {
  getSingleBusinessCase,
  getAcitivityBusinessCase,
} from '@/services/business-case'
import { ImSpinner9 } from 'react-icons/im'
import {
  HiHome,
  HiMail,
  HiOfficeBuilding,
  HiOutlineCloudUpload,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineUser,
  HiOutlineZoomIn,
  HiOutlineZoomOut,
  HiPhone,
} from 'react-icons/hi'
import { S3_URL } from '@/constants/api.constant'
import dayjs from 'dayjs'
import CustomSlider from './dialog/CustomSlider'
import { RiSave2Line } from 'react-icons/ri'
import { updateBusinessCase } from '@/services/business-case'
import { useForm } from 'react-hook-form'
import _ from 'lodash'
import { uploadFile } from '@/services/uploads'
import { getDocument } from '@/services/submit-case'
import useAuthority from '@/utils/hooks/useAuthority'
import { deleteAccidentDocument } from '@/services/submit-case'
import { VscFilePdf } from 'react-icons/vsc'
import { getAllParticipants } from '@/services/submit-case'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
const { TabNav, TabList } = Tabs
const settingsMenu = {
  accidentInfo: { label: 'Accident Info' },
  allparticipant: { label: 'Participants' },
  workshop: { label: 'Workshop' },
  towservice: { label: 'Tow Service' },
  viewdamage: { label: 'Damage Reports' },
  viewpdf: { label: 'Accident Documents' },
  acitivityLog: { label: 'Activity Logs' },
}

const BusinessReport = () => {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm()
  const [currentTab, setCurrentTab] = useState('accidentInfo')
  const [numPages, setNumPages] = useState(null)
  const [allParticipants, setAllParticipants] = useState([])
  const [participantModalVisible, setParticipantModalVisible] = useState(false)
  const [participantModalData, setParticipantModalData] = useState(null)
  const [BusinessCaseList, setBusinessCaseList] = useState({})
  const [businessCaseActivityLog, setBusinessCaseActivityLog] = useState([])
  const [allAccidentDocument, setAllAccidentDocument] = useState([])
  const [loading, setLoading] = useState(false)
  const [documentIds, setDocumentIds] = useState(null)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [files, setFiles] = useState([])
  const [filesWorkshop, setFilesWorkshop] = useState([])
  const [attachments, setAttachments] = useState([])
  const [formData, setFormData] = useState({})

  const [scale, setScale] = useState(1)

  const params = useParams()
  const businessCaseId = params?.businessCaseId
  const onTabChange = (val) => {
    setCurrentTab(val)
  }

  useEffect(() => {
    getBusinessCaseData()
    getActivityBusinessLogData()
  }, [])
  useEffect(() => {
    getAccidentDocumentDatas()
  }, [BusinessCaseList])

  const getBusinessCaseData = async (options = {}) => {
    try {
      options.id = businessCaseId
      const response = await getSingleBusinessCase(options)
      setBusinessCaseList(response.data)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>,
      )
    }
  }
  const getAccidentDocumentDatas = async (options = {}) => {
    try {
      options.accidentCaseId = participant.AccidentCase.id
      const response = await getDocument(options)
      setAllAccidentDocument(response?.data?.rows)
    } catch (error) {}
  }
  const handleViewDoc = (row) => {
    navigate(
      `/cases-list/accident-case-preview/${row.AccidentCase.id}/${row.id}/pdf`,
      {
        state: { accidentCaseId: row.AccidentCase.id, businessCaseId: row.id },
      },
    )
  }
  const handleEditAccidentDocument = (row) => {
    navigate(
      `/cases-list/accident-case-preview/${row.AccidentCase.id}/accident-document/${row.id}`,
      {
        state: { documentId: row.id },
      },
    )
  }
  const confirmDeleteDocument = (documentIds) => {
    setConfirmVisible(true)
    setDocumentIds(documentIds)
  }
  useEffect(() => {
    createPdf()
  }, [])
  const fetchData = async (url) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
      )
    }
    return await response.arrayBuffer()
  }
  const createPdf = async (row) => {
    // const visibleDamageNew = row.CulpritParticipant.visibleDamage
    // const visible = [...visibleDamageNew]

    const fieldsData = {
      date_of_accident: row.AccidentCase.dateOfAccident || '',
      label_1: row.CulpritParticipant.label,
      label_2: row.DamageParticipant.label,
      place_of_accident: row.AccidentCase.city || '',
      accident_witnesses: row.AccidentCase.witness || '',
      vehicle_a_owner_name_address_one: row.CulpritParticipant.ownerName || '',
      vehicle_a_owner_name_address_two:
        row.CulpritParticipant.ownerAddress || '',
      vehicle_a_phone: row.CulpritParticipant.ownerTelephone || '',
      vehicle_a_type_mark: row.CulpritParticipant.vehicleTypeMark || '',
      vehicle_a_registration_no:
        row.CulpritParticipant.vehicleRegistrationNumber || '',
      vehicle_a_address: row.CulpritParticipant.driverAddress || '',
      vehicle_a_policy_number:
        row.CulpritParticipant.thirdPartyPolicyNumber || '',
      vehicle_a_green_card_number:
        row.CulpritParticipant.thirdPartyGreenCard || '',
      vehicle_a_green_card_number_validity:
        row.CulpritParticipant.greenCardValidUntil || '',
      vehicle_a_demage_to_insure_company_name:
        row.CulpritParticipant.otherDamageInsuranceCompanyName || '',
      vehicle_a_driver_name: row.CulpritParticipant.driverName || '',
      vehicle_a_driver_sur_name: row.CulpritParticipant.driverSurname || '',
      vehicle_a_driver_address: row.CulpritParticipant.driverAddress || '',
      vehicle_a_driving_license:
        row.CulpritParticipant.driverLicenseNumber || '',
      vehicle_a_driver_groups: row.CulpritParticipant.driverGroups || '',
      vehicle_a_driver_group_issuedby:
        row.CulpritParticipant.driverIssuedBy || '',
      vehicle_a_driver_issued_by_two:
        row.CulpritParticipant.driverIssuedBy || '',
      vehicle_a_driver_license_valid_from:
        row.CulpritParticipant.driverValidFrom || '',
      vehicle_a_driver_license_valid_to:
        row.CulpritParticipant.driverValidTo || '',
      vehicle_a_visible_damage_one:
        row.CulpritParticipant.visibleDamage[0] || '',
      vehicle_a_visible_damage_two:
        row.CulpritParticipant.visibleDamage[1] || '',
      vehicle_a_visible_damage_three:
        row.CulpritParticipant.visibleDamage[2] || '',
      vehicle_a_remarks_one: row.CulpritParticipant.remarks || '',
      vehicle_a_remarks_two: row.CulpritParticipant.remarks || '',
      vehicle_a_accident_cause_by_others_name_address:
        row.CulpritParticipant.accidentCausedByOtherAddress || '',
      vehicle_b_owner_name_address_one: row.DamageParticipant.ownerName || '',
      vehicle_b_owner_name_address_two:
        row.DamageParticipant.ownerAddress || '',
      vehicle_b_owner_name_address_three: row.DamageParticipant.ownerName || '',
      vehicle_b_phone: row.DamageParticipant.ownerTelephone || '',
      vehicle_b_type_mark: row.DamageParticipant.vehicleTypeMark || '',
      vehicle_b_registration_no:
        row.DamageParticipant.vehicleRegistrationNumber || '',
      vehicle_b_address: row.DamageParticipant.driverAddress || '',
      vehicle_b_policy_number:
        row.DamageParticipant.thirdPartyPolicyNumber || '',
      vehicle_b_green_card_number:
        row.DamageParticipant.thirdPartyGreenCar || '',
      vehicle_b_green_card_number_validity:
        row.DamageParticipant.greenCardValidUntil || '',
      vehicle_b_demage_to_insure_company_name:
        row.DamageParticipant.otherDamageInsuranceCompanyName || '',
      vehicle_b_driver_name: row.DamageParticipant.driverName || '',
      vehicle_b_driver_sur_name: row.DamageParticipant.driverSurName || '',
      vehicle_b_driver_address: row.DamageParticipant.driverAddress || '',
      vehicle_b_driving_license:
        row.DamageParticipant.driverLicenseNumber || '',
      vehicle_b_driver_groups: row.DamageParticipant.driverGroups || '',
      vehicle_b_driver_group_issued_by:
        row.DamageParticipant.driverIssuedBy || '',
      vehicle_b_driver_issued_by_two:
        row.DamageParticipant.driverIssuedBy || '',
      vehicle_b_driver_license_valid_from:
        row.DamageParticipant.driverValidFrom || '',
      vehicle_b_driver_license_valid_to:
        row.DamageParticipant.driverValidTo || '',
      vehicle_b_visible_damage_one:
        row.CulpritParticipant.visibleDamage[0] || '',
      vehicle_b_visible_damage_two:
        row.DamageParticipant.visibleDamage[1] || '',
      vehicle_b_visible_damage_three:
        row.DamageParticipant.visibleDamage[2] || '',
      vehicle_b_remarks_one: row.DamageParticipant.remarks || '',
      vehicle_b_remarks_two: row.DamageParticipant.remarks || '',
      vehicle_b_accident_cause_by_others_name_address:
        row.DamageParticipant.accidentCausedByOtherAddress || '',
    }
    try {
      const formPdfBytes = await fetchData('/angelPdf.pdf')
      const pdfDoc = await PDFDocument.load(formPdfBytes)

      const pages = pdfDoc.getPages()

      if (pages.length < 3) {
        console.error('The PDF must have at least three pages.')
        return
      }

      const form = pdfDoc.getForm()
      const fieldNames = form.getFields().map((field) => field.getName())
      await form.getFields()
      for (const fieldName of Object.keys(fieldsData)) {
        const field = form.getTextField(fieldName)
        if (field) {
          field.setText(fieldsData[fieldName])
        }
      }

      if (row.participantAsignature) {
        const imageFieldSignA = form.getTextField('Vehicle_a_sign')

        const imageSignBytes = await fetch(
          row.participantAsignature,
        ).then((response) => response.arrayBuffer())
        const imageSign = await pdfDoc.embedPng(imageSignBytes)
        imageFieldSignA.setImage(imageSign)
      }
      if (row.participantBsignature) {
        const imageFieldSignB = form.getTextField('Vehicle_b_sign')

        const imageSignByteB = await fetch(
          row.participantBsignature,
        ).then((response) => response.arrayBuffer())
        const imageSigns = await pdfDoc.embedPng(imageSignByteB)
        imageFieldSignB.setImage(imageSigns)
      }
      if (row.AccidentCase?.AccidentScenario[0]?.filePath) {
        const imageField = form.getTextField('plane_of_accident_image')

        const imageBytes = await fetch(
          row.AccidentCase?.AccidentScenario[0]?.filePath,
        ).then((response) => response.arrayBuffer())
        const image = await pdfDoc.embedPng(imageBytes)
        imageField.setImage(image)
      }

      const imageFieldA = form.getTextField('vehicle_a_initial_impact_accident')

      const imageBytesA = await fetch(
        row.CulpritParticipant.initialImpact,
      ).then((response) => response.arrayBuffer())
      const imageA = await pdfDoc.embedPng(imageBytesA)
      imageFieldA.setImage(imageA)

      const imageFieldB = form.getTextField('vehicle_b_initial_impact_accident')

      const imageBytesB = await fetch(
        row.DamageParticipant.initialImpact,
      ).then((response) => response.arrayBuffer())
      const imageB = await pdfDoc.embedPng(imageBytesB)
      imageFieldB.setImage(imageB)

      const checkBoxFieldYes = form.getCheckBox(
        'accident_cause_by_vehicle_driver_a_yes',
      )

      const checkBoxFieldNo = form.getCheckBox(
        'accident_cause_by_vehicle_driver_a_no',
      )

      if (row.CulpritParticipant.accidentCausedByDriverA) {
        checkBoxFieldYes.check()
      } else {
        checkBoxFieldNo.check()
      }

      const checkBoxFieldB3 = form.getCheckBox(
        'accident_cause_by_vehicle_driver_b_yes',
      )

      const checkBoxFieldB4 = form.getCheckBox(
        'accident_cause_by_vehicle_driver_b_no',
      )

      if (row.CulpritParticipant.accidentCausedByDriverB) {
        checkBoxFieldB3.check()
      } else {
        checkBoxFieldB4.check()
      }

      const checkBoxFieldB5 = form.getCheckBox(
        'accident_cause_by_vehicle_driver_b_yes',
      )

      const checkBoxFieldB6 = form.getCheckBox(
        'accident_cause_by_vehicle_driver_b_no',
      )

      if (row.DamageParticipant.accidentCausedByDriverB) {
        checkBoxFieldB5.check()
      } else {
        checkBoxFieldB6.check()
      }

      const checkBoxFieldB7 = form.getCheckBox('vehicle_a_demage_to_insure_yes')

      const checkBoxFieldB8 = form.getCheckBox('vehicle_a_demage_to_insure_no')

      if (row.CulpritParticipant.isDamageInsurance) {
        checkBoxFieldB7.check()
      } else {
        checkBoxFieldB8.check()
      }

      const checkBoxFieldB9 = form.getCheckBox('vehicle_b_demage_to_insure_yes')

      const checkBoxFieldB10 = form.getCheckBox('vehicle_b_demage_to_insure_no')

      if (row.DamageParticipant.isDamageInsurance) {
        checkBoxFieldB9.check()
      } else {
        checkBoxFieldB10.check()
      }

      const checkBoxFieldYesB = form.getCheckBox(
        'vehicle_b_accident_cause_by_common_fault_yes',
      )
      const checkBoxFieldNoB = form.getCheckBox(
        'vehicle_b_accident_cause_by_common_fault_no',
      )

      if (row.DamageParticipant.accidentCausedByCommonFault === true) {
        checkBoxFieldYesB.check()
      } else {
        checkBoxFieldNoB.check()
      }

      const checkBoxFieldYesA = form.getCheckBox(
        'vehicle_a_accident_cause_by_common_fault_yes',
      )
      const checkBoxFieldNoA = form.getCheckBox(
        'vehicle_a_accident_cause_by_common_fault_no',
      )

      if (row.CulpritParticipant.accidentCausedByCommonFault === true) {
        checkBoxFieldYesA.check()
      } else {
        checkBoxFieldNoA.check()
      }

      const checkBoxFieldY = form.getCheckBox('investigated_by_police_yes')
      const checkBoxFieldN = form.getCheckBox('investigated_by_police_no')

      if (row.AccidentCase.investigationByPolice === true) {
        checkBoxFieldY.check()
      } else {
        checkBoxFieldN.check()
      }

      const checkBoxField1 = form.getCheckBox('injuries_accident_yes')
      const checkBoxField2 = form.getCheckBox('injuries_accident_no')

      if (row.AccidentCase.injuries === true) {
        checkBoxField1.check()
      } else {
        checkBoxField2.check()
      }

      const checkBoxField3 = form.getCheckBox('other_than_car_damage_yes')
      const checkBoxField4 = form.getCheckBox('other_than_car_damage_no')

      if (row.AccidentCase.otherCarDamage === true) {
        checkBoxField3.check()
      } else {
        checkBoxField4.check()
      }

      const checkBoxFieldParticipentA1 = form.getCheckBox(
        'vehicle_a_checkbox_1',
      )
      const checkBoxFieldParticipentA2 = form.getCheckBox(
        'vehicle_a_checkbox_2',
      )
      const checkBoxFieldParticipentA3 = form.getCheckBox(
        'vehicle_a_checkbox_3',
      )
      const checkBoxFieldParticipentA4 = form.getCheckBox(
        'vehicle_a_checkbox_4',
      )
      const checkBoxFieldParticipentA5 = form.getCheckBox(
        'vehicle_a_checkbox_5',
      )
      const checkBoxFieldParticipentA6 = form.getCheckBox(
        'vehicle_a_checkbox_6',
      )
      const checkBoxFieldParticipentA7 = form.getCheckBox(
        'vehicle_a_checkbox_7',
      )
      const checkBoxFieldParticipentA8 = form.getCheckBox(
        'vehicle_a_checkbox_8',
      )
      const checkBoxFieldParticipentA9 = form.getCheckBox(
        'vehicle_a_checkbox_9',
      )
      const checkBoxFieldParticipentA10 = form.getCheckBox(
        'vehicle_a_checkbox_10',
      )
      const checkBoxFieldParticipentA11 = form.getCheckBox(
        'vehicle_a_checkbox_11',
      )
      const checkBoxFieldParticipentA12 = form.getCheckBox(
        'vehicle_a_checkbox_12',
      )
      const checkBoxFieldParticipentA13 = form.getCheckBox(
        'vehicle_a_checkbox_13',
      )
      const checkBoxFieldParticipentA14 = form.getCheckBox(
        'vehicle_a_checkbox_14',
      )
      const checkBoxFieldParticipentA15 = form.getCheckBox(
        'vehicle_a_checkbox_15',
      )
      const checkBoxFieldParticipentA16 = form.getCheckBox(
        'vehicle_a_checkbox_16',
      )
      const checkBoxFieldParticipentA17 = form.getCheckBox(
        'vehicle_a_checkbox_17',
      )
      const checkBoxFieldParticipentA18 = form.getCheckBox(
        'vehicle_a_checkbox_18',
      )

      const checkBoxFieldParticipentB1 = form.getCheckBox(
        'vehicle_b_checkbox_1',
      )
      const checkBoxFieldParticipentB2 = form.getCheckBox(
        'vehicle_b_checkbox_2',
      )
      const checkBoxFieldParticipentB3 = form.getCheckBox(
        'vehicle_b_checkbox_3',
      )
      const checkBoxFieldParticipentB4 = form.getCheckBox(
        'vehicle_b_checkbox_4',
      )
      const checkBoxFieldParticipentB5 = form.getCheckBox(
        'vehicle_b_checkbox_5',
      )
      const checkBoxFieldParticipentB6 = form.getCheckBox(
        'vehicle_b_checkbox_6',
      )
      const checkBoxFieldParticipentB7 = form.getCheckBox(
        'vehicle_b_checkbox_7',
      )
      const checkBoxFieldParticipentB8 = form.getCheckBox(
        'vehicle_b_checkbox_8',
      )
      const checkBoxFieldParticipentB9 = form.getCheckBox(
        'vehicle_b_checkbox_9',
      )
      const checkBoxFieldParticipentB10 = form.getCheckBox(
        'vehicle_b_checkbox_10',
      )
      const checkBoxFieldParticipentB11 = form.getCheckBox(
        'vehicle_b_checkbox_11',
      )
      const checkBoxFieldParticipentB12 = form.getCheckBox(
        'vehicle_b_checkbox_12',
      )
      const checkBoxFieldParticipentB13 = form.getCheckBox(
        'vehicle_b_checkbox_13',
      )
      const checkBoxFieldParticipentB14 = form.getCheckBox(
        'vehicle_b_checkbox_14',
      )
      const checkBoxFieldParticipentB15 = form.getCheckBox(
        'vehicle_b_checkbox_15',
      )
      const checkBoxFieldParticipentB16 = form.getCheckBox(
        'vehicle_b_checkbox_16',
      )
      const checkBoxFieldParticipentB17 = form.getCheckBox(
        'vehicle_b_checkbox_17',
      )
      const checkBoxFieldParticipentB18 = form.getCheckBox(
        'vehicle_b_checkbox_18',
      )

      if (
        row.CulpritParticipant.selectMultipleOptionsToExplainScenario.includes(
          'The car was parked',
        )
      ) {
        checkBoxFieldParticipentA1.check()
      }

      if (
        row.CulpritParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Starting to ride',
        )
      ) {
        checkBoxFieldParticipentA2.check()
      }
      if (
        row.CulpritParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Stopping',
        )
      ) {
        checkBoxFieldParticipentA3.check()
      }

      if (
        row.CulpritParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Entering the road',
        )
      ) {
        checkBoxFieldParticipentA4.check()
      }

      if (
        row.CulpritParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Leaving the road',
        )
      ) {
        checkBoxFieldParticipentA5.check()
      }

      if (
        row.CulpritParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Entering the roundabout',
        )
      ) {
        checkBoxFieldParticipentA6.check()
      }
      if (
        row.CulpritParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Circulating in a roundabout',
        )
      ) {
        checkBoxFieldParticipentA7.check()
      }
      if (
        row.CulpritParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Striking the rear of the other vehicle while going in the same direction and in the same lane',
        )
      ) {
        checkBoxFieldParticipentA8.check()
      }
      if (
        row.CulpritParticipant.selectMultipleOptionsToExplainScenario.includes(
          'going in the same direction but in a different lane',
        )
      ) {
        checkBoxFieldParticipentA9.check()
      }
      if (
        row.CulpritParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Changing lanes',
        )
      ) {
        checkBoxFieldParticipentA10.check()
      }
      if (
        row.CulpritParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Overtaking',
        )
      ) {
        checkBoxFieldParticipentA11.check()
      }
      if (
        row.CulpritParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Turning to the right',
        )
      ) {
        checkBoxFieldParticipentA12.check()
      }
      if (
        row.CulpritParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Turning to the left',
        )
      ) {
        checkBoxFieldParticipentA13.check()
      }
      if (
        row.CulpritParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Reversing',
        )
      ) {
        checkBoxFieldParticipentA14.check()
      }
      if (
        row.CulpritParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Encroaching in the opposite traffic lane',
        )
      ) {
        checkBoxFieldParticipentA15.check()
      }
      if (
        row.CulpritParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Coming from the right ',
        )
      ) {
        checkBoxFieldParticipentA16.check()
      }
      if (
        row.CulpritParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Not observing a right of way sign',
        )
      ) {
        checkBoxFieldParticipentA17.check()
      }

      if (
        row.DamageParticipant.selectMultipleOptionsToExplainScenario.includes(
          'The car was parked',
        )
      ) {
        checkBoxFieldParticipentB1.check()
      }

      if (
        row.DamageParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Starting to ride',
        )
      ) {
        checkBoxFieldParticipentB2.check()
      }
      if (
        row.DamageParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Stopping',
        )
      ) {
        checkBoxFieldParticipentB3.check()
      }

      if (
        row.DamageParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Entering the road',
        )
      ) {
        checkBoxFieldParticipentB4.check()
      }

      if (
        row.DamageParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Leaving the road',
        )
      ) {
        checkBoxFieldParticipentB5.check()
      }

      if (
        row.DamageParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Entering the roundabout',
        )
      ) {
        checkBoxFieldParticipentB6.check()
      }
      if (
        row.DamageParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Circulating in a roundabout',
        )
      ) {
        checkBoxFieldParticipentB7.check()
      }
      if (
        row.DamageParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Striking the rear of the other vehicle while going in the same direction and in the same lane',
        )
      ) {
        checkBoxFieldParticipentB8.check()
      }
      if (
        row.DamageParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Going in the same direction but in a different lane',
        )
      ) {
        checkBoxFieldParticipentB9.check()
      }
      if (
        row.DamageParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Changing lanes',
        )
      ) {
        checkBoxFieldParticipentB10.check()
      }
      if (
        row.DamageParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Overtaking',
        )
      ) {
        checkBoxFieldParticipentB11.check()
      }
      if (
        row.DamageParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Turning to the right',
        )
      ) {
        checkBoxFieldParticipentB12.check()
      }
      if (
        row.DamageParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Turning to the left',
        )
      ) {
        checkBoxFieldParticipentB13.check()
      }
      if (
        row.DamageParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Reversing',
        )
      ) {
        checkBoxFieldParticipentB14.check()
      }
      if (
        row.DamageParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Encroaching in the opposite traffic lane',
        )
      ) {
        checkBoxFieldParticipentB15.check()
      }
      if (
        row.DamageParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Coming from the right',
        )
      ) {
        checkBoxFieldParticipentB16.check()
      }
      if (
        row.DamageParticipant.selectMultipleOptionsToExplainScenario.includes(
          'Not observing a right of way sign',
        )
      ) {
        checkBoxFieldParticipentB17.check()
      }
      // page.drawText('Your text in Slovak or Czech', {
      //   x: 50,
      //   y: 300,
      //   size: 12,
      //   font: 'Open Sans',
      //   color: rgb(0, 0, 0), // Black color
      //   fontFeatures: [{ tag: 'ss01' }],
      // });
      const modifiedPdfBytes = await pdfDoc.save()
      return modifiedPdfBytes
    } catch (error) {
      console.error('Error processing the PDF:', error)
      setLoading(false)
    }
  }
  const handleDownload = async (row) => {
    const pdfBytes = await createPdf(row)
    if (pdfBytes) {
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'example.pdf'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const participant = BusinessCaseList
  const row = participant

  const getActivityBusinessLogData = async () => {
    try {
      const response = await getAcitivityBusinessCase(businessCaseId)
      setBusinessCaseActivityLog(response.data)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>,
      )
    }
  }

  const toggleDocumentModal = (participantId) => {
    setParticipantModalVisible(!participantModalVisible)
    setParticipantModalData(participantId)
  }
  const zoomIn = () => {
    setScale(scale + 0.1)
  }

  const zoomOut = () => {
    setScale(scale - 0.1)
  }

  const [uploading, setUploading] = useState(false)
  const [attachmentsWorkshop, setAttachmentsWorkshop] = useState([])
  const beforeUpload = (file) => {
    let valid = true

    const allowedFileType = [
      // 'image/jpeg',
      // 'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    const maxFileSize = 50000000000

    for (let f of file) {
      if (!allowedFileType.includes(f.type)) {
        valid = 'Please upload a .pdf or .docx file!'
      }

      if (f.size >= maxFileSize) {
        valid = 'Upload image cannot more then 500kb!'
      }
    }

    return valid
  }
  const removeFile = (fileIndex) => {
    const deletedFileList = filesWorkshop.filter(
      (_, index) => index !== fileIndex,
    )
    setFilesWorkshop(deletedFileList)
  }
  const removeTowFile = (fileIndex) => {
    const deletedFileList = files.filter((_, index) => index !== fileIndex)
    setFiles(deletedFileList)
  }

  const { t } = useTranslation()

  const formatDate = (dateString) => {
    return dayjs(dateString).format('MMMM D, YYYY [at] h:mm A')
  }

  const handleTowServiceFileUpload = async () => {
    const uploadedFiles = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const existingFile = _.find(
        formData?.towServiceInvoiceAttachment,
        (row) => row.name === file.name,
      )

      if (existingFile) {
        uploadedFiles.push({ name: existingFile.name, url: existingFile.url })
      } else {
        try {
          const url = await uploadFile(file)
          uploadedFiles.push({ name: file.name, url })
          setAttachments((prevAttachments) => [
            ...prevAttachments,
            { name: file.name, url },
          ])
        } catch (error) {
          toast.push(
            <Notification className="mb-4" type="danger">
              Upload Tow Service Invoice Failed
            </Notification>,
          )
        }
      }
    }

    return uploadedFiles
  }

  const handleWorkshopFileUpload = async () => {
    const uploadedFiles = []

    for (let i = 0; i < filesWorkshop.length; i++) {
      const file = filesWorkshop[i]
      const existingFile = _.find(
        formData?.workshopInvoiceAttachment,
        (row) => row.name === file.name,
      )

      if (existingFile) {
        uploadedFiles.push({ name: existingFile.name, url: existingFile.url })
      } else {
        try {
          const url = await uploadFile(file)
          uploadedFiles.push({ name: file.name, url })
          setAttachmentsWorkshop((prevAttachments) => [
            ...prevAttachments,
            { name: file.name, url },
          ])
        } catch (error) {
          toast.push(
            <Notification className="mb-4" type="danger">
              Upload Workshop Invoice Failed
            </Notification>,
          )
        }
      }
    }

    return uploadedFiles
  }
  useEffect(() => {
    getParticipantData()
  }, [participant])

  const getParticipantData = async (options = {}) => {
    setLoading(true)
    try {
      options.accidentCaseId = participant.AccidentCase.id
      const response = await getAllParticipants(options)
      setAllParticipants(response.data?.rows)
    } catch (error) {
      // toast.push(
      //   <Notification className="mb-4" type="danger">
      //     Failed
      //   </Notification>,
      // )
    }
    setLoading(false)
  }

  const confirmDialogDocument = () => (
    <ConfirmDialog
      title="Delete Accident Document"
      type="danger"
      confirmButtonColor="red-600"
      isOpen={confirmVisible}
      onConfirm={handleDeleteDocument}
      onCancel={() => setConfirmVisible(false)}
      onClose={() => setConfirmVisible(false)}
      loading={deleting}
    >
      Are you sure you want to delete this Accident Document?
    </ConfirmDialog>
  )
  const handleDeleteDocument = async () => {
    try {
      setDeleting(true)
      const response = await deleteAccidentDocument(documentIds)
      toast.push(
        <Notification className="mb-4" type="success">
          Accident Document Deleted
        </Notification>,
      )
      getAccidentDocumentDatas()
      setConfirmVisible(false)
      setDocumentIds(null)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed
        </Notification>,
      )
    }
    setDeleting(false)
    setDocumentIds(null)
  }
  useEffect(() => {
    if (businessCaseId) {
      const data = BusinessCaseList
      if (data?.id) {
        const form = {
          id: data.id,
          towServiceInvoiceAttachment: data.towServiceInvoiceAttachment,
          workshopInvoiceAttachment: data.workshopInvoiceAttachment,
        }

        setFormData(form)
        const fetchDataAndConvertToBlob = async () => {
          try {
            const workshopFiles = []
            for (let i = 0; i < data?.workshopInvoiceAttachment.length; i++) {
              const response = await fetch(
                data?.workshopInvoiceAttachment[i].url,
              )
              const blob = await response.blob()
              const fileName = data?.workshopInvoiceAttachment[i].name
              const file = new File([blob], fileName, { type: blob.type })
              workshopFiles.push(file)
            }
            setFilesWorkshop(workshopFiles)

            const towServiceFiles = []
            for (let i = 0; i < data?.towServiceInvoiceAttachment.length; i++) {
              const responses = await fetch(
                data?.towServiceInvoiceAttachment[i].url,
              )
              const blobs = await responses.blob()
              const fileNames = data?.towServiceInvoiceAttachment[i].name
              const files = new File([blobs], fileNames, { type: blobs.type })
              towServiceFiles.push(files)
            }
            setFiles(towServiceFiles)
          } catch (error) {
            console.error(
              'Error fetching or converting the URL to a file:',
              error,
            )
          }
        }

        fetchDataAndConvertToBlob()
      }
    }
  }, [BusinessCaseList])

  const onSubmit = async () => {
    setLoading(true)
    const towServiceAttachments = await handleTowServiceFileUpload()
    const workshopAttachments = await handleWorkshopFileUpload()
    let data = _.cloneDeep(formData)
    data.workshopInvoiceAttachment = workshopAttachments
    data.towServiceInvoiceAttachment = towServiceAttachments
    data = _.pickBy(data, _.identity)
    try {
      const response = await updateBusinessCase(data, participant?.id)
      setFormData((prev) => ({
        ...prev,
        id: participant.id,
        towServiceInvoiceAttachment: response.data?.towServiceInvoiceAttachment,
        workshopInvoiceAttachment: response.data?.workshopInvoiceAttachment,
      }))

      toast.push(
        <Notification className="mb-4" type="success">
          Update Business Case Successfully
        </Notification>,
      )
      setLoading(false)
      // handleEditClick()
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed
        </Notification>,
      )
    }
  }
  const navigate = useNavigate()
  const handleView = (AccidentCaseId) => {
    navigate(`/cases-list/accident-case-preview/${AccidentCaseId}`)
  }

  const handleViewDamageReport = (row) => {
    navigate(
      `/cases-list/accident-case-preview/${row.AccidentCase.id}/${row.id}/damage-pdf`,
      {
        state: { accidentCaseId: row.AccidentCase.id, participantId: row.id },
      },
    )
  }

  const tableColumn = [
    {
      Header: t('label.Culprit Participant'),
      accessor: 'CulpritParticipant.label',
    },
    {
      Header: t('label.Damage Participant'),
      accessor: 'DamageParticipant.label',
    },
    {
      Header: t('label.Created Time'),
      accessor: 'createdAt',
      Cell: (props) => {
        const row = props.row.original
        return <span>{dayjs(row.createdAt).format('DD/MM/YYYY hh:mm A')}</span>
      },
    },
  ]

  const canPerformAction = useAuthority([
    // "can_edit_cases_list",
    'can_view_cases_list',
    'can_delete_cases_list',
  ])

  if (canPerformAction) {
    tableColumn.push({
      Header: t('label.Actions'),
      accessor: '',
      Cell: (props) => {
        const row = props.row.original
        return (
          <div className="flex justify-start text-lg">
            <AuthorityCheck authority={['can_view_cases_list']}>
              <Button
                className="cursor-pointer w-50"
                variant="solid"
                icon={<HiOutlineEye />}
                size="sm"
                onClick={() => handleViewDoc(row)}
              >
                Accident Document
              </Button>
            </AuthorityCheck>

            <AuthorityCheck authority={['can_view_cases_list']}>
              <Button
                className="cursor-pointer w-50 ml-2"
                variant="solid"
                icon={<VscFilePdf />}
                size="sm"
                onClick={() => handleDownload(row)}
              >
                Download
              </Button>
            </AuthorityCheck>

            <AuthorityCheck authority={['can_edit_cases_list']}>
              <Button
                className="cursor-pointer w-50 ml-2"
                variant="solid"
                icon={<HiOutlinePencil />}
                size="sm"
                onClick={() => handleEditAccidentDocument(row)}
              >
                Edit
              </Button>
            </AuthorityCheck>

            <AuthorityCheck authority={['can_delete_cases_list']}>
              <Button
                className="cursor-pointer w-50 ml-2 "
                variant="solid"
                icon={<HiOutlineTrash />}
                size="sm"
                onClick={() => confirmDeleteDocument(row.id)}
              >
                Delete
              </Button>
            </AuthorityCheck>
          </div>
        )
      },
    })
  }
  const col = useMemo(() => tableColumn, [canPerformAction])

  const tableColumns = [
    {
      Header: t('label.Participant'),
      accessor: 'label',
    },
    {
      Header: t('label.Participant Name'),
      accessor: 'ownerName',
    },
    {
      Header: t('label.Party Green Card Number'),
      accessor: 'thirdPartyGreenCard',
    },
    {
      Header: t('label.Party Policy Number'),
      accessor: 'thirdPartyPolicyNumber',
    },
    {
      Header: t('label.Created Time'),
      accessor: 'createdAt',
      Cell: (props) => {
        const row = props.row.original
        return <span>{dayjs(row.createdAt).format('DD/MM/YYYY hh:mm A')}</span>
      },
    },
  ]

  const canPerformActions = useAuthority([
    // "can_edit_cases_list",
    'can_view_cases_list',
    'can_delete_cases_list',
  ])

  if (canPerformAction) {
    tableColumns.push({
      Header: t('label.Actions'),
      accessor: '',
      Cell: (props) => {
        const row = props.row.original
        return (
          <div className="flex justify-start text-lg">
            <AuthorityCheck authority={['can_view_cases_list']}>
              <Button
                className="cursor-pointer w-50"
                variant="solid"
                icon={<HiOutlineEye />}
                size="sm"
                onClick={() => handleViewDamageReport(row)}
              >
                View Damage Report
              </Button>
            </AuthorityCheck>
          </div>
        )
      },
    })
  }
  const cols = useMemo(() => tableColumns, [canPerformActions])

  return (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-end">
          <h3>{t('heading.Business Case Report')}</h3>
        </div>
      </div>
      <Container className="p-4">
        <AdaptableCard>
          <Tabs value={currentTab} onChange={(val) => onTabChange(val)}>
            <TabList>
              {Object.keys(settingsMenu).map((key) => (
                <TabNav key={key} value={key}>
                  {settingsMenu[key].label}
                </TabNav>
              ))}
            </TabList>
          </Tabs>
          <div className="p-4 mt-4">
            <Suspense fallback={<></>}>
              {currentTab === 'accidentInfo' && (
                <>
                  {' '}
                  <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card
                      className="dark:bg-gray-700 bg-white mb-2 cursor-pointer"
                     
                      header={
                        <div className="flex w-full justify-between text-center">
                          <h2 className="text-xl font-bold">
                            {t('heading.Accident Case Info')}
                          </h2>
                          <Button className="cursor-pointer w-50" variant="solid" size="xs" onClick={() => handleView(participant.AccidentCase?.id)}>View Case</Button>
                        </div>
                      }
                    >
                      <p>
                        <b>{t('label.Date Of Accident')}</b>:{' '}
                        {participant.AccidentCase?.dateOfAccident}
                      </p>
                      <p>
                        <b>{t('label.Accident Address')}</b>:{' '}
                        {participant.AccidentCase?.accidentAddress}
                      </p>
                      <p>
                        <b>{t('label.Country')}</b>:{' '}
                        {participant.AccidentCase?.country}
                      </p>
                      <p>
                        <b>{t('label.City')}</b>:{' '}
                        {participant.AccidentCase?.city}
                      </p>
                      <p>
                        <b>{t('label.Injuries')}</b>:{' '}
                        {participant.AccidentCase?.injuries ? 'Yes' : 'No'}
                      </p>
                      <p>
                        <b>{t('label.investigation By Police')}</b>:{' '}
                        {participant.AccidentCase?.investigationByPolice
                          ? 'Yes'
                          : 'No'}
                      </p>
                      {participant.AccidentCase?.investigationByPolice ===
                        true && (
                        <p>
                          <b>{t('label.Police Department')}</b>:{' '}
                          {participant.AccidentCase?.policeDepartment}
                        </p>
                      )}
                      <p>
                        <b>{t('label.otherCarDamage')}</b>:{' '}
                        {participant.AccidentCase?.otherCarDamage
                          ? 'Yes'
                          : 'No'}
                      </p>
                      <p>
                        <b>{t('label.witness')}</b>:{' '}
                        {participant.AccidentCase?.witness}
                      </p>
                    </Card>
                  </div>
                </>
              )}
              {currentTab === 'allparticipant' && (
               <> <span className='mb-8 flex'><h6>Type&nbsp;</h6>:<h6>&nbsp;{participant?.type}</h6></span>
                <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <>
                    {participant?.ParticipantA && (
                      <Card
                        className="dark:bg-gray-700 bg-white mb-2"
                        header={
                          <div className="flex w-full justify-between text-center">
                            <h5><b>Participant</b> : {participant?.ParticipantA?.ownerName}</h5>
                            <span className="border-2 border-red-600 h-8 w-8 flex items-center justify-center rounded-full">
                              <b>{participant?.ParticipantA?.label}</b>
                            </span>
                          </div>
                        }
                      >
                        <p>
                          <b>{t('label.Address')}</b>:{' '}
                          {participant?.ParticipantA?.ownerAddress}
                        </p>
                        <p>
                          <b>{t('label.Telephone Number')}</b>:{' '}
                          {participant?.ParticipantA?.ownerTelephone}
                        </p>
                        <p>
                          <b>{t('label.Vehicle Type Mark')}</b>:{' '}
                          {participant?.ParticipantA?.vehicleTypeMark}
                        </p>
                        <p>
                          <b>{t('label.Vehicle Registration Number')}</b>:{' '}
                          {participant?.ParticipantA?.vehicleRegistrationNumber}
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="solid"
                          className="w-50 mt-2"
                          onClick={() => {
                            toggleDocumentModal(participant?.ParticipantA)
                          }}
                        >
                          {t('button.View All')}
                        </Button>
                      </Card>
                    )}

                    {participant?.CulpritParticipant && (
                      <Card
                        className="dark:bg-gray-700 bg-white mb-2"
                        header={
                          <div className="flex w-full justify-between text-center">
                            <h5>
                            <b>Culprit</b> : {participant?.CulpritParticipant?.ownerName}
                            </h5>
                            <span className="border-2 border-red-600 h-8 w-8 flex items-center justify-center rounded-full">
                              <b>{participant?.CulpritParticipant?.label}</b>
                            </span>
                          </div>
                        }
                      >
                        <p>
                          <b>{t('label.Address')}</b>:{' '}
                          {participant?.CulpritParticipant?.ownerAddress}
                        </p>
                        <p>
                          <b>{t('label.Telephone Number')}</b>:{' '}
                          {participant?.CulpritParticipant?.ownerTelephone}
                        </p>
                        <p>
                          <b>{t('label.Vehicle Type Mark')}</b>:{' '}
                          {participant?.CulpritParticipant?.vehicleTypeMark}
                        </p>
                        <p>
                          <b>{t('label.Vehicle Registration Number')}</b>:{' '}
                          {
                            participant?.CulpritParticipant
                              ?.vehicleRegistrationNumber
                          }
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="solid"
                          className="w-50 mt-2"
                          onClick={() => {
                            toggleDocumentModal(participant?.CulpritParticipant)
                          }}
                        >
                          {t('button.View All')}
                        </Button>
                      </Card>
                    )}

                    {participant?.DamageParticipant && (
                      <Card
                        className="dark:bg-gray-700 bg-white mb-2"
                        header={
                          <div className="flex w-full justify-between text-center">
                            <h5><b>Damage</b> : {participant?.DamageParticipant?.ownerName}</h5>
                            <span className="border-2 border-red-600 h-8 w-8 flex items-center justify-center rounded-full">
                              <b>{participant?.DamageParticipant?.label}</b>
                            </span>
                          </div>
                        }
                      >
                        <p>
                          <b>{t('label.Address')}</b>:{' '}
                          {participant?.DamageParticipant?.ownerAddress}
                        </p>
                        <p>
                          <b>{t('label.Telephone Number')}</b>:{' '}
                          {participant?.DamageParticipant?.ownerTelephone}
                        </p>
                        <p>
                          <b>{t('label.Vehicle Type Mark')}</b>:{' '}
                          {participant?.DamageParticipant?.vehicleTypeMark}
                        </p>
                        <p>
                          <b>{t('label.Vehicle Registration Number')}</b>:{' '}
                          {
                            participant?.DamageParticipant
                              ?.vehicleRegistrationNumber
                          }
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="solid"
                          className="w-50 mt-2"
                          onClick={() => {
                            toggleDocumentModal(participant?.DamageParticipant)
                          }}
                        >
                          {t('button.View All')}
                        </Button>
                      </Card>
                    )}

                    {participant?.CustomerParticipant && (
                      <Card
                        className="dark:bg-gray-700 bg-white mb-2"
                        header={
                          <div className="flex w-full justify-between text-center">
                            <h5>
                             <b>Customer</b> : {participant?.CustomerParticipant?.ownerName}
                            </h5>
                            <span className="border-2 border-red-600 h-8 w-8 flex items-center justify-center rounded-full">
                              <b>{participant?.CustomerParticipant?.label}</b>
                            </span>
                          </div>
                        }
                      >
                        <p>
                          <b>{t('label.Address')}</b>:{' '}
                          {participant?.CustomerParticipant?.ownerAddress}
                        </p>
                        <p>
                          <b>{t('label.Telephone Number')}</b>:{' '}
                          {participant?.CustomerParticipant?.ownerTelephone}
                        </p>
                        <p>
                          <b>{t('label.Vehicle Type Mark')}</b>:{' '}
                          {participant?.CustomerParticipant?.vehicleTypeMark}
                        </p>
                        <p>
                          <b>{t('label.Vehicle Registration Number')}</b>:{' '}
                          {
                            participant?.CustomerParticipant
                              ?.vehicleRegistrationNumber
                          }
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="solid"
                          className="w-50 mt-2"
                          onClick={() => {
                            toggleDocumentModal(
                              participant?.CustomerParticipant,
                            )
                          }}
                        >
                          {t('button.View All')}
                        </Button>
                      </Card>
                    )}
                  </>
                </div>
                </>
              )}
              {currentTab === 'viewpdf' && (
                <>
                  {confirmDialogDocument()}
                  <DataTable columns={col} data={allAccidentDocument} />
                </>
              )}
              {currentTab === 'viewdamage' && (
                <>
                  <DataTable columns={cols} data={allParticipants} />
                </>
              )}

              {currentTab === 'towservice' && (
                <>
                  {participant?.TowService ? (
                    <>
                      {' '}
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <Card>
                          <div className="flex w-full justify-center my-2">
                            <Avatar
                              shape="circle"
                              size={65}
                              src={
                                participant?.TowService?.logo
                                  ? `${S3_URL}/${participant.TowService.logo}`
                                  : null
                              }
                              icon={<HiOutlineUser />}
                            />
                          </div>
                          <h5 className="flex w-full justify-center">
                            <b>{participant?.TowService.name}</b>
                          </h5>
                          <hr className="flex w-full justify-center" />
                          <div className="w-full text-center my-4">
                            <p className="flex justify-center items-center my-1">
                              <span className="flex-shrink-0">
                                <HiMail size={20} />
                              </span>
                              <span className="ml-2">
                                {participant?.TowService.email}
                              </span>
                            </p>
                            <p className="flex justify-center items-center my-1">
                              <span className="flex-shrink-0">
                                <HiOfficeBuilding size={20} />
                              </span>
                              <span className="ml-2">
                                {participant?.TowService.address}
                              </span>
                            </p>
                            <p className="flex justify-center items-center my-1">
                              <span className="flex-shrink-0">
                                <HiPhone size={20} />
                              </span>
                              <span className="ml-2">
                                {participant?.TowService.phone}
                              </span>
                            </p>
                            <p className="flex justify-center items-center my-1">
                              <span className="flex-shrink-0">
                                <HiHome size={20} />
                              </span>
                              <span className="ml-2">
                                {participant?.TowService.Region.name}
                              </span>
                            </p>
                          </div>
                        </Card>
                      </div>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                          <Card
                            className="dark:bg-gray-700 bg-white my-4"
                            header={
                              <div className="flex w-full justify-between">
                                <h5>{t('heading.Add Invoice')}</h5>
                                <div className="flex">
                                  <Upload
                                    disabled={uploading}
                                    beforeUpload={beforeUpload}
                                    onChange={(newFiles) => setFiles(newFiles)}
                                    showList={false}
                                    fileList={files}
                                  >
                                    <Button
                                      type="button"
                                      size="sm"
                                      icon={<HiOutlineCloudUpload />}
                                    >
                                      Upload Tow Service Invoice
                                    </Button>
                                  </Upload>
                                  <Button
                                    icon={<RiSave2Line />}
                                    type="submit"
                                    variant="solid"
                                    size="sm"
                                    className="w-50 ml-2 flex justify-items-end"
                                    loading={loading}
                                  >
                                    {loading
                                      ? t('button.Updating')
                                      : participant?.id
                                      ? t('button.Update')
                                      : t('button.Save')}
                                  </Button>
                                </div>
                              </div>
                            }
                          >
                            <div>
                              <h6 className="mt-4">Tow Service Invoice</h6>
                              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-4">
                                {files.map((attachment, index) => (
                                  <div
                                    key={index}
                                    className="bg-gray-100 p-4 rounded-md relative group"
                                  >
                                    {attachment?.name.endsWith('.pdf') ? (
                                      <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
                                        alt="PDF Document"
                                        className="w-full h-40"
                                      />
                                    ) : attachment?.name.endsWith('.docx') ? (
                                      <img
                                        src="https://learnbrite.com/wp-content/uploads/2018/01/microsoft-word-365-online.png"
                                        alt="Word Document"
                                        className="w-full h-40"
                                      />
                                    ) : (
                                      <img
                                        src={`${S3_URL}/${attachment?.name}`}
                                        alt="Unknown Document"
                                        className="w-full h-40"
                                      />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="flex items-center ga-1 space-x-3 bg-white bg-opacity-75 rounded-md px-5 py-3">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                          onClick={() =>
                                            window.open(
                                              `${S3_URL}/${attachment?.name}`,
                                              '_blank',
                                            )
                                          }
                                        >
                                          <HiOutlineEye
                                            size={22}
                                            className="cursor-pointer p-2 hover:text-green-500"
                                          />
                                        </svg>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                          onClick={() => removeTowFile(index)}
                                        >
                                          <HiOutlineTrash
                                            size={22}
                                            className="cursor-pointer p-2 hover:text-red-500"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                    <p className="text-xs text-center">
                                      <b>{attachment.name}</b>
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </Card>
                        </div>
                      </form>
                      {/* <h6 className="my-6">Tow Service Invoice</h6> */}
                      {/* <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {participant?.towServiceInvoiceAttachment?.map(
                          (attachment, index) => (
                            <div
                              key={index}
                              className="bg-gray-100 p-4 rounded-md relative group"
                            >
                              {attachment?.name.endsWith('.pdf') ? (
                                <img
                                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
                                  alt="PDF Document"
                                  className="w-full h-40"
                                />
                              ) : attachment?.name.endsWith('.docx') ? (
                                <img
                                  src="https://learnbrite.com/wp-content/uploads/2018/01/microsoft-word-365-online.png"
                                  alt="Word Document"
                                  className="w-full h-40"
                                />
                              ) : (
                                <img
                                  src={`${S3_URL}/${attachment?.name}`}
                                  alt="Unknown Document"
                                  className="w-full h-40"
                                />
                              )}
                              <p className="text-xs text-center">
                                <b>{attachment.name}</b>
                              </p>
                            </div>
                          ),
                        )}
                      </div> */}
                    </>
                  ) : (
                    <p>No selected tow service available</p>
                  )}
                </>
              )}
              {currentTab === 'workshop' && (
                <>
                  {participant?.Workshop ? (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <Card>
                          <div className="flex w-full justify-center my-2">
                            <CustomSlider
                              images={[
                                participant?.Workshop?.logo
                                  ? `${S3_URL}/${participant?.Workshop.logo}`
                                  : null,
                                ...participant?.Workshop.workshopAttachments.map(
                                  (attachment) =>
                                    attachment?.url?.data?.name
                                      ? `${S3_URL}/${attachment?.url?.data?.name}`
                                      : null,
                                ),
                              ]}
                            />
                          </div>
                          <h5 className="flex w-full justify-center">
                            <b>{participant?.Workshop.name}</b>
                          </h5>
                          <hr className="flex w-full justify-center" />
                          <div className="w-full text-center my-4">
                            <p className="flex justify-center items-center my-1">
                              <span className="flex-shrink-0">
                                <HiOfficeBuilding size={20} />
                              </span>
                              <span className="ml-2">
                                {participant?.Workshop.address}
                              </span>
                            </p>
                            <p className="flex justify-center items-center my-1">
                              <span className="flex-shrink-0">
                                <HiHome size={20} />
                              </span>
                              <span className="ml-2">
                                {participant?.Workshop.Region.name}
                              </span>
                            </p>
                          </div>
                        </Card>
                      </div>
                      <>
                        {' '}
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div>
                            <Card
                              className="dark:bg-gray-700 bg-white my-4"
                              header={
                                <div className="flex w-full justify-between">
                                  <h5>{t('heading.Add Invoice')}</h5>
                                  <div className="flex">
                                    <Upload
                                      disabled={uploading}
                                      beforeUpload={beforeUpload}
                                      onChange={(newFiles) =>
                                        setFilesWorkshop(newFiles)
                                      }
                                      showList={false}
                                      fileList={filesWorkshop}
                                    >
                                      <Button
                                        type="button"
                                        size="sm"
                                        icon={<HiOutlineCloudUpload />}
                                      >
                                        Upload Workshop Invoice
                                      </Button>
                                    </Upload>
                                    <Button
                                      icon={<RiSave2Line />}
                                      type="submit"
                                      variant="solid"
                                      size="sm"
                                      className="w-50 ml-2 flex justify-items-end"
                                      loading={loading}
                                    >
                                      {loading
                                        ? t('button.Updating')
                                        : participant?.id
                                        ? t('button.Update')
                                        : t('button.Save')}
                                    </Button>
                                  </div>
                                </div>
                              }
                            >
                              <div>
                                <h6 className="mt-4">Workshop Invoice</h6>
                                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-4">
                                  {filesWorkshop.map((attachment, index) => (
                                    <div
                                      key={index}
                                      className="bg-gray-100 p-4 rounded-md relative group"
                                    >
                                      {attachment?.name.endsWith('.pdf') ? (
                                        <img
                                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
                                          alt="PDF Document"
                                          className="w-full h-40"
                                        />
                                      ) : attachment?.name.endsWith('.docx') ? (
                                        <img
                                          src="https://learnbrite.com/wp-content/uploads/2018/01/microsoft-word-365-online.png"
                                          alt="Word Document"
                                          className="w-full h-40"
                                        />
                                      ) : (
                                        <img
                                          src={`${S3_URL}/${attachment?.name}`}
                                          alt="Unknown Document"
                                          className="w-full h-40"
                                        />
                                      )}
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center ga-1 space-x-3 bg-white bg-opacity-75 rounded-md px-5 py-3">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            onClick={() =>
                                              window.open(
                                                `${S3_URL}/${attachment?.name}`,
                                                '_blank',
                                              )
                                            }
                                          >
                                            <HiOutlineEye
                                              size={22}
                                              className="cursor-pointer p-2 hover:text-green-500"
                                            />
                                          </svg>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            onClick={() => removeFile(index)}
                                          >
                                            <HiOutlineTrash
                                              size={22}
                                              className="cursor-pointer p-2 hover:text-red-500"
                                            />
                                          </svg>
                                        </div>
                                      </div>
                                      <p className="text-xs text-center">
                                        <b>{attachment.name}</b>
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </Card>
                          </div>
                        </form>
                      </>
                      {/* <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {participant?.workshopInvoiceAttachment.map(
                          (attachment, index) => (
                            <div
                              key={index}
                              className="bg-gray-100 p-4 rounded-md relative group"
                            >
                              {attachment?.name.endsWith('.pdf') ? (
                                <img
                                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
                                  alt="PDF Document"
                                  className="w-full h-40"
                                />
                              ) : attachment?.name.endsWith('.docx') ? (
                                <img
                                  src="https://learnbrite.com/wp-content/uploads/2018/01/microsoft-word-365-online.png"
                                  alt="Word Document"
                                  className="w-full h-40"
                                />
                              ) : (
                                <img
                                  src={`${S3_URL}/${attachment?.name}`}
                                  alt="Unknown Document"
                                  className="w-full h-40"
                                />
                              )}
                              <p className="text-xs text-center">
                                <b>{attachment.name}</b>
                              </p>
                            </div>
                          ),
                        )}
                      </div> */}
                    </>
                  ) : (
                    <p>No selected workshop available</p>
                  )}
                </>
              )}
              {currentTab === 'acitivityLog' && (
                <div>
                  <h4>Activity Logs</h4>
                  <ul className="space-y-4 mt-4">
                    <Timeline>
                      {businessCaseActivityLog?.map((log) => (
                        <Timeline.Item
                          key={log.id}
                          media={
                            <Avatar
                              size={32}
                              shape="circle"
                              src={`${S3_URL}/${log?.CreatedBy?.profilePic}`}
                            />
                          }
                        >
                          <div className="mt-1">
                            <div className="flex-1">
                              <div className="flex text-sm text-gray-700">
                                {log?.CreatedBy?.username} Has Updated Business
                                At
                                <b>&nbsp;{formatDate(log?.updatedAt)}</b>
                              </div>
                              {log?.actions?.map((action) => {
                                return (
                                  <>
                                    <div
                                      key={action?.id}
                                      className="my-2 grid grid-cols-2 gap-4"
                                    >
                                      <div>
                                        <p className="font-bold text-green-600 mb-2">
                                          {action?.key}
                                        </p>
                                        {action?.key ===
                                          'participantAsignature' ||
                                        action?.key ===
                                          'participantBsignature' ? (
                                          <img
                                            src={action?.after}
                                            alt="Signature"
                                            className="w-24 h-24 bg-gray-100"
                                          />
                                        ) : action?.key ===
                                            'towServiceInvoiceAttachment' ||
                                          action?.key ===
                                            'workshopInvoiceAttachment' ? (
                                          action?.after?.map((invoice) => (
                                            <>
                                              {invoice?.name.endsWith(
                                                '.pdf',
                                              ) ? (
                                                <img
                                                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
                                                  alt="PDF Document"
                                                  className="w-20 h-25 bg-gray-100"
                                                />
                                              ) : invoice?.name.endsWith(
                                                  '.docx',
                                                ) ? (
                                                <img
                                                  src="https://learnbrite.com/wp-content/uploads/2018/01/microsoft-word-365-online.png"
                                                  alt="Word Document"
                                                  className="w-20 h-25 bg-gray-100"
                                                />
                                              ) : (
                                                <img
                                                  src={`${S3_URL}/${invoice?.name}`}
                                                  alt="Unknown Document"
                                                  className="w-20 h-15 bg-gray-100"
                                                />
                                              )}
                                              <p>{invoice?.name}</p>
                                            </>
                                          ))
                                        ) : (
                                          <p>&nbsp;{action?.after}</p>
                                        )}
                                      </div>

                                      <div>
                                        {action?.before && (
                                          <div>
                                            <p className="font-bold text-red-600 mb-2">
                                              {action?.key}
                                            </p>
                                            {action?.key ===
                                              'participantAsignature' ||
                                            action?.key ===
                                              'participantBsignature' ? (
                                              <img
                                                src={action?.before}
                                                alt="Signature"
                                                className="w-24 h-24 bg-gray-100"
                                              />
                                            ) : action?.key ===
                                                'towServiceInvoiceAttachment' ||
                                              action?.key ===
                                                'workshopInvoiceAttachment' ? (
                                              action?.before?.map((invoice) => (
                                                <>
                                                  {invoice?.name.endsWith(
                                                    '.pdf',
                                                  ) ? (
                                                    <img
                                                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
                                                      alt="PDF Document"
                                                      className="w-20 h-25 bg-gray-100"
                                                    />
                                                  ) : invoice?.name.endsWith(
                                                      '.docx',
                                                    ) ? (
                                                    <img
                                                      src="https://learnbrite.com/wp-content/uploads/2018/01/microsoft-word-365-online.png"
                                                      alt="Word Document"
                                                      className="w-20 h-25 bg-gray-100"
                                                    />
                                                  ) : (
                                                    <img
                                                      src={`${S3_URL}/${invoice?.name}`}
                                                      alt="Unknown Document"
                                                      className="w-20 h-15 bg-gray-100"
                                                    />
                                                  )}
                                                  <p>{invoice?.name}</p>
                                                </>
                                              ))
                                            ) : (
                                              <p>&nbsp;{action?.before}</p>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </>
                                )
                              })}
                            </div>
                          </div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </ul>
                </div>
              )}
            </Suspense>
          </div>
        </AdaptableCard>
        <ReportDialog
          participantModalData={participantModalData}
          participantModalVisible={participantModalVisible}
          toggleDocumentModal={toggleDocumentModal}
        />
      </Container>
    </>
  )
}

export default BusinessReport
