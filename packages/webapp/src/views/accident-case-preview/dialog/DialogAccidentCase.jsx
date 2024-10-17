import React, { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import {
  Card,
  Button,
  FormContainer,
  Dialog,
  Checkbox,
  Radio,
  Select,
  toast,
  Input,
  Notification,
  FormItem,
  DatePicker,
} from '@/components/ui'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { S3_URL } from '@/constants/api.constant'
import FormRow from '@/views/submit-case/FormRow'
import DateTimepicker from '@/components/ui/DatePicker/DateTimepicker'
import { updateAccidentCase } from '@/services/submit-case'
import { HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi'
import dayjs from 'dayjs'

const DialogAccidentCase = (props) => {
  const {
    accidentCaseModalId,
    accidentCaseModalVisible,
    toggleDocumentModal,
    allAccidentCase,
  } = props
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    watch,
    reset,
    register,
  } = useForm()
  const countries = [
    { label: 'Afghanistan', value: 'AF' },
    { label: 'land Islands', value: 'AX' },
    { label: 'Albania', value: 'AL' },
    { label: 'Algeria', value: 'DZ' },
    { label: 'American Samoa', value: 'AS' },
    { label: 'AndorrA', value: 'AD' },
    { label: 'Angola', value: 'AO' },
    { label: 'Anguilla', value: 'AI' },
    { label: 'Antarctica', value: 'AQ' },
    { label: 'Antigua and Barbuda', value: 'AG' },
    { label: 'Argentina', value: 'AR' },
    { label: 'Armenia', value: 'AM' },
    { label: 'Aruba', value: 'AW' },
    { label: 'Australia', value: 'AU' },
    { label: 'Austria', value: 'AT' },
    { label: 'Azerbaijan', value: 'AZ' },
    { label: 'Bahamas', value: 'BS' },
    { label: 'Bahrain', value: 'BH' },
    { label: 'Bangladesh', value: 'BD' },
    { label: 'Barbados', value: 'BB' },
    { label: 'Belarus', value: 'BY' },
    { label: 'Belgium', value: 'BE' },
    { label: 'Belize', value: 'BZ' },
    { label: 'Benin', value: 'BJ' },
    { label: 'Bermuda', value: 'BM' },
    { label: 'Bhutan', value: 'BT' },
    { label: 'Bolivia', value: 'BO' },
    { label: 'Bosnia and Herzegovina', value: 'BA' },
    { label: 'Botswana', value: 'BW' },
    { label: 'Bouvet Island', value: 'BV' },
    { label: 'Brazil', value: 'BR' },
    { label: 'British Indian Ocean Territory', value: 'IO' },
    { label: 'Brunei Darussalam', value: 'BN' },
    { label: 'Bulgaria', value: 'BG' },
    { label: 'Burkina Faso', value: 'BF' },
    { label: 'Burundi', value: 'BI' },
    { label: 'Cambodia', value: 'KH' },
    { label: 'Cameroon', value: 'CM' },
    { label: 'Canada', value: 'CA' },
    { label: 'Cape Verde', value: 'CV' },
    { label: 'Cayman Islands', value: 'KY' },
    { label: 'Central African Republic', value: 'CF' },
    { label: 'Chad', value: 'TD' },
    { label: 'Chile', value: 'CL' },
    { label: 'China', value: 'CN' },
    { label: 'Christmas Island', value: 'CX' },
    { label: 'Cocos (Keeling) Islands', value: 'CC' },
    { label: 'Colombia', value: 'CO' },
    { label: 'Comoros', value: 'KM' },
    { label: 'Congo', value: 'CG' },
    { label: 'Congo, The Democratic Republic of the', value: 'CD' },
    { label: 'Cook Islands', value: 'CK' },
    { label: 'Costa Rica', value: 'CR' },
    { label: 'Cote DIvoire', value: 'CI' },
    { label: 'Croatia', value: 'HR' },
    { label: 'Cuba', value: 'CU' },
    { label: 'Cyprus', value: 'CY' },
    { label: 'Czech Republic', value: 'CZ' },
    { label: 'Denmark', value: 'DK' },
    { label: 'Djibouti', value: 'DJ' },
    { label: 'Dominica', value: 'DM' },
    { label: 'Dominican Republic', value: 'DO' },
    { label: 'Ecuador', value: 'EC' },
    { label: 'Egypt', value: 'EG' },
    { label: 'El Salvador', value: 'SV' },
    { label: 'Equatorial Guinea', value: 'GQ' },
    { label: 'Eritrea', value: 'ER' },
    { label: 'Estonia', value: 'EE' },
    { label: 'Ethiopia', value: 'ET' },
    { label: 'Falkland Islands (Malvinas)', value: 'FK' },
    { label: 'Faroe Islands', value: 'FO' },
    { label: 'Fiji', value: 'FJ' },
    { label: 'Finland', value: 'FI' },
    { label: 'France', value: 'FR' },
    { label: 'French Guiana', value: 'GF' },
    { label: 'French Polynesia', value: 'PF' },
    { label: 'French Southern Territories', value: 'TF' },
    { label: 'Gabon', value: 'GA' },
    { label: 'Gambia', value: 'GM' },
    { label: 'Georgia', value: 'GE' },
    { label: 'Germany', value: 'DE' },
    { label: 'Ghana', value: 'GH' },
    { label: 'Gibraltar', value: 'GI' },
    { label: 'Greece', value: 'GR' },
    { label: 'Greenland', value: 'GL' },
    { label: 'Grenada', value: 'GD' },
    { label: 'Guadeloupe', value: 'GP' },
    { label: 'Guam', value: 'GU' },
    { label: 'Guatemala', value: 'GT' },
    { label: 'Guernsey', value: 'GG' },
    { label: 'Guinea', value: 'GN' },
    { label: 'Guinea-Bissau', value: 'GW' },
    { label: 'Guyana', value: 'GY' },
    { label: 'Haiti', value: 'HT' },
    { label: 'Heard Island and Mcdonald Islands', value: 'HM' },
    { label: 'Holy See (Vatican City State)', value: 'VA' },
    { label: 'Honduras', value: 'HN' },
    { label: 'Hong Kong', value: 'HK' },
    { label: 'Hungary', value: 'HU' },
    { label: 'Iceland', value: 'IS' },
    { label: 'India', value: 'IN' },
    { label: 'Indonesia', value: 'ID' },
    { label: 'Iran, Islamic Republic Of', value: 'IR' },
    { label: 'Iraq', value: 'IQ' },
    { label: 'Ireland', value: 'IE' },
    { label: 'Isle of Man', value: 'IM' },
    { label: 'Israel', value: 'IL' },
    { label: 'Italy', value: 'IT' },
    { label: 'Jamaica', value: 'JM' },
    { label: 'Japan', value: 'JP' },
    { label: 'Jersey', value: 'JE' },
    { label: 'Jordan', value: 'JO' },
    { label: 'Kazakhstan', value: 'KZ' },
    { label: 'Kenya', value: 'KE' },
    { label: 'Kiribati', value: 'KI' },
    { label: 'Korea, Democratic PeopleS Republic of', value: 'KP' },
    { label: 'Korea, Republic of', value: 'KR' },
    { label: 'Kuwait', value: 'KW' },
    { label: 'Kyrgyzstan', value: 'KG' },
    { label: 'Lao PeopleS Democratic Republic', value: 'LA' },
    { label: 'Latvia', value: 'LV' },
    { label: 'Lebanon', value: 'LB' },
    { label: 'Lesotho', value: 'LS' },
    { label: 'Liberia', value: 'LR' },
    { label: 'Libyan Arab Jamahiriya', value: 'LY' },
    { label: 'Liechtenstein', value: 'LI' },
    { label: 'Lithuania', value: 'LT' },
    { label: 'Luxembourg', value: 'LU' },
    { label: 'Macao', value: 'MO' },
    { label: 'Macedonia, The Former Yugoslav Republic of', value: 'MK' },
    { label: 'Madagascar', value: 'MG' },
    { label: 'Malawi', value: 'MW' },
    { label: 'Malaysia', value: 'MY' },
    { label: 'Maldives', value: 'MV' },
    { label: 'Mali', value: 'ML' },
    { label: 'Malta', value: 'MT' },
    { label: 'Marshall Islands', value: 'MH' },
    { label: 'Martinique', value: 'MQ' },
    { label: 'Mauritania', value: 'MR' },
    { label: 'Mauritius', value: 'MU' },
    { label: 'Mayotte', value: 'YT' },
    { label: 'Mexico', value: 'MX' },
    { label: 'Micronesia, Federated States of', value: 'FM' },
    { label: 'Moldova, Republic of', value: 'MD' },
    { label: 'Monaco', value: 'MC' },
    { label: 'Mongolia', value: 'MN' },
    { label: 'Montenegro', value: 'ME' },
    { label: 'Montserrat', value: 'MS' },
    { label: 'Morocco', value: 'MA' },
    { label: 'Mozambique', value: 'MZ' },
    { label: 'Myanmar', value: 'MM' },
    { label: 'Namibia', value: 'NA' },
    { label: 'Nauru', value: 'NR' },
    { label: 'Nepal', value: 'NP' },
    { label: 'Netherlands', value: 'NL' },
    { label: 'Netherlands Antilles', value: 'AN' },
    { label: 'New Caledonia', value: 'NC' },
    { label: 'New Zealand', value: 'NZ' },
    { label: 'Nicaragua', value: 'NI' },
    { label: 'Niger', value: 'NE' },
    { label: 'Nigeria', value: 'NG' },
    { label: 'Niue', value: 'NU' },
    { label: 'Norfolk Island', value: 'NF' },
    { label: 'Northern Mariana Islands', value: 'MP' },
    { label: 'Norway', value: 'NO' },
    { label: 'Oman', value: 'OM' },
    { label: 'Pakistan', value: 'PK' },
    { label: 'Palau', value: 'PW' },
    { label: 'Palestinian Territory, Occupied', value: 'PS' },
    { label: 'Panama', value: 'PA' },
    { label: 'Papua New Guinea', value: 'PG' },
    { label: 'Paraguay', value: 'PY' },
    { label: 'Peru', value: 'PE' },
    { label: 'Philippines', value: 'PH' },
    { label: 'Pitcairn', value: 'PN' },
    { label: 'Poland', value: 'PL' },
    { label: 'Portugal', value: 'PT' },
    { label: 'Puerto Rico', value: 'PR' },
    { label: 'Qatar', value: 'QA' },
    { label: 'Reunion', value: 'RE' },
    { label: 'Romania', value: 'RO' },
    { label: 'Russian Federation', value: 'RU' },
    { label: 'RWANDA', value: 'RW' },
    { label: 'Saint Helena', value: 'SH' },
    { label: 'Saint Kitts and Nevis', value: 'KN' },
    { label: 'Saint Lucia', value: 'LC' },
    { label: 'Saint Pierre and Miquelon', value: 'PM' },
    { label: 'Saint Vincent and the Grenadines', value: 'VC' },
    { label: 'Samoa', value: 'WS' },
    { label: 'San Marino', value: 'SM' },
    { label: 'Sao Tome and Principe', value: 'ST' },
    { label: 'Saudi Arabia', value: 'SA' },
    { label: 'Senegal', value: 'SN' },
    { label: 'Serbia', value: 'RS' },
    { label: 'Seychelles', value: 'SC' },
    { label: 'Sierra Leone', value: 'SL' },
    { label: 'Singapore', value: 'SG' },
    { label: 'Slovakia', value: 'SK' },
    { label: 'Slovenia', value: 'SI' },
    { label: 'Solomon Islands', value: 'SB' },
    { label: 'Somalia', value: 'SO' },
    { label: 'South Africa', value: 'ZA' },
    { label: 'South Georgia and the South Sandwich Islands', value: 'GS' },
    { label: 'Spain', value: 'ES' },
    { label: 'Sri Lanka', value: 'LK' },
    { label: 'Sudan', value: 'SD' },
    { label: 'Suriname', value: 'SR' },
    { label: 'Svalbard and Jan Mayen', value: 'SJ' },
    { label: 'Swaziland', value: 'SZ' },
    { label: 'Sweden', value: 'SE' },
    { label: 'Switzerland', value: 'CH' },
    { label: 'Syrian Arab Republic', value: 'SY' },
    { label: 'Taiwan, Province of China', value: 'TW' },
    { label: 'Tajikistan', value: 'TJ' },
    { label: 'Tanzania, United Republic of', value: 'TZ' },
    { label: 'Thailand', value: 'TH' },
    { label: 'Timor-Leste', value: 'TL' },
    { label: 'Togo', value: 'TG' },
    { label: 'Tokelau', value: 'TK' },
    { label: 'Tonga', value: 'TO' },
    { label: 'Trinidad and Tobago', value: 'TT' },
    { label: 'Tunisia', value: 'TN' },
    { label: 'Turkey', value: 'TR' },
    { label: 'Turkmenistan', value: 'TM' },
    { label: 'Turks and Caicos Islands', value: 'TC' },
    { label: 'Tuvalu', value: 'TV' },
    { label: 'Uganda', value: 'UG' },
    { label: 'Ukraine', value: 'UA' },
    { label: 'United Arab Emirates', value: 'AE' },
    { label: 'United Kingdom', value: 'GB' },
    { label: 'United States', value: 'US' },
    { label: 'United States Minor Outlying Islands', value: 'UM' },
    { label: 'Uruguay', value: 'UY' },
    { label: 'Uzbekistan', value: 'UZ' },
    { label: 'Vanuatu', value: 'VU' },
    { label: 'Venezuela', value: 'VE' },
    { label: 'Viet Nam', value: 'VN' },
    { label: 'Virgin Islands, British', value: 'VG' },
    { label: 'Virgin Islands, U.S.', value: 'VI' },
    { label: 'Wallis and Futuna', value: 'WF' },
    { label: 'Western Sahara', value: 'EH' },
    { label: 'Yemen', value: 'YE' },
    { label: 'Zambia', value: 'ZM' },
    { label: 'Zimbabwe', value: 'ZW' },
  ]

  const hourOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: i < 10 ? `0${i}` : `${i}`,
  }))

  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i,
    label: i < 10 ? `0${i}` : `${i}`,
  }))
  const { t } = useTranslation()
  const watcher = useWatch({ control })
  const investigationByPoliceValue = watch('investigationByPolice')
  const [selectedHour, setSelectedHour] = useState('Hrs')
  const [selectedMinute, setSelectedMinute] = useState('Mins')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const closeDropdown = () => {
    setIsDropdownOpen(false)
  }

  useEffect(() => {
    if (accidentCaseModalVisible) {
      const data = _.find(
        allAccidentCase,
        (row) => row.id === accidentCaseModalId,
      )
      if (data?.id) {
        const form = {
          id: data.id,
          accidentAddress: data.accidentAddress,
          city: data.city,
          country: data.country,
          dateOfAccident: data.dateOfAccident,
          injuries: data.injuries,
          investigationByPolice: data.investigationByPolice,
          otherCarDamage: data.otherCarDamage,
          policeDepartment: data.policeDepartment,
          witness: data.witness,
        }
        setValue('accidentAddress', form.accidentAddress)
        setValue('city', form.city)
        setValue('country', form.country)
        const dateOfAccidentObj = new Date(form.dateOfAccident)
        const hours = dateOfAccidentObj.getHours()
        const minutes = dateOfAccidentObj.getMinutes()
        setValue(
          'dateOfAccident',
          dateOfAccidentObj
        )
        setSelectedHour(hours)
        setSelectedMinute(minutes)
        setValue('injuries', form.injuries ? 'yes' : 'no')
        setValue(
          'investigationByPolice',
          form.investigationByPolice ? 'yes' : 'no',
        )
        setValue('otherCarDamage', form.otherCarDamage ? 'yes' : 'no')
        setValue('policeDepartment', form.policeDepartment)
        setValue('witness', form.witness)
      }
    } else {
      reset()
    }
  }, [accidentCaseModalVisible])

  const onSubmit = async (values) => {
    const newDateObject = dayjs(values.dateOfAccident)
      .set('hour', selectedHour)
      .set('minute', selectedMinute)
      .toDate()
    values.dateOfAccident = newDateObject
    try {
      const responseId = await updateAccidentCase(values, accidentCaseModalId)
      toast.push(
        <Notification className="mb-4" type="success">
          Updated Successfully
        </Notification>,
      )
      toggleDocumentModal()
    } catch {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed
        </Notification>,
      )
    }
  }

  return (
    <Dialog
      isOpen={accidentCaseModalVisible}
      onClose={toggleDocumentModal}
      onRequestClose={toggleDocumentModal}
      shouldCloseOnOverlayClick={false}
      contentClassName="bg-[#F3F4F6] px-0 py-0"
      bodyOpenClassName="overflow-hidden"
      width={1020}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer className="p-8">
          <div className="max-h-[65vh] overflow-y-auto">
            <h5>
              {t('heading.Agreed Statement Of Facts on Vehicle Accident')}
            </h5>
            <Card className="dark:bg-gray-700 bg-white my-4">
              <div className="text-left grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-2 gap-y-7 gap-x-4">
                {' '}
                {/* <FormRow
                  label={t('label.Date & Time of Accident')}
                  asterisk
                  border={false}
                  invalid={errors?.dateOfAccident}
                  errorMessage="Date & Time of Accident required!"
                >
                  <Controller
                    control={control} 
                    rules={{ required: true }}
                    name="dateOfAccident"
                    render={({ field }) => (
                      <DateTimepicker
                        {...field}
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="yyyy-MM-dd HH:mm"
                        placeholderText={t('label.Select Date of Accident')}
                      />
                    )}
                  />
                </FormRow> */}
                <FormItem
                  label={t('label.Date & Time of Accident')}
                  asterisk
                  border={false}
                  invalid={errors?.dateOfAccident}
                  errorMessage="Date & Time of Accident required!"
                >
                  <div className="grid sm:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 gap-x-1">
                    <div>
                      <Controller
                        control={control}
                        rules={{ required: true }}
                        name="dateOfAccident"
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            onChange={(date) => field.onChange(date)}
                            inputFormat={t('date.date-format')}
                            placeholder={t('label.Select Date of Accident')}
                            inputSuffix={null}
                            inputPrefix={
                              <HiOutlineCalendar className="text-lg" />
                            }
                          />
                        )}
                      />
                    </div>

                    <div
                      className={`time-select-wrapper  ${
                        isDropdownOpen ? 'dropdown-open' : ''
                      }`}
                    >
                      <Controller
                        name="dateOfAccident"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <div className="input-with-icon">
                            <Input
                              {...field}
                              type="text"
                              placeholder="Selected Time"
                              value={`${selectedHour}:${selectedMinute}`}
                              readOnly
                              onClick={toggleDropdown}
                              prefix={
                                <HiOutlineClock
                                  className="text-xl"
                                  onClick={toggleDropdown}
                                />
                              }
                            />
                          </div>
                        )}
                      />
                      {isDropdownOpen ? (
                        <div className="time-dropdown grid sm:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 gap-x-2">
                          <div className="time-select-section">
                            <Controller
                              name="hour"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  options={hourOptions.map((option) => ({
                                    value: option.value,
                                    label: option.label,
                                  }))}
                                  value={{
                                    label: selectedHour,
                                    value: selectedHour,
                                  }}
                                  onChange={(selectedOption) =>
                                    setSelectedHour(selectedOption.value)
                                  }
                                  placeholder="Hrs"
                                  menuIsOpen={isDropdownOpen}
                                  onBlur={closeDropdown}
                                />
                              )}
                            />
                          </div>
                          <div className="time-select-section">
                            <Controller
                              name="minute"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  options={minuteOptions.map((option) => ({
                                    value: option.value,
                                    label: option.label,
                                  }))}
                                  value={{
                                    label: selectedMinute,
                                    value: selectedMinute,
                                  }}
                                  onChange={(selectedOption) =>
                                    setSelectedMinute(selectedOption.value)
                                  }
                                  placeholder="Mins"
                                  menuIsOpen={isDropdownOpen}
                                  onBlur={closeDropdown}
                                />
                              )}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </FormItem>
                <FormRow
                  label={t('label.Accident Address')}
                  asterisk
                  invalid={errors?.accidentAddress}
                  errorMessage="Participant Address is required!"
                >
                  <Controller
                    control={control}
                    name="accidentAddress"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder={t('label.Enter Accident Address')}
                        autocomplete="off"
                        {...field}
                      />
                    )}
                  />
                </FormRow>
                <FormRow
                  label={t('label.Country')}
                  asterisk
                  invalid={errors?.country}
                  errorMessage="Country is required!"
                >
                  <Controller
                    control={control}
                    name="country"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={countries}
                        placeholder={t('label.Select Country')}
                        value={countries.find(
                          (option) => option.value === field.value,
                        )} // Find the selected option object
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption.value)
                          field.onBlur() // Trigger the onBlur event to update the label
                        }}
                      />
                    )}
                  />
                </FormRow>
                <FormRow
                  label={t('label.City')}
                  asterisk
                  invalid={errors?.city}
                  errorMessage="City is required!"
                >
                  <Controller
                    control={control}
                    name="city"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder={t('label.Enter City')}
                        autocomplete="off"
                        {...field}
                      />
                    )}
                  />
                </FormRow>
                <FormRow
                  label={t('label.Injuries')}
                  asterisk
                  invalid={errors?.injuries}
                  errorMessage="Injury Option is required!"
                >
                  <Controller
                    control={control}
                    name="injuries"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Radio
                            id="injuriesYesRadio"
                            value="yes"
                            checked={field.value === 'yes'}
                            onChange={() => field.onChange('yes')}
                          />
                          <label htmlFor="injuriesYesRadio" className="ml-2">
                            {t('label.Yes')}
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Radio
                            id="injuriesNoRadio"
                            value="no"
                            checked={field.value === 'no'}
                            onChange={() => field.onChange('no')}
                          />
                          <label htmlFor="injuriesNoRadio" className="ml-2">
                            {t('label.No')}
                          </label>
                        </div>
                      </div>
                    )}
                  />
                </FormRow>
                <FormRow
                  label={t('label.Other than car damage A & B')}
                  asterisk
                  invalid={errors?.otherCarDamage}
                  errorMessage="Option is required!"
                >
                  <Controller
                    control={control}
                    name="otherCarDamage"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Radio
                            id="otherCarDamageYesRadio"
                            value="yes"
                            checked={field.value === 'yes'}
                            onChange={() => field.onChange('yes')}
                          />
                          <label
                            htmlFor="otherCarDamageYesRadio"
                            className="ml-2"
                          >
                            {t('label.Yes')}
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Radio
                            id="otherCarDamageNoRadio"
                            value="no"
                            checked={field.value === 'no'}
                            onChange={() => field.onChange('no')}
                          />
                          <label
                            htmlFor="otherCarDamageNoRadio"
                            className="ml-2"
                          >
                            {t('label.No')}
                          </label>
                        </div>
                      </div>
                    )}
                  />
                </FormRow>
                <FormRow
                  label={t('label.Investigation By Police')}
                  asterisk
                  invalid={errors?.investigationByPolice}
                  errorMessage="Option is required!"
                >
                  <Controller
                    control={control}
                    name="investigationByPolice"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Radio
                            id="investigationByPoliceYesRadio"
                            value="yes"
                            checked={field.value === 'yes'}
                            onChange={() => field.onChange('yes')}
                          />
                          <label
                            htmlFor="investigationByPoliceYesRadio"
                            className="ml-2"
                          >
                            {t('label.Yes')}
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Radio
                            id="investigationByPoliceNoRadio"
                            value="no"
                            checked={field.value === 'no'}
                            onChange={() => field.onChange('no')}
                          />
                          <label
                            htmlFor="investigationByPoliceNoRadio"
                            className="ml-2"
                          >
                            {t('label.No')}
                          </label>
                        </div>
                      </div>
                    )}
                  />
                </FormRow>
                {investigationByPoliceValue === 'yes' && (
                  <FormRow
                    label={t('label.Police Department')}
                    asterisk
                    invalid={errors?.policeDepartment}
                    errorMessage="Police Department is required!"
                  >
                    <Controller
                      control={control}
                      name="policeDepartment"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder={t('label.Enter Police Department')}
                          autoComplete="off"
                          {...field}
                        />
                      )}
                    />
                  </FormRow>
                )}
                <FormRow
                  label={t('label.Witness')}
                  asterisk
                  invalid={errors?.witness}
                  errorMessage="Green Card information is required!"
                >
                  <Controller
                    control={control}
                    name="witness"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder={t('label.Enter Witness')}
                        autoComplete="off"
                        value={field.value?.witness || field.value} // Access the correct property based on its type
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                </FormRow>
              </div>
            </Card>
          </div>
        </FormContainer>
        <div className="flex items-center justify-end dark:bg-gray-700 bg-white p-4 rounded-bl-lg rounded-br-lg">
          <Button type="submit" size="sm" className="w-50 mr-2" variant="solid">
            {t('button.Update')}
          </Button>
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

export default DialogAccidentCase
