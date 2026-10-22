
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, {
  useEffect,
  useState,
  createContext,
  useContext,
} from 'react';
import { AppNavigator } from '@multi-tv/shared-ui';
import {
  LogBox,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

import '../../packages/shared-ui/src/app/configureRemoteControl';

// Suppress specific deprecation warnings in development.
if (__DEV__) {
  LogBox.ignoreLogs([
    'findNodeHandle is deprecated',
    'findHostInstance_DEPRECATED is deprecated',
  ]);

  const originalWarn = console.warn;

  console.warn = (...args: unknown[]) => {
    const message = String(args[0] ?? '');

    if (
      message.includes('findNodeHandle is deprecated') ||
      message.includes('findHostInstance_DEPRECATED is deprecated')
    ) {
      return;
    }

    originalWarn(...args);
  };
}

// Learning context
interface LearningContextType {
  activeModule: string;
  setActiveModule: (mod: string) => void;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

const LearningContext = createContext<LearningContextType>({
  activeModule: 'home',
  setActiveModule: () => {},
  score: 0,
  setScore: () => {},
});

export const useLearning = () => useContext(LearningContext);

// Prevent the splash screen from hiding automatically.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [loaded, error] = useFonts({
    SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [activeModule, setActiveModule] = useState('home');
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});

      if (error) {
        console.warn('Error loading fonts:', error);
      }
    }
  }, [loaded, error]);

  const moduleTitles: Record<string, string> = {
    quiz: '🦁 Visual Quiz Channel',
    story: '📖 Story Builder (Choose Adventure)',
    math: '🍎 Math & Object Puzzles',
  };

  const learningContextValue: LearningContextType = {
    activeModule,
    setActiveModule,
    score,
    setScore,
  };

  return (
    <LearningContext.Provider value={learningContextValue}>
      <View style={styles.appContainer}>
        {activeModule === 'home' ? (
          <>
            <View style={styles.navigatorContainer}>
              <AppNavigator fontsLoaded={loaded || !!error} />
            </View>

            <View style={styles.hackathonBar}>
              <Pressable
                style={styles.navButton}
                onPress={() => setActiveModule('quiz')}
                accessibilityRole="button"
              >
                <Text style={styles.navBtn}>🎮 1. Visual Quiz</Text>
              </Pressable>

              <Pressable
                style={styles.navButton}
                onPress={() => setActiveModule('story')}
                accessibilityRole="button"
              >
                <Text style={styles.navBtn}>📚 2. Story Builder</Text>
              </Pressable>

              <Pressable
                style={styles.navButton}
                onPress={() => setActiveModule('math')}
                accessibilityRole="button"
              >
                <Text style={styles.navBtn}>🔢 3. Math Puzzles</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.container}>
            <Text style={styles.headerTitle}>
              {moduleTitles[activeModule]}
            </Text>

            <Text style={styles.scoreText}>⭐ Score: {score}</Text>

            <View style={styles.moduleBox}>
              <Text style={styles.instructions}>
                Use your TV remote Left/Right and OK buttons to play!
              </Text>

              <Pressable
                style={styles.actionButton}
                onPress={() => setScore((previousScore) => previousScore + 10)}
                accessibilityRole="button"
              >
                <Text style={styles.actionButtonText}>
                  Correct Answer / Action (+10)
                </Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.backButton}
              onPress={() => setActiveModule('home')}
              accessibilityRole="button"
            >
              <Text style={styles.backButtonText}>
                ⬅ Back to Home Dashboard
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </LearningContext.Provider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  navigatorContainer: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  headerTitle: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  scoreText: {
    fontSize: 22,
    color: '#fbbf24',
    marginBottom: 30,
  },

  moduleBox: {
    backgroundColor: '#1e293b',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    width: '80%',
    borderWidth: 2,
    borderColor: '#38bdf8',
  },

  instructions: {
    color: '#94a3b8',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },

  actionButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  actionButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  backButton: {
    marginTop: 30,
    padding: 10,
  },

  backButtonText: {
    color: '#38bdf8',
    fontSize: 16,
    textDecorationLine: 'underline',
  },

  hackathonBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },

  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 6,
  },

  navBtn: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
