import {
  Avatar,
  Button,
  Card,
  Dialog,
  FormContainer,
  Input,
  Notification,
  Select,
  toast,
  Upload,
} from '@/components/ui'
import { S3_URL } from '@/constants/api.constant'
import { PasswordInput } from '@/components/shared'
// import { saveSaleAgent, updateSaleAgent } from '@/services/sale-agent'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { HiOutlineUser } from 'react-icons/hi'
import { RiSave2Line } from 'react-icons/ri'
import FormRow from './FormRow'
import { uploadFile } from '@/services/uploads'
import { DEFAULT_ROLES } from "@/constants/app.constant";
import { saveUser, updateUser } from '@/services/user'

const UserForm = (props) => {
  const { isEdit = false, open = false, onClose, data = {}, roles = [], RegionList = [] } = props
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm({
    defaultValues: {
      sale: {},
      SaleIds: [],
    },
  })

  const watcher = useWatch({ control })
  const [avatar, setAvatar] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saleAgentForm, setSaleAgentForm] = useState([])
  const [selectedOptionsVisible, setSelectedOptionsVisible] = useState([])

  const [isSaleAgentEdit, setIsSaleAgentEdit] = useState(false)
  const onSetFormFileUser = async (file) => {
    const response = await uploadFile(file[0])
    const profilePic = response.data.name
    setAvatar(`${S3_URL}/${profilePic}`)
    setValue('sale.profilePic', profilePic)
  }

  useEffect(() => {
    if (isEdit && data) {
      setIsSaleAgentEdit(false)

      if (data?.id) {
        const regionSelected = data.UserRegion?.map((region)=> region?.Region?.id)
        setSelectedOptionsVisible(regionSelected || [])
      
      const SaleIds = _.map(data, (sale) => ({
        id: data?.id,
        profilePic: sale?.profilePic,
        username: sale?.username,
        email: sale?.email,
        password: sale?.password,
      }))
      setValue('sale', data)
      setValue('sale', {
        id: data?.id,
        profilePic: data?.profilePic,
        username: data?.username,
       
        // role: data?.role,
        email: data?.email,
        // phone: data?.phone,
        password: data?.password,
        // confirmPassword: data?.confirmPassword,
      })
      setValue('SaleIds', SaleIds)
     
      setSaleAgentForm(
        _.map(data, (sale) => ({
          id: data?.id,
          profilePic: sale?.profilePic,
          username: sale?.username,
          email: sale?.email,
          regionId: {
            label : sale?.name,
            value : sale?.id
          },
          // phone: sale?.phone,
          password: sale?.password,
          confirmPassword: sale?.confirmPassword,
        })),
      )
    }
  }
  }, [isEdit])

  const handleDialogClose = () => {
    setTimeout(() => {
      reset({
        sale: null,
        SaleIds: null,
      })
    }, 700)
    setAvatar(null)
    setIsSaleAgentEdit(false)
    onClose()
    setSaleAgentForm([])
  }

  const onSubmit = async (values) => {
    try {
      values.sale.regionId = selectedOptionsVisible;
      values.sale.role = DEFAULT_ROLES.SALE_MANAGER;
      if(data?.id){

        values.sale.id =data?.id
      }
      setLoading(true)
      const response = await saveUser(values?.sale)
      setLoading(false)
      toast.push(
        <Notification className="mb-4" type="success">
          Sale Agent Created !
        </Notification>,
      )
      handleDialogClose()
    } catch (error) {
      setLoading(false)
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>,
      )
    }
  }

  const { t } = useTranslation()

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
        {t('heading.Add New Sale Agent')}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer className="p-4">
          <div className="max-h-[65vh] overflow-y-auto ">
            <Card
              className="dark:bg-gray-700 bg-white mb-2"
              header={<h5>{t('heading.Sale Agent Details')}</h5>}
            >
              {isSaleAgentEdit ? (
                watcher.sale?.id && (
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
                    label={t('label.Agent Name')}
                    asterisk
                    invalid={errors.sale?.username}
                    errorMessage="Agent name is required!"
                  >
                    <Controller
                      control={control}
                      name="sale.username"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder={t('label.Agent Name')}
                          autocomplete="off"
                          {...field}
                        />
                      )}
                    />
                  </FormRow>
                  <FormRow
                    label={t('label.Email')}
                    asterisk
                    invalid={errors.sale?.email}
                    errorMessage="Email is required!"
                  >
                    <Controller
                      control={control}
                      rules={{ required: true }}
                      name="sale.email"
                      render={({ field }) => (
                        <Input
                          type="email"
                          placeholder={t('label.Email')}
                          {...field}
                        />
                      )}
                    />
                  </FormRow>
                  <FormRow
                          label={t('label.Region')}
                          invalid={errors?.sale?.regionId}
                          errorMessage="Please Select Atleast One Option"
                          required
                        >
                          <Controller
                            control={control}
                            name="sale?.regionId"
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={RegionList}
                                placeholder={t('label.Region')}
                                isMulti
                                onChange={(selected) => {
                                  const selectedValues = selected.map(
                                    (option) => option.value,
                                  )
                                  setSelectedOptionsVisible(selectedValues)
                                  field.onChange(selectedValues)
                                }}
                                value={RegionList.filter((option) =>
                                  selectedOptionsVisible.includes(option.value),
                                )}
                              />
                            )}
                          />
                        </FormRow>
                 

                  <FormRow
                    label={t('label.Password')}
                    asterisk
                    invalid={errors.sale?.password}
                    errorMessage="Password is required!"
                  >
                    <Controller
                      control={control}
                      name="sale.password"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <PasswordInput
                          type="password"
                          placeholder={t('label.Password')}
                          {...field}
                        />
                      )}
                    />
                  </FormRow>

                   <FormRow
                    label={t('label.Confirm Password')}
                    asterisk
                    invalid={errors.sale?.confirmPassword}
                    errorMessage="Password mis match!"
                  >
                    <Controller
                      control={control}
                      name="sale.confirmPassword"
                      rules={{
                        validate: () =>
                          watcher?.sale?.password ===
                          watcher?.sale?.confirmPassword,
                      }}
                      render={({ field }) => (
                        <PasswordInput
                          type="password"
                          placeholder={t('label.Confirm Password')}
                          {...field}
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