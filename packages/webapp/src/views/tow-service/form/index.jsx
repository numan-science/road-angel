import {
  Avatar,
  Button,
  Card,
  Dialog,
  FormContainer,
  Input,
  Notification,
  toast,
  Upload,
  Select,
} from '@/components/ui'
import { saveTowService, updateTowService } from '@/services/tow-service'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { HiOutlineUser } from 'react-icons/hi'
import { RiSave2Line } from 'react-icons/ri'
import FormRow from './FormRow'
import { S3_URL } from '@/constants/api.constant'
import { uploadFile } from '@/services/uploads'

const UserForm = (props) => {
  const { isEdit = false, open = false, onClose, data = {}, RegionList } = props
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm({
    defaultValues: {
      towservice: {},
      TowServiceIds: [],
    },
  })

  const watcher = useWatch({ control })
  const [avatar, setAvatar] = useState(null)
  const [loading, setLoading] = useState(false)
  const [TowServiceForm, setTowServiceForm] = useState([])
  const [isTowServiceEdit, setIsTowServiceEdit] = useState(false)

  useEffect(() => {
    if (isEdit && data) {
      setIsTowServiceEdit(false)
      const region = _.filter(RegionList, (row) => row.value === data.regionId)
      const TowServiceIds = _.map(data, (towservice) => ({
        id: data.id,
        logo: towservice?.logo,
        name: towservice?.name,
        regionId: region,
      }))
      setValue('towservice', data)
      setValue('towservice', {
        id: data?.id,
        logo: data?.logo,
        name: data?.name,
        email: data?.email,
        address: data?.address,
        phone: data?.phone,
        regionId: region,
      })
      setValue('TowServiceIds', TowServiceIds)
      setTowServiceForm(
        _.map(data, (towservice) => ({
          id: data.id,
          logo: towservice?.logo,
          name: towservice?.name,
          email: towservice?.email,
          address: towservice?.address,
          phone: towservice?.phone,
          regionId: region,
        })),
      )
    }
  }, [isEdit])

  const handleDialogClose = () => {
    setTimeout(() => {
      reset({
        towservice: null,
        TowServiceIds: null,
      })
    }, 700)
    setAvatar(null)
    setIsTowServiceEdit(false)
    onClose()
    setTowServiceForm([])
  }

  const onSubmit = async (values) => {
    try {
      values.towservice.regionId = values.towservice.regionId.value
      const save = data?.id ? updateTowService : saveTowService
      setLoading(true)
      const response = await save(values.towservice, data.id)
      setLoading(false)
      toast.push(
        <Notification className="mb-4" type="success">
          Tow Service Created !
        </Notification>,
      )
      handleDialogClose()
    } catch (error) {
      setLoading(false)
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed !
        </Notification>,
      )
    }
  }
  const { t } = useTranslation()
  const onSetFormFileUser = async (file) => {
    const response = await uploadFile(file[0])
    const profilePic = response.data.name
    setAvatar(`${S3_URL}/${profilePic}`)
    setValue('towservice.logo', profilePic)
  }
  return (
    <Dialog
      isOpen={open}
      onClose={handleDialogClose}
      onRequestClose={handleDialogClose}
      shouldCloseOnOverlayClick={false}
      contentClassName="bg-[#F3F4F6] px-0 py-0"
      bodyOpenClassName="overflow-hidden"
    >
      <h3 className="p-4 dark:bg-gray-700 bg-white rounded-tl-lg rounded-tr-lg">
        {t('heading.Add New Tow Service')}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer className="p-4">
          <div className="max-h-[65vh] overflow-y-auto ">
            <Card
              className="dark:bg-gray-700 bg-white mb-2"
              header={<h5>{t('heading.Tow Service Details')}</h5>}
            >
              {isTowServiceEdit ? (
                watcher.towservice?.id && (
                  <div className="text-left grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4">
                    <Upload
                      className="cursor-pointer text-center"
                      onChange={onSetFormFileUser}
                      onFileRemove={onSetFormFileUser}
                      showList={false}
                      uploadLimit={1}
                    >
                      <Avatar
                        src={avatar}
                        className="border-2 border-white dark:border-gray-800 shadow-lg"
                        size={100}
                        shape="circle"
                        icon={<HiOutlineUser />}
                      />
                    </Upload>
                  </div>
                )
              ) : (
                <>
                  <FormRow label={t('label.Avatar')}>
                    <Upload
                      className="cursor-pointer"
                      onChange={onSetFormFileUser}
                      onFileRemove={onSetFormFileUser}
                      showList={false}
                      uploadLimit={1}
                    >
                      <Avatar
                        src={avatar}
                        className="border-2 border-white dark:border-gray-800 shadow-lg"
                        size={50}
                        shape="circle"
                        icon={<HiOutlineUser />}
                      />
                    </Upload>
                  </FormRow>
                  <FormRow
                    label={t('label.Tow Service Name')}
                    asterisk
                    invalid={errors.towservice?.name}
                    errorMessage="Tow Service name is required!"
                  >
                    <Controller
                      control={control}
                      name="towservice.name"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder={t('label.Tow Service')}
                          autocomplete="off"
                          {...field}
                        />
                      )}
                    />
                  </FormRow>
                  <FormRow
                    label={t('label.Email')}
                    asterisk
                    invalid={errors.towservice?.email}
                    errorMessage="Email is required!"
                  >
                    <Controller
                      control={control}
                      name="towservice.email"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Input
                          type="email"
                          placeholder={t('label.Email')}
                          autocomplete="off"
                          {...field}
                        />
                      )}
                    />
                  </FormRow>
                  <FormRow
                    label={t('label.Address')}
                    asterisk
                    invalid={errors.towservice?.address}
                    errorMessage="Address is required!"
                  >
                    <Controller
                      control={control}
                      name="towservice.address"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder={t('label.Enter Address')}
                          autocomplete="off"
                          {...field}
                        />
                      )}
                    />
                  </FormRow>
                  <FormRow
                    label={t('label.Phone')}
                    asterisk
                    invalid={errors.towservice?.phone}
                    errorMessage="Phone Number is required!"
                  >
                    <Controller
                      control={control}
                      name="towservice.phone"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder={t('label.Enter Phone Number')}
                          autocomplete="off"
                          {...field}
                          maxLength ={11}
                        />
                      )}
                    />
                  </FormRow>
                  <FormRow
                    label={t('label.Region')}
                    asterisk
                    border={false}
                    invalid={errors.towservice?.regionId}
                    errorMessage="Region is required!"
                  >
                    <Controller
                      control={control}
                      rules={{ required: true }}
                      name="towservice.regionId"
                      render={({ field }) => (
                        <Select
                          isClearable
                          {...field}
                          placeholder={t('label.Select Region')}
                          options={RegionList}
                        />
                      )}
                    />
                  </FormRow>
                </>
              )}
            </Card>
          </div>
        </FormContainer>
        <div className="flex items-center justify-end dark:bg-gray-700 bg-white p-4 rounded-bl-lg rounded-br-lg">
          <Button
            type="button"
            size="sm"
            className="w-50 mr-2"
            onClick={handleDialogClose}
          >
            {t('button.Cancel')}
          </Button>
          <Button
            icon={<RiSave2Line />}
            type="submit"
            variant="solid"
            size="sm"
            className="w-50"
            loading={loading}
          >
            {isEdit ? t('button.Update') : t('button.Save')}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
export default UserForm
