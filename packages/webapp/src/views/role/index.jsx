import { Container, AuthorityCheck } from "@/components/shared";
import React, { useEffect, useState } from "react";
import _ from "lodash";
import { PAGE, DEFAULT_PAGE_SIZE } from "@/constants/app.constant";
import { toast, Button , Notification} from "@/components/ui";
import { HiOutlinePlusCircle } from "react-icons/hi";
import Filters from "./list/Filters";
import RoleForm from "./form";
import RoleList from "./list";
import { getRoles } from "@/services/role";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";


const Roles = () => {
	const params = useParams();
	const { t } = useTranslation();
	const [visible, setVisible] = useState(false);
	const [roleList, setRoleList] = useState([]);
	const [count, setCount] = useState(0);
	const [page, setPage] = useState(PAGE);
	const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
	const [loading, setLoading] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [role, setRoleData] = useState(null);

	const addNewPost = () => {
		setVisible(true);
	};

	useEffect(() => {
		getRoleListData(page, limit);
	}, []);

	const getRoleListData = async (
		page = PAGE,
		limit = DEFAULT_PAGE_SIZE,
		options = {}
	) => {
		setLoading(true);
		// options.companyId = params.companyId;
		options.page = page;
		options.limit = limit;
		options = _.pickBy(options, _.identity);
		try {
			const response = await getRoles(options);
			setRoleList(response.data);
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

	const onDialogClose = () => {
		getRoleListData();
		setRoleData(null);
		setTimeout(() => {
			setIsEdit(false);
		}, 700);
		setVisible(false);
	};

	const handleEditRole = (role) => {
		setIsEdit(true);
		setVisible(true);
		setRoleData(role);
	};

	return (
		<Container>
			<RoleForm
				open={visible}
				onClose={onDialogClose}
				isEdit={isEdit}
				data={role}
			/>
			<div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
				<div className="flex flex-col lg:flex-row justify-between lg:items-center">
					<h3>{t("heading.Roles")}</h3>
					<div className="flex items-center gap-2">
						<AuthorityCheck 
						authority={["can_add_role"]}
						>
							<Button
								size="sm"
								icon={<HiOutlinePlusCircle />}
								onClick={addNewPost}
							>
								{t("button.Add New")}
							</Button>
						</AuthorityCheck>
					</div>
				</div>
				<Filters getTableData={getRoleListData} />
			</div>

			<Container className="p-4">
				<RoleList
					data={roleList}
					count={count}
					page={page}
					limit={limit}
					getTableData={getRoleListData}
					loading={loading}
					handleEditClick={handleEditRole}
				/>
			</Container>
		</Container>
	);
};

export default Roles;
