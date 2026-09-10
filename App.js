import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { COLORS } from './constants/theme';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

import OnboardingScreen from './screens/OnboardingScreen';
import LanguageScreen from './screens/LanguageScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import RateContentScreen from './screens/RateContentScreen';
import ReviewSubmittedScreen from './screens/ReviewSubmittedScreen';
import ProfileScreen from './screens/ProfileScreen';
import MyReviewedItemsScreen from './screens/MyReviewedItemsScreen';
import MyRewardsScreen from './screens/MyRewardsScreen';
import LeaderboardRewardsScreen from './screens/LeaderboardRewardsScreen';
import ReportContentScreen from './screens/ReportContentScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import HelpSupportScreen from './screens/HelpSupportScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  return (
    <View style={[
      styles.customTabBar, 
      { paddingBottom: Math.max(insets.bottom, 12) } 
    ]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName = 'compass';
        let labelName = t('tab_discover');

        if (route.name === 'Discover') {
          iconName = 'compass';
          labelName = t('tab_discover');
        } else if (route.name === 'Ratings') {
          iconName = 'star';
          labelName = t('tab_ratings');
        } else if (route.name === 'Profile') {
          iconName = 'user';
          labelName = t('tab_profile');
        }

        const iconColor = isFocused ? COLORS.primary : COLORS.textMuted;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.8}
          >
            {isFocused && <View style={styles.activeTopLine} />}
            <Feather name={iconName} size={20} color={iconColor} />
            <Text style={[
              styles.tabLabel, 
              { color: iconColor },
              isFocused && styles.tabLabelFocused
            ]}>
              {labelName}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Ratings" component={MyReviewedItemsScreen} /> 
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAppLaunchState = async () => {
      try {
        const storedLang = await AsyncStorage.getItem('rankcine_language');
        const onboardingDone = await AsyncStorage.getItem('rankcine_onboarding_completed');

        if (storedLang || onboardingDone === 'true') {
          setInitialRoute('Main');
        } else {
          setInitialRoute('Language');
        }
      } catch {
        setInitialRoute('Language');
      }
    };

    checkAppLaunchState();
  }, []);

  if (!initialRoute) {
    return (
      <SafeAreaProvider>
        <View style={styles.bootSplashContainer}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
            <Stack.Screen name="Language" component={LanguageScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="RateContent" component={RateContentScreen} />
            <Stack.Screen name="ReviewSubmitted" component={ReviewSubmittedScreen} />
            <Stack.Screen name="MyReviewedItems" component={MyReviewedItemsScreen} />
            <Stack.Screen name="MyRewards" component={MyRewardsScreen} />
            <Stack.Screen name="LeaderboardRewards" component={LeaderboardRewardsScreen} />
            <Stack.Screen name="ReportContent" component={ReportContentScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  bootSplashContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center'
  },
  customTabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1.5,
    borderTopColor: COLORS.primary,
    paddingTop: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 4,
  },
  activeTopLine: {
    position: 'absolute',
    top: -10,
    left: '25%',
    right: '25%',
    height: 2.5,
    backgroundColor: COLORS.primary,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  tabLabelFocused: {
    fontWeight: '900',
    color: COLORS.primary,
  }
});