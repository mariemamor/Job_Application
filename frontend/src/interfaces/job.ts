export interface IJob {
  _id?: string;

  title: string;
  description: string;
  company: string;
  location: string;
  salary?: number;

  postedBy?: string; // filled by backend from token
  createdAt?: string;
  updatedAt?: string;
}
