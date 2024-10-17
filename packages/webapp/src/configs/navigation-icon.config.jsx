import React from 'react'
import {
    HiOutlineViewGridAdd,
    HiOutlineHome,
    HiOutlineBriefcase,
    HiOutlineUsers,
    HiOutlineChartPie,
    HiOutlineLogout
} from 'react-icons/hi'

import { RiCheckboxMultipleLine, RiGroupLine, RiSettings5Line, RiUserLine, RiUserStarLine, RiHomeGearLine, RiSafe2Fill, RiListCheck, RiCompassDiscoverLine, RiBrush3Line } from 'react-icons/ri'

const navigationIcon = {
    home: <HiOutlineHome />,
    role: <RiUserStarLine />,
    dashboard: <HiOutlineChartPie />,
    insuranceCompany: <HiOutlineUsers />,
    leasingCompany:<RiCompassDiscoverLine/>,
    business: <RiUserLine />,
    region: <HiOutlineViewGridAdd />,
    workshop: <HiOutlineBriefcase />,
    towService: <RiSettings5Line />,
    saleAgent: <RiGroupLine/>,
    businessAgent: <RiCheckboxMultipleLine />,
    submitCase:<RiSafe2Fill/>,
    casesList:<RiListCheck/>,
    businessCase:<RiBrush3Line/>,
    accountSettings:<RiHomeGearLine/>,
    logout: <HiOutlineLogout />
    
}

export default navigationIcon