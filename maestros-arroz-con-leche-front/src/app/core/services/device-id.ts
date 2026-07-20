import { Injectable } from '@angular/core';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceIdService {
  private visitorId: string | null = null;

  async getVisitorId(): Promise<string> {
    if (this.visitorId) {
      return this.visitorId;
    }

    const fp = await FingerprintJS.load();
    const result = await fp.get();
    this.visitorId = result.visitorId;
    return this.visitorId;
  }
}