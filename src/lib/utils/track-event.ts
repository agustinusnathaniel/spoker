interface TrackEventToUmamiArgs {
  eventData: Record<string, string | number>;
  eventName: string;
}

/**
 * umami tracker functions:
 * to tracks an event with a custom event type.
 *
 * @docs
 * https://umami.is/docs/track-events
 * https://umami.is/docs/tracker-functions
 */
export const trackEvent = ({ eventName, eventData }: TrackEventToUmamiArgs) => {
  if (window.umami && typeof window.umami.track === 'function') {
    window.umami.track(eventName, eventData);
  }
};
