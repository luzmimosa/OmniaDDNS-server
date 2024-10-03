export interface DnsRecordResponse {
    id: string;
    type: ("A" | "AAAA" | "CAA" | "CERT" | "CNAME" | "DNSKEY" | "DS" | "HTTPS" | "LOC" | "MX" | "NAPTR" | "NS" | "PTR" | "SMIMEA" | "SRV" | "SSHFP" | "SVCB" | "TLSA" | "TXT" | "URI") | string;
    name: string;
    content: string;
}