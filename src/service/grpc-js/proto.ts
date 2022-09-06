import { loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

let proto: any;

/**
 * 获取proto
 */
export function getRpcProto(filePath: string) {
    if (!proto) {
        const packageDefinition = loadSync(filePath, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        });
        const protoDescriptor = loadPackageDefinition(packageDefinition)
        proto = protoDescriptor.rpc;
    }

    return proto;
}