import React, { useEffect, useState } from 'react'
import {
  FormContainer,
  Select,
  Button,
  Input,
  toast,
  Notification,
  Steps,
  Card,
  Avatar,
} from '@/components/ui'
import FormRow from '../submit-case/FormRow'
import {
  HiHome,
  HiOutlineArrowCircleLeft,
  HiOutlineArrowCircleRight,
} from 'react-icons/hi'
import _ from 'lodash'
import { uploadFile } from '@/services/uploads'
import { S3_URL } from '@/constants/api.constant'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { getInsuranceCompany } from '@/services/insurance-company'
import { getAllParticipants } from '@/services/submit-case'
import { useNavigate, useParams } from 'react-router-dom'
import {
  RiCarLine,
  RiShoppingBagLine,
  RiTruckLine,
  RiSave2Line,
} from 'react-icons/ri'
import { saveBusinessCase } from '@/services/business-case'
import {
  HiClock,
  HiMail,
  HiOfficeBuilding,
  HiOutlineUser,
  HiOutlineUserGroup,
  HiPhone,
} from 'react-icons/hi'
import { getWorkshop } from '@/services/workshop'
import { getTowService } from '@/services/tow-service'
import { updateBusinessCase } from '@/services/business-case'
import { getBusinessCase } from '@/services/business-case'
import CustomSlider from './dialog/CustomSlider'

const products = [
  {
    id: 1,
    name: 'Earthen Bottle',
    href: '#',
    price: '$48',
    imageSrc:
      'data:image/jpeg;base64,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',
    imageAlt:
      'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
  {
    id: 2,
    name: 'Nomad Tumbler',
    href: '#',
    price: '$35',
    imageSrc:
      'https://robbreport.com/wp-content/uploads/2018/07/ferrari-portofino_01.jpg?w=1000',
    imageAlt:
      'Olive drab green insulated bottle with flared screw lid and flat top.',
  },
  {
    id: 3,
    name: 'Focus Paper Refill',
    href: '#',
    price: '$89',
    imageSrc:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2L3Je6w53BE0dhWsXXzVU0l3ZyQmLsPmEpw&usqp=CAU',
    imageAlt:
      'Person using a pen to cross a task off a productivity paper card.',
  },
  {
    id: 4,
    name: 'Machined Mechanical Pencil',
    href: '#',
    price: '$35',
    imageSrc:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEuuXwiEIg6gDThusm5uq3GZjYMb_Bu-3Peg&usqp=CAU',
    imageAlt:
      'Hand holding black machined steel mechanical pencil with brass tip and top.',
  },
  {
    id: 1,
    name: 'Earthen Bottle',
    href: '#',
    price: '$48',
    imageSrc:
      'data:image/jpeg;base64,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',
    imageAlt:
      'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
  {
    id: 2,
    name: 'Nomad Tumbler',
    href: '#',
    price: '$35',
    imageSrc:
      'https://robbreport.com/wp-content/uploads/2018/07/ferrari-portofino_01.jpg?w=1000',
    imageAlt:
      'Olive drab green insulated bottle with flared screw lid and flat top.',
  },
  {
    id: 3,
    name: 'Focus Paper Refill',
    href: '#',
    price: '$89',
    imageSrc:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2L3Je6w53BE0dhWsXXzVU0l3ZyQmLsPmEpw&usqp=CAU',
    imageAlt:
      'Person using a pen to cross a task off a productivity paper card.',
  },
  {
    id: 4,
    name: 'Machined Mechanical Pencil',
    href: '#',
    price: '$35',
    imageSrc:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEuuXwiEIg6gDThusm5uq3GZjYMb_Bu-3Peg&usqp=CAU',
    imageAlt:
      'Hand holding black machined steel mechanical pencil with brass tip and top.',
  },
  {
    id: 1,
    name: 'Earthen Bottle',
    href: '#',
    price: '$48',
    imageSrc:
      'data:image/jpeg;base64,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',
    imageAlt:
      'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
  {
    id: 2,
    name: 'Nomad Tumbler',
    href: '#',
    price: '$35',
    imageSrc:
      'https://robbreport.com/wp-content/uploads/2018/07/ferrari-portofino_01.jpg?w=1000',
    imageAlt:
      'Olive drab green insulated bottle with flared screw lid and flat top.',
  },
  {
    id: 3,
    name: 'Focus Paper Refill',
    href: '#',
    price: '$89',
    imageSrc:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2L3Je6w53BE0dhWsXXzVU0l3ZyQmLsPmEpw&usqp=CAU',
    imageAlt:
      'Person using a pen to cross a task off a productivity paper card.',
  },
  {
    id: 4,
    name: 'Machined Mechanical Pencil',
    href: '#',
    price: '$35',
    imageSrc:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEuuXwiEIg6gDThusm5uq3GZjYMb_Bu-3Peg&usqp=CAU',
    imageAlt:
      'Hand holding black machined steel mechanical pencil with brass tip and top.',
  },
]

const BusinessCases = ({
  allParticipants,
  t,
  handleSubmit,
  formState,
  control,
  setFormData,
  formData,
}) => {
  const typeOptions = [
    {
      label: t('label.PZP'),
      value: 'PZP',
    },
    {
      label: t('label.Kasko'),
      value: 'Kasko',
    },
    {
      label: t('label.Self Paid'),
      value: 'Self Paid',
    },
  ]
  return (
    <form onSubmit={handleSubmit}>
      <FormContainer className="p-8">
        <h2 className="text-xl font-bold mb-4">{t('heading.Business Case')}</h2>
        <FormRow
          label={t('label.Type')}
          asterisk
          invalid={formState?.errors?.type}
          errorMessage="Select Type is Required!"
        >
          <Controller
            control={control}
            rules={{ required: true }}
            name="type"
            render={({ field }) => {
              return (
                <Select
                  isClearable
                  {...field}
                  placeholder={t('label.Select Type')}
                  options={typeOptions}
                  value={formData?.type}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      type: value,
                    }))
                    field.onChange(value)
                  }}
                />
              )
            }}
          />
        </FormRow>
        {(formData?.type?.value === 'Kasko' ||
          formData?.type?.value === 'PZP') && (
          <FormRow
            label={t('label.Insurance Case Id')}
            asterisk
            invalid={formState?.errors?.insuranceCaseId}
            errorMessage="Insurance Case Id is Required!"
          >
            <Controller
              control={control}
              name="insuranceCaseId"
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder={t('label.Enter Insurance Case Id')}
                  autoComplete="off"
                  {...field}
                  value={formData?.insuranceCaseId}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      insuranceCaseId: e.target.value,
                    }))
                    field.onChange(e)
                  }}
                />
              )}
            />
          </FormRow>
        )}
        {formData?.type?.value === 'Self Paid' && (
          <FormRow
            label={t('label.Participant')}
            asterisk
            invalid={formState?.errors?.participantA}
            errorMessage="Select Participant A is Required!"
          >
            <Controller
              control={control}
              rules={{ required: true }}
              name="participantA"
              render={({ field }) => {
                const optionsWithLabels = allParticipants.map(
                  (participant, index) => ({
                    value: participant.value,
                    label: participant.label,
                  }),
                )

                return (
                  <Select
                    isClearable
                    {...field}
                    placeholder={t('label.Select Participant')}
                    options={optionsWithLabels}
                    value={formData?.participantA}
                    onChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        participantA: value,
                      }))
                      field.onChange(value)
                    }}
                  />
                )
              }}
            />
          </FormRow>
        )}
        {formData?.type?.value === 'Kasko' && (
          <FormRow
            label={t('label.Customer Participant')}
            asterisk
            invalid={formState?.errors?.customerParticipant}
            errorMessage="Select Customer Participant is Required!"
          >
            <Controller
              control={control}
              rules={{ required: true }}
              name="customerParticipant"
              render={({ field }) => {
                const optionsWithLabels = allParticipants.map(
                  (participant, index) => ({
                    value: participant.value,
                    label: participant.label,
                  }),
                )

                return (
                  <Select
                    isClearable
                    {...field}
                    placeholder={t('label.Select Customer Participant')}
                    options={optionsWithLabels}
                    value={formData?.customerParticipant}
                    onChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        customerParticipant: value,
                      }))
                      field.onChange(value)
                    }}
                  />
                )
              }}
            />
          </FormRow>
        )}

        {(formData?.type?.value === 'Kasko' ||
          formData?.type?.value === 'PZP') && (
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
                const optionsWithLabels = allParticipants.map(
                  (participant, index) => ({
                    value: participant.value,
                    label: participant.label,
                  }),
                )

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
        )}

        {formData?.type?.value === 'PZP' && (
          <FormRow
            label={t('label.Damage Participant')}
            asterisk
            invalid={formState?.errors?.damageParticipant}
            errorMessage="Select Damage Participant is Required!"
          >
            <Controller
              control={control}
              rules={{ required: true }}
              name="damageParticipant"
              render={({ field }) => {
                const optionsWithLabels = allParticipants.map(
                  (participant, index) => ({
                    value: participant.value,
                    label: participant.label,
                  }),
                )

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
        )}
      </FormContainer>
    </form>
  )
}

const Workshops = ({
  setFilesWorkshop,
  t,
  workshopList,
  handleSubmit,
  setFormData,
  formData,
  files,
}) => {
  const [uploading, setUploading] = useState(false)
  const beforeUpload = (file) => {
    let valid = true

    const allowedFileType = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    const maxFileSize = 5000000000

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

  const [selectedTowService, setSelectedTowService] = useState(null)

  const handleUserClick = (workshopId) => {
    setSelectedTowService(workshopId)

    setFormData((prev) => ({
      ...prev,
      workshopId,
    }))
  }

  const removeFile = (fileIndex) => {
    const deletedFileList = files.filter((_, index) => index !== fileIndex)
    setFilesWorkshop(deletedFileList)
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-8">
        <Card
          className="dark:bg-gray-700 bg-white mb-2"
          header={<h5>{t('heading.List of Tow Service')}</h5>}
        >
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {workshopList.map((workshop) => (
              <Card
                key={workshop.id}
                onClick={() => handleUserClick(workshop.id)}
                className={`p-2 ${
                  formData?.workshopId === workshop.id
                    ? 'border-red-600 border-2'
                    : 'bg-white'
                }`}
              >
                <div className="flex w-full justify-center my-2">
                  <CustomSlider
                    images={[
                      workshop?.logo ? `${S3_URL}/${workshop.logo}` : null,
                      ...workshop.workshopAttachments.map((attachment) =>
                        attachment?.url?.data?.name
                          ? `${S3_URL}/${attachment?.url?.data?.name}`
                          : null,
                      ),
                    ]}
                  />
                </div>
                <h5 className="flex w-full justify-center">
                  <b>{workshop.name}</b>
                </h5>
                <hr className="flex w-full justify-center" />
                <div className="w-full text-center my-4">
                  <p className="flex justify-center items-center my-1">
                    <span className="flex-shrink-0">
                      <HiOfficeBuilding size={20} />
                    </span>
                    <span className="ml-2">{workshop.address}</span>
                  </p>

                  <p className="flex justify-center items-center my-1">
                    <span className="flex-shrink-0">
                      <HiHome size={20} />
                    </span>
                    <span className="ml-2">{workshop.Region.name}</span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </form>
  )
}

const TowService = ({
  t,
  towServiceList,
  handleSubmit,
  setFormData,
  formData,
  files,
  setFiles,
}) => {
  const [uploading, setUploading] = useState(false)
  const beforeUpload = (file) => {
    let valid = true

    const allowedFileType = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    const maxFileSize = 50000000000

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

  const [selectedTowService, setSelectedTowService] = useState(null)

  const handleUserClick = (towServiceId) => {
    setSelectedTowService(towServiceId)
    setFormData((prev) => ({
      ...prev,
      towServiceId,
    }))
  }

  const removeFile = (fileIndex) => {
    const deletedFileList = files.filter((_, index) => index !== fileIndex)
    setFiles(deletedFileList)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-8">
        <Card
          className="dark:bg-gray-700 bg-white mb-2"
          header={<h5>{t('heading.List of Tow Service')}</h5>}
        >
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {towServiceList.map((tow) => (
              <Card
                key={tow.id}
                onClick={() => handleUserClick(tow.id)}
                className={`p-2 ${
                  formData?.towServiceId === tow.id
                    ? 'border-red-600 border-2'
                    : 'bg-white'
                }`}
              >
                <div className="flex w-full justify-center my-2">
                  <Avatar
                    shape="circle"
                    size={65}
                    src={tow?.logo ? `${S3_URL}/${tow.logo}` : null}
                    icon={<HiOutlineUser />}
                  />
                </div>
                <h5 className="flex w-full justify-center">
                  <b>{tow.name}</b>
                </h5>
                <hr className="flex w-full justify-center" />
                <div className="w-full text-center my-4">
                  <p className="flex justify-center items-center my-1">
                    <span className="flex-shrink-0">
                      <HiMail size={20} />
                    </span>
                    <span className="ml-2">{tow.email}</span>
                  </p>
                  <p className="flex justify-center items-center my-1">
                    <span className="flex-shrink-0">
                      <HiOfficeBuilding size={20} />
                    </span>
                    <span className="ml-2">{tow.address}</span>
                  </p>
                  <p className="flex justify-center items-center my-1">
                    <span className="flex-shrink-0">
                      <HiPhone size={20} />
                    </span>
                    <span className="ml-2">{tow.phone}</span>
                  </p>
                  <p className="flex justify-center items-center my-1">
                    <span className="flex-shrink-0">
                      <HiHome size={20} />
                    </span>
                    <span className="ml-2">{tow.Region.name}</span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </form>
  )
}
const RentCar = ({ onPrevious, t }) => {
  return (
    <>
      <Card
        className="dark:bg-gray-700 bg-white mb-2 mt-8"
        header={<h5>{t('heading.Rent A Car')}</h5>}
      >
        <section
          aria-labelledby="products-heading"
          className="mx-auto max-w-2xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:max-w-7xl lg:px-8"
        >
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <a key={product.id} href={product.href} className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="h-64 w-64  object-center group-hover:opacity-75"
                  />
                </div>
                <div className="flex w-full justify-between">
                  <div>
                    <h3 className="mt-4 text-sm text-gray-700">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {product.price}
                    </p>
                  </div>
                  <div className="flex items-center text-red-600">
                    <HiClock />
                    <span>24/7</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </Card>
    </>
  )
}

const BusinessCase = () => {
  const { handleSubmit, formState, setValue, control, reset } = useForm()
  const [files, setFiles] = useState([])
  const [filesWorkshop, setFilesWorkshop] = useState([])
  const [attachments, setAttachments] = useState([])
  const [attachmentsWorkshop, setAttachmentsWorkshop] = useState([])
  const [loading, setLoading] = useState(false)
  const [towServiceList, setTowServiceList] = useState([])
  const [formData, setFormData] = useState({})
  const [workshopList, setWorkshopList] = useState([])
  const [businessCaseDataEdit, setBusinessCaseDataEdit] = useState([])
  const [insuranceCompanyList, setInsuranceCompanyList] = useState([])
  const [allParticipants, setAllParticipants] = useState([])
  const { t } = useTranslation()
  const params = useParams()
  const [currentStep, setCurrentStep] = useState(1)
  const accidentCaseId = params?.accidentCaseId
  const businessCaseId = params?.businessCaseId

  useEffect(() => {
    if (businessCaseId) {
      const data = _.find(
        businessCaseDataEdit,
        (row) => row.id === businessCaseId,
      )
      if (data?.id) {
        const form = {
          id: data.id,
          insuranceCaseId: data.insuranceCaseId,
          type: {
            value: data.type,
            label: data.type,
          },
          towServiceId: data.towServiceId,
          workshopId: data.workshopId,
          towServiceInvoiceAttachment: data.towServiceInvoiceAttachment,
          workshopInvoiceAttachment: data.workshopInvoiceAttachment,
        }

        if (form?.type?.value === 'Self Paid') {
          form.participantA = {
            value: data.participantA,
            label: data.ParticipantA?.label,
          }
        }
         else if (form?.type?.value === 'Kasko') {
          form.culpritParticipant = {
            value: data.culpritParticipant,
            label: data.CulpritParticipant?.label,
          }
          form.customerParticipant = {
            value: data.customerParticipant,
            label: data.CustomerParticipant?.label,
          }
        }
         else if (form?.type?.value === 'PZP') {
          form.damageParticipant = {
            value: data.damageParticipant,
            label: data.DamageParticipant?.label,
          }
          form.culpritParticipant = {
            value: data.culpritParticipant,
            label: data.CulpritParticipant?.label,
          }
        } 
       
        setValue('insuranceCaseId', form.insuranceCaseId)
        setValue('type', form.type)
        setFormData(form)
        
        if (form?.type?.value === 'Self Paid') {
          setValue('participantA', form.participantA)
        } else if (form?.type?.value === 'Kasko') {
          setValue('customerParticipant', form.customerParticipant)
          setValue('culpritParticipant', form.culpritParticipant)
        } else if (form?.type?.value === 'PZP') {

          setValue('damageParticipant', form.damageParticipant)
          setValue('culpritParticipant', form.culpritParticipant)
        }
        const fetchDataAndConvertToBlob = async () => {
          try {
            const workshopFiles = []
            for (let i = 0; i < data?.workshopInvoiceAttachment.length; i++) {
              const response = await fetch(
                data?.workshopInvoiceAttachment[i].url,
              )
              const blob = await response.blob()
              const fileName = data?.workshopInvoiceAttachment[i].name
              const file = new File([blob], fileName, { type: blob.type })
              workshopFiles.push(file)
            }
            setFilesWorkshop(workshopFiles)

            const towServiceFiles = []
            for (let i = 0; i < data?.towServiceInvoiceAttachment.length; i++) {
              const responses = await fetch(
                data?.towServiceInvoiceAttachment[i].url,
              )
              const blobs = await responses.blob()
              const fileNames = data?.towServiceInvoiceAttachment[i].name
              const files = new File([blobs], fileNames, { type: blobs.type })
              towServiceFiles.push(files)
            }
            setFiles(towServiceFiles)
          } catch (error) {
            console.error(
              'Error fetching or converting the URL to a file:',
              error,
            )
          }
        }

        fetchDataAndConvertToBlob()
      }
    }
  }, [businessCaseDataEdit])

  useEffect(() => {
    getInsuranceCompanyData()
    getParticipantData()
    getTowServiceData()
    getWorkshopData()
    getBusinessCaseData()
  }, [])

  const getBusinessCaseData = async (options = {}) => {
    try {
      options.accidentCaseId = accidentCaseId
      const response = await getBusinessCase(options)
      setBusinessCaseDataEdit(response?.data?.rows)
    } catch (error) {
      console.error('API call error:', error)
    }
  }

  const getInsuranceCompanyData = async () => {
    try {
      const response = await getInsuranceCompany()
      const data = _.map(response.data.rows, (row) => ({
        value: row.id,
        label: row.name,
      }))
      setInsuranceCompanyList(data)
    } catch (error) {
      console.error('API call error:', error)
    }
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
  const getTowServiceData = async (options = {}) => {
    setLoading(true)
    try {
      const response = await getTowService(options)
      setTowServiceList(response.data.rows)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>,
      )
    }
    setLoading(false)
  }
  const getWorkshopData = async (options = {}) => {
    setLoading(true)
    try {
      const response = await getWorkshop(options)
      setWorkshopList(response.data.rows)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>,
      )
    }
    setLoading(false)
  }

  const handleTowServiceFileUpload = async () => {
    const uploadedFiles = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const existingFile = _.find(
        formData?.towServiceInvoiceAttachment,
        (row) => row.name === file.name,
      )

      if (existingFile) {
        uploadedFiles.push({ name: existingFile.name, url: existingFile.url })
      } else {
        try {
          const url = await uploadFile(file)
          uploadedFiles.push({ name: file.name, url })
          setAttachments((prevAttachments) => [
            ...prevAttachments,
            { name: file.name, url },
          ])
        } catch (error) {
          toast.push(
            <Notification className="mb-4" type="danger">
              Upload Tow Service Invoice Failed
            </Notification>,
          )
        }
      }
    }

    return uploadedFiles
  }

  const handleWorkshopFileUpload = async () => {
    const uploadedFiles = []

    for (let i = 0; i < filesWorkshop.length; i++) {
      const file = filesWorkshop[i]
      const existingFile = _.find(
        formData?.workshopInvoiceAttachment,
        (row) => row.name === file.name,
      )

      if (existingFile) {
        uploadedFiles.push({ name: existingFile.name, url: existingFile.url })
      } else {
        try {
          const url = await uploadFile(file)
          uploadedFiles.push({ name: file.name, url })
          setAttachmentsWorkshop((prevAttachments) => [
            ...prevAttachments,
            { name: file.name, url },
          ])
        } catch (error) {
          toast.push(
            <Notification className="mb-4" type="danger">
              Upload Workshop Invoice Failed
            </Notification>,
          )
        }
      }
    }

    return uploadedFiles
  }
  const handleEditClick = () => {
    navigate(`/cases-list/accident-case-preview/${accidentCaseId}`)
  }

  const onSubmit = async () => {
    setLoading(true)
    const towServiceAttachments = await handleTowServiceFileUpload()
    const workshopAttachments = await handleWorkshopFileUpload()

    let data = _.cloneDeep(formData)
    data.accidentCaseId = accidentCaseId
    data.type = data.type.value

    if (data?.type === 'Self Paid') {
      data.participantA = data.participantA.value
      delete data.customerParticipant
      delete data.damageParticipant
      delete data.culpritParticipant
    } else if (data?.type === 'Kasko') {
      data.culpritParticipant = data.culpritParticipant.value
      data.customerParticipant = data.customerParticipant.value
      delete data.damageParticipant
      delete data.participantA
    } else if (data?.type === 'PZP') {
      data.culpritParticipant = data.culpritParticipant.value
      data.damageParticipant = data.damageParticipant.value
      delete data.customerParticipant
      delete data.participantA
    }
    data.workshopInvoiceAttachment = workshopAttachments
    data.towServiceInvoiceAttachment = towServiceAttachments
    data = _.pickBy(data, _.identity)
    try {
      const save = data?.id ? updateBusinessCase : saveBusinessCase
      const response = await save(data, data?.id)
      setFormData((prev) => ({
        ...prev,
        id: response.data?.id,
        towServiceInvoiceAttachment: response.data?.towServiceInvoiceAttachment,
        workshopInvoiceAttachment: response.data?.workshopInvoiceAttachment,
      }))

      toast.push(
        <Notification className="mb-4" type="success">
          Create Business Case Successfully
        </Notification>,
      )
      handleEditClick()
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed
        </Notification>,
      )
    }
    setLoading(false)
  }

  const navigate = useNavigate()
  const redirectBack = () => {
    navigate(`/cases-list/accident-case-preview/${accidentCaseId}`)
  }
  // const handleStepTitleClick = (stepIndex) => {
  //   setCurrentStep(stepIndex + 1)
  // }

  const handleNext = () => {
    setCurrentStep(currentStep + 1)
  }
  // const handleNext = () => {
  //   if (currentStep === 1) {
  //     console.log("formState.isValid",formState.isValid);
  //     if (formData || formData?.id) {
  //       setCurrentStep(currentStep + 1)
  //     } else {
  //       toast.push(
  //         <Notification className="mb-4" type="danger">
  //           Please fill out the required fields for further steps.
  //         </Notification>,
  //       )
  //     }
  //   } else {
  //     setCurrentStep(currentStep + 1)
  //   }
  // }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
  }
  return (
    <FormContainer className="p-8">
      <Steps current={currentStep - 1}>
        <div className="cursor-pointer" >
          <Steps.Item
            title={t('heading.Business Case')}
            className="text-xl"
            customIcon={
              <HiOutlineUserGroup size={32} className="text-red-600" />
            }
          />
        </div>
        <div className="cursor-pointer" >
          <Steps.Item
            title={t('heading.Workshop')}
            className="text-xl"
            customIcon={
              <RiShoppingBagLine size={32} className="text-red-600" />
            }
          />
        </div>
        <div className="cursor-pointer" >
          <Steps.Item
            title={t('heading.Tow Service')}
            className="text-xl"
            customIcon={<RiTruckLine size={32} className="text-red-600" />}
          />
        </div>
        <div className="cursor-pointer" 
        // onClick={() => handleStepTitleClick(3)}
        >
          <Steps.Item
            title={t('heading.Rent A Car')}
            customIcon={<RiCarLine size={32} className="text-red-600" />}
            className="text-xl"
          />
        </div>
      </Steps>
      <hr className="mt-8" />
      <>
        {currentStep === 1 && (
          <BusinessCases
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
        {currentStep === 2 && (
          <Workshops
            t={t}
            onPrevious={handlePrevious}
            workshopList={workshopList}
            handleSubmit={handleSubmit(onSubmit)}
            setFormData={setFormData}
            formData={formData}
            setAttachments={setAttachmentsWorkshop}
            files={filesWorkshop}
            setFilesWorkshop={setFilesWorkshop}
            attachments={attachmentsWorkshop}
          />
        )}
        {currentStep === 3 && (
          <TowService
            t={t}
            onPrevious={handlePrevious}
            towServiceList={towServiceList}
            handleSubmit={handleSubmit(onSubmit)}
            setFormData={setFormData}
            formData={formData}
            setAttachments={setAttachments}
            files={files}
            setFiles={setFiles}
            attachments={attachments}
          />
        )}
        {currentStep === 4 && <RentCar onPrevious={handlePrevious} t={t} />}
      </>
      <div className="flex items-center justify-end dark:bg-gray-700 bg-white p-4 rounded-bl-lg rounded-br-lg">
        {currentStep === 1 && (
          <Button
            icon={<HiOutlineArrowCircleLeft />}
            type="button"
            size="sm"
            className="w-50 mr-2"
            onClick={redirectBack}
          >
            {t('button.Back')}
          </Button>
        )}
        {currentStep > 1 && (
          <Button
            icon={<HiOutlineArrowCircleLeft />}
            type="button"
            size="sm"
            className="w-50 mr-2"
            onClick={handlePrevious}
          >
            {t('button.Back')}
          </Button>
        )}
        {currentStep === 4 && (
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
              : t('button.Save')}
          </Button>
        )}

        {currentStep < 4 && (
          <Button
            icon={<HiOutlineArrowCircleRight />}
            type="button"
            size="sm"
            className="w-50 mr-2"
            onClick={handleNext}
          >
            {t('button.Next')}
          </Button>
        )}
      </div>
    </FormContainer>
  )
}

export default BusinessCase
