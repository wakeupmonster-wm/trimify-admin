import { apiConnector } from "@/services/axios/axios.connector";
import { PROGRAM_INTRO } from "@/services/api-endpoints/program.endpoints";

export const getProgramIntroAPI = async (id) => {
  return apiConnector("GET", PROGRAM_INTRO.PROGRAM_INTRO_GET(id));
};

export const addProgramIntroAPI = async (data) => {
  return apiConnector("POST", PROGRAM_INTRO.PROGRAM_INTRO_ADD, data);
};

export const updateProgramIntroAPI = async (id, data) => {
  return apiConnector("POST", PROGRAM_INTRO.PROGRAM_INTRO_UPDATE(id), data);
};
