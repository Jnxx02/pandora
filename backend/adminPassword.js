// File untuk menyimpan password admin yang dapat diupdate
// Dalam production, sebaiknya menggunakan database dengan hashing

let adminPassword = 'admin123'; // Default password

const getAdminPassword = () => {
  return adminPassword;
};

const setAdminPassword = (newPassword) => {
  adminPassword = newPassword;
  console.log('🔐 Admin password updated successfully');
  return true;
};

const validateAdminPassword = (inputPassword) => {
  return inputPassword === adminPassword;
};

module.exports = {
  getAdminPassword,
  setAdminPassword,
  validateAdminPassword
};
