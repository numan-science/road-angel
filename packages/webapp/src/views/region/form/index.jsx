import {
  Avatar,
  Button,
  Card,
  Dialog,
  FormContainer,
  Input,
  Notification,
  // Select,
  toast,
  Upload,
} from '@/components/ui'
import { saveRegion, updateRegion } from '@/services/region'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RiSave2Line } from 'react-icons/ri'
import FormRow from './FormRow'

const UserForm = (props) => {
  const { isEdit = false, open = false, onClose, data = {} } = props
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm({
    defaultValues: {
      region: {},
      RegionIds: [],
    },
  })

  const watcher = useWatch({ control })
  const [avatar, setAvatar] = useState(null)
  const [loading, setLoading] = useState(false)
  const [regionForm, setRegionForm] = useState([])

  const [isRegionEdit, setIsRegionEdit] = useState(false)

  useEffect(() => {
    if (isEdit && data) {
      setIsRegionEdit(false)
      const RegionIds = _.map(data, (region) => ({
        id: data.id,
        name: region?.name,
      }))

      setValue('region', data)
      setValue('region', {
        id: data?.id,
        name: data?.name,
      })
      setValue('RegionIds', RegionIds)
      setRegionForm(
        _.map(data, (region) => ({
          id: data.id,
          name: region?.name,
        })),
      )
    }
  }, [isEdit])

  const handleDialogClose = () => {
    setTimeout(() => {
      reset({
        region: null,
        RegionIds: null,
      })
    }, 700)
    setAvatar(null)
    setIsRegionEdit(false)
    onClose()
    setRegionForm([])
  }  

  const onSubmit = async (values) => {
    try {
      const save = data?.id ? updateRegion : saveRegion
      setLoading(true)
      const response = await save(values?.region, data?.id)
      setLoading(false)
      toast.push(
        <Notification className="mb-4" type="success">
          Region Created !
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
        {t('heading.Add New Region')}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer className="p-4">
          <div className="max-h-[65vh] overflow-y-auto ">
            <Card
              className="dark:bg-gray-700 bg-white mb-2"
              header={<h5>{t('heading.Region Details')}</h5>}
            >
              {isRegionEdit ? (
                watcher.region?.id && (
                  <div className="text-left grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4"></div>
                )
              ) : (
                <>
                  <FormRow
                    label={t('label.Region Name')}
                    asterisk
                    invalid={errors.region?.name}
                    errorMessage="Region name is required!"
                  >
                    <Controller
                      control={control}
                      name="region.name"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder={t('label.Region Name')}
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
