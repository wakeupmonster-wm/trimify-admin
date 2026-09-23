import { axiosInstance } from "./axios.instance";

// export const apiConnector = (
//   method,
//   url,
//   bodyData = null,
//   headers = {},
//   params = {}
// ) => {
//   return axiosInstance({
//     method,
//     url,
//     data: bodyData,
//     headers: { ...headers },
//     params,
//   });
// };

export const apiConnector = (method, url, bodyData, headers, params, options = {}) => {
  // When sending FormData (file uploads), remove the default Content-Type
  // so axios can auto-set "multipart/form-data" with the correct boundary.
  const isFormData = bodyData instanceof FormData;

  const resolvedHeaders = headers
    ? headers
    : isFormData
      ? { "Content-Type": undefined }
      : null;

  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: resolvedHeaders,
    params: params ? params : null,
    ...options,
  });
};
