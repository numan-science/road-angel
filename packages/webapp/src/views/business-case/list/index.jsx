import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PDFDocument, rgb } from 'pdf-lib'
import {
  Card,
  toast,
  Notification,
  Tag,
  Dropdown,
  Tooltip
} from '@/components/ui'
import dayjs from 'dayjs'
import {
  HiOutlineEye,
  HiOutlineTrash,
} from 'react-icons/hi'
import {
  DataTable,
  ConfirmDialog,
  AuthorityCheck,
} from '@/components/shared'
import { PAGE_SIZE_OPTIONS, QUERY_STATUS } from '@/constants/app.constant'
import { VscFilePdf } from 'react-icons/vsc';
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import useAuthority from '@/utils/hooks/useAuthority'
import { deleteBusinessCase } from '@/services/business-case'
import { useNavigate } from 'react-router-dom'
import businessCase from '..'
import { RiEdit2Line } from 'react-icons/ri'
import { updateBusinessCase } from '@/services/business-case'

const Status = ({ status }) => {
	switch (status) {
		case QUERY_STATUS.COMPLETED:
			return (
				<Tag className="bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-100 border-0 rounded">
					{status}
				</Tag>
			);
		case QUERY_STATUS.REJECTED:
			return (
				<Tag className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 border-0 rounded">
					{status}
				</Tag>
			);
		case QUERY_STATUS.PENDING:
			return (
				<Tag className="bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-100 border-0 rounded">
					{status}
				</Tag>
			);
	}
};

const BusinessList = (props) => {
  const { t } = useTranslation()
  const {
    data = [],
    className,
    count,
    page,
    limit,
    getTableData,
    handleOnClear,
    reset
  } = props
  const {
    formState: { errors },
  } = useForm()

  const [confirmVisible, setConfirmVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [companyId, setCompanyId] = useState(null)
  const [pdfBytes, setPdfBytes] = useState(null);
  const confirmDelete = (companyId) => {
    setConfirmVisible(true)
    setCompanyId(companyId)
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
    
    // const visibleDamageNew = row?.ParticipantA?.visibleDamage
    // const visible = [...visibleDamageNew]

    const fieldsData = {
      date_of_accident: row?.AccidentCase.dateOfAccident || '',
      label_1:row.CulpritParticipant.label,
      label_2:row.DamageParticipant.label,
      place_of_accident: row?.AccidentCase.city || '',
      accident_witnesses: row?.AccidentCase.witness || '',
      vehicle_a_owner_name_address_one: row?.ParticipantA.ownerName || '',
      vehicle_a_owner_name_address_two: row?.ParticipantA.ownerAddress || '',
      vehicle_a_phone: row?.ParticipantA.ownerTelephone || '',
      vehicle_a_type_mark: row?.ParticipantA.vehicleTypeMark || '',
      vehicle_a_registration_no: row?.ParticipantA.vehicleRegistrationNumber || '',
      vehicle_a_address: row?.ParticipantA.driverAddress || '',
      vehicle_a_policy_number: row?.ParticipantA.thirdPartyPolicyNumber || '',
      vehicle_a_green_card_number: row?.ParticipantA.thirdPartyGreenCard || '',
      vehicle_a_green_card_number_validity: row?.ParticipantA.greenCardValidUntil || '',
      vehicle_a_demage_to_insure_company_name: row?.ParticipantA.otherDamageInsuranceCompanyName || '',
      vehicle_a_driver_name: row?.ParticipantA.driverName || '',
      vehicle_a_driver_sur_name: row?.ParticipantA.driverSurname || '',
      vehicle_a_driver_address: row?.ParticipantA.driverAddress || '',
      vehicle_a_driving_license: row?.ParticipantA.driverLicenseNumber || '',
      vehicle_a_driver_groups: row?.ParticipantA.driverGroups || '',
      vehicle_a_driver_group_issuedby: row?.ParticipantA.driverIssuedBy || '',
      vehicle_a_driver_issued_by_two: row?.ParticipantA.driverIssuedBy || '',
      vehicle_a_driver_license_valid_from:
      row?.ParticipantA.driverValidFrom || '',
      vehicle_a_driver_license_valid_to: row?.ParticipantA.driverValidTo || '',
      vehicle_a_visible_damage_one: row?.ParticipantA.visibleDamage[0] || '',
      vehicle_a_visible_damage_two: row?.ParticipantA.visibleDamage[1] || '',
      vehicle_a_visible_damage_three: row?.ParticipantA.visibleDamage[2] || '',
      vehicle_a_remarks_one: row?.ParticipantA.remarks || '',
      vehicle_a_remarks_two: row?.ParticipantA.remarks || '',
      vehicle_a_accident_cause_by_others_name_address:
      row?.ParticipantA.accidentCausedByOtherAddress || '',
      vehicle_b_owner_name_address_one: row?.ParticipantB.ownerName || '',
      vehicle_b_owner_name_address_two: row?.ParticipantB.ownerAddress || '',
      vehicle_b_owner_name_address_three: row?.ParticipantB.ownerName || '',
      vehicle_b_phone: row?.ParticipantB.ownerTelephone || '',
      vehicle_b_type_mark: row?.ParticipantB.vehicleTypeMark || '',
      vehicle_b_registration_no: row?.ParticipantB.vehicleRegistrationNumber || '',
      vehicle_b_address: row?.ParticipantB.driverAddress || '',
      vehicle_b_policy_number: row?.ParticipantB.thirdPartyPolicyNumber || '',
      vehicle_b_green_card_number: row?.ParticipantB.thirdPartyGreenCar || '',
      vehicle_b_green_card_number_validity: row?.ParticipantB.greenCardValidUntil || '',
      vehicle_b_demage_to_insure_company_name: row?.ParticipantB.otherDamageInsuranceCompanyName || '',
      vehicle_b_driver_name: row?.ParticipantB.driverName || '',
      vehicle_b_driver_sur_name: row?.ParticipantB.driverSurName || '',
      vehicle_b_driver_address: row?.ParticipantB.driverAddress || '',
      vehicle_b_driving_license: row?.ParticipantB.driverLicenseNumber || '',
      vehicle_b_driver_groups: row?.ParticipantB.driverGroups || '',
      vehicle_b_driver_group_issued_by: row?.ParticipantB.driverIssuedBy || '',
      vehicle_b_driver_issued_by_two: row?.ParticipantB.driverIssuedBy || '',
      vehicle_b_driver_license_valid_from:
      row?.ParticipantB.driverValidFrom || '',
      vehicle_b_driver_license_valid_to: row?.ParticipantB.driverValidTo || '',
      vehicle_b_visible_damage_one: row?.ParticipantA.visibleDamage[0] || '',
      vehicle_b_visible_damage_two: row?.ParticipantB.visibleDamage[1] || '',
      vehicle_b_visible_damage_three: row?.ParticipantB.visibleDamage[2] || '',
      vehicle_b_remarks_one: row?.ParticipantB.remarks || '',
      vehicle_b_remarks_two: row?.ParticipantB.remarks || '',
      vehicle_b_accident_cause_by_others_name_address: row?.ParticipantB.accidentCausedByOtherAddress || '',
  
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

    if(row?.AccidentCase.AccidentScenario[0]){
      const imageField = form.getTextField('plane_of_accident_image')

      const imageBytes = await fetch(
        row?.AccidentCase.AccidentScenario[0].filePath,
      ).then((response) => response.arrayBuffer())
      const image = await pdfDoc.embedPng(imageBytes)
      imageField.setImage(image)
    } 

      
      const imageFieldA = form.getTextField('vehicle_a_initial_impact_accident')

      const imageBytesA = await fetch(
        row?.ParticipantA.initialImpact,
      ).then((response) => response.arrayBuffer())
      const imageA = await pdfDoc.embedPng(imageBytesA)
      imageFieldA.setImage(imageA)

      const imageFieldB = form.getTextField('vehicle_b_initial_impact_accident')

      const imageBytesB = await fetch(
        row?.ParticipantB.initialImpact,
      ).then((response) => response.arrayBuffer())
      const imageB = await pdfDoc.embedPng(imageBytesB)
      imageFieldB.setImage(imageB)

      const checkBoxFieldYes = form.getCheckBox(
        'accident_cause_by_vehicle_driver_a_yes',
      )

      const checkBoxFieldNo = form.getCheckBox(
        'accident_cause_by_vehicle_driver_a_no',
      )

      if (row?.ParticipantA.accidentCausedByDriverA) {
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

      if (row?.ParticipantA.accidentCausedByDriverB) {
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

      if (row?.ParticipantB.accidentCausedByDriverB) {
        checkBoxFieldB5.check()
      } else {
        checkBoxFieldB6.check()
      }

      const checkBoxFieldB7 = form.getCheckBox('vehicle_a_demage_to_insure_yes')

      const checkBoxFieldB8 = form.getCheckBox('vehicle_a_demage_to_insure_no')

      if (row?.ParticipantA.isDamageInsurance) {
        checkBoxFieldB7.check()
      } else {
        checkBoxFieldB8.check()
      }

      const checkBoxFieldB9 = form.getCheckBox('vehicle_b_demage_to_insure_yes')

      const checkBoxFieldB10 = form.getCheckBox('vehicle_b_demage_to_insure_no')

      if (row?.ParticipantB.isDamageInsurance) {
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

      if (row?.ParticipantB.accidentCausedByCommonFault === true) {
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

      if (row?.ParticipantA.accidentCausedByCommonFault === true) {
        checkBoxFieldYesA.check()
      } else {
        checkBoxFieldNoA.check()
      }

      const checkBoxFieldY = form.getCheckBox('investigated_by_police_yes')
      const checkBoxFieldN = form.getCheckBox('investigated_by_police_no')

      if (row?.AccidentCase.investigationByPolice === true) {
        checkBoxFieldY.check()
      } else {
        checkBoxFieldN.check()
      }

      const checkBoxField1 = form.getCheckBox('injuries_accident_yes')
      const checkBoxField2 = form.getCheckBox('injuries_accident_no')

      if (row?.AccidentCase.injuries === true) {
        checkBoxField1.check()
      } else {
        checkBoxField2.check()
      }

      const checkBoxField3 = form.getCheckBox('other_than_car_damage_yes')
      const checkBoxField4 = form.getCheckBox('other_than_car_damage_no')

      if (row?.AccidentCase.otherCarDamage === true) {
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
        row?.ParticipantA?.selectMultipleOptionsToExplainScenario.includes(
          'The car was parked',
        )
      ) {
        checkBoxFieldParticipentA1.check()
      }

      if (
        row?.ParticipantA?.selectMultipleOptionsToExplainScenario.includes(
          'Starting to ride',
        )
      ) {
        checkBoxFieldParticipentA2.check()
      }
      if (
        row?.ParticipantA?.selectMultipleOptionsToExplainScenario.includes(
          'Stopping',
        )
      ) {
        checkBoxFieldParticipentA3.check()
      }

      if (
        row?.ParticipantA?.selectMultipleOptionsToExplainScenario.includes(
          'Entering the road',
        )
      ) {
        checkBoxFieldParticipentA4.check()
      }

      if (
        row?.ParticipantA?.selectMultipleOptionsToExplainScenario.includes(
          'Leaving the road',
        )
      ) {
        checkBoxFieldParticipentA5.check()
      }

      if (
        row?.ParticipantA?.selectMultipleOptionsToExplainScenario.includes(
          'Entering the roundabout',
        )
      ) {
        checkBoxFieldParticipentA6.check()
      }
      if (
        row?.ParticipantA?.selectMultipleOptionsToExplainScenario.includes(
          'Circulating in a roundabout',
        )
      ) {
        checkBoxFieldParticipentA7.check()
      }
      if (
        row?.ParticipantA?.selectMultipleOptionsToExplainScenario.includes(
          'Striking the rear of the other vehicle while going in the same direction and in the same lane',
        )
      ) {
        checkBoxFieldParticipentA8.check()
      }
      if (
        row?.ParticipantA?.selectMultipleOptionsToExplainScenario.includes(
          'going in the same direction but in a different lane',
        )
      ) {
        checkBoxFieldParticipentA9.check()
      }
      if (
        row?.ParticipantA?.selectMultipleOptionsToExplainScenario.includes(
          'Changing lanes',
        )
      ) {
        checkBoxFieldParticipentA10.check()
      }
      if (
        row?.ParticipantA?.selectMultipleOptionsToExplainScenario.includes(
          'Overtaking',
        )
      ) {
        checkBoxFieldParticipentA11.check()
      }
      if (
        row?.ParticipantA?.selectMultipleOptionsToExplainScenario.includes(
          'Turning to the right',
        )
      ) {
        checkBoxFieldParticipentA12.check()
      }
      if (
        row?.ParticipantA?.selectMultipleOptionsToExplainScenario.includes(
          'Turning to the left',
        )
      ) {
        checkBoxFieldParticipentA13.check()
      }
      if (
        row?.ParticipantA?.selectMultipleOptionsToExplainScenario.includes(
          'Reversing',
        )
      ) {
        checkBoxFieldParticipentA14.check()
      }
      if (
        row?.ParticipantA?.selectMultipleOptionsToExplainScenario.includes(
          'Encroaching in the opposite traffic lane',
        )
      ) {
        checkBoxFieldParticipentA15.check()
      }
      if (
        row?.ParticipantA?.selectMultipleOptionsToExplainScenario.includes(
          'Coming from the right ',
        )
      ) {
        checkBoxFieldParticipentA16.check()
      }
      if (
        row?.ParticipantA?.selectMultipleOptionsToExplainScenario.includes(
          'Not observing a right of way sign',
        )
      ) {
        checkBoxFieldParticipentA17.check()
      }

      if (
        row?.ParticipantB.selectMultipleOptionsToExplainScenario.includes(
          'The car was parked',
        )
      ) {
        checkBoxFieldParticipentB1.check()
      }

      if (
        row?.ParticipantB.selectMultipleOptionsToExplainScenario.includes(
          'Starting to ride',
        )
      ) {
        checkBoxFieldParticipentB2.check()
      }
      if (
        row?.ParticipantB.selectMultipleOptionsToExplainScenario.includes(
          'Stopping',
        )
      ) {
        checkBoxFieldParticipentB3.check()
      }

      if (
        row?.ParticipantB.selectMultipleOptionsToExplainScenario.includes(
          'Entering the road',
        )
      ) {
        checkBoxFieldParticipentB4.check()
      }

      if (
        row?.ParticipantB.selectMultipleOptionsToExplainScenario.includes(
          'Leaving the road',
        )
      ) {
        checkBoxFieldParticipentB5.check()
      }

      if (
        row?.ParticipantB.selectMultipleOptionsToExplainScenario.includes(
          'Entering the roundabout',
        )
      ) {
        checkBoxFieldParticipentB6.check()
      }
      if (
        row?.ParticipantB.selectMultipleOptionsToExplainScenario.includes(
          'Circulating in a roundabout',
        )
      ) {
        checkBoxFieldParticipentB7.check()
      }
      if (
        row?.ParticipantB.selectMultipleOptionsToExplainScenario.includes(
          'Striking the rear of the other vehicle while going in the same direction and in the same lane',
        )
      ) {
        checkBoxFieldParticipentB8.check()
      }
      if (
        row?.ParticipantB.selectMultipleOptionsToExplainScenario.includes(
          'Going in the same direction but in a different lane',
        )
      ) {
        checkBoxFieldParticipentB9.check()
      }
      if (
        row?.ParticipantB.selectMultipleOptionsToExplainScenario.includes(
          'Changing lanes',
        )
      ) {
        checkBoxFieldParticipentB10.check()
      }
      if (
        row?.ParticipantB.selectMultipleOptionsToExplainScenario.includes(
          'Overtaking',
        )
      ) {
        checkBoxFieldParticipentB11.check()
      }
      if (
        row?.ParticipantB.selectMultipleOptionsToExplainScenario.includes(
          'Turning to the right',
        )
      ) {
        checkBoxFieldParticipentB12.check()
      }
      if (
        row?.ParticipantB.selectMultipleOptionsToExplainScenario.includes(
          'Turning to the left',
        )
      ) {
        checkBoxFieldParticipentB13.check()
      }
      if (
        row?.ParticipantB.selectMultipleOptionsToExplainScenario.includes(
          'Reversing',
        )
      ) {
        checkBoxFieldParticipentB14.check()
      }
      if (
        row?.ParticipantB.selectMultipleOptionsToExplainScenario.includes(
          'Encroaching in the opposite traffic lane',
        )
      ) {
        checkBoxFieldParticipentB15.check()
      }
      if (
        row?.ParticipantB.selectMultipleOptionsToExplainScenario.includes(
          'Coming from the right',
        )
      ) {
        checkBoxFieldParticipentB16.check()
      }
      if (
        row?.ParticipantB.selectMultipleOptionsToExplainScenario.includes(
          'Not observing a right of way sign',
        )
      ) {
        checkBoxFieldParticipentB17.check()
      }

      const modifiedPdfBytes = await pdfDoc.save()
      setLoading(false)
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
      setPdfBytes(url)
      const a = document.createElement('a')
      a.href = url
      a.download = 'example.pdf'
      a.click()
      URL.revokeObjectURL(url)
    }
  }
const navigate = useNavigate();

const handleView = (row) => {
  navigate(
    `/business-case/${row.AccidentCase.id}/${row.id}/pdf`,
    {
      state: { accidentCaseId: row.AccidentCase.id, businessCaseId: row.id },
    },
  )
}
  const confirmDialog = () => (
    <ConfirmDialog
      title="Delete Insurance Company"
      type="danger"
      confirmButtonColor="red-600"
      isOpen={confirmVisible}
      onConfirm={handleDelete}
      onCancel={() => setConfirmVisible(false)}
      onClose={() => setConfirmVisible(false)}
      loading={deleting}
    >
      Are you sure you want to delete this Insurance Company Documents?
    </ConfirmDialog>
  )
  const LeadRole = ({ agent }) => (
		<Tag className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100 border-0 rounded">
			{agent}
		</Tag>
	);
  const LeadRegion = ({ region }) => (
		<Tag className="bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-100 border-0 rounded">
			  <p className="flex gap-2">
      {region?.map((regions, index) => (
        <span key={index}>{regions} </span>
      ))}
    </p>
		</Tag>
	);

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await deleteBusinessCase(companyId)
      toast.push(
        <Notification className="mb-4" type="success">
          Business Case Deleted !
        </Notification>,
      )
      getTableData()
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
  const updateQueryStatus = async (data) => {
		await updateBusinessCase(data, data.id);
    reset();
		getTableData();
	};
  const onDropdownItemClick = (data, status) => {
		data.status = status;
		updateQueryStatus(data);
	};

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
      Header: t('label.Participant'),
      accessor: 'ParticipantA.label',
      
    },
    {
			Header: t('label.Region'),
			accessor: "region",
			Cell: (props) => {
				const row = props.row.original;
				return <LeadRegion region={row?.User?.UserRegion?.map((region)=> region?.Region?.name)} />;
			},
		},
    {
			Header: t('label.Role'),
			accessor: "agent",
			Cell: (props) => {
				const row = props.row.original;
				return <LeadRole agent={row.User.Role?.name} />;
			},
		},
    {
			Header: "Status",
			accessor: "status",
			Cell: (props) => <Status {...props.row.original} />,
		},

    {
      Header: t('label.Created Time'),
      accessor: 'createdAt',
      Cell: (props) => {
        const row = props.row?.original
        return <span>{dayjs(row?.createdAt).format('DD/MM/YYYY hh:mm A')}</span>
      },
    },
  ]
  const columnHeaders = _.map(tableColumns, 'Header')
  const cols = useMemo(() => tableColumns, columnHeaders)
  const canPerformActions = useAuthority(
		["can_view_business_case", "can_delete_business_case"]
	);
  if(canPerformActions)
  {
    cols.push({
      Header: t('label.Actions'),
      accessor: 'actions',
      Cell: (props) => {
        const row = props.row?.original
        return (
          <div className="flex justify-start text-lg">
            	<span className="cursor-pointer p-2 hover:text-red-500">
							<Tooltip title="Change Status">
								<Dropdown renderTitle={<RiEdit2Line />} placement="bottom-end">
									{Object.keys(QUERY_STATUS).map((item) => (
										<Dropdown.Item
											key={item}
											eventKey={item}
											onSelect={() =>
												onDropdownItemClick(row, QUERY_STATUS[item])
											}
										>
											<span className="text-xs">{QUERY_STATUS[item]}</span>
										</Dropdown.Item>
									))}
								</Dropdown>
							</Tooltip>
						</span>
            {/* <AuthorityCheck authority={['can_view_business_case']}>
              <span
                className="cursor-pointer p-2 hover:text-green-500"
                onClick={() => handleDownload(row)}
              >
                <VscFilePdf />
              </span>
            </AuthorityCheck> */}
            <AuthorityCheck authority={['can_view_business_case']}>
              <span className="cursor-pointer p-2 hover:text-blue-500">
                <HiOutlineEye 
                onClick={() => handleView(row)}
                 />
              </span>
            </AuthorityCheck>

            <AuthorityCheck authority={['can_delete_business_case']}>
              <span className="cursor-pointer p-2 hover:text-red-500">
                <HiOutlineTrash onClick={() => confirmDelete(row?.id)} />
              </span>
            </AuthorityCheck>
           
          </div>
        )
      },
    })
  }

  const onPaginationChange = (pageNo) => {
    getTableData(pageNo, limit)
  }

  const onSelectChange = (pageSize) => {
    getTableData(1, pageSize)
  }

  return (
    <Card className={className}>
      {confirmDialog()}
      <DataTable
        columns={cols}
        data={data}
        pagingData={{
          pageIndex: page,
          pageSize: String(limit),
          total: count,
        }}
        loading={loading}
        pageSizes={PAGE_SIZE_OPTIONS}
        onPaginationChange={onPaginationChange}
        onSelectChange={onSelectChange}
      />
   
    </Card>
  )
}

export default BusinessList
