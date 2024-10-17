import React from 'react'
import SignInForm from './SignInForm'
// import MapView from '@/components/ui/MapView'
import { useTranslation } from "react-i18next";


const SignIn = () => {
	const { t } = useTranslation();
	return (
		<> 
			<div className="mb-8">
				<h3 className="mb-1">{t("heading.Welcome back!")}</h3>
				<p>{t("description.Please enter your credentials to sign in!")}</p>
			</div>
			<SignInForm disableSubmit={false} />
			{/* <MapView/> */}
		</>
	)
}

export default SignIn