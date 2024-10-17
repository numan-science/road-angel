import ApiService from "./ApiService";
const PRIFIX = "sale-agents";

export async function getSaleAgent() {
  return ApiService.fetchData({
    url: `${PRIFIX}`,
    method: "get",
  });
} 

export async function saveSaleAgent(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}`,
    method: "post",
    data,
  });
}

export async function deleteSaleAgent(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "delete",
  });
}
export async function updateSaleAgent(data, id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "put",
    data,
  });
}