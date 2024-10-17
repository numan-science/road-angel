import React, { useState, useEffect, Suspense, lazy } from 'react'
import { Tabs } from '@/components/ui'
import { AdaptableCard, Container } from '@/components/shared'
import { useLocation } from 'react-router-dom'
const Profile = lazy(() => import('./components/Profile'))
const Password = lazy(() => import('./components/Password'))
import { useTranslation } from 'react-i18next'

const { TabNav, TabList } = Tabs
const settingsMenu = {
  profile: { label: 'Profile', path: 'profile' },
  password: { label: 'Password', path: 'password' },
}

const Settings = () => {
  const [currentTab, setCurrentTab] = useState('profile')

  const location = useLocation()
  const path = location.pathname.substring(
    location.pathname.lastIndexOf('/') + 1,
  )

  const onTabChange = (val) => {
    setCurrentTab(val)
  }

  useEffect(() => {
    if (Object.keys(settingsMenu).includes(path)) {
      setCurrentTab(path)
    } else {
      setCurrentTab('profile')
    }
  }, [])
  const { t } = useTranslation()
  return (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-end">
          <h3>{t('heading.Account Settings')}</h3>
        </div>
      </div>
      <Container className="p-4">
        <AdaptableCard>
          <Tabs value={currentTab} onChange={(val) => onTabChange(val)}>
            <TabList>
              {Object.keys(settingsMenu).map((key) => (
                <TabNav key={key} value={key}>
                  {settingsMenu[key].label}
                </TabNav>
              ))}
            </TabList>
          </Tabs>
          <div className="p-4">
            <Suspense fallback={<></>}>
              {currentTab === 'profile' && <Profile />}
              {currentTab === 'password' && <Password />}
            </Suspense>
          </div>
        </AdaptableCard>
      </Container>
    </>
  )
}

export default Settings
