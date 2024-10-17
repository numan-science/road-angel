import React from 'react'
import authRoute from './authRoute'

export const publicRoutes = [
    ...authRoute
]

export const protectedRoutes = [
  
	{
        key: 'dashboard',
        path: '/dashboard',
        component: React.lazy(() => import('@/views/dashboard')),
        authority: [],
    },
    {
		key: "role",
		path: "/role",
		component: React.lazy(() => import("@/views/role")),
		authority: ["can_view_role"],
		meta: {
			pageContainerType: "gutterless",
		},
	},
	{
		key: "role-permission",
		path: "/role/:roleId/permissions",
		component: React.lazy(() =>
			import("@/views/role/role-permissions/index.jsx")
		),
		authority: ["can_edit_role_permission"],
		meta: {
			pageContainerType: "gutterless",
		},
	},
	{
		key: "insurance-company",
		path: "/insurance-company",
		component: React.lazy(() =>
			import("@/views/insurance-company/index.jsx")
		),
		authority: ["can_view_insurance_company"],
		meta: {
			pageContainerType: "gutterless",
		},
	},
	{
		key: "business-case",
		path: "/business-case",
		component: React.lazy(() =>
			import("@/views/business-case/index.jsx")
		),
		authority: ["can_view_business_case"],
		meta: {
			pageContainerType: "gutterless",
		},
	},
	{
		key: "leasing-company",
		path: "/leasing-company",
		component: React.lazy(() =>
			import("@/views/leasing-company/index.jsx")
		),
		authority: ["can_view_leasing_insurance_company"],
		meta: {
			pageContainerType: "gutterless",
		},
	},
	{
		key: "workshop",
		path: "/workshop",
		component: React.lazy(() =>
			import("@/views/workshop/index.jsx")
		),
		authority: ["can_view_workshop"],
		meta: {
			pageContainerType: "gutterless",
		},
	},
	{
		key: "towService",
		path: "/tow-service",
		component: React.lazy(() =>
			import("@/views/tow-service/index.jsx")
		),
		authority: ["can_view_tow_service"],
		meta: {
			pageContainerType: "gutterless",
		},
	},
	{
		key: "region",
		path: "/region",
		component: React.lazy(() =>
			import("@/views/region/index.jsx")
		),
		authority: ["can_view_region"],
		meta: {
			pageContainerType: "gutterless",
		},
	},
	{
		key: "business-agent",
		path: "/business-agent",
		component: React.lazy(() =>
			import("@/views/business-agent/index.jsx")
		),
		authority: ["can_view_business_agents"],
		meta: {
			pageContainerType: "gutterless",
		},
	},
	{
		key: "sale-agent",
		path: "/sale-agent",
		component: React.lazy(() =>
			import("@/views/sale-agent/index.jsx")
		),
		authority: ["can_view_sale_agents"],
		meta: {
			pageContainerType: "gutterless",
		},
	},
	{
		key: "submit-case",
		path: "/submit-case",
		component: React.lazy(() =>
			import("@/views/submit-case/Submit.jsx")
		),
		authority: [],
		admin: false,
		meta: {
			pageContainerType: "gutterless",
		},	
	},
	{
		key: "submit-case",
		path: "cases-list/accident-case-preview/:accidentCaseId/submit-case/:participantId",
		component: React.lazy(() =>
		import("@/views/submit-case/Submit.jsx")
		),
		authority: [],
		admin: false,
		meta: {
			pageContainerType: "gutterless",
		},	
	},

	{
		key: "pdf",
		path: "cases-list/accident-case-preview/:accidentCaseId/:businessCaseId/pdf",
		component: React.lazy(() =>
		import("@/views/accident-case-preview/PdfViewer.jsx")
		),
		authority: [],
		admin: false,
		meta: {
			pageContainerType: "gutterless",
		},	
	},
	{
		key: "damagePdf",
		path: "cases-list/accident-case-preview/:accidentCaseId/:participantId/damage-pdf",
		component: React.lazy(() =>
		import("@/views/accident-case-preview/DamageReportViewer.jsx")
		),
		authority: [],
		admin: false,
		meta: {
			pageContainerType: "gutterless",
		},	
	},
	{
		key: "submit-case",
		path: "cases-list/accident-case-preview/:accidentCaseId/submit-case",
		component: React.lazy(() =>
		import("@/views/submit-case/Submit.jsx")
		),
		authority: [],
		admin: false,
		meta: {
			pageContainerType: "gutterless",
		},	
	},
	{
		key: "business-case",
		path: "cases-list/accident-case-preview/:accidentCaseId/business-case/:businessCaseId",
		component: React.lazy(() =>
			import("@/views/accident-case-preview/BusinessCase.jsx")
		),
		authority: [],
		admin: false,
		meta: {
			pageContainerType: "gutterless",
		},	
	},
	{
		key: "business-case",
		path: "cases-list/accident-case-preview/:accidentCaseId/business-case",
		component: React.lazy(() =>
			import("@/views/accident-case-preview/BusinessCase.jsx")
		),
		authority: ["can_view_business_case"],
		admin: false,
		meta: {
			pageContainerType: "gutterless",
		},	
	},
	{
		key: "accident-document",
		path: "cases-list/accident-case-preview/:accidentCaseId/accident-document",
		component: React.lazy(() =>
			import("@/views/accident-case-preview/AccidentDocument.jsx")
		),
		authority: ["can_view_accident-document"],
		admin: false,
		meta: {
			pageContainerType: "gutterless",
		},	
	},
	{
		key: "accident-document",
		path: "cases-list/accident-case-preview/:accidentCaseId/accident-document/:documentId",
		component: React.lazy(() =>
			import("@/views/accident-case-preview/AccidentDocument.jsx")
		),
		authority: ["can_view_accident-document"],
		admin: false,
		meta: {
			pageContainerType: "gutterless",
		},	
	},
	{
		key: "cases-list",
		path: "/cases-list",
		component: React.lazy(() =>
			import("@/views/cases-list/index.jsx")
		),
		authority: ["can_view_cases_list"],
		meta: {
			pageContainerType: "gutterless",
		},
	},
	{
		key: "accident-case-preview",
		path: "cases-list/accident-case-preview/:accidentCaseId", 
		component: React.lazy(() =>
		  import("@/views/accident-case-preview/AccidentCasePreview.jsx")
		),
		authority: [],
		meta: {
		  pageContainerType: "gutterless",
		},
	  },
	  {
		key: "accident-case-preview",
		path: "business-case/:accidentCaseId/:businessCaseId/pdf", 
		component: React.lazy(() =>
		  import("@/views/accident-case-preview/BusinessReport.jsx")
		),
		authority: [],
		meta: {
		  pageContainerType: "gutterless",
		},
	  },
	{
		key: "account-settings",
		path: "/account-settings",
		component: React.lazy(() =>
			import("@/views/account-settings/index.jsx")
		),
		authority: [],
		meta: {
			pageContainerType: "gutterless",
		},
	},
	
]