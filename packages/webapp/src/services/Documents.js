import ApiService from "./ApiService";
const PRIFIX = "insurance-documents";

export async function getInsuranceCompanyDocument() {
  return ApiService.fetchData({
    url: `${PRIFIX}`,
    method: "get",
  });
} 

export async function saveInsuranceCompanyDocument(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}`,
    method: "post",
    data,
  });
}

export async function deleteInsuranceCompanyDocument(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "delete",
  });
}
export async function updateInsuranceCompanyDocument(data, id) {
    
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "put",
    data,
  });
}