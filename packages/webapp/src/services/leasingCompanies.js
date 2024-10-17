import ApiService from "./ApiService";
const PRIFIX = "leasing-insurance-company";

export async function getLeasingCompany(options = {}) {
  const params = new URLSearchParams(options);
  return ApiService.fetchData({
    url: `${PRIFIX}/leasing-company-data?${params}`,
    method: "get",
  });
}

export async function saveLeasingCompany(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}`,
    method: "post",
    data,
  });
}

export async function deleteLeasingCompany(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "delete",
  });
}
export async function updateLeasingCompany(data, id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "put",
    data,
  });
}