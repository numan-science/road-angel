import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { Container, AuthorityCheck } from "@/components/shared";
import { PAGE, DEFAULT_PAGE_SIZE } from "@/constants/app.constant" ;
import { toast, Button } from "@/components/ui";
import Filters from "./list/Filters";
import UserForm from "./form";
import BusinessList from "./list";
import { useTranslation } from "react-i18next";
import { Notification} from "@/components/ui";
import { getAllBusinessCase } from "@/services/business-case";
import { getRegion } from "@/services/region";
import { getRoles } from "@/services/role";
import { useForm } from "react-hook-form";


const businessCase = (props) => {
	const { control, reset, setValue } = useForm({
		defaultValues: {
		  status: null,
		  roleId: [],
		  regionId: [],
		},
	  })
	const params = useParams();
	const { t } = useTranslation();
	const [BusinessCaseList, setBusinessCaseList] = useState([]);
	const [roles, setRoles] = useState([]);
	const [RegionList, setRegionList] = useState([]);
	const [visible, setVisible] = useState(false);
	const [count, setCount] = useState(0);
	const [page, setPage] = useState(PAGE);
	const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
	const [loading, setLoading] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [businessCase, setBusinessCase] = useState(null);
	

	useEffect(() => {
		getBusinessCaseData();
		getRegionData();
		getRolesData();

	}, []);
	const getBusinessCaseData = async (options={}) => {
		options = _.pickBy(options, _.identity);
		try {
			const response = await getAllBusinessCase(options);
			setBusinessCaseList(response.data.rows);
		} catch (error) {
			toast.push(
				<Notification className="mb-4" type="danger">
					{error?.response?.data.message}
				</Notification>
			);
		}
		setLoading(false);
	};
	

	const getRegionData = async () => {
		try {
			const response = await getRegion();
			setRegionList(response.data.rows);
		} catch (error) {
			toast.push(
				<Notification className="mb-4" type="danger">
					{error?.response?.data.message}
				</Notification>
			);
		}
		setLoading(false);
	};

	const getRolesData = async () => {
		setLoading(true);
		try {
			const response = await getRoles();
			const data = _.map(response.data, (row) => ({
				value: row.id,
				label: row.name,
			}));
			setRoles(data);
		} catch (error) {
			toast.push(
				<Notification className="mb-4" type="danger">
					{error?.response?.data.message}
				</Notification>
			);
		}
		setLoading(false);
	};

	const addNewPost = () => {
		setVisible(true);
	};
	
	const handleOnClear = () => {
		reset()
		getBusinessCaseData()
	  }

	const onDialogClose = () => {
		setBusinessCase(null);
		setTimeout(() => {
			setIsEdit(false);
		}, 700);
		setVisible(false);
		getBusinessCaseData(page, limit);
	};

	const handleEditBusinessCase = (businessCase) => {
		setIsEdit(true);
		setVisible(true);
		setBusinessCase(businessCase);
	};

	return (
		<Container>
			<UserForm
				open={visible}
				onClose={onDialogClose}
				isEdit={isEdit}
				data={businessCase}
			/>
			<div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
				<div className="flex flex-col lg:flex-row justify-between lg:items-center">
					<h3>{t("heading.Business Case")}</h3>
				</div>
				<Filters getTableData={getBusinessCaseData} RegionList={RegionList} roles={roles} handleOnClear={handleOnClear} 
				setValue={setValue} reset={reset}  control={control}
				/>
			</div>
			<Container className="p-4">
				<BusinessList
					data={BusinessCaseList}
					count={count}
					page={page}
					limit={limit}
					getTableData={getBusinessCaseData}
					loading={loading}
					handleEditClick={handleEditBusinessCase}
				    reset={reset}
				/>
			</Container>

		</Container>
	);
};

export default businessCase;