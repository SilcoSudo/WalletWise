export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(amount);
};

export const formatDate = (date, format = 'dd/MM/yyyy') => {
  // You can add date formatting utilities here
  return date;
};
