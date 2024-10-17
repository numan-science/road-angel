import React, { useEffect, useState } from 'react'
import {
  FormContainer,
  Select,
  Button,
  toast,
  Notification,
  Steps,
} from '@/components/ui'
import FormRow from '../submit-case/FormRow'
import _ from 'lodash'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { getAllParticipants } from '@/services/submit-case'
import { useNavigate, useParams } from 'react-router-dom'
import {
  RiSave2Line,
} from 'react-icons/ri'
import { saveAccidentDocument } from '@/services/submit-case'
import { updateAccidentDocument } from '@/services/submit-case'
import { getDocument } from '@/services/submit-case'

const AccidentDocuments = ({
  allParticipants,
  t,
  handleSubmit,
  formState,
  control,
  setFormData,
  formData,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <FormContainer className="p-8">
        <h2 className="text-xl font-bold mb-4">{t('heading.Accident Document')}</h2>
        <FormRow
          label={t('label.Culprit Participant')}
          asterisk
          invalid={formState?.errors?.culpritParticipant}
          errorMessage="Select Culprit Participant is Required!"
        >
          <Controller
            control={control}
            rules={{ required: true }}
            name="culpritParticipant"
            render={({ field }) => {
              const optionsWithLabels = allParticipants.map((participant, index) => ({
                value: participant.value,
                label: participant.label,
              }));
        
              return (
                <Select
                  isClearable
                  {...field}
                  placeholder={t('label.Select Culprit Participant')}
                  options={optionsWithLabels}
                  value={formData?.culpritParticipant}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      culpritParticipant: value,
                    }))
                    field.onChange(value)
                  }}
                />
              )
            }}
          />
        </FormRow>
        <FormRow
          label={t('label.Select Damage Participant')}
          asterisk
          invalid={formState?.errors?.damageParticipant}
          errorMessage="Select Damage Participant is Required!"
        >
          <Controller
            control={control}
            rules={{ required: true }}
            name="damageParticipant"
            render={({ field }) => {
              const optionsWithLabels = allParticipants.map((participant, index) => ({
                value: participant.value,
                label: participant.label,
              }));
        
              return (
                <Select
                  isClearable
                  {...field}
                  placeholder={t('label.Select Damage Participant')}
                  options={optionsWithLabels}
                  value={formData?.damageParticipant}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      damageParticipant: value,
                    }))
                    field.onChange(value)
                  }}
                />
              )
            }}
          />
        </FormRow>

       
      </FormContainer>
    </form>
  )
}

const AccidentDocument = () => {
  const { handleSubmit, formState, setValue, control, reset } = useForm()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [accidentDocumentDataEdit, setAccidentDocumentDataEdit] = useState([])
  const [insuranceCompanyList, setInsuranceCompanyList] = useState([])
  const [allParticipants, setAllParticipants] = useState([])
  const { t } = useTranslation()
  const params = useParams()
  const accidentCaseId = params?.accidentCaseId
  const documentId = params?.documentId
  useEffect(() => {
    if (documentId) {
      const data = _.find(
        accidentDocumentDataEdit,
        (row) => row.id === documentId,
      )
      if (data?.id ) {
        const form = {
          id: data.id,
          culpritParticipant: {
            value: data.CulpritParticipant.id,
            label: data.CulpritParticipant?.label,
          },
          damageParticipant: {
            value: data.DamageParticipant.id,
            label: data.DamageParticipant?.label,
          },
        }

        setFormData(form)
        setValue('culpritParticipant', form.culpritParticipant)
        setValue('damageParticipant', form.damageParticipant)
      }
    }
  }, [accidentDocumentDataEdit])

  useEffect(() => {
    getParticipantData()
    getAccidentDocumentData()
  }, [])

  const getAccidentDocumentData = async (options = {}) => {
    try {
      options.accidentCaseId = accidentCaseId
      const response = await getDocument(options)
      setAccidentDocumentDataEdit(response?.data?.rows)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed
        </Notification>,
      )
    }
    setLoading(false)
  }


  const getParticipantData = async (values = {}) => {
    try {
      values.accidentCaseId = accidentCaseId
      const response = await getAllParticipants(values)
      const data = _.map(response.data.rows, (row) => ({
        value: row.id,
        label: row.label,
      }))
      setAllParticipants(data)
    } catch (error) {
      console.error('API call error:', error)
    }
  }


  const onSubmit = async () => {
    setLoading(true)
    let data = _.cloneDeep(formData)
    data.accidentCaseId = accidentCaseId
    data.culpritParticipant = data.culpritParticipant.value
    data.damageParticipant = data.damageParticipant.value
    data = _.pickBy(data, _.identity)
    try {
      const save = data?.id ? updateAccidentDocument : saveAccidentDocument
      const response = await save(data, data?.id)
      setFormData((prev) => ({
        ...prev,
        id: response.data?.id,
      }))

      toast.push(
        <Notification className="mb-4" type="success">
          Create Accident Document Successfully
        </Notification>,
      )
      setLoading(false)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed
        </Notification>,
      )
    }
  }

  const navigate = useNavigate()
  const redirectBack = () => {
    navigate(`/cases-list/accident-case-preview/${accidentCaseId}`)
  }
  return (
    <FormContainer className="px-8">
      <Steps current={currentStep - 1}>
        <div className="cursor-pointer" onClick={() => handleStepTitleClick(0)}>
        </div>
      </Steps>
      <>
        {currentStep === 1 && (
          <AccidentDocuments
            handleSubmit={handleSubmit(onSubmit)}
            control={control}
            reset={reset}
            loading={loading}
            redirectBack={redirectBack}
            formState={formState}
            t={t}
            setValue={setValue}
            insuranceCompanyList={insuranceCompanyList}
            allParticipants={allParticipants}
            setFormData={setFormData}
            formData={formData}
          />
        )}
      </>
      <div className="flex items-center justify-end dark:bg-gray-700 bg-white p-4 rounded-bl-lg rounded-br-lg">
        <Button
          icon={<RiSave2Line />}
          type="button"
          size="sm"
          className="w-50 mr-2"
          onClick={redirectBack}
        >
          {t('button.Back')}
        </Button>
        <Button
          icon={<RiSave2Line />}
          type="submit"
          variant="solid"
          size="sm"
          className="w-50 mr-2"
          loading={loading}
          onClick={handleSubmit(onSubmit)}
        >
          {loading
            ? t('button.Updating')
            : formData?.id
            ? t('button.Update')
            : t('button.Generate')}
        </Button>
      </div>
    </FormContainer>
  )
}

export default AccidentDocument
