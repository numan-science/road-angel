import ApiService from "./ApiService";
const PRIFIX = "workshop";

export async function getWorkshop(options = {}) {
  const params = new URLSearchParams(options);
  return ApiService.fetchData({
    url: `${PRIFIX}/workshop-data?${params}`,
    method: "get",
  });
} 

export async function saveWorkshop(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}`,
    method: "post",
    data,
  });
}

export async function deleteWorkshop(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "delete",
  });
}
export async function updateWorkshop(data, id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "put",
    data,
  });
}