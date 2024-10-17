import React, { useMemo, useState } from 'react'
import { Card, toast, Notification, Avatar } from '@/components/ui'
import dayjs from 'dayjs'
import { HiOutlinePencil, HiOutlineTrash, HiOutlineUser } from 'react-icons/hi'
import { DataTable, ConfirmDialog, AuthorityCheck } from '@/components/shared'
import { PAGE_SIZE_OPTIONS } from '@/constants/app.constant'
import { deleteWorkshop } from '@/services/workshop'
import { S3_URL } from '@/constants/api.constant'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import useAuthority from '@/utils/hooks/useAuthority'
import RatingStars from '@/components/ui/RatingStars'


const WorkshopList = (props) => {
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
  } = props

  const [confirmVisible, setConfirmVisible] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [workshopId, setWorkshopId] = useState(null)

  const confirmDelete = (workshopId) => {
    setConfirmVisible(true)
    setWorkshopId(workshopId)
  }

  const confirmDialog = () => (
    <ConfirmDialog
      title="Delete Workshop"
      type="danger"
      confirmButtonColor="red-600"
      isOpen={confirmVisible}
      onConfirm={handleDelete}
      onCancel={() => setConfirmVisible(false)}
      onClose={() => setConfirmVisible(false)}
      loading={deleting}
    >
      Are you sure you want to delete this Workshop?
    </ConfirmDialog>
  )
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
      setDeleting(true)
      const response = await deleteWorkshop(workshopId)
      toast.push(
        <Notification className="mb-4" type="success">
          {response?.data?.message}
        </Notification>,
      )
      getTableData()
      setConfirmVisible(false)
      setWorkshopId(null)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>,
      )
    }
    setDeleting(false)
    setWorkshopId(null)
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
      Header: t('label.Address'),
      accessor: 'address',
    },
    {
      Header: t('label.Rating'),
      accessor: 'rating',
      Cell: (props) => {
        const row = props.row.original
        return <RatingStars rating={row.rating} />
      },
    },
    {
      Header: t('label.Region'),
      accessor: 'region',
      Cell: (props) => {
        const row = props.row.original
        return <span> {row.Region?.name} </span>
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
  const canPerformActions = useAuthority([
    'can_edit_workshop',
    'can_delete_workshop',
  ])
  if (canPerformActions) {
    cols.push({
      Header: t('label.Actions'),
      accessor: 'actions',
      Cell: (props) => {
        const row = props.row.original
        return (
          <div className="flex justify-start text-lg">
            <AuthorityCheck authority={['can_edit_workshop']}>
              <span className="cursor-pointer p-2 hover:text-blue-500">
                <HiOutlinePencil onClick={() => handleEditClick(row)} />
              </span>
            </AuthorityCheck>

            <AuthorityCheck authority={['can_delete_workshop']}>
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

export default WorkshopList
