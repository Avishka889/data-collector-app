import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

const Colors = {
  primary: '#15B4C2',
  secondary: '#F6AC1B',
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#1E293B',
  textLight: '#64748B',
};

export default function QRScreen() {
  // This URL will be replaced with your actual hosted domain later (e.g., https://your-app.com/patient-form)
  // For local testing on your computer's browser, you can use: http://localhost:8081/patient-form
  const formUrl = "https://wellmed-data-collection.web.app/patient-form";

  const onShare = async () => {
    try {
      await Share.share({
        message: `Please fill out your patient details here: ${formUrl}`,
        url: formUrl,
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Patient Form QR</Text>
        <Text style={styles.description}>
          Show this QR code to the patient. They can scan it with their phone camera to open the form directly.
        </Text>

        <View style={styles.qrContainer}>
          <QRCode
            value={formUrl}
            size={200}
            color="#000000"
            backgroundColor="#FFFFFF"
          />
        </View>

        <Text style={styles.linkText} numberOfLines={1} adjustsFontSizeToFit>
          {formUrl}
        </Text>

        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Ionicons name="share-social-outline" size={20} color={Colors.card} style={{marginRight: 8}} />
          <Text style={styles.shareButtonText}>Share Link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  linkText: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
    width: '100%',
  },
  shareButton: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
