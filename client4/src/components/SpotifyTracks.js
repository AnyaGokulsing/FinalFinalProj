import React, { useState, useEffect } from 'react';

const token = 'BQDHG6aO5btiTK7LzT_r8tY3tTWwEyArPLSuTcLABrAuNlwOAoKSbAv7WtIg4J1qEbnCwJXw7fo1gLXwpn9ALetGKTBzpPj4L-Meu19oojO_i3hC6sYwoWmjHKgdw4LD8yJGddgLBkfiom-6W5d_mRTRkpaYYz4HtvlujifRQyA0USz8HjlnTaDvSJ2qUdjJyXL76q_MK4lMt05N4lSPpgehAGHELjHbvb4uipWkzS8OZt16GGfwEDfh8vE5nKWH-lVxfJH45XUtPDCC8yrakeNU';

const SpotifyTopTracks = () => {
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const res = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch top tracks');
        }

        const data = await res.json();
        setTopTracks(data.items);
      } catch (error) {
        console.error('Error fetching top tracks:', error.message);
      }
    };

    fetchTopTracks();
  }, []); 

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center text-white">Cool admins are listening to 😎</h2>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {topTracks.map((track) => (
          <div key={track.id} className="col">
            <div
              className="card h-100"
              style={{
                backgroundImage: 'linear-gradient(to bottom right, #FFD700, #FF4500)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                color: '#FFFFFF',
                overflow: 'hidden', 
              }}
            >
              <div className="card-body">
                <h5 className="card-title">{track.name}</h5>
                <p className="card-text">
                  <strong>Artists:</strong> {track.artists.map((artist) => artist.name).join(', ')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpotifyTopTracks;
