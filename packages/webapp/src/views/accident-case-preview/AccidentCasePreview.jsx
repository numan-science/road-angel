import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react'
import { useForm } from 'react-hook-form'
import {
  Card,
  toast,
  Notification,
  Button,
  Avatar,
  Tabs,
} from '@/components/ui'
import {
  Container,
  AuthorityCheck,
  DataTable,
  ConfirmDialog,
  AdaptableCard,
} from '@/components/shared'
import _ from 'lodash'
import { PDFDocument, rgb } from 'pdf-lib'
import { useTranslation } from 'react-i18next'
import { getAllParticipants } from '@/services/submit-case'
import { useNavigate, useParams } from 'react-router-dom'
import DialogDoc from './dialog/DialogDoc'
import ParticipantsForm from '@/views/submit-case/ParticipantsForm'
import AccidentScenario from '@/views/submit-case/AccidentScenario'
import DialogDocSelection from './dialog/DialogDocSelection'
import { getAccidentCase } from '@/services/submit-case'
import { getAccidentScenario } from '@/services/submit-case'
import dayjs from 'dayjs'
import useAuthority from '@/utils/hooks/useAuthority'
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineFilm,
} from 'react-icons/hi'
import { VscFilePdf } from 'react-icons/vsc'
import { getBusinessCase } from '@/services/business-case'
import { deleteBusinessCase } from '@/services/business-case'
import DialogAccidentCase from './dialog/DialogAccidentCase'
import { deleteParticipant } from '@/services/submit-case'
import { getAccidentDocumentOne } from '@/services/submit-case'
import { getDocument } from '@/services/submit-case'
import { deleteAccidentDocument } from '@/services/submit-case'

const AccidentCasePreview = () => {
  const { TabNav, TabList } = Tabs
  const settingsMenu = {
    accidentCaseInfo: { label: 'Accident Case Info' },
    accidentCaseParticipant: { label: 'Accident Case Participant' },
    accidentCaseScenarios: { label: 'Accident Case Scenario' },
    accidentDocument: { label: 'Accident Document List' },
    businessCases: { label: 'Business Cases' },
  }
  const [currentTab, setCurrentTab] = useState('accidentCaseInfo')
  const params = useParams()
  const accidentCaseId = params?.accidentCaseId
  const {
    reset,
    formState: { errors },
  } = useForm()
  const [allParticipants, setAllParticipants] = useState([])
  const [allAccidentCase, setAllAccidentCase] = useState([])
  const [allAccidentScenario, setAllAccidentScenario] = useState([])
  const [businessCaseData, SetBusinessCaseData] = useState([])
  const [allBusinessCase, setAllBusinessCase] = useState([])
  const [allAccidentDocument, setAllAccidentDocument] = useState([])
  const [accidentCaseScenario, setAccidentCaseScenario] = useState([])
  const [accidentCaseModalId, setAccidentCaseModalId] = useState(null)
  const [participantModalId, setParticipantModalId] = useState(null)
  const [participantModalVisible, setParticipantModalVisible] = useState(false)
  const [accidentCaseModalVisible, setAccidentCaseModalVisible] = useState(
    false,
  )
  const [
    selectParticipantModalVisible,
    setSelectParticipantModalVisible,
  ] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showAccidentScenario, setShowAccidentScenario] = useState(false)
  const [showParticipantsForm, setShowParticipantsForm] = useState(false)
  const [participantId, setParticipantId] = useState(null)
  const [pdfBlob, setPdfBlob] = useState(null)

  const { t } = useTranslation()
  useEffect(() => {
    if (!showParticipantsForm && !showAccidentScenario) {
      getParticipantData()
    }
    getAccidentCaseData()
    getAccidentScenarioData()
    getBusinessCaseData()
    getAccidentDocumentDatas()
  }, [showParticipantsForm, showAccidentScenario])

  const getParticipantData = async (options = {}) => {
    setLoading(true)
    try {
      options.accidentCaseId = accidentCaseId
      const response = await getAllParticipants(options)
      setAllParticipants(response.data?.rows)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed
        </Notification>,
      )
    }
    setLoading(false)
  }
  const getAccidentCaseData = async (options = {}) => {
    setLoading(true)
    try {
      options.accidentCaseId = accidentCaseId
      const response = await getAccidentCase(options)
      setAllAccidentCase(response.data?.rows)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed
        </Notification>,
      )
    }
    setLoading(false)
  }
  const getAccidentScenarioData = async (options = {}) => {
    setLoading(true)
    try {
      options.accidentCaseId = accidentCaseId
      const response = await getAccidentScenario(options)
      setAllAccidentScenario(response?.data.rows)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed
        </Notification>,
      )
    }
    setLoading(false)
  }

  const getBusinessCaseData = async (options = {}) => {
    setLoading(true)
    try {
      options.accidentCaseId = accidentCaseId
      const response = await getBusinessCase(options)
      setAllBusinessCase(response?.data?.rows)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed
        </Notification>,
      )
    }
    setLoading(false)
  }

  const getAccidentDocumentDatas = async (options = {}) => {
    setLoading(true)
    try {
      options.accidentCaseId = accidentCaseId
      const response = await getDocument(options)
      setAllAccidentDocument(response?.data?.rows)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed
        </Notification>,
      )
    }
    setLoading(false)
  }

  const navigate = useNavigate()
  const redirectPath = () => {
    navigate(
      `/cases-list/accident-case-preview/${accidentCaseId}/business-case`,
      {
        state: { accidentCaseId: accidentCaseId },
      },
    )
  }
  const redirectAccidentDocument = () => {
    navigate(
      `/cases-list/accident-case-preview/${accidentCaseId}/accident-document`,
      {
        state: { accidentCaseId: accidentCaseId },
      },
    )
  }
  const toggleDocumentModal = (participantId) => {
    setParticipantModalVisible(!participantModalVisible)
    setParticipantModalId(participantId)
  }
  const toggleDocumentModalSelection = () => {
    setSelectParticipantModalVisible(!selectParticipantModalVisible)
    reset()
  }
  const accidentCaseModal = (Id) => {
    setAccidentCaseModalVisible(!accidentCaseModalVisible)
    setAccidentCaseModalId(Id)
    getAccidentCaseData()
  }
  const redirectBack = () => {
    setShowAccidentScenario(false)
    setShowParticipantsForm(false)
  }

  const handleClickAccidentScenario = () => {
    setShowAccidentScenario(true)
    setShowParticipantsForm(false)
  }

  const handleClickParticipantsForm = () => {
    setShowParticipantsForm(true)
    setShowAccidentScenario(false)
  }
  const handleClickPreview = () => {
    setShowParticipantsForm(false)
    setShowAccidentScenario(false)
  }

  const handleSave = () => {
    setShowParticipantsForm(false)
  }
  const matchedAccidentCase = allAccidentCase.find(
    (caseItem) => caseItem.id === accidentCaseId,
  )
  const matchedAccidentCaseScenario = allAccidentScenario.find(
    (caseItem) => caseItem.accidentCaseId === accidentCaseId,
  )
  const matchedBusinessCase = allBusinessCase.filter(
    (caseItem) => caseItem.accidentCaseId === accidentCaseId,
  )

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
      label_1:row.CulpritParticipant.label,
      label_2:row.DamageParticipant.label,
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
  const handleEditClick = (businessCaseId) => {
    navigate(
      `/cases-list/accident-case-preview/${accidentCaseId}/business-case/${businessCaseId}`,
      {
        state: { businessCaseId: businessCaseId },
      },
    )
  }

  const handleViewClick = (row) => {
    navigate(
      `/business-case/${row.AccidentCase.id}/${row.id}/pdf`,
    )
  }
  const handleEditAccidentDocument = (documentId) => {
    navigate(
      `/cases-list/accident-case-preview/${accidentCaseId}/accident-document/${documentId}`,
      {
        state: { documentId: documentId },
      },
    )
  }

  const [companyId, setCompanyId] = useState(null)

  const [deleteParticipantId, setDeleteParticipantId] = useState(null)
  const [documentIds, setDocumentIds] = useState(null)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleEditParticipant = (participantId) => {
    navigate(
      `/cases-list/accident-case-preview/${accidentCaseId}/submit-case/${participantId}`,
      {
        state: { participantId: participantId, accidentCaseId: accidentCaseId },
      },
    )
  }
  const confirmDeleteParticipant = (participantId) => {
    setConfirmVisible(true)
    setDeleteParticipantId(participantId)
  }
  const confirmDialogParticipant = () => (
    <ConfirmDialog
      title="Delete Participant"
      type="danger"
      confirmButtonColor="red-600"
      isOpen={confirmVisible}
      onConfirm={handleDeleteParticipant}
      onCancel={() => setConfirmVisible(false)}
      onClose={() => setConfirmVisible(false)}
      loading={deleting}
    >
      Are you sure you want to delete this Participant?
    </ConfirmDialog>
  )

  const handleDeleteParticipant = async () => {
    try {
      setDeleting(true)
      const response = await deleteParticipant(deleteParticipantId)
      toast.push(
        <Notification className="mb-4" type="success">
          Participant Deleted
        </Notification>,
      )
      getParticipantData()
      setConfirmVisible(false)
      setDeleteParticipantId(null)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed
        </Notification>,
      )
    }
    setDeleting(false)
    setDeleteParticipantId(null)
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

  const handleView = (row) => {
    navigate(
      `/cases-list/accident-case-preview/${accidentCaseId}/${row.id}/pdf`,
      {
        state: { accidentCaseId: accidentCaseId, businessCaseId: row.id },
      },
    )
  }

  const handleViewDamageReport = (row) => {
    navigate(
      `/cases-list/accident-case-preview/${accidentCaseId}/${row}/damage-pdf`,
      {
        state: { accidentCaseId: accidentCaseId, participantId: row },
      },
    )
  }

  const confirmDelete = (companyId) => {
    setConfirmVisible(true)
    setCompanyId(companyId)
  }
  const confirmDeleteDocument = (documentIds) => {
    setConfirmVisible(true)
    setDocumentIds(documentIds)
  }

  const confirmDialog = () => (
    <ConfirmDialog
      title="Delete BusinessCase"
      type="danger"
      confirmButtonColor="red-600"
      isOpen={confirmVisible}
      onConfirm={handleDelete}
      onCancel={() => setConfirmVisible(false)}
      onClose={() => setConfirmVisible(false)}
      loading={deleting}
    >
      Are you sure you want to delete this Business Case?
    </ConfirmDialog>
  )
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
  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await deleteBusinessCase(companyId)
      toast.push(
        <Notification className="mb-4" type="success">
          Business Case Deleted
        </Notification>,
      )
      getBusinessCaseData()
      setConfirmVisible(false)
      setCompanyId(null)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed
        </Notification>,
      )
    }
    setDeleting(false)
    setCompanyId(null)
  }
  const tableColumns = [
    {
      Header: t('label.Insurance Case Id'),
      accessor: 'insuranceCaseId',
    },
    {
      Header: t('label.Case Number'),
      accessor: 'casenumber',
    },
    {
      Header: t('label.Type'),
      accessor: 'type',
    },
    {
      Header: t('label.Participant'),
      accessor: 'ParticipantA.label',
    },
    {
      Header: t('label.Customer Participant'),
      accessor: 'CustomerParticipant.label',
    },
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

  const canPerformActions = useAuthority([
    // "can_edit_cases_list",
    'can_view_cases_list',
    'can_delete_cases_list',
  ])

  if (canPerformActions) {
    tableColumns.push({
      Header: t('label.Actions'),
      accessor: 'actions',
      Cell: (props) => {
        const row = props.row.original
        return (
          <div className="flex justify-start text-lg">
            <AuthorityCheck authority={['can_edit_cases_list']}>
              <Button
                className="cursor-pointer w-50 ml-2"
                variant="solid"
                icon={<HiOutlineEye />}
                size="sm"
                onClick={() => handleViewClick(row)}
              >
                View Details
              </Button>
            </AuthorityCheck>

            <AuthorityCheck authority={['can_edit_cases_list']}>
              <Button
                className="cursor-pointer w-50 ml-2"
                variant="solid"
                icon={<HiOutlinePencil />}
                size="sm"
                onClick={() => handleEditClick(row.id)}
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
                onClick={() => confirmDelete(row.id)}
              >
                Delete
              </Button>
            </AuthorityCheck>
          </div>
        )
      },
    })
  }
  const cols = useMemo(() => tableColumns, [canPerformActions])

  const onTabChange = (val) => {
    setCurrentTab(val)
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
                onClick={() => handleView(row)}
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
                onClick={() => handleEditAccidentDocument(row.id)}
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

  return (
    <div>
      <Container>
        <div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center">
            <h3>{t('heading.Submit Case')}</h3>
            <div className="flex flex-wrap items-center gap-2">
              {(showAccidentScenario || showParticipantsForm) && (
                <Button
                  type="button"
                  variant="solid"
                  size="sm"
                  className="w-50 mr-2"
                  onClick={redirectBack}
                >
                  {t('button.Back')}
                </Button>
              )}
              {!showAccidentScenario && (
                <Button
                  type="button"
                  size="sm"
                  className="w-50 mr-2"
                  onClick={handleClickAccidentScenario}
                >
                  {t('button.Add Accident Scenario')}
                </Button>
              )}
              {!showParticipantsForm && (
                <Button
                  type="button"
                  size="sm"
                  className="w-50 mr-2"
                  onClick={handleClickParticipantsForm}
                >
                  {t('button.Add Another Participant')}
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                className="w-50 mr-2"
                onClick={redirectPath}
              >
                {t('button.Create Business Case')}
              </Button>
              <Button
                type="button"
                size="sm"
                className="w-50"
                onClick={redirectAccidentDocument}
              >
                {t('button.Create Accident Document')}
              </Button>
            </div>
          </div>
        </div>
        <div>
          {showAccidentScenario && (
            <AccidentScenario
              accidentCaseId={accidentCaseId}
              setAccidentCaseScenario={setAccidentCaseScenario}
            />
          )}
          {showParticipantsForm && (
            <ParticipantsForm
              handleSave={handleSave}
              setPreview={handleClickPreview}
              setParticipantId={setParticipantId}
              accidentCaseId={accidentCaseId}
            />
          )}
        </div>
        {showParticipantsForm ||
          showAccidentScenario ||
          (true && (
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
                    {currentTab === 'accidentCaseInfo' && (
                      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card
                          className="dark:bg-gray-700 bg-white mb-2"
                          header={
                            <div className="flex w-full justify-between text-center">
                              <h2 className="text-xl font-bold">
                                {t('heading.Accident Case Info')}
                              </h2>
                              <AuthorityCheck
                                authority={['can_edit_accident_case']}
                              >
                                <span className="cursor-pointer p-2 hover:text-blue-500">
                                  <HiOutlinePencil
                                    onClick={() =>
                                      accidentCaseModal(matchedAccidentCase.id)
                                    }
                                  />
                                </span>
                              </AuthorityCheck>
                            </div>
                          }
                        >
                          <p>
                            <b>{t('label.Date Of Accident')}</b>:{' '}
                            {matchedAccidentCase?.dateOfAccident}
                          </p>
                          <p>
                            <b>{t('label.Accident Address')}</b>:{' '}
                            {matchedAccidentCase?.accidentAddress}
                          </p>
                          <p>
                            <b>{t('label.Country')}</b>:{' '}
                            {matchedAccidentCase?.country}
                          </p>
                          <p>
                            <b>{t('label.City')}</b>:{' '}
                            {matchedAccidentCase?.city}
                          </p>
                          <p>
                            <b>{t('label.Injuries')}</b>:{' '}
                            {matchedAccidentCase?.injuries ? 'Yes' : 'No'}
                          </p>
                          <p>
                            <b>{t('label.investigation By Police')}</b>:{' '}
                            {matchedAccidentCase?.investigationByPolice
                              ? 'Yes'
                              : 'No'}
                          </p>
                          {matchedAccidentCase?.investigationByPolice ===
                            true && (
                            <p>
                              <b>{t('label.Police Department')}</b>:{' '}
                              {matchedAccidentCase?.policeDepartment}
                            </p>
                          )}
                          <p>
                            <b>{t('label.otherCarDamage')}</b>:{' '}
                            {matchedAccidentCase?.otherCarDamage ? 'Yes' : 'No'}
                          </p>
                          <p>
                            <b>{t('label.witness')}</b>:{' '}
                            {matchedAccidentCase?.witness}
                          </p>
                        </Card>
                      </div>
                    )}
                    {currentTab === 'accidentCaseParticipant' && (
                      <>
                        {' '}
                        {/* <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {allParticipants.map((data) => {
                            if (data?.AccidentCase?.id === accidentCaseId) {
                              return (
                                
                            <> {confirmDialogParticipant()} 
                            <Card
                            className="dark:bg-gray-700 bg-white mb-2"
                            header={
                              <div className="flex w-full justify-between text-center">
                                <h5>{data?.ownerName}</h5>
                              <div className="flex">
                              <AuthorityCheck
                                  authority={['can_edit_participant']}
                                >
                                  <span className="cursor-pointer p-2 hover:text-blue-500">
                                    <HiOutlinePencil
                                      onClick={() =>
                                        handleEditParticipant(data.id)
                                      }
                                    />
                                  </span>
                                </AuthorityCheck>
                                <AuthorityCheck
                                  authority={['can_delete_participant']}
                                >
                                  <span className="cursor-pointer p-2 hover:text-red-500">
                                    <HiOutlineTrash
                                      onClick={() =>
                                        confirmDeleteParticipant(data.id)
                                      }
                                    />
                                  </span>
                                </AuthorityCheck>
                                </div>  
                              </div>
                            }
                            key={data?.AccidentCase?.id}
                          >
                            <p>
                              <b>{t('label.Address')}</b>:{' '}
                              {data?.ownerAddress}
                            </p>
                            <p>
                              <b>{t('label.Telephone Number')}</b>:{' '}
                              {data?.ownerTelephone}
                            </p>
                            <p>
                              <b>{t('label.Vehicle Type Mark')}</b>:{' '}
                              {data?.vehicleTypeMark}
                            </p>
                            <p>
                              <b>
                                {t('label.Vehicle Registration Number')}
                              </b>
                              : {data?.vehicleRegistrationNumber}
                            </p>
                            <Button
                              type="button"
                              size="sm"
                              variant="solid"
                              className="w-50 mt-2"
                              onClick={() => {
                                toggleDocumentModal(data?.id)
                              }}
                            >
                              {t('button.View All')}
                            </Button>
                          </Card></>   
                            
                              )
                            } else {
                              return null
                            }
                          })}
                        </div> */}
                        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {allParticipants.map((data, index) => {
                            if (data?.AccidentCase?.id === accidentCaseId) {
                              return (
                                <>
                                  {confirmDialogParticipant()}
                                  <Card
                                    className="dark:bg-gray-700 bg-white mb-2"
                                    header={
                                      <div className="flex w-full justify-between text-center">
                                        {data?.carOwnBy === 'individual' && (
                                      <>
                                        <h3>
                                          {data?.ownerName}
                                        </h3>
                                      </>
                                    )}
                                     {data?.carOwnBy === 'company' && (
                                      <>
                                        <h3>
                                          {data?.companyName}
                                        </h3> 
                                      </>
                                    )}
                                        <div className="flex">
                                          <AuthorityCheck
                                            authority={['can_edit_participant']}
                                          >
                                            <span className="cursor-pointer p-2 hover:text-blue-500">
                                              <HiOutlinePencil
                                                onClick={() =>
                                                  handleEditParticipant(data.id)
                                                }
                                              />
                                            </span>
                                          </AuthorityCheck>
                                          <AuthorityCheck
                                            authority={[
                                              'can_delete_participant',
                                            ]}
                                          >
                                            <span className="cursor-pointer p-2 hover:text-red-500">
                                              <HiOutlineTrash
                                                onClick={() =>
                                                  confirmDeleteParticipant(
                                                    data.id,
                                                  )
                                                }
                                              />
                                            </span>
                                          </AuthorityCheck>
                                          {/* <h6>{label}</h6> */}
                                          <span className="border-2 border-red-600 h-8 w-8 flex items-center justify-center rounded-full">
                                            <b>{data.label}</b>
                                          </span>
                                        </div>
                                      </div>
                                    }
                                    key={data?.AccidentCase?.id}
                                  >
                                    {data?.carOwnBy === 'individual' && (
                                      <>
                                        <p>
                                          <b>{t('label.Owner Name')}</b>:{' '}
                                          {data?.ownerName}
                                        </p>
                                        <p>
                                          <b>{t('label.Owner Address')}</b>:{' '}
                                          {data?.ownerAddress}
                                        </p>
                                        <p>
                                          <b>{t('label.Owner Birth Number')}</b>
                                          : {data?.ownerBirthNumber}
                                        </p>  
                                        <p>
                                          <b>{t('label.Party Policy Number')}</b>
                                          : {data?.thirdPartyPolicyNumber}
                                        </p> 
                                      </>
                                    )}
                                    {data?.carOwnBy === 'company' && (
                                      <>
                                        <p>
                                          <b>{t('label.Company Email')}</b>:{' '}
                                          {data?.companyEmail}
                                        </p>
                                        <p>
                                          <b>
                                            {t(
                                              'label.Company Registration Number',
                                            )}
                                          </b>
                                          : {data?.companyRegistrationNumber}
                                        </p>
                                        <p>
                                          <b>{t('label.Company Vat Payer')}</b>:
                                          {data?.companyVatPayer ? 'Yes' : 'No'}
                                        </p>
                                        <p>
                                          <b>{t('label.Party Policy Number')}</b>
                                          : {data?.thirdPartyPolicyNumber}
                                        </p> 
                                      </>
                                    )}
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="solid"
                                        icon={<HiOutlineEye />}
                                        className="w-50 mt-2 cursor-pointer"
                                        onClick={() => {
                                          toggleDocumentModal(data?.id)
                                        }}
                                      >
                                        {t('button.View All')}
                                      </Button>
                                      <Button
                                        variant="solid"
                                        icon={<HiOutlineFilm />}
                                        size="sm"
                                        className="w-50 mt-2 cursor-pointer"
                                        onClick={() =>
                                          handleViewDamageReport(data?.id)
                                        }
                                      >
                                        Damage Report
                                      </Button>
                                    </div>
                                  </Card>
                                </>
                              )
                            } else {
                              return null
                            }
                          })}
                        </div>
                      </>
                    )}
                    {currentTab === 'accidentCaseScenarios' && (
                      <>
                        {matchedAccidentCaseScenario?.filePath && (
                          <>
                            {' '}
                            <img
                              src={matchedAccidentCaseScenario?.filePath}
                              alt="image"
                              className="border-2 bg-gray-100"
                            />
                          </>
                        )}
                      </>
                    )}
                    {currentTab === 'businessCases' && (
                      <>
                        {' '}
                        {showAccidentScenario || showParticipantsForm || (
                          <>
                            {confirmDialog()}
                            <DataTable
                              columns={cols}
                              data={matchedBusinessCase}
                            />
                          </>
                        )}
                      </>
                    )}
                    {currentTab === 'accidentDocument' && (
                      <>
                        {' '}
                        {showAccidentScenario || showParticipantsForm || (
                          <>
                            {confirmDialogDocument()}
                            <DataTable
                              columns={col}
                              data={allAccidentDocument}
                            />
                          </>
                        )}
                      </>
                    )}
                  </Suspense>
                </div>
              </AdaptableCard>
            </Container>
          ))}
      </Container>

      <DialogDoc
        participantModalId={participantModalId}
        participantModalVisible={participantModalVisible}
        toggleDocumentModal={toggleDocumentModal}
        allParticipants={allParticipants}
        accidentCaseId={accidentCaseId}
      />
      <DialogAccidentCase
        accidentCaseModalVisible={accidentCaseModalVisible}
        accidentCaseModalId={accidentCaseModalId}
        toggleDocumentModal={accidentCaseModal}
        allAccidentCase={allAccidentCase}
      />
      <DialogDocSelection
        getParticipantData={getParticipantData}
        participantModalId={participantModalId}
        participantModalVisible={selectParticipantModalVisible}
        toggleDocumentModal={toggleDocumentModalSelection}
        allParticipants={allParticipants}
        accidentCaseId={accidentCaseId}
      />
    </div>
  )
}

export default AccidentCasePreview
