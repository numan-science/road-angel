import ApiService from "./ApiService";
const PRIFIX = "role";

export async function getRoles(options = {}) {
	const params = new URLSearchParams(options);
	return ApiService.fetchData({
		url: `${PRIFIX}?${params}`,
		method: "get",
	});
}

export async function getRole(roleId) {
	return ApiService.fetchData({
		url: `${PRIFIX}/${roleId}`,
		method: "get",
	});
}

export async function saveRole(data) {
	return ApiService.fetchData({
		url: `${PRIFIX}/save`,
		method: "post",
		data,
	});
}

export async function deleteRole(id) {
	return ApiService.fetchData({
		url: `${PRIFIX}/${id}`,
		method: "delete",
	});
}

export async function getRolePermission(roleId, options = {}) {
	const params = new URLSearchParams(options);
	return ApiService.fetchData({
		url: `${PRIFIX}/${roleId}/permissions?${params}`,
		method: "get",
	});
}

export async function getAllPermissions() {
	return ApiService.fetchData({
		url: `${PRIFIX}/permissions`,
		method: "get",
	});
}

export async function saveRolePermissions(roleId, data) {
	return ApiService.fetchData({
		url: `${PRIFIX}/${roleId}/save-role-permission`,
		method: "post",
		data,
	});
}

export async function searchRole(options = {}) {
	const params = new URLSearchParams(options);
	return ApiService.fetchData({
		url: `${PRIFIX}/search?${params}`,
		method: "get",
	});
}
