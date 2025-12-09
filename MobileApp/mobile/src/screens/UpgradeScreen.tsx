import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const UpgradeScreen = () => {
  const { isDarkMode, theme } = useTheme();

  const plans = [
    {
      name: "Basic",
      price: "$0",
      period: "forever",
      features: [
        "Create up to 3 resumes",
        "Access to 3 resume templates",
        "Basic optimization",
        "PDF download",
        "Email support"
      ],
      featured: false
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "monthly",
      features: [
        "Unlimited resume creation",
        "Access to all 10+ premium templates",
        "Advanced AI optimization",
        "PDF & DOCX downloads",
        "Priority support",
        "Resume analytics",
        "Custom branding options"
      ],
      featured: true
    },
    {
      name: "Team",
      price: "$29.99",
      period: "monthly",
      features: [
        "Up to 10 users",
        "Unlimited resumes",
        "All Pro features",
        "Team management",
        "Shared templates",
        "Advanced analytics",
        "Dedicated account manager"
      ],
      featured: false
    }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textColor }]}>Choose Your Plan</Text>
        <Text style={[styles.subtitle, { color: isDarkMode ? '#aaa' : '#666' }]}>
          Unlock premium features to accelerate your career
        </Text>
      </View>

      <View style={styles.plansContainer}>
        {plans.map((plan, index) => (
          <View
            key={index}
            style={[
              styles.planCard,
              plan.featured && styles.featuredPlan,
              {
                backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
                borderColor: isDarkMode ? '#444444' : '#e0e0e0'
              }
            ]}
          >
            {plan.featured && (
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>MOST POPULAR</Text>
              </View>
            )}
            <Text style={[styles.planName, { color: theme.textColor }]}>{plan.name}</Text>
            <Text style={styles.planPrice}>
              <Text style={[styles.price, { color: theme.textColor }]}>{plan.price}</Text>
              <Text style={[styles.period, { color: isDarkMode ? '#aaa' : '#666' }]}>/{plan.period}</Text>
            </Text>

            <TouchableOpacity
              style={[
                styles.planButton,
                plan.featured ? { backgroundColor: '#007AFF' } : { backgroundColor: isDarkMode ? '#4a4a4a' : '#f0f0f0' }
              ]}
            >
              <Text style={[
                styles.planButtonText,
                plan.featured ? { color: '#fff' } : { color: isDarkMode ? '#fff' : '#333' }
              ]}>
                {plan.name === 'Basic' ? 'Current Plan' : 'Get Started'}
              </Text>
            </TouchableOpacity>

            <View style={styles.featuresContainer}>
              {plan.features.map((feature, featureIndex) => (
                <View key={featureIndex} style={styles.featureRow}>
                  <Text style={{ color: isDarkMode ? '#4CAF50' : '#4CAF50' }}>✓</Text>
                  <Text style={[styles.featureText, { color: theme.textColor, marginLeft: 10 }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.benefitsContainer}>
        <Text style={[styles.benefitsTitle, { color: theme.textColor }]}>Why Upgrade?</Text>
        <View style={styles.benefitRow}>
          <Text style={{ color: isDarkMode ? '#4CAF50' : '#4CAF50' }}>✓</Text>
          <Text style={[styles.benefitText, { color: theme.textColor, marginLeft: 10 }]}>
            Increase interview callbacks by 40%
          </Text>
        </View>
        <View style={styles.benefitRow}>
          <Text style={{ color: isDarkMode ? '#4CAF50' : '#4CAF50' }}>✓</Text>
          <Text style={[styles.benefitText, { color: theme.textColor, marginLeft: 10 }]}>
            2x faster resume creation with AI
          </Text>
        </View>
        <View style={styles.benefitRow}>
          <Text style={{ color: isDarkMode ? '#4CAF50' : '#4CAF50' }}>✓</Text>
          <Text style={[styles.benefitText, { color: theme.textColor, marginLeft: 10 }]}>
            ATS-optimized for 99% compatibility
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  plansContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 30,
  },
  planCard: {
    flex: 1,
    minWidth: 280,
    maxWidth: 320,
    borderRadius: 15,
    padding: 25,
    borderWidth: 1,
    position: 'relative',
  },
  featuredPlan: {
    borderWidth: 2,
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  featuredBadge: {
    position: 'absolute',
    top: -10,
    left: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  featuredBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  planPrice: {
    textAlign: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  period: {
    fontSize: 16,
  },
  planButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  planButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuresContainer: {
    marginTop: 15,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  benefitsContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  benefitText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
});

export default UpgradeScreen;
