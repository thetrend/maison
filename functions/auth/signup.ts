import { HandlerResponse } from "@netlify/functions";
import messageHelper from "../utils/messageHelper";

const signup = async (event): Promise<HandlerResponse> => {
  try {
    return messageHelper(`This is a string. ${event.httpMethod}`);
  } catch (error) {
    return messageHelper(error);
  }
};

export default signup;