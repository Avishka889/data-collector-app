import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Colors = {
  primary: '#15B4C2',
  secondary: '#F6AC1B',
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#1E293B',
  textLight: '#64748B',
  border: '#E2E8F0',
  error: '#EF4444',
  success: '#10B981',
};

const medicalHistoryItems = [
  { key: 'DM', label: 'DM - Diabetic Mellitus' },
  { key: 'HTN', label: 'HTN - Hypertension' },
  { key: 'DL', label: 'DL - Dyslipidemia' },
  { key: 'Thyroid', label: 'Thyroid' },
  { key: 'Asthma', label: 'Asthma' },
  { key: 'Arthritis', label: 'Arthritis' },
  { key: 'Others', label: 'Others' },
];

export default function FormScreen() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    age: '',
    contactNumber: '',
    medicalHistory: [] as string[],
    medicalHistoryOthers: '',
  });

  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleMedicalHistory = (key: string) => {
    setFormData(prev => {
      const current = prev.medicalHistory;
      if (current.includes(key)) {
        return { ...prev, medicalHistory: current.filter(k => k !== key) };
      } else {
        return { ...prev, medicalHistory: [...current, key] };
      }
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.age || !formData.contactNumber || !formData.address) {
      Alert.alert('Incomplete', 'Please fill in Name, Age, Contact Number, and Address.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Add a new document with a generated id to "patients" collection
      await addDoc(collection(db, "patients"), {
        name: formData.name,
        address: formData.address,
        age: Number(formData.age),
        contactNumber: formData.contactNumber,
        medicalHistory: formData.medicalHistory,
        medicalHistoryOthers: formData.medicalHistory.includes('Others') ? formData.medicalHistoryOthers : '',
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Patient data saved successfully!', [
        { text: 'OK', onPress: () => setFormData({
          name: '', address: '', age: '', contactNumber: '', 
          medicalHistory: [], medicalHistoryOthers: ''
        })}
      ]);
    } catch (error: any) {
      console.error("Error adding document: ", error);
      Alert.alert('Error', 'Failed to save data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerContainer}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>WellMed</Text>
            <Text style={styles.headerSubtitle}>SPECIALIST-LED CARE</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Patient Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput 
              style={[styles.input, focusedInput === 'name' && styles.inputFocused]} 
              placeholder="Enter patient name"
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
              <Text style={styles.label}>Age *</Text>
              <TextInput 
                style={[styles.input, focusedInput === 'age' && styles.inputFocused]} 
                placeholder="Years"
                keyboardType="numeric"
                value={formData.age}
                onChangeText={(text) => setFormData({...formData, age: text})}
                onFocus={() => setFocusedInput('age')}
                onBlur={() => setFocusedInput(null)}
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 2 }]}>
              <Text style={styles.label}>Contact Number *</Text>
              <TextInput 
                style={[styles.input, focusedInput === 'contact' && styles.inputFocused]} 
                placeholder="Phone number"
                keyboardType="phone-pad"
                value={formData.contactNumber}
                onChangeText={(text) => setFormData({...formData, contactNumber: text})}
                onFocus={() => setFocusedInput('contact')}
                onBlur={() => setFocusedInput(null)}
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address *</Text>
            <TextInput 
              style={[styles.input, focusedInput === 'address' && styles.inputFocused]} 
              placeholder="Enter address"
              value={formData.address}
              onChangeText={(text) => setFormData({...formData, address: text})}
              onFocus={() => setFocusedInput('address')}
              onBlur={() => setFocusedInput(null)}
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Medical History</Text>

          {medicalHistoryItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.checkboxRow}
              onPress={() => toggleMedicalHistory(item.key)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, formData.medicalHistory.includes(item.key) && styles.checkboxChecked]}>
                {formData.medicalHistory.includes(item.key) && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
              <Text style={[styles.checkboxLabel, formData.medicalHistory.includes(item.key) && styles.checkboxLabelChecked]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}

          {formData.medicalHistory.includes('Others') && (
            <View style={[styles.inputGroup, { marginTop: 12 }]}>
              <Text style={styles.label}>Please specify</Text>
              <TextInput 
                style={[styles.input, styles.textArea, focusedInput === 'othersDesc' && styles.inputFocused]} 
                placeholder="Describe other medical conditions..."
                multiline
                numberOfLines={3}
                value={formData.medicalHistoryOthers}
                onChangeText={(text) => setFormData({...formData, medicalHistoryOthers: text})}
                onFocus={() => setFocusedInput('othersDesc')}
                onBlur={() => setFocusedInput(null)}
                placeholderTextColor="#94A3B8"
              />
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, isSubmitting && {opacity: 0.7}]} 
          onPress={handleSave} 
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.saveButtonText}>Save Data</Text>
              <Ionicons name="checkmark-circle" size={22} color={Colors.card} style={{marginLeft: 8}} />
            </>
          )}
        </TouchableOpacity>
        
        <View style={{height: 40}} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 12,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 2,
    marginBottom: -4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.secondary,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    fontSize: 15,
    color: Colors.textLight,
    fontWeight: '500',
  },
  checkboxLabelChecked: {
    color: Colors.text,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  }
});
