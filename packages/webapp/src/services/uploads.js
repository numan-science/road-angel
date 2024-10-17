import ApiService from "./ApiService";
const PRIFIX = "uploads";

export async function uploadPicture(data) {
	return ApiService.fetchData({
		url: `${PRIFIX}/file`,
		method: "post",
		data,
	});
}

export async function uploadFile(file) {
	const formData = new FormData();
	formData.append("file", file, file.name);
	const response = await uploadPicture(formData);
	return response;
}
