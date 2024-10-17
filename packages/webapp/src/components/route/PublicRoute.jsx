import React  from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import appConfig from '@/configs/app.config'
import useAuth from '@/utils/hooks/useAuth'

const { AUTHENTICATED_ENTRY_PATH } = appConfig

const PublicRoute = () => {

    const { authenticated } = useAuth()
  
	return authenticated ? <Navigate to={AUTHENTICATED_ENTRY_PATH} /> : <Outlet/>
}

export default PublicRoute