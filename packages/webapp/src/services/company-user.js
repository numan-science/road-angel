import ApiService from "./ApiService";
const PRIFIX = "company-user";

export async function getCompanyUsers(data) {
  const params = new URLSearchParams(data);
  return ApiService.fetchData({
    url: `${PRIFIX}?${params}`,
    method: "get",
  });
}

export async function saveCompanyUser(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/save`,
    method: "post",
    data,
  });
}

export async function deleteCompanyUser(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "delete",
  });
}
