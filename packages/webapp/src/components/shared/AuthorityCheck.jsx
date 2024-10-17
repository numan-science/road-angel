import React from "react";
import PropTypes from "prop-types";
import useAuthority from "@/utils/hooks/useAuthority";
import { useSelector } from "react-redux";
import _ from "lodash";

const AuthorityCheck = (props) => {
	const {
		authority = [],
		children,
		superAdmin = false,
		// companyAdmin = false,
		admin = false,
		all = false,
		superRoute,
	} = props;
	const { auth, meta } = useSelector((state) => state);
	const { loggedInUser } = auth;

	if (_.isEmpty(authority)) {
		if (all) {
			return children;
		}

		if (admin) {
			return loggedInUser.isSuperAdmin
      //  || loggedInUser.isCompanyAdmin
				? children
				: null;
		}

		if (loggedInUser.isSuperAdmin && superAdmin) {
			if (!superRoute && !meta.selectedCompany) {
				return null;
			} else {
				return children;
			}
		}

		// if (loggedInUser.isCompanyAdmin 
    //   && companyAdmin
    //   ) {
		// 	return children;
		// }

		return <></>;
	}

	const roleMatched = useAuthority(authority, superAdmin,
    //  companyAdmin
     );

	return roleMatched ? children : <></>;
};

AuthorityCheck.propTypes = {
	userAuthority: PropTypes.array,
	authority: PropTypes.array,
};

export default AuthorityCheck;
