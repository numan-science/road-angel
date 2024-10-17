import ApiService from "./ApiService";
const PRIFIX = "stats";

export async function getPostCardStates(options = {}) {
	const params = new URLSearchParams(options);
	return ApiService.fetchData({
		url: `${PRIFIX}/card-stats?${params}`,
		method: "get",
	});
}

export async function getPlatformPosts(options = {}) {
	const params = new URLSearchParams(options);
	return ApiService.fetchData({
		url: `${PRIFIX}/platform-posts?${params}`,
		method: "get",
	});
}

export async function getOverview(options = {}) {
	const params = new URLSearchParams(options);
	return ApiService.fetchData({
		url: `${PRIFIX}/overview?${params}`,
		method: "get",
	});
}


export async function getInsuranceCompany(options = {}) {
	const params = new URLSearchParams(options);
	return ApiService.fetchData({
		url: `${PRIFIX}/insurance-companies?${params}`,
		method: "get",
	});
}

export async function getPostList(options = {}) {
	const params = new URLSearchParams(options);
	return ApiService.fetchData({
		url: `${PRIFIX}/recent-posts?${params}`,
		method: "get",
	});
}
