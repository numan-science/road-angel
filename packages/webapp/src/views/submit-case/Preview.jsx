import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Container } from '@/components/shared'
import { Card, Button } from '@/components/ui'
import DialogDoc from './dialog/DialogDoc'

const Preview = (props) => {
  const {
    data = [],
    accidentCaseId,
    accidentForm,
    accidentCaseScenario,
  } = props

  const [allParticipants, setAllParticipants] = useState([])
  const { t } = useTranslation()
  const [participantModalId, setParticipantModalId] = useState(null)
  const [participantModalVisible, setParticipantModalVisible] = useState(false)

  const toggleDocumentModal = (participantId) => {
    setParticipantModalVisible(!participantModalVisible)
    setParticipantModalId(participantId)
  }
  return (
    <div>
      <Container>
        <div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
          <Card>
            <h2 className="text-xl font-bold mb-4">
              {t('heading.Accident Case Info')}
            </h2>
            <p>
              <b>{t('label.Date Of Accident')}</b>:{' '}
              {accidentForm?.dateOfAccident}
            </p>
            <p>
              <b>{t('label.Accident Address')}</b>:{' '}
              {accidentForm?.accidentAddress}
            </p>
            <p>
              <b>{t('label.Country')}</b>: {accidentForm?.country}
            </p>
            <p>
              <b>{t('label.City')}</b>: {accidentForm?.city}
            </p>
            <p>
              <b>{t('label.Injuries')}</b>:{' '}
              {accidentForm?.injuries ? 'Yes' : 'No'}
            </p>
            <p>
              <b>{t('label.investigation By Police')}</b>:{' '}
              {accidentForm?.investigationByPolice ? 'Yes' : 'No'}
            </p>
            {accidentForm?.investigationByPolice === true && (
              <p>
                <b>{t('label.Police Department')}</b>:{' '}
                {accidentForm?.policeDepartment}
              </p>
            )}
            <p>
              <b>{t('label.otherCarDamage')}</b>:{' '}
              {accidentForm?.otherCarDamage ? 'Yes' : 'No'}
            </p>
            <p>
              <b>{t('label.witness')}</b>: {accidentForm?.witness}
            </p>
            <h2 className="text-xl font-bold mb-4 mt-4">
              {t('heading.Participant Form Overview')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {allParticipants.map((data) => {
                if (data?.AccidentCase?.id === accidentCaseId) {
                  return (
                    <Card
                      className="dark:bg-gray-700 bg-white mb-2"
                      header={<h5>{data?.ownerName}</h5>}
                      key={data?.AccidentCase?.id}
                    >
                      <p>
                        <b>{t('label.Address')}</b>: {data?.ownerAddress}
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
                        <b>{t('label.Vehicle Registration Number')}</b>:{' '}
                        {data?.vehicleRegistrationNumber}
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
                    </Card>
                  )
                } else {
                  return null
                }
              })}
            </div>
              <>
                {' '}
              {accidentCaseScenario?.data?.filePath && (<>
                <h2 className="text-xl font-bold mb-4 mt-4">
              {t('heading.Accident Case Scenario')}
            </h2>
            <Card>
              <img
                src={accidentCaseScenario?.data?.filePath}
                alt="image"
                className="border-2 bg-gray-100"
              />
            </Card></>)
            }  
              </>
          </Card>
        </div>
      </Container>
      <DialogDoc
        participantModalId={participantModalId}
        participantModalVisible={participantModalVisible}
        toggleDocumentModal={toggleDocumentModal}
        data={data}
        // setCompanyDocumentId={setCompanyDocumentId}
        setAllParticipants={setAllParticipants}
        allParticipants={allParticipants}
        accidentCaseId={accidentCaseId}
      />
    </div>
  )
}

export default Preview
