import React from 'react'
import { useForm } from 'react-hook-form'
import { Card, Button, FormContainer, Dialog, Checkbox } from '@/components/ui'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { S3_URL } from '@/constants/api.constant'

const ReportDialog = (props) => {
  // const {
  //     register,
  //     formState: { errors },
  //   } = useForm()
  const {
    participantModalData,
    participantModalVisible,
    toggleDocumentModal,
  } = props

  const idCardAttachments = []
  const drivingLicenseAttachments = []
  const passportAttachments = []

  if (participantModalData && participantModalData.driverAttachments) {
    participantModalData.driverAttachments.forEach((attachment) => {
      if (attachment.fileType === 'nationalIdCard') {
        idCardAttachments.push(attachment)
      } else if (attachment.fileType === 'drivingLicense') {
        drivingLicenseAttachments.push(attachment)
      } else if (attachment.fileType === 'passport') {
        passportAttachments.push(attachment)
      }
    })
  } else {
    return null
  }

  const { t } = useTranslation()
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
      <form>
        <FormContainer className="p-8">
          <div className="max-h-[70vh] overflow-y-auto">
            <Card
              className="dark:bg-gray-700 bg-white mb-2"
              header={<h5>{t('heading.Participant All Details')}</h5>}
              //   key={participantModalData.AccidentCase?.id}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Card
                  className="dark:bg-gray-700 bg-white mb-2"
                  header={<h6>{t('heading.Owner')}</h6>}
                >
                  <p>
                    <b>{t('label.If The Car Is Own By')}</b>:{' '}
                    {participantModalData?.carOwnBy}
                  </p>
                  {participantModalData?.carOwnBy === 'individual' && (
                    <>
                      <p>
                        <b>{t('label.Owner Name')}</b>:{' '}
                        {participantModalData?.ownerName}
                      </p>
                      <p>
                        <b>{t('label.Owner Address')}</b>:{' '}
                        {participantModalData?.ownerAddress}
                      </p>
                      <p>
                        <b>{t('label.Owner Birth Number')}</b>:{' '}
                        {participantModalData?.ownerBirthNumber}
                      </p>
                    </>
                  )}
                  {participantModalData?.carOwnBy === 'company' && (
                    <>
                      <p>
                        <b>{t('label.Company Registration Number')}</b>:{' '}
                        {participantModalData?.companyRegistrationNumber}
                      </p>
                      <p>
                        <b>{t('label.Company Email')}</b>:{' '}
                        {participantModalData?.companyEmail}
                      </p>
                      <p>
                        <b>{t('label.Company Vat Payer')}</b>:
                        {participantModalData?.companyVatPayer ? 'Yes' : 'No'}
                      </p>
                    </>
                  )}

                  <p>
                    <b>{t('label.For Leasing')}</b>:
                    {participantModalData?.forLeasing ? 'Yes' : 'No'}
                  </p>
                  {participantModalData?.forLeasing === true && (
                    <p>
                      <b>{t('label.Leasing Insurance Company')}</b>:
                      {participantModalData?.leasingInsuranceCompanyId}
                    </p>
                  )}

                  <p>
                    <b>{t('label.Liability Insurance')}</b>:
                    {participantModalData?.liabilityInsurance ? 'Yes' : 'No'}
                  </p>
                  {participantModalData?.liabilityInsurance === true && (
                    <>
                      {participantModalData?.liabilityInsuranceCompanyId !==
                        null && (
                        <p>
                          <b>{t('label.Liability Insurance Company')}</b>:
                          {participantModalData?.liabilityInsuranceCompanyId}
                        </p>
                      )}
                      {participantModalData?.liabilityInsuranceCompanyId ===
                        null && (
                        <p>
                          <b>{t('label.Other Liability Insurance Company')}</b>:
                          {
                            participantModalData?.otherLiabilityInsuranceCompanyName
                          }
                        </p>
                      )}
                    </>
                  )}

                  <p>
                    <b>{t('label.Is Damage Insurance')}</b>:
                    {participantModalData?.isDamageInsurance ? 'Yes' : 'No'}
                  </p>
                  {participantModalData?.isDamageInsurance === true && (
                    <>
                      {participantModalData?.damageInsuranceCompanyId !==
                        null && (
                        <p>
                          <b>{t('label.Damage Insurance Company')}</b>:
                          {participantModalData?.damageInsuranceCompanyId}
                        </p>
                      )}
                      {participantModalData?.damageInsuranceCompanyId ===
                        null && (
                        <p>
                          <b>{t('label.Other Damage Insurance Company')}</b>:
                          {
                            participantModalData?.otherDamageInsuranceCompanyName
                          }
                        </p>
                      )}
                    </>
                  )}
                  <p>
                    <b>{t('label.Policy Number')}</b>:{' '}
                    {participantModalData?.thirdPartyPolicyNumber}
                  </p>
                  <p>
                    <b>{t('label.Green Card')}</b>:{' '}
                    {participantModalData?.thirdPartyGreenCard}
                  </p>
                  {/* <p>
                        <b>{t('label.Aka Insurance Company')}</b>:{' '}
                        {participantModalData?.InsuranceCompany.name}
                      </p> */}
                </Card>
                <Card
                  className="dark:bg-gray-700 bg-white mb-2"
                  header={<h6>{t('heading.Vehicle')}</h6>}
                >
                  <p>
                    <b>{t('label.Vehicle License Plate')}</b>:{' '}
                    {participantModalData?.vehicleLicensePlate}
                  </p>
                  <p>
                    <b>{t('label.Vehicle Modal')}</b>:{' '}
                    {participantModalData?.vehicleModel}
                  </p>
                  <p>
                    <b>{t('label.Vin Number')}</b>:{' '}
                    {participantModalData?.vinNumber}
                  </p>
                  <p>
                    <b>{t('label.Year Of Manufacture')}</b>:{' '}
                    {participantModalData?.yearOfManufacture}
                  </p>

                  <p>
                    <b>{t('label.Visible Damage')}</b>:
                    {Array.isArray(participantModalData?.visibleDamage) ? (
                      participantModalData.visibleDamage.map((row, i) => (
                        <div key={`id${i}`}>
                          <Checkbox id={`id${i}`} className="mb-0" checked />
                          <span>{row}</span>
                          <br />
                        </div>
                      ))
                    ) : (
                      <div>No visible damage data available</div>
                    )}
                  </p>
                </Card>

                <Card
                  className="dark:bg-gray-700 bg-white mb-2"
                  header={<h6>{t('heading.Driver')}</h6>}
                >
                  <p>
                    <b>{t('label.Name')}</b>: {participantModalData?.driverName}
                  </p>
                  <p>
                    <b>{t('label.Surname')}</b>:{' '}
                    {participantModalData?.driverSurname}
                  </p>
                  <p>
                    <b>{t('label.Address')}</b>:{' '}
                    {participantModalData?.driverAddress}
                  </p>
                  <p>
                    <b>{t('label.Driving License Number')}</b>:{' '}
                    {participantModalData?.driverLicenseNumber}
                  </p>
                  <p>
                    <b>{t('label.Groups')}</b>:{' '}
                    {participantModalData?.driverGroups}
                  </p>
                  <p>
                    <b>{t('label.Issued By')}</b>:{' '}
                    {participantModalData?.driverIssuedBy}
                  </p>
                  <p>
                    <b>{t('label.Valid From')}</b>:{' '}
                    {participantModalData?.driverValidFrom}
                  </p>
                  <p>
                    <b>{t('label.Valid To')}</b>:{' '}
                    {participantModalData?.driverValidTo}
                  </p>
                </Card>
                <Card
                  className="dark:bg-gray-700 bg-white mb-2"
                  header={<h6>{t('label.Attachments Type')}</h6>}
                >
                  {idCardAttachments.length > 0 && (
                    <div>
                      <h6>{t('heading.Id Card Attachments')}</h6>
                      <ul className="mt-4">
                        {idCardAttachments.map((attachment, index) => (
                          <li
                            key={index}
                            className="bg-gray-100 p-4 rounded-md mb-2"
                          >
                            <div className="flex items-center">
                              <img
                                src={`${S3_URL}/${attachment.url.data.name}`}
                                alt="Unknown Document"
                                className="w-20 h-20"
                              />
                              <p className="text-xs ml-2">{attachment.name}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {drivingLicenseAttachments.length > 0 && (
                    <div>
                      <h6>{t('heading.Driving License Attachments')}</h6>
                      <ul className="mt-4">
                        {drivingLicenseAttachments.map((attachment, index) => (
                          <li
                            key={index}
                            className="bg-gray-100 p-4 rounded-md mb-2"
                          >
                            <div className="flex items-center">
                              <img
                                src={`${S3_URL}/${attachment.url.data.name}`}
                                alt="Unknown Document"
                                className="w-20 h-20"
                              />
                              <p className="text-xs ml-2">{attachment.name}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {passportAttachments.length > 0 && (
                    <div>
                      <h6>{t('heading.Passport Attachments')}</h6>
                      <ul className="mt-4">
                        {passportAttachments.map((attachment, index) => (
                          <li
                            key={index}
                            className="bg-gray-100 p-4 rounded-md mb-2"
                          >
                            <div className="flex items-center">
                              <img
                                src={`${S3_URL}/${attachment.url.data.name}`}
                                alt="Unknown Document"
                                className="w-20 h-20"
                              />
                              <p className="text-xs ml-2">{attachment.name}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
                <Card
                  className="dark:bg-gray-700 bg-white mb-2"
                  header={<h6>{t('heading.Initial Impact')}</h6>}
                >
                  <img src={participantModalData?.initialImpact} alt="image" />
                </Card>

                <Card
                  className="dark:bg-gray-700 bg-white mb-2"
                  header={<h5>{t('heading.Remarks')}</h5>}
                >
                  <p>
                    <b>{t('heading.Remarks')}</b>:{' '}
                    {participantModalData?.remarks}
                  </p>
                </Card>
                <Card
                  className="dark:bg-gray-700 bg-white mb-2"
                  header={<h6>{t('heading.Accident Caused By')}</h6>}
                >
                  <p>
                    <b>{t('label.Cause By Vehicle Driver A')}</b>:{' '}
                    {participantModalData?.accidentCausedByDriverA
                      ? 'Yes'
                      : 'No'}
                  </p>
                  <p>
                    <b>{t('label.Cause By Vehicle Driver B')}</b>:{' '}
                    {participantModalData?.accidentCausedByDriverB
                      ? 'Yes'
                      : 'No'}
                  </p>
                  <p>
                    <b>{t('label.Cause By Common Fault')}</b>:{' '}
                    {participantModalData?.accidentCausedByCommonFault
                      ? 'Yes'
                      : 'No'}
                  </p>
                  <br />
                  <p>
                    <b>{t('label.Cause By Other')}</b>
                  </p>
                  <p>
                    <b>{t('label.Other Name')}</b>:{' '}
                    {participantModalData?.accidentCausedByOtherName}
                  </p>
                  <p>
                    <b>{t('label.Other Address')}</b>:{' '}
                    {participantModalData?.accidentCausedByOtherAddress}
                  </p>
                </Card>
                <Card
                  className="dark:bg-gray-700 bg-white mb-2"
                  header={<h6>{t('heading.Accident Scenarios')}</h6>}
                >
                  <div>
                    {participantModalData.selectMultipleOptionsToExplainScenario.map(
                      (row, i) => (
                        <div>
                          <Checkbox
                            id={`id${i}`}
                            className="mb-0"
                            checked
                            // disabled
                          />
                          <span>{row}</span>
                          <br />
                        </div>
                      ),
                    )}
                  </div>
                </Card>
              </div>
            </Card>
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
        </div>
      </form>
    </Dialog>
  )
}

export default ReportDialog
