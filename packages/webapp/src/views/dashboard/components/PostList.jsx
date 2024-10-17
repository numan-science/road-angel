import React, { useMemo } from "react";
import { Card, Table, Avatar, Tag } from "@/components/ui";
import { useTable } from "react-table";
import _ from "lodash";
import { HiOutlineUser } from "react-icons/hi";
import {
	ICONS,
	SOCIAL_MEDIA_TYPES,
	POST_STATUS,
} from "@/constants/app.constant";
import { UsersAvatarGroup } from "@/components/shared";
import dayjs from "dayjs";
import { S3_URL } from "@/constants/api.constant";
import { useTranslation } from "react-i18next";

const { Tr, Td, TBody, THead, Th } = Table;

const NameColumn = ({ row }) => (
	<div className="flex items-center gap-2">
		<Avatar
			shape="circle"
			size={25}
			src={row?.profilePic ? `${S3_URL}/${row?.profilePic}` : null}
			icon={<HiOutlineUser />}
		/>
		<span className="font-semibold">{row?.username}</span>
	</div>
);

const Platform = ({ socialMediaPost }) => {
	const socialmedias = _.map(socialMediaPost, (row) => ({
		id: row.id,
		name: SOCIAL_MEDIA_TYPES[row.SocialMediaType?.name],
		img: ICONS[row.SocialMediaType?.name],
	}));
	return (
		<UsersAvatarGroup
			avatarProps={{ size: 20 }}
			className="mr-2"
			users={socialmedias}
		/>
	);
};

const Status = ({ status }) => {
	switch (status) {
		case POST_STATUS.DONE:
			return (
				<Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100  border-0 rounded">
					{status}
				</Tag>
			);
		case POST_STATUS.ASSIGNED_FOR_REVIEW:
			return (
				<Tag className="text-amber-600 bg-amber-100 dark:text-amber-100 dark:bg-amber-500/20  border-0 rounded">
					{status}
				</Tag>
			);
		default:
			return (
				<Tag className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100 border-0 rounded">
					{status}
				</Tag>
			);
	}
};

const PostsList = ({ data = [], className }) => {
	const { t } = useTranslation();
	const tableColumns = [
		{
			Header: t("label.Created By"),
			Cell: (props) => {
				const row = props.row.original.User;
				return <NameColumn row={row} />;
			},
		},
		{
			Header: t("label.Context"),
			accessor: "text",
		},
		{
			Header: t("label.Status"),
			accessor: "status",
			Cell: (props) => {
				const row = props.row.original;
				return <Status status={row.status} />;
			},
		},
		{
			Header: t("Platforms"),
			accessor: "platform",
			Cell: (props) => {
				const row = props.row.original.SocialMediaPost;
				return <Platform socialMediaPost={row} />;
			},
		},
		{
			Header: t("label.Budget"),
			accessor: "budget",
			Cell: (props) => {
				const row = props.row.original;
				return row.budget ? (
					<div className="flex items-center">${row.budget}</div>
				) : null;
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

	return (
		<Card className={className}>
			<div className="flex items-center justify-between mb-4">
				<h4>{t("heading.Post List")}</h4>{" "}
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

export default PostsList;
