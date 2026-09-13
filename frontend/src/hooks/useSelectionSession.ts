import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import { Bag, ScreenState, BoyfriendMessage, Phase } from '../types';

const SESSION_STORAGE_KEY = 'diva_bag_match_token_v1';

function getOrCreateToken(): string {
  let token = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!token) {
    token = 'diva_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
    localStorage.setItem(SESSION_STORAGE_KEY, token);
  }
  return token;
}

export function useSelectionSession() {
  const [token] = useState<string>(getOrCreateToken);
  const [screen, setScreen] = useState<ScreenState>('loading');
  const [currentPhase, setCurrentPhase] = useState<Phase | null>(null);
  const [candidateBags, setCandidateBags] = useState<Bag[]>([]);
  const [bagIndex, setBagIndex] = useState<number>(0);
  const [phaseDecisions, setPhaseDecisions] = useState<Record<string, 'liked' | 'disliked'>>({});
  const [dislikedBags, setDislikedBags] = useState<Bag[]>([]);
  const [finalBag, setFinalBag] = useState<Bag | null>(null);
  const [message, setMessage] = useState<BoyfriendMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Keep a ref to candidate bags to avoid stale closures in timeouts
  const candidateBagsRef = useRef(candidateBags);
  candidateBagsRef.current = candidateBags;

  // Initial checkpoint restore
  const loadSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Init session in DB
      await api.initSession(token);
      // Fetch full checkpoint state
      const state = await api.getFullState(token);

      const serverScreen = state.session.current_screen;
      const phaseNum = state.session.current_phase_number;

      if (serverScreen === 'empty') {
        setCandidateBags([]);
        setScreen('empty');
      } else if (state.session.status === 'completed' && state.final_bag) {
        setFinalBag(state.final_bag);
        setMessage(state.message);
        setScreen('completed');
      } else if (state.session.final_bag_id && state.final_bag) {
        setFinalBag(state.final_bag);
        setScreen(serverScreen === 'message' ? 'message' : serverScreen === 'message_prompt' ? 'message_prompt' : 'final');
      } else if (phaseNum > 0 && state.current_phase) {
        setCurrentPhase(state.current_phase);
        setCandidateBags(state.bags);
        setBagIndex(state.session.current_bag_index || 0);

        // Restore decisions for current phase
        const decMap: Record<string, 'liked' | 'disliked'> = {};
        if (state.decisions) {
          state.decisions.forEach((d) => {
            if (d.decision === 'liked' || d.decision === 'disliked') {
              decMap[d.bag_id] = d.decision;
            }
          });
        }
        setPhaseDecisions(decMap);

        if (state.current_phase.status === 'reviewing_dislikes' || serverScreen === 'dislike_review') {
          const dl = await api.getDislikedBags(token);
          setDislikedBags(dl);
          setScreen('dislike_review');
        } else {
          // Returning user who left halfway: show cute resume screen!
          setScreen('resume');
        }
      } else {
        setScreen('welcome');
      }
    } catch (err: any) {
      console.error('Session restore error:', err);
      setError('Oopsieee 😭 something went wrong. Let’s try that again 💕');
      setScreen('welcome');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Start Selection: Welcome -> Loading animation -> Selection
  const startJourney = async () => {
    try {
      setIsSubmitting(true);
      setScreen('loading');
      const res = await api.startSelection(token);

      // Short delay for cute loading animation
      setTimeout(async () => {
        if (res.final_bag_id) {
          const state = await api.getFullState(token);
          setFinalBag(state.final_bag);
          setScreen('final');
        } else {
          const state = await api.getFullState(token);
          setCurrentPhase(state.current_phase);
          setCandidateBags(state.bags);
          setBagIndex(0);
          setPhaseDecisions({});
          setScreen('selection');
        }
        setIsSubmitting(false);
      }, 1800);
    } catch (err) {
      console.error('Start selection error:', err);
      setError('Oopsieee 😭 could not start the magic.');
      setIsSubmitting(false);
      setScreen('welcome');
    }
  };

  // Resume from checkpoint
  const resumeJourney = () => {
    if (currentPhase?.status === 'reviewing_dislikes') {
      setScreen('dislike_review');
    } else {
      setScreen('selection');
    }
  };

  // Move between cards (syncs checkpoint bag index)
  const handleIndexChange = useCallback((newIndex: number) => {
    if (newIndex >= 0 && newIndex < candidateBagsRef.current.length) {
      setBagIndex(newIndex);
      api.updateScreen(token, 'selection', newIndex).catch(() => {});
    }
  }, [token]);

  // Advance to Dislike Review (or to next round if 0 dislikes)
  const proceedToDislikeReview = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const dl = await api.getDislikedBags(token);
      setDislikedBags(dl);

      if (dl.length === 0) {
        // No dislikes in this round! All liked -> confirm directly
        const confirmRes = await api.confirmDislikes(token);
        if (confirmRes.next_action === 'final') {
          const state = await api.getFullState(token);
          setFinalBag(state.final_bag);
          setScreen('final');
        } else {
          const state = await api.getFullState(token);
          setCurrentPhase(state.current_phase);
          setCandidateBags(state.bags);
          setBagIndex(0);
          setPhaseDecisions({});
          setScreen('selection');
        }
      } else {
        await api.updateScreen(token, 'dislike_review', bagIndex);
        setScreen('dislike_review');
      }
    } catch (err) {
      console.error('Proceed to review error:', err);
      setError('Oopsieee 😭 let me prepare the review again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [token, bagIndex]);

  // Record or change a decision directly on a card (stays on card without auto-sliding)
  const handleCardDecision = useCallback(
    async (bagId: string, decision: 'liked' | 'disliked') => {
      const updatedDecisions = { ...phaseDecisions, [bagId]: decision };
      setPhaseDecisions(updatedDecisions);

      try {
        // Send decision to backend (advanceScreen: false keeps session in selection mode)
        await api.recordDecision(token, bagId, decision, bagIndex, false);
      } catch (err) {
        console.error('Record decision error:', err);
        setError('Oopsieee 😭 let me save that decision again.');
      }
    },
    [phaseDecisions, token, bagIndex]
  );

  // Backward compatible handleDecision for active card
  const handleDecision = async (decision: 'liked' | 'disliked') => {
    const curBag = candidateBags[bagIndex];
    if (curBag) {
      await handleCardDecision(curBag.id, decision);
    }
  };

  // Undo last decision (kept for backward compatibility)
  const handleUndo = async () => {
    if (isSubmitting || bagIndex <= 0) return;

    try {
      setIsSubmitting(true);
      const res = await api.undoDecision(token);
      setBagIndex(res.new_index);
      setScreen('selection');
    } catch (err) {
      console.error('Undo decision error:', err);
      setError('Could not undo that, please try again 💕');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dislike review: Confirm elimination
  const handleConfirmElimination = async () => {
    try {
      setIsSubmitting(true);
      const res = await api.confirmDislikes(token);

      if (res.next_action === 'empty') {
        setCandidateBags([]);
        setScreen('empty');
      } else if (res.next_action === 'final') {
        const state = await api.getFullState(token);
        setFinalBag(state.final_bag);
        setScreen('final');
      } else {
        // Next phase started
        const state = await api.getFullState(token);
        setCurrentPhase(state.current_phase);
        setCandidateBags(state.bags);
        setBagIndex(0);
        setPhaseDecisions({});
        setScreen('selection');
      }
    } catch (err) {
      console.error('Confirm dislikes error:', err);
      setError('Oopsieee 😭 could not confirm eliminations.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dislike review: Reconsider (brings back selection so user can slide through and change choices!)
  const handleReconsider = async () => {
    try {
      setIsSubmitting(true);
      const res = await api.reconsiderDislikes(token);
      const state = await api.getFullState(token);

      const decMap: Record<string, 'liked' | 'disliked'> = {};
      if (state.decisions) {
        state.decisions.forEach((d) => {
          if (d.decision === 'liked' || d.decision === 'disliked') {
            decMap[d.bag_id] = d.decision;
          }
        });
      }
      setPhaseDecisions(decMap);
      setBagIndex(res.resume_index || 0);
      setScreen('selection');
    } catch (err) {
      console.error('Reconsider error:', err);
      setError('Oopsieee 😭 could not reload for reconsideration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Final bag screen -> Prompt for message
  const handleProceedToMessagePrompt = async () => {
    await api.updateScreen(token, 'message_prompt');
    setScreen('message_prompt');
  };

  // Message prompt -> Message composer
  const handleProceedToMessageComposer = async () => {
    await api.updateScreen(token, 'message');
    setScreen('message');
  };

  // Send message
  const handleSendMessage = async (text: string) => {
    try {
      setIsSubmitting(true);
      const saved = await api.submitMessage(token, text);
      setMessage(saved);
      setScreen('completed');
    } catch (err) {
      console.error('Send message error:', err);
      setError('Oopsieee 😭 could not save your message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dev Reset
  const handleDevReset = async () => {
    try {
      setLoading(true);
      await api.devReset(token);
      setCurrentPhase(null);
      setCandidateBags([]);
      setBagIndex(0);
      setPhaseDecisions({});
      setDislikedBags([]);
      setFinalBag(null);
      setMessage(null);
      setScreen('welcome');
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    screen,
    currentPhase,
    candidateBags,
    currentBag: candidateBags[bagIndex] || null,
    bagIndex,
    totalCandidates: candidateBags.length,
    phaseDecisions,
    dislikedBags,
    finalBag,
    message,
    loading,
    isSubmitting,
    error,
    clearError: () => setError(null),
    startJourney,
    resumeJourney,
    handleIndexChange,
    handleCardDecision,
    handleDecision,
    handleUndo,
    proceedToDislikeReview,
    handleConfirmElimination,
    handleReconsider,
    handleProceedToMessagePrompt,
    handleProceedToMessageComposer,
    handleSendMessage,
    handleDevReset,
  };
}
