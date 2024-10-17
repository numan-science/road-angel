import React, { Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { Loading } from "@/components/shared";
import {
	protectedRoutes,
	publicRoutes,
} from "@/configs/routes.config";
import PageContainer from "@/components/template/PageContainer";
import PublicRoute from "@/components/route/PublicRoute";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import AuthorityGuard from "@/components/route/AuthorityGuard";
import AppRoute from "@/components/route/AppRoute";
// import { isFirstTimeLogin } from "@/services/user";
import { setGreeting } from "@/store/auth/sessionSlice";
import useAuth from "@/utils/hooks/useAuth";


const AllRoutes = (props) => {
	const dispatch = useDispatch();
	const { authenticated } = useAuth();

	const { auth } = useSelector((state) => state);
	const { session, loggedInUser } = auth;
	const { signedIn, greeted } = session;
	const { user } = loggedInUser;
	const userAuthority = user?.authority;

	const [loginCheck, setLoginCheck] = useState(false);
	const [isFirstTime, setIsFirstTime] = useState(false);

	// useEffect(() => {
	// 	if (signedIn && !loginCheck && !greeted) {
	// 		getLoginTimes();
	// 	}
	// });

	// const getLoginTimes = async () => {
	// 	setLoginCheck(true);
	// 	const response = await isFirstTimeLogin();
	// 	if (response.data.isFirstTime) {
	// 		dispatch(setGreeting(true));
	// 		setIsFirstTime(true);
	// 	}
	// };

	const handleClose = () => setIsFirstTime(false);

	return (
		<>
			<Routes>
				<Route path="/" element={<ProtectedRoute />}>
					{protectedRoutes.map((route, index) => (
						<Route
							key={route.key + index}
							path={route.path}
							element={
								<AuthorityGuard userAuthority={userAuthority} {...route}>
									<PageContainer {...props} {...route.meta}>
										<AppRoute
											routeKey={route.key}
											component={route.component}
											{...route.meta}
										/>
									</PageContainer>
								</AuthorityGuard>
							}
						/>
					))}
				</Route>
				<Route path="*" element={<Navigate to="/" replace />} />
				<Route path="/" element={<PublicRoute />}>
					{publicRoutes.map((route) => (
						<Route
							key={route.path}
							path={route.path}
							element={
								<AppRoute
									routeKey={route.key}
									component={route.component}
									{...route.meta}
								/>
							}
						/>
					))}
				</Route>
			</Routes>
		</>
	);
};

const Views = (props) => {
	return (
		<Suspense fallback={<Loading loading />}>
			<AllRoutes {...props} />
		</Suspense>
	);
};

export default Views;
