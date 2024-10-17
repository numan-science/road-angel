import ApiService from "./ApiService";
const PRIFIX = "client";

export async function getClients(data) {
	const params = new URLSearchParams(data);
	return ApiService.fetchData({
		url: `${PRIFIX}?${params}`,
		method: "get",
	});
}

export async function getClient(id) {
	return ApiService.fetchData({
		url: `${PRIFIX}/${id}`,
		method: "get",
	});
}

export async function saveClient(data) {
	return ApiService.fetchData({
		url: `${PRIFIX}/save`,
		method: "post",
		data,
	});
}

export async function deleteClient(id) {
	return ApiService.fetchData({
		url: `${PRIFIX}/${id}`,
		method: "delete",
	});
}

export async function searchClient(data) {
	const params = new URLSearchParams(data);
	return ApiService.fetchData({
		url: `${PRIFIX}/search-client?${params}`,
		method: "get",
	});
}

export async function searchClientUser(data) {
	const params = new URLSearchParams(data);
	return ApiService.fetchData({
		url: `${PRIFIX}/search-client-user?${params}`,
		method: "get",
	});
}
