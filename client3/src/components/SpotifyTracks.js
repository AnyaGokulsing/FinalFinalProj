import React, { useState, useEffect } from 'react';

const token = 'BQDiCx7Hg4PJLjlUF0p7gketgTGK5ujjVwPXTyZ6Ncu_uSSmD6b5OkbaXcgbxb6Uc98B2BOTjwJv6O_rdIIPnpMhTOkocj1b47xG1jv7MiayYuzHAFpw-LPYD5HKNOv6k5neCQE3OAgcZs3A555S8R9VYjYlPgkDeUo_DvIcYbJskUJ6SDNwL8b6BvtcUcP0c1LTVpgC29KRjmqdBL7He7gvLhHQ2rX05sju3TpL_qPxc1rrfuSyWWU5M_MvPf7e3IPRtRBn5GsH_-BCqv07Qwpn';

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

  const getGradientStyle = () => {
    const colors = ['#1DB954', '#191414']; // Updated gradient colors
    const gradientDirection = 'to bottom right'; // Updated gradient direction
    return `linear-gradient(${gradientDirection}, ${colors.join(', ')})`;
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center text-white">Sweat it to the beat of 🏋</h2>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {topTracks.map((track) => (
          <div key={track.id} className="col">
            <div
              className="card h-100"
              style={{
                backgroundImage: 'linear-gradient(to bottom right, #00BFFF, #98FF98)',
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
