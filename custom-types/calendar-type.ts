export type MarkedDate = {
  date: string;
  img_url: string | undefined;
  id: string;
  postTitle: string;
  postDescription: string;
  postDuration: string;
  created_at: any;
  total_sets: string;
  total_volume: string;
  like_count: number;
  comment_count: number;
  liked_by_current_user: boolean;
};

export type MarkedDates = MarkedDate[];
