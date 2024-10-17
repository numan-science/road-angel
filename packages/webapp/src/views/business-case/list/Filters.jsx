import React from 'react'
import _ from 'lodash'
import { FormContainer, Select, Button } from '@/components/ui'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { searchClient } from '@/services/client'
import { searchUser } from '@/services/user'
import { FORM_LAYOUT, QUERY_STATUS } from '@/constants/app.constant'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

const Filters = (props) => {
  const { t } = useTranslation()
  const { getTableData, RegionList, roles, handleOnClear, setValue , reset , control} = props

  // const { control, reset, setValue } = useForm({
  //   defaultValues: {
  //     status: null,
  //     roleId: [],
  //     regionId: [],
  //   },
  // })
  const watcher = useWatch({ control })


  const handleChange = (field, value) => {
    setValue(field, value)
    const options = _.cloneDeep(watcher)
    options[field] = value
    options.roleId = options.roleId?.value
    options.regionId = options.regionId?.value
    options.status = options.status?.value
    getTableData(options)
  }

  return (
    <FormContainer
      className={classNames('grid gap-2 mt-2 items-center', ...FORM_LAYOUT)}
    > 
     <Controller
        control={control}
        name="roleId"
        render={({ field }) => (
          <Select
            {...field}
            onChange={(value) => handleChange('roleId', value)}
            isClearable
            placeholder={t('label.Select Role')}
            options={roles}
          />
        )}
      />
     <Controller
        control={control}
        name="regionId"
        render={({ field }) => (
          <Select
            {...field}
            onChange={(value) => handleChange('regionId', value)}
            isClearable
            placeholder={t('label.Select Region')}
            options={_.map(RegionList, (region) => ({
              value: region.id,
              label: region.name,
            }))}
          />
        )}
      />
      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <Select
            {...field}
            onChange={(value) => handleChange('status', value)}
            isClearable
            placeholder={t('label.Select Status')}
            options={_.map(QUERY_STATUS, (status) => ({
              value: status,
              label: status,
            }))}
          />
        )}
      />
      <div>
        <Button size="sm" type="button" onClick={handleOnClear}>
          {t('button.Clear All')}
        </Button>
      </div>
    </FormContainer>
  )
}

export default Filters
