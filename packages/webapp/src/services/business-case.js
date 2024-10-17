import ApiService from "./ApiService";
const PRIFIX = "business-case";


export async function getBusinessCase(data) {
  const params = new URLSearchParams(data);
  return ApiService.fetchData({
    url: `${PRIFIX}?${params}`,
    method: "get",
  });
}
  

export async function getSingleBusinessCase(data) {
  const params = new URLSearchParams(data);
  return ApiService.fetchData({
    url: `${PRIFIX}/single-business-case-details?${params}`,
    method: "get",
  });
}

export async function getAllBusinessCase(data) {
  const params = new URLSearchParams(data);
  return ApiService.fetchData({
    url: `${PRIFIX}/All?${params}`,
    method: "get",
  });
}
export async function saveBusinessCase(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/save`,
    method: "post",
    data,
  });
}

export async function deleteBusinessCase(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "delete",
  });
}
export async function updateBusinessCase(data, id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "put",
    data,
  });
}

export async function getAcitivityBusinessCase(businessCaseId) {
  return ApiService.fetchData({
    url: `${PRIFIX}/business-case-activity/${businessCaseId}`,
    method: "get",
  });
}
