import { useMemo } from "react";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";

function useAuthority(
	authority = [],
	superAdmin = false,
	companyAdmin = false,
	emptyCheck = false
) {
	const { user } = useSelector((state) => state.auth.loggedInUser);
	const userAuthority = user?.authority;

	const roleMatched = useMemo(() => {
		return authority.some((role) => userAuthority.includes(role));
	}, [authority, userAuthority]);

	if (
		superAdmin ||
		isEmpty(authority) ||
		isEmpty(userAuthority) ||
		typeof authority === "undefined"
	) {
		return !emptyCheck;
	}

	return roleMatched;
}

export default useAuthority;
