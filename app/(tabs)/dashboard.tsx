import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, Modal, Platform, Alert, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';

const Colors = {
  primary: '#15B4C2',
  secondary: '#F6AC1B',
  success: '#10B981',
  danger: '#EF4444',
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#1E293B',
  textLight: '#64748B',
  border: '#E2E8F0',
};

const CONDITIONS = ['All', 'Good', 'Average', 'Bad', 'Very Bad'];

export default function DashboardScreen() {
  const [filterDate, setFilterDate] = useState('All'); 
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDate, setCustomDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [showConditionPicker, setShowConditionPicker] = useState(false);

  useEffect(() => {
    try {
      const q = query(collection(db, 'patients'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data: any[] = [];
        querySnapshot.forEach((doc) => {
          const item = doc.data();
          let dateStr = 'Unknown';
          let rawDate = new Date(0);
          if (item.createdAt) {
            const d = item.createdAt.toDate();
            dateStr = d.toLocaleDateString('en-CA');
            rawDate = d;
          }
          data.push({
            id: doc.id,
            name: item.name || 'No Name',
            age: item.age || 'N/A',
            contactNumber: item.contactNumber || 'N/A',
            address: item.address || 'N/A',
            date: dateStr,
            condition: item.currentCondition || 'Unknown',
            conditionDescription: item.conditionDescription || '',
            hasPreviousHistory: item.hasPreviousHistory ? 'Yes' : 'No',
            previousHistoryDescription: item.previousHistoryDescription || '',
            rawDate: rawDate
          });
        });
        setRecords(data);
        setLoading(false);
      }, (e) => setLoading(false));
      return () => unsubscribe();
    } catch (e) { setLoading(false); }
  }, []);

  const filteredRecords = records.filter(record => {
    try {
      let matchesDate = true;
      const today = new Date().toDateString();
      const recordDate = record.rawDate.toDateString();
      if (filterDate === 'Today') matchesDate = recordDate === today;
      else if (filterDate === 'Yesterday') {
        const y = new Date(); y.setDate(y.getDate() - 1);
        matchesDate = recordDate === y.toDateString();
      }
      else if (filterDate === 'Date') matchesDate = recordDate === customDate.toDateString();
      const matchesSearch = (record.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (record.contactNumber || '').includes(searchQuery);
      const matchesCondition = selectedCondition === 'All' || record.condition === selectedCondition;
      return matchesDate && matchesSearch && matchesCondition;
    } catch (e) { return false; }
  });

  const stats = {
    total: filteredRecords.length,
    today: records.filter(r => r.rawDate.toDateString() === new Date().toDateString()).length,
    critical: filteredRecords.filter(r => r.condition === 'Bad' || r.condition === 'Very Bad').length
  };

  const handlePrintPDF = async () => {
    try {
      const html = `<html><body style="font-family:sans-serif;padding:20px;">
        <h2 style="text-align:center;">PATIENT DATA REPORT</h2>
        <p style="text-align:right;font-size:10px;">Filter: ${filterDate} | Condition: ${selectedCondition} | ${new Date().toLocaleDateString()}</p>
        <table style="width:100%;border-collapse:collapse;font-size:9px;">
          <tr style="background:#eee;"><th>Date</th><th>Name</th><th>Address</th><th>Age</th><th>Contact</th><th>Condition</th><th>History</th></tr>
          ${filteredRecords.map(r => `<tr>
            <td style="border:1px solid #000;padding:5px;">${r.date}</td>
            <td style="border:1px solid #000;padding:5px;">${r.name}</td>
            <td style="border:1px solid #000;padding:5px;">${r.address}</td>
            <td style="border:1px solid #000;padding:5px;">${r.age}</td>
            <td style="border:1px solid #000;padding:5px;">${r.contactNumber}</td>
            <td style="border:1px solid #000;padding:5px;">${r.condition}<br/>${r.conditionDescription}</td>
            <td style="border:1px solid #000;padding:5px;">${r.hasPreviousHistory}<br/>${r.previousHistoryDescription}</td>
          </tr>`).join('')}
        </table>
      </body></html>`;
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (e) { Alert.alert("Error", "PDF failed"); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statSquare}><View style={[styles.statInner, {borderColor: Colors.primary}]}><Text style={styles.statValue}>{stats.total}</Text><Text style={styles.statLabel}>Total</Text></View></View>
        <View style={styles.statSquare}><View style={[styles.statInner, {borderColor: Colors.success}]}><Text style={styles.statValue}>{stats.today}</Text><Text style={styles.statLabel}>Today</Text></View></View>
        <View style={styles.statSquare}><View style={[styles.statInner, {borderColor: Colors.danger}]}><Text style={styles.statValue}>{stats.critical}</Text><Text style={styles.statLabel}>Critical</Text></View></View>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.printBtn} onPress={handlePrintPDF}>
          <Ionicons name="document-text" size={20} color="#fff" /><Text style={styles.printBtnText}>Generate Patient Report (PDF)</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={Colors.textLight} />
          <TextInput style={styles.searchInput} placeholder="Search Name/Phone..." value={searchQuery} onChangeText={setSearchQuery} placeholderTextColor="#94A3B8" />
        </View>
        <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowConditionPicker(true)}>
          <Text style={styles.pickerText} numberOfLines={1}>{selectedCondition}</Text>
          <Ionicons name="chevron-down" size={14} color={Colors.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.dateFilterRow}>
        {['All', 'Today', 'Yesterday', 'Date'].map(f => (
          <TouchableOpacity key={f} style={[styles.dateChip, filterDate === f && styles.dateChipActive]} onPress={() => f === 'Date' ? setShowDatePicker(true) : setFilterDate(f)}>
            <Text style={[styles.dateChipText, filterDate === f && {color: '#fff'}]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {showDatePicker && (
        <DateTimePicker value={customDate} mode="date" display="default" onChange={(e, d) => { setShowDatePicker(false); if (d) { setCustomDate(d); setFilterDate('Date'); } }} />
      )}
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="small" color={Colors.primary} /></View>
      ) : (
        <FlatList
          data={filteredRecords}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.recordItem}>
              <View style={styles.recordLeft}><Text style={styles.recordName}>{item.name}</Text><Text style={styles.recordSub}>{item.date} • {item.condition}</Text></View>
              <TouchableOpacity style={styles.viewLink} onPress={() => { setSelectedRecord(item); setModalVisible(true); }}>
                <Text style={styles.viewLinkText}>View Record</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <Modal visible={showConditionPicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowConditionPicker(false)}>
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>Select Condition</Text>
            {CONDITIONS.map(c => (
              <TouchableOpacity key={c} style={styles.pickerItem} onPress={() => { setSelectedCondition(c); setShowConditionPicker(false); }}>
                <Text style={[styles.pickerItemText, selectedCondition === c && {color: Colors.primary, fontWeight: 'bold'}]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedRecord && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}><Ionicons name="close" size={24} color="#000" /></TouchableOpacity>
                <View style={styles.infoRow}><Text style={styles.label}>Name</Text><Text style={styles.val}>{selectedRecord.name}</Text></View>
                <View style={styles.infoRow}><Text style={styles.label}>Address</Text><Text style={styles.val}>{selectedRecord.address}</Text></View>
                <View style={styles.row}><View style={styles.half}><Text style={styles.label}>Age</Text><Text style={styles.val}>{selectedRecord.age}</Text></View><View style={styles.half}><Text style={styles.label}>Contact</Text><Text style={styles.val}>{selectedRecord.contactNumber}</Text></View></View>
                <View style={styles.statusBox}>
                  <Text style={styles.label}>Condition</Text><Text style={styles.val}>{selectedRecord.condition}</Text>
                  <Text style={styles.desc}>{selectedRecord.conditionDescription || "Not entered"}</Text>
                </View>
                <View style={styles.statusBox}>
                  <Text style={styles.label}>History</Text><Text style={styles.val}>{selectedRecord.hasPreviousHistory}</Text>
                  <Text style={styles.desc}>{selectedRecord.hasPreviousHistory === 'Yes' ? (selectedRecord.previousHistoryDescription || "Not entered") : "No history recorded"}</Text>
                </View>
                <TouchableOpacity style={styles.doneBtn} onPress={() => setModalVisible(false)}><Text style={styles.doneBtnText}>Close Record</Text></TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  statsRow: { flexDirection: 'row', padding: 12, justifyContent: 'space-between' },
  statSquare: { flex: 1, aspectRatio: 1, padding: 6 },
  statInner: { flex: 1, backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textLight, fontWeight: '700', textTransform: 'uppercase' },
  actionRow: { paddingHorizontal: 18, marginBottom: 12 },
  printBtn: { backgroundColor: Colors.secondary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, gap: 10 },
  printBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  searchRow: { flexDirection: 'row', paddingHorizontal: 18, gap: 10, marginBottom: 12 },
  searchBox: { flex: 2, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, height: 40 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: Colors.text },
  pickerBtn: { flex: 1.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, height: 40 },
  pickerText: { fontSize: 12, color: Colors.text, fontWeight: '600' },
  dateFilterRow: { flexDirection: 'row', paddingHorizontal: 18, gap: 8, marginBottom: 12 },
  dateChip: { flex: 1, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  dateChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dateChipText: { fontSize: 12, fontWeight: 'bold', color: Colors.textLight },
  list: { paddingHorizontal: 18 },
  recordItem: { backgroundColor: '#fff', padding: 16, borderRadius: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 0.5, borderColor: '#CBD5E1' },
  recordName: { fontSize: 15, fontWeight: 'bold', color: Colors.text },
  recordSub: { fontSize: 12, color: Colors.textLight, marginTop: 4 },
  viewLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewLinkText: { fontSize: 13, color: Colors.primary, fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  pickerModal: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  pickerTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  pickerItem: { paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  pickerItemText: { fontSize: 15, textAlign: 'center' },
  modalCard: { backgroundColor: '#fff', borderRadius: 25, padding: 20, maxHeight: '85%' },
  closeBtn: { alignSelf: 'flex-end', padding: 5 },
  infoRow: { marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 12 },
  half: { flex: 1 },
  label: { fontSize: 11, color: Colors.textLight, fontWeight: 'bold', textTransform: 'uppercase' },
  val: { fontSize: 16, color: Colors.text, fontWeight: '500' },
  statusBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginBottom: 12 },
  desc: { fontSize: 13, color: '#666', fontStyle: 'italic' },
  doneBtn: { backgroundColor: Colors.secondary, padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  doneBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
