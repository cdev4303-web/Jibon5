/**
 * Safe Browser & Mobile Notification Service
 * Prevents mobile white-screen crashes caused by:
 * 1. TypeError: Illegal constructor (Android Chrome disallows `new Notification()` in window context)
 * 2. SecurityError inside iframes or webviews
 * 3. Uncaught exceptions during permission requests
 */

export class NotificationService {
  /**
   * Safely check if Notifications are supported without throwing SecurityErrors
   */
  public static isSupported(): boolean {
    try {
      return typeof window !== 'undefined' && 'Notification' in window;
    } catch {
      return false;
    }
  }

  /**
   * Safely get the current notification permission
   */
  public static getPermission(): NotificationPermission | 'unsupported' {
    try {
      if (!this.isSupported()) return 'unsupported';
      return Notification.permission;
    } catch {
      return 'unsupported';
    }
  }

  /**
   * Request notification permission with fallback for older browsers and mobile
   */
  public static async requestPermission(): Promise<NotificationPermission | 'unsupported'> {
    try {
      if (!this.isSupported()) return 'unsupported';

      // Modern Promise-based API
      if (typeof Notification.requestPermission === 'function') {
        const result = await Notification.requestPermission();
        return result;
      }
      return 'unsupported';
    } catch (err) {
      console.warn('Notification permission request error:', err);
      return 'denied';
    }
  }

  /**
   * Send a notification safely using ServiceWorker first (required on Android Chrome),
   * falling back to standard Notification constructor.
   * NEVER throws an uncaught error.
   */
  public static async sendNotification(
    title: string,
    options?: NotificationOptions
  ): Promise<boolean> {
    try {
      if (!this.isSupported()) return false;
      if (Notification.permission !== 'granted') return false;

      // 1. Preferred modern mobile path: ServiceWorkerRegistration.showNotification
      // Android Chrome throws "Illegal constructor" if new Notification() is called in page context.
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          if (registration && typeof registration.showNotification === 'function') {
            await registration.showNotification(title, {
              badge: '/favicon.ico',
              icon: '/favicon.ico',
              ...options,
            });
            return true;
          }
        } catch (swErr) {
          console.warn('Service worker notification attempt failed:', swErr);
        }
      }

      // 2. Desktop fallback: window Notification constructor
      try {
        new Notification(title, {
          icon: '/favicon.ico',
          ...options,
        });
        return true;
      } catch (notifErr) {
        console.warn('Desktop Notification constructor unsupported or failed on mobile:', notifErr);
        return false;
      }
    } catch (err) {
      console.warn('Safe notification send error:', err);
      return false;
    }
  }
}
