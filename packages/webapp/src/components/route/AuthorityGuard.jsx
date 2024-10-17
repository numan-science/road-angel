import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuthority from "@/utils/hooks/useAuthority";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCompany } from "@/store/meta";

const AuthorityGuard = (props) => {
	const {
		userAuthority = [],
		authority = [],
		children,
		superAdmin = false,
		companyAdmin = false,
		admin = false,
		all = false,
		superRoute,
	} = props;
	const dispatch = useDispatch();
	const { meta, auth } = useSelector((state) => state);
	const { loggedInUser } = auth;
	const params = useParams();

	useEffect(() => {
		dispatch(setCompany(params.companyId));
	}, [params.companyId]);

	if (all) {
		return children;
	}

	if (admin && (loggedInUser.isSuperAdmin
		//  || loggedInUser.isCompanyAdmin
		 )) {
		return children;
	}

	if (loggedInUser.isSuperAdmin) {
		if (superRoute && !params.companyId) {
			return children;
		}

		if (!superRoute && params.companyId) {
			return children;
		}

		if (!superRoute && !params.companyId) {
			return null;
		}
	}

	// const to = meta.selectedCompany
	// 	? `/access-denied`
	// 	: "/access-denied";

	// if (loggedInUser.isCompanyAdmin) {
	// 	return companyAdmin === superAdmin ? children : <Navigate to={to} />;
	// }

	const roleMatched = useAuthority(authority, superAdmin, companyAdmin);

	return roleMatched ? children 
	: <Navigate to="/"
	 />;
};

export default AuthorityGuard;
