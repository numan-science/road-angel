import React, { useState } from 'react'
import { Button, FormContainer, toast, Notification } from '@/components/ui'
import FormDesription from './FormDesription'
import { Controller, useForm, useWatch } from 'react-hook-form'
import _ from 'lodash'
import { updatePassword } from '@/services/user'
import { PasswordInput } from '@/components/shared'
import FormRow from './FormRow'
import { useTranslation } from 'react-i18next'

const Password = () => {
  const { t } = useTranslation()
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm()
  const watcher = useWatch({ control })

  const [loading, setLoading] = useState(false)

  const onFormSubmit = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Confirm password not matched with New password.
        </Notification>,
      )
      return
    }
    try {
      setLoading(true)
      const response = await updatePassword(values)
      toast.push(<Notification title={response.data.message} type="success" />)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>,
      )
    }
  }

  const resetForm = () => {
    reset()
  }
  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <FormContainer>
        <FormDesription title={t('title.Password')} />

        {/* <FormRow
					label="Current Password"
					name="currentPassword"
					errors={errors}
				>
					<Input
						type="password"
						{...register("currentPassword", { required: true })}
						placeholder="Current Password"
						autoComplete="off"
						prefix={<HiOutlineKey className="text-xl" />}
					/>
				</FormRow>

				<FormRow label="New Password" name="newPassword" errors={errors}>
					<Input
						type="password"
						{...register("newPassword", { required: true })}
						placeholder="New Password"
						autoComplete="off"
						prefix={<HiOutlineKey className="text-xl" />}
					/>
				</FormRow>

				<FormRow
					label="Confirm Password"
					name="confirmPassword"
					errors={errors}
				>
					<Input
						type="password"
						{...register("confirmPassword", { required: true })}
						placeholder="Confirm Password"
						autoComplete="off"
						prefix={<HiOutlineKey className="text-xl" />}
					/>
				</FormRow> */}

        <FormRow
          label={t('label.Current Password')}
          asterisk
          invalid={errors.currentPassword}
          errorMessage="Password is required!"
        >
          <Controller
            control={control}
            name="currentPassword"
            rules={{ required: true }}
            render={({ field }) => (
              <PasswordInput
                type="password"
                placeholder={t('label.Current Password')}
                {...field}
              />
            )}
          />
        </FormRow>
        <FormRow
          label={t('label.New Password')}
          asterisk
          invalid={errors.newPassword}
          errorMessage="newPassword is required!"
        >
          <Controller
            control={control}
            name="newPassword"
            rules={{ required: true }}
            render={({ field }) => (
              <PasswordInput
                type="password"
                placeholder={t('label.New Password')}
                {...field}
              />
            )}
          />
        </FormRow>
        <FormRow
          label={t('label.Confirm Password')}
          asterisk
          invalid={errors.confirmPassword}
          errorMessage="Password mis match!"
        >
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              validate: () => watcher?.newPassword === watcher?.confirmPassword,
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

        <div className="mt-4 ltr:text-right">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            type="button"
            onClick={resetForm}
          >
            {t('button.Reset')}
          </Button>
          <Button variant="solid" loading={loading} type="submit">
            {loading ? t('button.Updating') : t('button.Update')}
          </Button>
        </div>
      </FormContainer>
    </form>
  )
}

export default Password
