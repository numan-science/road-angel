import React, { useMemo, useState } from "react";
import { Card, Tag, Avatar, toast, Notification } from "@/components/ui";
import dayjs from "dayjs";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineUser } from "react-icons/hi";
import { DataTable, ConfirmDialog, AuthorityCheck } from "@/components/shared";
import { PAGE_SIZE_OPTIONS } from "@/constants/app.constant";
import { deleteTowService } from "@/services/tow-service";
import _ from "lodash";
import { useTranslation } from 'react-i18next';
import { S3_URL } from "@/constants/api.constant";
import useAuthority from "@/utils/hooks/useAuthority";

const CompanyUserList = (props) => {
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
	const [towServiceId, setTowServiceId] = useState(null);

	const confirmDelete = (towServiceId) => {
		setConfirmVisible(true);
		setTowServiceId(towServiceId);
	};

	const confirmDialog = () => (
		<ConfirmDialog
			title="Delete Tow Service"
			type="danger"
			confirmButtonColor="red-600"
			isOpen={confirmVisible}
			onConfirm={handleDelete}
			onCancel={() => setConfirmVisible(false)}
			onClose={() => setConfirmVisible(false)}
			loading={deleting}
		>
			Are you sure you want to delete this Tow Service?
		</ConfirmDialog>
	);
	
	const NameColumn = ({ row }) => (
		<div className="flex items-center gap-3">
		  <Avatar
			shape="circle"
			size={45}
			src={row?.logo ? `${S3_URL}/${row.logo}` : null}
			icon={<HiOutlineUser />}
		  />
		  <span className="font-semibold">{row.name}</span>
		</div>
	  )
	const handleDelete = async () => {
		try {
			setDeleting(true);
			const response = await deleteTowService(towServiceId);
			toast.push(
				<Notification className="mb-4" type="success">
					Tow Service Deleted !
				</Notification>
			);
			getTableData();
			setConfirmVisible(false);
			setTowServiceId(null);
		} catch (error) {
			toast.push(
				<Notification className="mb-4" type="danger">
					Failed !
				</Notification>
			);
		}
		setDeleting(false);
		setTowServiceId(null);
	};

	
	const tableColumns =[
		{
			Header: t('label.Name'),
			accessor: 'name',
			Cell: (props) => {
			  const row = props.row.original
			  return <NameColumn row={row} />
			},
		  },
		  {
			Header: t('label.Email'),
			accessor: 'email',
		  },
		  {
			Header: t('label.Address'),
			accessor: 'address',
		  },
		  {
			Header: t('label.Phone'),
			accessor: 'phone',
		  },
		  {
			Header: t('label.Region'),
			accessor: 'region',
				Cell: (props) => {
				const row = props.row.original;
				return <span> {row.Region?.name} </span>;
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
		["can_edit_tow_service", "can_delete_tow_service"]
	);

	if (canPerformActions) {
		cols.push({
			Header: t('label.Actions'),
			accessor: "actions",
			Cell: (props) => {
				const row = props.row.original;
				return (
					<div className="flex justify-start text-lg">
						<AuthorityCheck authority={["can_edit_tow_service"]}>
							<span className="cursor-pointer p-2 hover:text-blue-500">
								<HiOutlinePencil onClick={() => handleEditClick(row)} />
							</span>
						</AuthorityCheck>

						<AuthorityCheck authority={["can_delete_tow_service"]}>
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

export default CompanyUserList;
