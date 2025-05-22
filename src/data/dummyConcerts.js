// src/data/dummyConcerts.js
import dummyVenues from './dummyVenues';
import dummyGenres from './dummyGenres';

const dummyConcerts = [
    {
        id: 1,
        name: "Konser Dewa 19 - Surabaya",
        description: "Tur reuni Dewa 19 di Surabaya, membawakan lagu-lagu hits terbaik.",
        concertStart: "2025-06-20T19:00:00",
        concertEnd: "2025-06-20T22:00:00",
        venueId: 1, // DBL Arena, Surabaya
        linkPoster: "https://via.placeholder.com/400x300?text=Dewa+19+Poster", // Placeholder
        linkVenue: "https://maps.app.goo.gl/example1", // Contoh link Google Maps

        // Relasi tambahan sesuai DBML
        genres: [
            { id: 1, name: "Rock" },
            { id: 2, name: "Pop" }
        ],
        tickets: [
            {
                id: 1,
                name: "Tiket VIP Dewa 19",
                price: 500000,
                quota: 100,
                salesStart: "2025-05-01T08:00:00",
                salesEnd: "2025-06-01T23:59:59",
            },
            {
                id: 2,
                name: "Tiket Reguler Dewa 19",
                price: 250000,
                quota: 300,
                salesStart: "2025-05-01T08:00:00",
                salesEnd: "2025-06-01T23:59:59",
            },
        ]
    },
    {
        id: 2,
        name: "Sheila On 7 Reunion Tour",
        description: "Konser reuni band legendaris Sheila On 7 di Yogyakarta.",
        concertStart: "2025-07-10T18:30:00",
        concertEnd: "2025-07-10T22:30:00",
        venueId: 2, // Stadion Maguwoharjo, Yogyakarta
        linkPoster: "https://via.placeholder.com/400x300?text=Sheila+On+7+Poster", // Placeholder
        linkVenue: "https://maps.app.goo.gl/example2", // Contoh link Google Maps

        // Relasi tambahan sesuai DBML
        genres: [
            { id: 2, name: "Pop" }
        ],
        tickets: [
            {
                id: 3,
                name: "Tiket Presale Sheila On 7",
                price: 350000,
                quota: 200,
                salesStart: "2025-06-01T09:00:00",
                salesEnd: "2025-06-30T23:59:59",
            },
        ]
    },
];

// Fungsi helper untuk mendapatkan data venue berdasarkan ID
export const getVenueById = (venueId) => {
    return dummyVenues.find(venue => venue.id === venueId);
};

// Fungsi helper untuk mendapatkan data genre berdasarkan ID
export const getGenreById = (genreId) => {
    return dummyGenres.find(genre => genre.id === genreId);
};

export default dummyConcerts;