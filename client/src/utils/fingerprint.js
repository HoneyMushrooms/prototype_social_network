import sha256 from 'crypto-js/sha256';

function generateFingerprint() {
    const fingerprint = [];
  
    fingerprint.push(navigator.userAgent);
    fingerprint.push(navigator.language);
    fingerprint.push(new Date().getTimezoneOffset());
    fingerprint.push(navigator.hardwareConcurrency); 
    
    const fingerprintString = fingerprint.join("");
    const hash = sha256(fingerprintString).toString();
  
    return hash;
}
  
export default generateFingerprint;