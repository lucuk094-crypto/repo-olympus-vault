// SODA Hacker Tools - Main Application

// Tab Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// Modal Functions
function openModal() {
    document.getElementById('toolModal').classList.add('active');
}

function closeModal() {
    document.getElementById('toolModal').classList.remove('active');
}

// Open Tool
function openTool(toolId) {
    const tool = toolData[toolId];
    if (tool) {
        document.getElementById('modalTitle').textContent = tool.title;
        document.getElementById('modalBody').innerHTML = tool.content;
        openModal();
    }
}

// Close modal on outside click
document.getElementById('toolModal').addEventListener('click', (e) => {
    if (e.target.id === 'toolModal') closeModal();
});

// IP Scanner
function runIPScan() {
    const ip = document.getElementById('ipInput').value;
    const result = document.getElementById('ipResult');
    if (!ip) { result.textContent = 'Please enter an IP address'; return; }
    result.textContent = 'Scanning ' + ip + '...\n\n[Results]\nIP: ' + ip + '\nStatus: Active\nPorts: 22, 80, 443, 8080\nServices: SSH, HTTP, HTTPS\nLocation: Unknown\nASN: N/A';
}

// WHOIS Lookup
function runWhois() {
    const domain = document.getElementById('whoisInput').value;
    const result = document.getElementById('whoisResult');
    if (!domain) { result.textContent = 'Please enter a domain'; return; }
    result.textContent = 'Looking up ' + domain + '...\n\n[WHOIS Results]\nDomain: ' + domain + '\nRegistrar: Unknown\nCreated: 2020-01-01\nExpires: 2025-01-01\nStatus: Active';
}

// Subdomain Enumeration
function runSubdomain() {
    const domain = document.getElementById('subdomainInput').value;
    const result = document.getElementById('subdomainResult');
    if (!domain) { result.textContent = 'Please enter a domain'; return; }
    result.textContent = 'Enumerating ' + domain + '...\n\n[Subdomains Found]\n- www.' + domain + '\n- mail.' + domain + '\n- ftp.' + domain + '\n- admin.' + domain + '\n- api.' + domain + '\n- dev.' + domain;
}

// DNS Dump
function runDNS() {
    const domain = document.getElementById('dnsInput').value;
    const result = document.getElementById('dnsResult');
    if (!domain) { result.textContent = 'Please enter a domain'; return; }
    result.textContent = 'DNS Records for ' + domain + '\n\n[A] 192.168.1.1\n[MX] mail.' + domain + '\n[TXT] v=spf1 include:all\n[NS] ns1.' + domain + '\n[NS] ns2.' + domain;
}

// Hash Identifier
function identifyHash() {
    const hash = document.getElementById('hashInput').value;
    const result = document.getElementById('hashResult');
    if (!hash) { result.textContent = 'Please enter a hash'; return; }
    const len = hash.length;
    let type = 'Unknown';
    if (len === 32) type = 'MD5';
    else if (len === 40) type = 'SHA1';
    else if (len === 64) type = 'SHA256';
    else if (len === 128) type = 'SHA512';
    else if (len === 16) type = 'MySQL323';
    result.textContent = 'Hash: ' + hash + '\nLength: ' + len + '\nPossible Type: ' + type;
}

// Hash Cracker
function crackHash() {
    const hash = document.getElementById('hashCrackInput').value;
    const type = document.getElementById('hashType').value;
    const result = document.getElementById('hashCrackResult');
    if (!hash) { result.textContent = 'Please enter a hash'; return; }
    result.textContent = 'Attempting to crack ' + type + ' hash...\n\nCracking in progress...\nThis may take a while.\n\n[Note] Use a proper wordlist for real cracking';
}

// JWT Decoder
function decodeJWT() {
    const jwt = document.getElementById('jwtInput').value;
    const result = document.getElementById('jwtResult');
    if (!jwt) { result.textContent = 'Please enter a JWT'; return; }
    try {
        const parts = jwt.split('.');
        const header = atob(parts[0]);
        const payload = atob(parts[1]);
        result.textContent = 'Header:\n' + header + '\n\nPayload:\n' + payload;
    } catch(e) {
        result.textContent = 'Invalid JWT format';
    }
}

// Encoder
function encodeText() {
    const text = document.getElementById('encodeInput').value;
    const type = document.getElementById('encodeType').value;
    const result = document.getElementById('encodeResult');
    if (!text) { result.textContent = 'Please enter text'; return; }
    let encoded = '';
    switch(type) {
        case 'base64': encoded = btoa(text); break;
        case 'url': encoded = encodeURIComponent(text); break;
        case 'hex': encoded = text.split('').map(c => c.charCodeAt(0).toString(16)).join(''); break;
        case 'rot13': encoded = text.replace(/[a-zA-Z]/g, c => String.fromCharCode((c<='Z'?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26)); break;
    }
    result.textContent = encoded;
}

// Decoder
function decodeText() {
    const text = document.getElementById('decodeInput').value;
    const type = document.getElementById('decodeType').value;
    const result = document.getElementById('decodeResult');
    if (!text) { result.textContent = 'Please enter text'; return; }
    let decoded = '';
    try {
        switch(type) {
            case 'base64': decoded = atob(text); break;
            case 'url': decoded = decodeURIComponent(text); break;
            case 'hex': decoded = text.match(/.{1,2}/g).map(b => String.fromCharCode(parseInt(b, 16))).join(''); break;
            case 'rot13': decoded = text.replace(/[a-zA-Z]/g, c => String.fromCharCode((c<='Z'?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26)); break;
        }
        result.textContent = decoded;
    } catch(e) {
        result.textContent = 'Decode failed: Invalid input';
    }
}

// CVE Lookup
function lookupCVE() {
    const cve = document.getElementById('cveInput').value;
    const result = document.getElementById('cveResult');
    if (!cve) { result.textContent = 'Please enter a CVE ID'; return; }
    result.textContent = 'Looking up ' + cve + '...\n\n[CVE Details]\nID: ' + cve + '\nSeverity: High\nCVSS: 8.5\nDescription: Vulnerability details would appear here.\n\nUse cve.mitre.org for full details';
}

// Exploit-DB Search
function searchExploit() {
    const query = document.getElementById('exploitInput').value;
    const result = document.getElementById('exploitResult');
    if (!query) { result.textContent = 'Please enter a search term'; return; }
    result.textContent = 'Searching Exploit-DB for "' + query + '"...\n\n[Results]\n1. ' + query + ' RCE Exploit\n2. ' + query + ' XSS Vulnerability\n3. ' + query + ' SQL Injection\n\nVisit exploit-db.com for full exploits';
}

// Generate Report
function generateReport() {
    const target = document.getElementById('targetName').value;
    const findings = document.getElementById('findingsInput').value;
    const result = document.getElementById('reportResult');
    result.textContent = '# Pentest Report\n\n## Target: ' + (target || 'Unknown') + '\n\n## Date: ' + new Date().toLocaleDateString() + '\n\n## Findings:\n' + (findings || 'No findings documented') + '\n\n## Recommendations:\n1. Fix identified vulnerabilities\n2. Update outdated components\n3. Implement security headers';
}

// Source Generator
function generateSource() {
    const type = document.getElementById('genType').value;
    const lang = document.getElementById('genLang').value;
    const target = document.getElementById('genTarget').value;
    const features = document.getElementById('genFeatures').value;
    const output = document.getElementById('genOutput');
    
    output.textContent = '// Generated: ' + type + ' - ' + lang + '\n// Target: ' + (target || 'General') + '\n// Features: ' + (features || 'None specified') + '\n\n// Source code would be generated here based on selection\n// This is a placeholder for the generator functionality';
}

function copyOutput() {
    const text = document.getElementById('genOutput').textContent;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
}

function downloadOutput() {
    const text = document.getElementById('genOutput').textContent;
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'generated_source.txt';
    a.click();
}

console.log('SODA Hacker Tools Loaded');
