
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  LogBox,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import '../../packages/shared-ui/src/app/configureRemoteControl';

if (__DEV__) {
  LogBox.ignoreLogs([
    'findNodeHandle is deprecated',
    'findHostInstance_DEPRECATED is deprecated',
  ]);
}

interface LearningContextType {
  activeModule: string;
  setActiveModule: (module: string) => void;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

const LearningContext = createContext<LearningContextType | undefined>(
  undefined
);

export const useLearning = () => {
  const context = useContext(LearningContext);

  if (!context) {
    throw new Error('useLearning must be used inside LearningContext.Provider');
  }

  return context;
};

void SplashScreen.preventAutoHideAsync().catch(() => {});

const MODULES = [
  {
    id: 'quiz',
    emoji: '🦁',
    title: 'Visual Quiz',
    description: 'Guess animals & fruits',
    color: '#F43F5E',
  },
  {
    id: 'story',
    emoji: '📖',
    title: 'Story Builder',
    description: 'Choose your adventure',
    color: '#8B5CF6',
  },
  {
    id: 'math',
    emoji: '🍎',
    title: 'Math Puzzles',
    description: 'Count objects & numbers',
    color: '#10B981',
  },
];

export default function App() {
  const [loaded, error] = useFonts({
    SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [activeModule, setActiveModule] = useState('home');
  const [score, setScore] = useState(0);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (loaded || error) {
      void SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const isWide = width >= 1000;

  return (
    <LearningContext.Provider
      value={{ activeModule, setActiveModule, score, setScore }}
    >
      <View style={styles.container}>
        {activeModule === 'home' ? (
          <ScrollView
            contentContainerStyle={styles.dashboard}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.welcomeBanner}>
              <Text style={styles.bannerTitle}>
                🌟 Welcome to Ella TV Academy
              </Text>
              <Text style={styles.bannerSubtitle}>
                Select a channel with your remote & press OK!
              </Text>
            </View>

            <Text style={styles.scoreText}>⭐ Star Score: {score}</Text>

            <View
              style={[
                styles.cardContainer,
                !isWide && styles.cardContainerCompact,
              ]}
            >
              {MODULES.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.tvCard,
                    { backgroundColor: item.color },
                    !isWide && styles.tvCardCompact,
                  ]}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${item.title}`}
                  onPress={() => setActiveModule(item.id)}
                >
                  <Text style={styles.cardEmoji}>{item.emoji}</Text>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDesc}>
                    {item.description}
                  </Text>
                  <Text style={styles.cardAction}>Press OK →</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.footerText}>
              Learn • Play • Explore • Earn Stars
            </Text>
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={styles.moduleScreen}>
            <Text style={styles.headerTitle}>
              {MODULES.find((item) => item.id === activeModule)?.emoji}{' '}
              {MODULES.find((item) => item.id === activeModule)?.title}
            </Text>

            <Text style={styles.scoreText}>
              ⭐ Star Score: {score}
            </Text>

            <View style={styles.moduleBox}>
              <Text style={styles.instructions}>
                {activeModule === 'quiz'
                  ? 'Ready to identify animals and fruits?'
                  : activeModule === 'story'
                    ? 'Ready to create your own adventure?'
                    : 'Ready to count and solve fun puzzles?'}
              </Text>

              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.8}
                accessibilityRole="button"
                onPress={() => setScore((previous) => previous + 10)}
              >
                <Text style={styles.actionButtonText}>
                  🎉 Correct! (+10 Stars)
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.backButtonContainer}
              accessibilityRole="button"
              onPress={() => setActiveModule('home')}
            >
              <Text style={styles.backButton}>
                ⬅ Back to TV Dashboard
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </LearningContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  dashboard: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 36,
  },
  welcomeBanner: {
    alignItems: 'center',
    marginBottom: 22,
  },
  bannerTitle: {
    fontSize: 38,
    color: '#F8FAFC',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  bannerSubtitle: {
    fontSize: 20,
    color: '#94A3B8',
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 23,
    color: '#FBBF24',
    fontWeight: '700',
    marginBottom: 28,
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 24,
    width: '100%',
    maxWidth: 1200,
  },
  cardContainerCompact: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  tvCard: {
    flex: 1,
    minHeight: 250,
    maxWidth: 350,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.25)',
    elevation: 8,
  },
  tvCardCompact: {
    flex: 0,
    width: '100%',
    maxWidth: 440,
    minHeight: 190,
  },
  cardEmoji: {
    fontSize: 58,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 25,
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  cardAction: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 16,
  },
  footerText: {
    color: '#64748B',
    fontSize: 16,
    marginTop: 32,
    textAlign: 'center',
  },
  moduleScreen: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  headerTitle: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  moduleBox: {
    backgroundColor: '#1E293B',
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 760,
    borderWidth: 3,
    borderColor: '#38BDF8',
  },
  instructions: {
    color: '#CBD5E1',
    fontSize: 20,
    marginBottom: 25,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#93C5FD',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
  },
  backButtonContainer: {
    padding: 18,
    marginTop: 14,
  },
  backButton: {
    color: '#38BDF8',
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
  },
});
