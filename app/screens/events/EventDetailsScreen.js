import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { translate } from '../../services/languageService';

const EventDetailsScreen = ({ route, navigation }) => {
  const { event } = route.params || {};
  const [isAttending, setIsAttending] = useState(false);
  
  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Format time
  const formatTime = (date) => {
    if (!date) return '';
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString(undefined, options);
  };
  
  // Toggle attendance
  const toggleAttendance = () => {
    if (isAttending) {
      Alert.alert(
        translate('events.cancelAttendance'),
        translate('events.cancelAttendanceConfirm'),
        [
          {
            text: translate('common.no'),
            style: 'cancel'
          },
          {
            text: translate('common.yes'),
            onPress: () => setIsAttending(false)
          }
        ]
      );
    } else {
      setIsAttending(true);
      Alert.alert(
        translate('events.attendanceConfirmed'),
        translate('events.attendanceConfirmedMessage')
      );
    }
  };
  
  // Open maps
  const openMaps = () => {
    const address = encodeURIComponent(event?.location || '');
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert(translate('common.error'), translate('events.cannotOpenMaps'));
        }
      })
      .catch(error => console.error('Error opening maps:', error));
  };
  
  // Share event
  const shareEvent = async () => {
    try {
      await Share.share({
        message: `${translate('events.checkOutEvent')}: ${event?.title} ${translate('events.at')} ${event?.location} ${translate('events.on')} ${formatDate(event?.date)}`,
        title: event?.title
      });
    } catch (error) {
      console.error('Error sharing event:', error);
    }
  };
  
  // Handle empty event data
  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{translate('events.eventDetails')}</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>{translate('events.eventNotFound')}</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Event Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: event.imageUrl }}
            style={styles.eventImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={shareEvent}
          >
            <Ionicons name="share-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Event Info */}
        <View style={styles.contentContainer}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {translate(`events.${event.category}`)}
              </Text>
            </View>
          </View>
          
          {/* Date & Time */}
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={22} color="#E63946" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{translate('events.date')}</Text>
                <Text style={styles.infoText}>{formatDate(event.date)}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={22} color="#E63946" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{translate('events.time')}</Text>
                <Text style={styles.infoText}>{formatTime(event.date)}</Text>
              </View>
            </View>
          </View>
          
          {/* Location */}
          <TouchableOpacity style={styles.locationContainer} onPress={openMaps}>
            <Ionicons name="location-outline" size={22} color="#E63946" />
            <View style={styles.locationContent}>
              <Text style={styles.locationLabel}>{translate('events.location')}</Text>
              <Text style={styles.locationText}>{event.location}</Text>
              <Text style={styles.locationDistance}>
                {event.distance} km {translate('events.away')}
              </Text>
            </View>
            <Ionicons name="navigate-circle-outline" size={24} color="#666" />
          </TouchableOpacity>
          
          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>{translate('events.aboutEvent')}</Text>
            <Text style={styles.descriptionText}>{event.description}</Text>
          </View>
          
          {/* Attendance */}
          <View style={styles.attendanceContainer}>
            <View style={styles.attendeeCount}>
              <Ionicons name="people-outline" size={22} color="#E63946" />
              <Text style={styles.attendeeText}>
                <Text style={styles.attendeeNumber}>{event.attendees}</Text> {translate('events.peopleAttending')}
              </Text>
            </View>
            {isAttending ? (
              <TouchableOpacity
                style={[styles.attendButton, styles.attendingButton]}
                onPress={toggleAttendance}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.attendingButtonText}>
                  {translate('events.attending')}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.attendButton}
                onPress={toggleAttendance}
              >
                <Text style={styles.attendButtonText}>
                  {translate('events.attend')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Organizer */}
          <View style={styles.organizerContainer}>
            <Text style={styles.organizerTitle}>{translate('events.organizer')}</Text>
            <View style={styles.organizerContent}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop' }}
                style={styles.organizerImage}
              />
              <View style={styles.organizerDetails}>
                <Text style={styles.organizerName}>Stellenbosch Farmer's Association</Text>
                <Text style={styles.organizerDescription}>
                  Local farming association promoting agricultural practices and community events.
                </Text>
                <TouchableOpacity style={styles.contactButton}>
                  <Text style={styles.contactButtonText}>{translate('events.contactOrganizer')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  imageContainer: {
    height: 250,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  shareButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  contentContainer: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  categoryBadge: {
    backgroundColor: '#E63946',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  infoSection: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationContent: {
    marginLeft: 12,
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  locationDistance: {
    fontSize: 14,
    color: '#E63946',
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  attendanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  attendeeCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  attendeeNumber: {
    fontWeight: '700',
    color: '#333',
  },
  attendButton: {
    backgroundColor: '#E63946',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  attendingButton: {
    backgroundColor: '#4CAF50',
  },
  attendingButtonText: {
    marginLeft: 4,
  },
  organizerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  organizerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  organizerContent: {
    flexDirection: 'row',
  },
  organizerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  organizerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  organizerDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  contactButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E63946',
  },
  contactButtonText: {
    color: '#E63946',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default EventDetailsScreen; 