export interface Bag {
  id: string;
  name: string;
  image_url: string;
  display_order: number;
}

export type ScreenState = 
  | 'welcome'
  | 'loading'
  | 'selection'
  | 'dislike_review'
  | 'final'
  | 'message_prompt'
  | 'message'
  | 'completed'
  | 'resume';

export interface SelectionSession {
  id: string;
  session_token: string;
  current_phase_number: number;
  current_bag_index: number;
  current_screen: ScreenState;
  status: 'active' | 'completed';
  final_bag_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Phase {
  id: string;
  session_id: string;
  phase_number: number;
  status: 'in_progress' | 'reviewing_dislikes' | 'completed';
  candidate_bag_ids: string[];
  created_at: string;
  completed_at: string | null;
}

export interface Decision {
  id: string;
  phase_id: string;
  bag_id: string;
  decision: 'liked' | 'disliked' | 'confirmed_dislike';
  created_at: string;
  updated_at: string;
}

export interface BoyfriendMessage {
  id: string;
  session_id: string;
  final_bag_id: string;
  message_text: string;
  created_at: string;
}

export interface FullSessionState {
  session: SelectionSession;
  current_phase: Phase | null;
  decisions: Decision[];
  bags: Bag[];
  final_bag: Bag | null;
  message: BoyfriendMessage | null;
}
