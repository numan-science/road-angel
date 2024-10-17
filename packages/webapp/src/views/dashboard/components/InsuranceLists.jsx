import React, { useMemo } from "react";
import { Card, Table, Tag, Avatar } from "@/components/ui";
import { useTable } from "react-table";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { S3_URL } from "@/constants/api.constant";
import { HiOutlineUser } from "react-icons/hi";

const { Tr, Td, TBody, THead, Th } = Table;

const InsuranceLists = ({ data = [], className }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
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
	  );
	  const LeadRole = ({ role }) => (
		<Tag className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100 border-0 rounded">
		  {role}
		</Tag>
	  )

	const tableColumns = [
		{
			Header: t('label.Name'),
			accessor: "name",
			Cell: (props) => {
				const row = props.row.original;
				return <NameColumn row={row} />;
			},
		},
		{
			Header: t("label.Created Time"),
			accessor: "createdAt",
			Cell: (props) => {
				const row = props.row.original;
				return (
					<span>
						{dayjs(new Date(row.createdAt)).format("DD/MM/YYYY hh:mm A")}
					</span>
				);
			},
		},

	];
	const columnHeaders = _.map(tableColumns, "Header");
	const columns = useMemo(() => tableColumns, columnHeaders);

	const { getTableProps, getTableBodyProps, prepareRow, headerGroups, rows } =
		useTable({ columns, data, initialState: { pageIndex: 0 } });

	const onNavigate = () => {
		navigate("/app/crm/customers");
	};
 
	return (
		<Card className={className}>
			<div className="flex items-center justify-between mb-4">
				<h4>{t("heading.Insurance Company List")}</h4>
			</div>
			<Table {...getTableProps()}>
				<THead>
					{headerGroups.map((headerGroup) => (
						<Tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<Th {...column.getHeaderProps()}>{column.render("Header")}</Th>
							))}
						</Tr>
					))}
				</THead>
				<TBody {...getTableBodyProps()}>
					{rows.map((row, i) => {
						prepareRow(row);
						return (
							<Tr {...row.getRowProps()}>
								{row.cells.map((cell) => {
									return (
										<Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
									);
								})}
							</Tr>
						);
					})}
				</TBody>
			</Table>
		</Card>
	);
};

export default InsuranceLists;
