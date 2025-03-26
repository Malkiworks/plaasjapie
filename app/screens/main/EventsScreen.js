import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { translate } from '../../services/languageService';

const EventsScreen = ({ navigation }) => {
  // Categories for filtering
  const categories = [
    { id: 'all', label: translate('events.all') },
    { id: 'market', label: translate('events.markets') },
    { id: 'festival', label: translate('events.festivals') },
    { id: 'workshop', label: translate('events.workshops') },
    { id: 'expo', label: translate('events.expos') },
  ];
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Sample events data
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Stellenbosch Farmers Market',
      category: 'market',
      date: new Date(2023, 5, 15),
      location: 'Stellenbosch, Western Cape',
      imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop',
      distance: 15,
      description: 'A vibrant farmers market featuring local produce, crafts, and food stalls.',
      attendees: 87
    },
    {
      id: '2',
      title: 'Cape Wine Expo 2023',
      category: 'expo',
      date: new Date(2023, 6, 22),
      location: 'Cape Town International Convention Centre',
      imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2070&auto=format&fit=crop',
      distance: 42,
      description: 'The premier wine exhibition showcasing South Africa\'s finest wines.',
      attendees: 246
    },
    {
      id: '3',
      title: 'Farm to Table Workshop',
      category: 'workshop',
      date: new Date(2023, 5, 8),
      location: 'Franschhoek Valley',
      imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop',
      distance: 28,
      description: 'Learn sustainable farming practices and cooking techniques from local experts.',
      attendees: 34
    },
    {
      id: '4',
      title: 'Harvest Festival',
      category: 'festival',
      date: new Date(2023, 7, 5),
      location: 'Paarl, Western Cape',
      imageUrl: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?q=80&w=2874&auto=format&fit=crop',
      distance: 35,
      description: 'Celebrate the harvest season with local farmers and wine producers.',
      attendees: 156
    },
  ]);
  
  // Format date
  const formatDate = (date) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Filter events by category
  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter(event => event.category === selectedCategory);
  
  // Navigate to event details
  const navigateToEventDetails = (event) => {
    navigation.navigate('EventDetails', { event });
  };
  
  // Render category filter tabs
  const renderCategoryTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContainer}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryTab,
            selectedCategory === category.id && styles.selectedCategoryTab
          ]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category.id && styles.selectedCategoryText
            ]}
          >
            {category.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
  
  // Render featured event (first in the list)
  const renderFeaturedEvent = () => {
    if (filteredEvents.length === 0) return null;
    
    const featuredEvent = filteredEvents[0];
    
    return (
      <TouchableOpacity
        style={styles.featuredContainer}
        onPress={() => navigateToEventDetails(featuredEvent)}
      >
        <Image
          source={{ uri: featuredEvent.imageUrl }}
          style={styles.featuredImage}
        />
        <View style={styles.featuredContent}>
          <View style={styles.featuredDateContainer}>
            <Text style={styles.featuredDateText}>
              {formatDate(featuredEvent.date)}
            </Text>
          </View>
          <Text style={styles.featuredTitle}>{featuredEvent.title}</Text>
          <View style={styles.featuredLocationContainer}>
            <Ionicons name="location" size={14} color="#fff" />
            <Text style={styles.featuredLocationText}>
              {featuredEvent.location}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  // Render event item
  const renderEventItem = ({ item, index }) => {
    // Skip the first item as it's rendered as featured
    if (index === 0 && selectedCategory === 'all') return null;
    
    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => navigateToEventDetails(item)}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
        <View style={styles.eventDateBadge}>
          <Text style={styles.eventDateText}>{formatDate(item.date)}</Text>
        </View>
        
        <View style={styles.eventDetails}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          
          <View style={styles.eventLocationContainer}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.eventLocationText}>{item.location}</Text>
          </View>
          
          <View style={styles.eventFooter}>
            <View style={styles.eventDistance}>
              <Ionicons name="navigate-outline" size={14} color="#E63946" />
              <Text style={styles.eventDistanceText}>
                {item.distance} km
              </Text>
            </View>
            
            <View style={styles.eventAttendees}>
              <Ionicons name="people-outline" size={14} color="#666" />
              <Text style={styles.eventAttendeesText}>
                {item.attendees} {translate('events.attending')}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={60} color="#ccc" />
      <Text style={styles.emptyTitle}>{translate('events.noEvents')}</Text>
      <Text style={styles.emptyText}>{translate('events.noEventsDescription')}</Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{translate('events.title')}</Text>
      </View>
      
      {renderCategoryTabs()}
      
      <FlatList
        data={filteredEvents}
        renderItem={renderEventItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.eventsListContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={selectedCategory === 'all' ? renderFeaturedEvent : null}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
  },
  selectedCategoryTab: {
    backgroundColor: '#E63946',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  eventsListContainer: {
    padding: 16,
  },
  featuredContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  featuredDateContainer: {
    backgroundColor: '#E63946',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  featuredDateText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  featuredLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredLocationText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  eventCard: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: 120,
  },
  eventDateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#E63946',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  eventDateText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  eventDetails: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  eventLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventLocationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  eventDistance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDistanceText: {
    fontSize: 12,
    color: '#E63946',
    fontWeight: '500',
    marginLeft: 4,
  },
  eventAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventAttendeesText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default EventsScreen; 