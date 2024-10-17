import { Loading } from "@/components/shared";
import { FormContainer } from "@/components/ui";
import {
	getPostCardStates
} from "@/services/dashboard";
import React, { useEffect, useState } from "react";
import Statistic from "./components/Statistic";
import InsuranceLists from "./components/InsuranceLists";
import { getInsuranceCompany } from "@/services/insurance-company";

const Dashboard = () => {
	// const { selectedCompany } = useSelector((state) => state.meta);
	const [loading, setLoading] = useState(false);
	const [statistics, setStatistics] = useState([]);
	const [insuranceList, setInsuranceList] = useState([]);

	useEffect(() => {
		setLoading(true);
		getCardStats();
		getInsuranceListData();
		setLoading(false);
	}, []);

	const getCardStats = async (options = {}) => {
		const response = await getPostCardStates(options);
		setStatistics(response.data);
	};


	const getInsuranceListData = async (options = {}) => {
		const response = await getInsuranceCompany(options);
		setInsuranceList(response?.data.rows);
	};
 

	return (
		<FormContainer>
			<div className="flex flex-col gap-4 h-full">
				<Loading loading={loading}>
					<Statistic data={statistics} />
					<InsuranceLists data={insuranceList} />
				</Loading>
			</div>
		</FormContainer>
	);
};

export default Dashboard;
