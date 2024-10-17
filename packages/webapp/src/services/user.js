import ApiService from "./ApiService";
const PRIFIX = "users";


export async function getUsers(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}`,
    method: "get",
  });
}

export async function isFirstTimeLogin() {
  return ApiService.fetchData({
    url: `${PRIFIX}/first-time-login`,
    method: "get",
  });
}
export async function saveUser(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/save`,
    method: "post",
    data,
  });
}
export async function updateUser(data, id) { 
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "put",
    data,
  });
}

export async function deleteUser(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "delete",
  });
}
export async function updatePassword(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/update-password`,
    method: "post",
    data,
  });
}

export async function searchUser(data) {
  const params = new URLSearchParams(data);
  return ApiService.fetchData({
    url: `${PRIFIX}/search-user?${params}`,
    method: "get",
  });
}
