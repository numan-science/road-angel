import React, { useState, useEffect } from 'react'
import { RiSave2Line } from 'react-icons/ri'
import { useForm } from 'react-hook-form'
import {
  Card,
  toast,
  Notification,
  Upload,
  Button,
  FormContainer,
  Dialog,
} from '@/components/ui'
import { HiOutlineTrash, HiOutlineEye } from 'react-icons/hi'
import { DoubleSidedImage } from '@/components/shared'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { uploadFile } from '@/services/uploads'
import { S3_URL } from '@/constants/api.constant'

import {
  saveInsuranceCompanyDocument,
  updateInsuranceCompanyDocument,
  getInsuranceCompanyDocument,
  deleteInsuranceCompanyDocument,
} from '@/services/Documents'

const DialogInvoice = (props) => {
  const {
    companyDocumentId,
    documentModalVisible,
    toggleDocumentModal,
    multipleAttachments,
    isEdit,
    data,
  } = props
  const {
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState([])
  const [attachments, setAttachments] = useState([])
  const [deleting, setDeleting] = useState(false)
  const [document, setDocument] = useState([])
  const [companyId, setCompanyId] = useState(null)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const beforeUpload = (file) => {
    let valid = true

    const allowedFileType = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    const maxFileSize = 500000

    for (let f of file) {
      if (!allowedFileType.includes(f.type)) {
        valid = 'Please upload a .jpeg or .png file!'
      }

      if (f.size >= maxFileSize) {
        valid = 'Upload image cannot more then 500kb!'
      }
    }

    return valid
  }

  const onSubmit = async () => {
    try {
      const payload = _.map(attachments, (row) => ({
        insuranceCompanyId: companyDocumentId,
        fileName: row.url.data.name,
      }))
      const save = data?.id
        ? updateInsuranceCompanyDocument
        : saveInsuranceCompanyDocument
      setLoading(true)
      const response = await save(payload, data?.id)
      // setDocument((prevDocument) => [...prevDocument, ...attachments]);
      setLoading(false)
      toast.push(
        <Notification className="mb-4" type="success">
          {response?.data.message}
        </Notification>,
      );
      // setAttachments([]);
    } catch (error) {
      setLoading(false)
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>,
      )
    }
  }
  useEffect(() => {
    getCompanyDocument()
  }, [])

  const getCompanyDocument = async (options = {}) => {
    setLoading(true)
    try {
      const response = await getInsuranceCompanyDocument(options)
      setDocument(response.data?.rows)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>,
      )
    }
    setLoading(false)
  }

  const handleDocumentDelete = async (id) => {
    try {
      setDeleting(true)
      const response = await deleteInsuranceCompanyDocument(id)
      setDocument((prevDocuments) =>
        prevDocuments.filter((doc) => doc.id !== id),
      )
      toast.push(
        <Notification className="mb-4" type="success">
          {response?.data?.message}
        </Notification>,
      )
      setConfirmVisible(false)
      setCompanyId(null)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>,
      )
    } finally {
      setDeleting(false)
      setCompanyId(null)
    }
  }

  const handleFileUpload = async (files) => {
    setFiles(files)
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        const url = await uploadFile(file)
        setAttachments((prevAttachments) => [
          ...prevAttachments,
          { name: file.name, url },
        ])
        toast.push(
          <Notification className="mb-4" type="success">
            Upload Successfully
          </Notification>,
        )
      } catch (error) {
        toast.push(
          <Notification className="mb-4" type="danger">
            Upload Failed
          </Notification>,
        )
      }
    }
    setFiles([])
  }

  return (
    <Dialog
      isOpen={documentModalVisible}
      onClose={toggleDocumentModal}
      onRequestClose={toggleDocumentModal}
      shouldCloseOnOverlayClick={false}
      contentClassName="bg-[#F3F4F6] px-0 py-0"
      bodyOpenClassName="overflow-hidden"
      width={1020}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer className="p-8">
          <div className="max-h-[70vh] overflow-y-auto">
            <Card
              className="dark:bg-gray-700 bg-white mb-2"
              header={<h5>{t('heading.Company Document History')}</h5>}
            >
              <div>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {document
                    .filter(
                      (docs) =>
                        docs.insuranceCompanyId === props.companyDocumentId,
                    )
                    .map((docs, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 p-4 rounded-md relative group"
                      >
                        {docs.fileName.endsWith('.pdf') ? (
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
                            alt="PDF Document"
                            className="w-full h-48"
                          />
                        ) : docs.fileName.endsWith('.docx') ? (
                          <img
                            src="https://learnbrite.com/wp-content/uploads/2018/01/microsoft-word-365-online.png"
                            alt="Word Document"
                            className="w-full h-48"
                          />
                        ) : (
                          <img
                            src={`${S3_URL}/${docs.fileName}`}
                            alt="Unknown Document"
                            className="w-full h-48"
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-1 space-x-3 bg-white bg-opacity-75 rounded-md px-5 py-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              onClick={() =>
                                window.open(
                                  `${S3_URL}/${docs.fileName}`,
                                  '_blank',
                                )
                              }
                            >
                              <HiOutlineEye
                                size={22}
                                className="cursor-pointer p-2 hover:text-green-500"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              onClick={() => handleDocumentDelete(docs.id)}
                            >
                              <HiOutlineTrash
                                size={22}
                                className="cursor-pointer p-2 hover:text-red-500"
                              />
                            </svg>
                          </div>
                        </div>
                        <p className="text-lg">
                          <b>{docs.fileName}</b>
                        </p>
                      </div>
                    ))}
                </div>
                <h3 className="mt-4">{t('heading.New Uploaded')}</h3>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 p-4 rounded-md relative group"
                    >
                      {attachment.url.data.name.endsWith('.pdf') ? (
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
                          alt="PDF Document"
                          className="w-full h-48"
                        />
                      ) : attachment.url.data.name.endsWith('.docx') ? (
                        <img
                          src="https://learnbrite.com/wp-content/uploads/2018/01/microsoft-word-365-online.png"
                          alt="Word Document"
                          className="w-full h-48"
                        />
                      ) : (
                        <img
                          src={`${S3_URL}/${attachment.url.data.name}`}
                          alt="Unknown Document"
                          className="w-full h-48"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1 space-x-3 bg-white bg-opacity-75 rounded-md px-5 py-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            onClick={() =>
                              window.open(
                                `${S3_URL}/${attachment.url.data.name}`,
                                '_blank',
                              )
                            }
                          >
                            <HiOutlineEye
                              size={22}
                              className="cursor-pointer p-2 hover:text-green-500"
                            />
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-500 hover:text-red-500 cursor-pointer"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            onClick={() => {
                              const updatedAttachments = attachments.filter(
                                (_, i) => i !== index,
                              )
                              setAttachments(updatedAttachments)
                            }}
                          >
                            <HiOutlineTrash
                              size={22}
                              className="cursor-pointer p-2 hover:text-red-500"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-lg">
                        <b>{attachment.name}</b>
                      </p>
                    </div>
                  ))}
                </div>

                <Upload
                  className="min-h-fit mt-8"
                  disabled={uploading}
                  multiple={multipleAttachments}
                  uploadLimit={multipleAttachments}
                  beforeUpload={beforeUpload}
                  onChange={handleFileUpload}
                  showList={true}
                  fileList={files}
                  draggable
                >
                  <div className="max-w-full flex flex-col px-4 py-2 justify-center items-center">
                    <DoubleSidedImage
                      src="/img/others/upload.png"
                      darkModeSrc="/img/others/upload-dark.png"
                    />
                    <p className="font-semibold text-center text-gray-800 dark:text-white">
                      Upload
                    </p>
                  </div>
                </Upload>
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

export default DialogInvoice
