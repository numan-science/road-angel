import React, { useMemo, useState, useEffect } from 'react'
import { RiSave2Line } from 'react-icons/ri'
import { useForm } from 'react-hook-form'
import {
  Card,
  toast,
  Notification,
  Avatar,
  Tag,
} from '@/components/ui'
import dayjs from 'dayjs'
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiPlusCircle,
  HiOutlineUser,
} from 'react-icons/hi'
import {
  DataTable,
  ConfirmDialog,
  AuthorityCheck,
} from '@/components/shared'
import { PAGE_SIZE_OPTIONS } from '@/constants/app.constant'
import { deleteInsuranceCompany } from '@/services/insurance-company'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { S3_URL } from '@/constants/api.constant'
import DialogDoc from '../dialog/DialogDoc'
import useAuthority from '@/utils/hooks/useAuthority'

const CompanyUserList = (props) => {
  const { t } = useTranslation()
  const {
    data = [],
    className,
    count,
    page,
    limit,
    getTableData,
    loading,
    handleEditClick,
    multipleAttachments = true,
    isEdit = false,
  } = props
  const {
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [confirmVisible, setConfirmVisible] = useState(false)
  const [documentModalVisible, setDocumentModalVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [companyId, setCompanyId] = useState(null)
  const [companyDocumentId, setCompanyDocumentId] = useState(null)

  const confirmDelete = (companyId) => {
    setConfirmVisible(true)
    setCompanyId(companyId)
  }
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
  const confirmDialog = () => (
    <ConfirmDialog
      title="Delete Insurance Company"
      type="danger"
      confirmButtonColor="red-600"
      isOpen={confirmVisible}
      onConfirm={handleDelete}
      onCancel={() => setConfirmVisible(false)}
      onClose={() => setConfirmVisible(false)}
      loading={deleting}
    >
      Are you sure you want to delete this Insurance Company Documents?
    </ConfirmDialog>
  )

  const toggleDocumentModal = (companyId) => {
    setDocumentModalVisible(!documentModalVisible)
    setCompanyDocumentId(companyId)
  }
  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await deleteInsuranceCompany(companyId)
      toast.push(
        <Notification className="mb-4" type="success">
          Insurance Company Deleted !
        </Notification>,
      )
      getTableData()
      setConfirmVisible(false)
      setCompanyId(null)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed !
        </Notification>,
      )
    }
    setDeleting(false)
    setCompanyId(null)
  }

  const tableColumns = [
    {
      Header: t('label.Name'),
      accessor: 'name',
      Cell: (props) => {
        const row = props.row.original
        return <NameColumn row={row} />
      },
    },
    {
      Header: t('label.Created Time'),
      accessor: 'createdAt',
      Cell: (props) => {
        const row = props.row.original
        return <span>{dayjs(row.createdAt).format('DD/MM/YYYY hh:mm A')}</span>
      },
    },
  ]
  const columnHeaders = _.map(tableColumns, 'Header')
  const cols = useMemo(() => tableColumns, columnHeaders)
  const canPerformActions = useAuthority(
		["can_edit_insurance_company", "can_delete_insurance_company"]
	);
  if(canPerformActions)
  {
    cols.push({
      Header: t('label.Actions'),
      accessor: 'actions',
      Cell: (props) => {
        const row = props.row.original
        return (
          <div className="flex justify-start text-lg">
            <AuthorityCheck authority={['can_edit_insurance_company']}>
              <span className="cursor-pointer p-2 hover:text-blue-500">
                <HiOutlinePencil onClick={() => handleEditClick(row)} />
              </span>
            </AuthorityCheck>

            <AuthorityCheck authority={['can_delete_insurance_company']}>
              <span className="cursor-pointer p-2 hover:text-red-500">
                <HiOutlineTrash onClick={() => confirmDelete(row.id)} />
              </span>
            </AuthorityCheck>

            <AuthorityCheck authority={['can_add_insurance_company']}>
              <span
                className="cursor-pointer p-2 hover:text-green-500"
                onClick={() => toggleDocumentModal(row.id)}
              >
                <HiPlusCircle />
              </span>
            </AuthorityCheck>
          </div>
        )
      },
    })
  }

  const onPaginationChange = (pageNo) => {
    getTableData(pageNo, limit)
  }

  const onSelectChange = (pageSize) => {
    getTableData(1, pageSize)
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
      <DialogDoc
        companyDocumentId={companyDocumentId}
        documentModalVisible={documentModalVisible}
        toggleDocumentModal={toggleDocumentModal}
        multipleAttachments={multipleAttachments}
        isEdit={isEdit}
        data={data}
        setCompanyDocumentId={setCompanyDocumentId}
      />
    </Card>
  )
}

export default CompanyUserList
