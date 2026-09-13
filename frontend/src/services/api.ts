import axios from 'axios';
import { FullSessionState, Bag, Decision, BoyfriendMessage, ScreenState } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  // Session management
  async initSession(sessionToken: string) {
    const res = await client.post('/sessions', { session_token: sessionToken });
    return res.data;
  },

  async getFullState(sessionToken: string): Promise<FullSessionState> {
    const res = await client.get(`/sessions/${sessionToken}/state`);
    return res.data;
  },

  async startSelection(sessionToken: string) {
    const res = await client.post(`/sessions/${sessionToken}/start`);
    return res.data;
  },

  async updateScreen(sessionToken: string, currentScreen: ScreenState, currentBagIndex?: number) {
    const payload: { current_screen: ScreenState; current_bag_index?: number } = {
      current_screen: currentScreen,
    };
    if (typeof currentBagIndex === 'number') {
      payload.current_bag_index = currentBagIndex;
    }
    const res = await client.patch(`/sessions/${sessionToken}`, payload);
    return res.data;
  },

  // Decisions
  async recordDecision(
    sessionToken: string,
    bagId: string,
    decision: 'liked' | 'disliked',
    currentIndex?: number,
    advanceScreen?: boolean
  ): Promise<Decision> {
    const payload: {
      bag_id: string;
      decision: 'liked' | 'disliked';
      current_index?: number;
      advance_screen?: boolean;
    } = {
      bag_id: bagId,
      decision,
    };
    if (typeof currentIndex === 'number') {
      payload.current_index = currentIndex;
    }
    if (typeof advanceScreen === 'boolean') {
      payload.advance_screen = advanceScreen;
    }
    const res = await client.post(`/decisions/${sessionToken}`, payload);
    return res.data;
  },

  async undoDecision(sessionToken: string) {
    const res = await client.delete(`/decisions/${sessionToken}/last`);
    return res.data;
  },

  // Dislike review & Phase progression
  async getDislikedBags(sessionToken: string): Promise<Bag[]> {
    const res = await client.get(`/phases/${sessionToken}/disliked-bags`);
    return res.data;
  },

  async confirmDislikes(sessionToken: string) {
    const res = await client.post(`/phases/${sessionToken}/confirm-dislikes`);
    return res.data;
  },

  async reconsiderDislikes(sessionToken: string) {
    const res = await client.post(`/phases/${sessionToken}/reconsider`);
    return res.data;
  },

  // Boyfriend message
  async submitMessage(sessionToken: string, messageText: string): Promise<BoyfriendMessage> {
    const res = await client.post(`/messages/${sessionToken}`, {
      message_text: messageText,
    });
    return res.data;
  },

  // Dev reset
  async devReset(sessionToken: string) {
    const res = await client.post(`/sessions/${sessionToken}/reset`);
    return res.data;
  },
};
