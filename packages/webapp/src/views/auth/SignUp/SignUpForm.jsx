import React, { useState } from "react";
import {
  Input,
  Button,
  FormItem,
  FormContainer,
  Notification,
  toast,
  Alert,
} from "@/components/ui";
import { ActionLink } from "@/components/shared";
import { onSignInSuccess } from "@/store/auth/sessionSlice";
import { setUser } from "@/store/auth/userSlice";
import appConfig from "@/configs/app.config";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userSignUp } from "@/services/auth";
import { useForm } from "react-hook-form";
import { DEFAULT_ROLES } from "@/constants/app.constant";
import useTimeOutMessage from "@/utils/hooks/useTimeOutMessage";
import { useTranslation } from "react-i18next";

const SignUpForm = (props) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { disableSubmit = false, className, signInUrl = "/sign-in" } = props;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useTimeOutMessage();

  const onSignUp = async (values = {}) => {
    setLoading(true);
    if (!isPasswordMatched(values)) {
      return;
    }
    try {
      values.roleId = DEFAULT_ROLES.USER;
      const resp = await userSignUp(values);
      const { token } = resp.data;
      dispatch(onSignInSuccess(token));
      if (resp.data.user) {
        dispatch(
          setUser(
            resp.data.user || {
              avatar: "",
              username: "Anonymous",
              authority: [],
              email: "",
            }
          )
        );
      }
      navigate(appConfig.TOUR_PATH);
    } catch (error) {
      setLoading(false);
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>
      );
    }
  };

  const isPasswordMatched = (values) => {
    if (values.password !== values.confirmPassword) {
      setMessage("Password did not match Confirm Password");
      setLoading(false);
      return false;
    }
		return true
  };

  return (
    <div className={className}>
      {message && (
        <Alert className="mb-4" type="danger" showIcon>
          {message}
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSignUp)}>
        <FormContainer>
          <FormItem
            label={t("label.User Name")}
            invalid={errors.username}
            errorMessage="User name is required!"
          >
            <Input
              {...register("username", { required: true })}
              type="text"
              placeholder={t("label.User Name")}
            />
          </FormItem>
          <FormItem
            label={t("label.Email")}
            invalid={errors.email}
            errorMessage="Email is required!"
          >
            <Input
              {...register("email", { required: true })}
              type="email"
              placeholder={t("label.Email")}
            />
          </FormItem>
          <FormItem
            label={t("label.Password")}
            invalid={errors.password}
            errorMessage="Password is required!"
          >
            <Input
              {...register("password", { required: true })}
              type="password"
              placeholder={t("label.Password")}
            />
          </FormItem>
          <FormItem
            label={t("label.Confirm Password")}
            invalid={errors.confirmPassword}
            errorMessage="Password Confirmation is required!"
          >
            <Input
              {...register("confirmPassword", { required: true })}
              type="password"
              placeholder={t("label.Confirm Password")}
            />
          </FormItem>
          <Button
            block
            loading={loading}
            variant="solid"
            type="submit"
            disabled={disableSubmit}
          >
            {loading ? t("heading.Creating Account...") : t("heading.Sign Up")}
          </Button>
          <div className="mt-4 text-center">
            <span>{t("heading.Already have an account?")}</span>
            <ActionLink to={signInUrl}>{t("label.Sign In")}</ActionLink>
          </div>
        </FormContainer>
      </form>
    </div>
  );
};

export default SignUpForm;
