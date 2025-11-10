// Mock the rate-limit module to avoid ES module issues
jest.mock('../rate-limit');

import { getClientIp } from '../rate-limit';

describe('getClientIp', () => {
  it('should extract IP from x-forwarded-for header', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '192.168.1.1');
    const ip = getClientIp(headers);
    expect(ip).toBe('192.168.1.1');
  });

  it('should extract first IP from x-forwarded-for with multiple IPs', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '192.168.1.1, 10.0.0.1, 172.16.0.1');
    const ip = getClientIp(headers);
    expect(ip).toBe('192.168.1.1');
  });

  it('should trim whitespace from IP', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '  192.168.1.1  ');
    const ip = getClientIp(headers);
    expect(ip).toBe('192.168.1.1');
  });

  it('should fall back to x-real-ip if x-forwarded-for not present', () => {
    const headers = new Headers();
    headers.set('x-real-ip', '10.0.0.1');
    const ip = getClientIp(headers);
    expect(ip).toBe('10.0.0.1');
  });

  it('should prefer x-forwarded-for over x-real-ip', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '192.168.1.1');
    headers.set('x-real-ip', '10.0.0.1');
    const ip = getClientIp(headers);
    expect(ip).toBe('192.168.1.1');
  });

  it('should return "unknown" when no headers present', () => {
    const headers = new Headers();
    const ip = getClientIp(headers);
    expect(ip).toBe('unknown');
  });

  it('should handle IPv6 addresses', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '2001:0db8:85a3:0000:0000:8a2e:0370:7334');
    const ip = getClientIp(headers);
    expect(ip).toBe('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
  });

  it('should handle IPv6 compressed addresses', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '2001:db8::1');
    const ip = getClientIp(headers);
    expect(ip).toBe('2001:db8::1');
  });

  it('should handle localhost IPv4', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '127.0.0.1');
    const ip = getClientIp(headers);
    expect(ip).toBe('127.0.0.1');
  });

  it('should handle localhost IPv6', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '::1');
    const ip = getClientIp(headers);
    expect(ip).toBe('::1');
  });

  it('should handle private network IPs', () => {
    const privateIPs = ['192.168.0.1', '10.0.0.1', '172.16.0.1'];
    privateIPs.forEach(privateIP => {
      const headers = new Headers();
      headers.set('x-forwarded-for', privateIP);
      const ip = getClientIp(headers);
      expect(ip).toBe(privateIP);
    });
  });

  it('should handle empty x-forwarded-for header', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '');
    const ip = getClientIp(headers);
    expect(ip).toBe('unknown');
  });

  it('should handle whitespace-only x-forwarded-for header', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '   ');
    const ip = getClientIp(headers);
    // Whitespace gets trimmed, empty string is falsy, falls back to 'unknown'
    expect(ip).toBe('unknown');
  });

  it('should extract first valid IP from comma-separated list with spaces', () => {
    const headers = new Headers();
    headers.set('x-forwarded-for', '192.168.1.1 , 10.0.0.1 , 172.16.0.1');
    const ip = getClientIp(headers);
    expect(ip).toBe('192.168.1.1');
  });
});
