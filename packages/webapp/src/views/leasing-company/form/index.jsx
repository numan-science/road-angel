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
import { saveLeasingCompany, updateLeasingCompany } from '@/services/leasingCompanies'

const UserForm = (props) => {
  const { isEdit = false, open = false, onClose, data = {}, roles = [] } = props
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control, 
    reset,
  } = useForm({
    defaultValues: {
      leasingCompany: {},
      leasingCompanyIds: [],
    },
  })

  const watcher = useWatch({ control })
  const [avatar, setAvatar] = useState(null)
  const [loading, setLoading] = useState(false)
  const [insuranceCompanyForm, setinsuranceCompanyForm] = useState([])

  const [isLeasingInsuranceCompanyEdit, setIsLeasingInsuranceCompanyEdit] = useState(false)

  useEffect(() => {
    if (isEdit && data) {
      setIsLeasingInsuranceCompanyEdit(false)
      const leasingCompanyIds = _.map(data, (leasingCompany) => ({
        id: data.id,
        logo: leasingCompany?.logo,
        name: leasingCompany?.name,
      }))

      setValue('leasingCompany', data)
      setValue('leasingCompany', {
        id: data?.id,
        logo: data?.logo,
        name: data?.name,
      })
      setValue('leasingCompanyIds', leasingCompanyIds)
      setinsuranceCompanyForm(
        _.map(data, (leasingCompany) => ({
          id: data.id,
          logo: leasingCompany?.logo,
          name: leasingCompany?.name,

        })),
      )
    }
  }, [isEdit])

  const handleDialogClose = () => {
    setTimeout(() => {
      reset({
        leasingCompany: null,
        leasingCompanyIds: null,
      })
    }, 700)
    setAvatar(null)
    setIsLeasingInsuranceCompanyEdit(false)
    onClose()
    setinsuranceCompanyForm([]) 
  }

  const onSubmit = async (values) => {
    try {
      const save = data?.id ? updateLeasingCompany : saveLeasingCompany
      setLoading(true)
      const response = await save(values?.leasingCompany, data?.id)
      setLoading(false)
      toast.push(
        <Notification className="mb-4" type="success">
          Leasing Company Created !
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
		setValue("leasingCompany.logo", profilePic);
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
        {t('heading.Add New Leasing Insurance Company')}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer className="p-4"> 
          <div className="max-h-[65vh] overflow-y-auto ">
            <Card
              className="dark:bg-gray-700 bg-white mb-2"
              header={<h5>{t('heading.Company Details')}</h5>}
            >
              {isLeasingInsuranceCompanyEdit ? (
                watcher.leasingCompany?.id && (
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
                    invalid={errors.leasingCompany?.name}
                    errorMessage="Company name is required!"
                  >
                    <Controller
                      control={control}
                      name="leasingCompany.name"
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