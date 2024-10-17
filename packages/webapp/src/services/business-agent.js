import ApiService from "./ApiService";
const PRIFIX = "business-agents";

export async function getBusinessAgent() {
  return ApiService.fetchData({
    url: `${PRIFIX}`,
    method: "get",
  });
} 

export async function saveBusinessAgent(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}`,
    method: "post",
    data,
  });
}

export async function deleteBusinessAgent(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "delete",
  });
}
export async function updateBusinessAgent(data, id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "put",
    data,
  });
}