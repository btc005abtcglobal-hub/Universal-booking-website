import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Shortcut {
  id: string;
  label: string;
  icon: string;
  actionType: 'modal' | 'link';
  actionTarget: string; // URL for link, modal ID for modal
}

export const AVAILABLE_SHORTCUTS: Shortcut[] = [
  { id: 'hotels', label: 'Nearby Hotels', icon: 'hotel', actionType: 'modal', actionTarget: 'nearby_hotels' },
  { id: 'flights', label: 'Airports/Flights', icon: 'flight', actionType: 'modal', actionTarget: 'airports_search' },
  { id: 'bus', label: 'Bus Booking', icon: 'directions_bus', actionType: 'modal', actionTarget: 'bus_booking' },
  { id: 'private_jets', label: 'Private Jets', icon: 'flight_takeoff', actionType: 'link', actionTarget: '/jets' },
  { id: 'yachts', label: 'Yachts', icon: 'directions_boat', actionType: 'link', actionTarget: '/yachts' },
  { id: 'villas', label: 'Villas', icon: 'villa', actionType: 'link', actionTarget: '/villas' },
  { id: 'trending', label: 'Trending', icon: 'auto_graph', actionType: 'link', actionTarget: '/trending' },
  { id: 'concierge', label: 'Concierge', icon: 'room_service', actionType: 'modal', actionTarget: 'concierge_request' },
];

interface ShortcutState {
  activeShortcuts: string[]; // Store only the IDs
  shortcutModalOpen: boolean;
  activeActionModal: string | null;
  
  toggleShortcut: (id: string) => void;
  setShortcutModalOpen: (isOpen: boolean) => void;
  openActionModal: (modalId: string) => void;
  closeActionModal: () => void;
}

export const useShortcutStore = create<ShortcutState>()(
  persist(
    (set, get) => ({
      activeShortcuts: ['hotels', 'flights', 'bus'], // Default starting shortcuts
      shortcutModalOpen: false,
      activeActionModal: null,

      toggleShortcut: (id) => set((state) => {
        const isActive = state.activeShortcuts.includes(id);
        if (isActive) {
          return { activeShortcuts: state.activeShortcuts.filter(s => s !== id) };
        } else {
          // Add if under limit
          if (state.activeShortcuts.length < 5) {
            return { activeShortcuts: [...state.activeShortcuts, id] };
          }
          return state; // Reached limit of 5
        }
      }),

      setShortcutModalOpen: (isOpen) => set({ shortcutModalOpen: isOpen }),
      openActionModal: (modalId) => set({ activeActionModal: modalId }),
      closeActionModal: () => set({ activeActionModal: null }),
    }),
    {
      name: 'lumina-shortcuts', // key in local storage
      partialize: (state) => ({ activeShortcuts: state.activeShortcuts }), // only persist the shortcuts
    }
  )
);
