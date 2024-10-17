import ApiService from "./ApiService";
const PRIFIX = 'auth'

export async function userSignIn(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/sign-in`,
    method: "post",
    data,
  });
}

export async function userSignUp(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/sign-up`,
    method: "post",
    data,
  });
}

export async function userSignOut(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/sign-out`,
    method: "get",
    data,
  });
}

export async function userForgotPassword(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/forgot-password`,
    method: "post",
    data,
  });
}

export async function userResetPassword(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/reset-password`,
    method: "post",
    data,
  });
}
