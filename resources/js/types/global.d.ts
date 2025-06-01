import Echo from 'laravel-echo';
import type PusherStatic from 'pusher-js';
import { AxiosInstance } from 'axios';
import { route as ziggyRoute } from 'ziggy-js';

declare global {
  interface Window {
    axios: AxiosInstance;
    Pusher: typeof PusherStatic;
    Echo: Echo;
  }

  var route: typeof ziggyRoute;
}

export {};
