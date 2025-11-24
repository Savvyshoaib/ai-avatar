import { AxiosResponse } from 'axios';
import Api from './axiosInstance';

// Avatar API interfaces
export interface CreateAvatarPayload {
  user_name: string;
  oliv_id: string;
}

export interface UploadDocumentAvatarPayload {
  user_name: string;
  file: File;
}

export interface AddKnowledgePayload {
  user_name: string;
  knowledge: string;
  full_name: string;
  headline: string;
  location: string;
  short_bio: string;
  personality: string;
  skills: string[];
  about_yourself: string;
  strength: string;
  customTone?: string;
}

export interface AvatarResponse {
  id?: string;
  user_name?: string;
  oliv_id?: string;
  message?: string;
  [key: string]: any;
}

export interface ChatAvatarPayload {
  user_name: string;
  message: string;
}

export interface IncreaseKnowledgePayload {
  user_name: string;
  knowledge: string;
}

// Avatar API functions
export const createAvatar = (payload: CreateAvatarPayload): Promise<AxiosResponse<AvatarResponse>> => {
  const formData = new FormData();
  formData.append("user_name", payload.user_name);
  formData.append("oliv_id", payload.oliv_id);

  return Api.post("/avatar/create", formData);
};


export const uploadAvatarDocument = (payload: UploadDocumentAvatarPayload) => {
  const formData = new FormData();
  formData.append("user_name", payload.user_name);
  formData.append("file", payload.file);

  return Api.post(`/avatar/${payload.user_name}/upload-document`, formData);
};

export const addKnowledge = (payload: AddKnowledgePayload) => {
  console.log("Adding knowledge with payload:", payload);

  const formData = new FormData();
  formData.append("knowledge", payload.knowledge);
  formData.append("user_name", payload.user_name);
  formData.append("full_name", payload.full_name);
  formData.append("headline", payload.headline);
  formData.append("location", payload.location);
  formData.append("short_bio", payload.short_bio);
  formData.append("personality", payload.personality);
  payload.skills.forEach((skill) => {
    formData.append("skills[]", skill);
  });
  formData.append("about_yourself", payload.about_yourself);
  formData.append("strength", payload.strength);

  return Api.post(`/avatar/add-knowledge`, formData);
};


export const chatAvatar = (payload: ChatAvatarPayload) => {
  const formData = new FormData();
  formData.append("user_name", payload.user_name);
  formData.append("message", payload.message);

  return Api.post(`/avatar/${payload.user_name}/chat`, formData);
};

export const increaseKnowledge = (payload: IncreaseKnowledgePayload) => {
  const formData = new FormData();
  formData.append("user_name", payload.user_name);
  formData.append("knowledge", payload.knowledge);

  return Api.post(`/avatar/increase-knowledge`, formData);
};