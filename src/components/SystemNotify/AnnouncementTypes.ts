export interface Announcement {
  id: string;
  title: string;
  description: string;
  link: string;
  type: string;
  status: string;
  app_slug: string;
  published_at: string;
  expires_at: string | null;
  updated_at: string;
}