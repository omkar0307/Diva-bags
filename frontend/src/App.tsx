import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelectionSession } from './hooks/useSelectionSession';
import { FloatingHearts } from './components/FloatingHearts';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { LoadingScreen } from './screens/LoadingScreen';
import { SelectionScreen } from './screens/SelectionScreen';
import { DislikeReviewScreen } from './screens/DislikeReviewScreen';
import { FinalSelectionScreen } from './screens/FinalSelectionScreen';
import { MessagePromptScreen } from './screens/MessagePromptScreen';
import { MessageScreen } from './screens/MessageScreen';
import { CompletedScreen } from './screens/CompletedScreen';
import { ResumeScreen } from './screens/ResumeScreen';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const App: React.FC = () => {
  const {
    screen,
    currentPhase,
    candidateBags,
    currentBag,
    bagIndex,
    totalCandidates,
    phaseDecisions,
    dislikedBags,
    finalBag,
    message,
    loading,
    isSubmitting,
    error,
    clearError,
    startJourney,
    resumeJourney,
    handleIndexChange,
    handleCardDecision,
    proceedToDislikeReview,
    handleConfirmElimination,
    handleReconsider,
    handleProceedToMessagePrompt,
    handleProceedToMessageComposer,
    handleSendMessage,
    handleDevReset,
  } = useSelectionSession();

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden">
      {/* Dreamy ambient floating particles background */}
      <FloatingHearts />

      {/* Error Toast Notification */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-4 z-50 px-4 py-3 rounded-2xl glass-card border border-rose-300 shadow-xl flex items-center gap-3 text-xs sm:text-sm text-rose-700 font-semibold max-w-sm mx-4"
          >
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={clearError}
              className="text-rose-500 hover:text-rose-800 text-xs underline font-bold"
            >
              Okay
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dynamic Viewport Container */}
      <div className="relative z-10 w-full max-w-md min-h-screen flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {screen === 'loading' && (
            <motion.div key="loading">
              <LoadingScreen />
            </motion.div>
          )}

          {screen === 'welcome' && (
            <motion.div key="welcome">
              <WelcomeScreen onStart={startJourney} loading={loading} />
            </motion.div>
          )}

          {screen === 'resume' && (
            <motion.div key="resume">
              <ResumeScreen
                phaseNumber={currentPhase?.phase_number || 1}
                bagIndex={bagIndex}
                onResume={resumeJourney}
                onRestart={handleDevReset}
              />
            </motion.div>
          )}

          {screen === 'selection' && (
            <motion.div key="selection">
              <SelectionScreen
                phaseNumber={currentPhase?.phase_number || 1}
                candidateBags={candidateBags}
                currentIndex={bagIndex}
                totalCandidates={totalCandidates}
                decisions={phaseDecisions}
                onIndexChange={handleIndexChange}
                onLike={(bagId) => handleCardDecision(bagId, 'liked')}
                onDislike={(bagId) => handleCardDecision(bagId, 'disliked')}
                onProceedToReview={proceedToDislikeReview}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          )}

          {screen === 'dislike_review' && (
            <motion.div key="dislike_review">
              <DislikeReviewScreen
                dislikedBags={dislikedBags}
                onConfirmElimination={handleConfirmElimination}
                onReconsider={handleReconsider}
                loading={isSubmitting}
              />
            </motion.div>
          )}

          {screen === 'final' && finalBag && (
            <motion.div key="final">
              <FinalSelectionScreen
                finalBag={finalBag}
                onProceed={handleProceedToMessagePrompt}
              />
            </motion.div>
          )}

          {screen === 'message_prompt' && (
            <motion.div key="message_prompt">
              <MessagePromptScreen onYes={handleProceedToMessageComposer} />
            </motion.div>
          )}

          {screen === 'message' && (
            <motion.div key="message">
              <MessageScreen
                onSend={handleSendMessage}
                loading={isSubmitting}
              />
            </motion.div>
          )}

          {screen === 'completed' && finalBag && (
            <motion.div key="completed">
              <CompletedScreen
                finalBag={finalBag}
                message={message}
                onStartOver={handleDevReset}
                loading={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default App;
