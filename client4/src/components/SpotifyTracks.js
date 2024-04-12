import React, { useState, useEffect } from 'react';

const token = 'BQCUBBZq4js8ooAGXotVPzHB3NRrM9vjHuLm2n2eSuHt0v2QZeZH0wB427vUiQniSm61BQDE9t_sBXlPygsEy619Rlo1hOvrYMJxv80_eOV_tmcidWpsW0b3gOjMZFGC5FfSfkHJps8JRPYhROKfM39EOW4r6GnMORoXEUnYhN0KkrJuqFOw_08pRrkHC9o_OFnGWC0I4JjT1iZDRBVhTLl_cLoBRwjIRdaqc3zn2wLfWVcDJJnIbYTB4fQ9arSngu4xfN94wqUY45ZTU61UqV8P';

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
