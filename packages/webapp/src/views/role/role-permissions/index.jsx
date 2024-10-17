import { Container } from '@/components/shared'
import { Card, Button, Checkbox, toast, Notification } from '@/components/ui'
import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getRolePermission,
  getAllPermissions,
  getRole,
  saveRolePermissions,
} from '@/services/role'
import { RiSave2Line } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
const RolePermissions = () => {
  const { roleId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [allPermissions, setAllPermissions] = useState([])
  const [mainModules, setMainModules] = useState([])
  const [subModules, setSubModules] = useState([])
  const [childModules, setChildModules] = useState([])
  const [role, setRole] = useState({})
  const [rolePermissions, setRolesPermission] = useState([])
  const [checkedAll, setCheckedAll] = useState(false)
  const [loading, setLoading] = useState(false)
  const [collapse, setCollapse] = useState([])


  useEffect(() => {
    getRolesData()
    getRolePermissionsData()
    getAllPermissionsData()
  }, [])
  
  const getRolesData = async () => {
    const response = await getRole(roleId)
    setRole(response.data.name)
  }

  const getRolePermissionsData = async () => {
    const response = await getRolePermission(roleId)
    const permissions = _.map(response.data, 'permissionId')
    setRolesPermission(permissions)
  }

  const getAllPermissionsData = async () => {
    const response = await getAllPermissions()
    const mainModulesData = _.filter(
      response.data.rows,
      (permission) => permission.moduleName === 'parent',
    )
    let subModulesData = _.filter(
      response.data.rows,
      (permission) => permission.moduleName === 'subModule',
    )
    subModulesData = _.groupBy(subModulesData, 'parent')
    let childModulesData = _.filter(
      response.data.rows,
      (permission) => permission.moduleName === 'isChild',
    )
    childModulesData = _.groupBy(childModulesData, 'parent')
    setAllPermissions(response.data.rows)
    setMainModules(mainModulesData)
    setSubModules(subModulesData)
    setChildModules(childModulesData)
  }

  const onChangeRolePermission = (checked) => {
    let permissions = [...rolePermissions]
    if (checked) {
      permissions = _.map(allPermissions, 'id')
    } else {
      _.map(allPermissions, (row) => {
        permissions = _.pull(permissions, row.id)
      })
    }
    setCheckedAll(checked)
    setRolesPermission(permissions)
  }

  const setModuleRolePermission = (permissionId, permission) => {
    let permissions = [...rolePermissions]

    if (_.includes(rolePermissions, permissionId)) {
      permissions = _.pull(permissions, permissionId)
      _.map(subModules[permission], (subModule) => {
        permissions = _.pull(permissions, subModule.id)
        _.map(childModules[subModule.permission], (child) => {
          permissions = _.pull(permissions, child.id)
        })
      })
    } else {
      permissions.push(permissionId)
      _.map(subModules[permission], (subModule) => {
        permissions.push(subModule.id)
        _.map(childModules[subModule.permission], (child) => {
          permissions.push(child.id)
        })
      })
    }
    setRolesPermission(permissions)
  }

  const setSubModuleRolePermission = (permissionId, permission) => {
    let permissions = [...rolePermissions]

    if (_.includes(rolePermissions, permissionId)) {
      permissions = _.pull(permissions, permissionId)
      _.map(childModules[permission], (child) => {
        permissions = _.pull(permissions, child.id)
      })
    } else {
      permissions.push(permissionId)
      _.map(childModules[permission], (child) => {
        permissions.push(child.id)
      })
    }
    setRolesPermission(permissions)
  }

  const setChildRolePermission = (permissionId) => {
    let permissions = [...rolePermissions]
    if (_.includes(rolePermissions, permissionId)) {
      permissions = _.pull(permissions, permissionId)
    } else {
      permissions.push(permissionId)
    }
    setRolesPermission(permissions)
  }

  const onCollapse = (field) => {
    let collapses = _.cloneDeep(collapse)
    if (_.includes(collapses, field)) {
      collapses = _.filter(collapses, (row) => row !== field)
    } else {
      collapses.push(field)
    }
    setCollapse(collapses)
  }

  const handleSubmit = async () => {
    try {
      const values = { permissionIds: rolePermissions }
      setLoading(true)
      const response = await saveRolePermissions(roleId, values)
      setLoading(false)
      toast.push(
        <Notification className="mb-4" type="success">
          {response?.data.message}
        </Notification>,
      )
      handleCancel()
    } catch (error) {
      setLoading(false)
      toast.push(
        <Notification className="mb-4" type="danger">
          {error?.response?.data.message}
        </Notification>,
      )
    }
  }

  const handleCancel = () => {
    navigate(`/role`)
  }

  const Header = () => (
    <div className="flex flex-col md:flex-row md:justify-between">
      <h3 className="mb-4 md:mb-0">
        {role && `${role}`}-{t('heading.Permissions')}
      </h3>
      <div className="flex items-center gap-2">
        <Button type="button" onClick={handleCancel} className="mr-2">
          {t('button.Cancel')}
        </Button>
        <Button
          icon={<RiSave2Line />}
          type="submit"
          variant="solid"
          loading={loading}
          onClick={handleSubmit}
        >
          {t('button.Save')}
        </Button>
      </div>
    </div>
  )

  return (
    <Container className="p-4">
      <Card header={<Header />}>
        <Checkbox
          className="flex items-center h-[15px] mb-2"
          checkBoxClassName="h-[15px] w-[15px]"
          checked={checkedAll}
          onChange={onChangeRolePermission}
        >
          <b>{t('button.Check All')}</b>
        </Checkbox>
        {mainModules &&
          mainModules.map((parent) => (
            <Card key={parent.id} className="mb-2" bodyClass="p-3">
              <div
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => onCollapse(parent.id)}
              >
                <Checkbox
                  className="flex items-center h-[15px]"
                  checkBoxClassName="h-[15px] w-[15px]"
                  checked={_.includes(rolePermissions, parent.id)}
                  onChange={() =>
                    setModuleRolePermission(parent.id, parent.permission)
                  }
                >
                  <b>{parent.name}</b>
                </Checkbox>
                <b>
                  {subModules[parent.permission] &&
                    `(${subModules[parent.permission].length})`}
                </b>
              </div>

              <motion.div
                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                animate={{
                  opacity: _.includes(collapse, parent.id) ? 1 : 0,
                  height: _.includes(collapse, parent.id) ? 'auto' : 0,
                }}
                transition={{ duration: 0.15 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {subModules &&
                    subModules[parent.permission] &&
                    subModules[parent.permission].map((subModule) => (
                      <Card
                        key={subModule.id}
                        className="my-2 h-fit"
                        bodyClass="p-3"
                      >
                        <div
                          className="flex items-center justify-between cursor-pointer select-none"
                          onClick={() => onCollapse(subModule.id)}
                        >
                          <Checkbox
                            className="flex items-center h-[15px]"
                            checkBoxClassName="h-[15px] w-[15px]"
                            checked={_.includes(rolePermissions, subModule.id)}
                            onChange={() =>
                              setSubModuleRolePermission(
                                subModule.id,
                                subModule.permission,
                              )
                            }
                          >
                            <b>{subModule.name}</b>
                          </Checkbox>
                        </div>

                        <motion.div
                          initial={{
                            opacity: 0,
                            height: 0,
                            overflow: 'hidden',
                          }}
                          animate={{
                            opacity: _.includes(collapse, subModule.id) ? 1 : 0,
                            height: _.includes(collapse, subModule.id)
                              ? 'auto'
                              : 0,
                          }}
                          transition={{ duration: 0.15 }}
                        >
                          {/* <Card
														key={subModule.id}
														className="my-2"
														bodyClass="p-3"
													> */}
                          <div
                            key={subModule.id}
                            className="grid grid-cols-1 py-2 px-4 items-center cursor-pointer select-none"
                            onClick={() => onCollapse(child.id)}
                          >
                            {childModules &&
                              childModules[subModule.permission] &&
                              childModules[subModule.permission].map(
                                (child) => (
                                  <Checkbox
                                    className="flex items-center h-[15px] my-1"
                                    checkBoxClassName="h-[15px] w-[15px]"
                                    checked={_.includes(
                                      rolePermissions,
                                      child.id,
                                    )}
                                    onChange={() =>
                                      setChildRolePermission(child.id)
                                    }
                                  >
                                    {child.name}
                                  </Checkbox>
                                ),
                              )}
                          </div>
                          {/* </Card> */}
                        </motion.div>
                      </Card>
                    ))}
                </div>
              </motion.div>
            </Card>
          ))}
      </Card>
    </Container>
  )
}

export default RolePermissions
