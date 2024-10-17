import _ from "lodash";
export const APP_NAME = "Road Angel";
export const PERSIST_STORE_NAME = "admin";
export const REDIRECT_URL_KEY = "redirectUrl";
export const DATE_TIME_FORMAT = "DD-MM-YYYY HH:mm";

export const PAGE = 1;
export const DEFAULT_PAGE_SIZE = "20";
export const PAGE_SIZE_OPTIONS = ["20", "40", "60", "80", "100"];

export const FORM_LAYOUT = [
	"xl:grid-cols-6",
	"lg:grid-cols-4",
	"md:grid-cols-3",
	"sm:grid-cols-3",
	"xs:grid-cols-1",
];

export const QUERY_STATUS = {
	COMPLETED: "Completed",
	REJECTED: "Rejected",
	PENDING: "Pending",
};

export const DEFAULT_ROLES = {
	SUPER_ADMIN: "Super Admin",
	COMPANY_ADMIN: "Company Admin",
	BUSINESS_MANAGER: "Business Manager",
	REGIONAL_MANAGER: "Regional Manager",
	SALE_MANAGER: "Sale Manager",
};

export const DEFAULT_ROLES_LIST = [
	DEFAULT_ROLES.BUSINESS_MANAGER,
	DEFAULT_ROLES.REGIONAL_MANAGER,
	DEFAULT_ROLES.SALE_MANAGER,
];

// Post Status
export const POST_STATUS = {
	DRAFT: "Draft",
	ASSIGNED_FOR_REVIEW: "Assigned for Review",
	APPROVED: "Approved",
	SCHEDULED: "Scheduled",
	REWORK: "Rework",
	DONE: "Done",
};

export const POST_STATUS_LIST = [
	POST_STATUS.DRAFT,
	POST_STATUS.ASSIGNED_FOR_REVIEW,
	POST_STATUS.APPROVED,
	POST_STATUS.REWORK,
	POST_STATUS.SCHEDULED,
	POST_STATUS.DONE,
];

// Social Media Types
export const SOCIAL_MEDIA_TYPES = {
	FACEBOOK: "Facebook",
	INSTAGRAM: "Instagram",
	TWITTER: "Twitter",
	LINKEDIN: "LinkedIn",
	PINTEREST: "Pinterest",
	GOOGLEPLUS: "Google+",
};

export const ICONS = {
	[SOCIAL_MEDIA_TYPES.FACEBOOK]: "/img/fb-circle.svg",
	[SOCIAL_MEDIA_TYPES.INSTAGRAM]: "/img/insta-circle.svg",
};

export const UPLOAD_TYPES = {
	PICTURE: "Picture",
	VIDEO: "Video",
};

export const LABEL_COLORS = {
	red: {
		bg: "bg-red-50 dark:bg-red-500/10",
		text: "text-red-500 dark:text-red-100",
		dot: "bg-red-500",
	},
	orange: {
		bg: "bg-orange-50 dark:bg-orange-500/10",
		text: "text-orange-500 dark:text-orange-100",
		dot: "bg-orange-500",
	},
	amber: {
		bg: "bg-amber-50 dark:bg-amber-500/10",
		text: "text-amber-500 dark:text-amber-100",
		dot: "bg-amber-500",
	},
	yellow: {
		bg: "bg-yellow-50 dark:bg-yellow-500/10",
		text: "text-yellow-500 dark:text-yellow-100",
		dot: "bg-yellow-500",
	},
	lime: {
		bg: "bg-lime-50 dark:bg-lime-500/10",
		text: "text-lime-500 dark:text-lime-100",
		dot: "bg-lime-500",
	},
	green: {
		bg: "bg-green-50 dark:bg-green-500/10",
		text: "text-green-500 dark:text-green-100",
		dot: "bg-green-500",
	},
	emerald: {
		bg: "bg-emerald-50 dark:bg-emerald-500/10",
		text: "text-emerald-500 dark:text-emerald-100",
		dot: "bg-emerald-500",
	},
	teal: {
		bg: "bg-teal-50 dark:bg-teal-500/10",
		text: "text-teal-500 dark:text-teal-100",
		dot: "bg-teal-500",
	},
	cyan: {
		bg: "bg-cyan-50 dark:bg-cyan-500/10",
		text: "text-cyan-500 dark:text-cyan-100",
		dot: "bg-cyan-500",
	},
	sky: {
		bg: "bg-sky-50 dark:bg-sky-500/10",
		text: "text-sky-500 dark:text-sky-100",
		dot: "bg-sky-500",
	},
	blue: {
		bg: "bg-blue-50 dark:bg-blue-500/10",
		text: "text-blue-500 dark:text-blue-100",
		dot: "bg-blue-500",
	},
	indigo: {
		bg: "bg-indigo-50 dark:bg-indigo-500/10",
		text: "text-indigo-500 dark:text-indigo-100",
		dot: "bg-indigo-500",
	},
	purple: {
		bg: "bg-purple-50 dark:bg-purple-500/10",
		text: "text-purple-500 dark:text-purple-100",
		dot: "bg-purple-500",
	},
	fuchsia: {
		bg: "bg-fuchsia-50 dark:bg-fuchsia-500/10",
		text: "text-fuchsia-500 dark:text-fuchsia-100",
		dot: "bg-fuchsia-500",
	},
	pink: {
		bg: "bg-pink-50 dark:bg-pink-500/10",
		text: "text-pink-500 dark:text-pink-100",
		dot: "bg-pink-500",
	},
	rose: {
		bg: "bg-rose-50 dark:bg-rose-500/10",
		text: "text-rose-500 dark:text-rose-100",
		dot: "bg-rose-500",
	},
};

export const SOCIALMEDIA_META_DATA = {
	FACEBOOK: {
		APP_ID: import.meta.env.VITE_FACEBOOK_APP_ID,
		APP_SECRET: import.meta.env.VITE_FACEBOOK_APP_SECRET,
	},
};

export const FLOATING_POINT = {
	NONE: { format: "%v %c", code: "", minFraction: 0, maxFraction: 0 },
	TWO: { format: "%v %c", code: "", minFraction: 2, maxFraction: 2 },
};

// export const PAGE_ENGAGEMENTS = [
// 	"page_engaged_users",
// 	"page_post_engagements",
// 	"page_impressions",
// 	"page_impressions_paid",
// 	"page_impressions_organic_v2",
// 	"page_impressions_viral",
// 	"page_consumptions",
// 	"page_video_views",
// 	"page_video_complete_views_30s",
// 	"page_video_views_10s",
// 	"page_posts_impressions",
// 	"page_posts_impressions_paid",
// 	"page_posts_impressions_organic",
// 	"page_posts_impressions_viral",
// 	"page_views_total",
// ];

export const PAGE_ENGAGEMENTS = [
	{
		group: "Pages",
		name: "page_views_total",
	},
	{
		group: "Pages",
		name: "page_impressions",
	},
	{
		group: "Pages",
		name: "page_impressions_paid",
	},
	{
		group: "Pages",
		name: "page_impressions_organic_v2",
	},
	{
		group: "Pages",
		name: "page_impressions_viral",
	},
	{
		group: "Pages",
		name: "page_engaged_users",
	},
	{
		group: "Pages",
		name: "page_post_engagements",
	},
	{
		group: "Video",
		name: "page_video_views",
	},
	{
		group: "Video",
		name: "page_video_complete_views_30s",
	},
	{
		group: "Video",
		name: "page_video_views_10s",
	},
	{
		group: "Post",
		name: "page_consumptions",
	},
	{
		group: "Post",
		name: "page_posts_impressions",
	},
	{
		group: "Post",
		name: "page_posts_impressions_paid",
	},
	{
		group: "Post",
		name: "page_posts_impressions_organic",
	},
	{
		group: "Post",
		name: "page_posts_impressions_viral",
	},
];

export const PAGE_ENGAGEMENT_VALUES = {
	page_engaged_users: "Engaged Users",
	page_consumptions: "Consumptions",
	page_impressions: "Impressions",
	page_impressions_paid: "Impressions Paid",
	page_impressions_organic_v2: "Impressions Organic",
	page_impressions_viral: "Impressions Viral",
	page_post_engagements: "Post Engagements",
	page_posts_impressions: "Post Impressions",
	page_video_views: "Video Views",
	page_video_complete_views_30s: "Video Complete Views 30s",
	page_video_views_10s: "Video Views 10s",
	page_posts_impressions: "Posts Impressions",
	page_posts_impressions_paid: "Posts Impressions Paid",
	page_posts_impressions_organic: "Posts Impressions Organic",
	page_posts_impressions_viral: "Posts Impressions Viral",
	page_views_total: "Page Views Total",
};

export const PAGE_ENGAGEMENTS_INSTAGRAM = [
	{
		group: "Photo & Video",
		name: "impressions",
	},
	{
		group: "Photo & Video",
		name: "reach",
	},
	{
		group: "Page",
		name: "follower_count",
	},
	{
		group: "Page",
		name: "email_contacts",
	},
	{
		group: "Page",
		name: "phone_call_clicks",
	},
	{
		group: "Page",
		name: "text_message_clicks",
	},
	{
		group: "Page",
		name: "get_directions_clicks",
	},
	{
		group: "Page",
		name: "website_clicks",
	},
	{
		group: "Page",
		name: "profile_views",
	},
];

export const PAGE_ENGAGEMENT_VALUES_INSTAGRAM = {
	impressions: "Impressions",
	reach: "Reach",
	follower_count: "Follower Count",
	email_contacts: "Email Contacts",
	phone_call_clicks: "Phone Call Clicks",
	text_message_clicks: "Text Message Clicks",
	get_directions_clicks: "Directions Clicks",
	website_clicks: "Website Clicks",
	profile_views: "Profile Views",
};
