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

import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { HiOutlineUser } from 'react-icons/hi'
import { RiSave2Line } from 'react-icons/ri'
import FormRow from './FormRow'
import { uploadFile } from '@/services/uploads'
import { S3_URL } from '@/constants/api.constant'
import { saveBusinessCase, updateBusinessCase } from '@/services/submit-case'

const UserForm = (props) => {
  const { isEdit = false, open = false, onClose, data = {}} = props
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control, 
    reset,
  } = useForm({
    defaultValues: {
      businessCase: {},
      businessCaseIds: [],
    },
  })

  const watcher = useWatch({ control })
  const [avatar, setAvatar] = useState(null)
  const [loading, setLoading] = useState(false)
  const [businessCaseForm, setBusinessCaseForm] = useState([])

  const [isBusinessCaseEdit, setIsBusinessCaseEdit] = useState(false)

  useEffect(() => {
    if (isEdit && data) {
      setIsBusinessCaseEdit(false)
      const businessCaseIds = _.map(data, (businessCase) => ({
        id: data.id,
        logo: businessCase?.logo,
        name: businessCase?.name,
        // role: businessCase?.role,
        rating: businessCase?.rating,
      }))

      setValue('businessCase', data)
      setValue('businessCase', {
        id: data?.id,
        logo: data?.logo,
        name: data?.name,
        // role: data?.role,
        rating: data?.rating,
      })
      setValue('businessCaseIds', businessCaseIds)
      setBusinessCaseForm(
        _.map(data, (businessCase) => ({
          id: data.id,
          logo: businessCase?.logo,
          name: businessCase?.name,
          rating: businessCase?.rating,
        })),
      )
    }
  }, [isEdit])

  const handleDialogClose = () => {
    setTimeout(() => {
      reset({
        businessCase: null,
        businessCaseIds: null,
      })
    }, 700)
    setAvatar(null)
    setIsBusinessCaseEdit(false)
    onClose()
    setBusinessCaseForm([]) 
  }

  const onSubmit = async (values) => {
    try {
      values.businessCase.roleId = values.businessCase.roleId.value;
      const save = data?.id ? updateBusinessCase : saveBusinessCase
      setLoading(true)
      const response = await save(values?.businessCase, data?.id)
      setLoading(false)
      toast.push(
        <Notification className="mb-4" type="success">
          Business Case Created !
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
  const onSetFormFileUser = async (file) => {
		const response = await uploadFile(file[0]);
		const profilePic = response.data.name;
		setAvatar(`${S3_URL}/${profilePic}`);
		setValue("businessCase.logo", profilePic);
	};

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
        {t('heading.Add New Insurance Company')}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer className="p-4"> 
          <div className="max-h-[65vh] overflow-y-auto ">
            <Card
              className="dark:bg-gray-700 bg-white mb-2"
              header={<h5>{t('heading.Company Details')}</h5>}
            >
              {isBusinessCaseEdit ? (
                watcher.businessCase?.id && (
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
                  <FormRow label={t("label.Avatar")}>
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
                    label={t('label.Company Name')}
                    asterisk
                    invalid={errors.businessCase?.name}
                    errorMessage="Company name is required!"
                  >
                    <Controller
                      control={control}
                      name="businessCase.name"
                      rules={{ required: true }}
                      render={({ field }) => (  
                        <Input
                          type="text"
                          placeholder={t('label.Company Name')}
                          autocomplete="off"
                          {...field}
                        />
                      )}
                    />
                  </FormRow>
                  <FormRow
										label={t("label.Role")}
										asterisk
										border={false}
										invalid={errors.businessCase?.roleId}
										errorMessage="Role is required!"
									>
										<Controller
											control={control}
											rules={{ required: true }}
											name="businessCase.roleId"
											render={({ field }) => (
												<Select
													isClearable
													{...field}
													placeholder={t("label.Select Role")}
													options={roles}
												/>
											)}
										/>
									</FormRow>

                  <FormRow
                    label={t('label.Rating')}
                    asterisk
                    invalid={errors.businessCase?.rating}
                    errorMessage="Rating is required!"
                  >
                    <Controller
                      control={control}
                      name="businessCase.rating"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Input
                          type="number"
                          placeholder={t('label.Rating')}
                          autocomplete="off"
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