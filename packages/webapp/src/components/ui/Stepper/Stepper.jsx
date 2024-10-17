import React, { useEffect, useState } from 'react'
import {
  HiArrowCircleLeft,
  HiArrowCircleRight,
  HiArrowDown,
  HiClock,
  HiOutlineUser,
} from 'react-icons/hi'
import {
  Button,
  Steps,
  Card,
  Input,
  FormContainer,
  Checkbox,
  Dropdown,
  Badge,
  Avatar,
} from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { PAGE, DEFAULT_PAGE_SIZE } from '@/constants/app.constant'
import { getInsuranceCompany } from '@/services/insurance-company'
import _ from 'lodash'
import RatingStars from '../RatingStars'
import { getTowService } from '@/services/tow-service'
import { getWorkshop } from '@/services/workshop'
import { S3_URL } from '@/constants/api.constant'
import AccidentScenario from '@/views/submit-case/AccidentScenario'
import ParticipantsForm from '@/views/submit-case/ParticipantsForm'

const Stepper = () => {
  const { t } = useTranslation()
  const [participantId, setParticipantId] = useState(null)
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

    // More products...
  ]
  const {
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {},
  })

  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [insuranceCompanyList, setInsuranceCompanyList] = useState([])
  const [towServiceList, setTowServiceList] = useState([])
  const [workshopList, setWorkshopList] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(PAGE)
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE)

  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }
  useEffect(() => {
    getInsuranceCompanyData(page, limit)
    getTowServiceData(page, limit)
    getWorkshopData(page, limit)
  }, [])
  const getInsuranceCompanyData = async (page, limit, options = {}) => {
    setLoading(true)
    options.page = page
    options.limit = limit
    options = _.pickBy(options, _.identity)
    try {
      const response = await getInsuranceCompany(options)
      setInsuranceCompanyList(response.data.rows)
      setCount(response.data.count)
      setLimit(limit)
      setPage(page)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>,
      )
    }
    setLoading(false)
  }
  const getTowServiceData = async (page, limit, options = {}) => {
    setLoading(true)
    options.page = page
    options.limit = limit
    options = _.pickBy(options, _.identity)
    try {
      const response = await getTowService(options)
      setTowServiceList(response.data.rows)
      setCount(response.data.count)
      setLimit(limit)
      setPage(page)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>,
      )
    }
    setLoading(false)
  }
  const getWorkshopData = async (page, limit, options = {}) => {
    setLoading(true)
    options.page = page
    options.limit = limit
    options = _.pickBy(options, _.identity)
    try {
      const response = await getWorkshop(options)
      setWorkshopList(response.data)
      setCount(response.data.count)
      setLimit(limit)
      setPage(page)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>,
      )
    }
    setLoading(false)
  }

  const renderStep = (step) => {
    switch (step) {
      case 2:
        return (
          <Card className="mt-8">
            <div className="my-6">
              <h2 className="text-xl font-bold mb-4">
                {t('heading.Insurance Companies')}
              </h2>
              {/* <button onClick={() => getInsuranceCompanyData(page, limit)}>Click Me</button> */}
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {insuranceCompanyList.map((company) => (
                  <div
                    key={company.id}
                    className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                  >
                    <div className="flex-shrink-0">
                      <Avatar
                        shape="circle"
                        size={65}
                        src={company?.logo ? `${S3_URL}/${company.logo}` : null}
                        icon={<HiOutlineUser />}
                      />
                    </div>
                    <div className="flex w-full justify-between">
                      <div className="min-w-0 flex-1">
                        <a href="#" className="focus:outline-none">
                          <span
                            className="absolute inset-0"
                            aria-hidden="true"
                          />
                          <p className="text-sm font-medium text-gray-900">
                            {company.name}
                          </p>
                          <p className="truncate text-sm text-gray-500">
                            {company.role}
                          </p>
                        </a>
                      </div>
                      <div className="min-w-0 flex-1">
                        <RatingStars rating={company.rating} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )
      case 0:
        return (
          <ParticipantsForm setParticipantId={setParticipantId} />
        )
     
        case 1:
        return (
            <AccidentScenario participantId={participantId}/>
        
        )
        case 3:
          return (
            <Card className="mt-8">
              <div className="my-6">
                <h2 className="text-xl font-bold mb-4">
                  {t('heading.All Workshops')}
                </h2>
                <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {workshopList?.map((workshop) => (
                    <div
                      key={workshop.id}
                      className="h-72 w-64 relative rounded-lg border border-gray-300 bg-slate-100 px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                    >
                      <div className="flex w-full justify-center">
                        <Avatar
                          shape="circle"
                          size={65}
                          src={
                            workshop?.logo ? `${S3_URL}/${workshop.logo}` : null
                          }
                          icon={<HiOutlineUser />}
                        />
                      </div>
                      <br />
                      <div className="flex w-full justify-center">
                        <Badge
                          content={'24/7'}
                          className="px-3 flex items-center rounded-full"
                        />
                      </div>
                      <br />
                      <hr />
                      <div className="flex w-full justify-center mt-2">
                        <p className="flex items-center rounded-full">
                          {workshop.name}
                        </p>
                      </div>
                      <div className="flex w-full justify-center mt-1">
                        <p className="flex items-center rounded-full">
                          {workshop.address}
                        </p>
                      </div>
                      <div className="flex w-full justify-center mt-1">
                        <p className="flex items-center rounded-full">
                          <RatingStars rating={workshop.rating} />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )
      case 5:
        return (
          <Card className="mt-8">
            <div className="my-6">
              <h2 className="text-xl font-bold mb-4">
                {t('heading.Rent A Car')}
              </h2>
              <Card
                className="dark:bg-gray-700 bg-white mb-2"
                header={<h5>{t('heading.List of Car Details')}</h5>}
              >
                <section
                  aria-labelledby="products-heading"
                  className="mx-auto max-w-2xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:max-w-7xl lg:px-8"
                >
                  <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
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
            </div>
          </Card>
        )
      
        case 4:
          return (
            <Card className="mt-8">
              <div className="my-6">
                <h2 className="text-xl font-bold mb-4">
                  {t('heading.Tow Service')}
                </h2>
                <Card
                  className="dark:bg-gray-700 bg-white mb-2"
                  header={<h5>{t('heading.List of Tow Service')}</h5>}
                >
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {towServiceList.map((tow) => (
                      <div
                        key={tow.id}
                        className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                      >
                        <div className="flex-shrink-0">
                          <Avatar
                            shape=""
                            size={65}
                            src={tow?.logo ? `${S3_URL}/${tow.logo}` : null}
                            icon={<HiOutlineUser />}
                          />
                        </div>
                        <div className="flex w-full justify-between">
                          <div className="min-w-0 flex-1">
                            <a href="#" className="focus:outline-none">
                              <span
                                className="absolute inset-0"
                                aria-hidden="true"
                              />
                              <p className="text-sm font-medium text-gray-900">
                                {tow.name}
                              </p>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </Card>
          )
      default:
        return null
    }
  }

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full p-4">
        <div className="mb-4">
          {/* <h1 className="text-2xl font-bold mb-2">{t('heading.Regional Manager')}</h1> */}
        </div>
        <div className="mt-8">
          <Steps current={activeStep}>
            <Steps.Item title={t('heading.Participants Data')} />
            <Steps.Item title={t('heading.Accident Senario')} />
            <Steps.Item title={t('heading.Insurance Company')} />
            <Steps.Item title={t('heading.Workshop')} />
            <Steps.Item title={t('heading.Tow Service')} />
            <Steps.Item title={t('heading.Rent A Car')} />
          </Steps>
        </div>

        {renderStep(activeStep)}

        <div className="flex justify-end gap-2 mt-4">
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <HiArrowCircleLeft className="h-6 w-6" />
              <span>{t('button.Back')}</span>
            </Button>
          )}
          {activeStep < 5 ? (
            <Button
              variant="solid"
              onClick={handleNext}
              className="flex items-center space-x-2"
            >
              <span>{t('button.Next')}</span>
              <HiArrowCircleRight className="h-6 w-6" />
            </Button>
          ) : (
            <Button variant="solid" loading={loading} type="submit">
              {loading ? t('button.Loading') : t('button.Submit')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Stepper
