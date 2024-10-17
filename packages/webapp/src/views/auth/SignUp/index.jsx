import React from 'react'
import SignUpForm from './SignUpForm'
import { useTranslation } from "react-i18next";
const SignUp = () => {
	const { t } = useTranslation();
	return (
		<>
			<div className="mb-8">
				<h3 className="mb-1">{t("heading.Sign Up")}</h3>
				<p>{t("heading.And lets get started")} </p>
			</div>
			<SignUpForm disableSubmit={false} />
		</>
	)
}

export default SignUp