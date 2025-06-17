
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Event {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  location: string;
  category: string;
  price?: string;
  weather?: {
    temp: string;
    condition: string;
  };
  description?: string;
}

interface EventState {
  events: Event[];
  categories: string[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  initializeEvents: () => void;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Summer Music Festival",
    date: "Aug 15, 2023 • 4:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "Riverfront Park, New York",
    category: "Concert",
    price: "$45 - $120",
    weather: {
      temp: "72°F",
      condition: "Sunny",
    },
  },
  {
    id: "2",
    title: "NBA Finals Game 5",
    date: "Jun 12, 2023 • 7:30 PM",
    imageUrl: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    location: "Madison Square Garden, New York",
    category: "Sports",
    price: "$75 - $350",
    weather: {
      temp: "68°F",
      condition: "Clear",
    },
  },
  {
    id: "3",
    title: "Hamilton - Broadway Musical",
    date: "Jul 22, 2023 • 8:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    location: "Richard Rodgers Theatre, New York",
    category: "Arts & Theatre",
    price: "$99 - $299",
    weather: {
      temp: "75°F",
      condition: "Partly Cloudy",
    },
  },
  {
    id: "4",
    title: "Food & Wine Festival",
    date: "Sep 5, 2023 • 11:00 AM",
    imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    location: "Hudson Yards, New York",
    category: "Food",
    price: "$35",
    weather: {
      temp: "78°F",
      condition: "Sunny",
    },
  },
  {
    id: "5",
    title: "Stand-up Comedy Night",
    date: "Aug 25, 2023 • 9:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1585211969224-3e992986159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    location: "Comedy Cellar, New York",
    category: "Comedy",
    price: "$25",
    weather: {
      temp: "71°F",
      condition: "Clear",
    },
  },
  {
    id: "6",
    title: "Disney On Ice",
    date: "Oct 10, 2023 • 3:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1561089489-f13d5e730d72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
    location: "Barclays Center, Brooklyn",
    category: "Family",
    price: "$30 - $85",
    weather: {
      temp: "65°F",
      condition: "Partly Cloudy",
    },
  },
];

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],
      categories: ["Concert", "Sports", "Arts & Theatre", "Food", "Comedy", "Family"],

      addEvent: (eventData: Omit<Event, 'id'>) => {
        const newEvent: Event = {
          ...eventData,
          id: `event-${Date.now()}`
        };

        set(state => ({
          events: [...state.events, newEvent]
        }));
      },

      updateEvent: (id: string, eventData: Partial<Event>) => {
        set(state => ({
          events: state.events.map(event => 
            event.id === id ? { ...event, ...eventData } : event
          )
        }));
      },

      deleteEvent: (id: string) => {
        set(state => ({
          events: state.events.filter(event => event.id !== id)
        }));
      },

      addCategory: (category: string) => {
        set(state => ({
          categories: [...state.categories, category]
        }));
      },

      deleteCategory: (category: string) => {
        set(state => ({
          categories: state.categories.filter(cat => cat !== category)
        }));
      },

      initializeEvents: () => {
        const { events } = get();
        if (events.length === 0) {
          set({ events: mockEvents });
        }
      }
    }),
    {
      name: 'event-storage'
    }
  )
);
