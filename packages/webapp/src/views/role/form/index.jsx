import {
  Dialog,
  FormContainer,
  Input,
  Card,
  Button,
  toast,
  Notification,
} from '@/components/ui'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { RiSave2Line } from 'react-icons/ri'
import FormRow from './FormRow'
import { useParams } from 'react-router-dom'
import { saveRole } from '@/services/role'
import { useTranslation } from 'react-i18next'

const RoleForm = (props) => {
  const { isEdit = false, open = false, onClose, data = {} } = props
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
  } = useForm({
    defaultValues: {
      role: { name: null },
    },
  })

  const watcher = useWatch({ control })
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [roleForm, setRoleForm] = useState([])
  const [isRoleEdit, setIsRoleEdit] = useState(false)

  useEffect(() => {
  	if (isEdit && data) {
  		setValue("role", data);
  	}
  }, [isEdit]);

  const handleDialogClose = () => {
    setTimeout(() => {
      reset()
    }, 700)
    setIsRoleEdit(false)
    onClose()
    setRoleForm([])
  }
  const onSubmit = async (values) => {
    try {
      // values.companyId = params.companyId;
      setLoading(true)
      const response = await saveRole(values.role)
      setLoading(false)
      toast.push(
        <Notification className="mb-4" type="success">
          {response?.data.message}
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
        {t('heading.Add New Roles')}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer>
          <div className="p-4">
            <Card className="dark:bg-gray-700 bg-white">
              <FormRow
                border={false}
                asterisk
                label={t('label.Role')}
                invalid={errors.role?.name}
                errorMessage="Role is required!"
              >
                <Controller
                  control={control}
                  name="role.name"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder={t('label.Role')}
                      {...field}
                    />
                  )}
                />
              </FormRow>
            </Card>
          </div>
          <div className="p-4 flex items-center justify-end dark:bg-gray-700 bg-white rounded-bl-lg rounded-br-lg">
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
        </FormContainer>
      </form>
    </Dialog>
  )
}
export default RoleForm
