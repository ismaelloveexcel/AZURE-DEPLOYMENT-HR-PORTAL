import axios from "axios";
import { Template, TemplateCreate } from "../types/template";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

class TemplateService {
  private client = axios.create({
    baseURL: API_BASE + "/templates",
    headers: { "Content-Type": "application/json" },
  });

  async list(): Promise<Template[]> {
    const res = await this.client.get("");
    return res.data;
  }

  async get(id: number): Promise<Template> {
    const res = await this.client.get(`/${id}`);
    return res.data;
  }

  async create(data: Partial<TemplateCreate>): Promise<Template> {
    const res = await this.client.post("", data);
    return res.data;
  }

  async update(id: number, data: Partial<TemplateCreate>): Promise<Template> {
    const res = await this.client.put(`/${id}`, data);
    return res.data;
  }
}

export const templateService = new TemplateService();
