import axios from 'axios';
const baseUrl = process.env.NODE_ENV == "development" ? process.env.REACT_APP_API : process.env.REACT_APP_DOMAIN;

export const uploadSerivce = {
  upload: async (payload) => {
    const response = await axios.post(`${baseUrl}/upload`, payload);
    return response;
  }
}

export const airdropService = {
  createUser: async (payload) => {
    const response = await axios.post(`${baseUrl}/airdrop/store`, payload);
    return response;
  },
  airdrop: async (payload) => {
    const response = await axios.post(`${baseUrl}/airdrop`, payload);
    return response;
  }
}