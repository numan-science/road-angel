

import { Container } from '@/components/shared'
import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import ParticipantsForm from './ParticipantsForm'
import { Button } from '@/components/ui'
import AccidentScenario from './AccidentScenario'
import Preview from './Preview'
import {useParams } from 'react-router-dom'


const Submit = () => {
  const { t } = useTranslation()
  const [accidentForm, setAccidentForm] = useState([])
  const [accidentCaseScenario, setAccidentCaseScenario ] = useState([])
  const [showAccidentScenario, setShowAccidentScenario] = useState(false)
  const [showParticipantsForm, setShowParticipantsForm] = useState(true)
  const [disableCard, setdisableCard] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [showBack, setShowBack] = useState(false)
  const [accidentCaseId, setAccidentCaseId] = useState(null);
  const [participantId, setParticipantId] = useState(null);
  const params = useParams()
  const participantEditId = params?.participantId
  const accidentEditId = params?.accidentCaseId
  const accidentCaseEditId = params?.accidentCaseId
  const handleClickAccidentScenario = () => {
    setShowBack(true)
    setShowAccidentScenario(true)
    setShowParticipantsForm(false)
    setShowPreview(false)
  }

  const handleClickParticipantsForm = () => {
    setShowBack(true)
    setAccidentCaseId(accidentCaseId);
    setShowParticipantsForm(true)
    setShowAccidentScenario(false)
    setShowPreview(false)
    setdisableCard(false)
  }
  const handleClickPreview = () => {
    setShowBack(false)
    setShowParticipantsForm(false)
    setShowAccidentScenario(false)
    setShowPreview(true)
  }

  const handleSave = () => {
    setShowParticipantsForm(false)
    setShowPreview(true)
  }
  
 
  return (
    <>
      <Container>
        <div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center">
            <h3>{t('heading.Submit Case')}</h3>
           <div className="flex flex-wrap items-center gap-2">
           {showBack && (
            <Button
            type="button"
            variant="solid"
            size="sm"
            className="w-50 mr-2"
            onClick={handleClickPreview}
          >
            {t('button.Back')}
          </Button>
           )} 
              {!showAccidentScenario && !showParticipantsForm && (
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
             
            </div>
          </div>
        </div>
        <div>
          {showAccidentScenario && !showParticipantsForm && !showPreview && (
            <AccidentScenario accidentCaseId={accidentCaseId} setAccidentCaseScenario={setAccidentCaseScenario} />
          )}
          {showParticipantsForm && !showAccidentScenario && !showPreview && (
            <ParticipantsForm
              handleSave={handleSave}
              setPreview={handleClickPreview}
              setAccidentCaseId={setAccidentCaseId}
              setParticipantId={setParticipantId}
              accidentCaseId={accidentCaseId}
              disableCard={disableCard}
              setAccidentForm={setAccidentForm} 
              participantEditId={participantEditId}
              accidentEditId={accidentEditId}
              accidentCaseEditId={accidentCaseEditId}
            />
          )}
          {showPreview && !showParticipantsForm && !showAccidentScenario && (
            <Preview accidentCaseId={accidentCaseId} participantId={participantId} accidentForm={accidentForm} accidentCaseScenario={accidentCaseScenario} />
          )}
        </div>
      </Container>
    </>
  )
}

export default Submit
