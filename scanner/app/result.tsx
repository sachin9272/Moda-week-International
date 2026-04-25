import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/Config';
import { useTicketVerify, TicketData } from '../hooks/useTicketVerify';
import { Ionicons } from '@expo/vector-icons';

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { verifyTicket, scanTicket, loading, error } = useTicketVerify();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      loadTicket(id);
    }
  }, [id]);

  const loadTicket = async (ticketId: string) => {
    const data = await verifyTicket(ticketId);
    if (data) {
      setTicket(data);
      if (data.status !== 'completed') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else if (data.isUsed) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleMarkAsEntered = async () => {
    if (!id) return;
    const success = await scanTicket(id);
    if (success) {
      setScanSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Reload ticket to show updated status
      loadTicket(id);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  if (loading && !ticket) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Verifying ticket...</Text>
      </View>
    );
  }

  if (error || !ticket) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="close-circle" size={80} color={Colors.error} />
        <Text style={styles.errorTitle}>Invalid Ticket</Text>
        <Text style={styles.errorText}>{error || "Ticket not found or invalid format"}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Scan Another</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isInvalid = ticket.status !== 'completed';
  const isUsed = ticket.isUsed;
  const isValid = !isInvalid && !isUsed;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.statusHeader, 
        isInvalid ? styles.bgError : isUsed ? styles.bgWarning : styles.bgSuccess
      ]}>
        <Ionicons 
          name={isInvalid ? "close-circle" : isUsed ? "alert-circle" : "checkmark-circle"} 
          size={60} 
          color="#000" 
        />
        <Text style={styles.statusTitle}>
          {isInvalid ? "INVAlID" : isUsed ? "ALREADY SCANNED" : "VALID TICKET"}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Buyer</Text>
          <Text style={styles.value}>{ticket.buyerName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Ticket Type</Text>
          <Text style={styles.value}>{ticket.ticketName} (x{ticket.quantity})</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Event</Text>
          <Text style={styles.value}>{ticket.eventName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Event Date</Text>
          <Text style={styles.value}>{ticket.eventDate || 'N/A'}</Text>
        </View>

        {isUsed && (
          <View style={styles.scannedAtBox}>
            <Text style={styles.scannedAtLabel}>Scanned On</Text>
            <Text style={styles.scannedAtValue}>{new Date(ticket.scannedAt!).toLocaleString()}</Text>
          </View>
        )}
      </View>

      {isValid && (
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleMarkAsEntered}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.actionButtonText}>MARK AS ENTERED</Text>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
        <Text style={styles.secondaryButtonText}>Back to Scanner</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.text,
    marginTop: 10,
    fontFamily: 'Inter_400Regular',
  },
  statusHeader: {
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  bgSuccess: { backgroundColor: Colors.success },
  bgError: { backgroundColor: Colors.error },
  bgWarning: { backgroundColor: Colors.warning },
  statusTitle: {
    color: '#000',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginTop: 10,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 30,
  },
  infoRow: {
    marginBottom: 15,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    color: Colors.text,
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
  },
  scannedAtBox: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  scannedAtLabel: {
    color: Colors.warning,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  scannedAtValue: {
    color: Colors.text,
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionButtonText: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  secondaryButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  secondaryButtonText: {
    color: Colors.text,
    fontSize: 16,
  },
  errorTitle: {
    color: Colors.error,
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginVertical: 15,
  },
  errorText: {
    color: Colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
});
