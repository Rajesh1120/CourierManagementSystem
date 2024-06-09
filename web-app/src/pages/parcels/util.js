export const calculatePrice = (parcelData) => {
  const { length, breadth, weight } = parcelData;

  const basePrice = 10;
  const pricePerBreadth = 0.5;
  const pricePerLength = 0.8;
  const pricePerWeight = 1.2;

  const price =
    basePrice +
    pricePerBreadth * breadth +
    pricePerLength * length +
    pricePerWeight * weight;

  return price?.toFixed(2);
};
