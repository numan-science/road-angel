import ApiService from "./ApiService";
const PRIFIX = "insurance-company";

export async function getInsuranceCompany(options = {}) {
  const params = new URLSearchParams(options);
  return ApiService.fetchData({
    url: `${PRIFIX}/company-data?${params}`,
    method: "get",
  });
} 

export async function saveInsuranceCompany(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}`,
    method: "post",
    data,
  });
}

export async function deleteInsuranceCompany(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "delete",
  });
}
export async function updateInsuranceCompany(data, id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "put",
    data,
  });
}

export async function getInsuranceCompanies(options = {}) {
	const params = new URLSearchParams(options);
	return ApiService.fetchData({
	  url: `${PRIFIX}/search-insurance?${params}`,
	  method: "get",
	});
  }