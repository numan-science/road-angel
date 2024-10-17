import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { Container } from "@/components/shared";
import { PAGE, DEFAULT_PAGE_SIZE } from "@/constants/app.constant" ;
import { toast } from "@/components/ui";
import Filters from "./list/Filters";
import UserForm from "./form";
import CompanyUserList from "./list";
import { useTranslation } from "react-i18next";
import { Notification} from "@/components/ui";
import { getRoles } from "@/services/role"; 
import { getAccidentCase } from "@/services/submit-case";
import { getRegion } from "@/services/region";
import { useForm } from "react-hook-form";


const caseList = (props) => {
	const { control, reset, setValue } = useForm({
		defaultValues: {
		  status: null,
		  roleId: [],
		  regionId: [],
		},
	  })
	const params = useParams();
	const { t } = useTranslation();
	const [accidentCaseList, setAccidentCaseList] = useState([]);
	const [visible, setVisible] = useState(false);
	const [count, setCount] = useState(0);
	const [page, setPage] = useState(PAGE);
	const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
	const [loading, setLoading] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [roles, setRoles] = useState([]);
	const [RegionList, setRegionList] = useState([]);	
	const [accidentCase, setAccidentCase] = useState(null);
	useEffect(() => {
		getAccidentCaseData(page, limit);
		getRegionData();
		getRolesData();
		// getRolesData();
	}, []);
	const getAccidentCaseData = async ( options = {}) => {
		options = _.pickBy(options, _.identity);
		try {
			const response = await getAccidentCase(options);
			setAccidentCaseList(response.data?.rows);
			setCount(response.data.count);
			setLimit(limit);
			setPage(page);
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

	const onDialogClose = () => {
		setAccidentCase(null);
		setTimeout(() => {
			setIsEdit(false);
		}, 700);
		setVisible(false);
		getAccidentCaseData(page, limit);
	};

	const handleEditInsuranceCompany = (accidentCase) => {
		setIsEdit(true);
		setVisible(true);
		setAccidentCase(accidentCase);
	};
	
	const handleOnClear = () => {
		reset()
		getAccidentCaseData()
	  }
	return (
		<Container>
			<UserForm
				open={visible}
				onClose={onDialogClose}
				isEdit={isEdit}
				data={accidentCase}
			/>
			<div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
				<div className="flex flex-col lg:flex-row justify-between lg:items-center">
					<h3>{t("heading.Cases List")}</h3>
					<div className="flex items-center gap-2">
					</div>
				</div>
				<Filters getTableData={getAccidentCaseData} RegionList={RegionList } roles={roles} handleOnClear={handleOnClear} 
				setValue={setValue} reset={reset}  control={control} />
			</div>
			<Container className="p-4">
				<CompanyUserList
					data={accidentCaseList}
					count={count}
					page={page}
					limit={limit}
					getTableData={getAccidentCaseData}
					loading={loading}
					handleEditClick={handleEditInsuranceCompany}
					reset={reset}
				/>
			</Container>

		</Container>
	);
};

export default caseList;