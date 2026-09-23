import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA70HlIDO0sAnVEi3ULlKD8KusYiZkqTNo",
  authDomain: "shekhar-jaat-portfolio.firebaseapp.com",
  projectId: "shekhar-jaat-portfolio",
  storageBucket: "shekhar-jaat-portfolio.firebasestorage.app",
  messagingSenderId: "28064232504",
  appId: "1:28064232504:web:afc2cdcb57d2e88bcf62cd",
  measurementId: "G-V9FY552BQB",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  console.log('--- Testing Firestore Collections ---');
  
  // 1. Guestbook
  try {
    console.log('Testing reading guestbook...');
    const gbSnap = await getDocs(collection(db, 'guestbook'));
    console.log(`✓ Guestbook read success! Documents count: ${gbSnap.size}`);
    gbSnap.forEach(d => console.log('  doc:', d.id, d.data().author, '-', d.data().message));
  } catch (err) {
    console.error('✗ Guestbook read failed:', err.message, err.code);
  }

  // 2. Inquiries
  try {
    console.log('\nTesting reading inquiries...');
    const inqSnap = await getDocs(collection(db, 'inquiries'));
    console.log(`✓ Inquiries read success! Documents count: ${inqSnap.size}`);
    inqSnap.forEach(d => console.log('  inquiry:', d.id, d.data().name, d.data().email, '-', d.data().subject));
  } catch (err) {
    console.error('✗ Inquiries read failed:', err.message, err.code);
  }

  // 3. Support Tickets
  try {
    console.log('\nTesting reading support_tickets...');
    const stSnap = await getDocs(collection(db, 'support_tickets'));
    console.log(`✓ support_tickets read success! Documents count: ${stSnap.size}`);
    stSnap.forEach(d => console.log('  ticket:', d.id, d.data().subject, '-', d.data().customerEmail));
  } catch (err) {
    console.error('✗ support_tickets read failed:', err.message, err.code);
  }

  // 4. Test Write to inquiries
  try {
    console.log('\nTesting writing test inquiry to inquiries collection...');
    const testDoc = await addDoc(collection(db, 'inquiries'), {
      name: 'Diagnostic Probe',
      email: 'test@example.com',
      subject: 'Firebase Connection Diagnostic',
      message: 'Verifying live Firestore write permissions.',
      createdAt: serverTimestamp(),
      createdMillis: Date.now(),
      status: 'diagnostic',
      source: 'CLI Diagnostic'
    });
    console.log('✓ Successfully wrote test document to inquiries! ID:', testDoc.id);
  } catch (err) {
    console.error('✗ Inquiries write failed:', err.message, err.code);
  }

  process.exit(0);
}

test();
