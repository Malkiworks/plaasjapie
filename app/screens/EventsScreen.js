import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Mock event data - would be fetched from backend in real app
const mockEvents = [
  {
    id: '1',
    title: 'Cape Town Wine Festival',
    date: 'May 15-16, 2023',
    location: 'Stellenbosch, Western Cape',
    distance: '15 km away',
    description: 'Experience the best wines from the Cape region with food pairings and live music.',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    attendees: 78,
    category: 'urban',
    saved: true,
  },
  {
    id: '2',
    title: 'Traditional Zulu Heritage Day',
    date: 'June 3, 2023',
    location: 'Durban, KwaZulu-Natal',
    distance: '120 km away',
    description: 'Celebrate Zulu culture with traditional dances, crafts, and authentic cuisine.',
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    attendees: 125,
    category: 'cultural',
    saved: false,
  },
  {
    id: '3',
    title: 'Farmer\'s Market Weekend',
    date: 'April 29-30, 2023',
    location: 'Bloemfontein, Free State',
    distance: '75 km away',
    description: 'Connect with local farmers and artisans while enjoying fresh produce and handmade goods.',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    attendees: 45,
    category: 'rural',
    saved: true,
  },
  {
    id: '4',
    title: 'Township Jazz Festival',
    date: 'May 20, 2023',
    location: 'Soweto, Gauteng',
    distance: '8 km away',
    description: 'Enjoy the sounds of South Africa\'s best jazz musicians in the heart of Soweto.',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    attendees: 210,
    category: 'urban',
    saved: false,
  },
  {
    id: '5',
    title: 'Annual Harvest Festival',
    date: 'June 10, 2023',
    location: 'Nelspruit, Mpumalanga',
    distance: '150 km away',
    description: 'Join local farmers to celebrate a successful harvest with traditional food and music.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    attendees: 89,
    category: 'rural',
    saved: false,
  },
];

const categories = [
  { id: 'all', name: 'All Events' },
  { id: 'rural', name: 'Rural' },
  { id: 'urban', name: 'Urban' },
  { id: 'cultural', name: 'Cultural' },
  { id: 'saved', name: 'Saved' },
];

export default function EventsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlineMode, setOnlineMode] = useState(true);

  const filteredEvents = selectedCategory === 'all' 
    ? mockEvents 
    : selectedCategory === 'saved'
      ? mockEvents.filter(event => event.saved)
      : mockEvents.filter(event => event.category === selectedCategory);

  const renderEventItem = ({ item }) => (
    <TouchableOpacity style={styles.eventCard}>
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      
      <View style={styles.eventDetails}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <TouchableOpacity>
            <Ionicons 
              name={item.saved ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={item.saved ? "#E63946" : "#555"} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.eventInfo}>
          <View style={styles.eventInfoItem}>
            <Ionicons name="calendar-outline" size={16} color="#555" />
            <Text style={styles.eventInfoText}>{item.date}</Text>
          </View>
          
          <View style={styles.eventInfoItem}>
            <Ionicons name="location-outline" size={16} color="#555" />
            <Text style={styles.eventInfoText}>{item.location}</Text>
          </View>
          
          <View style={styles.eventInfoItem}>
            <Ionicons name="navigate-outline" size={16} color="#555" />
            <Text style={styles.eventInfoText}>{item.distance}</Text>
          </View>
        </View>
        
        <Text style={styles.eventDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.eventFooter}>
          <View style={styles.attendeesContainer}>
            <Ionicons name="people-outline" size={16} color="#555" />
            <Text style={styles.attendeesText}>{item.attendees} attending</Text>
          </View>
          
          <TouchableOpacity style={styles.interestedButton}>
            <Text style={styles.interestedButtonText}>I'm interested</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Local Events</Text>
        <TouchableOpacity onPress={() => setOnlineMode(!onlineMode)}>
          <Ionicons 
            name={onlineMode ? "globe-outline" : "cloud-offline-outline"} 
            size={24} 
            color="#333" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.downloadBanner}>
        <Ionicons name="download-outline" size={20} color="white" />
        <Text style={styles.downloadText}>
          Download events for offline viewing
        </Text>
        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.downloadButtonText}>Download</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredEvents}
        renderItem={renderEventItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.eventsList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  downloadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3F51B5',
    padding: 12,
  },
  downloadText: {
    flex: 1,
    marginLeft: 8,
    color: 'white',
    fontSize: 14,
  },
  downloadButton: {
    backgroundColor: 'white',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  downloadButtonText: {
    color: '#3F51B5',
    fontWeight: 'bold',
    fontSize: 12,
  },
  categoriesContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#E63946',
  },
  categoryText: {
    fontSize: 14,
    color: '#555',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  eventsList: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: 180,
  },
  eventDetails: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  eventInfo: {
    marginBottom: 12,
  },
  eventInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventInfoText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 6,
  },
  eventDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 16,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 6,
  },
  interestedButton: {
    backgroundColor: '#E63946',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  interestedButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
}); 