import { HttpAgent } from "@icp-sdk/core/agent";
import { useMemo } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

const BUCKET_NAME = "images";

let _clientPromise: Promise<StorageClient> | null = null;

function getStorageClientPromise(): Promise<StorageClient> {
  if (!_clientPromise) {
    _clientPromise = loadConfig().then((config) => {
      const agent = new HttpAgent({ host: config.backend_host });
      return new StorageClient(
        BUCKET_NAME,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
    });
  }
  return _clientPromise;
}

export function useStorageClient() {
  return useMemo(() => getStorageClientPromise(), []);
}

export async function uploadImage(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const client = await getStorageClientPromise();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { hash } = await client.putFile(bytes, onProgress);
  const url = await client.getDirectURL(hash);
  return url;
}
