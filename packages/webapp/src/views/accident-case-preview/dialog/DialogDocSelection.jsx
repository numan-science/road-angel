import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Card,
  toast,
  Notification,
  Upload,
  Button,
  FormContainer,
  Dialog,
  Checkbox,
  Select,
} from '@/components/ui'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { RiSave2Line } from 'react-icons/ri'
import { saveSelectType } from '@/services/submit-case'

const DialogDocSelection = (props) => {
  const {
    allParticipants,
    participantModalVisible,
    toggleDocumentModal,
    accidentCaseId,
    getParticipantData,
  } = props
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm()
  const { t } = useTranslation()
  const [selectedOptions, setSelectedOptions] = useState(null)

  const [errorMessages, setErrorMessages] = useState({})

  const handleOptionChange = (participantIndex, selectedValue) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [participantIndex]: selectedValue,
    }

    const selectedValues = Object.values(newSelectedOptions)
    if (new Set(selectedValues).size !== selectedValues.length) {
      setErrorMessages((prevState) => ({
        ...prevState,
        [participantIndex]: 'Choose a different option.',
      }))
      return
    }

    setErrorMessages((prevState) => ({
      ...prevState,
      [participantIndex]: '',
    }))

    setSelectedOptions(newSelectedOptions)
  }

  const onSubmit = async () => {
    const selectedParticipant = allParticipants.map((participant, index) => ({
      id: participant.id,
      participantType: selectedOptions[index],
    }))

    try {
      const response = await saveSelectType(selectedParticipant)
      toast.push(
        <Notification className="mb-4" type="success">
          Selected Successfully
        </Notification>,
      )

      setErrorMessages({})
      getParticipantData()
      toggleDocumentModal()
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Select Correctly
        </Notification>,
      )
    }
  }
  return (
    <Dialog
      isOpen={participantModalVisible}
      onClose={toggleDocumentModal}
      onRequestClose={toggleDocumentModal}
      shouldCloseOnOverlayClick={false}
      contentClassName="bg-[#F3F4F6] px-0 py-0"
      bodyOpenClassName="overflow-hidden"
      width={1020}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer className="p-8">
          <h3>{t('heading.Select Partipant')}</h3>
          <div className="max-h-[65vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {allParticipants.map((data, index) => {
              const options = Array.from(
                { length: allParticipants.length },
                (_, i) => String.fromCharCode(65 + i),
              )
              const types = options.map((option) => ({
                value: option,
                label: option,
              }))
              return (
                <Card
                  className="dark:bg-gray-700 bg-white mb-2 h-auto"
                  header={<h5>{data?.ownerName}</h5>}
                  key={data?.AccidentCase?.id}
                >
                  <Select
                    isClearable
                    placeholder="Select an option"
                    options={types}
                    defaultValue={_.find(
                      types,
                      (opt) => opt.value === data.participantType,
                    )}
                    onChange={(selectedValue) => {
                      setErrorMessages((prevState) => ({
                        ...prevState,
                        [index]: '',
                      }))
                      handleOptionChange(
                        index,
                        selectedValue ? selectedValue.value : null,
                      )
                    }}
                    className={errorMessages[index] ? 'border-red-500' : ''}
                  />
                  {errorMessages[index] && (
                    <p className="text-red-500 mt-1">{errorMessages[index]}</p>
                  )}
                </Card>
              )
            })}
          </div>
        </FormContainer>
        <div className="flex items-center justify-end dark:bg-gray-700 bg-white p-4 rounded-bl-lg rounded-br-lg">
          <Button
            type="button"
            size="sm"
            className="w-50 mr-2"
            onClick={toggleDocumentModal}
          >
            {t('button.Cancel')}
          </Button>
          <Button
            icon={<RiSave2Line />}
            type="submit"
            variant="solid"
            size="sm"
            className="w-50"
          >
            {t('button.Save')}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

export default DialogDocSelection
