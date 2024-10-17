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

const DialogDoc = (props) => {
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
              header={<h5>{t('heading.Cases List')}</h5>}
            >
              
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

export default DialogDoc
