// @flow

export type EventType = {|
  id: string,
  name: string,
  start: ?string,
  end?: ?string,
  hour?: ?string,
  color: string,
  type: 'DEFAULT' | 'INFO',
|};
