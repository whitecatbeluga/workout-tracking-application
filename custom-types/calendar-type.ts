import { UserProfile } from "firebase/auth";

export type MarkedDate = {
  id: string;
  date: string;
  img_url: string | undefined;
  image_urls: string[];
  created_at: any;
  total_sets: string;
  total_volume: string;
  user_id: string;
  username: string;
  full_name: string;
  email: string;
  visible_to_everyone: boolean;
  description: string;
  duration: string;
  title: string;
  like_count: number;
  comment_count: number;
};
