const getRandomColor = (index? :number) => {
  const colors = [
    "#7FDBDA", // soft teal
    "#8FBFFA", // soft blue
    "#FFD27F", // soft orange
    "#FF9A8B", // soft coral
    "#B39DDB", // soft purple
    "#FFB870", // warm amber
    "#6ED3CF", // aqua
    "#A0E7E5", // pastel teal but slightly richer
    "#C3AED6", // lavender
    "#F7A8A8", // muted red
    "#A8D5BA", // sage green
    "#B5EAD7", // mint green
    "#C7CEEA", // light indigo
    "#FBC4AB", // peach
    "#D4A5A5", // dusty rose
    "#9AD0EC", // sky blue
    "#CAB8FF", // soft violet
    "#FFD6A5", // soft apricot
  ];

  if(index || index == 0) return colors[index];

  return colors[Math.floor(Math.random() * colors.length)];
};

export default getRandomColor;