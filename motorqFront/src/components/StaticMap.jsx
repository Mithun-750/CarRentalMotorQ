import Image from 'next/image';

const StaticMap = ({ lat, lng, zoom = 13, width = 600, height = 300 }) => {
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&maptype=roadmap&markers=color:red|${lat},${lng}&key=AIzaSyC090I7tnnwAyxRtHKqNRybDodIu9NR1VQ`;

  return (
    <div>
      <h2>Static Google Map</h2>
      <Image 
        src={mapUrl} 
        alt="Static Google Map" 
        width={width} 
        height={height} 
      />
    </div>
  );
};

export default StaticMap;
