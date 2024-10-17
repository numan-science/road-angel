import React, { useState } from 'react'
import {
  Input,
  Button,
  Checkbox,
  FormItem,
  FormContainer,
  Notification,
  toast,
} from '@/components/ui'
import { useForm } from 'react-hook-form'
import { ActionLink } from '@/components/shared'
import useAuth from '@/utils/hooks/useAuth'
import { useTranslation } from 'react-i18next'

const SignInForm = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const {
    disableSubmit = false,
    className,
    forgotPasswordUrl = '/forgot-password',
    signUpUrl = '/sign-up',
  } = props

  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const { t } = useTranslation()

  const onSubmit = async (values) => {
    setLoading(true)
    const result = await signIn(values)
    setLoading(false)
    if (result.status === 'failed') {
      toast.push(
        <Notification className="mb-4" type="danger">
          {result.message}
        </Notification>,
      )
    }
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer>
          <FormItem
            label={t('label.Email')}
            invalid={errors.email}
            errorMessage="Email is required!"
          >
            <Input
              {...register('email', { required: true })}
              type="text"
              placeholder="Email"
            />
          </FormItem>

          <FormItem
            label={t('label.Password')}
            invalid={errors.password}
            errorMessage="Password is required!"
          >
            <Input
              {...register('password', { required: true })}
              type="password"
              placeholder={t('label.Password')}
            />
          </FormItem>

          <div className="flex justify-between mb-6">
            <Checkbox
              {...register('rememberMe', { value: true })}
              id="rememberMe"
              className="mb-0"
              children={t('label.Remember Me')}
            />

            {/* <ActionLink to={forgotPasswordUrl}>Forgot Password?</ActionLink> */}
          </div>

          <Button
            block
            loading={loading}
            variant="solid"
            type="submit"
            disabled={disableSubmit}
          >
            {loading ? t('label.Signing In ...') : t('label.Sign In')}
          </Button>

          <div className="mt-4 text-center">
            <span>{t("label.Don't have an account yet?")} </span>
            <ActionLink to={signUpUrl}>{t('label.Sign up')}</ActionLink>
          </div>
        </FormContainer>
      </form>
    </div>
  )
}
export default SignInForm

{
  /* <input
              {...register('rememberMe', {
                required: true || false,
                validate: (value) =>
                  value === true || value === false || 'rememberMe must be checked',
              }
              )}
              id="rememberMe"
              type="checkbox"
            />
            <label htmlFor="rememberMe">{t('label.Remember Me')}</label> */
}
