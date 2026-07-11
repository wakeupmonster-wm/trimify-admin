import { apiConnector } from "@/services/axios/axios.connector";
import { PROGRAM } from "@/services/api-endpoints/program.endpoints";

export const getProgramManagementAPI = async (params = {}) => {
  return apiConnector("GET", PROGRAM.PROGRAM_LIST, null, null, params);
};
