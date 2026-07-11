import { apiConnector } from "@/services/axios/axios.connector";
import { SUBADMIN_ENPOINTS } from "@/services/api-endpoints/subadmin.endpoints";

/*================= Sub Admin Management =====================*/

export const getSubAdminManagementAPI = async () => {
  return apiConnector("GET", SUBADMIN_ENPOINTS.SUBADMIN_LIST);
};