'use client'; 'use client'; 'use client'; 'use client'; 'use client';



import Link from 'next/link';

import { Search, MapPin, Bell, Menu, Bookmark, Calendar } from 'lucide-react';

import Link from 'next/link';

export default function HomePage() {

    return (

        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">

            {/* Header */}export default function HomePage() {

                <div className="flex items-center justify-between p-6 pt-12">    import {useState} from 'react';

                    <div className="flex items-center space-x-3">

                        <MapPin className="w-5 h-5 text-blue-400" />    return (

                        <span className="text-white font-medium">Dharampeth</span>

                    </div>        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">import Link from 'next/link';



                        <div className="flex items-center space-x-4">            <h1 className="text-white text-2xl font-bold mb-8">ClubViz Home</h1>

                            <Bell className="w-6 h-6 text-white" />

                            <Link href="/menu">            import {Search, MapPin, Bell, Menu, Bookmark, Calendar} from 'lucide-react'; import {useState} from 'react'; import {useState} from 'react';

                                <Menu className="w-6 h-6 text-white" />

                            </Link>            <div className="space-y-4">

                            </div>

                        </div>                <Link href="/clubs" className="block bg-blue-500 text-white p-4 rounded-lg">



                            {/* Search Bar */}                    View Clubs

                            <div className="px-6 mb-8">

                                <div className="relative">                </Link>export default function HomePage() {

          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />

          <input                    <Link href="/events" className="block bg-purple-500 text-white p-4 rounded-lg">    import Link from 'next/link'; import Link from 'next/link';

            type="text"

            placeholder="Search"                        View Events

            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-blue-400"

          />                    </Link>    const [searchText, setSearchText] = useState('');

                            </div>

                    </div>                <Link href="/favorites" className="block bg-pink-500 text-white p-4 rounded-lg">



                        {/* Featured Content */}                    Favorites    import {Search, MapPin, Bell, Menu, Bookmark, Calendar} from 'lucide-react'; import {Search, MapPin, Bell, Menu, Bookmark, Calendar, Star} from 'lucide-react';

                        <div className="px-6 mb-8">

                            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 p-8">                </Link>

                            <h2 className="text-white text-2xl font-bold mb-2">Discover Nightlife</h2>

                            <p className="text-white/90 mb-4">Find the best clubs and events in your city</p>                <Link href="/profile" className="block bg-green-500 text-white p-4 rounded-lg">    const topClubs = [

                                <Link href="/clubs" className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold">

                                    Explore Now                    Profile

                                </Link>

                        </div>                </Link>        {

      </div>

      </div>

      {/* Quick Actions */ }

    <div className="px-6 mb-8">        </div>            id: 1,

        <h3 className="text-white text-lg font-semibold mb-4">Quick Access</h3>

        <div className="grid grid-cols-2 gap-4">  );

          <Link href="/clubs" className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">

            <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">} name: "DABO", export default function HomePage() {

              <span className="text-white text-xl">🏢</span>

            </div>    image: "/red-neon-lounge-interior.jpg", export default function HomePage() {

            <h4 className="text-white font-medium">Clubs</h4>

          </Link>        rating: 4.2,

          

          <Link href="/events" className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">            location: "Nagpur", const [searchText, setSearchText] = useState(''); const [searchText, setSearchText] = useState('');

            <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">

              <Calendar className="w-6 h-6 text-white" />        type: "Club & Kitchen"

            </div>

            <h4 className="text-white font-medium">Events</h4>    },

          </Link>

        </div>    {

      </div >

            id: 2, const topClubs = [    const topClubs = [

                {/* Bottom Navigation */ }

                < div className = "fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-slate-800/95 backdrop-blur-sm border-t border-white/10 rounded-t-3xl px-6 py-4" > name: "CAFE 41",

        <div className="flex justify-around items-center">

          <Link href="/home" className="flex flex-col items-center space-y-1">            image: "/upscale-bar-interior-with-bottles.jpg", {        {

            <div className="w-6 h-6 bg-blue-500 rounded"></div>

            <span className="text-blue-400 text-xs font-semibold">Home</span>                rating: 4.5,

          </Link >

            location: "Nagpur", id: 1, id: 1,

                <Link href="/clubs" className="flex flex-col items-center space-y-1">

                    <div className="w-6 h-6 bg-white/20 rounded"></div>                type: "Cafe & Bar"

                    <span className="text-white/60 text-xs">Clubs</span>

                </Link>
    }, name: "DABO", name: "DABO",



        <Link href="/events" className="flex flex-col items-center space-y-1">            {

            <Calendar className="w-6 h-6 text-white/60" />

            <span className="text-white/60 text-xs">Events</span>                id: 3, image: "/red-neon-lounge-interior.jpg", image: "/red-neon-lounge-interior.jpg",

        </Link>

    name: "HITCHKI",

        <Link href="/favorites" className="flex flex-col items-center space-y-1">

            <Bookmark className="w-6 h-6 text-white/60" />                image: "/purple-neon-club-interior.jpg", rating: 4.2, rating: 4.2,

            <span className="text-white/60 text-xs">Favorites</span>

        </Link>                rating: 4.3,



            <Link href="/profile" className="flex flex-col items-center space-y-1">                location: "Nagpur", location: "Nagpur", location: "Nagpur",

                <div className="w-6 h-6 bg-white/20 rounded-full"></div>

                <span className="text-white/60 text-xs">Profile</span>                type: "Restro Bar"

            </Link>

        </div >            } type: "Club & Kitchen"            type: "Club & Kitchen"

      </div >

    </div >        ];

  );

}    },
},

const featuredEvent = {

    title: "SPONSORED",    {

        subtitle: "9PM ONWARD",        {

            musicBy: "DJ MARTIN",

            hostedBy: "DJ AMIL", id: 2, id: 2,

            image: "/dj-event-poster-with-woman-dj-and-neon-lighting.jpg",

            clubName: "YOUR CLUB PRESENTS"                name: "CAFE 41", name: "CAFE 41",

        };

image: "/upscale-bar-interior-with-bottles.jpg", image: "/upscale-bar-interior-with-bottles.jpg",

  const upcomingEvents = [

    {
        rating: 4.5, rating: 4.5,

        id: 1,

        title: "HERE", location: "Nagpur", location: "Nagpur",

        date: "APR 04",

        image: "/night-party-event-poster-with-purple-and-pink-neon.jpg", type: "Cafe & Bar"            type: "Cafe & Bar"

      subtitle: "CLUB CLOSURE PARTY"

    },        },

{ },

id: 2,

    title: "NIGHT PARTY", {

        date: "APR 04",         {

    image: "/dj-woman-with-headphones-and-sunglasses-in-neon-li.jpg",

        subtitle: "MUSIC BY DJ MARTIN"            id: 3, id: 3,

    }

  ]; name: "HITCHKI", name: "HITCHKI",



  return (image: "/purple-neon-club-interior.jpg", image: "/purple-neon-club-interior.jpg",

    <div className = "min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" >

                {/* Header */ }                        rating: 4.3, rating: 4.3,

      <div className = "flex items-center justify-between p-6 pt-12" >

        <div className="flex items-center space-x-3">                            location: "Nagpur", location: "Nagpur",

          <MapPin className="w-5 h-5 text-blue-400" />

          <div className="flex items-center space-x-1">                                type: "Restro Bar"            type: "Restro Bar"

            <span className="text-white font-medium">Dharampeth</span>

            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">        }

              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />    }

            </svg>

          </div>  ];    ];

        </div>

        

        <div className="flex items-center space-x-4">

          <div className="relative">    const featuredEvent = {

            <Bell className="w-6 h-6 text-white" />        const featuredEvent = {

          </div>

          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">            title: "SPONSORED", title: "SPONSORED",

            <Menu className="w-5 h-5 text-white" />

          </div>            subtitle: "9PM ONWARD", subtitle: "9PM ONWARD",

        </div>

      </div> musicBy: "DJ MARTIN", musicBy: "DJ MARTIN",



    {/* Search Bar */ }            hostedBy: "DJ AMIL", hostedBy: "DJ AMIL",

        <div className="px-6 mb-8">

            <div className="relative">            image: "/dj-event-poster-with-woman-dj-and-neon-lighting.jpg", image: "/dj-event-poster-with-woman-dj-and-neon-lighting.jpg",

                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />

                <input clubName: "YOUR CLUB PRESENTS"        clubName: "YOUR CLUB PRESENTS"

                type="text"

            placeholder="Search"        };

                value={searchText}    };

                onChange={(e) => setSearchText(e.target.value)}

                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300"

          />

            </div>    const upcomingEvents = [    const upcomingEvents = [

        </div>

{
    {

        {/* Top Clubs Carousel */ }

        <div className="px-6 mb-8">            id: 1, id: 1,

            <div className="flex space-x-4 pb-2">

                {topClubs.map((club) => (title: "HERE", title: "HERE",

            <Link key = { club.id } href = {`/clubs/${club.name.toLowerCase()}`}>

                <div className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-white/20 overflow-hidden">            date: "APR 04", date: "APR 04",

                    <img

                        src={club.image} image: "/night-party-event-poster-with-purple-and-pink-neon.jpg", image: "/night-party-event-poster-with-purple-and-pink-neon.jpg",

                    alt={club.name}

                    className="w-full h-full object-cover"            subtitle: "CLUB CLOSURE PARTY"            subtitle: "CLUB CLOSURE PARTY"

                />

                </div>        },        },

            </Link>

          ))}{

        </div>    {

      </div >

                id: 2, id: 2,

                    {/* Featured Event */ }

                    < div className = "px-6 mb-8" > title: "NIGHT PARTY", title: "NIGHT PARTY",

                        <div className="relative rounded-3xl overflow-hidden">

                            <img date: "APR 04", date: "APR 04",

                            src={featuredEvent.image}

                            alt="Featured Event"                    image: "/dj-woman-with-headphones-and-sunglasses-in-neon-li.jpg", image: "/dj-woman-with-headphones-and-sunglasses-in-neon-li.jpg",

                            className="w-full h-64 object-cover"

          />                        subtitle: "MUSIC BY DJ MARTIN"            subtitle: "MUSIC BY DJ MARTIN"



                            {/* Gradient Overlay */}    }

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />}



                            {/* Content */}  ];    ];

                            <div className="absolute inset-0 p-6 flex flex-col justify-between">

                                <div className="flex justify-between items-start">

                                    <div>

                                        <span className="text-white/60 text-xs font-medium">{featuredEvent.clubName}</span>return (    return (

                                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mt-2">

                                            <span className="text-white text-xs font-medium">{featuredEvent.title}</span>    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">

                                            </div>

                                            </div>        {/* Header */}            {/* Header */}

                                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">

                                                BOOK NOW        <div className="flex items-center justify-between p-6 pt-12">            <div className="flex items-center justify-between p-6 pt-12">

                                                </button>

                                                </div>            <div className="flex items-center space-x-3">                <div className="flex items-center space-x-3">



                                                    <div>                <MapPin className="w-5 h-5 text-blue-400" />                    <MapPin className="w-5 h-5 text-blue-400" />

                                                        <div className="text-white text-2xl font-bold mb-1">{featuredEvent.subtitle}</div>

                                                        <div className="flex justify-between items-end">                <div className="flex items-center space-x-1">                    <div className="flex items-center space-x-1">

                                                            <div>

                                                                <div className="text-white/80 text-sm">MUSIC BY</div>                    <span className="text-white font-medium">Dharampeth</span>                        <span className="text-white font-medium">Dharampeth</span>

                                                                <div className="text-white font-semibold">{featuredEvent.musicBy}</div>

                                                            </div>                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                                                                <div className="text-right">

                                                                    <div className="text-white/80 text-sm">HOSTED BY</div>                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />

                                                                    <div className="text-white font-semibold">{featuredEvent.hostedBy}</div>

                                                                </div>                    </svg>                        </svg>

                                                        </div>

                                                        </div>                    </div>

                                                        {/* Dots Indicator */}

                                                        <div className="flex space-x-1 mt-4">            </div>                </div>

                                                    {[...Array(5)].map((_, i) => (

                                                        <div key={i} className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-white' : 'bg-white/40'}`} />

                                                    ))}

                                                </div>            <div className="flex items-center space-x-4">                <div className="flex items-center space-x-4">

                                                </div>

                                                    </div>                <div className="relative">                    <div className="relative">

                                                    </div>

                                                    </div>                    <Bell className="w-6 h-6 text-white" />                        <Bell className="w-6 h-6 text-white" />



                                                    {/* Venue List */}                </div>                    </div>

                                        <div className="px-6 mb-8">

                                            <div className="flex justify-between items-center mb-4">                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">

                                                <h2 className="text-white text-xl font-bold">Venue List</h2>

                                                <Link href="/clubs" className="text-blue-400 text-sm font-medium">                    <Menu className="w-5 h-5 text-white" />                        <Menu className="w-5 h-5 text-white" />

                                                    View All

                                                </Link>                </div>                    </div>

                                            </div>

                                        </div>                </div>

                                    <div className="space-y-4">

                                        {topClubs.map((club) => (        </div>            </div>

                                <Link key={club.id} href={`/clubs/${club.name.toLowerCase()}`}>

                                    <div className="relative rounded-2xl overflow-hidden">

                                        <img

                                            src={club.image}        {/* Search Bar */}            {/* Search Bar */}

                                            alt={club.name}

                                            className="w-full h-32 object-cover"        <div className="px-6 mb-8">            <div className="px-6 mb-8">

                />

                                                <div className="relative">                <div className="relative">

                                                    {/* Bookmark Icon */}

                                                    <button className="absolute top-3 right-3 w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center">                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />

                                                        <Bookmark className="w-4 h-4 text-white" />

                                                    </button>                <input                    <input

                

                {/* Rating Badge */} type="text" type="text"

                <div className="absolute bottom-3 right-3 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg px-2 py-1">

                                                        <span className="text-green-400 text-sm font-semibold">{club.rating}</span>                    placeholder="Search" placeholder="Search"

                                                    </div>

                                                    value={searchText} value={searchText}

                                                    {/* Club Info */}

                                                    <div className="absolute bottom-3 left-3">                    onChange={(e) => setSearchText(e.target.value)} onChange={(e) => setSearchText(e.target.value)}

                                                        <h3 className="text-white font-bold text-lg">{club.name}</h3>

                                                        <p className="text-white/80 text-sm">Open until 1:30 am</p>                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300" className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300"

                                                    </div>

                                                </div>                />                    />

                                                </Link>

          ))}            </div>                </div>

                                    </div>

                            </div>        </div>            </div >



                                {/* Event List */ }

                                < div className = "px-6 mb-24" >

                                    <div className="flex justify-between items-center mb-4">        {/* Top Clubs Carousel */}            {/* Top Clubs Carousel */}

                                        <h2 className="text-white text-xl font-bold">Event List</h2>

                                        <Link href="/events" className="text-blue-400 text-sm font-medium">        <div className="px-6 mb-8">            <div className="px-6 mb-8">

                                            View All

                                        </Link>            <div className="flex space-x-4 pb-2">                <div className="flex space-x-4 pb-2">

                                        </div>

                                                {topClubs.map((club) => ({

        < div className = "grid grid-cols-2 gap-4" > topClubs.map((club) => (

                                                    {
                                                        upcomingEvents.map((event) => (

                                                            <Link key={event.id} href={`/events/${event.id}`}>                        <Link key={club.id} href={`/clubs/${club.name.toLowerCase()}`}>                        <Link key={club.id} href={`/clubs/${club.name.toLowerCase()}`}>

                                                                <div className="relative rounded-2xl overflow-hidden">

                                                                    <img                             <div className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-white/20 overflow-hidden">                            <div className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-white/20 overflow-hidden">

                                                                        src={event.image}

                                                                        alt={event.title}                                <img                                 <img

                  className="w-full h-40 object-cover"

                                                                        />                  src={club.image} src={club.image}



                                                                        {/* Date Badge */}                                    alt={club.name} alt={club.name}

                                                                        <div className="absolute top-3 left-3 bg-blue-500 rounded-lg px-2 py-1">

                                                                            <span className="text-white text-xs font-bold">{event.date}</span>                                    className="w-full h-full object-cover" className="w-full h-full object-cover"

                                                                        </div>

                                                />                                />

                                                                        {/* Event Info */}

                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">                            </div>                            </div>

                                                                        <h3 className="text-white font-bold text-sm">{event.title}</h3>

                                                                        <p className="text-white/80 text-xs">{event.subtitle}</p>                        </Link>                        </Link>

                                                            </div>

                                                            </div>))

            </Link>                }))}

          ))}

                                        </div>            </div>                </div >

      </div >

        </div >            </div >

                {/* Bottom Navigation */ }

                < div className = "fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-slate-800/95 backdrop-blur-sm border-t border-white/10 rounded-t-3xl px-6 py-4" >

                    <div className="flex justify-around items-center">

                        <Link href="/home" className="flex flex-col items-center space-y-1">        {/* Featured Event */}            {/* Featured Event */}

                            <div className="w-6 h-6 bg-blue-500 rounded"></div>

                            <span className="text-blue-400 text-xs font-semibold">Home</span>        <div className="px-6 mb-8">            <div className="px-6 mb-8">

                            </Link>

                                <div className="relative rounded-3xl overflow-hidden">                <div className="relative rounded-3xl overflow-hidden">

                                    <Link href="/clubs" className="flex flex-col items-center space-y-1">

                                        <div className="w-6 h-6 bg-white/20 rounded"></div>                <img                     <img

            <span className="text-white/60 text-xs">Clubs</span>

                                    </Link>            src={featuredEvent.image} src={featuredEvent.image}



                                    <Link href="/events" className="flex flex-col items-center space-y-1">                    alt="Featured Event" alt="Featured Event"

                                        <Calendar className="w-6 h-6 text-white/60" />

                                        <span className="text-white/60 text-xs">Events</span>                    className="w-full h-64 object-cover" className="w-full h-64 object-cover"

                                    </Link>

                          />                    />

                                    <Link href="/favorites" className="flex flex-col items-center space-y-1">

                                        <Bookmark className="w-6 h-6 text-white/60" />

                                        <span className="text-white/60 text-xs">Favorites</span>

                                    </Link>                {/* Gradient Overlay */}                    {/* Gradient Overlay */}



                                    <Link href="/profile" className="flex flex-col items-center space-y-1">                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                        <div className="w-6 h-6 bg-white/20 rounded-full"></div>

                                        <span className="text-white/60 text-xs">Profile</span>

                                    </Link>

                                </div>                {/* Content */}                    {/* Content */}

                                </div>

                            </div>                <div className="absolute inset-0 p-6 flex flex-col justify-between">                    <div className="absolute inset-0 p-6 flex flex-col justify-between">

                                );

}                    <div className="flex justify-between items-start">                        <div className="flex justify-between items-start">

                                    <div>                            <div>

                                        <span className="text-white/60 text-xs font-medium">{featuredEvent.clubName}</span>                                <span className="text-white/60 text-xs font-medium">{featuredEvent.clubName}</span>

                                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mt-2">                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mt-2">

                                            <span className="text-white text-xs font-medium">{featuredEvent.title}</span>                                    <span className="text-white text-xs font-medium">{featuredEvent.title}</span>

                                        </div>                                </div>

                                    </div>                            </div>

                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">

                                        BOOK NOW                                BOOK NOW

                                    </button>                            </button>

                                </div>                        </div>



                                <div>                        <div>

                                    <div className="text-white text-2xl font-bold mb-1">{featuredEvent.subtitle}</div>                            <div className="text-white text-2xl font-bold mb-1">{featuredEvent.subtitle}</div>

                                    <div className="flex justify-between items-end">                            <div className="flex justify-between items-end">

                                        <div>                                <div>

                                            <div className="text-white/80 text-sm">MUSIC BY</div>                                    <div className="text-white/80 text-sm">MUSIC BY</div>

                                            <div className="text-white font-semibold">{featuredEvent.musicBy}</div>                                    <div className="text-white font-semibold">{featuredEvent.musicBy}</div>

                                        </div>                                </div>

                                        <div className="text-right">                                <div className="text-right">

                                            <div className="text-white/80 text-sm">HOSTED BY</div>                                    <div className="text-white/80 text-sm">HOSTED BY</div>

                                            <div className="text-white font-semibold">{featuredEvent.hostedBy}</div>                                    <div className="text-white font-semibold">{featuredEvent.hostedBy}</div>

                                        </div>                                </div>

                                    </div>                            </div>



                                    {/* Dots Indicator */}                            {/* Dots Indicator */}

                                    <div className="flex space-x-1 mt-4">                            <div className="flex space-x-1 mt-4">

                                        {[...Array(5)].map((_, i) => ({ [...Array(5)].map((_, i) => (

                                        <div key={i} className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-white' : 'bg-white/40'}`} />                                    <div key={i} className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-white' : 'bg-white/40'}`} />

                ))}                                ))}

                                    </div>                            </div>

                                </div>                        </div>

                            </div>                    </div>

                    </div>                </div >

        </div >            </div >



                {/* Venue List */ }            {/* Venue List */ }

            <div className="px-6 mb-8">            <div className="px-6 mb-8">

                <div className="flex justify-between items-center mb-4">                <div className="flex justify-between items-center mb-4">

                    <h2 className="text-white text-xl font-bold">Venue List</h2>                    <h2 className="text-white text-xl font-bold">Venue List</h2>

                    <Link href="/clubs" className="text-blue-400 text-sm font-medium">                    <Link href="/clubs" className="text-blue-400 text-sm font-medium">

                        View All                        View All

                    </Link>                    </Link>

                </div>                </div>



                <div className="space-y-4">                <div className="space-y-4">

                    {topClubs.map((club) => ({
                        topClubs.map((club) => (

                            <Link key={club.id} href={`/clubs/${club.name.toLowerCase()}`}>                        <Link key={club.id} href={`/clubs/${club.name.toLowerCase()}`}>

                                <div className="relative rounded-2xl overflow-hidden">                            <div className="relative rounded-2xl overflow-hidden">

                                    <img                                 <img

                  src={club.image} src={club.image}

                                        alt={club.name} alt={club.name}

                                        className="w-full h-32 object-cover" className="w-full h-32 object-cover"

                                    />                                />



                                    {/* Bookmark Icon */}                                {/* Bookmark Icon */}

                                    <button className="absolute top-3 right-3 w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center">                                <button className="absolute top-3 right-3 w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center">

                                        <Bookmark className="w-4 h-4 text-white" />                                    <Bookmark className="w-4 h-4 text-white" />

                                    </button>                                </button>



                                    {/* Rating Badge */}                                {/* Rating Badge */}

                                    <div className="absolute bottom-3 right-3 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg px-2 py-1">                                <div className="absolute bottom-3 right-3 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg px-2 py-1">

                                        <span className="text-green-400 text-sm font-semibold">{club.rating}</span>                                    <span className="text-green-400 text-sm font-semibold">{club.rating}</span>

                                    </div>                                </div>



                                    {/* Club Info */}                                {/* Club Info */}

                                    <div className="absolute bottom-3 left-3">                                <div className="absolute bottom-3 left-3">

                                        <h3 className="text-white font-bold text-lg">{club.name}</h3>                                    <h3 className="text-white font-bold text-lg">{club.name}</h3>

                                        <p className="text-white/80 text-sm">Open until 1:30 am</p>                                    <p className="text-white/80 text-sm">Open until 1:30 am</p>

                                    </div>                                </div>

                                </div>                            </div>

                            </Link>                        </Link>

                        ))
                    }))}

                </div>                </div>

            </div>            </div>



            {/* Event List */ } {/* Event List */ }

            <div className="px-6 mb-24">            <div className="px-6 mb-24">

                <div className="flex justify-between items-center mb-4">                <div className="flex justify-between items-center mb-4">

                    <h2 className="text-white text-xl font-bold">Event List</h2>                    <h2 className="text-white text-xl font-bold">Event List</h2>

                    <Link href="/events" className="text-blue-400 text-sm font-medium">                    <Link href="/events" className="text-blue-400 text-sm font-medium">

                        View All                        View All

                    </Link>                    </Link>

                </div>                </div>



                <div className="grid grid-cols-2 gap-4">                <div className="grid grid-cols-2 gap-4">

                    {upcomingEvents.map((event) => ({
                        upcomingEvents.map((event) => (

                            <Link key={event.id} href={`/events/${event.id}`}>                        <Link key={event.id} href={`/events/${event.id}`}>

                                <div className="relative rounded-2xl overflow-hidden">                            <div className="relative rounded-2xl overflow-hidden">

                                    <img                                 <img

                  src={event.image} src={event.image}

                                        alt={event.title} alt={event.title}

                                        className="w-full h-40 object-cover" className="w-full h-40 object-cover"

                                    />                                />



                                    {/* Date Badge */}                                {/* Date Badge */}

                                    <div className="absolute top-3 left-3 bg-blue-500 rounded-lg px-2 py-1">                                <div className="absolute top-3 left-3 bg-blue-500 rounded-lg px-2 py-1">

                                        <span className="text-white text-xs font-bold">{event.date}</span>                                    <span className="text-white text-xs font-bold">{event.date}</span>

                                    </div>                                </div>



                                    {/* Event Info */}                                {/* Event Info */}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">

                                        <h3 className="text-white font-bold text-sm">{event.title}</h3>                                    <h3 className="text-white font-bold text-sm">{event.title}</h3>

                                        <p className="text-white/80 text-xs">{event.subtitle}</p>                                    <p className="text-white/80 text-xs">{event.subtitle}</p>

                                    </div>                                </div>

                                </div>                            </div>

                            </Link>                        </Link>

                        ))
                    }))}

                </div>                </div>

            </div>            </div>



            {/* Bottom Navigation */ } {/* Bottom Navigation */ }

            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-slate-800/95 backdrop-blur-sm border-t border-white/10 rounded-t-3xl px-6 py-4">            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-slate-800/95 backdrop-blur-sm border-t border-white/10 rounded-t-3xl px-6 py-4">

                <div className="flex justify-around items-center">                <div className="flex justify-around items-center">

                    <Link href="/home" className="flex flex-col items-center space-y-1">                    <Link href="/home" className="flex flex-col items-center space-y-1">

                        <div className="w-6 h-6 bg-blue-500 rounded"></div>                        <div className="w-6 h-6 bg-blue-500 rounded"></div>

                        <span className="text-blue-400 text-xs font-semibold">Home</span>                        <span className="text-blue-400 text-xs font-semibold">Home</span>

                    </Link>                    </Link>



                    <Link href="/clubs" className="flex flex-col items-center space-y-1">                    <Link href="/clubs" className="flex flex-col items-center space-y-1">

                        <div className="w-6 h-6 bg-white/20 rounded"></div>                        <div className="w-6 h-6 bg-white/20 rounded"></div>

                        <span className="text-white/60 text-xs">Clubs</span>                        <span className="text-white/60 text-xs">Clubs</span>

                    </Link>                    </Link>



                    <Link href="/events" className="flex flex-col items-center space-y-1">                    <Link href="/events" className="flex flex-col items-center space-y-1">

                        <Calendar className="w-6 h-6 text-white/60" />                        <Calendar className="w-6 h-6 text-white/60" />

                        <span className="text-white/60 text-xs">Events</span>                        <span className="text-white/60 text-xs">Events</span>

                    </Link>                    </Link>



                    <Link href="/favorites" className="flex flex-col items-center space-y-1">                    <Link href="/favorites" className="flex flex-col items-center space-y-1">

                        <Bookmark className="w-6 h-6 text-white/60" />                        <Bookmark className="w-6 h-6 text-white/60" />

                        <span className="text-white/60 text-xs">Favorites</span>                        <span className="text-white/60 text-xs">Favorites</span>

                    </Link>                    </Link>



                    <Link href="/profile" className="flex flex-col items-center space-y-1">                    <Link href="/profile" className="flex flex-col items-center space-y-1">

                        <div className="w-6 h-6 bg-white/20 rounded-full"></div>                        <div className="w-6 h-6 bg-white/20 rounded-full"></div>

                        <span className="text-white/60 text-xs">Profile</span>                        <span className="text-white/60 text-xs">Profile</span>

                    </Link>                    </Link>

                </div>                </div>

            </div>            </div>

    </div >        </div >

);    );

        }
    }

    const featuredEvent = {
        title: "SPONSORED",
        subtitle: "9PM ONWARD",
        musicBy: "DJ MARTIN",
        hostedBy: "DJ AMIL",
        image: "/dj-event-poster-with-woman-dj-and-neon-lighting.jpg",
        clubName: "YOUR CLUB PRESENTS"
    };

    const upcomingEvents = [
        {
            id: 1,
            title: "HERE",
            date: "APR 04",
            image: "/night-party-event-poster-with-purple-and-pink-neon.jpg",
            subtitle: "CLUB CLOSURE PARTY"
        },
        {
            id: 2,
            title: "NIGHT PARTY",
            date: "APR 04",
            image: "/dj-woman-with-headphones-and-sunglasses-in-neon-li.jpg",
            subtitle: "MUSIC BY DJ MARTIN"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pt-12">
                <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <div className="flex items-center space-x-1">
                        <span className="text-white font-medium">Dharampeth</span>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Menu className="w-5 h-5 text-white" />
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="px-6 mb-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300"
                    />
                </div>
            </div>

            {/* Top Clubs Carousel */}
            <div className="px-6 mb-8">
                <div className="flex space-x-4 pb-2">
                    {topClubs.map((club) => (
                        <Link key={club.id} href={`/clubs/${club.name.toLowerCase()}`}>
                            <div className="flex-shrink-0 w-16 h-16 rounded-full border-2 border-white/20 overflow-hidden">
                                <img
                                    src={club.image}
                                    alt={club.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Featured Event */}
            <div className="px-6 mb-8">
                <div className="relative rounded-3xl overflow-hidden">
                    <img
                        src={featuredEvent.image}
                        alt="Featured Event"
                        className="w-full h-64 object-cover"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-white/60 text-xs font-medium">{featuredEvent.clubName}</span>
                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mt-2">
                                    <span className="text-white text-xs font-medium">{featuredEvent.title}</span>
                                </div>
                            </div>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
                                BOOK NOW
                            </button>
                        </div>

                        <div>
                            <div className="text-white text-2xl font-bold mb-1">{featuredEvent.subtitle}</div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-white/80 text-sm">MUSIC BY</div>
                                    <div className="text-white font-semibold">{featuredEvent.musicBy}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-white/80 text-sm">HOSTED BY</div>
                                    <div className="text-white font-semibold">{featuredEvent.hostedBy}</div>
                                </div>
                            </div>

                            {/* Dots Indicator */}
                            <div className="flex space-x-1 mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-white' : 'bg-white/40'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Venue List */}
            <div className="px-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white text-xl font-bold">Venue List</h2>
                    <Link href="/clubs" className="text-blue-400 text-sm font-medium">
                        View All
                    </Link>
                </div>

                <div className="space-y-4">
                    {topClubs.map((club) => (
                        <Link key={club.id} href={`/clubs/${club.name.toLowerCase()}`}>
                            <div className="relative rounded-2xl overflow-hidden">
                                <img
                                    src={club.image}
                                    alt={club.name}
                                    className="w-full h-32 object-cover"
                                />

                                {/* Bookmark Icon */}
                                <button className="absolute top-3 right-3 w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <Bookmark className="w-4 h-4 text-white" />
                                </button>

                                {/* Rating Badge */}
                                <div className="absolute bottom-3 right-3 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg px-2 py-1">
                                    <span className="text-green-400 text-sm font-semibold">{club.rating}</span>
                                </div>

                                {/* Club Info */}
                                <div className="absolute bottom-3 left-3">
                                    <h3 className="text-white font-bold text-lg">{club.name}</h3>
                                    <p className="text-white/80 text-sm">Open until 1:30 am</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Event List */}
            <div className="px-6 mb-24">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white text-xl font-bold">Event List</h2>
                    <Link href="/events" className="text-blue-400 text-sm font-medium">
                        View All
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {upcomingEvents.map((event) => (
                        <Link key={event.id} href={`/events/${event.id}`}>
                            <div className="relative rounded-2xl overflow-hidden">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-40 object-cover"
                                />

                                {/* Date Badge */}
                                <div className="absolute top-3 left-3 bg-blue-500 rounded-lg px-2 py-1">
                                    <span className="text-white text-xs font-bold">{event.date}</span>
                                </div>

                                {/* Event Info */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                                    <h3 className="text-white font-bold text-sm">{event.title}</h3>
                                    <p className="text-white/80 text-xs">{event.subtitle}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-slate-800/95 backdrop-blur-sm border-t border-white/10 rounded-t-3xl px-6 py-4">
                <div className="flex justify-around items-center">
                    <Link href="/home" className="flex flex-col items-center space-y-1">
                        <div className="w-6 h-6 bg-blue-500 rounded"></div>
                        <span className="text-blue-400 text-xs font-semibold">Home</span>
                    </Link>

                    <Link href="/clubs" className="flex flex-col items-center space-y-1">
                        <div className="w-6 h-6 bg-white/20 rounded"></div>
                        <span className="text-white/60 text-xs">Clubs</span>
                    </Link>

                    <Link href="/events" className="flex flex-col items-center space-y-1">
                        <Calendar className="w-6 h-6 text-white/60" />
                        <span className="text-white/60 text-xs">Events</span>
                    </Link>

                    <Link href="/favorites" className="flex flex-col items-center space-y-1">
                        <Bookmark className="w-6 h-6 text-white/60" />
                        <span className="text-white/60 text-xs">Favorites</span>
                    </Link>

                    <Link href="/profile" className="flex flex-col items-center space-y-1">
                        <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                        <span className="text-white/60 text-xs">Profile</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

const handleLocationClick = () => {
    router.push('/location');
};

const handleProfileClick = () => {
    router.push('/profile');
};

const handleVenueClick = (venueId: string) => {
    router.push(`/clubs/${venueId}`);
};

const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
};

const handleViewAll = (section: string) => {
    if (section === 'venues') {
        router.push('/clubs');
    } else if (section === 'events') {
        router.push('/events');
    }
};

const handleFavorites = () => {
    router.push('/favorites');
};

const handleMenuClick = () => {
    // Show hamburger menu modal
};

return (
    <div className="min-h-screen bg-black text-white pb-24">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pt-12">
            <button onClick={handleLocationClick} className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-purple-400" />
                <span className="text-white font-semibold text-lg">{selectedLocation}</span>
                <ChevronDown className="w-5 h-5 text-white/60" />
            </button>

            <div className="flex items-center gap-4">
                <button onClick={handleFavorites} className="p-2">
                    <Heart className="w-6 h-6 text-white" />
                </button>
                <button onClick={handleProfileClick} className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                </button>
            </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 mb-8">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/60" />
                <input
                    type="text"
                    placeholder="Search clubs, events, DJs..."
                    className="w-full pl-14 pr-14 py-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all duration-300"
                />
                <button
                    onClick={handleMenuClick}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                    <Menu className="w-6 h-6 text-white/60" />
                </button>
            </div>
        </div>

        {/* Main Event Card */}
        <div className="px-6 mb-8">
            <div className="relative rounded-3xl overflow-hidden">
                <img
                    src="/dj-woman-with-headphones-and-sunglasses-in-neon-li.jpg"
                    alt="Featured Event"
                    className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Sponsored Badge */}
                <div className="absolute top-6 left-6 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full">
                    <span className="text-white text-sm font-bold">SPONSORED</span>
                </div>

                {/* Bookmark Icon */}
                <button className="absolute top-6 right-6 w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Bookmark className="w-5 h-5 text-white" />
                </button>

                {/* Event Info */}
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-purple-300 text-sm font-medium mb-1">MUSIC BY</p>
                            <h2 className="text-white font-bold text-2xl mb-2">DJ MARTIN</h2>
                            <p className="text-pink-300 text-sm font-medium mb-1">HOSTED BY</p>
                            <p className="text-white font-bold text-lg">DJ AMIL</p>
                            <div className="flex items-center gap-4 mt-3 text-white/80 text-sm">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Tonight</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>Club Phoenix</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleEventClick('featured-event')}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3 rounded-2xl text-white font-bold transition-all duration-300 transform hover:scale-105"
                        >
                            BOOK NOW
                        </button>
                    </div>
                </div>

                {/* Dot indicators */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    <div className="w-3 h-3 bg-white/40 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/40 rounded-full"></div>
                </div>
            </div>
        </div>

        {/* Categories */}
        <div className="px-6 mb-8">
            <div className="flex space-x-4">
                <button className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white font-bold text-center">
                    Clubs
                </button>
                <button className="flex-1 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white font-bold text-center hover:bg-white/20 transition-colors">
                    Events
                </button>
            </div>
        </div>

        {/* Popular Venues Section */}
        <div className="px-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Popular Venues</h3>
                <button
                    onClick={() => handleViewAll('venues')}
                    className="text-purple-400 font-medium"
                >
                    View all
                </button>
            </div>

            <div className="space-y-4">
                {/* Venue Card 1 */}
                <div
                    onClick={() => handleVenueClick('club-phoenix')}
                    className="relative rounded-2xl overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-transform duration-300"
                >
                    <img
                        src="/upscale-club-interior-with-blue-lighting.jpg"
                        alt="Club Phoenix"
                        className="w-full h-24 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="absolute inset-0 p-4 flex items-center">
                        <div className="flex-1">
                            <h4 className="text-white font-bold text-lg">Club Phoenix</h4>
                            <div className="flex items-center gap-4 text-white/80 text-sm">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span>4.8</span>
                                </div>
                                <span>Open until 3 AM</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-purple-300 text-sm">Entry</p>
                            <p className="text-white font-bold">₹1500</p>
                        </div>
                    </div>
                </div>

                {/* Venue Card 2 */}
                <div
                    onClick={() => handleVenueClick('neon-nights')}
                    className="relative rounded-2xl overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-transform duration-300"
                >
                    <img
                        src="/purple-neon-club-interior.jpg"
                        alt="Neon Nights"
                        className="w-full h-24 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="absolute inset-0 p-4 flex items-center">
                        <div className="flex-1">
                            <h4 className="text-white font-bold text-lg">Neon Nights</h4>
                            <div className="flex items-center gap-4 text-white/80 text-sm">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span>4.6</span>
                                </div>
                                <span>Open until 2 AM</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-purple-300 text-sm">Entry</p>
                            <p className="text-white font-bold">₹1200</p>
                        </div>
                    </div>
                </div>

                {/* Venue Card 3 */}
                <div
                    onClick={() => handleVenueClick('red-lounge')}
                    className="relative rounded-2xl overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-transform duration-300"
                >
                    <img
                        src="/red-neon-lounge-interior.jpg"
                        alt="Red Lounge"
                        className="w-full h-24 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="absolute inset-0 p-4 flex items-center">
                        <div className="flex-1">
                            <h4 className="text-white font-bold text-lg">Red Lounge</h4>
                            <div className="flex items-center gap-4 text-white/80 text-sm">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span>4.7</span>
                                </div>
                                <span>Open until 1 AM</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-purple-300 text-sm">Entry</p>
                            <p className="text-white font-bold">₹2000</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10">
            <div className="flex items-center justify-around py-4">
                <button className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                    </div>
                    <span className="text-purple-400 text-xs font-medium">Home</span>
                </button>

                <button
                    onClick={() => router.push('/clubs')}
                    className="flex flex-col items-center gap-1"
                >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white/60" />
                    </div>
                    <span className="text-white/60 text-xs">Clubs</span>
                </button>

                <button
                    onClick={() => router.push('/events')}
                    className="flex flex-col items-center gap-1"
                >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white/60" />
                    </div>
                    <span className="text-white/60 text-xs">Events</span>
                </button>

                <button
                    onClick={() => router.push('/tickets')}
                    className="flex flex-col items-center gap-1"
                >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Bookmark className="w-4 h-4 text-white/60" />
                    </div>
                    <span className="text-white/60 text-xs">Tickets</span>
                </button>

                <button
                    onClick={handleProfileClick}
                    className="flex flex-col items-center gap-1"
                >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-white/60" />
                    </div>
                    <span className="text-white/60 text-xs">Profile</span>
                </button>
            </div>
        </div>
    </div>
);
}