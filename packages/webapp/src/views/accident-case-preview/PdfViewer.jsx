import React, { useState, useEffect } from 'react'
import {
  HiOutlinePencil,
  HiOutlineZoomIn,
  HiOutlineZoomOut,
} from 'react-icons/hi'
import { useTranslation } from 'react-i18next'
import { Document, Page, pdfjs } from 'react-pdf'
import { useParams } from 'react-router-dom'
import { PDFDocument, setFontAndSize } from 'pdf-lib'
import { ImSpinner9 } from 'react-icons/im'
import { Button, Avatar, Spinner } from '@/components/ui'
import SignatureCanva from './dialog/SignatureCanva'
import { getDocument } from '@/services/submit-case'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const PdfViewer = () => {
  const { t } = useTranslation()
  const params = useParams()
  const accidentCaseId = params.accidentCaseId
  const businessCaseId = params.businessCaseId
  const [numPages, setNumPages] = useState(null)
  const [blobUrl, setBlobUrl] = useState(null)
  const [participantIds, setParticipantIds] = useState(null)
  const [signModalVisible, setSignModalVisible] = useState(false)
  const [allAccidentDocument, setAllAccidentDocument] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [scale, setScale] = useState(1)

  const matchedAccidentDocument = allAccidentDocument.find(
    (caseItem) => caseItem.id === businessCaseId,
  )
  const row = matchedAccidentDocument
  useEffect(() => {
    getDocumentData()
  }, [])

  useEffect(() => {
    if (row) {
      handleDownload(row)
    }
  }, [row])

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
      vehicle_a_owner_name_address_two: row.CulpritParticipant.ownerAddress || '',
      vehicle_a_phone: row.CulpritParticipant.ownerTelephone || '',
      vehicle_a_type_mark: row.CulpritParticipant.vehicleTypeMark || '',
      vehicle_a_registration_no:
      row.CulpritParticipant.vehicleRegistrationNumber || '',
      vehicle_a_address: row.CulpritParticipant.driverAddress || '',
      vehicle_a_policy_number: row.CulpritParticipant.thirdPartyPolicyNumber || '',
      vehicle_a_green_card_number: row.CulpritParticipant.thirdPartyGreenCard || '',
      vehicle_a_green_card_number_validity:
      row.CulpritParticipant.greenCardValidUntil || '',
      vehicle_a_demage_to_insure_company_name:
      row.CulpritParticipant.otherDamageInsuranceCompanyName || '',
      vehicle_a_driver_name: row.CulpritParticipant.driverName || '',
      vehicle_a_driver_sur_name: row.CulpritParticipant.driverSurname || '',
      vehicle_a_driver_address: row.CulpritParticipant.driverAddress || '',
      vehicle_a_driving_license: row.CulpritParticipant.driverLicenseNumber || '',
      vehicle_a_driver_groups: row.CulpritParticipant.driverGroups || '',
      vehicle_a_driver_group_issuedby: row.CulpritParticipant.driverIssuedBy || '',
      vehicle_a_driver_issued_by_two: row.CulpritParticipant.driverIssuedBy || '',
      vehicle_a_driver_license_valid_from:
      row.CulpritParticipant.driverValidFrom || '',
      vehicle_a_driver_license_valid_to: row.CulpritParticipant.driverValidTo || '',
      vehicle_a_visible_damage_one: row.CulpritParticipant.visibleDamage[0] || '',
      vehicle_a_visible_damage_two: row.CulpritParticipant.visibleDamage[1] || '',
      vehicle_a_visible_damage_three: row.CulpritParticipant.visibleDamage[2] || '',
      vehicle_a_remarks_one: row.CulpritParticipant.remarks || '',
      vehicle_a_remarks_two: row.CulpritParticipant.remarks || '',
      vehicle_a_accident_cause_by_others_name_address:
      row.CulpritParticipant.accidentCausedByOtherAddress || '',
      vehicle_b_owner_name_address_one: row.DamageParticipant.ownerName || '',
      vehicle_b_owner_name_address_two: row.DamageParticipant.ownerAddress || '',
      vehicle_b_owner_name_address_three: row.DamageParticipant.ownerName || '',
      vehicle_b_phone: row.DamageParticipant.ownerTelephone || '',
      vehicle_b_type_mark: row.DamageParticipant.vehicleTypeMark || '',
      vehicle_b_registration_no:
      row.DamageParticipant.vehicleRegistrationNumber || '',
      vehicle_b_address: row.DamageParticipant.driverAddress || '',
      vehicle_b_policy_number: row.DamageParticipant.thirdPartyPolicyNumber || '',
      vehicle_b_green_card_number: row.DamageParticipant.thirdPartyGreenCar || '',
      vehicle_b_green_card_number_validity:
      row.DamageParticipant.greenCardValidUntil || '',
      vehicle_b_demage_to_insure_company_name:
      row.DamageParticipant.otherDamageInsuranceCompanyName || '',
      vehicle_b_driver_name: row.DamageParticipant.driverName || '',
      vehicle_b_driver_sur_name: row.DamageParticipant.driverSurName || '',
      vehicle_b_driver_address: row.DamageParticipant.driverAddress || '',
      vehicle_b_driving_license: row.DamageParticipant.driverLicenseNumber || '',
      vehicle_b_driver_groups: row.DamageParticipant.driverGroups || '',
      vehicle_b_driver_group_issued_by: row.DamageParticipant.driverIssuedBy || '',
      vehicle_b_driver_issued_by_two: row.DamageParticipant.driverIssuedBy || '',
      vehicle_b_driver_license_valid_from:
      row.DamageParticipant.driverValidFrom || '',
      vehicle_b_driver_license_valid_to: row.DamageParticipant.driverValidTo || '',
      vehicle_b_visible_damage_one: row.CulpritParticipant.visibleDamage[0] || '',
      vehicle_b_visible_damage_two: row.DamageParticipant.visibleDamage[1] || '',
      vehicle_b_visible_damage_three: row.DamageParticipant.visibleDamage[2] || '',
      vehicle_b_remarks_one: row.DamageParticipant.remarks || '',
      vehicle_b_remarks_two: row.DamageParticipant.remarks || '',
      vehicle_b_accident_cause_by_others_name_address:
      row.DamageParticipant.accidentCausedByOtherAddress || '',
    }
    try {
      const formPdfBytes = await fetchData('/angelPdf.pdf')
      const pdfDoc = await PDFDocument.load(formPdfBytes)

    //   const fontBytes = await fetch('/Open_Sans/OpenSans-VariableFont_wdth,wght.ttf').then((res) => res.arrayBuffer());
    // const customFont = await pdfDoc.embedFont(fontBytes);
    // console.log("customFont",fontBytes);

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
    // const textField = form.getTextField('date_of_accident');
    // textField.setText('že zneuznání lidských práv a pohrdání jimi vedlo k barbarským č' );
    // const da = textField.acroField.getDefaultAppearance() ?? '';
    // const newDa = da + '\n' + setFontAndSize('Courier', 8).toString(); //setFontAndSize() method came to resuce
    // textField.acroField.setDefaultAppearance(newDa);
      if (row.culpritParticipantSign) {
        const imageFieldSignA = form.getTextField('Vehicle_a_sign')

        const imageSignBytes = await fetch(
          row.culpritParticipantSign,
        ).then((response) => response.arrayBuffer())
        const imageSign = await pdfDoc.embedPng(imageSignBytes)
        imageFieldSignA.setImage(imageSign)
      }
      if (row.damageParticipantSign) {
        const imageFieldSignB = form.getTextField('Vehicle_b_sign')

        const imageSignByteB = await fetch(
          row.damageParticipantSign,
        ).then((response) => response.arrayBuffer())
        const imageSigns = await pdfDoc.embedPng(imageSignByteB)
        imageFieldSignB.setImage(imageSigns)
      }

      if (row.AccidentCase.AccidentScenario[0]) {
        const imageField = form.getTextField('plane_of_accident_image')

        const imageBytes = await fetch(
          row.AccidentCase.AccidentScenario[0].filePath,
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

      const modifiedPdfBytes = await pdfDoc.save()
      return modifiedPdfBytes
    } catch (error) {
      console.error('Error processing the PDF:', error)
    }
  }
  const handleDownload = async (row) => {
    const pdfBytes = await createPdf(row)
    if (pdfBytes) {
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      setBlobUrl(url)
    }
  }

  const getDocumentData = async (options = {}) => {
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
  }

  const signCaseModal = (id) => {
    setSignModalVisible(!signModalVisible)
    setParticipantIds(id)
  }

  const zoomIn = () => {
    setScale(scale + 0.1)
  }

  const zoomOut = () => {
    setScale(scale - 0.1)
  }

  const handleLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
    setIsLoading(false)
  }

  const handleLoadError = (error) => {
    console.error(error)
    setIsLoading(false)
  }

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="relative bg-gray-200 border-8  bg-opacity-75 px-6 py-32 sm:px-12 sm:py-8 lg:px-16">
          <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="overflow-hidden ">
              {blobUrl && (
                <Document
                  file={blobUrl}
                  onLoadSuccess={handleLoadSuccess}
                  onLoadError={handleLoadError}
                >
                  {Array.from(new Array(numPages || 0), (_, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      scale={scale}
                    />
                  ))}
                </Document>
              )}

              {isLoading && blobUrl && (
                <Spinner size={40} indicator={ImSpinner9} />
              )}
            </div>
            <div className="fixed bottom-[160px] right-[20px] z-10">
              <Button
                variant="solid"
                size="xs"
                icon={<HiOutlinePencil />}
                className='pl-4 pr-4'
                onClick={() => signCaseModal(matchedAccidentDocument.culpritParticipant)}
              >
                {t('label.Culprit Participant Sign')}
              </Button>
            </div>
            <div className="fixed bottom-[120px] right-[20px] z-10">
              <Button
                variant="solid"
                size="xs"
                icon={<HiOutlinePencil />}
                onClick={() => signCaseModal(matchedAccidentDocument.damageParticipant)}
              >
                {t('label.Damage Participant Sign')}
              </Button>
            </div>
            <div className="fixed bottom-[40px] right-[20px] z-10">
              <Avatar
                size={50}
                shape="circle"
                icon={<HiOutlineZoomIn size={30} />}
                onClick={zoomIn}
                className="mr-2 bg-gray-200 text-red-600"
              ></Avatar>
              <Avatar
                size={50}
                shape="circle"
                icon={<HiOutlineZoomOut size={30} />}
                onClick={zoomOut}
                className="bg-gray-200 text-red-600"
              ></Avatar>
            </div>
          </div>
        </div>
      </div>
      <SignatureCanva
        signModalVisible={signModalVisible}
        signCaseModal={signCaseModal}
        matchedAccidentDocument={matchedAccidentDocument}
        accidentCaseId={accidentCaseId}
        participantIds={participantIds}
        getDocumentData={getDocumentData}
      />
    </>
  )
}

export default PdfViewer
