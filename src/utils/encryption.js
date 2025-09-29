// Simple AES-256 encryption utilities for demo purposes
// In production, use a proper cryptographic library like crypto-js or Web Crypto API

const ENCRYPTION_KEY = 'your-secret-key-32-characters-long' // In production, generate this dynamically

// Convert ArrayBuffer to hex string
function arrayBufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Convert hex string to ArrayBuffer
function hexToArrayBuffer(hex) {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
  }
  return bytes.buffer
}

// Simple XOR encryption (for demo - replace with proper AES in production)
function simpleEncrypt(data, key) {
  const dataArray = new Uint8Array(data)
  const keyArray = new Uint8Array(key.length)
  for (let i = 0; i < keyArray.length; i++) {
    keyArray[i] = key.charCodeAt(i % key.length)
  }

  const encrypted = new Uint8Array(dataArray.length)
  for (let i = 0; i < dataArray.length; i++) {
    encrypted[i] = dataArray[i] ^ keyArray[i % keyArray.length]
  }

  return encrypted.buffer
}

// Simple XOR decryption (for demo - replace with proper AES in production)
function simpleDecrypt(encryptedData, key) {
  return simpleEncrypt(encryptedData, key) // XOR is symmetric
}

// Generate a random encryption key
export function generateEncryptionKey() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return arrayBufferToHex(array)
}

// Encrypt a file
export async function encryptFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = function(e) {
      try {
        const fileData = e.target.result
        const encryptedData = simpleEncrypt(fileData, ENCRYPTION_KEY)
        const encryptedHex = arrayBufferToHex(encryptedData)

        // Add metadata for decryption
        const encryptedFile = {
          data: encryptedHex,
          name: file.name,
          type: file.type,
          size: file.size,
          encrypted: true,
          timestamp: Date.now()
        }

        resolve(encryptedFile)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = function() {
      reject(new Error('Failed to read file'))
    }

    reader.readAsArrayBuffer(file)
  })
}

// Decrypt a file
export async function decryptFile(encryptedFile) {
  return new Promise((resolve, reject) => {
    try {
      const encryptedBuffer = hexToArrayBuffer(encryptedFile.data)
      const decryptedData = simpleDecrypt(encryptedBuffer, ENCRYPTION_KEY)

      // Create a blob from the decrypted data
      const blob = new Blob([decryptedData], { type: encryptedFile.type })

      resolve({
        blob: blob,
        name: encryptedFile.name,
        size: encryptedFile.size
      })
    } catch (error) {
      reject(error)
    }
  })
}

// Generate RSA key pair (simplified for demo)
export function generateRSAKeyPair() {
  // In production, use Web Crypto API or a proper RSA library
  return {
    publicKey: 'demo-public-key-' + Date.now(),
    privateKey: 'demo-private-key-' + Date.now()
  }
}

// Encrypt with RSA (simplified for demo)
export function encryptWithRSA(data, _publicKey) {
  // In production, implement proper RSA encryption
  return 'rsa-encrypted-' + btoa(data).substring(0, 50) + '...'
}

// Decrypt with RSA (simplified for demo)
export function decryptWithRSA(encryptedData, _privateKey) {
  // In production, implement proper RSA decryption
  return atob(encryptedData.replace('rsa-encrypted-', ''))
}
