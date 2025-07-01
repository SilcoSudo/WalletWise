export const formatDate = (date, format = 'dd/MM/yyyy') => {
  // You can add date formatting utilities here
  return date;
};

export function formatCurrencyShort(value) {
  if (value == null || isNaN(value)) return '';
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000_000) {
    return (value / 1_000_000_000_000).toFixed(2).replace(/\.00$/, '') + ' nghìn tỷ đ';
  } else if (abs >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(2).replace(/\.00$/, '') + ' tỷ đ';
  } else if (abs >= 1_000_000) {
    return (value / 1_000_000).toFixed(2).replace(/\.00$/, '') + ' triệu đ';
  } else if (abs >= 1_000) {
    return (value / 1_000).toFixed(2).replace(/\.00$/, '') + 'K đ';
  }
  return value.toLocaleString('vi-VN') + ' đ';
}

export function formatCurrency(value) {
  if (value == null || isNaN(value)) return '';
  return value.toLocaleString('vi-VN') + '₫';
}
