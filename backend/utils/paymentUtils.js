// utils/paymentUtils.js
export const generateKodeUnik = () => {
  return Math.floor(Math.random() * 999) + 1; // 1-999
};

export const hitungTagihan = (hargaAsli, kodeUnik) => {
  return hargaAsli + kodeUnik;
};

export const generateExpiredAt = (jamKe = 2) => {
  const now = new Date();
  now.setHours(now.getHours() + jamKe);
  return now; // expired 2 jam dari sekarang
};
