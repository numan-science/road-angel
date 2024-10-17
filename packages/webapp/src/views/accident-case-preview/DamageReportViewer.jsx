import React, { useState, useEffect } from 'react'
import {
  HiOutlinePencil,
  HiOutlineZoomIn,
  HiOutlineZoomOut,
} from 'react-icons/hi'
import { Document, Page, pdfjs } from 'react-pdf'
import { useParams } from 'react-router-dom'
import { PDFDocument } from 'pdf-lib'
import { ImSpinner9 } from 'react-icons/im'
import { Button, Avatar, Spinner } from '@/components/ui'
import { getAllParticipants } from '@/services/submit-case'
import SignatureParticipantCanva from './dialog/SignatureParticipantCanva'
import { useTranslation } from 'react-i18next'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const DamageReportViewer = () => {
  const { t } = useTranslation()
  const params = useParams()
  const accidentCaseId = params.accidentCaseId
  const participantId = params.participantId
  const [numPages, setNumPages] = useState(null)
  const [blobUrl, setBlobUrl] = useState(null)
  const [participantIds, setParticipantIds] = useState(null)
  const [signModalVisible, setSignModalVisible] = useState(false)
  const [allParticipantData, setAllParticipantData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [scale, setScale] = useState(1)

  const matchedParticipant = allParticipantData.find(
    (caseItem) => caseItem.id === participantId,
  )
  const row = matchedParticipant
  useEffect(() => {
    getParticipantData()
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
    // const visibleDamageNew = row.ParticipantA.visibleDamage
    // const visible = [...visibleDamageNew]

    const fieldsData = {
      Name_and_surname: row.ownerName,
      address: row.AccidentCase.accidentAddress,
      RC: row.partyEmail,
      ID_number: row.label,
      i_n: row.AccidentCase.dateOfAccident,
      d_n_a: row.AccidentCase.dateOfAccident,
      power_of_attorney: row.thirdPartyGreenCard,
      power_of_attorney_on: row.thirdPartyPolicyNumber,
      // Road_Angel: row.AccidentCase.dateOfAccident,
    }
    try {
      const formPdfBytes = await fetchData('/damagePdf1.pdf')
      const pdfDoc = await PDFDocument.load(formPdfBytes)
      const form = pdfDoc.getForm()
      const fieldNames = form.getFields().map((field) => field.getName())
      await form.getFields()
      for (const fieldName of Object.keys(fieldsData)) {
        const field = form.getTextField(fieldName)
        if (field) {
          field.setText(fieldsData[fieldName])
        }
      }

        if (row.signature) {
          const imageFieldSignA = form.getTextField('Road_Angel')

          const imageSignBytes = await fetch(
            row.signature,
          ).then((response) => response.arrayBuffer())
          const imageSign = await pdfDoc.embedPng(imageSignBytes)
          imageFieldSignA.setImage(imageSign)
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

  const getParticipantData = async (options = {}) => {
    try {
      options.accidentCaseId = accidentCaseId
      const response = await getAllParticipants(options)
      setAllParticipantData(response?.data?.rows)
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
            <div className="fixed bottom-[120px] right-[20px] z-10">
              <Button
                variant="solid"
                size="xs"
                icon={<HiOutlinePencil />}
                onClick={() => signCaseModal(matchedParticipant.participantA)}
              >
                {t('label.Participant Sign')}
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
      <SignatureParticipantCanva
        signModalVisible={signModalVisible}
        signCaseModal={signCaseModal}
        accidentCaseId={accidentCaseId}
        participantId={participantId}
        participantIds={participantIds}
        getParticipantData={getParticipantData}
      />
    </>
  )
}

export default DamageReportViewer
