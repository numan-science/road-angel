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
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { S3_URL } from '@/constants/api.constant'
import useAuthority from '@/utils/hooks/useAuthority'
import { deleteLeasingCompany } from '@/services/leasingCompanies'

const LeasingInsuranceCompanyList = (props) => {
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
  const [leasingInsuranceCompanyId, setLeasingInsuranceCompanyId] = useState(null)

  const confirmDelete = (leasingInsuranceCompanyId) => {
    setConfirmVisible(true)
    setLeasingInsuranceCompanyId(leasingInsuranceCompanyId)
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
  const LeadRole = ({ role }) => (
    <Tag className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100 border-0 rounded">
      {role}
    </Tag>
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
      Are you sure you want to delete this Leasing Insurance Company?
    </ConfirmDialog>
  )

  const toggleDocumentModal = (leasingInsuranceCompanyId) => {
    setDocumentModalVisible(!documentModalVisible)
    setCompanyDocumentId(leasingInsuranceCompanyId)
  }
  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await deleteLeasingCompany(leasingInsuranceCompanyId)
      toast.push(
        <Notification className="mb-4" type="success">
          Leasing Company Deleted
        </Notification>,
      )
      getTableData()
      setConfirmVisible(false)
      setLeasingInsuranceCompanyId(null)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed !
        </Notification>,
      )
    }
    setDeleting(false)
    setLeasingInsuranceCompanyId(null)
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
		["can_edit_leasing_insurance_company", "can_delete_leasing_insurance_company"]
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
            <AuthorityCheck authority={['can_edit_leasing_insurance_company']}>
              <span className="cursor-pointer p-2 hover:text-blue-500">
                <HiOutlinePencil onClick={() => handleEditClick(row)} />
              </span>
            </AuthorityCheck>

            <AuthorityCheck authority={['can_delete_leasing_insurance_company']}>
              <span className="cursor-pointer p-2 hover:text-red-500">
                <HiOutlineTrash onClick={() => confirmDelete(row.id)} />
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
    </Card>
  )
}

export default LeasingInsuranceCompanyList
