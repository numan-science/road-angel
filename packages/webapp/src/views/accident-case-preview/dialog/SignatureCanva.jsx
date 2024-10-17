import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import {
  Card,
  Button,
  FormContainer,
  Dialog,
  toast,
  Notification,
} from '@/components/ui'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
// import { updateBusinessCase, saveBusinessCase} from '@/services/business-case'
import { saveAccidentDocument, updateAccidentDocument } from '@/services/submit-case'

const SignatureCanva = (props) => {
  const { signModalVisible, signCaseModal, matchedAccidentDocument, accidentCaseId,participantIds, getDocumentData } = props
  const [formData, setFormData] = useState({})
  const [url, setUrl] = useState(null)

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm()

  const { t } = useTranslation()
  const watcher = useWatch({ control })

  const canvasRef = useRef(null)
  let context = null
  let isMouseDown = false

  const handleMouseDown = (event) => {
    isMouseDown = true
    const canvas = canvasRef.current
    context = canvas.getContext('2d')
    context.beginPath()
    context.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
  }

  const handleMouseMove = (event) => {
    if (isMouseDown) {
      const canvas = canvasRef.current
      context = canvas.getContext('2d')
      context.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY)
      context.stroke()
    }
  }

  const handleMouseUp = () => {
    isMouseDown = false
  }

  const clearSignature = (event) => {
    event.preventDefault()
    const canvas = canvasRef.current
    context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    const dataURL = canvas.toDataURL()
    return dataURL
  }
  useEffect(() => {

      if (matchedAccidentDocument?.id) {
        const form = {
          id: matchedAccidentDocument.id,
          CulpritParticipant: {
            value: matchedAccidentDocument.CulpritParticipant,
            label: matchedAccidentDocument.CulpritParticipant?.ownerName,
          },
          DamageParticipant: {
            value: matchedAccidentDocument.DamageParticipant,
            label: matchedAccidentDocument.DamageParticipant?.ownerName,
          },
          culpritParticipantSign: matchedAccidentDocument.culpritParticipantSign,
          damageParticipantSign: matchedAccidentDocument.damageParticipantSign,
        }
        setFormData(form)
       
      }
    
  }, [matchedAccidentDocument])

  const onSubmit = async () => {
    const urlCanvas = saveSignature()
    let data = _.cloneDeep(formData)
    if (participantIds === data.CulpritParticipant.value.id) {
      data.culpritParticipantSign = urlCanvas;
    } else if (participantIds === data.DamageParticipant.value.id) {
      data.damageParticipantSign = urlCanvas;
    }
    data = _.pickBy(data, _.identity)
    try {
      const save = data?.id ? updateAccidentDocument : saveAccidentDocument
      const response = await save(data, data?.id)
      toast.push(
        <Notification className="mb-4" type="success">
          Saved
        </Notification>,
      )
      signCaseModal(); 
      getDocumentData();
    }
    catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed
        </Notification>,
      )
    }
  }
  return (
    <Dialog
      isOpen={signModalVisible}
      onClose={signCaseModal}
      onRequestClose={signCaseModal}
      shouldCloseOnOverlayClick={false}
      contentClassName="bg-[#F3F4F6] px-0 py-0"
      bodyOpenClassName="overflow-hidden"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer className="p-8">
          <div className="max-h-[75vh] overflow-y-auto">
            <div>
              <h3>{t('heading.Participant Signature')}</h3>
              <br />
              <Card className='bg-gray-200 flex justify-center items-center'>
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className='bg-white'
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              />
              </Card>
              
            </div>
            <div></div>
          </div>
        </FormContainer>
        <div className="flex items-center justify-end dark:bg-gray-700 bg-white p-4 rounded-bl-lg rounded-br-lg">
        <Button
            type="button"
            size="sm"
            className="w-50 mr-2"
            onClick={signCaseModal}
          >
            {t('button.Cancel')}
          </Button>
          <Button
            type="button"
            size="sm"
            className="w-50 mr-2 mt-2"
            onClick={clearSignature}
          >
            {t('button.Clear Sign')}
          </Button>
         
          <Button
            type="submit"
            variant="solid"
            size="sm"
            className="w-50 mr-2 mt-2"
          >
            {matchedAccidentDocument ? t('button.Update') : t('button.save')}
          </Button>
         
        </div>
      </form>
    </Dialog>
  )
}

export default SignatureCanva
