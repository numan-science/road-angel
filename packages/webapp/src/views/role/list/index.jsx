import { AuthorityCheck, ConfirmDialog, DataTable } from "@/components/shared";
import { Card, Notification, toast, Tooltip } from "@/components/ui";
import {
	DEFAULT_ROLES_LIST,
	PAGE_SIZE_OPTIONS,
} from "@/constants/app.constant";
import { deleteRole } from "@/services/role";
import useAuthority from "@/utils/hooks/useAuthority";
import dayjs from "dayjs";
import _ from "lodash";
import React, { useMemo, useState } from "react";
import { BsListCheck } from "react-icons/bs";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const RoleList = (props) => {
	const { t } = useTranslation();
	const {
		data = [],
		className,
		count,
		page,
		limit,
		getTableData,
		loading,
		handleEditClick,
	} = props;

	const navigate = useNavigate();
	const { companyId } = useParams();
	const { isSuperAdmin, isCompanyAdmin } = useSelector(
		(state) => state.auth.loggedInUser
	);

	const [confirmVisible, setConfirmVisible] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [roleId, setRoleId] = useState(null);

	const confirmDelete = (roleId) => {
		setConfirmVisible(true);
		setRoleId(roleId);
	};

	const confirmDialog = () => (
		<ConfirmDialog
			title="Delete Role"
			type="danger"
			confirmButtonColor="red-600"
			isOpen={confirmVisible}
			onConfirm={handleDelete}
			onCancel={() => setConfirmVisible(false)}
			onClose={() => setConfirmVisible(false)}
			loading={deleting}
		>
			Are you sure you want to delete this role?
		</ConfirmDialog>
	);

	const handleDelete = async () => {
		try {
			setDeleting(true);
			const response = await deleteRole(roleId);
			toast.push(
				<Notification className="mb-4" type="success">
					{response?.data.message}
				</Notification>
			);
			getTableData();
			setConfirmVisible(false);
			setRoleId(null);
		} catch (error) {
			toast.push(
				<Notification className="mb-4" type="danger">
					{error?.response?.data.message}
				</Notification>
			);
		}
		setDeleting(false);
		setRoleId(null);
	};

	const onPaginationChange = (pageNo) => {
		getTableData(pageNo, limit);
	};

	const onSelectChange = (pageSize) => {
		getTableData(1, pageSize);
	};
	const tableColumns = [
		{
			Header:  t('label.Name'),
			accessor: "name",
		},
		{
			Header:  t('label.Created Time'),
			accessor: "createdAt",
			Cell: (props) => {
				const row = props.row.original;
				return <span>{dayjs(row.createdAt).format("DD/MM/YYYY hh:mm A")}</span>;
			},
		},
	]
	  const columnHeaders = _.map(tableColumns, 'Header')
	  const cols = useMemo(() => tableColumns, columnHeaders)

	const canPerformActions = useAuthority(
		["can_edit_role", "can_delete_role", "can_edit_role_permission"],
	);

	if (canPerformActions) {
		cols.push({
			Header: t('label.Actions'),
			accessor: "actions",
			Cell: (props) => {
				const row = props.row.original;
				return (
					<div className="flex justify-start text-lg">
						<AuthorityCheck authority={["can_edit_role_permission"]}>
							<Tooltip title="Permissions">
								<span className="cursor-pointer p-2 hover:text-emerald-500">
									<BsListCheck
										onClick={() =>
											navigate(
												`/role/${row.id}/permissions`
											)
										}
									/>
								</span>
							</Tooltip>
						</AuthorityCheck>
						
						{/* {!_.includes(DEFAULT_ROLES_LIST, row.name) && (
							<> */}
								<AuthorityCheck authority={["can_edit_role"]}>
									<Tooltip title="Edit">
										<span className="cursor-pointer p-2 hover:text-blue-500">
											<HiOutlinePencil onClick={() => handleEditClick(row)} />
										</span>
									</Tooltip>
								</AuthorityCheck>
								
								<AuthorityCheck
								 authority={["can_delete_role"]}
								 >
									<Tooltip title="Delete">
										<span className="cursor-pointer p-2 hover:text-red-500">
											<HiOutlineTrash onClick={() => confirmDelete(row.id)} />
										</span>
									</Tooltip>
								</AuthorityCheck>
							{/* </>
						)} */}
					</div>
				);
			},
		});
	}


	return (
		<Card className={className}>
			{confirmDialog()}
			<DataTable
				columns={cols}
				data={data}
				pagingData={{
					pageIndex: page,
					pageSize: String(limit),
					total: count,
				}}
				loading={loading}
				pageSizes={PAGE_SIZE_OPTIONS}
				onPaginationChange={onPaginationChange}
				onSelectChange={onSelectChange}
			/>
		</Card>
	);
};

export default RoleList;
