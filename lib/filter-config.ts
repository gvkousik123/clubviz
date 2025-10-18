import { FilterSection } from '@/components/common/filter-popup';

export const CLUB_FILTER_SECTIONS: FilterSection[] = [
    {
        id: 'sort',
        title: 'Sort by',
        type: 'radio',
        options: [
            { id: 'popularity', label: 'Popularity', selected: false },
            { id: 'rating', label: 'Rating', selected: false },
            { id: 'distance', label: 'Distance', selected: false },
            { id: 'cost', label: 'Cost', selected: false },
            { id: 'vibe', label: 'vibe', selected: false },
        ]
    },
    {
        id: 'bar',
        title: 'Bar',
        type: 'checkbox',
        options: [
            { id: 'spirits', label: 'Spirits', icon: 'Brandy.svg', selected: false },
            { id: 'wine', label: 'Wine', icon: 'Wine.svg', selected: false },
            { id: 'draught', label: 'Draught', icon: 'PintGlass.svg', selected: false },
            { id: 'cocktail', label: 'Cocktail', icon: 'Martini.svg', selected: false },
            { id: 'non-alcoholic', label: 'Non Alcoholic', icon: 'Orange.svg', selected: false },
            { id: 'mocktail', label: 'Mocktail', icon: 'Mocktails.svg', selected: false },
            { id: 'coffee', label: 'Coffee', icon: 'Coffee.svg', selected: false },
        ]
    },
    {
        id: 'food',
        title: 'Food',
        type: 'checkbox',
        options: [
            { id: 'gluten-free', label: 'Gluten free options', icon: 'mdi_food-croissant.svg', selected: false },
            { id: 'asian', label: 'Asian', icon: 'BowlFood.svg', selected: false },
            { id: 'italian', label: 'Italian', icon: 'Pizza.svg', selected: false },
            { id: 'burgers-sandwich', label: 'Burgers & Sandwich', icon: 'Hamburger.svg', selected: false },
            { id: 'north-indian', label: 'North Indian', icon: 'CookingPot.svg', selected: false },
            { id: 'bar-snacks', label: 'Bar Snacks', icon: 'Popcorn.svg', selected: false },
            { id: 'continental', label: 'Continental', icon: 'Group.svg', selected: false },
            { id: 'steak', label: 'Steak', icon: 'Steak.svg', selected: false },
            { id: 'kebabs', label: 'Kebabs', icon: 'Kebabs.svg', selected: false },
            { id: 'desserts', label: 'Desserts', icon: 'Cookie.svg', selected: false },
            { id: 'kids-menu', label: 'Kids Menu', icon: 'BeerStein.svg', selected: false },
        ]
    },
    {
        id: 'music',
        title: 'Music',
        type: 'checkbox',
        options: [
            { id: 'karaoke', label: 'Karaoke', selected: false },
            { id: 'live-music', label: 'Live Music', selected: false },
            { id: 'bollywood', label: 'Bollywood', selected: false },
            { id: 'techno', label: 'Techno', selected: false },
            { id: 'bolly-tech', label: 'Bolly Tech', selected: false },
            { id: 'house', label: 'House', selected: false },
            { id: 'edm', label: 'EDM', selected: false },
            { id: 'rnb', label: 'R & B', selected: false },
            { id: 'rock', label: 'Rock', selected: false },
            { id: 'tech-house', label: 'Tech House', selected: false },
            { id: 'metal', label: 'Metal', selected: false },
            { id: 'rap', label: 'Rap', selected: false },
            { id: 'pop', label: 'Pop', selected: false },
            { id: 'jazz', label: 'Jazz', selected: false },
            { id: 'progressive', label: 'Progressive', selected: false },
            { id: 'trance', label: 'Trance', selected: false },
        ]
    },
    {
        id: 'facilities',
        title: 'Facilities',
        type: 'checkbox',
        options: [
            { id: 'open-till-midnight', label: 'open till midnight', selected: false },
            { id: 'car-parking', label: 'Car Parking', selected: false },
            { id: 'disabled-access', label: 'Disabled Access', selected: false },
            { id: 'darts', label: 'Darts', selected: false },
            { id: 'table-booking', label: 'Table booking', selected: false },
            { id: 'beer-pong', label: 'Beer Pong', selected: false },
            { id: 'indoor-seating', label: 'Indoor Seating', selected: false },
            { id: 'pool-table', label: 'Pool Table', selected: false },
            { id: 'private-dining', label: 'Private dining space', selected: false },
            { id: 'rooftop', label: 'Rooftop', selected: false },
            { id: 'beer-garden', label: 'Beer Garden', selected: false },
            { id: 'sports-bar', label: 'Sports Bar', selected: false },
            { id: 'dance-floor', label: 'Dance Floor', selected: false },
            { id: 'bar-games', label: 'Bar Games', selected: false },
        ]
    }
];

export const EVENT_FILTER_SECTIONS: FilterSection[] = [
    {
        id: 'sort',
        title: 'Sort by',
        type: 'radio',
        options: [
            { id: 'popularity', label: 'Popularity', selected: false },
            { id: 'rating', label: 'Rating', selected: false },
            { id: 'distance', label: 'Distance', selected: false },
            { id: 'date', label: 'Date', selected: false },
            { id: 'price', label: 'Price', selected: false },
        ]
    },
    {
        id: 'music',
        title: 'Music',
        type: 'checkbox',
        options: [
            { id: 'bollywood', label: 'Bollywood', selected: false },
            { id: 'techno', label: 'Techno', selected: false },
            { id: 'house', label: 'House', selected: false },
            { id: 'edm', label: 'EDM', selected: false },
            { id: 'live-music', label: 'Live Music', selected: false },
            { id: 'jazz', label: 'Jazz', selected: false },
            { id: 'rock', label: 'Rock', selected: false },
        ]
    },
    {
        id: 'price',
        title: 'Price Range',
        type: 'checkbox',
        options: [
            { id: 'free', label: 'Free', selected: false },
            { id: 'under-500', label: 'Under ₹500', selected: false },
            { id: '500-1000', label: '₹500 - ₹1000', selected: false },
            { id: '1000-2000', label: '₹1000 - ₹2000', selected: false },
            { id: 'above-2000', label: 'Above ₹2000', selected: false },
        ]
    }
];