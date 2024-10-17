import ApiService from "./ApiService";
const PRIFIX = "submit-case";

export async function getBusinessCase() {
  return ApiService.fetchData({
    url: `${PRIFIX}`,
    method: "get",
  });
} 

export async function saveBusinessCase(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}`,
    method: "post",
    data,
  });
}

export async function deleteAccidentCase(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/accident-case/${id}`,
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
export async function saveAccidentCase(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/save-accident-case`,
    method: "post",
    data,
  });
}
export async function saveAccidentScenario(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/save-accident-scenario`,
    method: "post",
    data,
  });
}
export async function getAccidentScenario() {
  return ApiService.fetchData({
    url: `${PRIFIX}/accident-scenario`,
    method: "get",
  });
} 

export async function getAccidentCase(data) {
  const params = new URLSearchParams(data);
  return ApiService.fetchData({
    url: `${PRIFIX}/accident-case?${params}`,
    method: "get",
  });
}

export async function getDocument(data) {
  const params = new URLSearchParams(data);
  return ApiService.fetchData({
    url: `${PRIFIX}/accident-documents?${params}`,
    method: "get",
  });
}

export async function getAccidentCaseOne(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/accident-case/${id}`,
    method: "get",
  });
}

export async function getAccidentDocumentOne(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/accident-documents/${id}`,
    method: "get",
  });
}

export async function saveAccidentDocument(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/save-accident-documents`,
    method: "post",
    data,
  });
}
export async function deleteAccidentDocument(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/save-accident-documents/${id}`,
    method: "delete",
  });
}

export async function updateAccidentDocument(data, id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/save-accident-documents/${id}`,
    method: "put",
    data,
  });
}


export async function saveParticipantForm(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/save-participant`,
    method: "post",
    data,
  });
}
export async function saveSelectType(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/save-participant-type`,
    method: "post",
    data,
  });
}



export async function getAllParticipants(data) {
  const params = new URLSearchParams(data);
  return ApiService.fetchData({
    url: `${PRIFIX}/participant?${params}`,
    method: "get",
  });
} 

export async function updateParticipant(data, id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/participant/${id}`,
    method: "put",
    data,
  });
}

export async function deleteParticipant(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/participant/${id}`,
    method: "delete",
  });
}

export async function updateAccidentCase(data, id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/accident-case/${id}`,
    method: "put",
    data,
  });
}