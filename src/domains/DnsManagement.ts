import {createARecord, requestDnsData, updateARecord} from "../cloudflare/api/CloudflareApi";
import {DnsRecordResponse} from "../cloudflare/api/ResponseModels";

const existsRecordFor = async (zoneId: string, name: string): Promise<DnsRecordResponse | false> => {
    const existingRecords = await requestDnsData(zoneId);
    return existingRecords.find(record => record.name === name) || false;
}

const createOrUpdateARecord = async (zoneId: string, name: string, content: string) => {
    const existingRecord = await existsRecordFor(zoneId, name);

    if (existingRecord) {
        return await updateARecord(zoneId, existingRecord.id, name, content);
    } else {
        return await createARecord(zoneId, name, content);
    }
}

const DnsManagement = {
    createOrUpdateARecord,
    existsRecordFor
}

export default DnsManagement;