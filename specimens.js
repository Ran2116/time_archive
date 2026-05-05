// Built-in specimen catalogue. Each links to its own HTML file.
// User-created specimens live in localStorage under TA_USER_SPECIMENS.
window.TA_BUILTIN_SPECIMENS = [
  { id: 'sweet-potato', file: 'sweet-potato_2.html', catalog: 1, type: 'photo_countdown', image: 'sweet_potato2.png',
    title: '', color: '#c5512a',
    duration: 20*60*1000,  startAt: Date.now(),
    slot: 'sweet_potato',
    description: 'Cut a sweet potato into two halves. Put it in the pot and steam it for 34 minutes. Fulfill your apetite at once.',
     },

  { id: 'boil-an-egg', file: 'egg.html', catalog: 2, type: 'photo_countdown', image: 'egg.jpg',
    title: '', color: '#e0a93a', roman: true,
    duration: 3600000, startAt: Date.now() - 40 * 60000,
    slot: 'round_pink',
    description: 'Take an egg out of the fridge and put it into a pot with water. After around 8 min and 11 seconds, a soft boiled egg comes into birth.' },

  { id: 'candle', file: 'Candle_Specimen.html', catalog: 3, type: 'photo_countdown', image: 'candle.jpg',
    title: '', color: '#b52b16', roman: true,
    duration: 12 * 60 * 60 * 1000, startAt: Date.now() - 12 * 60000,
    slot: 'round_orange',
    description: 'Place a tall pillar candle on a steady surface and light its wick. After around 12 hours of slow burning, only a soft pool of wax remains at the base.' },

    { id: 'subway-loop', file: 'subway-loop.html', catalog: 4,
    type: 'digital_loop', 
    title: '', color: '#3a8a5a',
    duration: 6*60*1000, startAt: Date.now(),
    description: 'The train will come, but usually not on time. ',
    reflection: '' },

    {id: "3d-print",
    file: "print.html",
    catalog: 5,
    type: "photo_countdown",
    kind: "loop",
    title: "",
    color: "#3a6a8a",
    duration: (4 * 60 + 43) * 60 * 1000,   
    image: "print.jpg",                    
    description: "Start the print. The nozzle traces one flat outline, then another, then another. After 4 hours and 43 minutes of patient stacking, the layers have become an object."
  },


  {id: "friends",
  file: "friend.html",
  catalog: 6,
  type: "photo_countdown",                             
  kind: "anchor",
  title: "",
  color: "#82295a",
  startAt: new Date(2026, 3, 18, 15, 47, 0).getTime(),  
  image: "friends.png",
  description: "Travel with Friends"
},

{ id: 'itp', file: 'itp.html', catalog: 7,
    type: 'accumulate', kind: 'record',
    title: '', color: '#a46fa7',
    startAt: new Date(2025, 7, 25, 0, 0, 0).getTime(),
    image: 'ITP.png',
    description: 'First day at ITP' },

 
    
];
