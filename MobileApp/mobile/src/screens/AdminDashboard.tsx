import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../services/supabaseService';
import { ResumeData, User } from '../types';

interface AdminDashboardMetrics {
  total_users: number;
  total_resumes: number;
  resumes_today: number;
  resumes_this_week: number;
  resumes_this_month: number;
  active_users_today: number;
  most_used_template: string | null;
  most_used_mode: string | null;
  avg_resumes_per_user: number;
}

const AdminDashboard: React.FC = () => {
  const navigation = useNavigation();
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in as admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const isAdmin = await AsyncStorage.getItem('adminLoggedIn');
      if (isAdmin !== 'true') {
        Alert.alert("Access Denied", "You need to be logged in as an admin to access this page.");
        navigation.goBack();
      }
    };

    checkAdminStatus();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call the Supabase function to get admin metrics
      const { data, error } = await supabase.rpc('get_comprehensive_admin_metrics');

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setMetrics(data[0]);
      }
    } catch (err: any) {
      console.error('Error fetching admin metrics:', err);
      setError('Failed to fetch metrics: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('adminLoggedIn');
    // Navigate to the main app dashboard
    navigation.navigate('MainApp');
  };

  const handleRefresh = () => {
    fetchMetrics();
  };

  const [adminCheck, setAdminCheck] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const isAdmin = await AsyncStorage.getItem('adminLoggedIn');
      setAdminCheck(isAdmin === 'true');
    };

    checkAdmin();
  }, []);

  if (adminCheck === false) {
    return (
      <View style={styles.container}>
        <View style={styles.accessDeniedContainer}>
          <Text style={styles.accessDeniedTitle}>🔒 Access Denied</Text>
          <Text style={styles.accessDeniedText}>
            You must be logged in as admin to access this page.
          </Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text style={styles.homeButtonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (adminCheck === null) {
    // Loading state while checking admin status
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Checking admin access...</Text>
        </View>
      </View>
    );
  }

  const StatCard: React.FC<{ 
    title: string, 
    value: string | number, 
    icon?: string,
    subtitle?: string 
  }> = ({ title, value, icon = '📊', subtitle }) => (
    <View style={styles.statCard}>
      <View style={styles.statCardHeader}>
        <Text style={styles.statCardIcon}>{icon}</Text>
        <Text style={styles.statCardTitle}>{title}</Text>
      </View>
      <Text style={styles.statCardValue}>{value}</Text>
      {subtitle && <Text style={styles.statCardSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>
          Monitor platform usage and performance metrics
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading metrics...</Text>
        </View>
      ) : metrics ? (
        <View style={styles.content}>
          {/* Main Stats */}
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Users"
              value={metrics.total_users}
              icon="👥"
            />
            <StatCard
              title="Total Resumes"
              value={metrics.total_resumes}
              icon="📄"
            />
          </View>
          
          <View style={styles.statsGrid}>
            <StatCard
              title="Today's Resumes"
              value={metrics.resumes_today}
              icon="📅"
            />
            <StatCard
              title="Avg. Per User"
              value={metrics.avg_resumes_per_user?.toFixed(2)}
              icon="📈"
            />
          </View>

          {/* Secondary Stats */}
          <View style={styles.statsGrid}>
            <StatCard
              title="This Week"
              value={metrics.resumes_this_week}
              icon="📆"
            />
            <StatCard
              title="This Month"
              value={metrics.resumes_this_month}
              icon="🗓️"
            />
          </View>
          
          <View style={styles.statsGrid}>
            <StatCard
              title="Active Today"
              value={metrics.active_users_today}
              icon="👁️"
            />
          </View>

          {/* Template and Mode Stats */}
          <View style={styles.statsSection}>
            <StatCard
              title="Most Used Template"
              value={metrics.most_used_template || 'N/A'}
              icon="📋"
              subtitle="Most popular template choice"
            />
          </View>
          
          <View style={styles.statsSection}>
            <StatCard
              title="Most Used Mode"
              value={metrics.most_used_mode || 'N/A'}
              icon="⚙️"
              subtitle="Most popular enhancement mode"
            />
          </View>

          {/* Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Platform Growth:</Text> {metrics.total_users} registered users,
                with {metrics.active_users_today} active today
              </Text>
              <Text style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Usage Pattern:</Text> {metrics.avg_resumes_per_user?.toFixed(2)}
                avg. resumes per user
              </Text>
              <Text style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Weekly Activity:</Text> {metrics.resumes_this_week} resumes created
              </Text>
              <Text style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Popular Choice:</Text> {metrics.most_used_template || 'N/A'}
                template with {metrics.most_used_mode || 'N/A'} mode
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No metrics available</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e6ff', // Light blue/purple background
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e6e6ff',
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c62828',
    marginBottom: 10,
  },
  accessDeniedText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  homeButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      }
    }),
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Glassmorphism effect
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Glassmorphism effect
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
  },
  refreshButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 100,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      }
    }),
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.8)',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 100,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      }
    }),
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 235, 235, 0.8)', // Light red with transparency
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 180, 180, 0.8)',
  },
  errorText: {
    color: '#c62828',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  content: {
    padding: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Glassmorphism effect
    flex: 0.48,
    padding: 18,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      }
    }),
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statCardIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  statCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statCardSubtitle: {
    fontSize: 12,
    color: '#777',
  },
  statsSection: {
    marginBottom: 15,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Glassmorphism effect
    padding: 20,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      }
    }),
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryContent: {
    gap: 8,
  },
  summaryItem: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  summaryLabel: {
    fontWeight: '600',
    color: '#333',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
  },
});

export default AdminDashboard;