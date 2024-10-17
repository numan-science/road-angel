import { useDispatch, useSelector } from "react-redux";
import useAuth from "@/utils/hooks/useAuth";
import { setPanelExpand } from "@/store/theme/themeSlice";

function navFunctions() {
	const { signOut } = useAuth();
	const dispatch = useDispatch();
	const panelExpand = useSelector((state) => state.theme.panelExpand);

	const togglePanel = async () => {
		dispatch(setPanelExpand(!panelExpand));
		if (panelExpand) {
			const bodyClassList = document.body.classList;
			if (bodyClassList.contains("drawer-lock-scroll")) {
				bodyClassList.remove("drawer-lock-scroll", "drawer-open");
			}
		}
	};

	return {
		signOut,
		togglePanel,
	};
}

export default navFunctions;
