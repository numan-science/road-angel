import React, { useMemo, useState } from 'react'
import { Card, toast, Notification } from '@/components/ui'
import dayjs from 'dayjs'
import { HiOutlinePencil, HiOutlineTrash, HiOutlineUser } from 'react-icons/hi'
import { DataTable, ConfirmDialog, AuthorityCheck } from '@/components/shared'
import { PAGE_SIZE_OPTIONS } from '@/constants/app.constant'
import { deleteRegion } from '@/services/region'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import useAuthority from '@/utils/hooks/useAuthority'

const RegionLists = (props) => {
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
  const [regionId, setRegionId] = useState(null)

  const confirmDelete = (regionId) => {
    setConfirmVisible(true)
    setRegionId(regionId)
  }

  const confirmDialog = () => (
    <ConfirmDialog
      title="Delete Region"
      type="danger"
      confirmButtonColor="red-600"
      isOpen={confirmVisible}
      onConfirm={handleDelete}
      onCancel={() => setConfirmVisible(false)}
      onClose={() => setConfirmVisible(false)}
      loading={deleting}
    >
      Are you sure you want to delete this Region?
    </ConfirmDialog>
  )

  const handleDelete = async () => {
    try {
      setDeleting(true)
      const response = await deleteRegion(regionId)
      toast.push(
        <Notification className="mb-4" type="success">
          Region Deleted !
        </Notification>,
      )
      getTableData()
      setConfirmVisible(false)
      setRegionId(null)
    } catch (error) {
      toast.push(
        <Notification className="mb-4" type="danger">
          Failed !
        </Notification>,
      )
    }
    setDeleting(false)
    setRegionId(null)
  }

  const tableColumns = [
    {
      Header: t('label.Name'),
      accessor: 'name',
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
    'can_edit_region',
    'can_delete_region',
  ])
  if (canPerformActions) {
    cols.push({
      Header: t('label.Actions'),
      accessor: 'actions',
      Cell: (props) => {
        const row = props.row.original
        return (
          <div className="flex justify-start text-lg">
            <AuthorityCheck authority={['can_edit_region']}>
              <span className="cursor-pointer p-2 hover:text-blue-500">
                <HiOutlinePencil onClick={() => handleEditClick(row)} />
              </span>
            </AuthorityCheck>

            <AuthorityCheck authority={['can_delete_region']}>
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
          total: count
        }}
        loading={loading}
        pageSizes={PAGE_SIZE_OPTIONS}
        onPaginationChange={onPaginationChange}
        onSelectChange={onSelectChange}
      />
    </Card>
  )
}

export default RegionLists
