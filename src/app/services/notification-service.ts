import {
  Injectable,
  inject,
  runInInjectionContext,
  EnvironmentInjector
} from '@angular/core';

import {
  Messaging,
  getToken,
  isSupported
} from '@angular/fire/messaging';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private messaging = inject(Messaging);
  private injector = inject(EnvironmentInjector);

  async requestPermission(): Promise<string | null> {

    try {

      const supported = (await isSupported()) ?? false;

      console.log('FCM supported:', supported);

      if (!supported) {
        console.log('FCM is not supported.');
        return null;
      }

      const permission =
        await Notification.requestPermission();

      console.log(
        'Notification permission:',
        permission
      );

      if (permission !== 'granted') {
        console.log('Notification permission denied.');
        return null;
      }

      const registration =
        await navigator.serviceWorker.register(
          '/firebase-messaging-sw.js'
        );

      console.log(
        'Firebase Messaging Service Worker registered:',
        registration
      );

      await navigator.serviceWorker.ready;

      console.log(
        'Service worker is active:',
        registration.active
      );

      const token = await runInInjectionContext(
        this.injector,
        () =>
          getToken(
            this.messaging,
            {
              vapidKey:
                'BCuiR6j0CiVynnzH3_Ms1pt46bF_QjHsszkmMvAN6399OGpkoneCg2L5a-Yp0rdzzeLrqiypO2r0ik9qOe8-zOA',

              serviceWorkerRegistration:
                registration
            }
          )
      );

      console.log(
        'FCM Token:',
        token
      );

      return token || null;

    } catch (error) {

      console.error(
        'Error getting notification permission:',
        error
      );

      return null;
    }
  }
}