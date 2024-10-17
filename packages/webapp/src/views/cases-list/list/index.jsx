import React, { useMemo, useState, useEffect } from "react";
import { RiEdit2Line, RiSave2Line } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { Card, toast, Notification, Dropdown, Tag,Tooltip } from "@/components/ui";
import dayjs from "dayjs";
import {
  HiOutlineTrash,
  HiOutlineEye,
} from "react-icons/hi";
import { DataTable, ConfirmDialog, AuthorityCheck } from "@/components/shared";
import { PAGE_SIZE_OPTIONS, QUERY_STATUS } from "@/constants/app.constant";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useAuthority from "@/utils/hooks/useAuthority";
import { deleteAccidentCase, updateAccidentCase } from "@/services/submit-case";

const Status = ({ status }) => {
	switch (status) {
		case QUERY_STATUS.COMPLETED:
			return (
				<Tag className="bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-100 border-0 rounded">
					{status}
				</Tag>
			);
		case QUERY_STATUS.REJECTED:
			return (
				<Tag className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 border-0 rounded">
					{status}
				</Tag>
			);
		case QUERY_STATUS.PENDING:
			return (
				<Tag className="bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-100 border-0 rounded">
					{status}
				</Tag>
			);
	}
};


const CompanyUserList = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    data = [],
    className,
    count,
    page,
    limit,
    getTableData,
    loading,
    reset,
    handleEditClick,
    multipleAttachments = true,
    isEdit = false,
  } = props;
  const {
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [accidentCaseId, setAccidentCaseId] = useState(null);

  const confirmDelete = (accidentCaseId) => {
    setConfirmVisible(true);
    setAccidentCaseId(accidentCaseId);
  };

  const confirmDialog = () => (
    <ConfirmDialog
      title="Delete Accident Case"
      type="danger"
      confirmButtonColor="red-600"
      isOpen={confirmVisible}
      onConfirm={handleDelete}
      onCancel={() => setConfirmVisible(false)}
      onClose={() => setConfirmVisible(false)}
      loading={deleting}
    >
      Are you sure you want to delete this Accident Case?
    </ConfirmDialog>
  );
  const LeadRole = ({ agent }) => (
		<Tag className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100 border-0 rounded">
			{agent}
		</Tag>
	);
  const LeadRegion = ({ region }) => (
		<Tag className="bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-100 border-0 rounded">
			  <p className="flex gap-2">
      {region?.map((regions, index) => (
        <span key={index}>{regions} </span>
      ))}
    </p>
		</Tag>
	);
  const toggleDocumentModal = (accidentCaseId) => {
    navigate(`/cases-list/accident-case-preview/${accidentCaseId}`, {
			state: { accidentCaseId: accidentCaseId},
		});
  };
  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await deleteAccidentCase(accidentCaseId);
      toast.push(
        <Notification className="mb-4" type="success">
          Accident Case Deleted !
        </Notification>
      );
      getTableData();
      setConfirmVisible(false);
      setAccidentCaseId(null);
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed
        </Notification>
      );
    }
    setDeleting(false);
    setAccidentCaseId(null);
  };
 
  const updateQueryStatus = async (data) => {
		await updateAccidentCase(data, data.id);
    reset();
		getTableData();
	};
  const onDropdownItemClick = (data, status) => {
		data.status = status;
		updateQueryStatus(data);
	};

  const tableColumns = [


    {
      Header: t("label.Accident Address"),
      accessor: "accidentAddress",
     
    },

    {
      Header: t("label.Country"),
      accessor: "country",
     
    },
    {
      Header: t("label.City"),
      accessor: "city",
   
    },

    {
      Header: t("label.Injuries"),
      Cell: (props) => {
        const row = props.row.original
        return <span>{row.injuries ? "Yes" : "No"}</span> 
      },
    }
,
    {
      Header: t("label.Investegation By Police"),
      Cell: (props) => {
        const row = props.row.original
        return <span>{row.investegationByPolice ? "Yes" : "No"}</span> 
      },
     
    },

    {
      Header: t("label.Other Car Damage"),
      Cell: (props) => {
        const row = props.row.original
        return <span>{row.otherCarDamage ? "Yes" : "No"}</span> 
      },      
    },

    {
      Header: t("label.Witness"),
      accessor: "witness",
      
    },
    {
			Header: t('label.Region'),
			accessor: "region",
			Cell: (props) => {
				const row = props.row.original;
				return <LeadRegion region={row?.User?.UserRegion?.map((region)=> region?.Region?.name)} />;
			},
		},
    {
			Header: t('label.Role'),
			accessor: "agent",
			Cell: (props) => {
				const row = props.row.original;
				return <LeadRole agent={row.User.Role?.name} />;
			},
		},
   
    {
			Header: "Status",
			accessor: "status",
			Cell: (props) => <Status {...props.row.original} />,
		},
    {
      Header: t("label.Created Time"),
      accessor: "createdAt",
      Cell: (props) => {
        const row = props.row.original;
        return <span>{dayjs(row.createdAt).format("DD/MM/YYYY hh:mm A")}</span>;
      },
    },
  ];
  const columnHeaders = _.map(tableColumns, "Header");
  const cols = useMemo(() => tableColumns, columnHeaders);
  const canPerformActions = useAuthority([
    // "can_edit_cases_list",
    "can_view_cases_list",
    "can_delete_cases_list",
  ]);
  

  if (canPerformActions) {
    cols.push({
      Header: t("label.Actions"),
      accessor: "actions",
      Cell: (props) => {
        const row = props.row.original;
        return (
          <div className="flex justify-start text-lg">
             	<span className="cursor-pointer p-2 hover:text-red-500">
							<Tooltip title="Change Status">
								<Dropdown renderTitle={<RiEdit2Line />} placement="bottom-end">
									{Object.keys(QUERY_STATUS).map((item) => (
										<Dropdown.Item
											key={item}
											eventKey={item}
											onSelect={() =>
												onDropdownItemClick(row, QUERY_STATUS[item])
											}
										>
											<span className="text-xs">{QUERY_STATUS[item]}</span>
										</Dropdown.Item>
									))}
								</Dropdown>
							</Tooltip>
						</span>
            <AuthorityCheck authority={["can_delete_cases_list"]}>
              <span className="cursor-pointer p-2 hover:text-red-500">
                <HiOutlineTrash onClick={() => confirmDelete(row.id)} />
              </span>
            </AuthorityCheck>

            <AuthorityCheck authority={["can_view_cases_list"]}>
              <span
                className="cursor-pointer p-2 hover:text-green-500"
                onClick={() => toggleDocumentModal(row.id)}
              >
                <HiOutlineEye />
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
      {/* <DialogDoc
        accidentCaseId={accidentCaseId}
        documentModalVisible={documentModalVisible}
        toggleDocumentModal={toggleDocumentModal}
        multipleAttachments={multipleAttachments}
        isEdit={isEdit}
        data={data}
        setAccidentCaseId={setAccidentCaseId}
      /> */}
    </Card>
  );
};

export default CompanyUserList;
