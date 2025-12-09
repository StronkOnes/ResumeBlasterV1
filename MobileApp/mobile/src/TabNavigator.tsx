import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from './screens/DashboardScreen';
import HistoryScreen from './screens/HistoryScreen';
import UpgradeScreen from './screens/UpgradeScreen';
import { Icons } from './components/Icons';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'FileText';
          } else if (route.name === 'History') {
            iconName = 'Clock';
          } else if (route.name === 'Upgrade') {
            iconName = 'Crown';
          }

          const Icon = Icons[iconName];
          return <Icon size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Upgrade" component={UpgradeScreen} />
    </Tab.Navigator>
  );
};
