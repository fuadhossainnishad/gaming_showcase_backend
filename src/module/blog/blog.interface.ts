export interface BlogInterface {
  title: string;
  description: string;
  author: string;
  blogImage: string;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface IBlogUpdate {
  blogId: string;
  title?: string;
  description?: string;
  author?: string;
  blogImage?: string;
  updatedAt: Date;
}
