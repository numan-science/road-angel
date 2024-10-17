import React, { useMemo, useState } from "react";
import { Card, Avatar, toast, Notification, Tag } from "@/components/ui";
import dayjs from "dayjs";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineUser } from "react-icons/hi";
import { DataTable, ConfirmDialog, AuthorityCheck } from "@/components/shared";
import { PAGE_SIZE_OPTIONS } from "@/constants/app.constant";
import { S3_URL } from "@/constants/api.constant";
import _ from "lodash";
import { useTranslation } from 'react-i18next';
import useAuthority from "@/utils/hooks/useAuthority";
import { deleteUser } from "@/services/user";

const SaleAgentList = (props) => {
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

	const [confirmVisible, setConfirmVisible] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [saleAgentId, setSaleAgentId] = useState(null);

	const confirmDelete = (saleAgentId) => {
		setConfirmVisible(true);
		setSaleAgentId(saleAgentId);
	};

	const NameColumn = ({ row }) => (
		<div className="flex items-center gap-3">
		  <Avatar
			shape="circle"
			size={45}
			src={row?.profilePic ? `${S3_URL}/${row.profilePic}` : null}
			icon={<HiOutlineUser />}
		  />
		  <span className="font-semibold">{row.username}</span>
		</div>
	  )
	  const LeadRole = ({ role }) => (
		<Tag className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100 border-0 rounded">
			{role}
		</Tag>
	);
	const LeadRegion = ({ region }) => (
		<Tag className="bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-100 border-0 rounded">
			  <p className="flex gap-2">
      {region.map((regions, index) => (
        <span key={index}>{regions} </span>
      ))}
    </p>
		</Tag>
	);

	const confirmDialog = () => (
		<ConfirmDialog
			title="Delete Sale Agent"
			type="danger"
			confirmButtonColor="red-600"
			isOpen={confirmVisible}
			onConfirm={handleDelete}
			onCancel={() => setConfirmVisible(false)}
			onClose={() => setConfirmVisible(false)}
			loading={deleting}
		>
			Are you sure you want to delete this sale agent?
		</ConfirmDialog>
	);

	const handleDelete = async () => {
		try {
			setDeleting(true);
			const response = await deleteUser(saleAgentId);
			toast.push(
				<Notification className="mb-4" type="success">
					{response?.data?.message}
				</Notification>
			);
			getTableData();
			setConfirmVisible(false);
			setSaleAgentId(null);
		} catch (error) {
			toast.push(
				<Notification className="mb-4" type="danger">
					{error?.response?.data.message}
				</Notification>
			);
		}
		setDeleting(false);
		setSaleAgentId(null);
	};

	
	const tableColumns =[
		{
			Header: t('label.Name'),
			accessor: 'username',
			Cell: (props) => {
			  const row = props.row.original
			  return <NameColumn row={row} />
			},
		  },
		{
			Header: t('label.Email'),
			accessor: "email",
		},
		// {
		// 	Header: t('label.Phone'),
		// 	accessor: "phone",
		// }, 
		 {
			Header: t('label.Role'),
			accessor: "role",
			Cell: (props) => {
				const row = props.row.original;
				return <LeadRole role={row.role} />;
			},
		}, 
		{
			Header: t('label.Region'),
			accessor: "region",
			Cell: (props) => {
				const row = props.row.original;
				return <LeadRegion region={row.UserRegion?.map((region)=> region?.Region?.name)} />;
			},
		},
		{
			Header: t('label.Created Time'),
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
		["can_edit_sale_agents", "can_delete_sale_agents"]
	);
	if (canPerformActions) {
		cols.push({
			Header: t('label.Actions'),
			accessor: "actions",
			Cell: (props) => {
				const row = props.row.original;
				return (
					<div className="flex justify-start text-lg">
						<AuthorityCheck authority={["can_edit_sale_agents"]}>
							<span className="cursor-pointer p-2 hover:text-blue-500">
								<HiOutlinePencil onClick={() => handleEditClick(row)} />
							</span>
						</AuthorityCheck>

						<AuthorityCheck authority={["can_delete_sale_agents"]}>
							<span className="cursor-pointer p-2 hover:text-red-500">
								<HiOutlineTrash onClick={() => confirmDelete(row.id)} />
							</span>
						</AuthorityCheck>
					</div>
				);
			},
		});
	}


	const onPaginationChange = (pageNo) => {
		getTableData(pageNo, limit);
	};

	const onSelectChange = (pageSize) => {
		getTableData(1, pageSize);
	};


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

export default SaleAgentList;
