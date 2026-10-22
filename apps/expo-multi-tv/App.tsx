import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { AppNavigator } from '@multi-tv/shared-ui';
import { LogBox, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import '../../packages/shared-ui/src/app/configureRemoteControl';

if (__DEV__) {
  LogBox.ignoreLogs([
    /findNodeHandle is deprecated/,
    /findHostInstance_DEPRECATED is deprecated/,
  ]);
}

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [activeModule, setActiveModule] = useState<'home' | 'quiz' | 'story' | 'math'>('home');
  const [starScore, setStarScore] = useState(0);

  // --- Quiz Module State ---
  const [quizStep, setQuizStep] = useState(0);
  const quizData = [
    { question: "Who am I? 🦁", options: ["Tiger", "Lion", "Monkey"], correct: 1 },
    { question: "What fruit is red and crunchy? 🍎", options: ["Apple", "Banana", "Mango"], correct: 0 },
    { question: "Which animal has a long trunk? 🐘", options: ["Zebra", "Elephant", "Giraffe"], correct: 1 },
  ];
  const [quizFeedback, setQuizFeedback] = useState('');

  // --- Story Builder Module State ---
  const [storyNode, setStoryNode] = useState('start');

  // --- Math Puzzle Module State ---
  const [mathStep, setMathStep] = useState(0);
  const mathData = [
    { emojis: "🍎 🍎 🍎", count: 3, options: [2, 3, 5], correct: 3 },
    { emojis: "⭐ ⭐ ⭐ ⭐ ⭐", count: 5, options: [4, 5, 6], correct: 5 },
    { emojis: "🍌 🍌", count: 2, options: [1, 2, 4], correct: 2 },
  ];
  const [mathFeedback, setMathFeedback] = useState('');

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // --- MODULE 1: VISUAL QUIZ SCREEN ---
  if (activeModule === 'quiz') {
    const currentQ = quizData[quizStep];
    return (
      <View style={styles.gameContainer}>
        <Text style={styles.gameHeader}>🦁 Visual Quiz Channel</Text>
        <Text style={styles.scoreBadge}>⭐ Stars: {starScore}</Text>

        <View style={styles.gameCard}>
          <Text style={styles.questionText}>{currentQ.question}</Text>
          <View style={styles.optionsRow}>
            {currentQ.options.map((opt, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={styles.optionButton}
                onPress={() => {
                  if (idx === currentQ.correct) {
                    setStarScore(s => s + 10);
                    setQuizFeedback('🎉 Correct! Awesome job!');
                    setTimeout(() => {
                      setQuizFeedback('');
                      if (quizStep < quizData.length - 1) setQuizStep(s => s + 1);
                      else setQuizStep(0);
                    }, 1200);
                  } else {
                    setQuizFeedback('❌ Oops! Try another one.');
                  }
                }}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {quizFeedback ? <Text style={styles.feedbackText}>{quizFeedback}</Text> : null}
        </View>

        <TouchableOpacity onPress={() => setActiveModule('home')}>
          <Text style={styles.backLink}>⬅ Back to TV Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- MODULE 2: STORY BUILDER SCREEN ---
  if (activeModule === 'story') {
    return (
      <View style={styles.gameContainer}>
        <Text style={styles.gameHeader}>📖 Story Builder (Choose Your Adventure)</Text>
        <Text style={styles.scoreBadge}>⭐ Stars: {starScore}</Text>

        <View style={styles.gameCard}>
          {storyNode === 'start' && (
            <>
              <Text style={styles.questionText}>🦁 Sher ko bhook lagi hai. Woh kya kare?</Text>
              <View style={styles.optionsRow}>
                <TouchableOpacity style={styles.optionButton} onPress={() => { setStoryNode('eatFruit'); setStarScore(s => s + 5); }}>
                  <Text style={styles.optionText}>[A] Fal Khaye (Eat Fruits)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={() => { setStoryNode('hunt'); setStarScore(s => s + 5); }}>
                  <Text style={styles.optionText}>[B] Shikar Kare (Hunt)</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {storyNode === 'eatFruit' && (
            <>
              <Text style={styles.questionText}>🍎 Sher ne meethe fal khaye aur khush ho gaya! Moral: Healthy eating is great.</Text>
              <TouchableOpacity style={styles.optionButton} onPress={() => setStoryNode('start')}>
                <Text style={styles.optionText}>🔄 Play Story Again</Text>
              </TouchableOpacity>
            </>
          )}

          {storyNode === 'hunt' && (
            <>
              <Text style={styles.questionText}>🌲 Sher jungle mein aage bada aur apne doston ke sath daud lagai!</Text>
              <TouchableOpacity style={styles.optionButton} onPress={() => setStoryNode('start')}>
                <Text style={styles.optionText}>🔄 Play Story Again</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity onPress={() => setActiveModule('home')}>
          <Text style={styles.backLink}>⬅ Back to TV Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- MODULE 3: MATH PUZZLES SCREEN ---
  if (activeModule === 'math') {
    const currentMath = mathData[mathStep];
    return (
      <View style={styles.gameContainer}>
        <Text style={styles.gameHeader}>🍎 Math & Object Puzzles</Text>
        <Text style={styles.scoreBadge}>⭐ Stars: {starScore}</Text>

        <View style={styles.gameCard}>
          <Text style={styles.emojiDisplay}>{currentMath.emojis}</Text>
          <Text style={styles.questionText}>How many objects do you see?</Text>
          
          <View style={styles.optionsRow}>
            {currentMath.options.map((num, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={styles.optionButton}
                onPress={() => {
                  if (num === currentMath.correct) {
                    setStarScore(s => s + 10);
                    setMathFeedback('🌟 Correct counting!');
                    setTimeout(() => {
                      setMathFeedback('');
                      if (mathStep < mathData.length - 1) setMathStep(s => s + 1);
                      else setMathStep(0);
                    }, 1200);
                  } else {
                    setMathFeedback('❌ Try counting again!');
                  }
                }}
              >
                <Text style={styles.optionText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {mathFeedback ? <Text style={styles.feedbackText}>{mathFeedback}</Text> : null}
        </View>

        <TouchableOpacity onPress={() => setActiveModule('home')}>
          <Text style={styles.backLink}>⬅ Back to TV Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- HOME DASHBOARD ---
  return (
    <View style={{ flex: 1 }}>
      <AppNavigator fontsLoaded={loaded || !!error} />
      
      <View style={styles.tvAcademyOverlay}>
        <View style={styles.welcomeBanner}>
          <Text style={styles.bannerTitle}>🌟 Welcome to Ella TV Academy</Text>
          <Text style={styles.bannerSubtitle}>Select a channel with your remote & press OK! | Star Score: {starScore}</Text>
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity 
            style={[styles.tvCard, { backgroundColor: '#f43f5e' }]} 
            onPress={() => setActiveModule('quiz')}
          >
            <Text style={styles.cardEmoji}>🦁</Text>
            <Text style={styles.cardTitle}>Visual Quiz</Text>
            <Text style={styles.cardDesc}>Guess animals & fruits</Text>
            <Text style={styles.pressOk}>Press OK →</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tvCard, { backgroundColor: '#8b5cf6' }]} 
            onPress={() => setActiveModule('story')}
          >
            <Text style={styles.cardEmoji}>📖</Text>
            <Text style={styles.cardTitle}>Story Builder</Text>
            <Text style={styles.cardDesc}>Choose your adventure</Text>
            <Text style={styles.pressOk}>Press OK →</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tvCard, { backgroundColor: '#10b981' }]} 
            onPress={() => setActiveModule('math')}
          >
            <Text style={styles.cardEmoji}>🍎</Text>
            <Text style={styles.cardTitle}>Math Puzzles</Text>
            <Text style={styles.cardDesc}>Count objects & numbers</Text>
            <Text style={styles.pressOk}>Press OK →</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Learn • Play • Explore • Earn Stars</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tvAcademyOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#0f172a',
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeBanner: { marginBottom: 30, alignItems: 'center' },
  bannerTitle: { fontSize: 40, color: '#f8fafc', fontWeight: 'bold', marginBottom: 8 },
  bannerSubtitle: { fontSize: 18, color: '#fbbf24', fontWeight: '600' },
  cardContainer: { flexDirection: 'row', justifyContent: 'center', gap: 30, width: '100%' },
  tvCard: {
    width: 280, height: 250, borderRadius: 24, padding: 25,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)',
  },
  cardEmoji: { fontSize: 50, marginBottom: 10 },
  cardTitle: { fontSize: 24, color: '#ffffff', fontWeight: 'bold', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 15 },
  pressOk: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
  footerText: { color: '#64748b', marginTop: 30, fontSize: 14, letterSpacing: 1 },
  
  gameContainer: {
    flex: 1, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  gameHeader: { fontSize: 32, color: '#ffffff', fontWeight: 'bold', marginBottom: 10 },
  scoreBadge: { fontSize: 20, color: '#fbbf24', marginBottom: 25, fontWeight: 'bold' },
  gameCard: {
    backgroundColor: '#1e293b', padding: 40, borderRadius: 24, alignItems: 'center', width: '75%',
    borderWidth: 3, borderColor: '#38bdf8',
  },
  questionText: { fontSize: 24, color: '#f8fafc', marginBottom: 25, textAlign: 'center', fontWeight: '600' },
  optionsRow: { flexDirection: 'row', gap: 20, justifyContent: 'center' },
  optionButton: {
    backgroundColor: '#2563eb', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12,
    borderWidth: 2, borderColor: '#93c5fd',
  },
  optionText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  feedbackText: { marginTop: 20, fontSize: 20, color: '#4ade80', fontWeight: 'bold' },
  emojiDisplay: { fontSize: 48, marginBottom: 15 },
  backLink: { color: '#38bdf8', fontSize: 18, marginTop: 30, fontWeight: 'bold' },
});