#!/usr/bin/env node

/**
 * Test Script untuk Sistem Email PANDORA
 * 
 * Cara penggunaan:
 * 1. Pastikan .env sudah dikonfigurasi dengan benar
 * 2. Jalankan: node test-email.js
 * 3. Atau dengan email custom: node test-email.js test@example.com
 */

require('dotenv').config();
const { sendPengaduanNotification } = require('./emailConfig');

async function testEmail() {
  const recipientEmail = process.argv[2] || process.env.EMAIL_USER || 'test@example.com';
  
  console.log('🧪 Testing Email Notification System...');
  console.log('📧 Recipient:', recipientEmail);
  console.log('🔧 Email Config:', {
    user: process.env.EMAIL_USER || 'Not configured',
    hasPassword: !!process.env.EMAIL_PASSWORD,
    recipients: process.env.DESA_EMAIL_RECIPIENTS || 'Not configured'
  });
  
  // Data test pengaduan
  const testPengaduanData = {
    nama: 'Test User',
    email: 'test@example.com',
    whatsapp: '081234567890',
    klasifikasi: 'pengaduan',
    judul: 'Test Pengaduan - Sistem Email PANDORA',
    isi: 'Ini adalah test pengaduan untuk memverifikasi sistem email berfungsi dengan baik. Pengaduan ini dibuat untuk testing sistem notifikasi otomatis.',
    tanggal_kejadian: new Date().toISOString(),
    kategori: 'Infrastruktur (Jalan, Jembatan, dll.)',
    lampiran_info: 'test-document.pdf',
    tanggal_pengaduan: new Date().toISOString()
  };
  
  try {
    console.log('\n📤 Sending test email...');
    
    const result = await sendPengaduanNotification(testPengaduanData, recipientEmail);
    
    if (result.success) {
      console.log('✅ Test email sent successfully!');
      console.log('📧 Message ID:', result.messageId);
      console.log('📬 Check your email inbox (and spam folder)');
    } else {
      console.log('❌ Failed to send test email');
      console.log('🔍 Error:', result.error);
      
      // Common troubleshooting tips
      console.log('\n🔧 Troubleshooting Tips:');
      console.log('1. Check .env file configuration');
      console.log('2. Verify email credentials');
      console.log('3. Check internet connection');
      console.log('4. For Gmail: use App Password, not regular password');
      console.log('5. Enable 2FA on Gmail account');
    }
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
    console.error('📚 Stack trace:', error.stack);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testEmail().then(() => {
    console.log('\n🏁 Test completed');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
}

module.exports = { testEmail };
