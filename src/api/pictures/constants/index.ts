const cardImageSelector = {
  id: true,
  title: true,
  imageUrl: true,
  price: true,
  width: true,
  height: true,
  isSold: true,
  material: true,
  type: true,
  paint: true,
} as const;

export { cardImageSelector };
