import React, { useState, useEffect } from 'react'
import { RiSave2Line } from 'react-icons/ri'
import { useForm } from 'react-hook-form'
import { S3_URL } from '@/constants/api.constant'
import {
  Card,
  toast,
  Notification,
  Upload,
  Button,
  FormContainer,
  Dialog,
  Checkbox,
} from '@/components/ui'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { getAllParticipants } from '@/services/submit-case'
import { HiOutlineEye, HiOutlineTrash } from 'react-icons/hi'

const DialogDoc = (props) => {
  const {
    allParticipants,
    participantModalId,
    companyDocumentId,
    participantModalVisible,
    toggleDocumentModal,
    multipleAttachments,
    setAllParticipants,
    isEdit,
    data,
    accidentCaseId,
  } = props
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm()
  const [companyId, setCompanyId] = useState(null)
  // const [allParticipantsData, setAllParticipantsData] = useState([])
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    getParticipantData()
  }, [])

  const getParticipantData = async (options = {}) => {
    setLoading(true)
    try {
      options.accidentCaseId = accidentCaseId
      const response = await getAllParticipants(options)
      setAllParticipants(response.data?.rows)
      // setAllParticipantsData(response.data?.rows)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed
        </Notification>,
      )
    }
    setLoading(false)
  }

  const filteredData = allParticipants.filter(
    (data) => data?.id === props.participantModalId,
  )
  const idCardAttachments = []
  const drivingLicenseAttachments = []
  const passportAttachments = []

  // Categorize attachments based on fileType
  allParticipants
  .filter((data) => data?.id === props.participantModalId)
  .map((data) => {
    // Iterate over driverAttachments and assign them to respective arrays
    data?.driverAttachments.forEach((attachment) => {
      if (attachment.fileType === 'nationalIdCard') {
        idCardAttachments.push(attachment);
      } else if (attachment.fileType === 'drivingLicense') {
        drivingLicenseAttachments.push(attachment);
      } else if (attachment.fileType === 'passport') {
        passportAttachments.push(attachment);
      }
    });
    
    return null; // Return null in the map function as it doesn't generate JSX
  });

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
            {allParticipants
              .filter((data) => data?.id === props.participantModalId)
              .map((data) => (
                <Card
                  className="dark:bg-gray-700 bg-white mb-2"
                  header={<h5>{t('heading.Participants All Details')}</h5>}
                  key={data.AccidentCase?.id}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <Card
                      className="dark:bg-gray-700 bg-white mb-2"
                      header={<h6>{t('heading.Owner')}</h6>}
                    >
                      <p>
                        <b>{t('label.If The Car Is Own By')}</b>:{' '}
                        {data?.carOwnBy}
                      </p>
                      {data?.carOwnBy === 'individual' && (
                        <>
                          <p>
                            <b>{t('label.Owner Name')}</b>: {data?.ownerName}
                          </p>
                          <p>
                            <b>{t('label.Owner Address')}</b>:{' '}
                            {data?.ownerAddress}
                          </p>
                          <p>
                            <b>{t('label.Owner Birth Number')}</b>:{' '}
                            {data?.ownerBirthNumber}
                          </p>
                        </>
                      )}
                      {data?.carOwnBy === 'company' && (
                        <>
                          <p>
                            <b>{t('label.Company Registration Number')}</b>:{' '}
                            {data?.companyRegistrationNumber}
                          </p>
                          <p>
                            <b>{t('label.Company Email')}</b>:{' '}
                            {data?.companyEmail}
                          </p>
                          <p>
                            <b>{t('label.Company Vat Payer')}</b>:
                            {data?.companyVatPayer ? 'Yes' : 'No'}
                          </p>
                        </>
                      )}

                      <p>
                        <b>{t('label.For Leasing')}</b>:
                        {data?.forLeasing ? 'Yes' : 'No'}
                      </p>
                      {data?.forLeasing === true && (  
                      <p>
                        <b>{t('label.Leasing Insurance Company')}</b>:
                        {data?.leasingInsuranceCompanyId}
                      </p> 
                      ) }
                    
                      <p>
                        <b>{t('label.Liability Insurance')}</b>:
                        {data?.liabilityInsurance ? 'Yes' : 'No'}
                      </p>
                      {data?.liabilityInsurance === true && (<>
                        {data?.liabilityInsuranceCompanyId !== null && (  <p>
                        <b>{t('label.Liability Insurance Company')}</b>:
                        {data?.liabilityInsuranceCompanyId}
                      </p>
                        )}
                      {data?.liabilityInsuranceCompanyId === null && (
                      <p>
                        <b>{t('label.Other Liability Insurance Company')}</b>:
                        {data?.otherLiabilityInsuranceCompanyName}
                      </p>
                      )}
                      </>)}
                     
                      <p>
                        <b>{t('label.Is Damage Insurance')}</b>:
                        {data?.isDamageInsurance ? 'Yes' : 'No'}
                      </p>
                      {data?.isDamageInsurance === true && (<>
                        {data?.damageInsuranceCompanyId !== null && (  
                          <p>
                          <b>{t('label.Damage Insurance Company')}</b>:
                          {data?.damageInsuranceCompanyId}
                        </p>
                        )}
                      {data?.damageInsuranceCompanyId === null && (
                      <p>
                      <b>{t('label.Other Damage Insurance Company')}</b>:
                      {data?.otherDamageInsuranceCompanyName}
                    </p>
                      )}
                      </>)}
                      <p>
                        <b>{t('label.Policy Number')}</b>:{' '}
                        {data?.thirdPartyPolicyNumber}
                      </p>
                      <p>
                        <b>{t('label.Green Card')}</b>:{' '}
                        {data?.thirdPartyGreenCard}
                      </p>
                      <p>
                        <b>{t('label.Aka Insurance Company')}</b>:{' '}
                        {data?.InsuranceCompany?.name}
                      </p>
                    </Card>
                    <Card
                      className="dark:bg-gray-700 bg-white mb-2"
                      header={<h6>{t('heading.Vehicle')}</h6>}
                    >
                      <p>
                        <b>{t('label.Vehicle License Plate')}</b>:{' '}
                        {data?.vehicleLicensePlate}
                      </p>
                      <p>
                        <b>{t('label.Vehicle Modal')}</b>: {data?.vehicleModel}
                      </p>
                      <p>
                        <b>{t('label.Vin Number')}</b>: {data?.vinNumber}
                      </p>
                      <p>
                        <b>{t('label.Year Of Manufacture')}</b>:{' '}
                        {data?.yearOfManufacture}
                      </p>
                      <p>
                        <b>{t('label.Visible Damage')}</b>:
                        {filteredData.map((item) =>
                          item.visibleDamage.map((row, i) => (
                            <div>
                              <Checkbox
                                {...register(`id${i}`, {
                                  value: true,
                                })}
                                id={`id${i}`}
                                className="mb-0"
                                checked
                                // disabled
                              />
                              <span>{row}</span>
                              <br />
                            </div>
                          )),
                        )}
                      </p>
                    </Card>
                    {/* <Card
                      className="dark:bg-gray-700 bg-white mb-2"
                      header={
                        <h6>{t('heading.Third Party Liability Insurer')}</h6>
                      }
                    >
                      <p>
                        <b>{t('label.Address')}</b>: {data?.thirdPartyAddress}
                      </p>
                      <p>
                        <b>{t('label.Policy Number')}</b>:{' '}
                        {data?.thirdPartyPolicyNumber}
                      </p>
                      <p>
                        <b>{t('label.Green Card')}</b>:{' '}
                        {data?.thirdPartyGreenCard}
                      </p>
                      <p>
                        <b>{t('label.Valid Until')}</b>:{' '}
                        {data?.greenCardValidUntil}
                      </p>
                      <p>
                        <b>{t('label.Insurance Company')}</b>:{' '}
                        {data?.InsuranceCompany.name}
                      </p>
                    </Card> */}
                    <Card
                      className="dark:bg-gray-700 bg-white mb-2"
                      header={<h6>{t('heading.Driver')}</h6>}
                    >
                      <p>
                        <b>{t('label.Name')}</b>: {data?.driverName}
                      </p>
                      <p>
                        <b>{t('label.Surname')}</b>: {data?.driverSurname}
                      </p>
                      <p>
                        <b>{t('label.Address')}</b>: {data?.driverAddress}
                      </p>
                      <p>
                        <b>{t('label.Driving License Number')}</b>:{' '}
                        {data?.driverLicenseNumber}
                      </p>
                      <p>
                        <b>{t('label.Groups')}</b>: {data?.driverGroups}
                      </p>
                      <p>
                        <b>{t('label.Issued By')}</b>: {data?.driverIssuedBy}
                      </p>
                      <p>
                        <b>{t('label.Valid From')}</b>: {data?.driverValidFrom}
                      </p>
                      <p>
                        <b>{t('label.Valid To')}</b>: {data?.driverValidTo}
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
                                    src={`${S3_URL}/${attachment.url.data?.name}`}
                                    alt="Unknown Document"
                                    className="w-20 h-20"
                                  />
                                  <p className="text-xs ml-2">
                                    {attachment?.name}
                                  </p>
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
                            {drivingLicenseAttachments.map(
                              (attachment, index) => (
                                <li
                                  key={index}
                                  className="bg-gray-100 p-4 rounded-md mb-2"
                                >
                                  <div className="flex items-center">
                                    <img
                                      src={`${S3_URL}/${attachment.url.data?.name}`}
                                      alt="Unknown Document"
                                      className="w-20 h-20"
                                    />
                                    <p className="text-xs ml-2">
                                      {attachment?.name}
                                    </p>
                                  </div>
                                </li>
                              ),
                            )}
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
                                    src={`${S3_URL}/${attachment.url.data?.name}`}
                                    alt="Unknown Document"
                                    className="w-20 h-20"
                                  />
                                  <p className="text-xs ml-2">
                                    {attachment?.name}
                                  </p>
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
                      <img src={data?.initialImpact} alt="image" />
                    </Card>

                    <Card
                      className="dark:bg-gray-700 bg-white mb-2"
                      header={<h5>{t('heading.Remarks')}</h5>}
                    >
                      <p>
                        <b>{t('heading.Remarks')}</b>: {data?.remarks}
                      </p>
                    </Card>
                    <Card
                      className="dark:bg-gray-700 bg-white mb-2"
                      header={<h6>{t('heading.Accident Caused By')}</h6>}
                    >
                      <p>
                        <b>{t('label.Cause By Vehicle Driver A')}</b>:{' '}
                        {data?.accidentCausedByDriverA ? 'Yes' : 'No'}
                      </p>
                      <p>
                        <b>{t('label.Cause By Vehicle Driver B')}</b>:{' '}
                        {data?.accidentCausedByDriverB ? 'Yes' : 'No'}
                      </p>
                      <p>
                        <b>{t('label.Cause By Common Fault')}</b>:{' '}
                        {data?.accidentCausedByCommonFault ? 'Yes' : 'No'}
                      </p>
                      <br />
                      <p>
                        <b>{t('label.Cause By Other')}</b>
                      </p>
                      <p>
                        <b>{t('label.Other Name')}</b>:{' '}
                        {data?.accidentCausedByOtherName}
                      </p>
                      <p>
                        <b>{t('label.Other Address')}</b>:{' '}
                        {data?.accidentCausedByOtherAddress}
                      </p>
                    </Card>
                    <Card
                      className="dark:bg-gray-700 bg-white mb-2"
                      header={<h6>{t('heading.Accident Scenarios')}</h6>}
                    >
                      <div>
                        {filteredData.map((item) =>
                          item.selectMultipleOptionsToExplainScenario.map(
                            (row, i) => (
                              <div>
                                <Checkbox
                                  {...register(`id${i}`, {
                                    value: true,
                                  })}
                                  id={`id${i}`}
                                  className="mb-0"
                                  checked
                                  // disabled
                                />
                                <span>{row}</span>
                                <br />
                              </div>
                            ),
                          ),
                        )}
                      </div>
                    </Card>
                  </div>
                </Card>
              ))}
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

export default DialogDoc
